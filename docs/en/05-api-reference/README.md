# API Reference - Справочник API

> **Полная документация REST API для AACSearch Platform**

## Содержание

1. [Аутентификация](./01-authentication.md) - JWT, API Keys, Scoped Keys
2. [Search API](./02-search-api.md) - Основной поиск, multi-search, автодополнение
3. [Advanced Search](./03-advanced-search.md) - NL, Vector, RAG, Image, Geo, Voice
4. [Collections API](./04-collections-api.md) - Управление коллекциями и документами
5. [Curation API](./05-curation-api.md) - Синонимы, Overrides, Stopwords
6. [Analytics API](./06-analytics-api.md) - Популярные запросы, no-hits, правила
7. [Bulk API](./07-bulk-api.md) - Массовый импорт/экспорт, update/delete by query
8. [Billing API](./08-billing-api.md) - Stripe Checkout, подписки, счета
9. [Admin API](./09-admin-api.md) - Пользователи, API Keys, Jobs, Tenants
10. [Webhooks](./10-webhooks.md) - Stripe webhooks, Integration webhooks

---

## Обзор API

### Base URL

```
Production: https://app.aacsearch.com
Development: http://localhost:3000
```

### Версионирование

API версионируется через URL path:

```
/api/v1/search    # Версия 1 (текущая)
/api/search       # Без версии (по умолчанию v1)
```

**Текущая версия:** v1 (стабильная)

---

## Request Format

### HTTP Methods

- **GET** - Получение данных
- **POST** - Создание ресурса / выполнение поиска
- **PUT** - Полное обновление ресурса
- **PATCH** - Частичное обновление ресурса
- **DELETE** - Удаление ресурса

### Content-Type

```http
Content-Type: application/json
```

Все request body должны быть в формате JSON, кроме:
- `POST /api/bulk/import` - `multipart/form-data`
- `GET /api/bulk/export` - возвращает `application/x-ndjson`

### Example Request

```bash
curl -X POST https://app.aacsearch.com/api/search \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "q": "search query",
    "collection": "products",
    "per_page": 20
  }'
```

---

## Response Format

### Success Response

```json
{
  "hits": [
    {
      "document": {
        "id": "123",
        "title": "Product Name",
        "price": 99.99
      },
      "highlights": {
        "title": {
          "matched_tokens": ["Product"],
          "snippet": "<mark>Product</mark> Name"
        }
      },
      "text_match": 130823487
    }
  ],
  "found": 42,
  "out_of": 1000,
  "page": 1,
  "search_time_ms": 12
}
```

### Error Response

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

### HTTP Status Codes

| Код | Описание | Пример |
|-----|----------|--------|
| `200` | OK | Успешный запрос |
| `201` | Created | Ресурс создан |
| `204` | No Content | Успешное удаление |
| `400` | Bad Request | Невалидные параметры |
| `401` | Unauthorized | Отсутствует или невалидный токен |
| `403` | Forbidden | Нет доступа к ресурсу |
| `404` | Not Found | Ресурс не найден |
| `409` | Conflict | Конфликт (напр., дубликат) |
| `429` | Too Many Requests | Превышен rate limit |
| `500` | Internal Server Error | Ошибка сервера |
| `503` | Service Unavailable | Сервис недоступен |

---

## Pagination

### Query Parameters

```
page=1           # Номер страницы (начинается с 1)
per_page=20      # Количество результатов на странице (max: 250)
```

### Example

```bash
GET /api/search?q=laptop&page=2&per_page=50
```

### Response Fields

```json
{
  "hits": [...],
  "found": 842,        // Всего найдено
  "out_of": 10000,     // Всего в коллекции
  "page": 2,           // Текущая страница
  "per_page": 50       // Результатов на странице
}
```

### Cursor Pagination (для больших датасетов)

Для экспорта > 250 записей используйте:

```bash
GET /api/bulk/export?collection=products&filter_by=category:electronics
```

Возвращает JSONL stream всех документов.

---

## Filtering

### Filter Syntax

Используйте параметр `filter_by` для фильтрации:

```
# Точное совпадение
filter_by=category:electronics

# Числовые фильтры
filter_by=price:>50 && price:<200

# Логические операторы
filter_by=in_stock:=true

# Массивы
filter_by=tags:=[sale,featured]

# Комбинирование
filter_by=category:electronics && price:<100 && in_stock:=true
```

### Operators

| Оператор | Описание | Пример |
|----------|----------|--------|
| `:` | Равно (строки) | `category:electronics` |
| `:=` | Точное равенство | `id:=12345` |
| `:!=` | Не равно | `status:!=draft` |
| `:>` | Больше | `price:>50` |
| `:>=` | Больше или равно | `rating:>=4.5` |
| `:<` | Меньше | `price:<100` |
| `:<=` | Меньше или равно | `stock:<=10` |
| `:=[...]` | В массиве | `tags:=[sale,new]` |
| `:!=[...]` | Не в массиве | `status:!=[draft,archived]` |

### Logical Operators

```
&&  - AND (и)
||  - OR (или)
```

### Examples

```bash
# Товары в категории "electronics" дешевле $100
filter_by=category:electronics && price:<100

# Товары со скидкой ИЛИ новинки
filter_by=tags:=[sale] || tags:=[new]

# Сложный фильтр
filter_by=(category:electronics || category:computers) && price:>50 && price:<500 && in_stock:=true
```

---

## Sorting

### Sort Syntax

```
sort_by=field_name:asc   # По возрастанию
sort_by=field_name:desc  # По убыванию
```

### Multiple Sort Fields

```
sort_by=price:asc,rating:desc
```

Сначала сортирует по цене (возрастание), затем по рейтингу (убывание).

### Text Match Score

По умолчанию результаты сортируются по `_text_match:desc` (релевантность).

```bash
# Сортировка по релевантности (по умолчанию)
GET /api/search?q=laptop

# Сортировка по цене
GET /api/search?q=laptop&sort_by=price:asc

# Комбинированная сортировка
GET /api/search?q=laptop&sort_by=rating:desc,price:asc
```

---

## Faceting

### Facet Syntax

```
facet_by=category,brand,color
```

### Parameters

```
max_facet_values=100        # Максимум значений на фасет (default: 10)
facet_query=brand:apple     # Поиск по фасетам
facet_return_parent=true    # Возврат parent facets
```

### Response Format

```json
{
  "facet_counts": [
    {
      "field_name": "category",
      "counts": [
        {"value": "Electronics", "count": 145},
        {"value": "Computers", "count": 89},
        {"value": "Accessories", "count": 67}
      ]
    },
    {
      "field_name": "brand",
      "counts": [
        {"value": "Apple", "count": 56},
        {"value": "Samsung", "count": 42},
        {"value": "Dell", "count": 31}
      ]
    }
  ]
}
```

### Example

```bash
curl "https://app.aacsearch.com/api/search?q=laptop&facet_by=brand,price_range&max_facet_values=20"
```

---

## Rate Limiting

### Limits by Plan

| План | Запросов/минуту | Запросов/день |
|------|-----------------|---------------|
| **Free** | 10 | 1,000 |
| **Starter** | 100 | 10,000 |
| **Pro** | 1,000 | 100,000 |
| **Enterprise** | Unlimited | Unlimited |

### Rate Limit Headers

Каждый response включает headers:

```http
X-RateLimit-Limit: 100          # Лимит запросов
X-RateLimit-Remaining: 87       # Осталось запросов
X-RateLimit-Reset: 1699564800   # Unix timestamp сброса
Retry-After: 45                 # Секунд до retry (при 429)
```

### Error Response (429)

```json
{
  "error": "Rate limit exceeded",
  "limit": 100,
  "remaining": 0,
  "resetAt": 1699564800,
  "retryAfter": 45
}
```

### Best Practices

1. **Используйте exponential backoff** при 429 ошибках
2. **Кэшируйте результаты** на клиенте
3. **Батчинг** - используйте multi-search для множественных запросов
4. **Webhooks** - используйте вместо polling

---

## Error Handling

### Standard Error Format

```json
{
  "error": "Error Type",
  "message": "Detailed error description",
  "field": "specific_field",    // (опционально)
  "code": "ERROR_CODE"           // (опционально)
}
```

### Common Error Codes

| Code | HTTP | Описание |
|------|------|----------|
| `UNAUTHORIZED` | 401 | Невалидный или отсутствующий токен |
| `FORBIDDEN` | 403 | Нет доступа к ресурсу |
| `NOT_FOUND` | 404 | Ресурс не найден |
| `VALIDATION_ERROR` | 400 | Невалидные параметры |
| `RATE_LIMIT_EXCEEDED` | 429 | Превышен rate limit |
| `USAGE_LIMIT_EXCEEDED` | 429 | Превышен лимит подписки |
| `DUPLICATE_RESOURCE` | 409 | Ресурс уже существует |
| `INTERNAL_ERROR` | 500 | Внутренняя ошибка сервера |

### Validation Errors

```json
{
  "error": "Validation failed",
  "message": "Invalid request parameters",
  "fields": {
    "email": "Must be a valid email address",
    "password": "Must be at least 8 characters"
  }
}
```

### Retry Logic

```javascript
async function searchWithRetry(query, maxRetries = 3) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ q: query })
      });

      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        await new Promise(resolve =>
          setTimeout(resolve, (retryAfter || 2 ** retries) * 1000)
        );
        retries++;
        continue;
      }

      return await response.json();
    } catch (error) {
      if (retries === maxRetries - 1) throw error;
      retries++;
      await new Promise(resolve => setTimeout(resolve, 2 ** retries * 1000));
    }
  }
}
```

---

## Authentication

API поддерживает 3 типа аутентификации:

### 1. JWT Token (для UI/фронтенда)

```bash
curl -X POST https://app.aacsearch.com/api/search \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Получение токена:**

```bash
POST /api/users/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Lifetime:** 7 дней (обновляется автоматически)

### 2. API Key (для серверного API)

```bash
curl -X POST https://app.aacsearch.com/api/search \
  -H "X-API-Key: aacsearch_sk_live_1234567890abcdef"
```

**Создание ключа:**

```bash
POST /api/keys/create
Authorization: Bearer YOUR_JWT_TOKEN

{
  "name": "Production API Key",
  "permissions": ["search:read", "documents:write"]
}
```

**Префиксы:**
- `aacsearch_sk_live_` - Production
- `aacsearch_sk_test_` - Development

### 3. Scoped Key (для клиентского поиска)

```bash
curl -X POST https://app.aacsearch.com/api/search/public \
  -H "X-Typesense-API-Key: scoped_key_xyz123"
```

**Создание scoped key:**

```bash
POST /api/keys/scoped
Authorization: Bearer YOUR_JWT_TOKEN

{
  "search_collections": ["products"],
  "filter_by": "tenant:=YOUR_TENANT_ID",
  "expires_at": 1699564800
}
```

**Use case:** Безопасный поиск на фронтенде без JWT

Подробнее: [01-authentication.md](./01-authentication.md)

---

## CORS

API поддерживает CORS для всех origins:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key, X-Typesense-API-Key
Access-Control-Max-Age: 86400
```

### Preflight Request

Браузер автоматически отправляет `OPTIONS` запрос:

```bash
OPTIONS /api/search
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Authorization, Content-Type
```

Response:

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: Authorization, Content-Type
```

---

## Webhooks

Платформа отправляет webhooks для событий:

### Supported Events

```
subscription.created
subscription.updated
subscription.cancelled
payment.succeeded
payment.failed
usage.limit_reached
analytics.threshold_reached
```

### Webhook Format

```json
{
  "event": "subscription.created",
  "timestamp": 1699564800,
  "data": {
    "subscription_id": "sub_123",
    "plan": "pro",
    "tenant_id": "tenant_456"
  },
  "signature": "sha256=abc123..."
}
```

### Signature Validation

```javascript
const crypto = require('crypto');

function validateWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}
```

Подробнее: [10-webhooks.md](./10-webhooks.md)

---

## SDK & Libraries

### Official SDKs

```bash
# JavaScript/TypeScript
npm install @aacsearch/client

# Python
pip install aacsearch

# PHP
composer require aacsearch/client

# Ruby
gem install aacsearch
```

### Usage Example

```javascript
import { AACSearchClient } from '@aacsearch/client';

const client = new AACSearchClient({
  apiKey: 'aacsearch_sk_live_...',
  host: 'https://app.aacsearch.com'
});

// Search
const results = await client.search({
  q: 'laptop',
  collection: 'products',
  per_page: 20
});

// Create document
await client.createDocument('products', {
  id: '123',
  title: 'MacBook Pro',
  price: 1999.99
});
```

---

## OpenAPI Specification

Полная OpenAPI 3.0 спецификация доступна:

```
https://app.aacsearch.com/api/openapi.json
```

### Swagger UI

Интерактивная документация:

```
https://app.aacsearch.com/api/docs
```

### Postman Collection

Импорт коллекции:

```bash
curl https://app.aacsearch.com/api/postman-collection.json > aacsearch.postman.json
```

---

## Support

### Документация

- 📚 [Guides](../04-user-guide/)
- 🔧 [Developer Docs](../06-developer-guide/)
- 🚀 [Deployment](../07-deployment/)

### Контакты

- **Email:** support@aacsearch.com
- **Discord:** https://discord.gg/aacsearch
- **GitHub Issues:** https://github.com/aacsearch/platform/issues

### Status Page

Статус сервисов:

```
https://status.aacsearch.com
```

---

## Changelog

### v1.0.0 (2024-11-02)

- ✨ Initial API release
- 🔍 Search API with faceting, filtering, sorting
- 🧠 Advanced search (NL, Vector, RAG, Image, Geo)
- 📊 Analytics API
- 💳 Billing integration (Stripe)
- 🔐 JWT, API Keys, Scoped Keys authentication
- 📦 Bulk operations (import/export)
- 🎯 Curation (synonyms, overrides, stopwords)

---

## Next Steps

1. **[Аутентификация](./01-authentication.md)** - Настройка API доступа
2. **[Search API](./02-search-api.md)** - Начало работы с поиском
3. **[Quickstart](../02-quickstart/README.md)** - Первый запрос за 5 минут
