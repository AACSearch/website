# Аутентификация API

> **Полное руководство по аутентификации в AACSearch Platform**

## Содержание

- [Обзор методов](#обзор-методов)
- [JWT Authentication](#jwt-authentication)
- [API Keys](#api-keys)
- [Scoped Keys](#scoped-keys)
- [Rate Limiting](#rate-limiting)
- [Error Codes](#error-codes)
- [Best Practices](#best-practices)

---

## Обзор методов

AACSearch Platform поддерживает **3 типа аутентификации**:

| Метод | Use Case | Безопасность | Expiration | Rate Limit |
|-------|----------|--------------|------------|------------|
| **JWT Token** | UI/Dashboard | ⭐⭐⭐ Высокая | 7 дней | 100/min (Starter) |
| **API Key** | Server API | ⭐⭐⭐⭐ Очень высокая | 1-365 дней | 1000/min (Pro) |
| **Scoped Key** | Client Search | ⭐⭐⭐⭐⭐ Максимальная | Кастомный | Unlimited |

### Когда использовать каждый метод

```mermaid
graph TD
    A[Тип клиента] --> B{Где код?}
    B -->|Backend| C[API Key]
    B -->|Frontend| D{Публичный?}
    B -->|Dashboard| E[JWT Token]
    D -->|Да| F[Scoped Key]
    D -->|Нет| E
```

---

## JWT Authentication

### Описание

JWT (JSON Web Token) - основной метод для **authenticated dashboard access**. Токен выдается при логине и автоматически обновляется.

### Получение JWT токена

#### Endpoint

```
POST /api/users/login
```

#### Request

```bash
curl -X POST https://app.aacsearch.com/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

#### Request Body Schema

```typescript
{
  email: string;      // Email пользователя
  password: string;   // Пароль (min 8 символов)
}
```

#### Response (200 OK)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTNhY...",
  "user": {
    "id": "653ac7f8e5d4b2c1a8f9e3d2",
    "email": "user@example.com",
    "name": "John Doe",
    "tenant": {
      "id": "12345",
      "name": "Acme Corp"
    },
    "role": "admin"
  },
  "exp": 1699564800
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `token` | string | JWT токен для аутентификации |
| `user.id` | string | ID пользователя |
| `user.email` | string | Email пользователя |
| `user.tenant.id` | string | ID tenant'а |
| `user.role` | string | Роль: `owner`, `admin`, `member` |
| `exp` | number | Unix timestamp истечения токена |

#### Error Responses

**401 Unauthorized - Неверные credentials**

```json
{
  "error": "Invalid credentials",
  "message": "Email or password is incorrect"
}
```

**429 Too Many Requests - Превышен rate limit**

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many login attempts. Try again in 15 minutes",
  "retryAfter": 900
}
```

### Использование JWT токена

#### Authorization Header

```bash
curl -X GET https://app.aacsearch.com/api/search?q=laptop \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### JavaScript Example

```javascript
// Login
const loginResponse = await fetch('https://app.aacsearch.com/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePassword123!',
  }),
});

const { token, user } = await loginResponse.json();

// Store token
localStorage.setItem('auth_token', token);

// Use token in requests
const searchResponse = await fetch('https://app.aacsearch.com/api/search?q=laptop', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const results = await searchResponse.json();
```

#### Python Example

```python
import requests
import json

# Login
login_url = "https://app.aacsearch.com/api/users/login"
login_payload = {
    "email": "user@example.com",
    "password": "SecurePassword123!"
}

response = requests.post(login_url, json=login_payload)
data = response.json()

token = data['token']
user = data['user']

# Use token
search_url = "https://app.aacsearch.com/api/search"
headers = {
    "Authorization": f"Bearer {token}"
}
params = {"q": "laptop"}

search_response = requests.get(search_url, headers=headers, params=params)
results = search_response.json()

print(results)
```

### Token Refresh

JWT токены **автоматически обновляются** при использовании. Каждый успешный запрос возвращает новый токен в response header:

```http
X-New-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Auto-refresh Logic

```javascript
async function apiRequest(url, options = {}) {
  let token = localStorage.getItem('auth_token');

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });

  // Check for new token in response
  const newToken = response.headers.get('X-New-Token');
  if (newToken) {
    localStorage.setItem('auth_token', newToken);
  }

  return response;
}
```

### Logout

#### Endpoint

```
POST /api/users/logout
```

#### Request

```bash
curl -X POST https://app.aacsearch.com/api/users/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

После logout токен становится невалидным и **не может быть использован**.

---

## API Keys

### Описание

API Keys - предпочтительный метод для **server-to-server** коммуникации. Ключи имеют длительный срок действия и не требуют обновления.

### Создание API Key

#### Endpoint

```
POST /api/keys/create
```

#### Authentication

Требуется JWT токен с ролью `owner` или `admin`.

#### Request

```bash
curl -X POST https://app.aacsearch.com/api/keys/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "12345",
    "label": "Production API Key",
    "expiresInDays": 365
  }'
```

#### Request Body Schema

```typescript
{
  tenantId: string;        // ID tenant'а
  label: string;           // Название ключа (для идентификации)
  expiresInDays?: number;  // Срок действия (default: 365, max: 730)
}
```

#### Response (200 OK)

```json
{
  "id": "673ac9f2e5d4b2c1a8f9e3d4",
  "apiKey": "aac_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "scopedSearchKey": "scoped_key_xyz123abc456...",
  "expiresAt": "2025-11-02T10:30:00.000Z"
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | ID записи ключа в БД |
| `apiKey` | string | **API Key (показывается ТОЛЬКО ОДИН РАЗ!)** |
| `scopedSearchKey` | string | Scoped key для Typesense |
| `expiresAt` | string | ISO дата истечения |

⚠️ **ВАЖНО:** `apiKey` показывается **только при создании**! Сохраните его в безопасное место. В базе хранится только SHA-256 хэш.

#### Error Responses

**403 Forbidden - Недостаточно прав**

```json
{
  "error": "Insufficient permissions",
  "message": "Only owners and admins can create API keys"
}
```

**400 Bad Request - Невалидные параметры**

```json
{
  "error": "Validation failed",
  "fields": {
    "expiresInDays": "Must be between 1 and 730"
  }
}
```

### API Key Format

```
aac_[64 hex characters]

Примеры:
aac_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

**Префиксы:**
- `aac_` - Production ключи
- `aac_test_` - Development/Test ключи (планируется)

### Использование API Key

#### X-API-Key Header

```bash
curl -X POST https://app.aacsearch.com/api/search \
  -H "X-API-Key: aac_1234567890abcdef..." \
  -H "Content-Type: application/json" \
  -d '{
    "q": "laptop",
    "collection": "products"
  }'
```

#### JavaScript Example

```javascript
const apiKey = 'aac_1234567890abcdef...';

async function search(query) {
  const response = await fetch('https://app.aacsearch.com/api/search', {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: query,
      collection: 'products',
      per_page: 20,
    }),
  });

  return await response.json();
}

const results = await search('laptop');
console.log(results);
```

#### Python Example

```python
import requests

API_KEY = "aac_1234567890abcdef..."

def search(query):
    url = "https://app.aacsearch.com/api/search"
    headers = {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "q": query,
        "collection": "products",
        "per_page": 20
    }

    response = requests.post(url, json=payload, headers=headers)
    return response.json()

results = search("laptop")
print(results)
```

#### PHP Example

```php
<?php

$apiKey = 'aac_1234567890abcdef...';

function search($query) {
    global $apiKey;

    $url = 'https://app.aacsearch.com/api/search';
    $payload = json_encode([
        'q' => $query,
        'collection' => 'products',
        'per_page' => 20
    ]);

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'X-API-Key: ' . $apiKey,
        'Content-Type: application/json'
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true);
}

$results = search('laptop');
print_r($results);
```

### Список API Keys

#### Endpoint

```
POST /api/keys/list
```

#### Request

```bash
curl -X POST https://app.aacsearch.com/api/keys/list \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tenantId": "12345"}'
```

#### Response (200 OK)

```json
{
  "keys": [
    {
      "id": "673ac9f2e5d4b2c1a8f9e3d4",
      "label": "Production API Key",
      "isActive": true,
      "expiresAt": "2025-11-02T10:30:00.000Z",
      "lastUsedAt": "2024-11-01T15:22:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "673ac9f2e5d4b2c1a8f9e3d5",
      "label": "Development Key",
      "isActive": false,
      "expiresAt": "2024-12-01T10:30:00.000Z",
      "lastUsedAt": "2024-10-15T08:12:00.000Z",
      "createdAt": "2024-01-10T09:00:00.000Z"
    }
  ]
}
```

⚠️ **Обратите внимание:** Сам API key **НИКОГДА** не возвращается в списке!

### Отзыв API Key

#### Endpoint

```
POST /api/keys/revoke
```

#### Request

```bash
curl -X POST https://app.aacsearch.com/api/keys/revoke \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"keyId": "673ac9f2e5d4b2c1a8f9e3d4"}'
```

#### Response (200 OK)

```json
{
  "success": true
}
```

После отзыва ключ становится невалидным **немедленно** и не может быть восстановлен.

---

## Scoped Keys

### Описание

Scoped Keys - **самый безопасный** метод для публичного поиска на фронтенде. Ключи:

- ✅ Подписаны HMAC-SHA256 (невозможно подделать)
- ✅ Содержат embedded фильтры (нельзя изменить)
- ✅ Имеют ограниченный срок действия
- ✅ Работают только для поиска (read-only)
- ✅ Tenant-изолированы

### Создание Scoped Key

#### Endpoint

```
POST /api/keys/search-scope
```

#### Authentication

Требуется JWT токен.

#### Request

```bash
curl -X POST https://app.aacsearch.com/api/keys/search-scope \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "products",
    "filter_by": "category:electronics",
    "exclude_fields": "internal,cost_price",
    "limit_hits": 100,
    "expires_in": 86400,
    "cache_ttl": 3600
  }'
```

#### Request Body Schema

```typescript
{
  collection: string;           // Коллекция для поиска
  filter_by?: string;           // Дополнительный фильтр (добавляется к tenant filter)
  exclude_fields?: string;      // Поля для исключения (через запятую)
  limit_hits?: number;          // Максимум результатов на запрос
  expires_in?: number;          // Срок действия в секундах (default: 86400 = 1 день)
  cache_ttl?: number;           // TTL кэша в секундах (default: 3600 = 1 час)
}
```

#### Response (200 OK)

```json
{
  "scoped_key": "c2NvcGVkX2tleV94eXoxMjNhYmM0NTY3ODkw...",
  "expires_at": 1699651200,
  "metadata": {
    "collection": "products",
    "filter_by": "tenant:=12345 && category:electronics",
    "tenant_id": "12345",
    "exclude_fields": "internal,cost_price",
    "limit_hits": 100
  }
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `scoped_key` | string | Base64-encoded HMAC-signed ключ |
| `expires_at` | number | Unix timestamp истечения |
| `metadata.filter_by` | string | Финальный фильтр (с tenant isolation) |
| `metadata.tenant_id` | string | ID tenant'а |

### Использование Scoped Key

#### Public Search Endpoint

```
POST /api/search/public
```

#### X-Typesense-API-Key Header

```bash
curl -X POST https://app.aacsearch.com/api/search/public \
  -H "X-Typesense-API-Key: c2NvcGVkX2tleV94eXoxMjNhYmM0NTY3ODkw..." \
  -H "Content-Type: application/json" \
  -d '{
    "q": "laptop",
    "query_by": "title,description",
    "per_page": 20
  }'
```

#### JavaScript Example (Frontend)

```javascript
// Получить scoped key с бэкенда (один раз при загрузке страницы)
async function getScopedKey() {
  const response = await fetch('/api/keys/search-scope', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      collection: 'products',
      filter_by: 'status:published',
      expires_in: 86400,
    }),
  });

  const { scoped_key } = await response.json();
  return scoped_key;
}

// Использовать scoped key для поиска (клиентский код)
async function publicSearch(scopedKey, query) {
  const response = await fetch('https://app.aacsearch.com/api/search/public', {
    method: 'POST',
    headers: {
      'X-Typesense-API-Key': scopedKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: query,
      query_by: 'title,description',
      per_page: 20,
    }),
  });

  return await response.json();
}

// Workflow
const scopedKey = await getScopedKey();
const results = await publicSearch(scopedKey, 'laptop');
console.log(results);
```

#### React Hook Example

```typescript
import { useState, useEffect } from 'react';

function useSearch(initialQuery = '') {
  const [scopedKey, setScopedKey] = useState<string | null>(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Получить scoped key при монтировании
  useEffect(() => {
    async function fetchKey() {
      const response = await fetch('/api/keys/search-scope', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collection: 'products',
          expires_in: 86400,
        }),
      });

      const { scoped_key } = await response.json();
      setScopedKey(scoped_key);
    }

    fetchKey();
  }, []);

  // Функция поиска
  const search = async (query: string) => {
    if (!scopedKey) return;

    setLoading(true);
    try {
      const response = await fetch('https://app.aacsearch.com/api/search/public', {
        method: 'POST',
        headers: {
          'X-Typesense-API-Key': scopedKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: query,
          query_by: 'title,description',
          per_page: 20,
        }),
      });

      const data = await response.json();
      setResults(data.hits || []);
    } finally {
      setLoading(false);
    }
  };

  return { search, results, loading };
}

// Usage
function SearchComponent() {
  const { search, results, loading } = useSearch();

  return (
    <div>
      <input
        type="text"
        onChange={(e) => search(e.target.value)}
        placeholder="Search..."
      />
      {loading && <div>Loading...</div>}
      <ul>
        {results.map((hit) => (
          <li key={hit.document.id}>{hit.document.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Список Scoped Keys

#### Endpoint

```
GET /api/keys/search-scope
```

#### Request

```bash
curl -X GET https://app.aacsearch.com/api/keys/search-scope \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Response (200 OK)

```json
{
  "keys": [
    {
      "id": "1",
      "collection": "products",
      "key_hash": "abc123def456...",
      "filter_by": "tenant:=12345 && category:electronics",
      "exclude_fields": "internal,cost_price",
      "limit_hits": 100,
      "generated_at": "2024-11-01T10:00:00.000Z",
      "expires_at": 1699651200,
      "last_used_at": "2024-11-02T08:30:00.000Z",
      "usage_count": 1523,
      "is_revoked": false
    }
  ]
}
```

### Отзыв Scoped Key

#### Endpoint

```
POST /api/keys/search-scope/revoke
```

#### Request

```bash
curl -X POST https://app.aacsearch.com/api/keys/search-scope/revoke \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key_id": "1"}'
```

**Или по хэшу:**

```bash
curl -X POST https://app.aacsearch.com/api/keys/search-scope/revoke \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key_hash": "abc123def456..."}'
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Key revoked successfully"
}
```

### Валидация Scoped Key

#### Endpoint

```
POST /api/keys/search-scope/validate
```

Проверяет подпись и срок действия scoped key.

#### Request

```bash
curl -X POST https://app.aacsearch.com/api/keys/search-scope/validate \
  -H "Content-Type: application/json" \
  -d '{"scoped_key": "c2NvcGVkX2tleV94eXoxMjNhYmM0NTY3ODkw..."}'
```

#### Response (200 OK) - Valid

```json
{
  "valid": true,
  "params": {
    "filter_by": "tenant:=12345 && category:electronics",
    "expires_at": 1699651200,
    "limit_hits": 100
  },
  "tenant_id": "12345"
}
```

#### Response (400 Bad Request) - Invalid

```json
{
  "valid": false,
  "error": "Key has expired"
}
```

---

## Rate Limiting

### Лимиты по планам

| План | JWT Requests/min | API Key Requests/min | Scoped Key Requests |
|------|------------------|----------------------|---------------------|
| **Free** | 10 | N/A | Unlimited* |
| **Starter** | 100 | 100 | Unlimited* |
| **Pro** | 1,000 | 1,000 | Unlimited* |
| **Enterprise** | Unlimited | Unlimited | Unlimited |

\* Scoped keys технически unlimited, но ограничены subscription limits (searches/month).

### Rate Limit Headers

Каждый response включает:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1699564800
```

| Header | Описание |
|--------|----------|
| `X-RateLimit-Limit` | Максимум запросов за окно |
| `X-RateLimit-Remaining` | Осталось запросов |
| `X-RateLimit-Reset` | Unix timestamp сброса счетчика |

### 429 Too Many Requests Response

```json
{
  "error": "Rate limit exceeded",
  "message": "You have exceeded the rate limit of 100 requests per minute",
  "limit": 100,
  "remaining": 0,
  "resetAt": 1699564800,
  "retryAfter": 45
}
```

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1699564800
Retry-After: 45
```

### Retry Logic

#### Exponential Backoff Example

```javascript
async function requestWithRetry(url, options, maxRetries = 3) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options);

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10);
        const delay = Math.min(retryAfter * 1000, 2 ** retries * 1000);

        console.log(`Rate limited. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));

        retries++;
        continue;
      }

      return response;
    } catch (error) {
      if (retries === maxRetries - 1) throw error;

      // Exponential backoff для других ошибок
      const delay = 2 ** retries * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      retries++;
    }
  }

  throw new Error(`Max retries (${maxRetries}) exceeded`);
}

// Usage
const response = await requestWithRetry('https://app.aacsearch.com/api/search?q=laptop', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

#### Python Retry with Backoff

```python
import requests
import time

def request_with_retry(url, headers, max_retries=3):
    retries = 0

    while retries < max_retries:
        response = requests.get(url, headers=headers)

        if response.status_code == 429:
            retry_after = int(response.headers.get('Retry-After', 60))
            delay = min(retry_after, 2 ** retries)

            print(f"Rate limited. Retrying in {delay}s...")
            time.sleep(delay)

            retries += 1
            continue

        return response

    raise Exception(f"Max retries ({max_retries}) exceeded")

# Usage
response = request_with_retry(
    'https://app.aacsearch.com/api/search?q=laptop',
    headers={'Authorization': f'Bearer {token}'}
)
```

---

## Error Codes

### Authentication Errors

| Code | HTTP | Description | Solution |
|------|------|-------------|----------|
| `UNAUTHORIZED` | 401 | Токен отсутствует или невалиден | Проверьте Authorization header |
| `TOKEN_EXPIRED` | 401 | JWT токен истек | Выполните re-login |
| `INVALID_CREDENTIALS` | 401 | Неверный email/password | Проверьте credentials |
| `FORBIDDEN` | 403 | Нет доступа к ресурсу | Проверьте права пользователя |
| `INSUFFICIENT_PERMISSIONS` | 403 | Недостаточно прав для операции | Требуется роль owner/admin |
| `TENANT_ACCESS_DENIED` | 403 | Нет доступа к tenant | Проверьте membership |

### Rate Limiting Errors

| Code | HTTP | Description | Solution |
|------|------|-------------|----------|
| `RATE_LIMIT_EXCEEDED` | 429 | Превышен rate limit | Используйте exponential backoff |
| `USAGE_LIMIT_EXCEEDED` | 429 | Превышен лимит подписки | Обновите план или дождитесь reset |
| `SCOPED_KEY_RATE_LIMIT` | 429 | Превышен лимит генерации scoped keys | Повторите через 1 минуту |

### Validation Errors

| Code | HTTP | Description | Example |
|------|------|-------------|---------|
| `VALIDATION_ERROR` | 400 | Невалидные параметры | `{"fields": {"email": "Invalid format"}}` |
| `MISSING_REQUIRED_FIELD` | 400 | Отсутствует обязательное поле | `{"error": "tenantId is required"}` |
| `INVALID_KEY_FORMAT` | 400 | Невалидный формат ключа | API key должен начинаться с `aac_` |
| `KEY_EXPIRED` | 400 | Ключ истек | Создайте новый ключ |
| `KEY_REVOKED` | 400 | Ключ отозван | Ключ был отозван администратором |

### Full Error Response Example

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "statusCode": 400,
  "fields": {
    "email": "Must be a valid email address",
    "expiresInDays": "Must be between 1 and 730"
  },
  "timestamp": "2024-11-02T10:30:00.000Z",
  "path": "/api/keys/create",
  "requestId": "req_abc123def456"
}
```

---

## Best Practices

### 1. Безопасное хранение ключей

#### ✅ DO

```javascript
// Backend (Node.js)
const apiKey = process.env.AACSEARCH_API_KEY;

// Frontend - используйте scoped keys
const scopedKey = await getScopedKeyFromBackend();
```

#### ❌ DON'T

```javascript
// НИКОГДА не храните API keys в frontend коде!
const apiKey = 'aac_1234567890abcdef...'; // 🚨 ОПАСНО!

// НИКОГДА не коммитьте ключи в git
```

### 2. Environment Variables

#### .env file

```bash
# API Keys
AACSEARCH_API_KEY=aac_1234567890abcdef...
AACSEARCH_SCOPED_KEY_SECRET=your_secret_key

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=7d
```

#### .gitignore

```
.env
.env.local
.env.production
*.key
*.pem
```

### 3. Key Rotation

Регулярно обновляйте API keys (рекомендуется каждые 90 дней):

```javascript
async function rotateAPIKey(oldKeyId) {
  // 1. Создать новый ключ
  const newKey = await createAPIKey({
    tenantId: '12345',
    label: 'Production API Key (Rotated)',
    expiresInDays: 90,
  });

  // 2. Обновить приложение с новым ключом
  await updateEnvironmentVariable('AACSEARCH_API_KEY', newKey.apiKey);

  // 3. Дождаться deploy
  await waitForDeployment();

  // 4. Отозвать старый ключ
  await revokeAPIKey(oldKeyId);

  console.log('Key rotation completed successfully');
}
```

### 4. Multi-Environment Setup

```javascript
// config/aacsearch.js
const config = {
  development: {
    apiKey: process.env.AACSEARCH_DEV_API_KEY,
    baseURL: 'http://localhost:3000',
  },
  staging: {
    apiKey: process.env.AACSEARCH_STAGING_API_KEY,
    baseURL: 'https://staging.aacsearch.com',
  },
  production: {
    apiKey: process.env.AACSEARCH_PROD_API_KEY,
    baseURL: 'https://app.aacsearch.com',
  },
};

export default config[process.env.NODE_ENV || 'development'];
```

### 5. Error Handling

```javascript
async function authenticatedRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        ...options.headers,
      },
    });

    // Handle authentication errors
    if (response.status === 401) {
      // Token expired - attempt refresh or redirect to login
      const refreshed = await refreshToken();
      if (refreshed) {
        // Retry request with new token
        return authenticatedRequest(url, options);
      } else {
        // Redirect to login
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
    }

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      console.warn(`Rate limited. Retry after ${retryAfter}s`);

      // Implement backoff or throw
      throw new Error('Rate limit exceeded');
    }

    return response;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}
```

### 6. Scoped Keys для разных use cases

```javascript
// Public product search (frontend)
const publicSearchKey = await createScopedKey({
  collection: 'products',
  filter_by: 'status:published && visibility:public',
  exclude_fields: 'cost_price,supplier,internal_notes',
  expires_in: 86400, // 1 day
});

// User-specific search (logged-in users)
const userSearchKey = await createScopedKey({
  collection: 'documents',
  filter_by: `accessible_to:=[${userId}]`,
  expires_in: 3600, // 1 hour
});

// Analytics dashboard (limited hits)
const analyticsKey = await createScopedKey({
  collection: 'analytics',
  limit_hits: 1000,
  expires_in: 300, // 5 minutes
});
```

### 7. Monitoring & Logging

```javascript
// Track API key usage
async function trackKeyUsage(keyId, endpoint, statusCode) {
  await analytics.track({
    event: 'api_key_used',
    properties: {
      keyId,
      endpoint,
      statusCode,
      timestamp: Date.now(),
    },
  });
}

// Alert on suspicious activity
async function monitorKeyUsage(keyId) {
  const usage = await getKeyUsage(keyId, { last: '1h' });

  if (usage.requestCount > 10000) {
    await sendAlert({
      type: 'high_api_key_usage',
      keyId,
      requestCount: usage.requestCount,
    });
  }
}
```

### 8. Testing Authentication

```javascript
// test/auth.test.js
describe('Authentication', () => {
  it('should authenticate with JWT token', async () => {
    const token = await login('user@example.com', 'password123');
    expect(token).toBeDefined();

    const response = await fetch('/api/search?q=test', {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    expect(response.status).toBe(200);
  });

  it('should fail with invalid token', async () => {
    const response = await fetch('/api/search?q=test', {
      headers: { 'Authorization': 'Bearer invalid_token' },
    });

    expect(response.status).toBe(401);
  });

  it('should authenticate with API key', async () => {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'X-API-Key': process.env.TEST_API_KEY,
      },
      body: JSON.stringify({ q: 'test' }),
    });

    expect(response.status).toBe(200);
  });
});
```

---

## Security Checklist

✅ **API Keys:**
- [ ] Хранятся в environment variables
- [ ] Не коммитятся в git
- [ ] Ротируются каждые 90 дней
- [ ] Отзываются при компрометации
- [ ] Имеют минимально необходимые права

✅ **JWT Tokens:**
- [ ] Используют HTTPS
- [ ] Имеют разумный expiration (7 дней)
- [ ] Обновляются автоматически
- [ ] Хранятся в httpOnly cookies или secure storage
- [ ] Проверяются на backend при каждом запросе

✅ **Scoped Keys:**
- [ ] Генерируются на backend
- [ ] Содержат tenant isolation фильтры
- [ ] Исключают sensitive поля
- [ ] Имеют короткий TTL (1-24 часа)
- [ ] Используются только для read-only операций

✅ **Rate Limiting:**
- [ ] Включен для всех endpoints
- [ ] Мониторится и алертится
- [ ] Имеет exponential backoff
- [ ] Документирован в API docs

---

## Миграция с других систем

### Algolia → AACSearch

```javascript
// Algolia
const client = algoliasearch('APP_ID', 'SEARCH_KEY');

// AACSearch
const response = await fetch('https://app.aacsearch.com/api/search', {
  method: 'POST',
  headers: {
    'X-API-Key': 'aac_...',
  },
  body: JSON.stringify({ q: 'query' }),
});
```

### Elasticsearch → AACSearch

```javascript
// Elasticsearch
const client = new Client({ node: 'http://localhost:9200' });

// AACSearch (более простой API)
const response = await fetch('https://app.aacsearch.com/api/search', {
  headers: { 'X-API-Key': 'aac_...' },
});
```

---

## Support

Нужна помощь с аутентификацией?

- 📧 **Email:** security@aacsearch.com
- 💬 **Discord:** https://discord.gg/aacsearch
- 📚 **Docs:** https://docs.aacsearch.com

---

## Next Steps

- **[Search API](./02-search-api.md)** - Начало работы с поиском
- **[Advanced Search](./03-advanced-search.md)** - NL, Vector, RAG
- **[Collections API](./04-collections-api.md)** - Управление данными
