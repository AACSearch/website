# Service Level Agreements (SLA)

## Оглавление

- [Введение](#введение)
- [Uptime SLA](#uptime-sla)
- [Performance SLA](#performance-sla)
- [Support SLA](#support-sla)
- [Scheduled Maintenance](#scheduled-maintenance)
- [Incident Response](#incident-response)
- [SLA Credits](#sla-credits)
- [Monitoring & Reporting](#monitoring--reporting)
- [Exclusions](#exclusions)

---

## Введение

### Определения

**SLA (Service Level Agreement)**: Формальное соглашение между AACSearch и клиентом об уровне предоставляемого сервиса.

**Uptime**: Процент времени, когда сервис доступен для использования.

**Downtime**: Период, когда сервис недоступен из-за проблем на стороне AACSearch.

**Maintenance Window**: Запланированный период технического обслуживания.

**Incident**: Незапланированное событие, приводящее к снижению качества или недоступности сервиса.

### Scope

Данный SLA применяется ко всем платным планам (Starter, Pro, Enterprise).

Free план предоставляется "as is" без SLA гарантий.

### Измерение

**Measurement Period**: Календарный месяц (с 00:00:00 1-го числа до 23:59:59 последнего числа месяца UTC).

**Monitoring**: Continuous monitoring с external и internal проверками каждые 60 секунд.

---

## Uptime SLA

### Uptime Targets

| Plan | Uptime SLA | Max Monthly Downtime | Priority |
|------|-----------|---------------------|----------|
| Free | 99.0% (best effort) | 7.2 hours | No guarantee |
| Starter | 99.5% | 3.6 hours (216 minutes) | Guaranteed |
| Pro | 99.9% | 43.2 minutes | Guaranteed |
| Enterprise | 99.95% | 21.6 minutes | Guaranteed + Custom |

### Uptime Calculation

```
Uptime % = (Total Minutes in Month - Downtime Minutes) / Total Minutes in Month × 100
```

**Example** (30-day month):
- Total minutes: 30 × 24 × 60 = 43,200
- Downtime: 60 minutes
- Uptime: (43,200 - 60) / 43,200 × 100 = 99.86%

### Uptime Scope

**Included in Uptime**:
- API endpoint `/api/health` returning 200 OK
- Ability to authenticate (login)
- Ability to perform search queries
- Ability to index documents (CRUD operations)
- Dashboard accessible и functional

**Excluded from Downtime** (не считается breach):
- Scheduled maintenance (с уведомлением)
- Client-side issues (network, browser, etc.)
- Force majeure events (natural disasters, war, etc.)
- Third-party service failures (AWS region outage)
- DDoS attacks (until mitigation activated)
- Client-caused downtime (misconfiguration, quota exceeded)

### Multi-Region SLA (Enterprise Only)

Для Enterprise customers с multi-region deployment:

| Configuration | SLA | Max Monthly Downtime |
|---------------|-----|---------------------|
| Single region | 99.95% | 21.6 minutes |
| Multi-region (active-passive) | 99.99% | 4.32 minutes |
| Multi-region (active-active) | 99.995% | 2.16 minutes |

**Requirements**:
- Client must configure failover
- DNS TTL ≤ 60 seconds
- Health checks configured

---

## Performance SLA

### Search Latency

| Plan | p50 Target | p95 Target | p99 Target | Priority |
|------|-----------|-----------|-----------|----------|
| Free | <50ms | <100ms | <200ms | Best effort |
| Starter | <30ms | <75ms | <150ms | Guaranteed |
| Pro | <20ms | <50ms | <100ms | Guaranteed |
| Enterprise | <15ms | <40ms | <80ms | Custom available |

**Measurement**:
- Server-side latency (excluding network)
- Measured от API gateway до response
- Percentiles calculated за 24-hour rolling window

**Exclusions**:
- Complex queries (>5 filters, >3 facets)
- Large result sets (>100 results per page)
- Semantic/Vector search (separate SLA)
- NL/Conversational search (separate SLA)

### API Response Time

| Endpoint Category | p95 Target | Priority |
|------------------|-----------|----------|
| Read operations (GET) | <100ms | Guaranteed |
| Write operations (POST/PATCH) | <200ms | Guaranteed |
| Bulk operations | <5s per 1000 records | Guaranteed |
| Analytics queries | <1s | Best effort |

### Page Load Time

| Page | LCP Target | FID Target | CLS Target | Priority |
|------|-----------|-----------|-----------|----------|
| Dashboard | <2.5s | <100ms | <0.1 | Guaranteed |
| Collections | <2.5s | <100ms | <0.1 | Guaranteed |
| Search UI | <2.5s | <100ms | <0.1 | Guaranteed |
| Analytics | <3s | <100ms | <0.1 | Best effort |

**Measurement**: Core Web Vitals (CWV) от Chrome User Experience Report.

### Indexing Throughput

| Operation | Throughput Target | Priority |
|-----------|------------------|----------|
| Single document index | <100ms | Guaranteed |
| Bulk import | >500 docs/sec | Guaranteed |
| Reindexing | >300 docs/sec | Best effort |

### Performance SLA Breach

Performance SLA считается нарушенным если:
- Метрика ниже target >10% времени в течение 24 hours
- AND клиент reported issue через support
- AND AACSearch confirms issue (не client-side)

**Credits**: 5% monthly fee за каждый день breach.

---

## Support SLA

### Support Tiers

| Plan | Channels | Business Hours | Response Time | Resolution Time | Priority |
|------|----------|---------------|---------------|----------------|----------|
| Free | Community forum, Discord | Best effort | Best effort | Best effort | - |
| Starter | Email | Mon-Fri 9am-5pm PST | 48 hours | 7 business days | Guaranteed |
| Pro | Email + Live Chat | Mon-Fri 9am-9pm PST | 24 hours | 3 business days | Guaranteed |
| Enterprise | Email + Chat + Phone | 24/7 | 1 hour (critical) | 24 hours (critical) | Custom SLA |

### Priority Definitions

#### P1 - Critical
- **Definition**: Service completely unavailable или major functionality broken affecting all users.
- **Examples**: API down, database unavailable, authentication broken.
- **Response**:
  - Starter: 4 hours
  - Pro: 2 hours
  - Enterprise: 1 hour
- **Resolution Target**:
  - Starter: 24 hours
  - Pro: 12 hours
  - Enterprise: 4 hours
- **Updates**: Every 2 hours until resolved

#### P2 - High
- **Definition**: Major feature unavailable или significant performance degradation.
- **Examples**: Search slow (>500ms), bulk import failing, analytics not loading.
- **Response**:
  - Starter: 24 hours
  - Pro: 8 hours
  - Enterprise: 4 hours
- **Resolution Target**:
  - Starter: 7 days
  - Pro: 3 days
  - Enterprise: 24 hours
- **Updates**: Daily

#### P3 - Medium
- **Definition**: Minor feature issue, workaround available.
- **Examples**: UI bug, documentation error, minor API inconsistency.
- **Response**:
  - Starter: 48 hours
  - Pro: 24 hours
  - Enterprise: 8 hours
- **Resolution Target**:
  - Starter: 14 days
  - Pro: 7 days
  - Enterprise: 3 days
- **Updates**: Every 3 days

#### P4 - Low
- **Definition**: Feature request, question, cosmetic issue.
- **Examples**: "How do I...?", "Can you add...?", color scheme feedback.
- **Response**:
  - Starter: 5 business days
  - Pro: 3 business days
  - Enterprise: 24 hours
- **Resolution Target**: Best effort
- **Updates**: As needed

### Support Channels

#### Community Forum (Free)
- **URL**: community.aacsearch.com
- **Response**: Community-driven, no SLA
- **Languages**: English, Russian

#### Discord (Free)
- **Server**: discord.gg/aacsearch
- **Response**: Community + team members (best effort)
- **Hours**: 24/7 community, team during business hours

#### Email (Starter+)
- **Address**: support@aacsearch.com
- **Auto-reply**: Immediate (ticket created)
- **First response**: Per SLA above
- **Languages**: English, Russian

#### Live Chat (Pro+)
- **Widget**: In-app chat
- **Hours**: Mon-Fri 9am-9pm PST
- **Response**: <5 minutes during hours, email outside hours
- **Languages**: English

#### Phone (Enterprise)
- **Number**: Provided при onboarding
- **Hours**: 24/7
- **Response**: <15 minutes
- **Languages**: English
- **Escalation**: To engineering team if needed

### Dedicated Support (Enterprise)

- **Slack Connect**: Dedicated Slack channel
- **Customer Success Manager**: Named CSM
- **Technical Account Manager**: Named TAM
- **Quarterly Business Reviews**: QBR meetings
- **Custom Integrations**: Engineering assistance
- **Training**: Onsite or remote training sessions

---

## Scheduled Maintenance

### Frequency & Duration

| Plan | Max Frequency | Max Duration | Notice Period | Priority |
|------|--------------|-------------|---------------|----------|
| All plans | Monthly | 2 hours | 7 days | Standard |
| Emergency | As needed | 30 minutes | None (if critical) | Critical |

### Maintenance Windows

**Preferred Windows** (UTC):
- **Americas**: Tuesday/Wednesday 2am-4am PST (10am-12pm UTC)
- **Europe**: Tuesday/Wednesday 2am-4am CET (1am-3am UTC)
- **Asia-Pacific**: Tuesday/Wednesday 2am-4am JST (5pm-7pm UTC previous day)

**Selection**: Based on tenant's primary region or custom agreement (Enterprise).

### Notification Process

**7 Days Before**:
- Status page announcement
- Email to all tenant admins
- In-app banner notification
- API header: `X-Maintenance-Scheduled: YYYY-MM-DD HH:MM UTC`

**24 Hours Before**:
- Reminder email
- In-app notification
- Social media announcement

**1 Hour Before**:
- Final warning email
- Status page update

**During Maintenance**:
- Status page: "Maintenance in Progress"
- API returns 503 with Retry-After header
- Maintenance page shown

**After Completion**:
- Status page: "All Systems Operational"
- Email confirmation
- Incident report (if issues occurred)

### Zero-Downtime Deployments

**Goal**: Majority of deployments should be zero-downtime.

**Method**:
- Blue-green deployments
- Rolling updates (Kubernetes)
- Database migrations applied before code deploy
- Feature flags for new features

**When Downtime Required**:
- Major database schema changes
- Infrastructure upgrades (rare)
- Third-party service maintenance

---

## Incident Response

### Incident Severity Levels

| Severity | Definition | Example | Response Time | Communication Frequency |
|----------|-----------|---------|---------------|------------------------|
| Critical | Complete service outage | API down, all searches failing | 15 minutes | Every 30 minutes |
| High | Major functionality impaired | Slow searches (>5s), indexing failing | 1 hour | Every 2 hours |
| Medium | Minor functionality impaired | Single feature broken, intermittent errors | 4 hours | Every 8 hours |
| Low | Minimal impact | Cosmetic issue, documentation error | 24 hours | As needed |

### Incident Lifecycle

#### 1. Detection (MTTD < 5 minutes)
- Automated monitoring alerts
- Customer reports via support
- Internal team discovery

#### 2. Acknowledgment (MTTR-Ack)
- Critical: <15 minutes
- High: <1 hour
- Medium: <4 hours

**Actions**:
- Incident created в system
- Status page updated
- On-call engineer paged (Critical/High)
- Incident commander assigned (Critical)

#### 3. Investigation (MTTI < 10 minutes for Critical)
- Root cause analysis
- Impact assessment
- Workaround identification
- Communication strategy

#### 4. Mitigation (MTTR < 15 minutes for Critical)
- Apply hotfix или workaround
- Rollback if deployment caused issue
- Scale resources if capacity issue
- Isolate affected component

#### 5. Resolution (MTTR per SLA)
- Permanent fix applied
- Testing в staging
- Production deployment
- Monitoring for recurrence

#### 6. Post-Mortem (Within 72 hours)
- RCA (Root Cause Analysis) document
- Timeline of events
- Contributing factors
- Action items (preventative measures)
- Shared with affected customers (Enterprise)

### Communication Channels

#### Status Page
- **URL**: status.aacsearch.com
- **Updates**: Real-time
- **Subscription**: Email, SMS, Slack, RSS
- **History**: 90 days

#### Email Notifications
- Incident created
- Status updates (per severity)
- Incident resolved
- Post-mortem available

#### In-App Notifications
- Banner for ongoing incidents
- Toast notifications for updates

#### Social Media
- Twitter: @AACSearchStatus
- Updates для major incidents only

### Escalation Matrix

**Level 1**: On-Call Engineer
- **Response**: 15 minutes
- **Escalate After**: 30 minutes (Critical), 2 hours (High)

**Level 2**: Senior Engineer + DevOps
- **Response**: 30 minutes
- **Escalate After**: 1 hour (Critical), 4 hours (High)

**Level 3**: Engineering Manager + CTO
- **Response**: 1 hour
- **Escalate After**: 2 hours (Critical)

**Level 4**: CEO (for major outages)
- **Response**: Immediate
- **Action**: Customer communication, external PR

---

## SLA Credits

### Credit Calculation

When SLA is breached, customers are entitled to service credits.

#### Uptime SLA Credits

| Uptime Achieved | Credit (% of Monthly Fee) |
|----------------|---------------------------|
| 99.5% - 99.0% | 10% |
| 99.0% - 95.0% | 25% |
| 95.0% - 90.0% | 50% |
| Below 90.0% | 100% |

**Example** (Pro plan, $99/month):
- Month uptime: 99.3%
- Credit: $99 × 10% = $9.90

#### Performance SLA Credits

If performance SLA breached (>10% of time below target):
- **Credit**: 5% of monthly fee per day of breach
- **Max**: 50% of monthly fee per month

**Example** (Pro plan, $99/month):
- Search latency >50ms p95 для 3 days
- Credit: $99 × 5% × 3 = $14.85

#### Support SLA Credits

If response time SLA breached:
- **P1/P2**: 10% of monthly fee
- **P3/P4**: No credits (best effort)

**Max**: 25% of monthly fee per month

### Credit Request Process

1. **Customer submits request**:
   - Via support ticket
   - Within 30 days of incident
   - Include dates, description, impact

2. **AACSearch reviews**:
   - Verify monitoring data
   - Confirm SLA breach
   - Calculate credit amount

3. **Credit applied**:
   - Within 15 business days
   - Applied to next invoice
   - Or refunded if subscription cancelled

4. **Notification**:
   - Email confirmation
   - Credit memo issued

### Credit Limitations

**Maximum Credits**: 100% of monthly fee per month

**No Cash Value**: Credits applied to future invoices only, not refundable.

**Not Combinable**: Credits for same incident cannot be combined across categories.

**Free Plan**: Not eligible for credits.

**Exclusions**: Credits not applied for:
- Downtime covered by exclusions (see Uptime SLA)
- Beta/preview features
- Deprecated features
- Client-caused issues

---

## Monitoring & Reporting

### Real-Time Monitoring

**Status Page**: status.aacsearch.com
- Current status: Operational, Degraded, Partial Outage, Major Outage
- Component status: API, Dashboard, Search, Database, etc.
- Historical incidents
- Scheduled maintenance

**Dashboards** (Enterprise):
- Custom Grafana dashboard
- Real-time metrics
- Performance trends
- Resource utilization

### Monthly Reports

**Included** (Pro+):
- Uptime percentage
- Performance metrics (latency percentiles)
- Incident summary
- Support ticket statistics
- Usage statistics (API calls, searches, etc.)

**Delivery**: Email by 5th business day of following month.

**Format**: PDF + CSV data

### Quarterly Business Reviews (Enterprise)

**Agenda**:
- Service performance review
- Incident analysis
- Roadmap updates
- Feature requests review
- Optimization recommendations
- Contract renewal discussion

**Participants**:
- Customer Success Manager
- Technical Account Manager
- Customer stakeholders

**Deliverables**:
- QBR presentation
- Action items tracking
- Success metrics dashboard

### Custom Monitoring (Enterprise)

**Available**:
- Webhooks for status changes
- API for metrics export
- Grafana integration
- Custom alerts

---

## Exclusions

### Excluded from SLA Coverage

The following are **NOT** covered by SLA and do not count toward downtime:

#### 1. Force Majeure
- Natural disasters (earthquakes, hurricanes, floods)
- War, terrorism, civil unrest
- Government actions, embargoes
- Pandemic-related restrictions
- Utility failures (power, internet backbone)

#### 2. Third-Party Failures
- AWS/GCP/Azure region outages
- DNS provider failures
- CDN provider issues
- Third-party API failures (OpenAI, Stripe)
- **Exception**: If multi-region setup available and not utilized

#### 3. Scheduled Maintenance
- With 7 days notice
- Within defined maintenance windows
- Duration ≤ 2 hours

#### 4. Emergency Maintenance
- Critical security patches
- Data integrity issues
- Preventing imminent service failure
- **Note**: Best effort notification (target 1 hour)

#### 5. Client-Caused Issues
- Exceeded rate limits
- Exceeded quota (storage, API calls)
- Invalid API usage (malformed requests)
- DDoS attack on client's application
- Misconfiguration by client
- Client's network/infrastructure issues

#### 6. Beta/Preview Features
- Features marked "Beta", "Alpha", "Preview"
- Experimental features
- Labs features
- **Note**: Promoted to GA after stabilization

#### 7. Deprecated Features
- Features announced as deprecated
- After deprecation notice period (90 days)

#### 8. Client Refusal of Recommendations
- Scaling recommendations ignored
- Security patches not applied (client-managed)
- Best practices not followed

---

## Appendix

### SLA Definitions Summary

| Term | Definition |
|------|-----------|
| Uptime | % of time service available |
| Downtime | Time service unavailable due to AACSearch issues |
| MTBF | Mean Time Between Failures |
| MTTR | Mean Time To Recovery |
| MTTD | Mean Time To Detection |
| MTTI | Mean Time To Investigation |
| RTO | Recovery Time Objective |
| RPO | Recovery Point Objective |

### Contact Information

**Support**: support@aacsearch.com

**Sales**: sales@aacsearch.com

**Security**: security@aacsearch.com

**Status**: status.aacsearch.com

**Documentation**: docs.aacsearch.com

### SLA Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-01-01 | Initial SLA |
| 1.1 | 2024-06-01 | Added Performance SLA |
| 1.2 | 2024-09-01 | Enhanced Enterprise support |

**Current Version**: 1.2

**Last Updated**: 2024-09-01

**Next Review**: 2025-01-01

---

## Summary

### SLA Quick Reference

| Metric | Free | Starter | Pro | Enterprise |
|--------|------|---------|-----|-----------|
| **Uptime** | 99% | 99.5% | 99.9% | 99.95% |
| **Max Downtime/Month** | 7.2h | 3.6h | 43min | 21min |
| **Search Latency (p95)** | <100ms | <75ms | <50ms | <40ms |
| **Support Response** | - | 48h | 24h | 1h |
| **Support Hours** | - | Business | Extended | 24/7 |
| **Maintenance Notice** | 7 days | 7 days | 7 days | 7 days |
| **Credits** | No | Yes | Yes | Yes |

**Total Pages**: ~20 pages

