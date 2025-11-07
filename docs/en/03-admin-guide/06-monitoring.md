# Мониторинг и метрики

> Полное руководство по мониторингу AACSearch Platform — health checks, метрики, dashboards, alerting.

## Содержание

- [Dashboard Overview](#dashboard-overview)
- [Метрики использования](#метрики-использования)
- [Search Analytics](#search-analytics)
- [API Usage Stats](#api-usage-stats)
- [Performance Metrics](#performance-metrics)
- [Error Tracking](#error-tracking)
- [Health Checks](#health-checks)
- [Prometheus Metrics](#prometheus-metrics)
- [Grafana Dashboards](#grafana-dashboards)
- [Alerting](#alerting)

---

## Dashboard Overview

### Admin Dashboard

**URL:** `https://yourdomain.com/admin/dashboard`

**Основные метрики:**

```typescript
interface DashboardMetrics {
  tenants: {
    total: number
    active: number
    trial: number
  }
  users: {
    total: number
    activeToday: number
    newThisMonth: number
  }
  searches: {
    today: number
    thisMonth: number
    averageLatency: number
  }
  revenue: {
    mrr: number // Monthly Recurring Revenue
    arr: number // Annual Recurring Revenue
    churnRate: number
  }
  system: {
    uptime: number
    cpu: number
    memory: number
    storage: number
  }
}
```

### Endpoint

```http
GET /api/admin/dashboard/metrics
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "tenants": {
    "total": 142,
    "active": 128,
    "trial": 14
  },
  "users": {
    "total": 2456,
    "activeToday": 842,
    "newThisMonth": 156
  },
  "searches": {
    "today": 45230,
    "thisMonth": 1234567,
    "averageLatency": 45
  },
  "revenue": {
    "mrr": 12800,
    "arr": 153600,
    "churnRate": 2.3
  },
  "system": {
    "uptime": 99.98,
    "cpu": 42,
    "memory": 68,
    "storage": 45
  }
}
```

---

## Метрики использования

### Usage Counters

```typescript
interface UsageMetrics {
  tenant: string
  period: {
    start: Date
    end: Date
  }
  searches: {
    count: number
    limit: number
    percentage: number
  }
  documents: {
    count: number
    limit: number
    percentage: number
  }
  users: {
    count: number
    limit: number
    percentage: number
  }
  storage: {
    bytesUsed: number
    limit: number
    percentage: number
  }
}
```

### Endpoint

```http
GET /api/usage?tenantId=tenant_abc123
```

**Response:**
```json
{
  "tenant": "acme-corp",
  "period": {
    "start": "2025-11-01T00:00:00Z",
    "end": "2025-12-01T00:00:00Z"
  },
  "searches": {
    "count": 234560,
    "limit": 500000,
    "percentage": 46.9
  },
  "documents": {
    "count": 45230,
    "limit": 100000,
    "percentage": 45.2
  },
  "users": {
    "count": 12,
    "limit": 25,
    "percentage": 48.0
  },
  "storage": {
    "bytesUsed": 4515840000,
    "limit": 10737418240,
    "percentage": 42.0
  }
}
```

### Alerts при приближении к лимитам

```typescript
async function checkUsageLimits(tenantId: string) {
  const usage = await getUsageMetrics(tenantId)
  const alerts = []

  // 80% threshold
  if (usage.searches.percentage > 80) {
    alerts.push({
      type: 'usage_warning',
      resource: 'searches',
      message: `${usage.searches.percentage}% of search limit used`,
      recommendation: 'Consider upgrading plan',
    })
  }

  if (alerts.length > 0) {
    await sendUsageAlerts(tenantId, alerts)
  }
}

// Запускать каждый день
schedule.every('day').at('09:00').do(checkAllTenantsUsage)
```

---

## Search Analytics

### Типы аналитики

```typescript
interface SearchAnalytics {
  popularQueries: Array<{
    query: string
    count: number
    averageResults: number
  }>
  noResultsQueries: Array<{
    query: string
    count: number
  }>
  averageLatency: number
  totalSearches: number
  uniqueUsers: number
  clickThroughRate: number
}
```

### Endpoint

```http
GET /api/analytics/search?tenantId=tenant_abc123&from=2025-11-01&to=2025-11-30
```

**Response:**
```json
{
  "popularQueries": [
    { "query": "laptop", "count": 1234, "averageResults": 45 },
    { "query": "phone", "count": 987, "averageResults": 32 }
  ],
  "noResultsQueries": [
    { "query": "rare product xyz", "count": 12 }
  ],
  "averageLatency": 45,
  "totalSearches": 45230,
  "uniqueUsers": 842,
  "clickThroughRate": 68.5
}
```

### Typesense Analytics

```typescript
// Включить analytics в Typesense
await typesense.collections('products').update({
  enable_nested_fields: true,
})

// Создать analytics rule
await typesense.analytics.rules().create({
  name: 'search_analytics',
  type: 'popular_queries',
  params: {
    source: {
      collections: ['products'],
    },
    destination: {
      collection: 'search_analytics',
    },
    limit: 1000,
  },
})

// Получить популярные запросы
const popularQueries = await typesense
  .collections('search_analytics')
  .documents()
  .search({
    q: '*',
    sort_by: 'count:desc',
  })
```

---

## API Usage Stats

### Метрики API

```typescript
interface APIStats {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageLatency: number
  p95Latency: number
  p99Latency: number
  topEndpoints: Array<{
    endpoint: string
    count: number
    averageLatency: number
  }>
  topErrors: Array<{
    error: string
    count: number
  }>
}
```

### Реализация

```typescript
// Middleware для tracking
let requestMetrics = []

app.use((req, res, next) => {
  const start = Date.now()

  res.on('finish', () => {
    const latency = Date.now() - start

    requestMetrics.push({
      endpoint: req.path,
      method: req.method,
      status: res.statusCode,
      latency,
      timestamp: new Date(),
    })

    // Очистка старых метрик (хранить 1 час)
    const oneHourAgo = Date.now() - 3600000
    requestMetrics = requestMetrics.filter(m => m.timestamp > oneHourAgo)
  })

  next()
})

// Endpoint для статистики
app.get('/api/stats', (req, res) => {
  const stats = calculateStats(requestMetrics)
  res.json(stats)
})
```

---

## Performance Metrics

### Ключевые метрики

```typescript
interface PerformanceMetrics {
  database: {
    activeConnections: number
    averageQueryTime: number
    slowQueries: number
  }
  typesense: {
    memoryUsage: number
    cpuUsage: number
    averageSearchLatency: number
  }
  nodejs: {
    uptime: number
    memoryUsage: {
      rss: number
      heapUsed: number
      heapTotal: number
    }
    eventLoopDelay: number
  }
}
```

### Мониторинг производительности

```typescript
import { performance } from 'perf_hooks'

// Database query timing
async function monitoredQuery(sql: string, params: any[]) {
  const start = performance.now()
  
  try {
    const result = await db.query(sql, params)
    const duration = performance.now() - start

    if (duration > 1000) {
      console.warn(`Slow query (${duration}ms):`, sql)
      
      await logSlowQuery({
        sql,
        duration,
        timestamp: new Date(),
      })
    }

    return result
  } catch (error) {
    const duration = performance.now() - start
    
    await logFailedQuery({
      sql,
      error: error.message,
      duration,
    })
    
    throw error
  }
}
```

---

## Error Tracking

### Error Monitoring

```typescript
interface ErrorLog {
  id: string
  timestamp: Date
  error: {
    name: string
    message: string
    stack: string
  }
  context: {
    user?: string
    tenant?: string
    endpoint: string
    method: string
  }
  request: {
    headers: object
    body: object
    query: object
  }
  environment: string
}
```

### Global Error Handler

```typescript
// Express error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const errorLog: ErrorLog = {
    timestamp: new Date(),
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
    },
    context: {
      user: req.user?.id,
      tenant: req.headers['x-tenant-id'],
      endpoint: req.path,
      method: req.method,
    },
    request: {
      headers: sanitizeHeaders(req.headers),
      body: sanitizeBody(req.body),
      query: req.query,
    },
    environment: process.env.NODE_ENV,
  }

  // Логировать
  console.error('Error:', errorLog)

  // Отправить в Sentry/другой сервис
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err, {
      extra: errorLog,
    })
  }

  // Ответ клиенту
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})
```

---

## Health Checks

### Endpoints

**Базовый health check:**
```http
GET /api/health
```

**Response (здоровая система):**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-02T10:00:00Z",
  "uptime": 86400,
  "checks": {
    "database": {
      "status": "healthy",
      "latency": 5
    },
    "typesense": {
      "status": "healthy",
      "latency": 8
    }
  }
}
```

**Response (проблемы):**
```json
{
  "status": "degraded",
  "timestamp": "2025-11-02T10:00:00Z",
  "uptime": 86400,
  "checks": {
    "database": {
      "status": "healthy",
      "latency": 5
    },
    "typesense": {
      "status": "unhealthy",
      "message": "Connection timeout",
      "latency": null
    }
  }
}
```

### Реализация

См. `/src/endpoints/health.ts`:

```typescript
export const healthCheckHandler: PayloadHandler = async (req) => {
  const checks = {}

  // Database
  try {
    const start = Date.now()
    await req.payload.find({ collection: 'users', limit: 1 })
    checks.database = {
      status: 'healthy',
      latency: Date.now() - start,
    }
  } catch (error) {
    checks.database = {
      status: 'unhealthy',
      message: error.message,
    }
  }

  // Typesense
  try {
    const start = Date.now()
    await typesense.health.retrieve()
    checks.typesense = {
      status: 'healthy',
      latency: Date.now() - start,
    }
  } catch (error) {
    checks.typesense = {
      status: 'unhealthy',
      message: error.message,
    }
  }

  const allHealthy = Object.values(checks).every(c => c.status === 'healthy')

  return Response.json({
    status: allHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks,
  }, {
    status: allHealthy ? 200 : 503,
  })
}
```

### Readiness Check

Для Kubernetes/orchestrators:

```http
GET /api/health/ready
```

Проверяет готовность к приему трафика:
- ✅ Database подключена
- ✅ Typesense доступен
- ✅ Необходимые коллекции существуют

### Liveness Check

```http
GET /api/health/live
```

Проверяет живой ли процесс (для автоматического рестарта).

---

## Prometheus Metrics

### Экспорт метрик

```http
GET /api/metrics
```

**Response (Prometheus format):**
```prometheus
# HELP nodejs_memory_rss_bytes Resident Set Size in bytes
# TYPE nodejs_memory_rss_bytes gauge
nodejs_memory_rss_bytes 145600000

# HELP nodejs_memory_heap_used_bytes Heap used in bytes
# TYPE nodejs_memory_heap_used_bytes gauge
nodejs_memory_heap_used_bytes 89400000

# HELP aacsearch_users_total Total number of users
# TYPE aacsearch_users_total gauge
aacsearch_users_total 2456

# HELP aacsearch_active_subscriptions Active subscriptions
# TYPE aacsearch_active_subscriptions gauge
aacsearch_active_subscriptions 128

# HELP typesense_system_cpu_active_percentage CPU usage
# TYPE typesense_system_cpu_active_percentage gauge
typesense_system_cpu_active_percentage 12.5
```

### Prometheus config

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'aacsearch'
    scrape_interval: 30s
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/api/metrics'
```

---

## Grafana Dashboards

### Установка Grafana

```bash
# Docker
docker run -d \
  -p 3001:3000 \
  -e "GF_SECURITY_ADMIN_PASSWORD=admin" \
  --name grafana \
  grafana/grafana
```

### Подключение Prometheus

1. Grafana → Configuration → Data Sources
2. Add data source → Prometheus
3. URL: `http://prometheus:9090`
4. Save & Test

### Dashboard для AACSearch

**Dashboard JSON:**
```json
{
  "dashboard": {
    "title": "AACSearch Platform",
    "panels": [
      {
        "title": "Active Users",
        "targets": [{
          "expr": "aacsearch_users_total"
        }]
      },
      {
        "title": "Searches per Minute",
        "targets": [{
          "expr": "rate(aacsearch_searches_total[1m])"
        }]
      },
      {
        "title": "Average Latency",
        "targets": [{
          "expr": "aacsearch_search_latency_seconds"
        }]
      }
    ]
  }
}
```

---

## Alerting

### Alert Rules

```yaml
# prometheus/alerts.yml
groups:
  - name: aacsearch
    rules:
      # High error rate
      - alert: HighErrorRate
        expr: rate(aacsearch_errors_total[5m]) > 0.05
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors/sec"

      # High latency
      - alert: HighLatency
        expr: aacsearch_search_latency_seconds > 1.0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High search latency"
          description: "Average latency is {{ $value }}s"

      # Approaching usage limit
      - alert: ApproachingUsageLimit
        expr: (aacsearch_usage_searches / aacsearch_limit_searches) > 0.8
        for: 1h
        labels:
          severity: info
        annotations:
          summary: "Tenant approaching search limit"
          description: "{{ $labels.tenant }} used {{ $value }}% of limit"
```

### Alertmanager config

```yaml
# alertmanager.yml
route:
  receiver: 'email'
  group_by: ['alertname', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 12h

receivers:
  - name: 'email'
    email_configs:
      - to: 'alerts@aacsearch.com'
        from: 'alertmanager@aacsearch.com'
        smarthost: 'smtp.gmail.com:587'
        auth_username: 'alerts@aacsearch.com'
        auth_password: 'password'
```

### Slack интеграция

```yaml
receivers:
  - name: 'slack'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/...'
        channel: '#alerts'
        title: 'AACSearch Alert'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
```

---

## Best Practices

### Мониторинг

✅ **Рекомендуется:**

1. **Мониторить ключевые метрики:**
   - Uptime, latency, error rate
   - Database performance
   - Typesense health
   - Usage vs limits

2. **Настроить алерты:**
   - High error rate (> 5%)
   - High latency (> 1s)
   - Approaching limits (> 80%)
   - Failed payments

3. **Регулярно проверять:**
   - Audit logs
   - Security events
   - Slow queries
   - Failed jobs

4. **Dashboard review:**
   - Ежедневно — key metrics
   - Еженедельно — trends
   - Ежемесячно — capacity planning

---

**Версия:** 1.0.0  
**Дата обновления:** 2025-11-02  
**Следующий раздел:** [07-backups.md](./07-backups.md)
