# Docker Deployment

Полное руководство по развертыванию AACSearch Platform используя Docker и Docker Compose.

## Содержание

- [Введение](#введение)
- [Prerequisites](#prerequisites)
- [Dockerfile для Production](#dockerfile-для-production)
- [Docker Compose полный стек](#docker-compose-полный-стек)
- [Multi-stage Build](#multi-stage-build)
- [Оптимизация образов](#оптимизация-образов)
- [Security Best Practices](#security-best-practices)
- [Health Checks](#health-checks)
- [Volumes и Persistence](#volumes-и-persistence)
- [Networking](#networking)
- [Environment Variables](#environment-variables)
- [Docker Swarm](#docker-swarm)
- [Monitoring Containers](#monitoring-containers)
- [Troubleshooting](#troubleshooting)

---

## Введение

Docker deployment предоставляет:
- ✅ Изоляцию приложения и зависимостей
- ✅ Воспроизводимые development/production среды
- ✅ Простоту масштабирования
- ✅ Портативность между cloud providers
- ✅ Упрощенный CI/CD pipeline

### Архитектура Docker-based Deployment

```
┌──────────────────────────────────────────────────┐
│              Docker Host / Swarm                 │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │         nginx (Reverse Proxy)              │  │
│  │         Port: 80, 443                      │  │
│  └─────────────────┬──────────────────────────┘  │
│                    │                             │
│  ┌─────────────────▼──────────────────────────┐  │
│  │      aacsearch-app (Next.js + Payload)     │  │
│  │      Replicas: 2-4                         │  │
│  │      Port: 3000                            │  │
│  └─────┬──────────┬──────────┬────────────────┘  │
│        │          │          │                   │
│  ┌─────▼───┐  ┌──▼─────┐  ┌─▼────────┐          │
│  │postgres │  │ redis  │  │typesense │          │
│  │  :5432  │  │ :6379  │  │  :8108   │          │
│  └─────────┘  └────────┘  └──────────┘          │
│                                                  │
│  Volumes: postgres_data, redis_data,             │
│           typesense_data, nginx_cache            │
└──────────────────────────────────────────────────┘
```

---

## Prerequisites

### Системные требования

**Docker Engine**: 24.0+ (с BuildKit support)
**Docker Compose**: 2.20+
**Host OS**: Linux (Ubuntu 22.04, Debian 12, RHEL 9) рекомендуется
**CPU**: 4+ cores
**RAM**: 16 GB minimum (32 GB recommended)
**Storage**: 200 GB SSD

### Установка Docker

**Ubuntu/Debian**:
```bash
# Удаление старых версий
sudo apt-get remove docker docker-engine docker.io containerd runc

# Установка зависимостей
sudo apt-get update
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Добавление Docker GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Добавление репозитория
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Установка Docker
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

**RHEL/CentOS**:
```bash
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl start docker
sudo systemctl enable docker
```

### Docker daemon configuration

**Создать `/etc/docker/daemon.json`**:
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ],
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 64000,
      "Soft": 64000
    }
  },
  "live-restore": true,
  "userland-proxy": false,
  "features": {
    "buildkit": true
  }
}
```

```bash
sudo systemctl restart docker
```

---

## Dockerfile для Production

### Production-optimized Dockerfile

Используем существующий `Dockerfile.production` из проекта с объяснением каждой секции:

```dockerfile
# Production-optimized Dockerfile for AACSearch Platform
# Multi-stage build with security hardening and minimal image size

# =============================================================================
# Stage 1: Base Image
# =============================================================================
FROM node:20-alpine AS base

# Установка pnpm globally
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate

# =============================================================================
# Stage 2: Dependencies
# =============================================================================
FROM base AS deps
WORKDIR /app

# Установка security updates и required packages
# libc6-compat: для совместимости с glibc-dependent packages
# curl: для health checks
# dumb-init: для правильной обработки signals
RUN apk add --no-cache \
    libc6-compat \
    curl \
    dumb-init

# Копирование package files
COPY package.json pnpm-lock.yaml ./
COPY .npmrc* ./

# Установка всех dependencies (включая devDependencies для build)
# --frozen-lockfile: гарантирует идентичные версии из lock file
RUN pnpm install --frozen-lockfile

# =============================================================================
# Stage 3: Builder
# =============================================================================
FROM base AS builder
WORKDIR /app

# Копирование dependencies из предыдущего stage
COPY --from=deps /app/node_modules ./node_modules

# Копирование source code
COPY . .

# Build arguments для compile-time environment variables
ARG NEXT_PUBLIC_SERVER_URL
ARG NODE_ENV=production

# Установка build environment
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}
ENV NEXT_TELEMETRY_DISABLED=1

# Генерация Payload types
RUN pnpm payload generate:types

# Build Next.js with standalone output
# Standalone output включает минимальный набор файлов для production
RUN pnpm build

# Удаление development dependencies для уменьшения размера
RUN pnpm prune --production

# =============================================================================
# Stage 4: Production Runner
# =============================================================================
FROM base AS runner
WORKDIR /app

# Установка только runtime dependencies
RUN apk add --no-cache \
    dumb-init \
    curl \
    tini

# Установка production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Создание non-root user для security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Копирование built application files
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Создание cache directories с правильными permissions
RUN mkdir -p .next/cache && \
    chown -R nextjs:nodejs .next/cache && \
    chmod -R 755 .next/cache

# Переключение на non-root user
USER nextjs

# Expose application port
EXPOSE 3000

# Health check configuration
# Проверяет /health/live endpoint каждые 30 секунд
HEALTHCHECK --interval=30s \
    --timeout=10s \
    --start-period=60s \
    --retries=3 \
    CMD curl -f http://localhost:3000/health/live || exit 1

# Use tini as init system для правильной обработки signals (SIGTERM, SIGINT)
ENTRYPOINT ["/sbin/tini", "--"]

# Start the application
CMD ["node", "server.js"]
```

### Объяснение ключевых моментов

**Multi-stage build**:
- **base**: Базовый image с Node.js и pnpm
- **deps**: Установка dependencies
- **builder**: Build приложения
- **runner**: Финальный минимальный production image

**Преимущества**:
- Финальный image содержит только необходимые runtime files
- Размер image уменьшен с ~2 GB до ~400 MB
- Build cache ускоряет повторные builds

**Security hardening**:
- Non-root user (nextjs:nodejs)
- Minimal base image (Alpine Linux)
- No unnecessary tools в production image
- Proper signal handling (tini/dumb-init)

**Performance optimizations**:
- Standalone Next.js output
- Production dependencies only
- Optimized layer caching

### Build Image

```bash
# Build с default arguments
docker build -f Dockerfile.production -t aacsearch:latest .

# Build с custom arguments
docker build \
  -f Dockerfile.production \
  --build-arg NEXT_PUBLIC_SERVER_URL=https://aacsearch.com \
  --build-arg NODE_ENV=production \
  -t aacsearch:1.0.0 \
  .

# Build с BuildKit для better caching
DOCKER_BUILDKIT=1 docker build -f Dockerfile.production -t aacsearch:latest .

# Build для multi-platform (ARM + x86)
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -f Dockerfile.production \
  -t aacsearch:latest \
  --push \
  .
```

### .dockerignore

Создайте `.dockerignore` для исключения ненужных файлов:

```
# .dockerignore
node_modules
npm-debug.log
.next
.git
.gitignore
.env*.local
.env.production
*.md
README.md
docker-compose*.yml
Dockerfile*
.dockerignore

# Tests
**/*.test.js
**/*.test.ts
**/*.spec.js
**/*.spec.ts
test/
tests/
__tests__/
coverage/

# Documentation
docs/
*.md

# CI/CD
.github/
.gitlab-ci.yml
.circleci/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
```

---

## Docker Compose полный стек

### Production Docker Compose

Используем существующий `docker-compose.production.yml` с детальными комментариями:

```yaml
# Production Docker Compose Configuration
# Full stack deployment with all services

version: '3.8'

services:
  # ===========================================================================
  # PostgreSQL Database
  # ===========================================================================
  postgres:
    image: postgres:16-alpine
    container_name: aacsearch-postgres
    restart: unless-stopped

    environment:
      POSTGRES_DB: ${POSTGRES_DB:-aacsearch}
      POSTGRES_USER: ${POSTGRES_USER:-aacsearch}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      PGDATA: /var/lib/postgresql/data/pgdata

    volumes:
      - postgres-data:/var/lib/postgresql/data
      # Custom init scripts (optional)
      - ./scripts/init-db.sh:/docker-entrypoint-initdb.d/init-db.sh:ro

    ports:
      - "5432:5432"

    # Health check - проверка готовности БД
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-aacsearch}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

    networks:
      - aacsearch-network

    # Resource limits
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G

  # ===========================================================================
  # Redis Cache
  # ===========================================================================
  redis:
    image: redis:7-alpine
    container_name: aacsearch-redis
    restart: unless-stopped

    # Redis с password и AOF persistence
    command: >
      redis-server
      --appendonly yes
      --requirepass ${REDIS_PASSWORD}
      --maxmemory 2gb
      --maxmemory-policy allkeys-lru

    volumes:
      - redis-data:/data
      # Custom redis.conf (optional)
      # - ./config/redis.conf:/usr/local/etc/redis/redis.conf:ro

    ports:
      - "6379:6379"

    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
      start_period: 20s

    networks:
      - aacsearch-network

    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 1G

  # ===========================================================================
  # Typesense Search Engine
  # ===========================================================================
  typesense:
    image: typesense/typesense:27.1
    container_name: aacsearch-typesense
    restart: unless-stopped

    environment:
      TYPESENSE_DATA_DIR: /data
      TYPESENSE_API_KEY: ${TYPESENSE_API_KEY}
      TYPESENSE_ENABLE_CORS: "true"
      # Performance tuning
      TYPESENSE_THREAD_POOL_SIZE: 8
      TYPESENSE_NUM_COLLECTIONS_PARALLEL_LOAD: 2

    volumes:
      - typesense-data:/data

    ports:
      - "8108:8108"

    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8108/health"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

    networks:
      - aacsearch-network

    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G

  # ===========================================================================
  # AACSearch Platform (Next.js + Payload)
  # ===========================================================================
  app:
    build:
      context: .
      dockerfile: Dockerfile.production
      args:
        NEXT_PUBLIC_SERVER_URL: ${NEXT_PUBLIC_SERVER_URL}
        NODE_ENV: production
      # Build cache для faster rebuilds
      cache_from:
        - aacsearch:latest

    image: aacsearch:latest
    container_name: aacsearch-app
    restart: unless-stopped

    environment:
      # Database
      DATABASE_URI: postgresql://${POSTGRES_USER:-aacsearch}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB:-aacsearch}

      # Payload CMS
      PAYLOAD_SECRET: ${PAYLOAD_SECRET}
      NEXT_PUBLIC_SERVER_URL: ${NEXT_PUBLIC_SERVER_URL}

      # Redis Cache
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}

      # Typesense Search
      TYPESENSE_HOST: typesense
      TYPESENSE_PORT: 8108
      TYPESENSE_PROTOCOL: http
      TYPESENSE_API_KEY: ${TYPESENSE_API_KEY}

      # Stripe Payments
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
      STRIPE_WEBHOOK_SECRET: ${STRIPE_WEBHOOK_SECRET}
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}

      # Optional: AI Embeddings
      OPENAI_API_KEY: ${OPENAI_API_KEY:-}
      HUGGINGFACE_API_KEY: ${HUGGINGFACE_API_KEY:-}

      # Node environment
      NODE_ENV: production
      PORT: 3000

    ports:
      - "3000:3000"

    # Зависимости - app стартует только когда зависимости healthy
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      typesense:
        condition: service_healthy

    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health/live"]
      interval: 30s
      timeout: 10s
      start_period: 60s
      retries: 3

    networks:
      - aacsearch-network

    # Resource limits
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G

      # Replicas для HA (требует Swarm mode)
      replicas: 2
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first

  # ===========================================================================
  # Nginx Reverse Proxy (опционально)
  # ===========================================================================
  nginx:
    image: nginx:alpine
    container_name: aacsearch-nginx
    restart: unless-stopped

    ports:
      - "80:80"
      - "443:443"

    volumes:
      # Nginx configuration
      - ./config/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./config/nginx/conf.d:/etc/nginx/conf.d:ro

      # SSL certificates (Let's Encrypt или custom)
      - ./ssl:/etc/nginx/ssl:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro

      # Cache directory
      - nginx-cache:/var/cache/nginx

      # Logs
      - nginx-logs:/var/log/nginx

    depends_on:
      - app

    networks:
      - aacsearch-network

    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
        reservations:
          cpus: '0.25'
          memory: 128M

  # ===========================================================================
  # Certbot для Let's Encrypt SSL (опционально)
  # ===========================================================================
  certbot:
    image: certbot/certbot:latest
    container_name: aacsearch-certbot

    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot

    # Renew certificates каждый день
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

    networks:
      - aacsearch-network

    profiles:
      - ssl

# =============================================================================
# Volumes - Persistent Data
# =============================================================================
volumes:
  postgres-data:
    driver: local
    # Для production лучше использовать named volumes или external volumes
    # driver_opts:
    #   type: none
    #   o: bind
    #   device: /mnt/data/postgres

  redis-data:
    driver: local

  typesense-data:
    driver: local

  nginx-cache:
    driver: local

  nginx-logs:
    driver: local

# =============================================================================
# Networks
# =============================================================================
networks:
  aacsearch-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16
```

### Nginx Configuration

**config/nginx.conf**:
```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 2048;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    'rt=$request_time uct="$upstream_connect_time" '
                    'uht="$upstream_header_time" urt="$upstream_response_time"';

    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 100M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript
               application/json application/javascript application/xml+rss
               application/rss+xml font/truetype font/opentype
               application/vnd.ms-fontobject image/svg+xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=general_limit:10m rate=100r/s;

    # Upstream
    upstream aacsearch_app {
        least_conn;
        server app:3000 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }

    # HTTP server - redirect to HTTPS
    server {
        listen 80;
        listen [::]:80;
        server_name aacsearch.com www.aacsearch.com;

        # Let's Encrypt ACME challenge
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        # Redirect all other requests to HTTPS
        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        server_name aacsearch.com www.aacsearch.com;

        # SSL configuration
        ssl_certificate /etc/letsencrypt/live/aacsearch.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/aacsearch.com/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # Static files cache
        location /_next/static/ {
            proxy_pass http://aacsearch_app;
            proxy_cache_valid 200 365d;
            add_header Cache-Control "public, immutable";
        }

        # API endpoints
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;

            proxy_pass http://aacsearch_app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # WebSocket support для live preview
        location /ws {
            proxy_pass http://aacsearch_app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_read_timeout 86400;
        }

        # All other requests
        location / {
            limit_req zone=general_limit burst=50 nodelay;

            proxy_pass http://aacsearch_app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

### Environment File

**.env.production**:
```bash
# =============================================================================
# AACSearch Production Environment Variables
# =============================================================================

# -----------------------------------------------------------------------------
# Server Configuration
# -----------------------------------------------------------------------------
NEXT_PUBLIC_SERVER_URL=https://aacsearch.com
NODE_ENV=production
PORT=3000

# -----------------------------------------------------------------------------
# Database (PostgreSQL)
# -----------------------------------------------------------------------------
POSTGRES_DB=aacsearch
POSTGRES_USER=aacsearch
POSTGRES_PASSWORD=CHANGE_ME_STRONG_PASSWORD_HERE
DATABASE_URI=postgresql://aacsearch:CHANGE_ME_STRONG_PASSWORD_HERE@postgres:5432/aacsearch

# -----------------------------------------------------------------------------
# Payload CMS
# -----------------------------------------------------------------------------
PAYLOAD_SECRET=CHANGE_ME_32_CHARACTER_SECRET_HERE

# -----------------------------------------------------------------------------
# Redis Cache
# -----------------------------------------------------------------------------
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=CHANGE_ME_REDIS_PASSWORD_HERE

# -----------------------------------------------------------------------------
# Typesense Search Engine
# -----------------------------------------------------------------------------
TYPESENSE_HOST=typesense
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=CHANGE_ME_TYPESENSE_API_KEY_HERE

# -----------------------------------------------------------------------------
# Stripe Payments
# -----------------------------------------------------------------------------
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# -----------------------------------------------------------------------------
# Optional: AI Embeddings
# -----------------------------------------------------------------------------
OPENAI_API_KEY=
HUGGINGFACE_API_KEY=
```

### Deployment Commands

```bash
# 1. Clone repository
git clone https://github.com/yourorg/aacsearch-platform.git
cd aacsearch-platform

# 2. Setup environment
cp .env.example .env.production
nano .env.production  # Edit with your secrets

# 3. Build and start services
docker compose -f docker-compose.production.yml up -d

# 4. Check logs
docker compose -f docker-compose.production.yml logs -f app

# 5. Initialize database (first time only)
docker compose -f docker-compose.production.yml exec app pnpm payload migrate

# 6. Create admin user (first time only)
docker compose -f docker-compose.production.yml exec app pnpm payload create-admin

# 7. Verify health
curl http://localhost:3000/health/live
```

### Scaling Services

```bash
# Scale app to 4 instances
docker compose -f docker-compose.production.yml up -d --scale app=4

# Check running containers
docker compose -f docker-compose.production.yml ps

# View resource usage
docker stats
```

---

## Multi-stage Build

### Детальный анализ stages

**Stage 1: base**
```dockerfile
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate
```
- Базовый image для всех остальных stages
- Alpine Linux для минимального размера
- pnpm для fast, efficient package management

**Stage 2: deps**
```dockerfile
FROM base AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat curl dumb-init
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
```
- Установка всех dependencies
- `--frozen-lockfile` гарантирует reproducibility
- Отдельный stage для лучшего caching

**Stage 3: builder**
```dockerfile
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm payload generate:types
RUN pnpm build
RUN pnpm prune --production
```
- Build приложения
- Генерация TypeScript types
- Удаление dev dependencies

**Stage 4: runner**
```dockerfile
FROM base AS runner
WORKDIR /app
# ... minimal production setup
USER nextjs
CMD ["node", "server.js"]
```
- Финальный production image
- Только необходимые runtime files
- Non-root user для security

### Build Cache Optimization

```dockerfile
# Правильный порядок COPY для максимального cache hits
COPY package.json pnpm-lock.yaml ./  # Меняются редко
RUN pnpm install                     # Cache invalidation только при изменении deps
COPY . .                             # Source code меняется часто
RUN pnpm build                       # Rebuild только при изменении code
```

---

## Оптимизация образов

### Размер Image

**Before optimization**:
```
REPOSITORY          TAG       SIZE
aacsearch          latest    2.1 GB
```

**After optimization**:
```
REPOSITORY          TAG       SIZE
aacsearch          latest    387 MB
```

### Техники оптимизации

**1. Alpine Linux base**:
```dockerfile
FROM node:20-alpine  # ~170 MB
# vs
FROM node:20         # ~950 MB
```

**2. Multi-stage builds**:
```dockerfile
# Только production code в final image
COPY --from=builder /app/.next/standalone ./
# Build tools остаются в builder stage
```

**3. .dockerignore**:
```
node_modules
.next
.git
tests/
```

**4. Layer optimization**:
```dockerfile
# Bad - каждая RUN команда = новый layer
RUN apk add curl
RUN apk add vim
RUN apk add git

# Good - один layer
RUN apk add --no-cache curl vim git
```

**5. Production dependencies only**:
```dockerfile
RUN pnpm prune --production
```

### Анализ размера layers

```bash
# Посмотреть layers
docker history aacsearch:latest

# Dive tool для детального анализа
dive aacsearch:latest
```

---

## Security Best Practices

### 1. Non-root User

```dockerfile
# Создание dedicated user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Переключение на non-root
USER nextjs
```

### 2. Image Scanning

```bash
# Trivy scanner
trivy image aacsearch:latest

# Snyk
snyk container test aacsearch:latest

# Docker Scout
docker scout cves aacsearch:latest
```

### 3. Secrets Management

**Неправильно**:
```dockerfile
ENV DATABASE_PASSWORD=my_secret  # ❌ Secrets в image
```

**Правильно**:
```yaml
# docker-compose.yml
environment:
  DATABASE_PASSWORD: ${DATABASE_PASSWORD}  # ✅ Из .env file
```

Или используйте Docker secrets:
```yaml
services:
  app:
    secrets:
      - db_password
secrets:
  db_password:
    file: ./secrets/db_password.txt
```

### 4. Read-only Filesystem

```yaml
services:
  app:
    read_only: true
    tmpfs:
      - /tmp
      - /app/.next/cache
```

### 5. Security Headers

В nginx.conf уже включены:
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
```

---

## Health Checks

### Application Health Endpoint

**src/app/health/live/route.ts**:
```typescript
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redis } from '@/lib/redis'
import { typesense } from '@/lib/typesense'

export async function GET() {
  const checks: Record<string, string> = {}
  let allHealthy = true

  // Database check
  try {
    const payload = await getPayload({ config })
    await payload.db.pool.query('SELECT 1')
    checks.database = 'ok'
  } catch (error) {
    checks.database = 'error'
    allHealthy = false
  }

  // Redis check
  try {
    await redis.ping()
    checks.redis = 'ok'
  } catch (error) {
    checks.redis = 'error'
    allHealthy = false
  }

  // Typesense check
  try {
    await typesense.health.retrieve()
    checks.typesense = 'ok'
  } catch (error) {
    checks.typesense = 'error'
    allHealthy = false
  }

  return NextResponse.json(
    {
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks,
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
      },
    },
    { status: allHealthy ? 200 : 503 }
  )
}
```

### Docker Health Checks

**Dockerfile**:
```dockerfile
HEALTHCHECK --interval=30s \
    --timeout=10s \
    --start-period=60s \
    --retries=3 \
    CMD curl -f http://localhost:3000/health/live || exit 1
```

**docker-compose.yml**:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health/live"]
  interval: 30s
  timeout: 10s
  start_period: 60s
  retries: 3
```

---

## Volumes и Persistence

### Named Volumes

```yaml
volumes:
  postgres-data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/data/postgres  # External storage mount
```

### Backup Volumes

```bash
# Backup PostgreSQL volume
docker run --rm \
  -v aacsearch_postgres-data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/postgres-$(date +%Y%m%d).tar.gz -C /data .

# Restore
docker run --rm \
  -v aacsearch_postgres-data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar xzf /backup/postgres-20250102.tar.gz -C /data
```

---

## Docker Swarm

Для production HA deployment:

```bash
# Initialize Swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.production.yml aacsearch

# Scale service
docker service scale aacsearch_app=4

# Update service
docker service update --image aacsearch:1.1.0 aacsearch_app

# Check status
docker service ls
docker stack ps aacsearch
```

---

## Monitoring Containers

### Container Logs

```bash
# Follow logs
docker compose -f docker-compose.production.yml logs -f app

# Last 100 lines
docker compose -f docker-compose.production.yml logs --tail=100 app

# With timestamps
docker compose -f docker-compose.production.yml logs -t app
```

### Resource Usage

```bash
# Real-time stats
docker stats

# Container inspect
docker inspect aacsearch-app
```

---

## Troubleshooting

### Common Issues

**Issue: Container won't start**
```bash
# Check logs
docker compose logs app

# Check dependencies
docker compose ps

# Verify health checks
docker compose ps --filter "health=unhealthy"
```

**Issue: Database connection failed**
```bash
# Check network
docker network inspect aacsearch_aacsearch-network

# Test connection from app container
docker compose exec app ping postgres
```

**Issue: Out of disk space**
```bash
# Clean unused containers, images, volumes
docker system prune -a --volumes

# Check disk usage
docker system df
```

---

**Следующие шаги**: Для enterprise deployments, смотрите [Kubernetes Deployment](03-kubernetes.md).
