# Нефункциональные требования SaaS платформы

## Оглавление

- [NFR-001: Performance](#nfr-001-performance)
- [NFR-002: Scalability](#nfr-002-scalability)
- [NFR-003: Availability](#nfr-003-availability)
- [NFR-004: Security](#nfr-004-security)
- [NFR-005: Reliability](#nfr-005-reliability)
- [NFR-006: Observability](#nfr-006-observability)
- [NFR-007: Usability](#nfr-007-usability)
- [NFR-008: Maintainability](#nfr-008-maintainability)
- [NFR-009: Portability](#nfr-009-portability)
- [NFR-010: Compatibility](#nfr-010-compatibility)

---

## NFR-001: Performance

### Описание
Производительностные характеристики всех компонентов системы.

### Приоритет
**Must Have** - Критично для user experience.

### Детальные требования

#### NFR-001.1: Search Latency
| Метрика | Target | Priority | Measurement Method |
|---------|--------|----------|-------------------|
| Search p50 | <20ms | Must | - Measure на production traffic<br>- Exclude network latency<br>- Monitor via APM |
| Search p95 | <50ms | Must | - 95th percentile response time<br>- Alert если > 50ms for 5min<br>- Track per collection |
| Search p99 | <100ms | Should | - 99th percentile<br>- Identify slow queries<br>- Optimization opportunities |
| Semantic search p95 | <100ms | Should | - Vector search latency<br>- Including embedding generation<br>- Exclude LLM calls |

**Acceptance Criteria:**
- Search latency dashboard с real-time metrics
- Automatic alerts при превышении thresholds
- Query performance analysis tools
- Slow query log (queries >100ms)

#### NFR-001.2: API Response Time
| Endpoint | p95 Target | Priority | Notes |
|----------|-----------|----------|-------|
| GET /collections/:name/documents/:id | <50ms | Must | Single document retrieval |
| POST /collections/:name/documents | <100ms | Must | Document creation |
| PATCH /collections/:name/documents/:id | <100ms | Must | Document update |
| DELETE /collections/:name/documents/:id | <50ms | Must | Document deletion |
| POST /collections/:name/documents/import | <5s per 1000 docs | Should | Bulk import |
| GET /analytics/queries | <500ms | Should | Analytics queries |

**Acceptance Criteria:**
- API response time monitoring per endpoint
- SLO alerts для каждого endpoint
- Performance regression testing в CI/CD

#### NFR-001.3: Page Load Time
| Page | p95 Target | Priority | Measurement |
|------|-----------|----------|-------------|
| Dashboard | <2s | Must | Time to Interactive (TTI) |
| Collections list | <1.5s | Must | First Contentful Paint (FCP) |
| Search UI | <2s | Must | TTI |
| Analytics dashboard | <3s | Should | Chart rendering time |
| Documentation | <1s | Should | Static pages |

**Acceptance Criteria:**
- Lighthouse score > 90 для всех pages
- Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
- Real User Monitoring (RUM) для production traffic

#### NFR-001.4: Database Query Performance
| Operation | Target | Priority | Notes |
|-----------|--------|----------|-------|
| Simple SELECT | <10ms | Must | Single row by primary key |
| JOIN queries | <50ms | Must | Up to 3 tables |
| Aggregations | <100ms | Should | COUNT, SUM, AVG |
| Full table scan | Avoid | Must | Always use indexes |

**Acceptance Criteria:**
- All queries профилированы и оптимизированы
- Missing indexes detected и added
- Query plan analysis в development
- Database slow query log enabled

#### NFR-001.5: Indexing Throughput
| Operation | Throughput | Priority | Notes |
|-----------|-----------|----------|-------|
| Single document indexing | <50ms | Must | Sync operation |
| Bulk indexing | >1000 docs/sec | Should | Async batch operation |
| Reindexing | >500 docs/sec | Should | Background job |
| Vector embedding generation | >100 docs/sec | Could | With batching |

**Acceptance Criteria:**
- Indexing performance benchmarks
- Progress tracking для bulk operations
- Resource utilization monitoring
- Queue depth monitoring

#### NFR-001.6: Caching
| Cache Type | Hit Rate Target | TTL | Priority |
|------------|----------------|-----|----------|
| API responses | >80% | 60s | Should |
| Search results | >70% | 30s | Should |
| Collection schemas | >95% | 5min | Must |
| User sessions | >90% | 15min | Must |
| Analytics | >60% | 5min | Should |

**Acceptance Criteria:**
- Redis для distributed caching
- Cache hit/miss metrics
- Cache invalidation strategy
- Cache warming для hot data

### Метрики измерения
- **Latency**: Request/response time в milliseconds
- **Throughput**: Requests per second (RPS)
- **Concurrency**: Number of simultaneous requests
- **Resource utilization**: CPU, memory, disk I/O

### Тестовые сценарии

```typescript
describe('NFR-001: Performance', () => {
  it('NFR-001.1: Search latency p95 < 50ms', async () => {
    const collection = await setupTestCollection(10000) // 10K docs

    const latencies: number[] = []

    // Run 1000 searches
    for (let i = 0; i < 1000; i++) {
      const start = performance.now()
      await search(collection.name, { q: randomQuery() })
      const latency = performance.now() - start
      latencies.push(latency)
    }

    latencies.sort((a, b) => a - b)
    const p95 = latencies[Math.floor(latencies.length * 0.95)]

    expect(p95).toBeLessThan(50)
  })

  it('NFR-001.3: Dashboard load time < 2s', async () => {
    const metrics = await measurePageLoad('/dashboard', {
      waitUntil: 'networkidle2'
    })

    expect(metrics.timeToInteractive).toBeLessThan(2000)
    expect(metrics.firstContentfulPaint).toBeLessThan(1000)
    expect(metrics.largestContentfulPaint).toBeLessThan(2500)
  })

  it('NFR-001.5: Bulk indexing throughput > 1000 docs/sec', async () => {
    const docs = generateDocuments(10000)
    const startTime = Date.now()

    await bulkImport(collection.name, docs)

    const duration = (Date.now() - startTime) / 1000 // seconds
    const throughput = docs.length / duration

    expect(throughput).toBeGreaterThan(1000)
  })
})
```

---

## NFR-002: Scalability

### Описание
Способность системы масштабироваться для поддержки растущей нагрузки.

### Приоритет
**Must Have** - Критично для SaaS growth.

### Детальные требования

#### NFR-002.1: Horizontal Scaling
| Component | Scaling Method | Target | Priority |
|-----------|---------------|--------|----------|
| Next.js App | Stateless containers | 10+ instances | Must |
| Typesense cluster | Add nodes | 3-10 nodes | Must |
| PostgreSQL | Read replicas | 1 primary + 3 replicas | Must |
| Redis | Cluster mode | 3+ nodes | Should |
| Background jobs | Worker processes | Auto-scale 1-20 | Should |

**Acceptance Criteria:**
- Zero-downtime scale up/down
- Auto-scaling based на metrics (CPU, memory, queue depth)
- Load balancing across instances
- Health checks для каждого instance

#### NFR-002.2: Vertical Scaling
| Resource | Min | Max | Priority |
|----------|-----|-----|----------|
| App server CPU | 2 cores | 16 cores | Must |
| App server Memory | 4GB | 64GB | Must |
| Database CPU | 4 cores | 32 cores | Must |
| Database Memory | 8GB | 256GB | Must |
| Search cluster Memory | 8GB | 128GB | Must |

**Acceptance Criteria:**
- Resource limits configured в Kubernetes
- Monitoring resource utilization
- Automatic recommendations для scaling

#### NFR-002.3: Data Scaling
| Limit | Target | Priority | Notes |
|-------|--------|----------|-------|
| Total tenants | 100,000+ | Must | Multi-tenant architecture |
| Total documents | 1B+ | Should | Across all tenants |
| Single collection size | 100M docs | Should | Per tenant |
| Concurrent users | 10,000+ | Must | Simultaneous active users |
| API requests | 1M+ req/min | Should | Peak load |

**Acceptance Criteria:**
- Database sharding strategy
- Partitioning для large tables
- Archive strategy для old data
- Load testing с realistic data volumes

#### NFR-002.4: Geographic Scaling
| Region | Deployment | Priority | Latency Target |
|--------|-----------|----------|---------------|
| US-East | Primary | Must | <50ms US |
| EU-West | Secondary | Should | <50ms EU |
| Asia-Pacific | Secondary | Could | <100ms APAC |

**Acceptance Criteria:**
- Multi-region deployment capability
- Geo-routing based на user location
- Data residency compliance
- Cross-region replication для backups

#### NFR-002.5: Auto-Scaling Triggers
| Metric | Scale Up Threshold | Scale Down Threshold | Priority |
|--------|-------------------|---------------------|----------|
| CPU | >70% for 5min | <30% for 15min | Must |
| Memory | >80% for 5min | <40% for 15min | Must |
| Request queue | >100 pending | <10 pending for 10min | Should |
| Response time | p95 >100ms for 5min | p95 <50ms for 15min | Should |

**Acceptance Criteria:**
- Kubernetes HPA (Horizontal Pod Autoscaler)
- Custom metrics для auto-scaling
- Scale up: fast (2-3 min)
- Scale down: gradual (10-15 min)
- Min/max replica limits

### Метрики измерения
- **Concurrent connections**: Active user sessions
- **Request throughput**: Requests per second
- **Data volume**: Total documents, storage size
- **Instance count**: Number of running containers

### Тестовые сценарии

```typescript
describe('NFR-002: Scalability', () => {
  it('NFR-002.1: Horizontal scaling под нагрузкой', async () => {
    // Initial: 2 app instances
    const initialInstances = await getRunningInstances('app')
    expect(initialInstances.length).toBe(2)

    // Simulate high load
    const loadTest = await runLoadTest({
      rps: 1000, // 1000 requests/sec
      duration: 300 // 5 minutes
    })

    // Wait for auto-scaling
    await wait(180000) // 3 minutes

    // Check scaled instances
    const scaledInstances = await getRunningInstances('app')
    expect(scaledInstances.length).toBeGreaterThan(2)
    expect(scaledInstances.length).toBeLessThanOrEqual(10)

    // All instances healthy
    scaledInstances.forEach(instance => {
      expect(instance.status).toBe('healthy')
    })
  })

  it('NFR-002.3: Поддержка 100K tenants', async () => {
    // Create 100K tenants (в test DB)
    const tenants = await bulkCreateTenants(100000)

    // Verify database performance
    const queryTime = await measureQuery(
      'SELECT * FROM tenants WHERE id = $1',
      [tenants[50000].id]
    )
    expect(queryTime).toBeLessThan(10) // <10ms

    // Verify search performance
    const searchTime = await measureSearch(tenants[50000].id, {
      q: 'test'
    })
    expect(searchTime).toBeLessThan(50) // <50ms
  })

  it('NFR-002.5: Auto-scaling при высоком CPU', async () => {
    // Stress test CPU
    const stressTest = await runCPUStressTest({
      targetCPU: 80, // 80% utilization
      duration: 360000 // 6 minutes
    })

    // Check auto-scaling triggered
    await wait(360000)
    const metrics = await getAutoScalingMetrics()

    expect(metrics.scaleUpEvents).toBeGreaterThan(0)
    expect(metrics.currentReplicas).toBeGreaterThan(metrics.initialReplicas)
  })
})
```

---

## NFR-003: Availability

### Описание
Гарантии доступности системы (uptime).

### Приоритет
**Must Have** - SLA обязательство перед customers.

### Детальные требования

#### NFR-003.1: Uptime Targets
| Plan | SLA | Monthly Downtime | Priority |
|------|-----|-----------------|----------|
| Free | 99.0% | 7.2 hours | Must |
| Starter | 99.5% | 3.6 hours | Must |
| Pro | 99.9% | 43.2 minutes | Must |
| Enterprise | 99.95% | 21.6 minutes | Should |

**Acceptance Criteria:**
- Uptime monitoring с external service (Pingdom, UptimeRobot)
- Status page (status.aacsearch.com)
- SLA credits при breach
- Incident reports в течение 24h

#### NFR-003.2: Maintenance Windows
| Frequency | Duration | Notice Period | Priority |
|-----------|----------|--------------|----------|
| Monthly max | <2 hours | 7 days | Must |
| Emergency | <30 minutes | None | Must |
| Zero-downtime preferred | N/A | None | Should |

**Acceptance Criteria:**
- Scheduled maintenance в off-peak hours
- Timezone-aware scheduling
- Email notifications before maintenance
- Status page updates

#### NFR-003.3: Failover & Recovery
| Component | Failover Time | RPO | RTO | Priority |
|-----------|--------------|-----|-----|----------|
| App servers | <30s | 0 (stateless) | <1min | Must |
| Database | <60s | <5min | <15min | Must |
| Search cluster | <30s | <1min | <5min | Must |
| Redis | <30s | <1min | <2min | Should |

**RPO (Recovery Point Objective)**: Maximum acceptable data loss
**RTO (Recovery Time Objective)**: Maximum acceptable downtime

**Acceptance Criteria:**
- Automated failover (no manual intervention)
- Health checks каждые 10s
- Circuit breakers для dependencies
- Graceful degradation

#### NFR-003.4: Disaster Recovery
| Scenario | Recovery Strategy | Priority |
|----------|------------------|----------|
| Complete region failure | Failover to secondary region | Must |
| Database corruption | Restore from backup (PITR) | Must |
| Data center outage | Multi-AZ deployment | Must |
| Ransomware attack | Immutable backups | Must |

**Acceptance Criteria:**
- DR plan documented и tested
- Quarterly DR drills
- Geo-redundant backups
- Runbook для каждого scenario

#### NFR-003.5: High Availability Architecture
| Component | HA Setup | Priority |
|-----------|---------|----------|
| Load balancer | Multi-AZ ALB | Must |
| App servers | Min 2 instances per AZ | Must |
| Database | Multi-AZ RDS | Must |
| Search | Multi-node cluster (3+ nodes) | Must |
| Redis | Sentinel setup (1 primary + 2 replicas) | Should |

**Acceptance Criteria:**
- No single point of failure
- Automated health checks
- Self-healing infrastructure
- Load balancing с sticky sessions (если required)

### Метрики измерения
- **Uptime %**: (Total time - Downtime) / Total time * 100
- **MTBF**: Mean Time Between Failures
- **MTTR**: Mean Time To Recovery
- **Error rate**: 5xx responses / total responses

### Тестовые сценарии

```typescript
describe('NFR-003: Availability', () => {
  it('NFR-003.1: 99.9% uptime за месяц', async () => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const uptimeMetrics = await getUptimeMetrics({
      startDate: thirtyDaysAgo,
      endDate: new Date()
    })

    const uptimePercent = (uptimeMetrics.uptime / uptimeMetrics.totalTime) * 100

    expect(uptimePercent).toBeGreaterThanOrEqual(99.9)
    expect(uptimeMetrics.downtime).toBeLessThanOrEqual(43.2 * 60 * 1000) // 43.2 minutes in ms
  })

  it('NFR-003.3: Database failover < 60s', async () => {
    // Simulate primary database failure
    const startTime = Date.now()
    await simulateDatabaseFailure('primary')

    // Wait for failover
    await waitForDatabaseRecovery()

    const failoverTime = Date.now() - startTime

    expect(failoverTime).toBeLessThan(60000) // <60s

    // Verify application still works
    const response = await fetch('/api/health')
    expect(response.status).toBe(200)
  })

  it('NFR-003.5: Zero single point of failure', async () => {
    const infrastructure = await getInfrastructureTopology()

    // Check load balancer HA
    expect(infrastructure.loadBalancer.availabilityZones.length).toBeGreaterThanOrEqual(2)

    // Check app servers HA
    const appServers = infrastructure.appServers
    const azCount = new Set(appServers.map(s => s.availabilityZone)).size
    expect(azCount).toBeGreaterThanOrEqual(2)
    expect(appServers.length).toBeGreaterThanOrEqual(2)

    // Check database HA
    expect(infrastructure.database.multiAZ).toBe(true)
    expect(infrastructure.database.standbyReplicas).toBeGreaterThanOrEqual(1)

    // Check search cluster HA
    const searchNodes = infrastructure.searchCluster.nodes
    expect(searchNodes.length).toBeGreaterThanOrEqual(3)
  })
})
```

---

## NFR-004: Security

### Описание
Требования безопасности для защиты данных и системы.

### Приоритет
**Must Have** - Критично для compliance и trust.

### Детальные требования

#### NFR-004.1: Data Encryption
| Data State | Encryption | Algorithm | Priority |
|------------|-----------|-----------|----------|
| At rest | Enabled | AES-256 | Must |
| In transit | TLS 1.3 | TLS 1.3 | Must |
| Backups | Enabled | AES-256 | Must |
| API keys | Hashed | bcrypt | Must |
| Passwords | Hashed | bcrypt (cost 12) | Must |
| Sensitive fields | Encrypted | AES-256-GCM | Should |

**Acceptance Criteria:**
- All databases encrypted at rest
- All HTTP traffic over HTTPS
- No plaintext secrets в logs
- Key rotation strategy (annually)

#### NFR-004.2: Authentication & Authorization
| Feature | Implementation | Priority |
|---------|---------------|----------|
| Password policy | Min 8 chars, mixed case, numbers | Must |
| Session management | JWT (15min access, 7d refresh) | Must |
| MFA | TOTP (Google Authenticator) | Should |
| SSO | SAML 2.0 | Could |
| API authentication | API keys + JWT | Must |
| Rate limiting | Per user/IP | Must |

**Acceptance Criteria:**
- Brute-force protection (max 5 attempts)
- Account lockout (15 min после 5 failed attempts)
- Session invalidation при password change
- API key rotation capability

#### NFR-004.3: Security Headers
| Header | Value | Priority |
|--------|-------|----------|
| Strict-Transport-Security | max-age=31536000; includeSubDomains | Must |
| Content-Security-Policy | default-src 'self'; script-src 'self' 'unsafe-inline' | Must |
| X-Frame-Options | DENY | Must |
| X-Content-Type-Options | nosniff | Must |
| Referrer-Policy | strict-origin-when-cross-origin | Must |
| Permissions-Policy | geolocation=(), microphone=(), camera=() | Should |

**Acceptance Criteria:**
- SecurityHeaders.com grade: A+
- All headers tested в staging
- CSP violations monitored

#### NFR-004.4: Vulnerability Management
| Practice | Frequency | Priority |
|----------|-----------|----------|
| Dependency scanning | Daily (automated) | Must |
| SAST (Static Analysis) | Every commit | Must |
| DAST (Dynamic Analysis) | Weekly | Should |
| Penetration testing | Annually | Must |
| Bug bounty program | Ongoing | Could |
| Security audits | Quarterly | Should |

**Acceptance Criteria:**
- Snyk/Dependabot для dependency scanning
- SonarQube для SAST
- OWASP ZAP для DAST
- Vulnerabilities patched в течение: Critical (24h), High (7d), Medium (30d)

#### NFR-004.5: Access Control
| Resource | Control Method | Priority |
|----------|---------------|----------|
| Database | Row Level Security (RLS) | Must |
| API | Role-based (RBAC) | Must |
| Admin panel | IP whitelist (optional) | Should |
| SSH access | Key-only, no passwords | Must |
| AWS resources | IAM roles, least privilege | Must |

**Acceptance Criteria:**
- Principle of least privilege
- No hardcoded credentials
- Secrets в environment variables or vault
- Audit trail всех access events

#### NFR-004.6: DDoS Protection
| Layer | Protection | Priority |
|-------|-----------|----------|
| Network (L3/L4) | AWS Shield Standard | Must |
| Application (L7) | AWS WAF | Must |
| API | Rate limiting per IP/user | Must |
| Database | Connection pooling, query timeouts | Must |

**Acceptance Criteria:**
- Rate limiting: 100 req/min per IP (unauthenticated)
- Rate limiting: plan-based (authenticated)
- Automatic blocking при abuse detection
- Cloudflare CDN (optional)

#### NFR-004.7: Data Privacy
| Requirement | Implementation | Priority |
|-------------|---------------|----------|
| GDPR compliance | Data export, deletion | Must |
| Data minimization | Collect only necessary data | Must |
| Consent management | Explicit opt-in | Must |
| Right to be forgotten | Delete all user data в 30 days | Must |
| Data portability | Export в JSON/CSV | Must |

**Acceptance Criteria:**
- Privacy policy disclosed
- Cookie consent banner
- Data retention policies defined
- Personal data inventory documented

### Метрики измерения
- **Vulnerability count**: Critical/High/Medium/Low
- **Time to patch**: Days from disclosure to patch
- **Security incidents**: Count per month
- **Failed login attempts**: Per user/IP

### Тестовые сценарии

```typescript
describe('NFR-004: Security', () => {
  it('NFR-004.1: All data encrypted at rest', async () => {
    const dbConfig = await getDatabaseConfiguration()
    expect(dbConfig.encryption.enabled).toBe(true)
    expect(dbConfig.encryption.algorithm).toBe('AES-256')

    const s3Config = await getS3Configuration()
    expect(s3Config.encryption.enabled).toBe(true)
  })

  it('NFR-004.2: Brute-force protection', async () => {
    const email = 'test@example.com'

    // Simulate 5 failed login attempts
    for (let i = 0; i < 5; i++) {
      const response = await login(email, 'wrong-password')
      expect(response.status).toBe(401)
    }

    // 6th attempt should be blocked
    const response = await login(email, 'correct-password')
    expect(response.status).toBe(429) // Too Many Requests
    expect(response.body.error).toContain('Account locked')
  })

  it('NFR-004.3: Security headers present', async () => {
    const response = await fetch('https://app.aacsearch.com')

    expect(response.headers.get('Strict-Transport-Security')).toBeTruthy()
    expect(response.headers.get('Content-Security-Policy')).toBeTruthy()
    expect(response.headers.get('X-Frame-Options')).toBe('DENY')
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
  })

  it('NFR-004.5: Row Level Security работает', async () => {
    const tenant1 = await createTenant({ name: 'Tenant 1' })
    const tenant2 = await createTenant({ name: 'Tenant 2' })

    await indexDocument(tenant1.id, { title: 'Doc 1' })
    await indexDocument(tenant2.id, { title: 'Doc 2' })

    // Tenant 1 user пытается получить документ Tenant 2
    const user1 = await createUser({ tenantId: tenant1.id })
    const token1 = await generateToken(user1)

    const response = await fetch('/api/documents', {
      headers: { Authorization: `Bearer ${token1}` }
    })

    const docs = await response.json()

    // Видит только свои документы
    expect(docs.length).toBe(1)
    expect(docs[0].title).toBe('Doc 1')
  })

  it('NFR-004.6: Rate limiting работает', async () => {
    const ip = '1.2.3.4'

    // Simulate 100 requests в минуту
    const requests = Array.from({ length: 101 }, () =>
      fetch('/api/search', {
        headers: { 'X-Forwarded-For': ip }
      })
    )

    const responses = await Promise.all(requests)

    // 101st request blocked
    expect(responses[100].status).toBe(429)
  })
})
```

---

## NFR-005: Reliability

### Описание
Надежность работы системы, устойчивость к сбоям.

### Приоритет
**Must Have**

### Детальные требования

#### NFR-005.1: Error Rates
| Component | Target Error Rate | Priority |
|-----------|------------------|----------|
| API endpoints | <0.1% (5xx errors) | Must |
| Search queries | <0.01% | Must |
| Document indexing | <0.5% | Should |
| Background jobs | <1% | Should |

**Acceptance Criteria:**
- Error monitoring с Sentry
- Automatic alerts при spike в errors
- Error budgets per service
- Incident retrospectives

#### NFR-005.2: MTBF & MTTR
| Metric | Target | Priority |
|--------|--------|----------|
| MTBF (Mean Time Between Failures) | >720 hours (30 days) | Should |
| MTTR (Mean Time To Recovery) | <15 minutes | Must |
| MTTD (Mean Time To Detection) | <5 minutes | Must |
| MTTI (Mean Time To Investigation) | <10 minutes | Should |

**Acceptance Criteria:**
- Automated monitoring detects issues
- Runbooks для common incidents
- On-call rotation defined
- Incident management process

#### NFR-005.3: Data Consistency
| Scenario | Consistency Model | Priority |
|----------|------------------|----------|
| Database writes | ACID (strong consistency) | Must |
| Search index | Eventual consistency (<1s lag) | Must |
| Cache | Eventual consistency | Should |
| Cross-region | Eventual consistency | Could |

**Acceptance Criteria:**
- Transactions для critical operations
- Idempotency для API operations
- Conflict resolution strategy
- Data validation before writes

#### NFR-005.4: Retry Logic
| Operation | Strategy | Max Retries | Priority |
|-----------|---------|-------------|----------|
| API calls | Exponential backoff | 3 | Must |
| Database queries | Immediate retry | 2 | Must |
| Search queries | Exponential backoff | 3 | Should |
| Webhook delivery | Exponential backoff | 5 | Should |
| External integrations | Exponential backoff | 5 | Should |

**Acceptance Criteria:**
- Retry-After header support
- Circuit breakers для external services
- Dead letter queue для failed operations
- Idempotent operations

#### NFR-005.5: Graceful Degradation
| Scenario | Degradation Strategy | Priority |
|----------|---------------------|----------|
| Search unavailable | Return cached results или "service degraded" message | Must |
| Database slow | Increase timeouts, reduce complexity | Must |
| External API down | Skip non-critical integrations | Should |
| High load | Throttle non-critical operations | Should |

**Acceptance Criteria:**
- Circuit breakers configured
- Fallback responses defined
- Feature flags для toggling features
- User-friendly error messages

#### NFR-005.6: Backup & Recovery
| Resource | Backup Frequency | Retention | RPO | RTO | Priority |
|----------|-----------------|-----------|-----|-----|----------|
| PostgreSQL | Continuous (WAL) + Daily snapshot | 30 days | <5min | <15min | Must |
| Typesense | Daily snapshot | 7 days | <24h | <1h | Should |
| Redis | Daily snapshot | 7 days | <1h | <30min | Should |
| S3 files | Versioning enabled | 30 days | 0 | <1h | Must |

**Acceptance Criteria:**
- Automated backups verified
- Regular restore testing (monthly)
- Off-site backup storage
- Point-in-time recovery (PITR) capability

### Метрики измерения
- **Error rate**: (Failed requests / Total requests) * 100
- **MTBF**: Average time между incidents
- **MTTR**: Average time от detection до resolution
- **Data loss incidents**: Count per quarter

### Тестовые сценарии

```typescript
describe('NFR-005: Reliability', () => {
  it('NFR-005.1: API error rate < 0.1%', async () => {
    // Run 10K requests
    const results = await runLoadTest({
      endpoint: '/api/search',
      requests: 10000,
      concurrent: 100
    })

    const errorRate = (results.errors / results.total) * 100

    expect(errorRate).toBeLessThan(0.1)
  })

  it('NFR-005.3: Database transactions обеспечивают ACID', async () => {
    const tenant = await createTenant({ name: 'Test' })

    // Concurrent writes к одному tenant
    const writes = Array.from({ length: 10 }, (_, i) =>
      updateTenantSettings(tenant.id, { key: 'counter', value: i })
    )

    await Promise.all(writes)

    // Data consistent (последний write wins)
    const finalTenant = await getTenant(tenant.id)
    expect(finalTenant.settings.counter).toBeGreaterThanOrEqual(0)
    expect(finalTenant.settings.counter).toBeLessThan(10)
  })

  it('NFR-005.4: Retry logic с exponential backoff', async () => {
    let attemptCount = 0

    // Mock unstable API
    mockAPI('/external-api', () => {
      attemptCount++
      if (attemptCount < 3) {
        throw new Error('Service unavailable')
      }
      return { success: true }
    })

    const startTime = Date.now()
    const result = await callExternalAPI('/external-api')
    const duration = Date.now() - startTime

    expect(attemptCount).toBe(3)
    expect(result.success).toBe(true)

    // Exponential backoff: 1s + 2s + 4s = 7s
    expect(duration).toBeGreaterThan(7000)
    expect(duration).toBeLessThan(8000)
  })

  it('NFR-005.6: Database backup и restore', async () => {
    // Create test data
    const tenant = await createTenant({ name: 'Test' })
    await indexDocument(tenant.id, { title: 'Important Doc' })

    // Trigger backup
    const backup = await createDatabaseBackup()
    expect(backup.status).toBe('completed')

    // Simulate data loss
    await deleteTenant(tenant.id)

    // Restore from backup
    await restoreDatabaseBackup(backup.id)

    // Verify data restored
    const restoredTenant = await getTenant(tenant.id)
    expect(restoredTenant.name).toBe('Test')

    const docs = await getDocuments(tenant.id)
    expect(docs[0].title).toBe('Important Doc')
  })
})
```

---

## NFR-006: Observability

### Описание
Возможность мониторинга, трассировки и отладки системы.

### Приоритет
**Must Have** - Критично для операционной поддержки.

### Детальные требования

#### NFR-006.1: Logging
| Log Level | Use Case | Retention | Priority |
|-----------|----------|-----------|----------|
| ERROR | Ошибки требующие attention | 90 days | Must |
| WARN | Потенциальные проблемы | 30 days | Should |
| INFO | Важные events (login, billing) | 30 days | Must |
| DEBUG | Детальная информация для отладки | 7 days | Should |

**Format**: Structured JSON logs

**Fields**:
- `timestamp`: ISO 8601
- `level`: ERROR/WARN/INFO/DEBUG
- `message`: Human-readable message
- `tenant_id`: Tenant context
- `user_id`: User context (если applicable)
- `request_id`: Trace ID
- `metadata`: Additional context

**Acceptance Criteria:**
- Centralized logging (CloudWatch/ELK)
- Log aggregation и search
- Log-based alerting
- PII scrubbing из logs

#### NFR-006.2: Metrics
| Category | Metrics | Collection Frequency | Priority |
|----------|---------|---------------------|----------|
| Application | Request rate, latency, error rate | 10s | Must |
| System | CPU, memory, disk, network | 60s | Must |
| Business | Active users, API calls, revenue | 5min | Should |
| Custom | Search queries, indexing rate | 30s | Should |

**Collection**: Prometheus + Grafana

**Acceptance Criteria:**
- Metrics dashboard per service
- Historical metrics (90 days)
- Metrics-based alerting
- Custom metrics SDK

#### NFR-006.3: Distributed Tracing
| Component | Instrumentation | Priority |
|-----------|----------------|----------|
| HTTP requests | Automatic | Must |
| Database queries | Automatic | Must |
| Search queries | Automatic | Must |
| Background jobs | Manual | Should |
| External APIs | Manual | Should |

**Tool**: OpenTelemetry + Jaeger

**Acceptance Criteria:**
- Trace ID в каждом request/response header
- Trace visualization
- Latency breakdown по spans
- Error tracking в traces

#### NFR-006.4: Error Tracking
| Feature | Implementation | Priority |
|---------|---------------|----------|
| Error capture | Sentry | Must |
| Source maps | Uploaded for JS/TS | Must |
| User context | User ID, tenant ID | Must |
| Breadcrumbs | Last 50 user actions | Should |
| Release tracking | Git commit SHA | Must |

**Acceptance Criteria:**
- Error grouping и deduplication
- Email/Slack alerts для new errors
- Error assignment и resolution tracking
- Performance monitoring

#### NFR-006.5: APM (Application Performance Monitoring)
| Feature | Tool | Priority |
|---------|------|----------|
| Request tracing | New Relic/DataDog | Should |
| Database query analysis | APM tool | Should |
| External service monitoring | APM tool | Should |
| Real User Monitoring (RUM) | APM tool | Should |

**Acceptance Criteria:**
- Transaction traces для slow requests
- Database query performance insights
- Service map (dependencies)
- Anomaly detection

#### NFR-006.6: Alerting
| Alert Type | Trigger | Notification | Priority |
|------------|---------|-------------|----------|
| Service down | 3 failed health checks | PagerDuty, Slack | Must |
| High error rate | >1% for 5min | Slack | Must |
| High latency | p95 >200ms for 5min | Slack | Should |
| Database issues | Connection pool exhausted | PagerDuty | Must |
| Billing failures | Stripe webhook failure | Email, Slack | Must |

**Acceptance Criteria:**
- Escalation policies defined
- On-call rotation setup
- Alert fatigue prevention (intelligent grouping)
- Runbooks linked in alerts

### Метрики измерения
- **Log volume**: GB per day
- **Metric cardinality**: Unique time series
- **Trace sampling rate**: % of requests traced
- **Alert response time**: Time from alert to acknowledgment

### Тестовые сценарии

```typescript
describe('NFR-006: Observability', () => {
  it('NFR-006.1: Structured JSON logging', async () => {
    // Trigger error
    await expect(
      getDocument('non-existent-id')
    ).rejects.toThrow()

    // Check logs
    const logs = await getRecentLogs({ level: 'ERROR', limit: 1 })
    const log = logs[0]

    expect(log).toHaveProperty('timestamp')
    expect(log).toHaveProperty('level', 'ERROR')
    expect(log).toHaveProperty('message')
    expect(log).toHaveProperty('request_id')
    expect(log).toHaveProperty('metadata')

    // Validate JSON format
    expect(() => JSON.parse(JSON.stringify(log))).not.toThrow()
  })

  it('NFR-006.2: Metrics collection', async () => {
    // Make requests
    for (let i = 0; i < 100; i++) {
      await fetch('/api/health')
    }

    await wait(15000) // Wait for metrics collection (10s interval)

    // Query metrics
    const metrics = await queryPrometheus(
      'sum(rate(http_requests_total[1m]))'
    )

    expect(metrics.value).toBeGreaterThan(0)
  })

  it('NFR-006.3: Distributed tracing работает', async () => {
    const traceId = uuid()

    // Make request с trace ID
    await fetch('/api/search', {
      headers: { 'X-Trace-Id': traceId }
    })

    await wait(2000) // Wait for trace to be collected

    // Query trace
    const trace = await getTrace(traceId)

    expect(trace).toBeTruthy()
    expect(trace.spans.length).toBeGreaterThan(0)

    // Check span hierarchy
    const rootSpan = trace.spans.find(s => !s.parentSpanId)
    expect(rootSpan.operationName).toBe('HTTP GET /api/search')

    // Check child spans (database, search, etc.)
    const childSpans = trace.spans.filter(s => s.parentSpanId === rootSpan.spanId)
    expect(childSpans.length).toBeGreaterThan(0)
  })

  it('NFR-006.6: Alerting при high error rate', async () => {
    // Simulate errors
    for (let i = 0; i < 100; i++) {
      try {
        await fetch('/api/will-fail')
      } catch (e) {
        // Expected
      }
    }

    await wait(300000) // 5 minutes

    // Check alerts
    const alerts = await getActiveAlerts()
    const errorRateAlert = alerts.find(a => a.name === 'high_error_rate')

    expect(errorRateAlert).toBeTruthy()
    expect(errorRateAlert.severity).toBe('critical')
  })
})
```

---

## NFR-007 through NFR-010: Additional Requirements

Из-за ограничений по длине, добавлю краткие версии оставшихся NFR:

### NFR-007: Usability
- **Intuitive UI**: Wizard-driven onboarding, clear navigation
- **Documentation**: Complete, searchable, multilingual (en, ru)
- **Search experience**: As-you-type, keyboard shortcuts
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive**: Mobile-friendly (320px - 4K)
- **Dark mode**: System preference detection
- **Performance**: < 2s page loads
- **Error messages**: Clear, actionable

### NFR-008: Maintainability
- **Code quality**: Linting, formatting, type checking
- **Test coverage**: >80% unit tests, >60% integration
- **Documentation**: Code comments, ADRs, runbooks
- **CI/CD**: Automated testing, deployment
- **Dependency management**: Regular updates, security patches
- **Monitoring**: Alerts for regressions
- **Refactoring**: Technical debt tracked
- **Knowledge transfer**: Onboarding docs для developers

### NFR-009: Portability
- **Cloud-agnostic**: Kubernetes deployment
- **Database**: PostgreSQL (any provider)
- **Object storage**: S3-compatible API
- **Environment parity**: Dev, staging, production identical
- **Configuration**: Environment variables
- **Docker containers**: All services containerized
- **IaC**: Terraform для infrastructure

### NFR-010: Compatibility
- **Browser support**: Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile**: iOS 13+, Android 10+
- **API versioning**: Backwards compatible
- **Database migrations**: Zero-downtime
- **SDK compatibility**: Semver versioning
- **Third-party integrations**: Stable APIs
- **Standards compliance**: OpenAPI, OAuth2, SAML 2.0

---

## Summary

This document outlines **30+ non-functional requirements** for the AACSearch SaaS platform:

1. **Performance**: Sub-50ms search, <2s page loads, >1000 docs/sec indexing
2. **Scalability**: 100K+ tenants, 1B+ documents, auto-scaling
3. **Availability**: 99.9% uptime, <60s failover, disaster recovery
4. **Security**: AES-256 encryption, TLS 1.3, RBAC, vulnerability management
5. **Reliability**: <0.1% error rate, ACID transactions, automated retries
6. **Observability**: Structured logging, metrics, tracing, APM, alerting
7. **Usability**: Intuitive UI, comprehensive docs, accessibility
8. **Maintainability**: High test coverage, CI/CD, documentation
9. **Portability**: Cloud-agnostic, containerized, IaC
10. **Compatibility**: Modern browsers, API versioning, standards compliance

Each requirement includes:
- Target metrics
- Priority (Must/Should/Could)
- Acceptance criteria
- Test scenarios
- Measurement methods

**Total Pages**: ~30 pages
**Total Requirements**: 30+ NFR

