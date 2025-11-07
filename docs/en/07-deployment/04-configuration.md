# Конфигурация окружения

Полное руководство по управлению конфигурацией и секретами для AACSearch Platform.

## Содержание

- [Environment Variables](#environment-variables)
- [Секреты и их управление](#секреты-и-их-управление)
- [Конфигурация по окружениям](#конфигурация-по-окружениям)
- [Feature Flags](#feature-flags)
- [Secrets Management Tools](#secrets-management-tools)
- [Ротация секретов](#ротация-секретов)
- [Runtime Configuration](#runtime-configuration)
- [Validation](#validation)

---

## Environment Variables

### Полный список переменных окружения

#### Server Configuration

```bash
# Базовые настройки сервера
NODE_ENV=production                    # Окружение: development | production | test
PORT=3000                             # Порт приложения
HOSTNAME=0.0.0.0                      # Bind address
NEXT_PUBLIC_SERVER_URL=https://aacsearch.com  # Public URL приложения
```

#### Database (PostgreSQL)

```bash
# PostgreSQL подключение
DATABASE_URI=postgresql://user:password@host:5432/dbname
# Или раздельные параметры:
POSTGRES_HOST=postgres.internal
POSTGRES_PORT=5432
POSTGRES_DB=aacsearch
POSTGRES_USER=aacsearch
POSTGRES_PASSWORD=strong_password_here
POSTGRES_SSL=true                     # Включить SSL для connection

# Connection pooling
DATABASE_POOL_MIN=2                   # Минимум connections в pool
DATABASE_POOL_MAX=10                  # Максимум connections в pool
DATABASE_POOL_IDLE_TIMEOUT=30000      # Timeout для idle connections (ms)
DATABASE_POOL_ACQUIRE_TIMEOUT=60000   # Timeout для acquiring connection (ms)

# Performance tuning
DATABASE_STATEMENT_TIMEOUT=30000      # Query timeout (ms)
DATABASE_QUERY_TIMEOUT=30000          # Query execution timeout (ms)
```

#### Payload CMS

```bash
# Payload CMS configuration
PAYLOAD_SECRET=minimum_32_character_random_secret_key_here  # Минимум 32 символа
PAYLOAD_PUBLIC_DISABLE_AUTO_LOGIN=true   # Отключить auto-login в production
PAYLOAD_CONFIG_PATH=dist/payload.config.js  # Путь к config file

# Admin panel
PAYLOAD_ADMIN_EMAIL=admin@aacsearch.com     # Email для первого admin user
PAYLOAD_ADMIN_PASSWORD=secure_password       # Password для первого admin user
```

#### Redis Cache

```bash
# Redis connection
REDIS_URL=redis://:password@host:6379/0   # Full connection URL
# Или раздельные параметры:
REDIS_HOST=redis.internal
REDIS_PORT=6379
REDIS_PASSWORD=redis_password_here
REDIS_DB=0                            # Database number (0-15)
REDIS_TLS=false                       # Включить TLS

# Cache configuration
REDIS_TTL=3600                        # Default TTL для cache entries (seconds)
REDIS_PREFIX=aacsearch:               # Key prefix для namespace isolation
REDIS_MAX_RETRIES=3                   # Retry attempts для failed operations
REDIS_CONNECT_TIMEOUT=10000           # Connection timeout (ms)
```

#### Typesense Search Engine

```bash
# Typesense connection
TYPESENSE_HOST=typesense.internal     # Hostname или IP
TYPESENSE_PORT=8108                   # Port (default: 8108)
TYPESENSE_PROTOCOL=http               # http или https
TYPESENSE_API_KEY=your_admin_api_key_here  # Admin API key

# Multi-node cluster (comma-separated)
TYPESENSE_NODES=node1:8108,node2:8108,node3:8108
TYPESENSE_NEAREST_NODE=node1:8108     # Preferred node

# Performance
TYPESENSE_CONNECTION_TIMEOUT=5000     # Connection timeout (ms)
TYPESENSE_NUM_RETRIES=3               # Retry attempts
TYPESENSE_RETRY_INTERVAL=100          # Interval между retries (ms)

# Cache
TYPESENSE_CACHE_SEARCH_RESULTS=true   # Cache search results
TYPESENSE_CACHE_TTL=300               # Cache TTL (seconds)
```

#### Stripe Payments

```bash
# Stripe configuration
STRIPE_SECRET_KEY=sk_live_...         # Secret key (sk_test_... для test mode)
STRIPE_PUBLISHABLE_KEY=pk_live_...    # Publishable key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...  # Public key для frontend

# Webhooks
STRIPE_WEBHOOK_SECRET=whsec_...       # Webhook signing secret
STRIPE_WEBHOOK_ENDPOINT=https://aacsearch.com/webhooks/stripe

# Products (из Stripe Dashboard)
STRIPE_PRODUCT_STARTER=prod_...       # Starter plan product ID
STRIPE_PRODUCT_PROFESSIONAL=prod_...  # Professional plan product ID
STRIPE_PRODUCT_ENTERPRISE=prod_...    # Enterprise plan product ID

# Prices (из Stripe Dashboard)
STRIPE_PRICE_STARTER_MONTHLY=price_...
STRIPE_PRICE_STARTER_YEARLY=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_YEARLY=price_...

# Configuration
STRIPE_MAX_NETWORK_RETRIES=3          # Retry failed requests
STRIPE_TIMEOUT=80000                  # API timeout (ms)
```

#### Email Configuration

```bash
# SMTP configuration (для transactional emails)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false                     # true для port 465
SMTP_USER=apikey                      # Username (SendGrid использует 'apikey')
SMTP_PASSWORD=SG.xxx                  # Password/API key

# Email settings
EMAIL_FROM=noreply@aacsearch.com      # From address
EMAIL_FROM_NAME=AACSearch Platform    # From name
EMAIL_REPLY_TO=support@aacsearch.com  # Reply-to address

# Templates
EMAIL_TEMPLATE_DIR=./emails           # Email templates directory
```

#### AI/ML Features (Optional)

```bash
# OpenAI для embeddings и conversational search
OPENAI_API_KEY=sk-...                 # OpenAI API key
OPENAI_MODEL=gpt-4                    # Model для conversational search
OPENAI_EMBEDDING_MODEL=text-embedding-3-large  # Embedding model
OPENAI_MAX_TOKENS=2000                # Max tokens для response
OPENAI_TEMPERATURE=0.7                # Temperature (0-1)

# HuggingFace для alternative embeddings
HUGGINGFACE_API_KEY=hf_...            # HuggingFace API key
HUGGINGFACE_MODEL=sentence-transformers/all-MiniLM-L6-v2  # Embedding model

# Vector search configuration
VECTOR_DIMENSIONS=384                 # Dimensions для embeddings (зависит от model)
VECTOR_SIMILARITY_METRIC=cosine       # cosine | euclidean | dot_product
```

#### Storage (S3-compatible)

```bash
# AWS S3
AWS_ACCESS_KEY_ID=AKIA...             # AWS access key
AWS_SECRET_ACCESS_KEY=...             # AWS secret key
AWS_REGION=us-east-1                  # AWS region
AWS_S3_BUCKET=aacsearch-production    # S3 bucket name
AWS_S3_ENDPOINT=https://s3.amazonaws.com  # S3 endpoint (для custom endpoints)

# CloudFlare R2 (S3-compatible)
R2_ACCOUNT_ID=...                     # CloudFlare account ID
R2_ACCESS_KEY_ID=...                  # R2 access key
R2_SECRET_ACCESS_KEY=...              # R2 secret key
R2_BUCKET=aacsearch-media             # R2 bucket name
R2_PUBLIC_URL=https://media.aacsearch.com  # Public CDN URL

# Storage configuration
STORAGE_PROVIDER=s3                   # s3 | r2 | gcs | azure
STORAGE_MAX_FILE_SIZE=104857600       # Max file size (100 MB в bytes)
STORAGE_ALLOWED_MIME_TYPES=image/jpeg,image/png,application/pdf
```

#### Analytics & Monitoring

```bash
# Sentry error tracking
SENTRY_DSN=https://...@sentry.io/...  # Sentry DSN
SENTRY_ENVIRONMENT=production         # Environment name
SENTRY_RELEASE=1.0.0                  # Release version
SENTRY_TRACES_SAMPLE_RATE=0.1         # 10% traces sampling
SENTRY_PROFILES_SAMPLE_RATE=0.1       # 10% profiles sampling

# Google Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...   # GA4 measurement ID

# PostHog analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_...       # PostHog API key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

#### Rate Limiting

```bash
# Rate limiting configuration
RATE_LIMIT_ENABLED=true               # Включить rate limiting
RATE_LIMIT_WINDOW=60000               # Time window (ms)
RATE_LIMIT_MAX_REQUESTS=100           # Max requests per window

# API-specific limits
RATE_LIMIT_API_WINDOW=60000           # API endpoints window
RATE_LIMIT_API_MAX=1000               # API max requests
RATE_LIMIT_SEARCH_WINDOW=60000        # Search endpoints window
RATE_LIMIT_SEARCH_MAX=500             # Search max requests

# IP whitelist (comma-separated)
RATE_LIMIT_WHITELIST=127.0.0.1,::1
```

#### Security

```bash
# CORS configuration
CORS_ORIGIN=https://aacsearch.com,https://www.aacsearch.com
CORS_METHODS=GET,POST,PUT,DELETE,PATCH
CORS_CREDENTIALS=true

# Session configuration
SESSION_SECRET=minimum_32_character_session_secret
SESSION_MAX_AGE=86400000              # Session lifetime (24h в ms)
SESSION_SECURE=true                   # Secure cookies (требует HTTPS)
SESSION_SAME_SITE=strict              # strict | lax | none

# JWT configuration
JWT_SECRET=minimum_32_character_jwt_secret
JWT_EXPIRES_IN=7d                     # Token lifetime
JWT_ISSUER=aacsearch.com
JWT_AUDIENCE=aacsearch.com

# Encryption
ENCRYPTION_KEY=32_byte_hex_encoded_encryption_key  # Для at-rest encryption
```

#### Feature Flags

```bash
# Feature toggles
FEATURE_AI_SEARCH=true                # Включить AI-powered search
FEATURE_IMAGE_SEARCH=true             # Включить image search
FEATURE_GEO_SEARCH=true               # Включить geo search
FEATURE_MULTI_LANGUAGE=true           # Включить multi-language support
FEATURE_ANALYTICS_DASHBOARD=true      # Включить analytics dashboard
FEATURE_API_V2=false                  # Новая версия API (experimental)

# A/B testing
AB_TEST_NEW_UI=50                     # % users для new UI
AB_TEST_AI_RECOMMENDATIONS=25         # % users для AI recommendations
```

#### Development & Debugging

```bash
# Logging
LOG_LEVEL=info                        # trace | debug | info | warn | error | fatal
LOG_FORMAT=json                       # json | pretty
LOG_COLORIZE=false                    # Colorize logs (только для development)

# Debug mode
DEBUG=false                           # Enable debug mode
DEBUG_NAMESPACE=app:*                 # Debug namespace filter

# Performance monitoring
ENABLE_PROFILING=false                # Включить CPU/memory profiling
PROFILING_SAMPLE_RATE=0.01            # 1% sampling rate
```

#### Multi-tenancy

```bash
# Tenant configuration
DEFAULT_TENANT_STORAGE_LIMIT=10737418240  # 10 GB в bytes
DEFAULT_TENANT_API_RATE_LIMIT=10000   # Requests per hour
DEFAULT_TENANT_SEARCH_RATE_LIMIT=5000 # Search requests per hour

# Tenant isolation
TENANT_ISOLATION_LEVEL=database       # database | schema | row_level
TENANT_SUBDOMAIN_ENABLED=true         # Включить subdomain routing
```

---

## Секреты и их управление

### Генерация секретов

```bash
# PAYLOAD_SECRET (32+ символов)
openssl rand -base64 32

# JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Encryption key (64 hex символа = 32 bytes)
openssl rand -hex 32
```

### .env файлы структура

**.env.local** (для local development):
```bash
NODE_ENV=development
DATABASE_URI=postgresql://localhost:5432/aacsearch_dev
REDIS_URL=redis://localhost:6379
TYPESENSE_HOST=localhost
STRIPE_SECRET_KEY=sk_test_...
# ... development settings
```

**.env.production** (для production):
```bash
NODE_ENV=production
DATABASE_URI=postgresql://prod-db.internal:5432/aacsearch
REDIS_URL=redis://:password@prod-redis.internal:6379
# ... production settings (БЕЗ реальных секретов!)
```

**⚠️ ВАЖНО**: Никогда не коммитьте `.env` файлы с реальными секретами в Git!

---

## Конфигурация по окружениям

### Environment Hierarchy

```
1. System Environment Variables (highest priority)
2. .env.production.local (production overrides)
3. .env.production
4. .env.local (development/staging overrides)
5. .env (defaults, committed to Git)
```

### Примеры конфигураций

**Development**:
```bash
# .env.development
NODE_ENV=development
DATABASE_URI=postgresql://localhost:5432/aacsearch_dev
REDIS_URL=redis://localhost:6379
TYPESENSE_HOST=localhost
STRIPE_SECRET_KEY=sk_test_...
LOG_LEVEL=debug
DEBUG=true
```

**Staging**:
```bash
# .env.staging
NODE_ENV=production
NEXT_PUBLIC_SERVER_URL=https://staging.aacsearch.com
DATABASE_URI=postgresql://staging-db:5432/aacsearch_staging
STRIPE_SECRET_KEY=sk_test_...  # Still test mode
SENTRY_ENVIRONMENT=staging
LOG_LEVEL=info
```

**Production**:
```bash
# .env.production
NODE_ENV=production
NEXT_PUBLIC_SERVER_URL=https://aacsearch.com
DATABASE_URI=postgresql://prod-db:5432/aacsearch
STRIPE_SECRET_KEY=sk_live_...  # Live mode
SENTRY_ENVIRONMENT=production
LOG_LEVEL=warn
```

---

## Feature Flags

### LaunchDarkly Integration

```typescript
// src/lib/feature-flags.ts
import { LDClient, init } from 'launchdarkly-node-server-sdk'

const client: LDClient = init(process.env.LAUNCHDARKLY_SDK_KEY!)

export async function isFeatureEnabled(
  featureKey: string,
  context: { tenantId: string; userId?: string }
): Promise<boolean> {
  const ldContext = {
    kind: 'multi',
    tenant: {
      key: context.tenantId,
      kind: 'tenant',
    },
    user: context.userId ? {
      key: context.userId,
      kind: 'user',
    } : undefined,
  }

  return await client.variation(featureKey, ldContext, false)
}

// Usage
const hasAISearch = await isFeatureEnabled('ai-search', {
  tenantId: 'tenant_123',
  userId: 'user_456',
})
```

### Environment-based Feature Flags

```typescript
// src/lib/features.ts
export const features = {
  aiSearch: process.env.FEATURE_AI_SEARCH === 'true',
  imageSearch: process.env.FEATURE_IMAGE_SEARCH === 'true',
  geoSearch: process.env.FEATURE_GEO_SEARCH === 'true',
  analytics: process.env.FEATURE_ANALYTICS_DASHBOARD === 'true',
} as const

// Usage
import { features } from '@/lib/features'

if (features.aiSearch) {
  // AI search logic
}
```

---

## Secrets Management Tools

### AWS Secrets Manager

```typescript
// src/lib/secrets/aws.ts
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'

const client = new SecretsManagerClient({ region: process.env.AWS_REGION })

export async function getSecret(secretName: string): Promise<string> {
  const command = new GetSecretValueCommand({ SecretId: secretName })
  const response = await client.send(command)

  if (response.SecretString) {
    return response.SecretString
  }

  throw new Error(`Secret ${secretName} not found`)
}

// Usage
const dbPassword = await getSecret('aacsearch/production/database-password')
```

**Setup AWS Secrets**:
```bash
# Create secret
aws secretsmanager create-secret \
  --name aacsearch/production/database-password \
  --secret-string "your-strong-password"

# Get secret
aws secretsmanager get-secret-value \
  --secret-id aacsearch/production/database-password
```

### HashiCorp Vault

```typescript
// src/lib/secrets/vault.ts
import vault from 'node-vault'

const client = vault({
  apiVersion: 'v1',
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN,
})

export async function getVaultSecret(path: string): Promise<Record<string, any>> {
  const result = await client.read(path)
  return result.data.data
}

// Usage
const secrets = await getVaultSecret('secret/aacsearch/production')
const dbPassword = secrets.database_password
```

**Setup Vault**:
```bash
# Write secret
vault kv put secret/aacsearch/production \
  database_password="strong-password" \
  redis_password="redis-password" \
  stripe_secret_key="sk_live_..."

# Read secret
vault kv get secret/aacsearch/production
```

### Kubernetes Secrets

```yaml
# k8s-secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: aacsearch-secrets
  namespace: production
type: Opaque
stringData:
  database-uri: postgresql://user:password@host:5432/db
  redis-password: redis-password
  stripe-secret-key: sk_live_...
  payload-secret: 32-character-secret
```

```bash
# Create secret
kubectl apply -f k8s-secrets.yaml

# Use in deployment
# (см. 03-kubernetes.md для примеров)
```

---

## Ротация секретов

### Automated Rotation Strategy

**Database Password Rotation** (каждые 90 дней):
```bash
#!/bin/bash
# scripts/rotate-db-password.sh

NEW_PASSWORD=$(openssl rand -base64 32)

# 1. Create new user with new password (PostgreSQL)
psql -c "CREATE USER aacsearch_new WITH PASSWORD '$NEW_PASSWORD';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE aacsearch TO aacsearch_new;"

# 2. Update secrets manager
aws secretsmanager update-secret \
  --secret-id aacsearch/production/database-password \
  --secret-string "$NEW_PASSWORD"

# 3. Update application (rolling restart)
kubectl set env deployment/aacsearch-app \
  DATABASE_PASSWORD="$NEW_PASSWORD"

# 4. Wait for rollout
kubectl rollout status deployment/aacsearch-app

# 5. Cleanup old user
psql -c "REVOKE ALL PRIVILEGES ON DATABASE aacsearch FROM aacsearch_old;"
psql -c "DROP USER aacsearch_old;"
```

### Stripe API Keys Rotation

```bash
# 1. Create new restricted key в Stripe Dashboard
# 2. Update secrets
aws secretsmanager update-secret \
  --secret-id aacsearch/production/stripe-secret-key \
  --secret-string "sk_live_new..."

# 3. Restart application
kubectl rollout restart deployment/aacsearch-app

# 4. Verify new key works
curl -u sk_live_new...: https://api.stripe.com/v1/customers

# 5. Revoke old key в Stripe Dashboard
```

---

## Runtime Configuration

### Dynamic Configuration Updates

```typescript
// src/lib/config/dynamic.ts
import { redis } from '@/lib/redis'

interface RuntimeConfig {
  maintenanceMode: boolean
  rateLimitMultiplier: number
  featureFlags: Record<string, boolean>
}

export async function getRuntimeConfig(): Promise<RuntimeConfig> {
  const cached = await redis.get('config:runtime')

  if (cached) {
    return JSON.parse(cached)
  }

  // Default config
  return {
    maintenanceMode: false,
    rateLimitMultiplier: 1.0,
    featureFlags: {},
  }
}

export async function updateRuntimeConfig(config: Partial<RuntimeConfig>): Promise<void> {
  const current = await getRuntimeConfig()
  const updated = { ...current, ...config }

  await redis.set('config:runtime', JSON.stringify(updated), 'EX', 3600)

  // Broadcast update to all app instances
  await redis.publish('config:update', JSON.stringify(updated))
}

// Usage - enable maintenance mode
await updateRuntimeConfig({ maintenanceMode: true })
```

---

## Validation

### Environment Variables Validation

```typescript
// src/lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().default(3000),

  // Database
  DATABASE_URI: z.string().url(),

  // Redis
  REDIS_URL: z.string().url(),

  // Typesense
  TYPESENSE_HOST: z.string().min(1),
  TYPESENSE_PORT: z.coerce.number(),
  TYPESENSE_API_KEY: z.string().min(8),

  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),

  // Payload
  PAYLOAD_SECRET: z.string().min(32),

  // Optional
  OPENAI_API_KEY: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
})

export const env = envSchema.parse(process.env)

// Usage
import { env } from '@/lib/env'
console.log(env.DATABASE_URI)  // Type-safe!
```

### Startup Validation

```typescript
// src/lib/startup-checks.ts
export async function validateConfiguration(): Promise<void> {
  const errors: string[] = []

  // Check database connection
  try {
    await payload.db.pool.query('SELECT 1')
  } catch (error) {
    errors.push('Database connection failed')
  }

  // Check Redis connection
  try {
    await redis.ping()
  } catch (error) {
    errors.push('Redis connection failed')
  }

  // Check Typesense connection
  try {
    await typesense.health.retrieve()
  } catch (error) {
    errors.push('Typesense connection failed')
  }

  // Check Stripe API key
  try {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY)
    await stripe.customers.list({ limit: 1 })
  } catch (error) {
    errors.push('Stripe API key invalid')
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`)
  }

  console.log('✅ All configuration checks passed')
}

// В server.ts
await validateConfiguration()
```

---

## Checklist

**Configuration готовность**:
- [ ] Все environment variables определены
- [ ] Секреты сгенерированы (минимум 32 символа)
- [ ] .env файлы созданы для каждого окружения
- [ ] .env.production НЕ содержит реальных секретов
- [ ] Secrets manager настроен (AWS/Vault/K8s)
- [ ] Validation logic добавлена
- [ ] Feature flags настроены
- [ ] Rotation policy определена
- [ ] Backup secrets сохранены в безопасном месте
- [ ] Documentation обновлена

**Следующие шаги**: Переходите к [Scaling Strategies](05-scaling.md) для оптимизации performance.
