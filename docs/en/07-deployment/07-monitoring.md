# Мониторинг и Observability

Comprehensive руководство по production monitoring и observability для AACSearch Platform.

## Содержание

- [Введение](#введение)
- [Observability Stack](#observability-stack)
- [Prometheus Metrics](#prometheus-metrics)
- [Grafana Dashboards](#grafana-dashboards)
- [Structured Logging](#structured-logging)
- [Log Aggregation](#log-aggregation)
- [Distributed Tracing](#distributed-tracing)
- [Alerting](#alerting)
- [SLA/SLO/SLI](#slaslosli)
- [On-call и Incident Response](#on-call-и-incident-response)
- [Business Metrics](#business-metrics)

---

## Введение

Observability - способность понять внутреннее состояние системы на основе её outputs. Три столпа observability:

1. **Metrics** - числовые measurements (CPU, memory, request rate)
2. **Logs** - детальные события и errors
3. **Traces** - distributed request flows

### Observability Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application                              │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐             │
│  │ Metrics  │  │   Logs    │  │   Traces     │             │
│  │ (Prom)   │  │  (JSON)   │  │ (OpenTelemetry)            │
│  └────┬─────┘  └─────┬─────┘  └──────┬───────┘             │
└───────┼──────────────┼────────────────┼─────────────────────┘
        │              │                │
        │              │                │
┌───────▼──────┐  ┌────▼──────┐  ┌─────▼────────┐
│ Prometheus   │  │   Loki    │  │   Jaeger     │
│  (Metrics    │  │   (Logs   │  │   (Traces    │
│   Storage)   │  │  Storage) │  │   Storage)   │
└───────┬──────┘  └────┬──────┘  └─────┬────────┘
        │              │                │
        └──────────────┼────────────────┘
                       │
               ┌───────▼────────┐
               │    Grafana     │
               │ (Visualization)│
               └────────────────┘
                       │
               ┌───────▼────────┐
               │ AlertManager   │
               │   (Alerts)     │
               └────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐  ┌────▼─────┐  ┌────▼──────┐
│   Email      │  │  Slack   │  │ PagerDuty │
└──────────────┘  └──────────┘  └───────────┘
```

---

## Observability Stack

### Installation

**Prometheus + Grafana + Loki + Jaeger** через Helm:

```bash
# Add Helm repositories
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
helm repo update

# Create monitoring namespace
kubectl create namespace monitoring

# Install kube-prometheus-stack (Prometheus + Grafana + AlertManager)
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --set prometheus.prometheusSpec.retention=30d \
  --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage=100Gi \
  --set grafana.enabled=true \
  --set grafana.adminPassword=changeme \
  --set grafana.persistence.enabled=true \
  --set grafana.persistence.size=10Gi

# Install Loki
helm install loki grafana/loki-stack \
  --namespace monitoring \
  --set loki.persistence.enabled=true \
  --set loki.persistence.size=50Gi \
  --set promtail.enabled=true

# Install Jaeger
helm install jaeger jaegertracing/jaeger \
  --namespace monitoring \
  --set cassandra.persistence.enabled=true \
  --set cassandra.persistence.size=50Gi
```

---

## Prometheus Metrics

### Application Metrics

**Setup Prometheus client в Next.js**:

```bash
pnpm add prom-client
```

**src/lib/metrics.ts**:

```typescript
import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client'

// Create a Registry
export const register = new Registry()

// Add default metrics (CPU, memory, etc.)
collectDefaultMetrics({ register })

// =========================================================================
// HTTP Metrics
// =========================================================================

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 0.7, 1, 3, 5, 10],
  registers: [register],
})

export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
})

export const httpRequestSize = new Histogram({
  name: 'http_request_size_bytes',
  help: 'Size of HTTP requests in bytes',
  labelNames: ['method', 'route'],
  buckets: [100, 1000, 10000, 100000, 1000000],
  registers: [register],
})

export const httpResponseSize = new Histogram({
  name: 'http_response_size_bytes',
  help: 'Size of HTTP responses in bytes',
  labelNames: ['method', 'route'],
  buckets: [100, 1000, 10000, 100000, 1000000],
  registers: [register],
})

// =========================================================================
// Database Metrics
// =========================================================================

export const dbQueryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'collection'],
  buckets: [0.001, 0.01, 0.05, 0.1, 0.3, 0.5, 1, 3, 5],
  registers: [register],
})

export const dbConnectionsActive = new Gauge({
  name: 'db_connections_active',
  help: 'Number of active database connections',
  registers: [register],
})

export const dbConnectionsIdle = new Gauge({
  name: 'db_connections_idle',
  help: 'Number of idle database connections',
  registers: [register],
})

export const dbQueryErrors = new Counter({
  name: 'db_query_errors_total',
  help: 'Total number of database query errors',
  labelNames: ['operation', 'collection', 'error_type'],
  registers: [register],
})

// =========================================================================
// Cache Metrics
// =========================================================================

export const cacheHits = new Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['cache_key_prefix'],
  registers: [register],
})

export const cacheMisses = new Counter({
  name: 'cache_misses_total',
  help: 'Total number of cache misses',
  labelNames: ['cache_key_prefix'],
  registers: [register],
})

export const cacheOperationDuration = new Histogram({
  name: 'cache_operation_duration_seconds',
  help: 'Duration of cache operations in seconds',
  labelNames: ['operation'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
  registers: [register],
})

// =========================================================================
// Search Metrics
// =========================================================================

export const searchQueryDuration = new Histogram({
  name: 'search_query_duration_seconds',
  help: 'Duration of search queries in seconds',
  labelNames: ['tenant_id', 'collection'],
  buckets: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5],
  registers: [register],
})

export const searchQueryTotal = new Counter({
  name: 'search_queries_total',
  help: 'Total number of search queries',
  labelNames: ['tenant_id', 'collection', 'status'],
  registers: [register],
})

export const searchIndexSize = new Gauge({
  name: 'search_index_size_bytes',
  help: 'Size of search index in bytes',
  labelNames: ['tenant_id', 'collection'],
  registers: [register],
})

// =========================================================================
// Business Metrics
// =========================================================================

export const activeUsers = new Gauge({
  name: 'active_users',
  help: 'Number of active users',
  labelNames: ['tenant_id'],
  registers: [register],
})

export const activeSubscriptions = new Gauge({
  name: 'active_subscriptions',
  help: 'Number of active subscriptions',
  labelNames: ['plan'],
  registers: [register],
})

export const monthlyRecurringRevenue = new Gauge({
  name: 'mrr_usd',
  help: 'Monthly Recurring Revenue in USD',
  registers: [register],
})

export const apiKeysActive = new Gauge({
  name: 'api_keys_active',
  help: 'Number of active API keys',
  labelNames: ['tenant_id'],
  registers: [register],
})

// =========================================================================
// Job Queue Metrics
// =========================================================================

export const jobQueueLength = new Gauge({
  name: 'job_queue_length',
  help: 'Length of job queue',
  labelNames: ['queue_name'],
  registers: [register],
})

export const jobProcessingDuration = new Histogram({
  name: 'job_processing_duration_seconds',
  help: 'Duration of job processing in seconds',
  labelNames: ['job_type'],
  buckets: [1, 5, 10, 30, 60, 300, 600],
  registers: [register],
})

export const jobFailures = new Counter({
  name: 'job_failures_total',
  help: 'Total number of job failures',
  labelNames: ['job_type', 'error_type'],
  registers: [register],
})
```

### Metrics Endpoint

**src/app/metrics/route.ts**:

```typescript
import { NextResponse } from 'next/server'
import { register } from '@/lib/metrics'

export async function GET() {
  const metrics = await register.metrics()

  return new NextResponse(metrics, {
    headers: {
      'Content-Type': register.contentType,
    },
  })
}
```

### Metrics Middleware

**src/middleware.ts**:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { httpRequestDuration, httpRequestTotal, httpRequestSize, httpResponseSize } from '@/lib/metrics'

export async function middleware(request: NextRequest) {
  const start = Date.now()

  // Extract route info
  const { pathname, search } = request.nextUrl
  const method = request.method
  const requestSize = parseInt(request.headers.get('content-length') || '0')

  // Record request size
  httpRequestSize.observe({ method, route: pathname }, requestSize)

  // Process request
  const response = NextResponse.next()

  // Calculate duration
  const duration = (Date.now() - start) / 1000
  const statusCode = response.status.toString()
  const responseSize = parseInt(response.headers.get('content-length') || '0')

  // Record metrics
  httpRequestDuration.observe(
    { method, route: pathname, status_code: statusCode },
    duration
  )

  httpRequestTotal.inc({ method, route: pathname, status_code: statusCode })

  httpResponseSize.observe({ method, route: pathname }, responseSize)

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*',
  ],
}
```

### ServiceMonitor для Prometheus

**Kubernetes ServiceMonitor**:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: aacsearch-app
  namespace: aacsearch-production
  labels:
    app: aacsearch
    release: prometheus
spec:
  selector:
    matchLabels:
      app: aacsearch
      component: application
  endpoints:
    - port: metrics
      path: /metrics
      interval: 15s
      scrapeTimeout: 10s
```

---

## Grafana Dashboards

### Application Dashboard

**Dashboard JSON** (`dashboards/application.json`):

```json
{
  "dashboard": {
    "title": "AACSearch - Application Metrics",
    "timezone": "browser",
    "refresh": "30s",
    "panels": [
      {
        "id": 1,
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ],
        "gridPos": { "x": 0, "y": 0, "w": 12, "h": 8 }
      },
      {
        "id": 2,
        "title": "Request Duration (p95)",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "{{route}}"
          }
        ],
        "gridPos": { "x": 12, "y": 0, "w": 12, "h": 8 }
      },
      {
        "id": 3,
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status_code=~\"5..\"}[5m])",
            "legendFormat": "5xx errors"
          },
          {
            "expr": "rate(http_requests_total{status_code=~\"4..\"}[5m])",
            "legendFormat": "4xx errors"
          }
        ],
        "gridPos": { "x": 0, "y": 8, "w": 12, "h": 8 }
      },
      {
        "id": 4,
        "title": "Active Pods",
        "type": "stat",
        "targets": [
          {
            "expr": "count(up{job=\"aacsearch-app\"} == 1)"
          }
        ],
        "gridPos": { "x": 12, "y": 8, "w": 6, "h": 4 }
      },
      {
        "id": 5,
        "title": "CPU Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(process_cpu_seconds_total{job=\"aacsearch-app\"}[5m]) * 100",
            "legendFormat": "{{pod}}"
          }
        ],
        "gridPos": { "x": 0, "y": 16, "w": 12, "h": 8 }
      },
      {
        "id": 6,
        "title": "Memory Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "process_resident_memory_bytes{job=\"aacsearch-app\"} / 1024 / 1024",
            "legendFormat": "{{pod}}"
          }
        ],
        "gridPos": { "x": 12, "y": 16, "w": 12, "h": 8 }
      }
    ]
  }
}
```

### Database Dashboard

**PromQL queries для database metrics**:

```promql
# Query latency (p95)
histogram_quantile(0.95, rate(db_query_duration_seconds_bucket[5m]))

# Queries per second
rate(db_query_duration_seconds_count[5m])

# Active connections
db_connections_active

# Connection pool utilization
db_connections_active / (db_connections_active + db_connections_idle) * 100

# Query errors rate
rate(db_query_errors_total[5m])

# Top slowest queries
topk(10, avg by (operation, collection) (
  rate(db_query_duration_seconds_sum[5m]) /
  rate(db_query_duration_seconds_count[5m])
))
```

### Search Dashboard

```promql
# Search query latency (p95)
histogram_quantile(0.95, rate(search_query_duration_seconds_bucket[5m]))

# Search QPS
rate(search_queries_total[5m])

# Search errors
rate(search_queries_total{status="error"}[5m])

# Index size by tenant
search_index_size_bytes

# Top searched collections
topk(10, rate(search_queries_total[5m]))
```

### Business Metrics Dashboard

```promql
# Monthly Recurring Revenue
mrr_usd

# Active subscriptions by plan
sum by (plan) (active_subscriptions)

# Active users
sum(active_users)

# API usage by tenant
topk(10, rate(http_requests_total{route=~"/api/.*"}[5m]))

# Subscription churn rate (requires custom metric)
rate(subscription_cancellations_total[30d]) /
subscription_activations_total offset 30d * 100
```

### Importing Dashboards

```bash
# Via Grafana UI:
# 1. Go to Dashboards → Import
# 2. Upload JSON file или paste JSON
# 3. Select Prometheus data source
# 4. Click Import

# Via API:
curl -X POST http://admin:changeme@localhost:3000/api/dashboards/db \
  -H "Content-Type: application/json" \
  -d @dashboards/application.json

# Via ConfigMap в Kubernetes:
kubectl create configmap grafana-dashboards \
  --from-file=dashboards/ \
  -n monitoring
```

---

## Structured Logging

### Winston Configuration

```bash
pnpm add winston
```

**src/lib/logger.ts**:

```typescript
import winston from 'winston'

// Custom format для structured JSON logs
const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

// Console format для development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `${timestamp} [${level}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
    }`
  })
)

// Create logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.NODE_ENV === 'production' ? jsonFormat : consoleFormat,
  defaultMeta: {
    service: 'aacsearch-app',
    environment: process.env.NODE_ENV,
    version: process.env.APP_VERSION,
  },
  transports: [
    // Console output
    new winston.transports.Console(),

    // Error logs file (production only)
    ...(process.env.NODE_ENV === 'production'
      ? [
          new winston.transports.File({
            filename: '/var/log/aacsearch/error.log',
            level: 'error',
            maxsize: 10485760, // 10MB
            maxFiles: 10,
          }),
          new winston.transports.File({
            filename: '/var/log/aacsearch/combined.log',
            maxsize: 10485760,
            maxFiles: 10,
          }),
        ]
      : []),
  ],
})

// Utility functions
export function logRequest(req: any) {
  logger.info('HTTP Request', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  })
}

export function logError(error: Error, context?: any) {
  logger.error('Error occurred', {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
    },
    context,
  })
}

export function logDatabaseQuery(query: string, duration: number, params?: any) {
  logger.debug('Database Query', {
    query,
    duration,
    params,
  })
}

export function logSearchQuery(
  tenantId: string,
  query: string,
  duration: number,
  results: number
) {
  logger.info('Search Query', {
    tenantId,
    query,
    duration,
    results,
  })
}

export function logBusinessEvent(
  event: string,
  tenantId: string,
  metadata?: any
) {
  logger.info('Business Event', {
    event,
    tenantId,
    metadata,
  })
}
```

### Usage Examples

```typescript
// src/app/api/search/route.ts
import { NextResponse } from 'next/server'
import { logger, logSearchQuery, logError } from '@/lib/logger'

export async function POST(request: Request) {
  const start = Date.now()
  const { tenantId, query } = await request.json()

  try {
    logger.info('Search request received', { tenantId, query })

    const results = await searchDocuments(tenantId, query)
    const duration = Date.now() - start

    logSearchQuery(tenantId, query, duration, results.length)

    return NextResponse.json({
      results,
      duration,
    })
  } catch (error) {
    logError(error as Error, { tenantId, query })

    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
```

### Log Levels

```typescript
// Production log levels
logger.error('Critical error')    // Always logged
logger.warn('Warning')            // Important warnings
logger.info('Information')        // General info (default)
logger.debug('Debug info')        // Detailed debug (LOG_LEVEL=debug)
logger.verbose('Verbose info')    // Very detailed (LOG_LEVEL=verbose)

// Structured context
logger.info('User logged in', {
  userId: user.id,
  email: user.email,
  ip: request.ip,
  timestamp: new Date(),
})
```

---

## Log Aggregation

### Promtail Configuration

**Promtail config для shipping logs to Loki**:

```yaml
# promtail-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: promtail-config
  namespace: monitoring
data:
  promtail.yaml: |
    server:
      http_listen_port: 9080
      grpc_listen_port: 0

    positions:
      filename: /tmp/positions.yaml

    clients:
      - url: http://loki:3100/loki/api/v1/push

    scrape_configs:
      # Application logs
      - job_name: kubernetes-pods
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_label_app]
            target_label: app
          - source_labels: [__meta_kubernetes_pod_label_component]
            target_label: component
          - source_labels: [__meta_kubernetes_namespace]
            target_label: namespace
          - source_labels: [__meta_kubernetes_pod_name]
            target_label: pod
          - source_labels: [__meta_kubernetes_pod_container_name]
            target_label: container
        pipeline_stages:
          # Parse JSON logs
          - json:
              expressions:
                level: level
                timestamp: timestamp
                message: message
                service: service
                environment: environment

          # Extract labels
          - labels:
              level:
              service:
              environment:

          # Parse timestamp
          - timestamp:
              source: timestamp
              format: RFC3339

      # System logs
      - job_name: system
        static_configs:
          - targets:
              - localhost
            labels:
              job: varlogs
              __path__: /var/log/*.log
```

### Loki Queries (LogQL)

```logql
# All logs от application
{app="aacsearch", component="application"}

# Error logs only
{app="aacsearch"} |= "level=error"

# Logs для specific tenant
{app="aacsearch"} | json | tenant_id="abc123"

# Search queries с slow response
{app="aacsearch"} | json | duration > 1000

# Rate of errors
rate({app="aacsearch", level="error"}[5m])

# Top error messages
topk(10,
  sum by (message) (
    rate({app="aacsearch", level="error"}[1h])
  )
)

# Parse and filter
{app="aacsearch"}
  | json
  | level="error"
  | line_format "{{.timestamp}} {{.message}}"

# Metrics from logs
sum(rate({app="aacsearch"} | json | status_code >= 500 [5m])) by (route)
```

---

## Distributed Tracing

### OpenTelemetry Setup

```bash
pnpm add @opentelemetry/api @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-jaeger
```

**src/lib/tracing.ts**:

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { JaegerExporter } from '@opentelemetry/exporter-jaeger'
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'

// Jaeger exporter
const jaegerExporter = new JaegerExporter({
  endpoint: process.env.JAEGER_ENDPOINT || 'http://jaeger:14268/api/traces',
})

// Initialize OpenTelemetry SDK
export const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'aacsearch-app',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.APP_VERSION,
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV,
  }),
  traceExporter: jaegerExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false },
    }),
  ],
})

// Start SDK
if (process.env.ENABLE_TRACING === 'true') {
  sdk.start()
  console.log('Tracing initialized')
}

// Graceful shutdown
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0))
})
```

**Usage in application code**:

```typescript
import { trace, context, SpanStatusCode } from '@opentelemetry/api'

const tracer = trace.getTracer('aacsearch-app')

export async function processSearchRequest(tenantId: string, query: string) {
  // Create span
  return tracer.startActiveSpan('search.process', async (span) => {
    try {
      // Add attributes
      span.setAttribute('tenant.id', tenantId)
      span.setAttribute('search.query', query)

      // Fetch from database
      const documents = await tracer.startActiveSpan('db.query', async (dbSpan) => {
        dbSpan.setAttribute('db.system', 'postgresql')
        dbSpan.setAttribute('db.statement', 'SELECT * FROM documents WHERE...')

        const result = await db.query(...)

        dbSpan.end()
        return result
      })

      // Search in Typesense
      const results = await tracer.startActiveSpan('search.typesense', async (searchSpan) => {
        searchSpan.setAttribute('search.engine', 'typesense')

        const searchResults = await typesense.search(...)

        searchSpan.end()
        return searchResults
      })

      span.setStatus({ code: SpanStatusCode.OK })
      span.end()

      return results
    } catch (error) {
      span.recordException(error as Error)
      span.setStatus({ code: SpanStatusCode.ERROR })
      span.end()
      throw error
    }
  })
}
```

---

## Alerting

### AlertManager Configuration

```yaml
# alertmanager-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: alertmanager-config
  namespace: monitoring
data:
  alertmanager.yml: |
    global:
      resolve_timeout: 5m
      slack_api_url: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL'

    route:
      group_by: ['alertname', 'cluster', 'service']
      group_wait: 10s
      group_interval: 10s
      repeat_interval: 12h
      receiver: 'default'
      routes:
        # Critical alerts → PagerDuty
        - match:
            severity: critical
          receiver: pagerduty
          continue: true

        # Warning alerts → Slack
        - match:
            severity: warning
          receiver: slack

        # Database alerts
        - match:
            component: database
          receiver: database-team

    receivers:
      - name: 'default'
        slack_configs:
          - channel: '#alerts'
            title: 'AACSearch Alert'
            text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'

      - name: 'pagerduty'
        pagerduty_configs:
          - service_key: 'YOUR_PAGERDUTY_SERVICE_KEY'

      - name: 'slack'
        slack_configs:
          - channel: '#alerts-warning'
            title: 'Warning: {{ .GroupLabels.alertname }}'
            text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'

      - name: 'database-team'
        email_configs:
          - to: 'database-team@aacsearch.com'
            from: 'alerts@aacsearch.com'
            smarthost: 'smtp.gmail.com:587'
            auth_username: 'alerts@aacsearch.com'
            auth_password: 'password'

    inhibit_rules:
      # Inhibit warning if critical firing
      - source_match:
          severity: 'critical'
        target_match:
          severity: 'warning'
        equal: ['alertname', 'cluster', 'service']
```

### Alert Rules

```yaml
# prometheus-rules.yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: aacsearch-alerts
  namespace: monitoring
  labels:
    prometheus: kube-prometheus
spec:
  groups:
    # =====================================================================
    # Application Alerts
    # =====================================================================
    - name: application
      interval: 30s
      rules:
        - alert: HighErrorRate
          expr: |
            rate(http_requests_total{status_code=~"5.."}[5m]) > 0.05
          for: 5m
          labels:
            severity: critical
            component: application
          annotations:
            summary: "High error rate detected"
            description: "Error rate is {{ $value | humanizePercentage }} (threshold: 5%)"
            runbook_url: "https://runbooks.aacsearch.com/high-error-rate"

        - alert: SlowResponseTime
          expr: |
            histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
          for: 10m
          labels:
            severity: warning
            component: application
          annotations:
            summary: "Slow response time (p95 > 1s)"
            description: "p95 response time is {{ $value }}s"

        - alert: PodDown
          expr: |
            up{job="aacsearch-app"} == 0
          for: 1m
          labels:
            severity: critical
            component: application
          annotations:
            summary: "Pod is down"
            description: "Pod {{ $labels.pod }} is down"

        - alert: HighMemoryUsage
          expr: |
            process_resident_memory_bytes{job="aacsearch-app"} / 1024 / 1024 / 1024 > 1.5
          for: 5m
          labels:
            severity: warning
            component: application
          annotations:
            summary: "High memory usage"
            description: "Memory usage is {{ $value }}GB (threshold: 1.5GB)"

    # =====================================================================
    # Database Alerts
    # =====================================================================
    - name: database
      interval: 30s
      rules:
        - alert: DatabaseDown
          expr: |
            up{job="postgres"} == 0
          for: 1m
          labels:
            severity: critical
            component: database
          annotations:
            summary: "Database is down"
            description: "PostgreSQL database is unreachable"
            runbook_url: "https://runbooks.aacsearch.com/database-down"

        - alert: DatabaseHighConnections
          expr: |
            db_connections_active > 400
          for: 5m
          labels:
            severity: warning
            component: database
          annotations:
            summary: "High database connections"
            description: "Active connections: {{ $value }} (threshold: 400)"

        - alert: DatabaseSlowQueries
          expr: |
            histogram_quantile(0.95, rate(db_query_duration_seconds_bucket[5m])) > 0.5
          for: 10m
          labels:
            severity: warning
            component: database
          annotations:
            summary: "Slow database queries"
            description: "p95 query time: {{ $value }}s (threshold: 0.5s)"

        - alert: DatabaseDiskSpaceLow
          expr: |
            (node_filesystem_avail_bytes{mountpoint="/var/lib/postgresql"} / node_filesystem_size_bytes{mountpoint="/var/lib/postgresql"}) * 100 < 20
          for: 5m
          labels:
            severity: critical
            component: database
          annotations:
            summary: "Database disk space low"
            description: "Available disk space: {{ $value }}%"

    # =====================================================================
    # Cache Alerts
    # =====================================================================
    - name: cache
      interval: 30s
      rules:
        - alert: RedisDown
          expr: |
            up{job="redis"} == 0
          for: 1m
          labels:
            severity: critical
            component: cache
          annotations:
            summary: "Redis is down"
            description: "Redis cache is unreachable"

        - alert: LowCacheHitRate
          expr: |
            rate(cache_hits_total[5m]) / (rate(cache_hits_total[5m]) + rate(cache_misses_total[5m])) < 0.8
          for: 10m
          labels:
            severity: warning
            component: cache
          annotations:
            summary: "Low cache hit rate"
            description: "Cache hit rate: {{ $value | humanizePercentage }} (threshold: 80%)"

        - alert: RedisHighMemory
          expr: |
            redis_memory_used_bytes / redis_memory_max_bytes > 0.9
          for: 5m
          labels:
            severity: warning
            component: cache
          annotations:
            summary: "Redis high memory usage"
            description: "Memory usage: {{ $value | humanizePercentage }}"

    # =====================================================================
    # Search Engine Alerts
    # =====================================================================
    - name: search
      interval: 30s
      rules:
        - alert: TypesenseDown
          expr: |
            up{job="typesense"} == 0
          for: 1m
          labels:
            severity: critical
            component: search
          annotations:
            summary: "Typesense is down"
            description: "Typesense node {{ $labels.instance }} is down"

        - alert: SlowSearchQueries
          expr: |
            histogram_quantile(0.95, rate(search_query_duration_seconds_bucket[5m])) > 0.5
          for: 10m
          labels:
            severity: warning
            component: search
          annotations:
            summary: "Slow search queries"
            description: "p95 search time: {{ $value }}s (threshold: 0.5s)"

    # =====================================================================
    # Business Alerts
    # =====================================================================
    - name: business
      interval: 5m
      rules:
        - alert: LowActiveUsers
          expr: |
            sum(active_users) < 100
          for: 30m
          labels:
            severity: info
            component: business
          annotations:
            summary: "Low active users"
            description: "Only {{ $value }} active users"

        - alert: HighSubscriptionChurn
          expr: |
            rate(subscription_cancellations_total[24h]) / subscription_activations_total offset 24h > 0.1
          for: 1h
          labels:
            severity: warning
            component: business
          annotations:
            summary: "High subscription churn rate"
            description: "Churn rate: {{ $value | humanizePercentage }}"
```

---

## SLA/SLO/SLI

### Definitions

**SLI (Service Level Indicator)**: Метрики качества сервиса
**SLO (Service Level Objective)**: Целевые значения SLI
**SLA (Service Level Agreement)**: Контракт с клиентом

### SLI Examples

```promql
# Availability
sum(up{job="aacsearch-app"} == 1) / count(up{job="aacsearch-app"}) * 100

# Error Rate
sum(rate(http_requests_total{status_code=~"5.."}[5m])) /
sum(rate(http_requests_total[5m])) * 100

# Request Latency (p95)
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Throughput
sum(rate(http_requests_total[5m]))
```

### SLO Definition

```yaml
# SLOs for AACSearch Platform

availability:
  target: 99.9%
  measurement_window: 30d
  allowed_downtime: 43.8 minutes/month

latency:
  target: 95% of requests < 500ms
  measurement_window: 5m

error_rate:
  target: < 0.1%
  measurement_window: 5m

throughput:
  target: > 1000 requests/second
  measurement_window: 1m
```

---

## On-call и Incident Response

### On-call Rotation

Используйте PagerDuty для on-call management:

```yaml
# On-call schedule
schedules:
  - name: Primary On-call
    timezone: America/New_York
    layers:
      - start: 2025-01-01T00:00:00
        rotation_virtual_start: 2025-01-01T00:00:00
        rotation_turn_length_seconds: 604800  # 1 week
        users:
          - user1@aacsearch.com
          - user2@aacsearch.com
          - user3@aacsearch.com

  - name: Escalation
    timezone: America/New_York
    layers:
      - start: 2025-01-01T00:00:00
        users:
          - manager@aacsearch.com
```

### Incident Response Playbook

**1. Acknowledge**:
```bash
# Acknowledge alert in PagerDuty
curl -X PUT https://api.pagerduty.com/incidents/INCIDENT_ID \
  -H "Authorization: Token token=YOUR_API_KEY" \
  -d '{
    "incident": {
      "type": "incident_reference",
      "status": "acknowledged"
    }
  }'
```

**2. Investigate**:
```bash
# Check pod status
kubectl get pods -n aacsearch-production

# Check logs
kubectl logs -n aacsearch-production -l app=aacsearch --tail=100

# Check metrics
kubectl top pods -n aacsearch-production
```

**3. Mitigate**:
```bash
# Scale up if needed
kubectl scale deployment aacsearch-app -n aacsearch-production --replicas=8

# Restart pods
kubectl rollout restart deployment aacsearch-app -n aacsearch-production

# Emergency rollback
kubectl rollout undo deployment aacsearch-app -n aacsearch-production
```

**4. Resolve**:
```bash
# Mark as resolved in PagerDuty
curl -X PUT https://api.pagerduty.com/incidents/INCIDENT_ID \
  -H "Authorization: Token token=YOUR_API_KEY" \
  -d '{
    "incident": {
      "type": "incident_reference",
      "status": "resolved"
    }
  }'
```

**5. Post-mortem**:
- Write incident report
- Identify root cause
- Create action items
- Update runbooks

---

## Business Metrics

### Revenue Tracking

```typescript
// src/lib/metrics-business.ts
import { Gauge } from 'prom-client'
import { register } from './metrics'

export const mrrGauge = new Gauge({
  name: 'mrr_usd',
  help: 'Monthly Recurring Revenue in USD',
  registers: [register],
})

export const activeSubscriptionsGauge = new Gauge({
  name: 'active_subscriptions',
  help: 'Number of active subscriptions',
  labelNames: ['plan'],
  registers: [register],
})

// Update metrics periodically
export async function updateBusinessMetrics() {
  const subscriptions = await payload.find({
    collection: 'subscriptions',
    where: {
      status: { equals: 'active' },
    },
    limit: 10000,
  })

  // Calculate MRR
  let totalMRR = 0
  const planCounts: Record<string, number> = {}

  for (const sub of subscriptions.docs) {
    totalMRR += sub.amount / 100 // Convert cents to dollars

    planCounts[sub.plan] = (planCounts[sub.plan] || 0) + 1
  }

  // Update metrics
  mrrGauge.set(totalMRR)

  for (const [plan, count] of Object.entries(planCounts)) {
    activeSubscriptionsGauge.set({ plan }, count)
  }
}

// Run every 5 minutes
setInterval(updateBusinessMetrics, 300000)
```

---

**Следующие шаги**: Для disaster recovery procedures, смотрите [08-disaster-recovery.md](08-disaster-recovery.md)
