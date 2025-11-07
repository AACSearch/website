# Требования к инфраструктуре

Детальное руководство по планированию и настройке инфраструктуры для production развертывания AACSearch Platform.

## Содержание

- [Обзор архитектуры](#обзор-архитектуры)
- [Минимальные требования](#минимальные-требования)
- [Рекомендуемые требования](#рекомендуемые-требования)
- [Application Servers](#application-servers)
- [Database Infrastructure](#database-infrastructure)
- [Search Engine Infrastructure](#search-engine-infrastructure)
- [Cache Infrastructure](#cache-infrastructure)
- [Storage Infrastructure](#storage-infrastructure)
- [Network Infrastructure](#network-infrastructure)
- [Load Balancing](#load-balancing)
- [CDN Configuration](#cdn-configuration)
- [Мониторинг инфраструктуры](#мониторинг-инфраструктуры)
- [Backup Infrastructure](#backup-infrastructure)
- [Disaster Recovery](#disaster-recovery)
- [Планирование мощностей](#планирование-мощностей)

---

## Обзор архитектуры

AACSearch Platform - это multi-tenant SaaS приложение с высокими требованиями к производительности и доступности. Архитектура построена на принципах:

- **High Availability (HA)**: отказоустойчивость на всех уровнях
- **Horizontal Scalability**: возможность масштабирования путем добавления узлов
- **Data Isolation**: изоляция данных между tenants
- **Performance**: быстрые ответы и низкие задержки
- **Security**: защита данных и соответствие стандартам

### Основные компоненты

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                            │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                      CDN Layer                              │
│              (CloudFlare / AWS CloudFront)                  │
│         DDoS Protection, WAF, SSL Termination               │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                   Load Balancer Layer                       │
│           (ALB / nginx / HAProxy / Traefik)                 │
│       Health Checks, SSL/TLS, Rate Limiting                 │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌──────▼─────────┐
│ App Server 1   │  │ App Server 2   │  │ App Server N   │
│  Next.js +     │  │  Next.js +     │  │  Next.js +     │
│  Payload CMS   │  │  Payload CMS   │  │  Payload CMS   │
│  Node.js 20+   │  │  Node.js 20+   │  │  Node.js 20+   │
└───────┬────────┘  └───────┬────────┘  └────────┬───────┘
        │                   │                     │
        └───────────────────┼─────────────────────┘
                            │
        ┌───────────────────┼───────────────────┬──────────────┐
        │                   │                   │              │
┌───────▼────────┐  ┌───────▼────────┐  ┌──────▼──────┐  ┌───▼────────┐
│  PostgreSQL    │  │     Redis      │  │ Typesense   │  │  Storage   │
│   Cluster      │  │    Cluster     │  │  Cluster    │  │   (S3)     │
│                │  │                │  │             │  │            │
│  Primary +     │  │  Master +      │  │  5 Nodes    │  │  Media     │
│  2 Replicas    │  │  2 Replicas    │  │  (HA mode)  │  │  Backups   │
└────────────────┘  └────────────────┘  └─────────────┘  └────────────┘
```

---

## Минимальные требования

Минимальная конфигурация для production развертывания (поддержка до 1,000 активных tenants и 10,000 concurrent users).

### Application Servers

**Количество**: 2 instance (минимум для HA)

**Спецификация на instance**:
- **CPU**: 4 cores (vCPU)
- **RAM**: 8 GB
- **Storage**: 50 GB SSD (для logs, cache, temporary files)
- **Network**: 1 Gbps

**Рекомендуемые типы instance**:
- AWS: `t3.xlarge` или `c6i.xlarge`
- GCP: `n2-standard-4` или `c2-standard-4`
- Azure: `Standard_D4s_v3` или `Standard_F4s_v2`
- DigitalOcean: `c-4` (CPU-Optimized)

### Database (PostgreSQL)

**Primary Database**:
- **CPU**: 4 cores
- **RAM**: 16 GB (для query cache и connections)
- **Storage**: 200 GB SSD (IOPS: 3000+)
- **Network**: 10 Gbps (low latency)

**Read Replica**: 1 instance (та же конфигурация)

**Рекомендуемые сервисы**:
- AWS RDS PostgreSQL (db.r6g.xlarge)
- GCP Cloud SQL (db-custom-4-16384)
- Azure Database for PostgreSQL (General Purpose, 4 vCores)
- DigitalOcean Managed PostgreSQL (4 GB RAM, 2 vCPUs)

### Search Engine (Typesense)

**Cluster configuration**: 3 nodes (минимум для HA)

**Спецификация на node**:
- **CPU**: 2 cores
- **RAM**: 4 GB (для индексов в памяти)
- **Storage**: 50 GB SSD
- **Network**: 1 Gbps

**Рекомендуемые типы**:
- AWS: `t3.medium`
- GCP: `n2-standard-2`
- Azure: `Standard_D2s_v3`
- DigitalOcean: `s-2vcpu-4gb`

### Cache (Redis)

**Configuration**: Master + 1 Replica

**Спецификация**:
- **CPU**: 2 cores
- **RAM**: 4 GB
- **Storage**: 20 GB (для persistence)
- **Network**: 10 Gbps

**Рекомендуемые сервисы**:
- AWS ElastiCache (cache.r6g.large)
- GCP Memorystore (M2, 4 GB)
- Azure Cache for Redis (Standard C2)
- DigitalOcean Managed Redis (2 GB)

### Load Balancer

**Type**: Managed Load Balancer или dedicated nginx instance

**Спецификация (если self-hosted)**:
- **CPU**: 2 cores
- **RAM**: 4 GB
- **Network**: 10 Gbps

**Managed опции**:
- AWS Application Load Balancer (ALB)
- GCP Cloud Load Balancing
- Azure Load Balancer
- DigitalOcean Load Balancer

### Storage

**Object Storage**: S3-compatible для media files и backups

**Требования**:
- **Capacity**: 100 GB initial (scalable)
- **IOPS**: Standard (не требуется высокий IOPS)
- **Redundancy**: Multi-AZ или equivalent

**Опции**:
- AWS S3 (Standard tier)
- GCP Cloud Storage (Standard)
- Azure Blob Storage (Hot tier)
- DigitalOcean Spaces
- Cloudflare R2 (zero egress fees)

### Network Bandwidth

**Aggregate**: 100 Mbps minimum (symmetrical)

**Per component**:
- Application servers: 1 Gbps each
- Database: 10 Gbps (low latency critical)
- Cache: 10 Gbps
- Search: 1 Gbps each node

### Summary: Минимальная конфигурация

| Компонент | Количество | CPU | RAM | Storage | Ежемесячная стоимость (AWS) |
|-----------|------------|-----|-----|---------|---------------------------|
| App Servers | 2 | 4 cores each | 8 GB each | 50 GB each | $140 × 2 = $280 |
| PostgreSQL | 1 + 1 replica | 4 cores | 16 GB | 200 GB | $350 |
| Typesense | 3 nodes | 2 cores each | 4 GB each | 50 GB each | $40 × 3 = $120 |
| Redis | 1 + 1 replica | 2 cores | 4 GB | 20 GB | $150 |
| Load Balancer | 1 | - | - | - | $20 |
| Storage (S3) | - | - | - | 100 GB | $3 |
| **Total** | | | | | **~$923/month** |

*Примечание: цены приблизительные, актуальны на 2025 год*

---

## Рекомендуемые требования

Рекомендуемая конфигурация для production с запасом мощности (поддержка до 10,000 tenants и 100,000 concurrent users).

### Application Servers

**Количество**: 4+ instances (с auto-scaling до 12+)

**Спецификация на instance**:
- **CPU**: 8 cores (vCPU)
- **RAM**: 16 GB
- **Storage**: 100 GB SSD (NVMe preferred)
- **Network**: 10 Gbps

**Рекомендуемые типы**:
- AWS: `c6i.2xlarge` или `m6i.2xlarge`
- GCP: `c2-standard-8` или `n2-standard-8`
- Azure: `Standard_F8s_v2` или `Standard_D8s_v3`
- DigitalOcean: `c-8` (CPU-Optimized)

**Auto-scaling policy**:
```yaml
min_instances: 4
max_instances: 12
target_cpu_utilization: 70%
target_memory_utilization: 80%
scale_up_cooldown: 180s
scale_down_cooldown: 300s
```

### Database (PostgreSQL)

**Primary Database**:
- **CPU**: 8 cores
- **RAM**: 32 GB
- **Storage**: 500 GB SSD (IOPS: 10000+, Provisioned IOPS)
- **Network**: 25 Gbps
- **Connection pooling**: PgBouncer (500 max connections)

**Read Replicas**: 2 instances (та же конфигурация)

**Configuration parameters**:
```ini
# postgresql.conf recommendations
max_connections = 500
shared_buffers = 8GB
effective_cache_size = 24GB
maintenance_work_mem = 2GB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1  # for SSD
effective_io_concurrency = 200
work_mem = 16MB
min_wal_size = 2GB
max_wal_size = 8GB
max_worker_processes = 8
max_parallel_workers_per_gather = 4
max_parallel_workers = 8
```

**Рекомендуемые сервисы**:
- AWS RDS PostgreSQL (db.r6g.2xlarge) + Multi-AZ
- GCP Cloud SQL (db-custom-8-32768) + HA
- Azure Database for PostgreSQL (General Purpose, 8 vCores)

### Search Engine (Typesense)

**Cluster configuration**: 5 nodes (HA с quorum)

**Спецификация на node**:
- **CPU**: 4 cores
- **RAM**: 8 GB
- **Storage**: 100 GB SSD (NVMe)
- **Network**: 10 Gbps

**Cluster configuration**:
```yaml
nodes: 5
replication_factor: 3
quorum: 3
node_roles:
  - data (3 nodes)
  - coordinator (2 nodes)
sharding: enabled
max_memory_ratio: 0.7
```

**Рекомендуемые типы**:
- AWS: `c6i.xlarge`
- GCP: `c2-standard-4`
- Azure: `Standard_F4s_v2`
- DigitalOcean: `c-4`

### Cache (Redis)

**Configuration**: Redis Cluster (3 masters + 3 replicas)

**Спецификация на node**:
- **CPU**: 4 cores
- **RAM**: 8 GB
- **Storage**: 50 GB SSD (для RDB/AOF persistence)
- **Network**: 25 Gbps

**Cluster configuration**:
```redis
# redis.conf
cluster-enabled yes
cluster-node-timeout 5000
cluster-replica-validity-factor 0
cluster-migration-barrier 1

maxmemory 7gb
maxmemory-policy allkeys-lru

appendonly yes
appendfsync everysec

save 900 1
save 300 10
save 60 10000

tcp-backlog 511
tcp-keepalive 300
```

**Рекомендуемые сервисы**:
- AWS ElastiCache Redis Cluster (cache.r6g.xlarge × 6)
- GCP Memorystore (M4, 8 GB) + HA
- Azure Cache for Redis (Premium P1)

### Load Balancer

**Type**: Managed ALB/NLB с auto-scaling

**Features required**:
- SSL/TLS termination (TLS 1.3)
- HTTP/2 и HTTP/3 support
- WebSocket support
- Health checks (interval: 10s)
- Connection draining (300s)
- Sticky sessions (cookie-based)
- Request rate limiting

**Configuration example (AWS ALB)**:
```yaml
listeners:
  - port: 80
    protocol: HTTP
    default_action: redirect_to_https

  - port: 443
    protocol: HTTPS
    ssl_policy: ELBSecurityPolicy-TLS13-1-2-2021-06
    certificates:
      - arn: arn:aws:acm:...
    default_action: forward_to_target_group

target_groups:
  - name: aacsearch-app
    port: 3000
    protocol: HTTP
    health_check:
      path: /health/live
      interval: 10
      timeout: 5
      healthy_threshold: 2
      unhealthy_threshold: 3
    stickiness:
      enabled: true
      duration: 3600
```

### CDN

**Provider**: CloudFlare (рекомендуется) или AWS CloudFront

**Configuration**:
- **PoPs**: Global (200+ locations)
- **Cache**: Aggressive для static assets
- **Compression**: Brotli + Gzip
- **HTTP/3**: Enabled
- **Early Hints**: Enabled

**CloudFlare settings**:
```yaml
security:
  waf: enabled
  ddos_protection: enabled
  rate_limiting: enabled (10,000 requests/min per IP)
  bot_fight_mode: enabled

performance:
  auto_minify: [html, css, js]
  rocket_loader: off  # конфликтует с React
  mirage: enabled
  polish: enabled
  early_hints: enabled

caching:
  browser_cache_ttl: 3600
  edge_cache_ttl: 86400
  always_online: enabled
  development_mode: off
```

**CloudFront configuration** (alternative):
```yaml
distributions:
  - domain: aacsearch.com
    price_class: PriceClass_All
    default_cache_behavior:
      viewer_protocol_policy: redirect-to-https
      compress: true
      min_ttl: 0
      default_ttl: 86400
      max_ttl: 31536000

    cache_behaviors:
      - path_pattern: "/_next/static/*"
        ttl: 31536000
        compress: true

      - path_pattern: "/api/*"
        ttl: 0
        compress: false

    origins:
      - domain_name: alb.aacsearch.com
        custom_headers:
          - X-CDN-Source: CloudFront
```

### Storage

**Primary Storage**: S3 для media, backups, logs

**Configuration**:
- **Capacity**: 1 TB initial (auto-scaling)
- **Redundancy**: Multi-region replication
- **Versioning**: Enabled (для backups)
- **Lifecycle policies**: Enabled

**S3 Bucket structure**:
```
s3://aacsearch-production/
├── media/
│   ├── tenants/
│   │   └── {tenant_id}/
│   │       ├── images/
│   │       ├── documents/
│   │       └── videos/
├── backups/
│   ├── database/
│   │   └── {date}/
│   ├── search-indices/
│   │   └── {date}/
│   └── redis-snapshots/
│       └── {date}/
└── logs/
    ├── application/
    ├── access/
    └── error/
```

**Lifecycle policies**:
```yaml
- id: transition-to-glacier
  status: Enabled
  filter:
    prefix: backups/
  transitions:
    - days: 30
      storage_class: STANDARD_IA
    - days: 90
      storage_class: GLACIER
  expiration:
    days: 365

- id: delete-old-logs
  status: Enabled
  filter:
    prefix: logs/
  expiration:
    days: 90
```

### Network Infrastructure

**VPC Configuration**:
```
VPC CIDR: 10.0.0.0/16

Subnets:
- Public Subnets (Load Balancers, NAT Gateways):
  - 10.0.1.0/24 (AZ-a)
  - 10.0.2.0/24 (AZ-b)
  - 10.0.3.0/24 (AZ-c)

- Private Subnets (Application Servers):
  - 10.0.10.0/24 (AZ-a)
  - 10.0.11.0/24 (AZ-b)
  - 10.0.12.0/24 (AZ-c)

- Database Subnets:
  - 10.0.20.0/24 (AZ-a)
  - 10.0.21.0/24 (AZ-b)
  - 10.0.22.0/24 (AZ-c)

- Management Subnet (Bastion):
  - 10.0.100.0/24 (AZ-a)
```

**Security Groups**:

```yaml
# ALB Security Group
alb_sg:
  ingress:
    - port: 80
      protocol: tcp
      cidr: 0.0.0.0/0
    - port: 443
      protocol: tcp
      cidr: 0.0.0.0/0
  egress:
    - port: 3000
      protocol: tcp
      destination: app_sg

# Application Security Group
app_sg:
  ingress:
    - port: 3000
      protocol: tcp
      source: alb_sg
    - port: 22
      protocol: tcp
      source: bastion_sg
  egress:
    - port: 5432
      protocol: tcp
      destination: db_sg
    - port: 6379
      protocol: tcp
      destination: cache_sg
    - port: 8108
      protocol: tcp
      destination: search_sg
    - port: 443
      protocol: tcp
      cidr: 0.0.0.0/0  # для external APIs

# Database Security Group
db_sg:
  ingress:
    - port: 5432
      protocol: tcp
      source: app_sg
    - port: 5432
      protocol: tcp
      source: bastion_sg
  egress: []  # no outbound required

# Cache Security Group
cache_sg:
  ingress:
    - port: 6379
      protocol: tcp
      source: app_sg
  egress: []

# Search Security Group
search_sg:
  ingress:
    - port: 8108
      protocol: tcp
      source: app_sg
  egress: []

# Bastion Security Group
bastion_sg:
  ingress:
    - port: 22
      protocol: tcp
      cidr: [YOUR_OFFICE_IP]/32
  egress:
    - port: 22
      protocol: tcp
      destination: app_sg
    - port: 5432
      protocol: tcp
      destination: db_sg
```

### Summary: Рекомендуемая конфигурация

| Компонент | Количество | CPU | RAM | Storage | Ежемесячная стоимость (AWS) |
|-----------|------------|-----|-----|---------|---------------------------|
| App Servers | 4-12 (avg 6) | 8 cores each | 16 GB each | 100 GB each | $280 × 6 = $1,680 |
| PostgreSQL | 1 + 2 replicas | 8 cores | 32 GB | 500 GB | $1,200 |
| Typesense | 5 nodes | 4 cores each | 8 GB each | 100 GB each | $140 × 5 = $700 |
| Redis Cluster | 6 nodes | 4 cores each | 8 GB each | 50 GB each | $180 × 6 = $1,080 |
| Load Balancer | 1 ALB | - | - | - | $50 |
| CloudFlare CDN | - | - | - | - | $200 |
| Storage (S3) | - | - | - | 1 TB | $23 |
| Backup Storage | - | - | - | 2 TB | $40 |
| Data Transfer | - | - | - | 5 TB/mo | $450 |
| **Total** | | | | | **~$5,423/month** |

---

## Application Servers

### Sizing Guidelines

**По количеству tenants**:
- 1-100 tenants: 2 instances
- 100-1000 tenants: 4 instances
- 1000-5000 tenants: 8 instances
- 5000+ tenants: 12+ instances

**По concurrent users**:
- До 10K users: 2-4 instances
- 10K-50K users: 4-8 instances
- 50K-100K users: 8-16 instances
- 100K+ users: 16+ instances

### Auto-scaling Configuration

**CloudWatch Alarms (AWS)**:
```yaml
alarms:
  - name: HighCPU
    metric: CPUUtilization
    threshold: 70
    period: 60
    evaluation_periods: 2
    action: scale_up

  - name: LowCPU
    metric: CPUUtilization
    threshold: 30
    period: 300
    evaluation_periods: 3
    action: scale_down

  - name: HighMemory
    metric: MemoryUtilization
    threshold: 80
    period: 60
    evaluation_periods: 2
    action: scale_up
```

**Auto Scaling Policies**:
```yaml
scaling_policies:
  - name: target-tracking-cpu
    type: TargetTrackingScaling
    target_value: 70
    metric: CPUUtilization
    cooldown: 180

  - name: step-scaling-requests
    type: StepScaling
    metric: RequestCountPerTarget
    steps:
      - threshold: 1000
        adjustment: +2
      - threshold: 2000
        adjustment: +4
      - threshold: 3000
        adjustment: +6
```

### Health Checks

**Application health endpoint**: `/health/live`

**Expected response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-02T12:00:00Z",
  "checks": {
    "database": "ok",
    "redis": "ok",
    "typesense": "ok"
  },
  "uptime": 86400,
  "memory": {
    "used": 4.2,
    "total": 16,
    "percentage": 26.25
  }
}
```

**Health check configuration**:
```yaml
health_check:
  path: /health/live
  interval: 10s
  timeout: 5s
  healthy_threshold: 2
  unhealthy_threshold: 3
  matcher: 200
```

---

## Database Infrastructure

### PostgreSQL Configuration

**Version**: PostgreSQL 15+ или 16+ (latest stable)

**Extensions required**:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";      -- для fuzzy search
CREATE EXTENSION IF NOT EXISTS "btree_gin";    -- для индексы
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";  -- для query analysis
```

### Connection Pooling

**PgBouncer configuration**:
```ini
[databases]
aacsearch = host=primary.postgres.local port=5432 dbname=aacsearch

[pgbouncer]
listen_addr = *
listen_port = 6432
auth_type = scram-sha-256
auth_file = /etc/pgbouncer/userlist.txt

pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
reserve_pool_size = 5
reserve_pool_timeout = 3

server_lifetime = 3600
server_idle_timeout = 600

log_connections = 1
log_disconnections = 1
log_pooler_errors = 1
```

### Replication Setup

**Primary → Replica replication**:
```sql
-- На primary
ALTER SYSTEM SET wal_level = 'replica';
ALTER SYSTEM SET max_wal_senders = 5;
ALTER SYSTEM SET wal_keep_size = '1GB';

-- Создание replication user
CREATE ROLE replicator WITH REPLICATION LOGIN ENCRYPTED PASSWORD 'strong_password';

-- pg_hba.conf
host replication replicator 10.0.20.0/24 scram-sha-256
```

**Replica configuration**:
```
# postgresql.conf (replica)
hot_standby = on
hot_standby_feedback = on
max_standby_streaming_delay = 30s
wal_receiver_status_interval = 10s
```

### Backup Strategy

**Automated backups**:
- **Frequency**: Every 6 hours
- **Retention**: 30 days
- **Type**: Full + incremental (WAL archiving)
- **Storage**: S3 with versioning

**pg_basebackup configuration**:
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/postgres"
S3_BUCKET="s3://aacsearch-backups/database"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
pg_basebackup \
  -h primary.postgres.local \
  -U replicator \
  -D "${BACKUP_DIR}/${DATE}" \
  -Ft \
  -z \
  -P \
  -X stream

# Upload to S3
aws s3 sync "${BACKUP_DIR}/${DATE}" "${S3_BUCKET}/${DATE}/"

# Cleanup old backups (keep 7 days locally)
find "${BACKUP_DIR}" -type d -mtime +7 -exec rm -rf {} \;
```

### Indexing Strategy

**Essential indices**:
```sql
-- Tenant isolation (критичный для multi-tenancy)
CREATE INDEX idx_collections_tenant_id ON collections(tenant_id);
CREATE INDEX idx_documents_tenant_id ON documents(tenant_id);
CREATE INDEX idx_users_tenant_id ON users(tenant_id);

-- Search performance
CREATE INDEX idx_collections_name_trgm ON collections USING gin(name gin_trgm_ops);
CREATE INDEX idx_documents_content_trgm ON documents USING gin(content gin_trgm_ops);

-- Query optimization
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_subscriptions_status ON subscriptions(status, current_period_end);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash) WHERE revoked_at IS NULL;

-- Analytics
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_tenant ON analytics_events(tenant_id, created_at DESC);
```

### Query Optimization

**pg_stat_statements для мониторинга**:
```sql
-- Top 10 самых медленных queries
SELECT
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Queries с высоким I/O
SELECT
  query,
  calls,
  shared_blks_hit,
  shared_blks_read,
  shared_blks_read / nullif(shared_blks_hit + shared_blks_read, 0)::float as cache_miss_ratio
FROM pg_stat_statements
WHERE shared_blks_read > 0
ORDER BY cache_miss_ratio DESC
LIMIT 10;
```

---

## Search Engine Infrastructure

### Typesense Cluster Setup

**Cluster topology**:
```
┌─────────────────────────────────────────┐
│         Typesense Cluster (5 nodes)     │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌───────┐ │
│  │ Node 1   │  │ Node 2   │  │Node 3 │ │
│  │ (Data +  │  │ (Data +  │  │(Data +│ │
│  │  Coord)  │  │  Coord)  │  │Coord) │ │
│  └──────────┘  └──────────┘  └───────┘ │
│                                         │
│  ┌──────────┐  ┌──────────┐            │
│  │ Node 4   │  │ Node 5   │            │
│  │(Coordinator)│(Coordinator)           │
│  └──────────┘  └──────────┘            │
└─────────────────────────────────────────┘
```

**Node configuration** (`/etc/typesense/typesense-server.ini`):
```ini
[server]
api-address = 0.0.0.0
api-port = 8108
data-dir = /var/lib/typesense/data
api-key = ${TYPESENSE_API_KEY}
log-dir = /var/log/typesense

# Clustering
nodes = node1.typesense.local:8107,node2.typesense.local:8107,node3.typesense.local:8107,node4.typesense.local:8107,node5.typesense.local:8107
peering-address = ${NODE_HOSTNAME}:8107

# Performance
thread-pool-size = 8
num-collections-parallel-load = 2
num-documents-parallel-load = 1000

# Caching
enable-search-analytics = true
analytics-flush-interval = 60

# Limits
max-memory-ratio = 0.7
snapshot-interval-seconds = 3600
healthy-read-lag = 1000
healthy-write-lag = 500
```

### Capacity Planning для Search

**Index size calculation**:
```
Средний размер документа: 5 KB
Количество документов: 1,000,000
Index overhead: 1.5x

Total index size = 5 KB × 1,000,000 × 1.5 = 7.5 GB
Рекомендуемая RAM = 7.5 GB × 1.3 (buffer) = 10 GB
```

**Performance targets**:
- Query latency (p95): < 50ms
- Indexing throughput: 1,000 docs/sec
- Search QPS: 500+ per node

### High Availability

**Quorum configuration**:
```yaml
cluster:
  nodes: 5
  quorum: 3  # минимум 3 nodes для consensus
  replication_factor: 3  # каждый документ на 3 nodes

failover:
  automatic: true
  detection_timeout: 10s
  recovery_timeout: 60s
```

---

## Cache Infrastructure

### Redis Cluster Configuration

**Cluster topology**: 3 masters + 3 replicas

```
Master 1 (slots 0-5461)     → Replica 1
Master 2 (slots 5462-10922) → Replica 2
Master 3 (slots 10923-16383)→ Replica 3
```

**redis.conf** (master):
```conf
# Networking
bind 0.0.0.0
port 6379
tcp-backlog 511
timeout 0
tcp-keepalive 300

# Clustering
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
cluster-replica-validity-factor 0
cluster-migration-barrier 1
cluster-require-full-coverage no

# Memory
maxmemory 7gb
maxmemory-policy allkeys-lru
maxmemory-samples 5

# Persistence
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

save 900 1
save 300 10
save 60 10000

# Security
requirepass ${REDIS_PASSWORD}
masterauth ${REDIS_PASSWORD}

# Performance
lazyfree-lazy-eviction yes
lazyfree-lazy-expire yes
lazyfree-lazy-server-del yes
replica-lazy-flush yes

# Logging
loglevel notice
logfile /var/log/redis/redis-server.log
```

### Cache Strategy

**Cache keys structure**:
```
tenant:{tenant_id}:collection:{id}
tenant:{tenant_id}:search:query:{hash}
tenant:{tenant_id}:user:{id}
tenant:{tenant_id}:session:{session_id}
rate_limit:{ip}:{endpoint}
api_key:{key_hash}
```

**TTL settings**:
```javascript
const CACHE_TTL = {
  COLLECTION: 3600,        // 1 hour
  SEARCH_RESULTS: 300,     // 5 minutes
  USER_SESSION: 86400,     // 24 hours
  API_KEY_VALIDATION: 600, // 10 minutes
  RATE_LIMIT_WINDOW: 60,   // 1 minute
  TENANT_SETTINGS: 1800    // 30 minutes
}
```

---

## Мониторинг инфраструктуры

### Metrics to Monitor

**Application Metrics**:
- Request rate (requests/sec)
- Response time (p50, p95, p99)
- Error rate (4xx, 5xx)
- Active connections
- Memory usage
- CPU usage

**Database Metrics**:
- Connection count
- Query latency
- Transactions per second (TPS)
- Cache hit ratio
- Replication lag
- Disk I/O

**Search Engine Metrics**:
- Query latency
- Index size
- Memory usage
- CPU usage
- Cache hit ratio

**Cache Metrics**:
- Hit/miss ratio
- Eviction rate
- Memory usage
- Network I/O
- Connected clients

### Prometheus Configuration

**prometheus.yml**:
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  # Application servers
  - job_name: 'aacsearch-app'
    static_configs:
      - targets:
        - app1.internal:9090
        - app2.internal:9090
        - app3.internal:9090
        - app4.internal:9090
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance

  # PostgreSQL
  - job_name: 'postgres'
    static_configs:
      - targets:
        - postgres-exporter.internal:9187

  # Redis
  - job_name: 'redis'
    static_configs:
      - targets:
        - redis-exporter.internal:9121

  # Typesense
  - job_name: 'typesense'
    static_configs:
      - targets:
        - typesense1.internal:8108
        - typesense2.internal:8108
        - typesense3.internal:8108
    metrics_path: /metrics.json

  # Node exporters
  - job_name: 'node'
    static_configs:
      - targets:
        - app1.internal:9100
        - app2.internal:9100
        - db.internal:9100
```

### Alert Rules

**alerts.yml**:
```yaml
groups:
  - name: infrastructure
    interval: 30s
    rules:
      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage on {{ $labels.instance }}"
          description: "CPU usage is above 80% (current: {{ $value }}%)"

      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100 > 90
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High memory usage on {{ $labels.instance }}"

      - alert: DatabaseReplicationLag
        expr: pg_replication_lag_seconds > 30
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "Database replication lag is high"

      - alert: RedisHighMemory
        expr: redis_memory_used_bytes / redis_memory_max_bytes * 100 > 90
        for: 5m
        labels:
          severity: warning
```

---

## Планирование мощностей

### Growth Projections

**Year 1**:
- Tenants: 0 → 1,000
- Users: 0 → 10,000
- Documents: 0 → 1M
- Search queries: 0 → 10M/month

**Infrastructure scaling**:
```
Month 1-3:   Минимальная конфигурация
Month 4-6:   +2 app servers, +1 DB replica
Month 7-9:   Рекомендуемая конфигурация
Month 10-12: +Auto-scaling, +CDN optimization
```

### Cost Forecast

| Месяц | Tenants | App Servers | Database | Total Cost |
|-------|---------|-------------|----------|------------|
| 1-3   | 0-100   | 2           | 1+1 replica | $900 |
| 4-6   | 100-300 | 4           | 1+1 replica | $1,800 |
| 7-9   | 300-600 | 6           | 1+2 replicas | $3,500 |
| 10-12 | 600-1000| 8           | 1+2 replicas | $4,500 |

---

## Summary Checklist

**Infrastructure готовность**:
- [ ] Application servers provisioned (минимум 2)
- [ ] Database cluster setup (primary + replica)
- [ ] Search engine cluster deployed (минимум 3 nodes)
- [ ] Cache cluster configured (master + replica)
- [ ] Load balancer configured
- [ ] CDN activated
- [ ] Storage configured (S3 или equivalent)
- [ ] VPC и networking setup
- [ ] Security groups configured
- [ ] Backup automation configured
- [ ] Monitoring stack deployed
- [ ] Alert rules configured

**Следующие шаги**: Переходите к [Docker Deployment](02-docker.md) для настройки контейнеризации.
