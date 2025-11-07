# Безопасность

> Полное руководство по обеспечению безопасности AACSearch Platform — изоляция данных, шифрование, GDPR compliance и аудит.

## Содержание

- [Data Isolation](#data-isolation)
- [Row Level Security (RLS)](#row-level-security)
- [Шифрование](#шифрование)
- [GDPR Compliance](#gdpr-compliance)
- [Right to be Forgotten](#right-to-be-forgotten)
- [Data Portability](#data-portability)
- [PII Scanner](#pii-scanner)
- [Аудит логи](#аудит-логи)
- [Security Events](#security-events)
- [Compliance Checker](#compliance-checker)

---

## Data Isolation

### Multi-Tenant Isolation

**Строгая изоляция** данных между tenant'ами на всех уровнях:

```
┌──────────────────────────────────────┐
│    Application Level (Payload)       │
│  Автоматическая фильтрация по tenant │
└────────────────┬─────────────────────┘
                 │
┌────────────────▼─────────────────────┐
│    Database Level (PostgreSQL RLS)   │
│  Row Level Security policies         │
└────────────────┬─────────────────────┘
                 │
┌────────────────▼─────────────────────┐
│    Search Level (Typesense)          │
│  Scoped Keys с tenant фильтрами      │
└──────────────────────────────────────┘
```

### Реализация

```typescript
// 1. Application Level - Payload Access Control
const tenantAccess: Access = ({ req: { user } }) => {
  if (!user) return false
  
  if (user.platformRole === 'platform:admin') {
    return true // Platform admin видит все
  }
  
  // Фильтр только по tenant'ам пользователя
  return {
    tenant: {
      in: user.tenantIds, // Массив tenant IDs
    },
  }
}

// 2. Database Level - RLS Policy
CREATE POLICY tenant_isolation ON documents
  FOR ALL
  TO authenticated_user
  USING (tenant_id = current_setting('app.current_tenant')::uuid);

// 3. Search Level - Scoped Keys
const scopedKey = generateScopedKey({
  filter_by: `tenant_id:=${tenantId}`, // Автоматический фильтр
  collection: 'products',
})
```

---

## Row Level Security

### Что такое RLS?

**Row Level Security** — механизм PostgreSQL для фильтрации строк на уровне базы данных.

### Включение RLS

```sql
-- 1. Включить RLS для таблицы
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- 2. Создать policy для SELECT
CREATE POLICY tenant_select ON documents
  FOR SELECT
  TO authenticated_user
  USING (tenant_id = current_setting('app.current_tenant')::uuid);

-- 3. Создать policy для INSERT
CREATE POLICY tenant_insert ON documents
  FOR INSERT
  TO authenticated_user
  WITH CHECK (tenant_id = current_setting('app.current_tenant')::uuid);

-- 4. Создать policy для UPDATE
CREATE POLICY tenant_update ON documents
  FOR UPDATE
  TO authenticated_user
  USING (tenant_id = current_setting('app.current_tenant')::uuid)
  WITH CHECK (tenant_id = current_setting('app.current_tenant')::uuid);

-- 5. Создать policy для DELETE
CREATE POLICY tenant_delete ON documents
  FOR DELETE
  TO authenticated_user
  USING (tenant_id = current_setting('app.current_tenant')::uuid);
```

### Установка текущего tenant

```typescript
// Middleware устанавливает tenant context
async function setTenantContext(req: Request) {
  const user = await getUser(req)
  const tenantId = req.headers.get('x-tenant-id')

  // Проверка прав доступа
  if (!user.tenantIds.includes(tenantId)) {
    throw new Error('Unauthorized tenant access')
  }

  // Установка PostgreSQL session variable
  await db.query(
    `SET app.current_tenant = $1`,
    [tenantId]
  )
}
```

### Тестирование RLS

```typescript
describe('Row Level Security', () => {
  it('should isolate tenant data', async () => {
    // Tenant A создает документ
    await setTenantContext('tenant_a')
    await db.query('INSERT INTO documents (title, tenant_id) VALUES ($1, $2)', 
      ['Doc A', 'tenant_a'])

    // Tenant B не видит документ Tenant A
    await setTenantContext('tenant_b')
    const result = await db.query('SELECT * FROM documents WHERE title = $1', ['Doc A'])
    
    expect(result.rows).toHaveLength(0) // ✅ Изолировано
  })
})
```

---

## Шифрование

### At Rest Encryption

**Шифрование данных в хранилище**

#### PostgreSQL

```sql
-- Включить шифрование на уровне таблицы
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  title TEXT,
  content TEXT,
  encrypted_data BYTEA
);

-- Шифровать sensitive поля
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO documents (encrypted_data)
VALUES (pgp_sym_encrypt('sensitive data', 'encryption_key'));

-- Расшифровка
SELECT pgp_sym_decrypt(encrypted_data, 'encryption_key') FROM documents;
```

#### File Storage

```typescript
import { createCipher, createDecipher } from 'crypto'

async function encryptFile(file: Buffer, key: string): Promise<Buffer> {
  const cipher = createCipher('aes-256-cbc', key)
  return Buffer.concat([cipher.update(file), cipher.final()])
}

async function decryptFile(encrypted: Buffer, key: string): Promise<Buffer> {
  const decipher = createDecipher('aes-256-cbc', key)
  return Buffer.concat([decipher.update(encrypted), decipher.final()])
}
```

### In Transit Encryption

**TLS/SSL для всех соединений**

```nginx
# nginx.conf
server {
  listen 443 ssl http2;
  
  ssl_certificate /etc/ssl/cert.pem;
  ssl_certificate_key /etc/ssl/key.pem;
  
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  
  # HSTS
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

### Environment Variables Encryption

```bash
# Использовать Vault или AWS Secrets Manager
vault kv put secret/aacsearch \
  DATABASE_URL="postgres://..." \
  STRIPE_SECRET_KEY="sk_live_..."

# Получение в runtime
export DATABASE_URL=$(vault kv get -field=DATABASE_URL secret/aacsearch)
```

---

## GDPR Compliance

### Принципы GDPR

1. **Lawfulness** — законная обработка данных
2. **Purpose Limitation** — четкая цель сбора
3. **Data Minimization** — минимум необходимых данных
4. **Accuracy** — точность данных
5. **Storage Limitation** — ограниченное хранение
6. **Integrity and Confidentiality** — безопасность
7. **Accountability** — ответственность

### Реализация

```typescript
// Маркировка PII полей
interface User {
  id: string
  email: string // PII
  name: string  // PII
  phone?: string // PII
  preferences: object // Not PII
}

// Конфигурация сбора данных
const dataCollection = {
  personalData: {
    collected: ['email', 'name', 'phone'],
    purpose: 'Account management and communication',
    legalBasis: 'contract',
    retention: '2 years after account closure',
  },
}

// Consent management
async function collectConsent(userId: string, consentType: string) {
  await payload.create({
    collection: 'consents',
    data: {
      user: userId,
      type: consentType,
      granted: true,
      grantedAt: new Date(),
      ipAddress: req.ip,
    },
  })
}
```

### Privacy Policy

```markdown
# Privacy Policy

## Data We Collect
- Email address (для account management)
- Name (для personalization)
- Usage data (для analytics)

## Legal Basis
- Contract performance
- Legitimate interest

## Data Retention
- Account data: Stored while account is active + 2 years
- Logs: 90 days

## Your Rights
- Right to access
- Right to rectification
- Right to erasure
- Right to data portability
```

---

## Right to be Forgotten

### GDPR Article 17

Пользователь может запросить удаление своих данных.

### Процедура

```typescript
// 1. Получить запрос на удаление
async function requestDeletion(userId: string) {
  await payload.create({
    collection: 'deletion_requests',
    data: {
      user: userId,
      requestedAt: new Date(),
      status: 'pending',
    },
  })
  
  // Email подтверждение
  await sendDeletionConfirmationEmail(userId)
}

// 2. Подтвердить и выполнить
async function confirmDeletion(requestId: string, confirmToken: string) {
  const request = await verifyDeletionToken(requestId, confirmToken)
  
  // Удалить данные
  await deleteUserData(request.user)
  
  // Обновить статус
  await payload.update({
    collection: 'deletion_requests',
    id: requestId,
    data: {
      status: 'completed',
      completedAt: new Date(),
    },
  })
}

// 3. Фактическое удаление
async function deleteUserData(userId: string) {
  // Удалить из Payload
  await payload.delete({
    collection: 'users',
    id: userId,
  })
  
  // Удалить из Typesense
  await typesense.collections('users').documents(userId).delete()
  
  // Анонимизировать в audit logs (не удалять!)
  await anonymizeAuditLogs(userId)
  
  // Удалить из Stripe (опционально)
  await stripe.customers.del(stripeCustomerId)
}
```

---

## Data Portability

### GDPR Article 20

Пользователь может запросить экспорт своих данных.

### Экспорт данных

```typescript
async function exportUserData(userId: string): Promise<Buffer> {
  // Собрать все данные пользователя
  const user = await payload.findByID({
    collection: 'users',
    id: userId,
  })

  const documents = await payload.find({
    collection: 'documents',
    where: { createdBy: { equals: userId } },
  })

  const memberships = await payload.find({
    collection: 'memberships',
    where: { user: { equals: userId } },
  })

  // Формат JSON для экспорта
  const exportData = {
    exportDate: new Date().toISOString(),
    user: {
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    documents: documents.docs,
    memberships: memberships.docs,
  }

  // Создать ZIP archive
  const zip = new AdmZip()
  zip.addFile('user_data.json', Buffer.from(JSON.stringify(exportData, null, 2)))
  
  return zip.toBuffer()
}

// Endpoint
app.post('/api/gdpr/export', async (req, res) => {
  const userId = req.user.id
  
  const zipBuffer = await exportUserData(userId)
  
  res.setHeader('Content-Type', 'application/zip')
  res.setHeader('Content-Disposition', 'attachment; filename=my_data.zip')
  res.send(zipBuffer)
})
```

---

## PII Scanner

### Автоматическое обнаружение PII

```typescript
const PII_PATTERNS = {
  email: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/,
  creditCard: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/,
}

async function scanForPII(text: string): Promise<{ type: string; matches: string[] }[]> {
  const findings = []

  for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
    const matches = text.match(new RegExp(pattern, 'g'))
    if (matches) {
      findings.push({ type, matches })
    }
  }

  return findings
}

// Использование
const document = await payload.findByID({ collection: 'documents', id: docId })
const piiFindings = await scanForPII(document.content)

if (piiFindings.length > 0) {
  console.warn('PII detected in document:', piiFindings)
  
  // Отправить alert
  await sendPIIAlert({
    document: docId,
    findings: piiFindings,
  })
}
```

---

## Аудит логи

### Структура Audit Log

```typescript
interface AuditLog {
  id: string
  timestamp: Date
  user: string | User
  tenant: string | Tenant
  action: string // 'create', 'read', 'update', 'delete'
  resource: string // 'document', 'user', 'tenant'
  resourceId: string
  changes?: {
    before: object
    after: object
  }
  ipAddress: string
  userAgent: string
  success: boolean
  errorMessage?: string
}
```

### Логирование действий

```typescript
async function auditLog(params: {
  user: User
  action: string
  resource: string
  resourceId: string
  changes?: object
  req: Request
}) {
  await payload.create({
    collection: 'audit_logs',
    data: {
      timestamp: new Date(),
      user: params.user.id,
      tenant: params.user.currentTenant,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      changes: params.changes,
      ipAddress: params.req.ip,
      userAgent: params.req.headers['user-agent'],
      success: true,
    },
  })
}

// Middleware
app.use(auditMiddleware)

async function auditMiddleware(req, res, next) {
  // Сохранить оригинальные методы
  const originalSend = res.send

  res.send = function(data) {
    // Логировать после ответа
    setImmediate(() => {
      auditLog({
        user: req.user,
        action: req.method,
        resource: extractResource(req.path),
        resourceId: extractResourceId(req.path),
        req,
      })
    })

    return originalSend.call(this, data)
  }

  next()
}
```

### Просмотр логов

```http
GET /api/audit-logs?user=userId&resource=document&from=2025-11-01&to=2025-11-30
```

**Response:**
```json
{
  "logs": [
    {
      "timestamp": "2025-11-02T10:30:00Z",
      "user": "john@example.com",
      "action": "update",
      "resource": "document",
      "resourceId": "doc_123",
      "changes": {
        "before": { "title": "Old Title" },
        "after": { "title": "New Title" }
      },
      "ipAddress": "203.0.113.42",
      "success": true
    }
  ]
}
```

---

## Security Events

### Типы событий

```typescript
type SecurityEventType =
  | 'failed_login'
  | 'password_reset'
  | 'api_key_created'
  | 'api_key_revoked'
  | 'permission_denied'
  | 'suspicious_activity'
  | 'data_export'
  | 'data_deletion'

interface SecurityEvent {
  id: string
  type: SecurityEventType
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  user?: string
  tenant?: string
  ipAddress: string
  timestamp: Date
  metadata: object
}
```

### Логирование security events

```typescript
async function logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>) {
  await payload.create({
    collection: 'security_events',
    data: {
      ...event,
      timestamp: new Date(),
    },
  })

  // Алерт при critical severity
  if (event.severity === 'critical') {
    await sendSecurityAlert(event)
  }
}

// Примеры
await logSecurityEvent({
  type: 'failed_login',
  severity: 'medium',
  description: '5 failed login attempts',
  user: 'john@example.com',
  ipAddress: req.ip,
  metadata: { attempts: 5 },
})

await logSecurityEvent({
  type: 'suspicious_activity',
  severity: 'high',
  description: 'Unusual API usage pattern detected',
  tenant: 'acme-corp',
  ipAddress: req.ip,
  metadata: { requestsPerMinute: 1500 },
})
```

---

## Compliance Checker

### Автоматическая проверка compliance

```typescript
interface ComplianceCheck {
  name: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  recommendations?: string[]
}

async function runComplianceChecks(): Promise<ComplianceCheck[]> {
  const checks: ComplianceCheck[] = []

  // 1. GDPR - Privacy Policy
  checks.push({
    name: 'Privacy Policy',
    status: await hasPrivacyPolicy() ? 'pass' : 'fail',
    message: 'Privacy policy must be published',
  })

  // 2. GDPR - Data Retention
  checks.push({
    name: 'Data Retention',
    status: await hasDataRetentionPolicy() ? 'pass' : 'fail',
    message: 'Data retention policies must be defined',
  })

  // 3. Security - SSL/TLS
  checks.push({
    name: 'SSL/TLS',
    status: await isUsingHTTPS() ? 'pass' : 'fail',
    message: 'All endpoints must use HTTPS',
  })

  // 4. Security - RLS
  checks.push({
    name: 'Row Level Security',
    status: await isRLSEnabled() ? 'pass' : 'fail',
    message: 'RLS must be enabled for all tables',
  })

  // 5. Access Control
  checks.push({
    name: 'Access Control',
    status: await hasProperAccessControl() ? 'pass' : 'warning',
    message: 'Review access control policies',
    recommendations: ['Enable 2FA for admins', 'Regular audit of user permissions'],
  })

  return checks
}

// Dashboard
app.get('/api/compliance/report', async (req, res) => {
  const checks = await runComplianceChecks()
  
  res.json({
    timestamp: new Date(),
    overall: checks.every(c => c.status === 'pass') ? 'compliant' : 'non-compliant',
    checks,
  })
})
```

---

## Best Practices

### Security Checklist

✅ **Обязательно:**

- [ ] RLS включен для всех таблиц
- [ ] Шифрование at rest (PostgreSQL, S3)
- [ ] TLS/SSL для всех соединений
- [ ] Audit logs для всех действий
- [ ] GDPR consent management
- [ ] Regular security audits
- [ ] Penetration testing (ежегодно)
- [ ] Incident response plan
- [ ] Data breach notification процедура
- [ ] Regular backups (daily)
- [ ] 2FA для admin/owner
- [ ] API key rotation (90 days)
- [ ] Rate limiting enabled
- [ ] PII scanner активен
- [ ] Privacy policy опубликована

---

**Версия:** 1.0.0  
**Дата обновления:** 2025-11-02  
**Следующий раздел:** [06-monitoring.md](./06-monitoring.md)
