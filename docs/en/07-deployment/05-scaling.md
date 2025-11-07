# Стратегии масштабирования

Полное руководство по горизонтальному и вертикальному масштабированию AACSearch Platform для обработки роста нагрузки.

## Содержание

- [Введение](#введение)
- [Horizontal Scaling](#horizontal-scaling)
- [Vertical Scaling](#vertical-scaling)
- [Database Scaling](#database-scaling)
- [Search Engine Scaling](#search-engine-scaling)
- [Cache Scaling](#cache-scaling)
- [Auto-scaling Strategies](#auto-scaling-strategies)
- [Load Balancing](#load-balancing)
- [Performance Optimization](#performance-optimization)
- [CDN Integration](#cdn-integration)
- [Capacity Planning](#capacity-planning)
- [Cost Optimization](#cost-optimization)
- [Monitoring Scaling](#monitoring-scaling)

---

## Введение

Масштабирование - критически важный аспект SaaS платформы. AACSearch поддерживает несколько стратегий масштабирования:

### Типы масштабирования

**Horizontal Scaling (Scale Out)**:
- ✅ Добавление большего количества instances
- ✅ Linear scalability
- ✅ High availability
- ✅ No downtime
- ❌ Требует stateless architecture
- ❌ Сложнее в настройке

**Vertical Scaling (Scale Up)**:
- ✅ Увеличение ресурсов существующих instances
- ✅ Простота настройки
- ✅ Работает для stateful services
- ❌ Limited by hardware
- ❌ Requires downtime
- ❌ Higher cost per unit

### Scaling Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Traffic Growth                           │
│            100 → 1K → 10K → 100K → 1M users                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │                           │
    ┌────▼────┐              ┌───────▼────────┐
    │Horizontal│              │   Vertical     │
    │ Scaling  │              │   Scaling      │
    └────┬────┘              └───────┬────────┘
         │                           │
    ┌────▼────────────────────────────▼─────────────┐
    │         Application Layer                     │
    │  2 → 4 → 8 → 16 instances (horizontal)        │
    │  1 CPU → 2 CPU → 4 CPU per instance (vertical)│
    └────────────────┬──────────────────────────────┘
                     │
    ┌────────────────┼────────────────────┐
    │                │                    │
┌───▼──────┐   ┌────▼─────┐      ┌───────▼───────┐
│ Database │   │  Cache   │      │Search Engine  │
│ Primary  │   │ Master   │      │   Cluster     │
│    +     │   │    +     │      │   3→5→10      │
│ Replicas │   │ Replicas │      │    nodes      │
└──────────┘   └──────────┘      └───────────────┘
```

---

## Horizontal Scaling

### Application Server Scaling

Stateless приложение позволяет линейное масштабирование:

**Архитектура для horizontal scaling**:
```
┌────────────────────────────────────────────────────┐
│              Load Balancer                         │
│         (Round Robin / Least Connections)          │
└────────────────────┬───────────────────────────────┘
                     │
        ┌────────────┼────────────┬──────────────┐
        │            │            │              │
    ┌───▼──┐     ┌───▼──┐     ┌───▼──┐      ┌───▼──┐
    │App 1 │     │App 2 │     │App 3 │  ... │App N │
    └───┬──┘     └───┬──┘     └───┬──┘      └───┬──┘
        │            │            │              │
        └────────────┼────────────┴──────────────┘
                     │
        ┌────────────┴────────────┐
        │   Shared State Layer    │
        │  (Redis, PostgreSQL)    │
        └─────────────────────────┘
```

### Stateless Design Requirements

**1. Session Management**:

Используйте Redis для хранения sessions:

```typescript
// src/lib/session.ts
import { Redis } from 'ioredis'

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  keyPrefix: 'session:',
})

export async function getSession(sessionId: string) {
  const data = await redis.get(sessionId)
  return data ? JSON.parse(data) : null
}

export async function saveSession(sessionId: string, data: any, ttl = 86400) {
  await redis.setex(sessionId, ttl, JSON.stringify(data))
}

export async function destroySession(sessionId: string) {
  await redis.del(sessionId)
}
```

**2. Sticky Sessions (если необходимо)**:

В Load Balancer конфигурации:

```nginx
# nginx.conf
upstream aacsearch_app {
    ip_hash;  # Sticky sessions на основе IP
    server app1:3000;
    server app2:3000;
    server app3:3000;
    server app4:3000;
}
```

Или в Kubernetes Ingress:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: aacsearch-app
  annotations:
    service.kubernetes.io/session-affinity: "ClientIP"
spec:
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 10800  # 3 hours
```

**3. File Uploads**:

Используйте object storage вместо local filesystem:

```typescript
// src/lib/storage.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function uploadFile(
  file: Buffer,
  key: string,
  contentType: string
) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: file,
    ContentType: contentType,
  })

  await s3Client.send(command)

  return {
    url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`,
    key,
  }
}
```

### Scaling Strategies по Traffic

**Stage 1: Bootstrap (0-1K users)**:
```yaml
replicas: 2
resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 1000m
    memory: 2Gi
```

**Stage 2: Growth (1K-10K users)**:
```yaml
replicas: 4
resources:
  requests:
    cpu: 1000m
    memory: 2Gi
  limits:
    cpu: 2000m
    memory: 4Gi
```

**Stage 3: Scale (10K-100K users)**:
```yaml
replicas: 8
resources:
  requests:
    cpu: 2000m
    memory: 4Gi
  limits:
    cpu: 4000m
    memory: 8Gi
```

**Stage 4: Enterprise (100K+ users)**:
```yaml
replicas: 16+
resources:
  requests:
    cpu: 2000m
    memory: 4Gi
  limits:
    cpu: 4000m
    memory: 8Gi
autoscaling:
  enabled: true
  minReplicas: 16
  maxReplicas: 64
```

---

## Vertical Scaling

### When to Scale Vertically

Vertical scaling подходит для:
- ✅ Databases (PostgreSQL)
- ✅ Cache (Redis)
- ✅ Search engines (Typesense)
- ✅ Monolithic applications
- ❌ Stateless applications (используйте horizontal)

### Database Vertical Scaling

**PostgreSQL resource progression**:

```
Stage 1: Development
- CPU: 2 cores
- RAM: 4 GB
- Storage: 100 GB

Stage 2: Small Production
- CPU: 4 cores
- RAM: 16 GB
- Storage: 500 GB

Stage 3: Medium Production
- CPU: 8 cores
- RAM: 32 GB
- Storage: 1 TB

Stage 4: Large Production
- CPU: 16 cores
- RAM: 64 GB
- Storage: 2 TB

Stage 5: Enterprise
- CPU: 32+ cores
- RAM: 128+ GB
- Storage: 5+ TB
```

### Scaling Procedure (Zero Downtime)

**Для Kubernetes StatefulSet**:

```bash
# 1. Update resource requests/limits
kubectl patch statefulset postgres -n aacsearch-production -p '
{
  "spec": {
    "template": {
      "spec": {
        "containers": [
          {
            "name": "postgres",
            "resources": {
              "requests": {
                "cpu": "8000m",
                "memory": "32Gi"
              },
              "limits": {
                "cpu": "16000m",
                "memory": "64Gi"
              }
            }
          }
        ]
      }
    }
  }
}'

# 2. Rolling restart (один pod за раз)
kubectl rollout restart statefulset postgres -n aacsearch-production

# 3. Monitor
kubectl rollout status statefulset postgres -n aacsearch-production
```

**Для AWS RDS**:

```bash
# Scale up (с downtime)
aws rds modify-db-instance \
  --db-instance-identifier aacsearch-production \
  --db-instance-class db.r6g.2xlarge \
  --apply-immediately

# Scale storage (без downtime)
aws rds modify-db-instance \
  --db-instance-identifier aacsearch-production \
  --allocated-storage 1000 \
  --apply-immediately
```

---

## Database Scaling

### Read Replicas

Распределение read нагрузки на replicas:

**Architecture**:
```
┌─────────────────────────────────────────────┐
│           Application Layer                 │
└──────────┬───────────────────┬──────────────┘
           │                   │
      Write│              Read │
           │                   │
    ┌──────▼──────┐      ┌─────▼──────────────┐
    │  Primary    │      │  Read Replicas     │
    │  (Master)   │─────▶│  ┌─────┐ ┌─────┐   │
    │  Writes +   │      │  │Rep1 │ │Rep2 │   │
    │  Reads      │      │  └─────┘ └─────┘   │
    └─────────────┘      └────────────────────┘
        WAL/Logical
        Replication
```

**Payload CMS configuration для read replicas**:

```typescript
// payload.config.ts
import { buildConfig } from 'payload/config'
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  db: postgresAdapter({
    pool: {
      // Primary для writes
      connectionString: process.env.DATABASE_URI,
    },
    // Read replicas configuration
    readReplicaPool: [
      {
        connectionString: process.env.DATABASE_READ_REPLICA_1_URI,
      },
      {
        connectionString: process.env.DATABASE_READ_REPLICA_2_URI,
      },
    ],
  }),
})
```

**Custom read/write splitting**:

```typescript
// src/lib/database.ts
import { Pool } from 'pg'

// Write pool (primary)
export const writePool = new Pool({
  connectionString: process.env.DATABASE_URI,
  max: 50,
  idleTimeoutMillis: 30000,
})

// Read pools (replicas)
const readPools = [
  new Pool({
    connectionString: process.env.DATABASE_READ_REPLICA_1_URI,
    max: 50,
  }),
  new Pool({
    connectionString: process.env.DATABASE_READ_REPLICA_2_URI,
    max: 50,
  }),
]

let currentReadPoolIndex = 0

// Round-robin load balancing для read queries
export function getReadPool(): Pool {
  const pool = readPools[currentReadPoolIndex]
  currentReadPoolIndex = (currentReadPoolIndex + 1) % readPools.length
  return pool
}

// Utility functions
export async function executeWrite(query: string, params?: any[]) {
  return writePool.query(query, params)
}

export async function executeRead(query: string, params?: any[]) {
  return getReadPool().query(query, params)
}
```

### Connection Pooling

**PgBouncer для connection pooling**:

```ini
# pgbouncer.ini
[databases]
aacsearch = host=postgres-primary.internal port=5432 dbname=aacsearch

[pgbouncer]
listen_addr = *
listen_port = 6432
auth_type = scram-sha-256
auth_file = /etc/pgbouncer/userlist.txt

# Pool configuration
pool_mode = transaction
max_client_conn = 10000
default_pool_size = 25
min_pool_size = 5
reserve_pool_size = 5
reserve_pool_timeout = 3

# Connection limits
server_lifetime = 3600
server_idle_timeout = 600
server_connect_timeout = 15
server_login_retry = 15

# Performance
query_timeout = 30
query_wait_timeout = 120
client_idle_timeout = 0
idle_transaction_timeout = 0
```

**Kubernetes Deployment для PgBouncer**:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pgbouncer
  namespace: aacsearch-production
spec:
  replicas: 2
  selector:
    matchLabels:
      app: pgbouncer
  template:
    metadata:
      labels:
        app: pgbouncer
    spec:
      containers:
        - name: pgbouncer
          image: edoburu/pgbouncer:latest
          ports:
            - containerPort: 6432
          env:
            - name: DATABASES_HOST
              value: postgres
            - name: DATABASES_PORT
              value: "5432"
            - name: DATABASES_DBNAME
              value: aacsearch
            - name: PGBOUNCER_AUTH_TYPE
              value: scram-sha-256
            - name: PGBOUNCER_POOL_MODE
              value: transaction
            - name: PGBOUNCER_MAX_CLIENT_CONN
              value: "10000"
            - name: PGBOUNCER_DEFAULT_POOL_SIZE
              value: "25"
          resources:
            requests:
              cpu: 500m
              memory: 512Mi
            limits:
              cpu: 1000m
              memory: 1Gi
---
apiVersion: v1
kind: Service
metadata:
  name: pgbouncer
  namespace: aacsearch-production
spec:
  selector:
    app: pgbouncer
  ports:
    - port: 6432
      targetPort: 6432
```

### Query Optimization

**Index optimization**:

```sql
-- Analyze query performance
EXPLAIN ANALYZE
SELECT * FROM collections
WHERE tenant_id = '123' AND status = 'active'
ORDER BY created_at DESC
LIMIT 10;

-- Create composite index
CREATE INDEX CONCURRENTLY idx_collections_tenant_status_created
ON collections(tenant_id, status, created_at DESC);

-- Analyze table statistics
ANALYZE collections;

-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Find unused indexes
SELECT
  schemaname,
  tablename,
  indexname
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexname NOT LIKE 'pg_toast%';
```

**Query batching**:

```typescript
// Bad - N+1 queries
for (const collection of collections) {
  const documents = await payload.find({
    collection: 'documents',
    where: {
      collection_id: { equals: collection.id },
    },
  })
  collection.documents = documents
}

// Good - Single query with JOIN
const collectionsWithDocuments = await payload.db.pool.query(`
  SELECT
    c.*,
    json_agg(d.*) as documents
  FROM collections c
  LEFT JOIN documents d ON d.collection_id = c.id
  WHERE c.tenant_id = $1
  GROUP BY c.id
`, [tenantId])
```

### Partitioning

**Table partitioning по tenant_id**:

```sql
-- Create partitioned table
CREATE TABLE analytics_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL,
  event_type varchar(100) NOT NULL,
  data jsonb,
  created_at timestamp with time zone DEFAULT now()
) PARTITION BY HASH (tenant_id);

-- Create partitions
CREATE TABLE analytics_events_p0 PARTITION OF analytics_events
  FOR VALUES WITH (MODULUS 4, REMAINDER 0);

CREATE TABLE analytics_events_p1 PARTITION OF analytics_events
  FOR VALUES WITH (MODULUS 4, REMAINDER 1);

CREATE TABLE analytics_events_p2 PARTITION OF analytics_events
  FOR VALUES WITH (MODULUS 4, REMAINDER 2);

CREATE TABLE analytics_events_p3 PARTITION OF analytics_events
  FOR VALUES WITH (MODULUS 4, REMAINDER 3);

-- Create indexes на каждый partition
CREATE INDEX idx_analytics_p0_tenant ON analytics_events_p0(tenant_id);
CREATE INDEX idx_analytics_p1_tenant ON analytics_events_p1(tenant_id);
CREATE INDEX idx_analytics_p2_tenant ON analytics_events_p2(tenant_id);
CREATE INDEX idx_analytics_p3_tenant ON analytics_events_p3(tenant_id);
```

---

## Search Engine Scaling

### Typesense Cluster Expansion

**From 3 to 5 nodes**:

```bash
# Add 2 new nodes to existing cluster
kubectl scale statefulset typesense -n aacsearch-production --replicas=5

# Update service discovery
kubectl patch configmap aacsearch-config -n aacsearch-production -p '
{
  "data": {
    "TYPESENSE_NODES": "typesense-0.typesense-headless:8107,typesense-1.typesense-headless:8107,typesense-2.typesense-headless:8107,typesense-3.typesense-headless:8107,typesense-4.typesense-headless:8107"
  }
}'

# Restart app pods для pickup новой конфигурации
kubectl rollout restart deployment aacsearch-app -n aacsearch-production
```

### Sharding Strategy

**Collection sharding**:

```typescript
// src/lib/typesense-sharding.ts
import Typesense from 'typesense'

// Multiple Typesense clusters для sharding
const clusters = [
  new Typesense.Client({
    nodes: [
      { host: 'typesense-cluster-1', port: '8108', protocol: 'http' },
    ],
    apiKey: process.env.TYPESENSE_API_KEY_1!,
  }),
  new Typesense.Client({
    nodes: [
      { host: 'typesense-cluster-2', port: '8108', protocol: 'http' },
    ],
    apiKey: process.env.TYPESENSE_API_KEY_2!,
  }),
  new Typesense.Client({
    nodes: [
      { host: 'typesense-cluster-3', port: '8108', protocol: 'http' },
    ],
    apiKey: process.env.TYPESENSE_API_KEY_3!,
  }),
]

// Hash-based sharding
export function getClusterForTenant(tenantId: string): Typesense.Client {
  const hash = tenantId
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const clusterIndex = hash % clusters.length
  return clusters[clusterIndex]
}

// Usage
export async function searchDocuments(tenantId: string, query: string) {
  const client = getClusterForTenant(tenantId)

  return client
    .collections(`tenant_${tenantId}_documents`)
    .documents()
    .search({
      q: query,
      query_by: 'title,content',
    })
}
```

### Search Performance Optimization

**1. Collection schema optimization**:

```typescript
// Optimized schema
const schema = {
  name: `tenant_${tenantId}_documents`,
  fields: [
    { name: 'id', type: 'string' },
    { name: 'title', type: 'string' },
    { name: 'content', type: 'string' },
    {
      name: 'created_at',
      type: 'int64',
      facet: false,
      sort: true,
    },
    {
      name: 'status',
      type: 'string',
      facet: true, // Для filtering
    },
    {
      name: 'tags',
      type: 'string[]',
      facet: true,
    },
  ],
  default_sorting_field: 'created_at',
}
```

**2. Query caching**:

```typescript
// src/lib/search-cache.ts
import { redis } from './redis'

export async function searchWithCache(
  tenantId: string,
  query: string,
  filters: any
) {
  const cacheKey = `search:${tenantId}:${query}:${JSON.stringify(filters)}`

  // Check cache
  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  // Execute search
  const client = getClusterForTenant(tenantId)
  const results = await client
    .collections(`tenant_${tenantId}_documents`)
    .documents()
    .search({
      q: query,
      query_by: 'title,content',
      filter_by: filters,
    })

  // Cache results (5 minutes)
  await redis.setex(cacheKey, 300, JSON.stringify(results))

  return results
}
```

**3. Index maintenance**:

```typescript
// Periodic reindexing job
async function reindexCollection(tenantId: string, collectionId: string) {
  const client = getClusterForTenant(tenantId)
  const collectionName = `tenant_${tenantId}_collection_${collectionId}`

  // Get all documents from database
  const documents = await payload.find({
    collection: 'documents',
    where: {
      tenant_id: { equals: tenantId },
      collection_id: { equals: collectionId },
    },
    limit: 10000,
  })

  // Delete old collection
  try {
    await client.collections(collectionName).delete()
  } catch (error) {
    // Collection might not exist
  }

  // Create new collection
  await client.collections().create(schema)

  // Bulk import
  const importResults = await client
    .collections(collectionName)
    .documents()
    .import(documents.docs, { action: 'create' })

  return importResults
}
```

---

## Cache Scaling

### Redis Cluster Mode

**3 masters + 3 replicas configuration**:

```
Master 1 (slots 0-5461)     → Replica 1
  ↓
Write/Read

Master 2 (slots 5462-10922) → Replica 2
  ↓
Write/Read

Master 3 (slots 10923-16383)→ Replica 3
  ↓
Write/Read
```

### Cache Strategy Optimization

**1. Cache warming**:

```typescript
// src/jobs/cache-warming.ts
import { redis } from '@/lib/redis'
import { payload } from 'payload'

export async function warmCache() {
  console.log('Starting cache warming...')

  // Warm frequently accessed data
  const tenants = await payload.find({
    collection: 'tenants',
    where: {
      status: { equals: 'active' },
    },
    limit: 1000,
  })

  for (const tenant of tenants.docs) {
    // Cache tenant settings
    const settings = await payload.findByID({
      collection: 'tenant-settings',
      id: tenant.settings_id,
    })

    await redis.setex(
      `tenant:${tenant.id}:settings`,
      3600,
      JSON.stringify(settings)
    )

    // Cache active collections
    const collections = await payload.find({
      collection: 'collections',
      where: {
        tenant_id: { equals: tenant.id },
        status: { equals: 'active' },
      },
      limit: 100,
    })

    await redis.setex(
      `tenant:${tenant.id}:collections`,
      1800,
      JSON.stringify(collections.docs)
    )
  }

  console.log('Cache warming completed')
}

// Run on startup and periodically
setInterval(warmCache, 3600000) // Every hour
```

**2. Cache invalidation**:

```typescript
// src/lib/cache-invalidation.ts
export async function invalidateTenantCache(tenantId: string) {
  const pattern = `tenant:${tenantId}:*`

  // Get all keys matching pattern
  const keys = await redis.keys(pattern)

  if (keys.length > 0) {
    await redis.del(...keys)
  }

  console.log(`Invalidated ${keys.length} cache entries for tenant ${tenantId}`)
}

// Use in Payload hooks
const Collections: CollectionConfig = {
  slug: 'collections',
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        await invalidateTenantCache(doc.tenant_id)
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        await invalidateTenantCache(doc.tenant_id)
      },
    ],
  },
}
```

**3. Multi-tier caching**:

```typescript
// L1: In-memory cache (Node.js)
// L2: Redis cache
// L3: Database

import LRU from 'lru-cache'

// L1 cache (in-memory, per instance)
const l1Cache = new LRU({
  max: 1000,
  ttl: 60000, // 1 minute
  updateAgeOnGet: true,
})

export async function getCachedData(key: string) {
  // L1: Check memory
  let data = l1Cache.get(key)
  if (data) {
    return { data, source: 'memory' }
  }

  // L2: Check Redis
  const cached = await redis.get(key)
  if (cached) {
    data = JSON.parse(cached)
    l1Cache.set(key, data) // Populate L1
    return { data, source: 'redis' }
  }

  // L3: Database
  data = await fetchFromDatabase(key)
  if (data) {
    l1Cache.set(key, data) // Populate L1
    await redis.setex(key, 3600, JSON.stringify(data)) // Populate L2
    return { data, source: 'database' }
  }

  return { data: null, source: null }
}
```

---

## Auto-scaling Strategies

### Horizontal Pod Autoscaler (HPA)

**Advanced HPA configuration**:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: aacsearch-app-hpa
  namespace: aacsearch-production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: aacsearch-app

  minReplicas: 4
  maxReplicas: 32

  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 10
          periodSeconds: 60
        - type: Pods
          value: 2
          periodSeconds: 60
      selectPolicy: Min

    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
        - type: Percent
          value: 100
          periodSeconds: 15
        - type: Pods
          value: 4
          periodSeconds: 15
      selectPolicy: Max

  metrics:
    # CPU
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70

    # Memory
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80

    # Custom: Requests per second
    - type: Pods
      pods:
        metric:
          name: http_requests_per_second
        target:
          type: AverageValue
          averageValue: "1000"

    # Custom: Queue length
    - type: Pods
      pods:
        metric:
          name: queue_length
        target:
          type: AverageValue
          averageValue: "100"

    # Custom: Response time
    - type: Pods
      pods:
        metric:
          name: http_request_duration_p95
        target:
          type: AverageValue
          averageValue: "500m"  # 500ms
```

### Predictive Auto-scaling

**Использование исторических данных**:

```typescript
// src/jobs/predictive-scaling.ts
import { k8s } from '@kubernetes/client-node'

interface ScalingPrediction {
  timestamp: Date
  predictedLoad: number
  recommendedReplicas: number
}

export async function predictScaling(): Promise<ScalingPrediction> {
  // Fetch historical metrics from Prometheus
  const now = new Date()
  const hourOfDay = now.getHours()
  const dayOfWeek = now.getDay()

  // Historical patterns (можно хранить в database)
  const historicalPatterns = await getHistoricalPatterns(hourOfDay, dayOfWeek)

  // Calculate predicted load
  const predictedLoad = calculatePredictedLoad(historicalPatterns)

  // Calculate recommended replicas
  const currentReplicas = await getCurrentReplicas()
  const recommendedReplicas = Math.ceil(predictedLoad / 1000) // 1000 RPS per replica

  // If significant difference, pre-scale
  if (recommendedReplicas > currentReplicas * 1.5) {
    await scaleDeployment(recommendedReplicas)
    console.log(`Predictive scaling: ${currentReplicas} → ${recommendedReplicas}`)
  }

  return {
    timestamp: now,
    predictedLoad,
    recommendedReplicas,
  }
}

// Run every 15 minutes
setInterval(predictScaling, 900000)
```

### Cluster Autoscaler

**Node auto-scaling configuration**:

```yaml
# AWS
apiVersion: v1
kind: ConfigMap
metadata:
  name: cluster-autoscaler
  namespace: kube-system
data:
  configuration: |
    {
      "minNodes": 3,
      "maxNodes": 20,
      "scaleDownDelayAfterAdd": "10m",
      "scaleDownUnneededTime": "10m",
      "scaleDownUtilizationThreshold": 0.5
    }
```

---

## Load Balancing

### Load Balancing Algorithms

**1. Round Robin**:
```nginx
upstream aacsearch_app {
    server app1:3000;
    server app2:3000;
    server app3:3000;
    server app4:3000;
}
```

**2. Least Connections**:
```nginx
upstream aacsearch_app {
    least_conn;
    server app1:3000;
    server app2:3000;
    server app3:3000;
    server app4:3000;
}
```

**3. IP Hash (Sticky Sessions)**:
```nginx
upstream aacsearch_app {
    ip_hash;
    server app1:3000;
    server app2:3000;
    server app3:3000;
    server app4:3000;
}
```

**4. Weighted**:
```nginx
upstream aacsearch_app {
    server app1:3000 weight=3;
    server app2:3000 weight=2;
    server app3:3000 weight=1;
    server app4:3000 weight=1;
}
```

### Health Checks

```nginx
upstream aacsearch_app {
    least_conn;

    server app1:3000 max_fails=3 fail_timeout=30s;
    server app2:3000 max_fails=3 fail_timeout=30s;
    server app3:3000 max_fails=3 fail_timeout=30s;
    server app4:3000 max_fails=3 fail_timeout=30s;

    keepalive 32;
}

server {
    location / {
        proxy_pass http://aacsearch_app;
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;
        proxy_next_upstream_tries 2;
    }

    location /health {
        access_log off;
        proxy_pass http://aacsearch_app/health/live;
    }
}
```

---

## Performance Optimization

### Application-level Optimizations

**1. Code splitting**:

```typescript
// next.config.js
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1]
              return `npm.${packageName.replace('@', '')}`
            },
          },
        },
      }
    }
    return config
  },
}
```

**2. Lazy loading**:

```typescript
// Dynamic imports для heavy components
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
})

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <HeavyChart data={data} />
    </div>
  )
}
```

**3. Image optimization**:

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['aacsearch.com', 'cdn.aacsearch.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },
}
```

**4. API response caching**:

```typescript
// src/app/api/collections/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const collections = await fetchCollections()

  return NextResponse.json(collections, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
```

---

## CDN Integration

### CloudFlare Configuration

```javascript
// CloudFlare Workers для edge caching
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  // Cache static assets агрессивно
  if (url.pathname.startsWith('/_next/static/')) {
    const cache = caches.default
    let response = await cache.match(request)

    if (!response) {
      response = await fetch(request)
      const headers = new Headers(response.headers)
      headers.set('Cache-Control', 'public, max-age=31536000, immutable')
      response = new Response(response.body, { headers })
      event.waitUntil(cache.put(request, response.clone()))
    }

    return response
  }

  // Cache API responses с shorter TTL
  if (url.pathname.startsWith('/api/')) {
    const cache = caches.default
    const cacheKey = new Request(url.toString(), request)
    let response = await cache.match(cacheKey)

    if (!response) {
      response = await fetch(request)
      if (response.status === 200) {
        const headers = new Headers(response.headers)
        headers.set('Cache-Control', 'public, s-maxage=60')
        response = new Response(response.body, { headers })
        event.waitUntil(cache.put(cacheKey, response.clone()))
      }
    }

    return response
  }

  // Default
  return fetch(request)
}
```

---

## Capacity Planning

### Growth Projection

**Example: 12-month growth plan**:

| Month | Tenants | Users    | Documents | Search QPS | App Instances | DB Size | Cost/mo |
|-------|---------|----------|-----------|------------|---------------|---------|---------|
| 1     | 100     | 1,000    | 100K      | 50         | 2             | 50GB    | $900    |
| 3     | 300     | 5,000    | 500K      | 150        | 4             | 150GB   | $1,800  |
| 6     | 600     | 15,000   | 1.5M      | 400        | 8             | 400GB   | $3,500  |
| 9     | 900     | 30,000   | 3M        | 700        | 12            | 800GB   | $5,000  |
| 12    | 1,200   | 50,000   | 5M        | 1,000      | 16            | 1.5TB   | $7,000  |

### Resource Calculator

```typescript
// src/lib/capacity-planning.ts
export function calculateRequiredResources(metrics: {
  tenants: number
  users: number
  documents: number
  searchQPS: number
}) {
  // Application instances (1 instance per 3K concurrent users)
  const appInstances = Math.ceil(metrics.users / 3000)

  // Database size (average 1KB per document + overhead)
  const dbSizeGB = Math.ceil((metrics.documents * 1024) / 1024 / 1024 / 1024)

  // Search cluster (1 node per 200 QPS)
  const searchNodes = Math.max(3, Math.ceil(metrics.searchQPS / 200))

  // Cache memory (10MB per 1K users)
  const cacheMemoryGB = Math.ceil((metrics.users / 1000) * 10) / 1024

  return {
    appInstances,
    dbSizeGB,
    searchNodes,
    cacheMemoryGB,
    estimatedCostUSD: calculateCost({
      appInstances,
      dbSizeGB,
      searchNodes,
      cacheMemoryGB,
    }),
  }
}
```

---

## Cost Optimization

### Reserved Instances

```bash
# AWS Reserved Instances (1-year commitment, ~30% savings)
aws ec2 purchase-reserved-instances-offering \
  --reserved-instances-offering-id <offering-id> \
  --instance-count 4

# Savings Plans (more flexible)
aws savingsplans create-savings-plan \
  --savings-plan-offering-id <offering-id> \
  --commitment 1000 \
  --upfront-payment-amount 0
```

### Spot Instances для Non-Critical Workloads

```yaml
# Kubernetes node group с spot instances
apiVersion: v1
kind: ConfigMap
metadata:
  name: spot-instances-config
data:
  nodeSelector: |
    node.kubernetes.io/instance-type: spot

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: background-jobs
spec:
  replicas: 3
  template:
    spec:
      nodeSelector:
        node.kubernetes.io/instance-type: spot
      tolerations:
        - key: spot
          operator: Equal
          value: "true"
          effect: NoSchedule
```

---

## Monitoring Scaling

### Key Metrics

```typescript
// src/lib/metrics.ts
import { Registry, Counter, Histogram, Gauge } from 'prom-client'

export const register = new Registry()

// Request metrics
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  registers: [register],
})

// Scaling metrics
export const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  registers: [register],
})

export const queueLength = new Gauge({
  name: 'queue_length',
  help: 'Length of job queue',
  registers: [register],
})

// Resource metrics
export const memoryUsage = new Gauge({
  name: 'memory_usage_bytes',
  help: 'Memory usage in bytes',
  registers: [register],
})
```

**Смотрите полную документацию по мониторингу**: [07-monitoring.md](07-monitoring.md)

---

**Следующие шаги**:
- Для настройки мониторинга, смотрите [07-monitoring.md](07-monitoring.md)
- Для disaster recovery, смотрите [08-disaster-recovery.md](08-disaster-recovery.md)
