# API Ключи

> Полное руководство по созданию, управлению и безопасности API ключей в AACSearch Platform.

## Содержание

- [Типы ключей](#типы-ключей)
- [Создание API ключей](#создание-api-ключей)
- [Scoped Keys](#scoped-keys)
- [TTL и Expiration](#ttl-и-expiration)
- [Permissions и Scopes](#permissions-и-scopes)
- [Rate Limiting](#rate-limiting)
- [Usage Tracking](#usage-tracking)
- [Ротация ключей](#ротация-ключей)
- [Revocation](#revocation)
- [Best Practices](#best-practices)

---

## Типы ключей

### 1. Admin Key (Typesense)

**Назначение:** Полный доступ к Typesense API

**Возможности:**
- Создание/удаление коллекций
- Управление схемами
- Индексация документов
- Поиск без ограничений
- Управление другими ключами

**Безопасность:** ⚠️ ТОЛЬКО server-side, НИКОГДА в frontend!

**Пример:**
```typescript
const adminClient = new Typesense.Client({
  nodes: [{
    host: 'search.yourdomain.com',
    port: 443,
    protocol: 'https',
  }],
  apiKey: process.env.TYPESENSE_ADMIN_KEY, // Только на сервере!
})
```

### 2. Search Key (Read-only)

**Назначение:** Только поиск, без изменения данных

**Возможности:**
- Поиск в коллекциях
- Чтение документов
- Автосаджест

**Ограничения:**
- ❌ Нельзя создавать/изменять документы
- ❌ Нельзя изменять схемы
- ❌ Нельзя управлять ключами

**Использование:** Можно использовать в frontend (с ограничениями)

### 3. Scoped Key (Ограниченный)

**Назначение:** Tenant-specific ключ с фильтрами

**Возможности:**
- Поиск только в данных tenant
- Автоматическая фильтрация
- Временное ограничение (TTL)
- Скрытие полей

**Безопасность:** ✅ Безопасно для client-side использования

**Пример:**
```typescript
// Scoped key автоматически фильтрует по tenant
const scopedKey = await generateScopedKey({
  collection: 'products',
  filter_by: 'tenant_id:=acme-corp && status:=published',
  exclude_fields: 'internal_notes,cost_price',
  expires_in: 3600, // 1 час
})
```

### 4. Custom API Key (Platform)

**Назначение:** Доступ к Platform API

**Структура:**
```typescript
interface APIKey {
  id: string
  tenant: string
  label: string
  keyHash: string // SHA-256 hash
  scopedSearchKey?: string
  scopes: string[] // ['read', 'write', 'delete']
  expiresAt?: Date
  lastUsedAt?: Date
  isActive: boolean
}
```

---

## Создание API ключей

### Метод 1: Через Admin UI

1. **Admin → API Keys → Create New**
2. Выбрать tenant
3. Ввести label (название ключа)
4. Выбрать scopes
5. Установить TTL (опционально)
6. **Generate**

⚠️ **Важно:** Ключ показывается ОДИН РАЗ! Сохраните его сразу.

### Метод 2: Через API

```http
POST /api/keys/create
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "tenantId": "tenant_abc123",
  "label": "Production API Key",
  "scopes": ["read", "write"],
  "expiresIn": 7776000
}
```

**Response:**
```json
{
  "apiKey": {
    "id": "key_xyz789",
    "key": "sk_live_a1b2c3d4e5f6...",
    "label": "Production API Key",
    "scopes": ["read", "write"],
    "expiresAt": "2026-02-01T00:00:00Z",
    "createdAt": "2025-11-02T10:00:00Z"
  },
  "warning": "Save this key now. It won't be shown again."
}
```

### Метод 3: CLI

```bash
npm run cli apikey:create \
  --tenant acme-corp \
  --label "Production API Key" \
  --scopes read,write \
  --expires-in 90d
```

---

## Scoped Keys

### Генерация Scoped Key

**Endpoint:**
```http
POST /api/keys/scoped
Authorization: Bearer <token>
```

**Request:**
```json
{
  "collection": "products",
  "filter_by": "status:=published",
  "exclude_fields": "internal_notes,cost_price",
  "limit_hits": 100,
  "expires_in": 3600,
  "cache_ttl": 300
}
```

**Response:**
```json
{
  "scoped_key": "dGVzdC1kaWdlc3Q...encoded_params",
  "expires_at": 1735689600,
  "metadata": {
    "collection": "products",
    "filter_by": "tenant_id:=123 && status:=published",
    "tenant_id": "123",
    "exclude_fields": "internal_notes,cost_price",
    "limit_hits": 100
  }
}
```

### Автоматическая Tenant Изоляция

Система **автоматически** добавляет фильтр tenant:

```typescript
// Вы запрашиваете:
{
  "filter_by": "status:=published"
}

// Система автоматически добавляет:
{
  "filter_by": "tenant_id:=your_tenant_id && status:=published"
}
```

**Клиент НЕ МОЖЕТ** получить доступ к данным другого tenant!

### Использование в Frontend

```typescript
import Typesense from 'typesense'

// 1. Получить scoped key с сервера
async function getScopedKey() {
  const res = await fetch('/api/keys/scoped', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${userToken}` },
    body: JSON.stringify({
      collection: 'products',
      expires_in: 3600,
    }),
  })
  return (await res.json()).scoped_key
}

// 2. Использовать для поиска
const scopedKey = await getScopedKey()

const client = new Typesense.Client({
  nodes: [{ host: 'search.yourdomain.com', port: 443, protocol: 'https' }],
  apiKey: scopedKey, // ✅ Безопасно для frontend!
})

const results = await client
  .collections('products')
  .documents()
  .search({ q: 'laptop', query_by: 'name' })
```

---

## TTL и Expiration

### Time To Live (TTL)

**TTL** — время жизни ключа после создания.

**Рекомендации:**

| Use Case | TTL | Причина |
|----------|-----|---------|
| Public widget | 1 час | Балан между безопасностью и UX |
| Authenticated user | 8 часов | Session-like duration |
| Short embed | 15 минут | Минимизация exposure |
| CI/CD | 24 часа | Max для automation |
| Production API | 90 дней | Регулярная ротация |

### Установка TTL

```typescript
// При создании
const key = await createAPIKey({
  tenant: 'acme-corp',
  label: 'Temporary Key',
  expiresIn: 3600, // 1 час в секундах
})

// Обновление TTL
await updateAPIKey(key.id, {
  expiresAt: addDays(new Date(), 90),
})
```

### Проверка expiration

```typescript
function isKeyExpired(key: APIKey): boolean {
  if (!key.expiresAt) return false
  return new Date() > new Date(key.expiresAt)
}

// Middleware
async function validateAPIKey(req: Request) {
  const apiKey = req.headers.get('x-api-key')
  const key = await getKeyByHash(hashKey(apiKey))

  if (!key || !key.isActive) {
    throw new Error('Invalid API key')
  }

  if (isKeyExpired(key)) {
    throw new Error('API key expired')
  }

  return key
}
```

---

## Permissions и Scopes

### Доступные scopes

```typescript
type APIKeyScope =
  | 'documents:read'
  | 'documents:write'
  | 'documents:delete'
  | 'search:query'
  | 'collections:read'
  | 'collections:write'
  | 'analytics:read'
```

### Примеры конфигураций

**Read-only ключ:**
```json
{
  "scopes": ["documents:read", "search:query", "analytics:read"]
}
```

**Full access ключ:**
```json
{
  "scopes": [
    "documents:read",
    "documents:write",
    "documents:delete",
    "search:query",
    "collections:read",
    "collections:write",
    "analytics:read"
  ]
}
```

**Write-only ключ (для ingestion):**
```json
{
  "scopes": ["documents:write"]
}
```

### Проверка permissions

```typescript
function hasScope(key: APIKey, requiredScope: string): boolean {
  return key.scopes.includes(requiredScope)
}

// Middleware
async function requireScope(scope: string) {
  return async (req: Request) => {
    const key = await validateAPIKey(req)
    
    if (!hasScope(key, scope)) {
      throw new Error(`Missing required scope: ${scope}`)
    }
    
    return key
  }
}

// Использование
app.delete('/api/documents/:id', requireScope('documents:delete'), async (req, res) => {
  // Можно удалять
})
```

---

## Rate Limiting

### Per-Key Rate Limits

```typescript
interface RateLimitConfig {
  maxRequests: number
  windowSeconds: number
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  'starter': { maxRequests: 100, windowSeconds: 60 },
  'pro': { maxRequests: 1000, windowSeconds: 60 },
  'enterprise': { maxRequests: 10000, windowSeconds: 60 },
}
```

### Реализация

```typescript
import { RateLimiter } from 'limiter'

const limiters = new Map<string, RateLimiter>()

async function checkRateLimit(apiKey: string, plan: string): Promise<boolean> {
  const config = RATE_LIMITS[plan]
  
  if (!limiters.has(apiKey)) {
    limiters.set(apiKey, new RateLimiter({
      tokensPerInterval: config.maxRequests,
      interval: config.windowSeconds * 1000,
    }))
  }

  const limiter = limiters.get(apiKey)!
  const remainingRequests = await limiter.removeTokens(1)

  return remainingRequests >= 0
}

// Middleware
async function rateLimitMiddleware(req: Request) {
  const key = await validateAPIKey(req)
  const allowed = await checkRateLimit(key.keyHash, key.tenant.plan)

  if (!allowed) {
    throw new TooManyRequestsError('Rate limit exceeded')
  }
}
```

### Headers в ответе

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 842
X-RateLimit-Reset: 1730560800
```

---

## Usage Tracking

### Отслеживание использования

```typescript
async function trackKeyUsage(keyId: string) {
  await payload.update({
    collection: 'api_keys',
    id: keyId,
    data: {
      lastUsedAt: new Date(),
      usageCount: { increment: 1 },
    },
  })
}
```

### Детальная аналитика

```typescript
interface KeyUsageStats {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageLatency: number
  lastUsed: Date
  topEndpoints: Array<{
    endpoint: string
    count: number
  }>
}

// Получить статистику
const stats = await getKeyUsageStats(keyId, {
  from: startDate,
  to: endDate,
})
```

### Dashboard

```http
GET /api/keys/:id/analytics
```

**Response:**
```json
{
  "key": "key_xyz789",
  "label": "Production API Key",
  "stats": {
    "totalRequests": 123456,
    "successfulRequests": 122890,
    "failedRequests": 566,
    "averageLatency": 45,
    "lastUsed": "2025-11-02T14:30:00Z",
    "topEndpoints": [
      { "endpoint": "/api/search", "count": 98765 },
      { "endpoint": "/api/documents", "count": 23456 }
    ]
  },
  "usage": {
    "thisMonth": 45230,
    "limit": 1000000,
    "percentage": "4.5%"
  }
}
```

---

## Ротация ключей

### Зачем ротировать?

1. **Безопасность** — регулярная смена снижает риск компрометации
2. **Compliance** — требования PCI DSS, SOC2
3. **Best Practice** — NIST рекомендует каждые 90 дней

### Процедура ротации

#### Шаг 1: Создать новый ключ

```bash
npm run cli apikey:create \
  --tenant acme-corp \
  --label "Production API Key v2" \
  --scopes read,write
```

#### Шаг 2: Обновить приложения

Обновить environment variables:

```bash
# Old
API_KEY=sk_live_old_key_here

# New
API_KEY=sk_live_new_key_here
```

#### Шаг 3: Проверить работу

```bash
# Test с новым ключом
curl https://yourdomain.com/api/search \
  -H "X-API-Key: sk_live_new_key_here"
```

#### Шаг 4: Отозвать старый ключ

```bash
npm run cli apikey:revoke --id old_key_id
```

### Автоматическая ротация

```typescript
async function rotateAPIKeys() {
  const expiringKeys = await payload.find({
    collection: 'api_keys',
    where: {
      expiresAt: {
        less_than: addDays(new Date(), 7), // Истекают через 7 дней
      },
    },
  })

  for (const oldKey of expiringKeys.docs) {
    // Создать новый ключ
    const newKey = await createAPIKey({
      tenant: oldKey.tenant,
      label: `${oldKey.label} (rotated)`,
      scopes: oldKey.scopes,
      expiresIn: 7776000, // 90 дней
    })

    // Уведомить владельца
    await sendKeyRotationEmail(oldKey, newKey)
  }
}

// Запускать каждый день
schedule.every('day').at('02:00').do(rotateAPIKeys)
```

---

## Revocation

### Немедленный отзыв

```http
POST /api/keys/revoke
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "keyId": "key_xyz789",
  "reason": "Compromised"
}
```

**Response:**
```json
{
  "success": true,
  "message": "API key revoked",
  "revokedAt": "2025-11-02T15:00:00Z"
}
```

### Что происходит

1. ✅ Key помечается как `isActive: false`
2. ✅ Все активные запросы завершаются с ошибкой
3. ✅ Новые запросы отклоняются
4. ✅ Audit log запись
5. ✅ Email уведомление владельцу

### Bulk revocation

```typescript
// Отозвать все ключи tenant
await revokeAllTenantKeys('tenant_abc123', {
  reason: 'Security incident',
  notifyOwner: true,
})

// Отозвать все истекшие ключи
await revokeExpiredKeys()
```

---

## Best Practices

### Безопасность

✅ **Рекомендуется:**

1. **НИКОГДА не коммитить ключи в git**
   ```bash
   # .gitignore
   .env
   .env.local
   *.key
   ```

2. **Использовать environment variables**
   ```typescript
   const apiKey = process.env.API_KEY
   ```

3. **Хранить в секретах** (Vault, AWS Secrets Manager)
   ```bash
   aws secretsmanager create-secret \
     --name api-key \
     --secret-string "sk_live_..."
   ```

4. **Ротация каждые 90 дней**

5. **Scoped keys для frontend**

6. **Rate limiting всегда включен**

7. **Мониторинг usage**

❌ **Избегайте:**

1. ❌ Хардкод ключей в коде
2. ❌ Один ключ для всех окружений
3. ❌ Admin keys в frontend
4. ❌ Отсутствие TTL
5. ❌ Не отслеживать usage
6. ❌ Не ротировать ключи

### Naming Convention

```
{environment}_{type}_{tenant}_{index}

Примеры:
prod_search_acme_01
dev_admin_acme_01
staging_api_acme_02
```

### Документирование

Создайте README для команды:

```markdown
# API Keys

## Production
- Search Key: `sk_live_xxx` (Expires: 2026-02-01)
- Admin Key: `admin_live_yyy` (Expires: 2026-02-01)

## Staging
- Search Key: `sk_test_aaa` (Expires: 2025-12-01)

## Rotation Schedule
- Every 90 days (1st of March, June, September, December)

## Emergency Revocation
If compromised, contact: security@acme.com
```

---

**Версия:** 1.0.0  
**Дата обновления:** 2025-11-02  
**Следующий раздел:** [05-security.md](./05-security.md)
