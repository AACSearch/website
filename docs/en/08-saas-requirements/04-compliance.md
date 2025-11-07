# Compliance и сертификации

## Оглавление

- [Введение](#введение)
- [GDPR (General Data Protection Regulation)](#gdpr-general-data-protection-regulation)
- [SOC 2 Type II](#soc-2-type-ii)
- [ISO 27001](#iso-27001)
- [CCPA (California Consumer Privacy Act)](#ccpa-california-consumer-privacy-act)
- [PCI DSS](#pci-dss)
- [HIPAA](#hipaa)
- [Privacy Shield / Data Transfer](#privacy-shield--data-transfer)
- [Compliance Roadmap](#compliance-roadmap)

---

## Введение

### Важность Compliance

AACSearch обрабатывает критичные данные клиентов и должен соответствовать международным стандартам безопасности и приватности.

### Scope

Данный документ описывает требования compliance для:
- Обработки персональных данных (GDPR, CCPA)
- Безопасности информации (SOC 2, ISO 27001)
- Индустриальных стандартов (PCI DSS, HIPAA)

### Compliance по планам

| Compliance | Free | Starter | Pro | Enterprise |
|-----------|------|---------|-----|-----------|
| GDPR | ✅ | ✅ | ✅ | ✅ |
| SOC 2 Type II | ⏳ Planned | ⏳ Planned | ✅ | ✅ |
| ISO 27001 | ❌ | ❌ | ⏳ Planned | ✅ |
| CCPA | ✅ | ✅ | ✅ | ✅ |
| PCI DSS | N/A (Stripe) | N/A (Stripe) | N/A (Stripe) | N/A (Stripe) |
| HIPAA | ❌ | ❌ | ❌ | ✅ (BAA required) |

---

## GDPR (General Data Protection Regulation)

### Описание

GDPR — европейский регламент по защите персональных данных, вступивший в силу 25 мая 2018.

**Применимость**: Любая компания, обрабатывающая данные резидентов ЕС.

**Штрафы**: До €20M или 4% годового оборота (что больше).

### GDPR Principles

#### 1. Lawfulness, Fairness, Transparency

**Требования**:
- Легальное основание для обработки данных
- Прозрачность: объяснить что, зачем, как долго
- Честность: не использовать данные не по назначению

**Реализация в AACSearch**:
- Privacy Policy опубликована и доступна
- Consent при регистрации (explicit opt-in)
- Clear disclosure использования данных
- Data Processing Agreement (DPA) для Enterprise

**Документы**:
- `/legal/privacy-policy`
- `/legal/dpa` (Data Processing Agreement)
- `/legal/terms-of-service`

#### 2. Purpose Limitation

**Требование**: Данные собираются для конкретных целей и не используются для других.

**Реализация**:
- Четкое определение purposes: authentication, billing, analytics
- Consent per purpose (granular)
- No secondary use без дополнительного consent
- Data minimization: собираем только необходимое

**Purposes в AACSearch**:
- **Authentication**: Email, password, session data
- **Billing**: Name, payment info (через Stripe)
- **Analytics**: Usage stats (anonymized where possible)
- **Support**: Support tickets, communications

#### 3. Data Minimization

**Требование**: Собирать только необходимые данные.

**Реализация**:
- Минимальная регистрация: email + password
- Опциональные поля: name, company (не required)
- No tracking cookies without consent
- Analytics anonymized (IP truncation)

**Не собираем**:
- Social security numbers
- Government IDs
- Race, religion, political views
- Health information (unless HIPAA customer)

#### 4. Accuracy

**Требование**: Данные должны быть точными и актуальными.

**Реализация**:
- User может обновить profile в любое время
- Email verification required
- Automatic cleanup старых неверифицированных accounts (90 days)

#### 5. Storage Limitation

**Требование**: Данные хранятся не дольше необходимого.

**Реализация**:
| Data Type | Retention Period | Reason |
|-----------|-----------------|--------|
| User accounts | Until deletion request | Active use |
| Audit logs | 90 days (Standard), 1 year (Enterprise) | Security, compliance |
| Search queries | 30 days | Analytics |
| Support tickets | 3 years | Legal requirement |
| Billing records | 7 years | Tax, accounting |
| Backups | 30 days | Disaster recovery |

**Automatic Deletion**:
- Unverified emails после 7 days
- Inactive free accounts после 12 months (with notice)
- Data после account deletion: 30 days

#### 6. Integrity & Confidentiality

**Требование**: Защита данных от unauthorized access, loss, destruction.

**Реализация**:
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Access control (RBAC)
- Audit logging
- Regular security audits
- Incident response plan

#### 7. Accountability

**Требование**: Демонстрация соблюдения GDPR.

**Реализация**:
- DPO (Data Protection Officer) назначен (для Enterprise)
- Records of Processing Activities (ROPA)
- Data Protection Impact Assessments (DPIA)
- Privacy by Design
- Regular compliance audits

### Data Subject Rights

#### Right to Access (Article 15)

**User может**:
- Получить копию всех своих данных
- Узнать purpose обработки
- Узнать retention period
- Узнать третьи стороны, с которыми data shared

**Реализация**:
- Self-service export в dashboard: "Download My Data"
- Format: JSON или CSV
- Includes: profile, documents, search history, audit logs
- Response time: Immediate (automated)

**API Endpoint**:
```typescript
GET /api/user/export
Authorization: Bearer <token>

Response: {
  "user": { /* user profile */ },
  "tenants": [ /* tenant memberships */ ],
  "documents": [ /* created documents */ ],
  "searches": [ /* search queries */ ],
  "audit_logs": [ /* user actions */ ]
}
```

#### Right to Rectification (Article 16)

**User может**: Исправить неточные данные.

**Реализация**:
- Profile edit page
- Email change (with verification)
- API для programmatic updates
- No admin approval required

#### Right to Erasure ("Right to be Forgotten") (Article 17)

**User может**: Удалить все свои данные.

**Реализация**:
- "Delete Account" button в settings
- Confirmation dialog (prevent accidental deletion)
- Grace period: 30 days (soft delete)
- Hard delete после 30 days:
  - User account
  - All documents
  - Search history
  - Audit logs (except legal/billing records)
- Email confirmation

**Exceptions** (legal obligation to keep):
- Billing records (7 years)
- Support tickets related to legal matters (3 years)
- Fraud prevention records (5 years)

**API Endpoint**:
```typescript
DELETE /api/user
Authorization: Bearer <token>

Response: {
  "status": "scheduled",
  "deletion_date": "2024-12-31T00:00:00Z",
  "message": "Your account will be deleted after 30 days"
}
```

#### Right to Restrict Processing (Article 18)

**User может**: Ограничить обработку данных.

**Реализация**:
- Account suspension (без deletion)
- Temporary disable: analytics tracking, marketing emails
- Data not deleted but not actively used

#### Right to Data Portability (Article 20)

**User может**: Получить данные в machine-readable format.

**Реализация**:
- Export formats: JSON, CSV, XML
- Includes all user-created data
- Compatible с другими services
- Automated, instant download

#### Right to Object (Article 21)

**User может**: Возразить против обработки (especially marketing).

**Реализация**:
- Unsubscribe from marketing emails (one-click)
- Opt-out analytics tracking
- Opt-out profiling
- Preferences saved per tenant

#### Rights Related to Automated Decision-Making (Article 22)

**User может**: Не быть subject automated decisions без human intervention.

**Реализация**:
- No automated decisions affecting users (pricing, access, etc.)
- Fraud detection: manual review for bans
- Human oversight для critical decisions

### GDPR Compliance Measures

#### Data Protection Officer (DPO)

**Required**: For Enterprise customers или if processing sensitive data.

**Contact**: dpo@aacsearch.com

**Responsibilities**:
- Monitor GDPR compliance
- Conduct DPIAs
- Advise on data protection
- Liaise with supervisory authorities

#### Data Processing Agreements (DPA)

**Required**: Для всех customers (AACSearch = data processor).

**Included**:
- Purpose and duration of processing
- Types of data processed
- Obligations of processor
- Sub-processors list
- Security measures
- Data breach notification
- Data deletion procedures

**Signing**: Electronic signature, included в Enterprise agreements.

#### Records of Processing Activities (ROPA)

**Maintained**:
- Who: Data controller/processor identification
- What: Data categories
- Why: Purpose of processing
- Where: Data locations, transfers
- How long: Retention periods
- How: Security measures

**Review**: Annually или при major changes.

#### Data Protection Impact Assessment (DPIA)

**Required When**:
- Large-scale processing sensitive data
- Systematic monitoring
- New technologies with high risk

**Process**:
1. Describe processing activities
2. Assess necessity and proportionality
3. Identify risks to data subjects
4. Mitigation measures
5. Document и review

**Frequency**: Before new major features, annually для existing.

#### Privacy by Design & Default

**Principles**:
- Proactive, not reactive
- Privacy as default setting
- Privacy embedded into design
- Full functionality (positive-sum)
- End-to-end security
- Visibility and transparency
- Respect user privacy

**Implementation**:
- Encryption by default
- Minimal data collection
- Pseudonymization где possible
- Access controls
- Automatic data deletion

#### Data Breach Notification

**Requirement**: Notify supervisory authority в течение 72 hours.

**Process**:
1. **Detection**: Monitoring, alerts
2. **Assessment**: Severity, affected users, risk
3. **Containment**: Stop breach, secure systems
4. **Notification**:
   - Supervisory authority (72h)
   - Affected users (without undue delay)
   - DPO informed
5. **Documentation**: Incident report
6. **Remediation**: Fix vulnerability
7. **Post-mortem**: Lessons learned

**Communication Template**:
- Nature of breach
- Data categories affected
- Approximate number of users
- Consequences
- Measures taken
- Contact point for inquiries

### Sub-Processors

GDPR требует disclosure sub-processors.

**AACSearch Sub-Processors**:
| Sub-Processor | Purpose | Data Processed | Location |
|--------------|---------|---------------|----------|
| AWS | Hosting, storage | All customer data | US, EU (customer choice) |
| Typesense Cloud | Search infrastructure | Indexed documents | US |
| Stripe | Payment processing | Payment info | US |
| SendGrid | Email delivery | Email addresses | US |
| Sentry | Error tracking | Error logs, user IDs | US |
| OpenAI | AI features (optional) | Search queries, documents | US |

**User Consent**: Implicit при acceptance Terms of Service.

**Objection Right**: User может object, мы ищем alternative.

**Notification**: 30 days notice перед добавлением new sub-processor.

### International Data Transfers

**Issue**: GDPR restricts data transfer outside EEU.

**Mechanisms**:
1. **Adequacy Decision**: Transfer to countries с adequate protection (e.g., UK post-Brexit adequacy decision)
2. **Standard Contractual Clauses (SCCs)**: EU-approved contract terms
3. **Binding Corporate Rules (BCRs)**: For intra-company transfers

**AACSearch Approach**:
- **Primary**: EU data stored в EU region (AWS eu-west-1)
- **US transfers**: SCCs with sub-processors
- **User choice**: Customers может выбрать region
- **Enterprise**: Custom data residency agreements

### GDPR Penalties

**Tiers**:
- **Tier 1**: Up to €10M or 2% annual turnover
  - Inadequate records, DPO, DPIA
  - Breach notification failures
- **Tier 2**: Up to €20M or 4% annual turnover
  - Violation core principles
  - Data subject rights violations
  - Unauthorized transfers

**AACSearch Mitigation**:
- Compliance program
- Regular audits
- Insurance coverage
- Incident response plan

### GDPR Checklist

✅ Privacy Policy published
✅ Cookie consent banner
✅ Data export functionality
✅ Account deletion functionality
✅ Email verification
✅ DPA available для Enterprise
✅ Sub-processors disclosed
✅ Data retention policies
✅ Encryption (rest & transit)
✅ Access controls (RBAC)
✅ Audit logging
✅ Incident response plan
⏳ DPO appointed (Enterprise only)
⏳ DPIA conducted annually
⏳ SCCs signed with sub-processors

---

## SOC 2 Type II

### Описание

SOC 2 (Service Organization Control 2) — аудит безопасности для service providers, разработанный AICPA (American Institute of CPAs).

**Type I**: Controls designed appropriately (point-in-time)
**Type II**: Controls operating effectively over time (6-12 months)

**Применимость**: SaaS companies handling customer data.

### Trust Service Criteria

SOC 2 основан на 5 Trust Service Criteria:

#### 1. Security

**Principle**: Система защищена от unauthorized access.

**Controls**:
- Logical access controls (MFA, RBAC)
- Network security (firewalls, segmentation)
- Encryption (AES-256, TLS 1.3)
- Vulnerability management (scanning, patching)
- Change management (approval process)
- Incident response

**Evidence**:
- Access logs
- Firewall rules
- Encryption configs
- Vulnerability scan reports
- Change tickets
- Incident reports

#### 2. Availability

**Principle**: Система доступна согласно SLA.

**Controls**:
- Uptime monitoring (99.9% SLA)
- Capacity planning
- Disaster recovery
- Backup procedures
- Incident management
- Performance monitoring

**Evidence**:
- Uptime reports
- Capacity reviews
- DR test results
- Backup logs
- Incident tickets
- Performance metrics

#### 3. Processing Integrity

**Principle**: System processing complete, valid, accurate, timely, authorized.

**Controls**:
- Input validation
- Data integrity checks
- Error handling
- Transaction logging
- Reconciliation procedures

**Evidence**:
- Validation rules
- Checksums
- Error logs
- Transaction audit trails
- Reconciliation reports

#### 4. Confidentiality

**Principle**: Confidential информация защищена.

**Controls**:
- Data classification
- Encryption (at rest, in transit)
- Access controls
- NDAs with employees
- Secure disposal

**Evidence**:
- Data classification policy
- Encryption evidence
- Access control matrices
- Signed NDAs
- Disposal certificates

#### 5. Privacy

**Principle**: Personal information collected, used, retained, disclosed согласно privacy policy.

**Controls**:
- Privacy policy disclosed
- Consent management
- Data subject rights (access, deletion)
- Data retention policies
- Privacy training

**Evidence**:
- Privacy policy
- Consent records
- Data access logs
- Deletion confirmations
- Training records

### SOC 2 Audit Process

#### Phase 1: Readiness Assessment (3-6 months)

**Activities**:
1. Gap analysis против SOC 2 requirements
2. Remediation plan
3. Policy и procedure documentation
4. Control implementation
5. Internal testing

**Deliverables**:
- Policies: Security, Privacy, IR, BC/DR, Change Management
- Procedures: Onboarding, Offboarding, Patching, Backup
- Evidence collection system

#### Phase 2: Type I Audit (1-2 months)

**Activities**:
1. Auditor selection (Big 4 или reputable firm)
2. Scope definition
3. Control design review
4. Testing (point-in-time)
5. Report issuance

**Deliverables**:
- SOC 2 Type I report
- Management assertions
- Auditor opinion

#### Phase 3: Type II Audit (6-12 months observation)

**Activities**:
1. Continuous control operation
2. Evidence collection (daily/weekly/monthly)
3. Auditor testing (sampling)
4. Report issuance

**Deliverables**:
- SOC 2 Type II report (definitive)
- Control testing results
- Exceptions и remediation

**Cost**: $30K-$100K (depends на scope, company size, auditor)

**Frequency**: Annual renewal

### AACSearch SOC 2 Roadmap

#### 2024 Q4: Readiness
- ✅ Security policies documented
- ✅ Access control implemented (RBAC, MFA)
- ✅ Encryption enabled (AES-256, TLS 1.3)
- ✅ Monitoring setup (CloudWatch, Sentry)
- ⏳ Change management process
- ⏳ Incident response plan
- ⏳ Business continuity plan

#### 2025 Q1: Type I
- Auditor selection
- Control design review
- Type I report

#### 2025 Q3: Type II
- 6 months observation period
- Evidence collection
- Type II audit
- Report issuance

**Target**: SOC 2 Type II by 2025 Q3

---

## ISO 27001

### Описание

ISO/IEC 27001 — международный стандарт для Information Security Management System (ISMS).

**Benefits**:
- Systematic approach к information security
- Recognized globally
- Competitive advantage
- Customer trust

**Cost**: $50K-$150K (certification)

### ISMS Structure

#### 1. Context of Organization (Clause 4)

**Requirements**:
- Understand organization и context
- Understand needs и expectations of interested parties
- Determine scope of ISMS
- Establish ISMS

**AACSearch**:
- **Scope**: All IT infrastructure, data processing, customer data
- **Boundaries**: Production environment, employee access
- **Exclusions**: Marketing website (static)

#### 2. Leadership (Clause 5)

**Requirements**:
- Top management commitment
- Information security policy
- Roles, responsibilities, authorities

**AACSearch**:
- CTO: Overall responsibility для ISMS
- Security Officer: Day-to-day management
- DPO: Data protection (GDPR)

#### 3. Planning (Clause 6)

**Requirements**:
- Risk assessment и treatment
- Information security objectives
- Planning to achieve objectives

**AACSearch**:
- Quarterly risk assessments
- Risk treatment plan
- Security roadmap

#### 4. Support (Clause 7)

**Requirements**:
- Resources (people, infrastructure, budget)
- Competence (training)
- Awareness
- Communication
- Documented information

**AACSearch**:
- Security budget allocated
- Annual security training для all employees
- Security awareness program
- Documentation в Confluence

#### 5. Operation (Clause 8)

**Requirements**:
- Operational planning и control
- Risk assessment
- Risk treatment

**AACSearch**:
- Security controls implemented (Annex A)
- Continuous monitoring
- Incident management

#### 6. Performance Evaluation (Clause 9)

**Requirements**:
- Monitoring, measurement, analysis
- Internal audit
- Management review

**AACSearch**:
- Monthly security metrics
- Quarterly internal audits
- Annual management review

#### 7. Improvement (Clause 10)

**Requirements**:
- Nonconformity и corrective action
- Continual improvement

**AACSearch**:
- Incident root cause analysis
- Corrective action tracking
- Annual ISMS improvement plan

### Annex A Controls (114 Controls)

Annex A содержит 114 security controls в 4 categories:

#### A.5: Organizational Controls (37 controls)

Examples:
- A.5.1: Information security policies
- A.5.7: Threat intelligence
- A.5.10: Acceptable use of information
- A.5.15: Access control
- A.5.23: Information security для cloud services
- A.5.34: Privacy и protection of PII

#### A.6: People Controls (8 controls)

Examples:
- A.6.1: Screening
- A.6.2: Terms of employment
- A.6.3: Information security awareness, education, training
- A.6.4: Disciplinary process
- A.6.8: Information security event reporting

#### A.7: Physical Controls (14 controls)

Examples:
- A.7.1: Physical security perimeters
- A.7.2: Physical entry
- A.7.4: Physical security monitoring
- A.7.7: Clear desk и clear screen
- A.7.14: Secure disposal или re-use

#### A.8: Technological Controls (34 controls)

Examples:
- A.8.1: User endpoint devices
- A.8.2: Privileged access rights
- A.8.3: Information access restriction
- A.8.5: Secure authentication
- A.8.9: Configuration management
- A.8.16: Monitoring activities
- A.8.23: Web filtering
- A.8.24: Use of cryptography

**AACSearch Applicability**:
- ~90 controls applicable
- ~24 controls not applicable (physical security, on-premise)

### ISO 27001 Certification Process

#### Stage 1: Readiness (6-12 months)

1. Gap analysis
2. ISMS implementation
3. Policies и procedures
4. Risk assessment
5. Control implementation
6. Internal audits
7. Management review

#### Stage 2: Certification Audit (Stage 1 + Stage 2)

**Stage 1 Audit** (3-5 days):
- Documentation review
- ISMS structure review
- Readiness assessment

**Stage 2 Audit** (5-10 days):
- On-site (или remote) audit
- Control testing
- Evidence review
- Interviews
- Non-conformities identified

#### Stage 3: Certification Decision

- Certification body decision
- Certificate issuance (valid 3 years)
- Surveillance audits (annual)
- Recertification (every 3 years)

### AACSearch ISO 27001 Roadmap

**Target**: ISO 27001 certified by 2026 Q2

**2025 Q1-Q2**: Readiness
- Gap analysis
- ISMS documentation
- Control implementation

**2025 Q3**: Internal audits

**2025 Q4**: Pre-assessment

**2026 Q1**: Stage 1 audit

**2026 Q2**: Stage 2 audit, certification

---

## CCPA (California Consumer Privacy Act)

### Описание

CCPA — California privacy law, effective January 1, 2020.

**Applicability**: Companies doing business в California IF:
- Annual gross revenue >$25M, OR
- Buy/sell PI of 50K+ California residents, OR
- Derive 50%+ revenue from selling PI

**AACSearch**: Likely applicable если significant California customer base.

### CCPA Rights

Similar to GDPR but California-specific:

#### 1. Right to Know
- What PI collected
- Sources of PI
- Purpose of collection
- Third parties PI shared with
- Specific pieces of PI

**AACSearch**: Same as GDPR (data export)

#### 2. Right to Delete
- Request deletion of PI
- Exceptions: legal obligations, fraud prevention

**AACSearch**: Same as GDPR (account deletion)

#### 3. Right to Opt-Out of Sale
- California residents может opt-out of PI sale
- "Do Not Sell My Personal Information" link required

**AACSearch**: We DON'T sell PI, so opt-out not applicable. Disclosure на privacy policy.

#### 4. Right to Non-Discrimination
- Same service и price даже если exercise rights

**AACSearch**: No price difference, full service maintained.

### CCPA Compliance

**Measures**:
✅ Privacy policy updated with CCPA disclosures
✅ "Do Not Sell" notice (даже though we don't sell)
✅ Data export functionality
✅ Account deletion functionality
✅ Toll-free number or email for requests (support@aacsearch.com)
✅ Response time: 45 days (extension: +45 days if needed)
✅ Verification process для requests (identity confirmation)

### CPRA (California Privacy Rights Act)

**Effective**: January 1, 2023

**Updates to CCPA**:
- Creates California Privacy Protection Agency (CPPA)
- Right to correction (in addition to deletion)
- Limits на use of sensitive PI
- Opt-out of automated decision-making

**AACSearch**: Compliance maintained, minor updates to policy.

---

## PCI DSS

### Описание

PCI DSS (Payment Card Industry Data Security Standard) — стандарт для handling credit card data.

**Levels**:
- **Level 1**: >6M transactions/year
- **Level 2**: 1M-6M transactions/year
- **Level 3**: 20K-1M transactions/year (e-commerce)
- **Level 4**: <20K transactions/year

### AACSearch Approach

**Payment Processing**: Stripe (PCI-compliant payment processor)

**No Card Data Storage**: We never see или store card numbers, CVV, etc.

**PCI Scope**: Minimal
- Stripe Checkout: Redirect to Stripe-hosted page
- Stripe Elements: Tokenization в browser
- Webhooks: No card data в payloads

**Compliance**:
- Stripe is PCI Level 1 compliant
- We rely on Stripe's compliance
- SAQ (Self-Assessment Questionnaire): SAQ A (simplest)
- No annual audit required (we don't store/process cards)

**Best Practices**:
- HTTPS only
- Secure backend (no direct card data exposure)
- Webhook signature verification
- PCI DSS awareness training

---

## HIPAA

### Описание

HIPAA (Health Insurance Portability and Accountability Act) — US law protecting health information.

**Applicability**: Healthcare providers, payers, clearinghouses, их business associates.

**AACSearch**: NOT HIPAA compliant by default, но может be для Enterprise customers.

### HIPAA Requirements

#### Protected Health Information (PHI)

**Definition**: Any information about health status, healthcare, payment that can identify individual.

**Examples**:
- Names, dates, phone numbers
- Medical record numbers
- Diagnoses, treatments
- Lab results, images

#### Business Associate Agreement (BAA)

**Required**: If AACSearch processes PHI on behalf of covered entity.

**Contents**:
- Permitted uses of PHI
- Safeguards
- Reporting obligations
- Termination provisions

**AACSearch**: BAA available для Enterprise customers only.

#### Security Rule

**Requirements**:
- Administrative safeguards (policies, training)
- Physical safeguards (facility access, device controls)
- Technical safeguards (encryption, access controls, audit)

**AACSearch Compliance**:
✅ Encryption (AES-256, TLS 1.3)
✅ Access controls (RBAC)
✅ Audit logging
✅ Incident response
✅ Business continuity
⏳ HIPAA-specific policies
⏳ Workforce training
⏳ BAA process

#### Privacy Rule

**Requirements**:
- Notice of Privacy Practices
- Patient rights (access, amendments, accounting)
- Minimum necessary use

**AACSearch**: Customer (covered entity) responsible for Privacy Rule compliance towards their patients.

### HIPAA Compliance Roadmap

**Target**: HIPAA-eligible для Enterprise customers by 2025 Q4.

**Requirements**:
1. ⏳ HIPAA policies documented
2. ⏳ Workforce training program
3. ⏳ BAA template
4. ⏳ Risk analysis
5. ⏳ Dedicated HIPAA-compliant infrastructure
6. ⏳ Third-party assessment

**Pricing**: HIPAA-compliant hosting = +50% infrastructure cost → reflected в Enterprise pricing.

---

## Privacy Shield / Data Transfer

### Background

**Privacy Shield**: US-EU и US-Swiss frameworks для data transfers. **Invalidated** by EU court (Schrems II) в July 2020.

**Schrems II Impact**: US companies cannot rely on Privacy Shield для EU data transfers.

### Current Mechanisms

#### 1. Standard Contractual Clauses (SCCs)

**Description**: EU Commission-approved contract terms.

**AACSearch**:
- SCCs signed with sub-processors
- Available для Enterprise customers
- Covers EU-US transfers

**Review**: Post-Schrems II SCCs (June 2021 version)

#### 2. Binding Corporate Rules (BCRs)

**Description**: Internal rules для multinational corporations.

**AACSearch**: Not applicable (not multinational corporation).

#### 3. Adequacy Decisions

**Countries with Adequacy**:
- UK (post-Brexit)
- Switzerland
- Israel
- Japan
- Others (see EU Commission list)

**AACSearch**: Can transfer freely to these countries.

### Data Residency

**AACSearch Approach**:

**Default**: Data stored в US (AWS us-east-1)

**EU Option** (Pro+):
- EU data stored в AWS eu-west-1 (Ireland)
- No transatlantic transfers (except for support, with consent)

**Enterprise**:
- Custom data residency (UK, Canada, Australia)
- Dedicated database per region
- Typesense cluster per region

**Costs**: EU/custom regions +20% infrastructure cost.

---

## Compliance Roadmap

### 2024 Q4: Foundation

✅ GDPR fully compliant
✅ CCPA compliant
✅ Privacy policy и DPA published
✅ Data export/deletion implemented
✅ Encryption (AES-256, TLS 1.3)
✅ Access controls (RBAC, MFA)
✅ Audit logging

### 2025 Q1-Q2: SOC 2 Readiness

- Policies documentation
- Control implementation
- Evidence collection system
- Internal audits

### 2025 Q3: SOC 2 Type I

- Auditor selection
- Type I audit
- Report

### 2025 Q4: SOC 2 Type II Start

- 6-12 months observation
- Continuous evidence collection

### 2026 Q1-Q2: ISO 27001

- ISMS implementation
- Gap remediation
- Certification audit

### 2026 Q3: SOC 2 Type II Report

- Type II audit completion
- Report issuance
- Annual renewal process

### 2026 Q4: HIPAA Eligible

- BAA process
- HIPAA-compliant infrastructure
- Workforce training

---

## Summary

### Compliance Status

| Framework | Status | Target Date | Priority |
|-----------|--------|------------|----------|
| GDPR | ✅ Compliant | N/A | Must |
| CCPA | ✅ Compliant | N/A | Must |
| SOC 2 Type I | ⏳ In Progress | 2025 Q3 | High |
| SOC 2 Type II | ⏳ Planned | 2026 Q3 | High |
| ISO 27001 | ⏳ Planned | 2026 Q2 | Medium |
| HIPAA | ⏳ Planned | 2026 Q4 | Low (Enterprise only) |
| PCI DSS | ✅ Compliant (via Stripe) | N/A | Must |

### Estimated Costs

| Item | Cost | Frequency |
|------|------|-----------|
| SOC 2 Type I Audit | $40K-$60K | One-time |
| SOC 2 Type II Audit | $50K-$80K | Annual |
| ISO 27001 Certification | $50K-$100K | One-time |
| ISO 27001 Surveillance | $20K-$40K | Annual |
| HIPAA Assessment | $20K-$40K | One-time |
| Compliance Software | $10K-$20K | Annual |
| **Total Year 1** | **$170K-$300K** | - |
| **Total Annual (ongoing)** | **$80K-$140K** | - |

**ROI**: Enterprise customers требуют compliance → enables sales → $500K-$1M+ ARR.

**Total Pages**: ~25 pages

