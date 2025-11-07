# Multi-Tenancy Architecture

## Оглавление

- [Введение](#введение)
- [Data Isolation](#data-isolation)
- [Performance Isolation](#performance-isolation)
- [Security Isolation](#security-isolation)
- [Customization per Tenant](#customization-per-tenant)
- [Billing per Tenant](#billing-per-tenant)
- [Scaling Strategies](#scaling-strategies)
- [Tenant Management](#tenant-management)
- [Monitoring & Observability](#monitoring--observability)

---

## Введение

### Что такое Multi-Tenancy?

**Multi-tenancy** — архитектурный подход, где единая инстанция приложения обслуживает множество клиентов (tenant'ов), обеспечивая при этом полную изоляцию данных и ресурсов между ними.

### Преимущества

**Для платформы**:
- Эффективное использование ресурсов
- Централизованное обслуживание
- Упрощенные обновления (deploy once → all tenants)
- Экономия затрат (shared infrastructure)

**Для клиентов**:
- Быстрый onboarding (no deployment)
- Automatic updates
- Lower costs (shared infrastructure)
- High availability (managed by platform)

### Multi-Tenancy Models

#### 1. Shared Database, Shared Schema
**Description**: Все tenants используют одну БД и одну схему. Разделение через `tenant_id` column.

**Pros**:
- Максимальная эффективность ресурсов
- Простота maintenance

**Cons**:
- Риск data leakage (если bad SQL query)
- Noisy neighbor problem
- Сложнее миграции (affects all tenants)

**AACSearch**: Используем этот подход (с RLS).

#### 2. Shared Database, Separate Schema
**Description**: Одна БД, но каждый tenant имеет свою schema (PostgreSQL schema).

**Pros**:
- Better isolation than shared schema
- Easier per-tenant backups

**Cons**:
- Limit на number of schemas (~1000 в Postgres)
- Migrations more complex
- Connection pooling challenges

**AACSearch**: Не используем (scalability limits).

#### 3. Separate Database per Tenant
**Description**: Каждый tenant имеет отдельную database.

**Pros**:
- Perfect isolation
- Independent scaling
- Tenant-specific configurations

**Cons**:
- High resource overhead
- Expensive
- Complex management (migrations, backups)

**AACSearch**: Только для Enterprise customers (custom deployment).

---

## Data Isolation

### Database Level: Row Level Security (RLS)

#### PostgreSQL RLS

**Concept**: PostgreSQL автоматически фильтрует rows based на policies.

**Example**:
```sql
-- Enable RLS on tenants table
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own tenant
CREATE POLICY tenant_isolation ON tenants
  USING (id = current_setting('app.current_tenant_id')::uuid);

-- Policy for documents
CREATE POLICY document_isolation ON documents
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

**Setting tenant context**:
```typescript
// Middleware sets tenant context for each request
async function setTenantContext(req, res, next) {
  const tenantId = req.user.tenantId // from JWT

  await db.query('SET app.current_tenant_id = $1', [tenantId])

  next()
}
```

**Benefits**:
- Database-level enforcement (cannot bypass)
- Works даже если application bug
- Transparent to application code

**Implementation in AACSearch**:

All tables с tenant-specific data имеют:
1. `tenant_id UUID NOT NULL` column
2. Foreign key к `tenants(id)`
3. RLS policy enabled
4. Index на `tenant_id` для performance

**Tables with RLS**:
- `tenants`
- `users` (via `user_tenants` junction)
- `collections`
- `documents`
- `api_keys`
- `integrations`
- `analytics_events`
- `audit_logs`

**Tables without RLS** (global):
- `users` (user может belong to multiple tenants)
- `system_config`
- `migrations`

#### Application Level: Tenant Context

**Every Request**:
```typescript
interface RequestWithTenant extends Request {
  tenant: Tenant
  user: User
}

// Middleware
async function tenantMiddleware(req: RequestWithTenant, res, next) {
  // 1. Extract tenant from JWT or subdomain
  const tenantId = extractTenantId(req)

  // 2. Load tenant from DB
  const tenant = await db.tenant.findUnique({ where: { id: tenantId } })

  if (!tenant) {
    return res.status(404).json({ error: 'Tenant not found' })
  }

  // 3. Check tenant status
  if (tenant.status === 'suspended') {
    return res.status(403).json({ error: 'Account suspended' })
  }

  // 4. Set tenant context
  req.tenant = tenant
  await db.query('SET app.current_tenant_id = $1', [tenantId])

  next()
}
```

**Tenant Identification**:

**Option 1: Subdomain**
```
tenant1.aacsearch.com → tenant_id from tenant.slug = 'tenant1'
tenant2.aacsearch.com → tenant_id from tenant.slug = 'tenant2'
```

**Option 2: Custom Domain**
```
search.customer.com → tenant_id from tenant.custom_domain = 'search.customer.com'
```

**Option 3: JWT Token** (для API)
```json
{
  "user_id": "uuid",
  "tenant_id": "uuid",
  "role": "admin"
}
```

#### Search Engine Level: Scoped Keys

**Typesense Scoped Keys**:

```typescript
// Generate scoped key for tenant
function generateScopedKey(tenantId: string, apiKey: string): string {
  const scopedKey = typesense.keys.generateScopedSearchKey(apiKey, {
    filter_by: `tenant_id:=${tenantId}`,
    expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour
  })

  return scopedKey
}
```

**Usage**:
- Client receives scoped key
- Scoped key automatically adds `filter_by=tenant_id:=<id>` to all queries
- Impossible to search другого tenant's data

**Collection Naming**:

**Option A**: Single collection, tenant_id field
```typescript
// documents collection
{
  id: 'doc1',
  tenant_id: 'tenant-uuid',
  title: 'My Document',
  content: '...'
}

// Search always includes tenant filter
const results = await typesense.collections('documents').documents().search({
  q: 'query',
  filter_by: `tenant_id:=${tenantId}`
})
```

**Option B**: Separate collections per tenant (для Enterprise)
```typescript
// Collection per tenant
const collectionName = `tenant_${tenantId}_documents`

await typesense.collections(collectionName).documents().search({
  q: 'query'
  // No tenant filter needed (collection is already tenant-scoped)
})
```

**AACSearch Approach**: Option A (default), Option B (Enterprise only).

#### Storage Level: S3 Prefixes

**S3 Bucket Structure**:
```
aacsearch-production/
├── tenants/
│   ├── tenant-uuid-1/
│   │   ├── documents/
│   │   │   ├── doc1.pdf
│   │   │   └── doc2.jpg
│   │   └── exports/
│   │       └── data-export-2024-01-01.json
│   ├── tenant-uuid-2/
│   │   └── documents/
│   │       └── doc3.pdf
│   └── ...
└── system/
    └── backups/
```

**Signed URLs**:
```typescript
// Generate signed URL with tenant prefix constraint
function generateSignedUrl(tenantId: string, key: string): string {
  const fullKey = `tenants/${tenantId}/${key}`

  const url = s3.getSignedUrl('getObject', {
    Bucket: 'aacsearch-production',
    Key: fullKey,
    Expires: 3600 // 1 hour
  })

  return url
}
```

**S3 Bucket Policy** (defense in depth):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::aacsearch-production/tenants/*",
      "Condition": {
        "StringNotLike": {
          "s3:prefix": "tenants/${aws:userid}/*"
        }
      }
    }
  ]
}
```

#### Cache Level: Redis Namespaces

**Redis Key Naming**:
```typescript
// Namespaced keys
const cacheKey = `tenant:${tenantId}:collection:${collectionId}:schema`

await redis.set(cacheKey, JSON.stringify(schema), 'EX', 300) // 5 min TTL
```

**Cache Invalidation**:
```typescript
// Invalidate all cache for tenant
async function invalidateTenantCache(tenantId: string) {
  const pattern = `tenant:${tenantId}:*`
  const keys = await redis.keys(pattern)

  if (keys.length > 0) {
    await redis.del(...keys)
  }
}
```

**Redis ACL** (Redis 6+):
```
# Create user per tenant (для Enterprise)
ACL SETUSER tenant-uuid-1 on >password ~tenant:tenant-uuid-1:* +@all
ACL SETUSER tenant-uuid-2 on >password ~tenant:tenant-uuid-2:* +@all
```

### Data Isolation Testing

**Test Suite**:
```typescript
describe('Data Isolation', () => {
  let tenant1: Tenant
  let tenant2: Tenant
  let user1: User
  let user2: User

  beforeAll(async () => {
    tenant1 = await createTenant({ name: 'Tenant 1' })
    tenant2 = await createTenant({ name: 'Tenant 2' })

    user1 = await createUser({ email: 'user1@t1.com', tenantId: tenant1.id })
    user2 = await createUser({ email: 'user2@t2.com', tenantId: tenant2.id })
  })

  it('User1 cannot access Tenant2 data via API', async () => {
    const doc2 = await createDocument(tenant2.id, { title: 'Secret Doc' })

    const token1 = await generateToken(user1)

    const response = await fetch(`/api/documents/${doc2.id}`, {
      headers: { Authorization: `Bearer ${token1}` }
    })

    expect(response.status).toBe(404) // Not 403, to avoid info leakage
  })

  it('User1 cannot access Tenant2 data via direct SQL', async () => {
    await createDocument(tenant1.id, { title: 'Doc 1' })
    await createDocument(tenant2.id, { title: 'Doc 2' })

    // Set tenant1 context
    await db.query('SET app.current_tenant_id = $1', [tenant1.id])

    // Query all documents (should only return tenant1's)
    const docs = await db.query('SELECT * FROM documents')

    expect(docs.rows.length).toBe(1)
    expect(docs.rows[0].title).toBe('Doc 1')
  })

  it('User1 cannot search Tenant2 documents', async () => {
    await indexDocument(tenant1.id, { title: 'Laptop T1' })
    await indexDocument(tenant2.id, { title: 'Laptop T2' })

    const scopedKey = generateScopedKey(tenant1.id, adminApiKey)

    const results = await searchWithKey(scopedKey, { q: 'laptop' })

    expect(results.found).toBe(1)
    expect(results.hits[0].document.title).toBe('Laptop T1')
  })

  it('User1 cannot access Tenant2 S3 files', async () => {
    const file2 = await uploadFile(tenant2.id, 'secret.pdf', buffer)

    const url1 = generateSignedUrl(tenant1.id, 'secret.pdf')

    const response = await fetch(url1)

    expect(response.status).toBe(403) // S3 access denied
  })

  it('RLS prevents cross-tenant queries даже with admin privileges', async () => {
    // Super admin user (but still tenant-scoped)
    const admin = await createUser({
      email: 'admin@t1.com',
      tenantId: tenant1.id,
      role: 'admin'
    })

    // Set tenant1 context
    await db.query('SET app.current_tenant_id = $1', [tenant1.id])

    // Try to query tenant2's documents (should fail)
    const docs = await db.query(
      'SELECT * FROM documents WHERE tenant_id = $1',
      [tenant2.id]
    )

    expect(docs.rows.length).toBe(0) // RLS blocks the query
  })
})
```

---

## Performance Isolation

### Resource Quotas

**Per-Tenant Limits**:
```typescript
interface TenantQuotas {
  // Storage
  maxDocuments: number // e.g., 10K (Free), 100K (Starter), 1M (Pro)
  maxStorage: number // bytes, e.g., 1GB, 10GB, 100GB

  // API
  maxApiCallsPerMonth: number // e.g., 10K, 100K, 1M
  maxApiCallsPerSecond: number // rate limiting, e.g., 10, 50, 200

  // Search
  maxSearchesPerMonth: number
  maxConcurrentSearches: number // e.g., 5, 20, 100

  // Users
  maxUsers: number // e.g., 1, 5, unlimited

  // Collections
  maxCollections: number // e.g., 3, 10, unlimited
}
```

**Enforcement**:
```typescript
async function checkQuota(tenantId: string, quotaType: string): Promise<boolean> {
  const tenant = await getTenant(tenantId)
  const usage = await getUsage(tenantId)

  switch (quotaType) {
    case 'documents':
      return usage.documents < tenant.quotas.maxDocuments

    case 'api_calls':
      return usage.apiCallsThisMonth < tenant.quotas.maxApiCallsPerMonth

    case 'storage':
      return usage.storageBytes < tenant.quotas.maxStorage

    default:
      return true
  }
}

// Middleware
async function quotaMiddleware(req: RequestWithTenant, res, next) {
  const allowed = await checkQuota(req.tenant.id, 'api_calls')

  if (!allowed) {
    return res.status(429).json({
      error: 'Quota exceeded',
      message: 'You have reached your API call limit for this month',
      upgrade_url: '/billing/upgrade'
    })
  }

  next()
}
```

### Rate Limiting

**Per-Tenant Rate Limiting**:
```typescript
import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'

// Rate limiter factory
function createTenantRateLimiter() {
  return rateLimit({
    store: new RedisStore({
      client: redis,
      prefix: 'rl:'
    }),

    // Dynamic limit based на tenant plan
    max: (req: RequestWithTenant) => {
      return req.tenant.quotas.maxApiCallsPerSecond
    },

    windowMs: 1000, // 1 second

    keyGenerator: (req: RequestWithTenant) => {
      return `tenant:${req.tenant.id}`
    },

    handler: (req, res) => {
      res.status(429).json({
        error: 'Rate limit exceeded',
        message: `Maximum ${req.tenant.quotas.maxApiCallsPerSecond} requests per second`,
        retry_after: res.getHeader('Retry-After')
      })
    }
  })
}
```

**Per-User Rate Limiting** (дополнительно):
```typescript
function createUserRateLimiter() {
  return rateLimit({
    store: new RedisStore({ client: redis }),
    max: 100, // 100 requests per minute per user
    windowMs: 60000,
    keyGenerator: (req: RequestWithTenant) => {
      return `user:${req.user.id}`
    }
  })
}
```

### Query Timeouts

**Database**:
```sql
-- Set query timeout per session
SET statement_timeout = '10s'; -- 10 seconds max

-- Or per query
SELECT * FROM documents
WHERE tenant_id = $1
LIMIT 100
TIMEOUT 5000; -- 5 seconds (PostgreSQL extension)
```

**Application**:
```typescript
async function searchWithTimeout(tenantId: string, query: SearchQuery, timeoutMs: number = 5000) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Search timeout')), timeoutMs)
  })

  const searchPromise = typesense.collections('documents').documents().search({
    ...query,
    filter_by: `tenant_id:=${tenantId}`
  })

  return Promise.race([searchPromise, timeoutPromise])
}
```

### Connection Pooling

**PostgreSQL Connection Pool**:
```typescript
import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  // Pool settings
  max: 20, // max connections
  min: 5, // min connections
  idleTimeoutMillis: 30000, // close idle connections after 30s
  connectionTimeoutMillis: 2000, // wait max 2s for connection

  // Per-tenant limits (via PgBouncer)
  // See PgBouncer configuration below
})
```

**PgBouncer Configuration**:
```ini
[databases]
aacsearch = host=postgres.local port=5432 dbname=aacsearch

[pgbouncer]
listen_addr = *
listen_port = 6432
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt

# Connection pooling mode
pool_mode = transaction

# Connection limits
max_client_conn = 1000
default_pool_size = 25

# Per-user (tenant) limits
# Requires PgBouncer 1.18+
max_user_connections = 10

# Timeouts
query_timeout = 10
query_wait_timeout = 5
```

### Noisy Neighbor Prevention

**Problem**: One tenant's heavy usage affects others.

**Solutions**:

#### 1. Resource Limits (CPU, Memory)

**Kubernetes Resource Limits**:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app
    image: aacsearch:latest
    resources:
      requests:
        memory: "512Mi"
        cpu: "500m"
      limits:
        memory: "2Gi"
        cpu: "2000m"
```

#### 2. Priority Queues

**Background Jobs**:
```typescript
// High priority (Enterprise)
await queue.add('reindex', { tenantId }, { priority: 1 })

// Normal priority (Pro)
await queue.add('reindex', { tenantId }, { priority: 5 })

// Low priority (Free, Starter)
await queue.add('reindex', { tenantId }, { priority: 10 })
```

#### 3. Circuit Breakers

```typescript
import CircuitBreaker from 'opossum'

const searchCircuitBreaker = new CircuitBreaker(searchFunction, {
  timeout: 5000, // 5s timeout
  errorThresholdPercentage: 50, // open after 50% errors
  resetTimeout: 30000, // try again after 30s
})

searchCircuitBreaker.fallback(() => {
  return {
    hits: [],
    found: 0,
    message: 'Search temporarily unavailable'
  }
})

// Per-tenant circuit breaker
const tenantBreakers = new Map()

function getTenantBreaker(tenantId: string) {
  if (!tenantBreakers.has(tenantId)) {
    tenantBreakers.set(tenantId, new CircuitBreaker(searchFunction, options))
  }
  return tenantBreakers.get(tenantId)
}
```

#### 4. Separate Infrastructure (Enterprise)

**Dedicated Resources**:
- Dedicated database instance
- Dedicated search cluster
- Dedicated Redis instance
- Dedicated background workers

**Benefits**:
- No noisy neighbor
- Custom configuration
- Predictable performance
- Higher SLA

**Cost**: +200% infrastructure cost → reflected в Enterprise pricing.

---

## Security Isolation

### Authentication

**Separate JWT per Tenant**:
```typescript
interface JWTPayload {
  user_id: string
  tenant_id: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  exp: number
}

function generateToken(user: User, tenantId: string): string {
  const payload: JWTPayload = {
    user_id: user.id,
    tenant_id: tenantId,
    role: user.getRoleForTenant(tenantId),
    exp: Math.floor(Date.now() / 1000) + 15 * 60 // 15 min
  }

  return jwt.sign(payload, process.env.JWT_SECRET)
}
```

**Multi-Tenant Sessions**:
```typescript
// User может switch between tenants без re-login
async function switchTenant(req: RequestWithTenant, res) {
  const { tenantId } = req.body

  // Verify user has access to tenant
  const membership = await db.userTenants.findFirst({
    where: {
      userId: req.user.id,
      tenantId: tenantId
    }
  })

  if (!membership) {
    return res.status(403).json({ error: 'Access denied' })
  }

  // Generate new JWT with new tenant_id
  const token = generateToken(req.user, tenantId)

  res.json({ token, tenant_id: tenantId })
}
```

### API Keys

**Tenant-Scoped API Keys**:
```typescript
interface APIKey {
  id: string
  tenant_id: string
  name: string
  key: string // hashed
  scopes: string[] // ['read', 'write', 'delete']
  created_at: Date
  expires_at: Date | null
  last_used_at: Date | null
}

// Generate API key
async function createAPIKey(tenantId: string, name: string, scopes: string[]) {
  const key = `aacsearch_${nanoid(32)}`
  const hashedKey = await bcrypt.hash(key, 12)

  await db.apiKeys.create({
    data: {
      tenant_id: tenantId,
      name,
      key: hashedKey,
      scopes
    }
  })

  return key // Return only once (not stored plaintext)
}

// Verify API key
async function verifyAPIKey(key: string): Promise<APIKey | null> {
  const prefix = 'aacsearch_'
  if (!key.startsWith(prefix)) return null

  const apiKeys = await db.apiKeys.findMany({
    where: { expires_at: { gt: new Date() } }
  })

  for (const apiKey of apiKeys) {
    const valid = await bcrypt.compare(key, apiKey.key)
    if (valid) {
      // Update last_used_at
      await db.apiKeys.update({
        where: { id: apiKey.id },
        data: { last_used_at: new Date() }
      })

      return apiKey
    }
  }

  return null
}
```

### Audit Logging

**All Actions Logged**:
```typescript
interface AuditLog {
  id: string
  tenant_id: string
  user_id: string | null
  action: string // 'user.login', 'document.create', 'api_key.delete'
  resource_type: string // 'user', 'document', 'api_key'
  resource_id: string | null
  metadata: Record<string, any>
  ip_address: string
  user_agent: string
  created_at: Date
}

async function logAuditEvent(
  tenantId: string,
  userId: string | null,
  action: string,
  resource: { type: string; id: string },
  metadata: any,
  req: Request
) {
  await db.auditLogs.create({
    data: {
      tenant_id: tenantId,
      user_id: userId,
      action,
      resource_type: resource.type,
      resource_id: resource.id,
      metadata,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
      created_at: new Date()
    }
  })
}

// Usage
await logAuditEvent(
  tenant.id,
  user.id,
  'document.create',
  { type: 'document', id: doc.id },
  { collection: 'products', title: doc.title },
  req
)
```

**Audit Log UI**:
- Filterable by: user, action, date range
- Searchable
- Exportable (CSV)
- Retention: 90 days (Standard), 1 year (Enterprise)

---

## Customization per Tenant

### Custom Domains

**Setup Flow**:
1. Tenant enters custom domain в settings: `search.customer.com`
2. Platform displays DNS verification requirements:
   - CNAME record: `search.customer.com → proxy.aacsearch.com`
   - TXT record: `aacsearch-verify=<token>`
3. Tenant adds DNS records
4. Platform verifies DNS (polling every 5 min)
5. Once verified, provision SSL certificate (Let's Encrypt)
6. Domain active

**DNS Verification**:
```typescript
import dns from 'dns/promises'

async function verifyDomain(tenantId: string, domain: string): Promise<boolean> {
  const tenant = await getTenant(tenantId)

  // Check TXT record
  try {
    const txtRecords = await dns.resolveTxt(domain)
    const verificationToken = `aacsearch-verify=${tenant.verificationToken}`

    const verified = txtRecords.some(records =>
      records.join('').includes(verificationToken)
    )

    if (!verified) {
      return false
    }
  } catch (error) {
    return false
  }

  // Check CNAME record
  try {
    const cnameRecords = await dns.resolveCname(domain)
    const validCname = cnameRecords.includes('proxy.aacsearch.com')

    if (!validCname) {
      return false
    }
  } catch (error) {
    return false
  }

  // Update tenant
  await db.tenants.update({
    where: { id: tenantId },
    data: {
      custom_domain: domain,
      domain_verified: true,
      domain_verified_at: new Date()
    }
  })

  // Provision SSL certificate
  await provisionSSLCertificate(domain)

  return true
}
```

**SSL Certificate** (Let's Encrypt):
```typescript
import acme from 'acme-client'

async function provisionSSLCertificate(domain: string) {
  const client = new acme.Client({
    directoryUrl: acme.directory.letsencrypt.production,
    accountKey: await acme.crypto.createPrivateKey()
  })

  const [key, csr] = await acme.crypto.createCsr({
    commonName: domain
  })

  const cert = await client.auto({
    csr,
    email: 'ssl@aacsearch.com',
    termsOfServiceAgreed: true,
    challengeCreateFn: async (authz, challenge, keyAuthorization) => {
      // HTTP-01 challenge
      await saveChallenge(domain, challenge.token, keyAuthorization)
    },
    challengeRemoveFn: async (authz, challenge, keyAuthorization) => {
      await removeChallenge(domain, challenge.token)
    }
  })

  // Store certificate в AWS ACM или local
  await storeCertificate(domain, cert, key)

  // Update load balancer/CDN с new certificate
  await updateLoadBalancerCertificate(domain, cert)
}
```

### White-Label / Branding

**Customizable Elements**:
```typescript
interface TenantBranding {
  // Logo
  logoUrl: string | null // uploaded to S3
  faviconUrl: string | null

  // Colors
  primaryColor: string // hex, e.g., '#007bff'
  secondaryColor: string // hex
  accentColor: string // hex

  // Typography
  fontFamily: string // 'Inter', 'Roboto', etc.
  fontSize: number // base size в px

  // UI
  borderRadius: number // 0 (square) to 16 (rounded)
  darkMode: boolean | 'auto' // force dark/light or auto-detect

  // Content
  companyName: string
  supportEmail: string
  customCSS: string | null // advanced customization

  // Footer
  hideFooter: boolean // hide "Powered by AACSearch"
  customFooter: string | null // HTML
}
```

**Theme Application**:
```typescript
// API endpoint для fetching theme
app.get('/api/theme', async (req: RequestWithTenant, res) => {
  const branding = req.tenant.branding || {}

  const theme = {
    logo: branding.logoUrl || '/default-logo.png',
    favicon: branding.faviconUrl || '/default-favicon.ico',
    colors: {
      primary: branding.primaryColor || '#007bff',
      secondary: branding.secondaryColor || '#6c757d',
      accent: branding.accentColor || '#28a745'
    },
    typography: {
      fontFamily: branding.fontFamily || 'Inter',
      fontSize: branding.fontSize || 16
    },
    ui: {
      borderRadius: branding.borderRadius || 4,
      darkMode: branding.darkMode || 'auto'
    },
    footer: {
      hide: branding.hideFooter || false,
      custom: branding.customFooter
    }
  }

  res.json(theme)
})
```

**CSS Variables** (client-side):
```css
:root {
  --color-primary: var(--tenant-primary, #007bff);
  --color-secondary: var(--tenant-secondary, #6c757d);
  --color-accent: var(--tenant-accent, #28a745);
  --font-family: var(--tenant-font, 'Inter', sans-serif);
  --font-size: var(--tenant-font-size, 16px);
  --border-radius: var(--tenant-border-radius, 4px);
}
```

### Feature Flags

**Per-Tenant Feature Toggles**:
```typescript
interface TenantFeatures {
  // Search features
  semanticSearch: boolean // vector search
  nlSearch: boolean // natural language
  conversationalSearch: boolean // RAG
  imageSearch: boolean // CLIP
  voiceSearch: boolean // Whisper

  // Advanced features
  analytics: boolean // analytics dashboard
  merchandising: boolean // synonyms, overrides
  apiAccess: boolean // REST API
  webhooks: boolean // outgoing webhooks

  // Integrations
  customIntegrations: boolean // custom connectors
  sso: boolean // SAML SSO
  customDomain: boolean // custom domain
  whiteLabel: boolean // remove branding

  // Support
  prioritySupport: boolean // faster response times
  dedicatedSlack: boolean // Slack channel
}

// Feature gate middleware
function requireFeature(feature: keyof TenantFeatures) {
  return (req: RequestWithTenant, res, next) => {
    if (!req.tenant.features[feature]) {
      return res.status(403).json({
        error: 'Feature not available',
        message: `Your plan does not include ${feature}`,
        upgrade_url: '/billing/upgrade'
      })
    }
    next()
  }
}

// Usage
app.post('/api/search/semantic',
  tenantMiddleware,
  requireFeature('semanticSearch'),
  async (req, res) => {
    // Semantic search logic
  }
)
```

---

## Billing per Tenant

### Usage Tracking

**Tracked Metrics**:
```typescript
interface TenantUsage {
  tenant_id: string
  period: string // '2024-01', YYYY-MM format

  // Documents
  documents_count: number // current total
  documents_created: number // this month
  documents_deleted: number // this month

  // Search
  searches_count: number // total this month
  searches_by_type: {
    keyword: number
    semantic: number
    nl: number
    conversational: number
  }

  // API
  api_calls_count: number // total this month
  api_calls_by_endpoint: Record<string, number>

  // Storage
  storage_bytes: number // current total

  // Users
  users_count: number // current total

  // Bandwidth
  bandwidth_bytes_in: number // uploaded this month
  bandwidth_bytes_out: number // downloaded this month
}
```

**Usage Collection**:
```typescript
// Middleware для tracking API calls
async function trackUsage(req: RequestWithTenant, res, next) {
  const startTime = Date.now()

  // Continue request
  res.on('finish', async () => {
    const duration = Date.now() - startTime

    // Increment usage counters
    await redis.incr(`usage:${req.tenant.id}:${currentMonth()}:api_calls`)
    await redis.incr(`usage:${req.tenant.id}:${currentMonth()}:${req.path}`)

    // Track search specifically
    if (req.path.includes('/search')) {
      await redis.incr(`usage:${req.tenant.id}:${currentMonth()}:searches`)

      const searchType = req.body.semantic ? 'semantic' : 'keyword'
      await redis.incr(`usage:${req.tenant.id}:${currentMonth()}:searches:${searchType}`)
    }

    // Log to database (batched)
    await logUsageEvent({
      tenant_id: req.tenant.id,
      endpoint: req.path,
      method: req.method,
      status: res.statusCode,
      duration,
      timestamp: new Date()
    })
  })

  next()
}
```

**Usage Aggregation** (cron job):
```typescript
// Runs daily, aggregates usage для billing
async function aggregateUsage() {
  const tenants = await db.tenants.findMany()

  for (const tenant of tenants) {
    const month = currentMonth()

    // Aggregate from Redis
    const apiCalls = await redis.get(`usage:${tenant.id}:${month}:api_calls`)
    const searches = await redis.get(`usage:${tenant.id}:${month}:searches`)

    // Count documents (current total)
    const documentsCount = await db.documents.count({
      where: { tenant_id: tenant.id }
    })

    // Calculate storage
    const storageBytes = await calculateStorageUsage(tenant.id)

    // Upsert usage record
    await db.tenantUsage.upsert({
      where: {
        tenant_id_period: {
          tenant_id: tenant.id,
          period: month
        }
      },
      update: {
        api_calls_count: parseInt(apiCalls || '0'),
        searches_count: parseInt(searches || '0'),
        documents_count: documentsCount,
        storage_bytes: storageBytes,
        updated_at: new Date()
      },
      create: {
        tenant_id: tenant.id,
        period: month,
        api_calls_count: parseInt(apiCalls || '0'),
        searches_count: parseInt(searches || '0'),
        documents_count: documentsCount,
        storage_bytes: storageBytes
      }
    })
  }
}
```

### Stripe Integration

**Metered Billing**:
```typescript
// Report usage к Stripe (daily)
async function reportUsageToStripe() {
  const tenants = await db.tenants.findMany({
    where: {
      plan: { not: 'free' },
      stripe_subscription_id: { not: null }
    }
  })

  for (const tenant of tenants) {
    const usage = await getCurrentUsage(tenant.id)

    // Report overage usage (if any)
    const planLimits = getPlanLimits(tenant.plan)

    if (usage.searches_count > planLimits.searches) {
      const overageSearches = usage.searches_count - planLimits.searches

      // Report to Stripe
      await stripe.subscriptionItems.createUsageRecord(
        tenant.stripe_subscription_item_id,
        {
          quantity: overageSearches,
          timestamp: Math.floor(Date.now() / 1000),
          action: 'set' // or 'increment'
        }
      )
    }
  }
}
```

**Invoice Generation** (via Stripe webhooks):
```typescript
app.post('/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  switch (event.type) {
    case 'invoice.created':
      // Invoice being prepared
      break

    case 'invoice.finalized':
      // Invoice ready, send email
      const invoice = event.data.object
      await sendInvoiceEmail(invoice)
      break

    case 'invoice.paid':
      // Payment successful
      await handlePaymentSuccess(event.data.object)
      break

    case 'invoice.payment_failed':
      // Payment failed
      await handlePaymentFailure(event.data.object)
      break
  }

  res.json({ received: true })
})
```

---

## Scaling Strategies

### Horizontal Scaling

**Application Tier** (stateless):
- Deploy multiple instances (Kubernetes pods)
- Load balanced (ALB или nginx)
- Auto-scaling based on CPU/memory/request rate
- No sticky sessions required

**Database Tier**:
- Read replicas для read-heavy operations
- Connection pooling (PgBouncer)
- Query caching (Redis)
- Periodic vacuuming и analyze

**Search Tier**:
- Typesense cluster (3+ nodes)
- Sharding for large datasets (>100M docs)
- Replication for high availability

### Vertical Scaling

**When horizontal insufficient**:
- Increase instance size
- More CPU, memory, disk
- Larger database instance class
- Bigger search cluster nodes

### Sharding

**Database Sharding** (для very large scale):

**Shard Key**: `tenant_id`

**Shard Distribution**:
```typescript
// Simple modulo sharding
function getShardForTenant(tenantId: string, numShards: number): number {
  const hash = hashCode(tenantId)
  return Math.abs(hash) % numShards
}

// Get database connection for tenant
function getDatabaseForTenant(tenantId: string): Pool {
  const shard = getShardForTenant(tenantId, NUM_SHARDS)
  return databasePools[shard]
}
```

**Challenges**:
- Cross-shard queries (avoid)
- Shard rebalancing (complex)
- Operational overhead

**AACSearch**: Sharding only если >1M tenants или >10TB data.

### Caching Strategy

**Multi-Level Cache**:

**L1: Application Memory** (in-process)
```typescript
import LRU from 'lru-cache'

const schemaCache = new LRU({
  max: 1000, // 1000 collections
  ttl: 1000 * 60 * 5, // 5 minutes
})

async function getCollectionSchema(collectionId: string) {
  // Check L1 cache
  let schema = schemaCache.get(collectionId)
  if (schema) return schema

  // Check L2 cache (Redis)
  schema = await redis.get(`schema:${collectionId}`)
  if (schema) {
    schemaCache.set(collectionId, schema)
    return JSON.parse(schema)
  }

  // Fetch from database
  schema = await db.collections.findUnique({ where: { id: collectionId } })

  // Populate caches
  await redis.set(`schema:${collectionId}`, JSON.stringify(schema), 'EX', 300)
  schemaCache.set(collectionId, schema)

  return schema
}
```

**L2: Redis** (shared across instances)
```typescript
// Cache frequently accessed data
await redis.set(`tenant:${tenantId}`, JSON.stringify(tenant), 'EX', 300)

// Cache search results
await redis.set(
  `search:${tenantId}:${queryHash}`,
  JSON.stringify(results),
  'EX',
  60 // 1 minute (short TTL для search)
)
```

---

## Tenant Management

### Lifecycle

**States**:
- `active`: Normal operation
- `trial`: Free trial period (14 days)
- `suspended`: Payment failed, grace period
- `deleted`: Soft-deleted (30 days retention)
- `archived`: Hard-deleted (data removed)

**State Transitions**:
```typescript
enum TenantStatus {
  ACTIVE = 'active',
  TRIAL = 'trial',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
  ARCHIVED = 'archived'
}

async function changeTenantStatus(tenantId: string, newStatus: TenantStatus) {
  const tenant = await getTenant(tenantId)

  // Validate transition
  const allowedTransitions = {
    [TenantStatus.TRIAL]: [TenantStatus.ACTIVE, TenantStatus.SUSPENDED],
    [TenantStatus.ACTIVE]: [TenantStatus.SUSPENDED, TenantStatus.DELETED],
    [TenantStatus.SUSPENDED]: [TenantStatus.ACTIVE, TenantStatus.DELETED],
    [TenantStatus.DELETED]: [TenantStatus.ARCHIVED],
    [TenantStatus.ARCHIVED]: []
  }

  if (!allowedTransitions[tenant.status].includes(newStatus)) {
    throw new Error(`Invalid status transition: ${tenant.status} → ${newStatus}`)
  }

  // Update status
  await db.tenants.update({
    where: { id: tenantId },
    data: {
      status: newStatus,
      status_changed_at: new Date()
    }
  })

  // Trigger actions based on new status
  switch (newStatus) {
    case TenantStatus.SUSPENDED:
      await handleSuspension(tenantId)
      break
    case TenantStatus.DELETED:
      await scheduleDeletion(tenantId)
      break
    case TenantStatus.ARCHIVED:
      await hardDelete(tenantId)
      break
  }

  // Log status change
  await logAuditEvent(tenantId, null, 'tenant.status_changed', {
    type: 'tenant',
    id: tenantId
  }, {
    old_status: tenant.status,
    new_status: newStatus
  }, req)
}
```

### Onboarding

**Wizard-Driven Onboarding**:
1. **Sign up**: Email + password
2. **Email verification**
3. **Create tenant**: Company name, subdomain
4. **Choose plan**: Free, Starter, Pro
5. **Payment** (если не Free): Stripe Checkout
6. **Quick start wizard**:
   - Create first collection
   - Import sample data
   - Run first search
7. **Complete**: Dashboard

**Onboarding Checklist** (в dashboard):
- ✅ Create tenant
- ✅ Verify email
- ⏳ Create first collection
- ⏳ Index documents
- ⏳ Perform search
- ⏳ Integrate API (optional)
- ⏳ Invite team members (optional)

### Offboarding

**Account Deletion Flow**:
1. User clicks "Delete Account"
2. Confirmation modal (requires password)
3. Grace period: 30 days soft delete
4. Email sent: "Your account will be deleted on YYYY-MM-DD"
5. During grace period: User может cancel deletion
6. After 30 days: Hard delete (automated job)

**Hard Delete Process**:
```typescript
async function hardDeleteTenant(tenantId: string) {
  // 1. Delete documents
  await typesense.collections(`tenant_${tenantId}_*`).delete()

  // 2. Delete database records (cascading)
  await db.tenants.delete({ where: { id: tenantId } })
  // Cascades to: collections, documents, api_keys, integrations, etc.

  // 3. Delete S3 files
  await s3.deleteObjects({
    Bucket: 'aacsearch-production',
    Delete: {
      Objects: await listS3Objects(`tenants/${tenantId}/`)
    }
  })

  // 4. Clear Redis cache
  const keys = await redis.keys(`tenant:${tenantId}:*`)
  if (keys.length > 0) {
    await redis.del(...keys)
  }

  // 5. Log deletion
  await logSystemEvent('tenant.hard_deleted', { tenant_id: tenantId })

  // 6. Send final confirmation email
  await sendEmail(tenant.owner.email, 'Account Deleted', '...')
}
```

---

## Monitoring & Observability

### Per-Tenant Metrics

**Key Metrics**:
```typescript
// Prometheus metrics
const searchLatencyHistogram = new prometheus.Histogram({
  name: 'search_latency_ms',
  help: 'Search latency в milliseconds',
  labelNames: ['tenant_id', 'plan'],
  buckets: [10, 25, 50, 100, 250, 500, 1000, 2500, 5000]
})

const apiRequestCounter = new prometheus.Counter({
  name: 'api_requests_total',
  help: 'Total API requests',
  labelNames: ['tenant_id', 'endpoint', 'status']
})

const errorRateGauge = new prometheus.Gauge({
  name: 'error_rate',
  help: 'Error rate per tenant',
  labelNames: ['tenant_id']
})
```

**Usage**:
```typescript
// Track search latency
const start = Date.now()
const results = await search(tenantId, query)
const latency = Date.now() - start

searchLatencyHistogram.labels(tenantId, tenant.plan).observe(latency)

// Track API request
apiRequestCounter.labels(tenantId, req.path, res.statusCode).inc()
```

### Dashboards

**Grafana Dashboards**:

**System Dashboard** (platform-wide):
- Total tenants (active, trial, suspended)
- Total API requests/sec
- Average search latency (p50, p95, p99)
- Error rate
- Database connections
- Cache hit rate

**Tenant Dashboard** (per-tenant, для admins):
- API requests (today, this month)
- Search latency (p95)
- Error rate
- Top queries
- Active users

### Alerting

**Platform Alerts**:
- High error rate (>1% for 5 min)
- High latency (p95 >100ms for 5 min)
- Database connection pool exhausted
- Disk space >80%
- Memory usage >90%

**Tenant Alerts**:
- Approaching quota limits (>80%)
- Unusual traffic spike (10x normal)
- High error rate для specific tenant
- Payment failure

---

## Summary

### Multi-Tenancy Checklist

✅ **Data Isolation**:
- Row Level Security (RLS) enabled
- Application-level tenant context
- Scoped search keys
- S3 prefix isolation
- Redis namespaces

✅ **Performance Isolation**:
- Per-tenant quotas
- Rate limiting per tenant
- Query timeouts
- Connection pooling
- Noisy neighbor prevention

✅ **Security Isolation**:
- Tenant-scoped JWT
- Tenant-scoped API keys
- Audit logging per tenant
- Separate credentials management

✅ **Customization**:
- Custom domains support
- White-label / branding
- Feature flags per tenant

✅ **Billing**:
- Usage tracking per tenant
- Stripe metered billing
- Quota enforcement

✅ **Scaling**:
- Horizontal scaling (stateless app)
- Database read replicas
- Caching strategy (L1 + L2)
- Sharding readiness

✅ **Management**:
- Tenant lifecycle management
- Onboarding wizard
- Offboarding process
- Monitoring per tenant

**Total Pages**: ~24 pages

