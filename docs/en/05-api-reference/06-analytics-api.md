# Analytics API

API аналитики предоставляет доступ к статистике поисковых запросов, популярным запросам, запросам без результатов и настройкам аналитики.

## Обзор

Analytics API позволяет:
- Получать топ популярных запросов
- Находить запросы без результатов (no-hits)
- Включать/отключать аналитику для тенанта
- Управлять правилами аналитики
- Экспортировать данные аналитики

## GET /api/analytics/top-queries

Получить список самых популярных поисковых запросов за период.

### Аутентификация

**Требуется:** JWT Token

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Query Parameters

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `limit` | number | Нет | Количество запросов. По умолчанию: `100`, максимум: `1000` |
| `collection` | string | Нет | Коллекция для фильтрации. По умолчанию: все коллекции |
| `start_date` | string | Нет | Начальная дата (ISO 8601). По умолчанию: последние 30 дней |
| `end_date` | string | Нет | Конечная дата (ISO 8601). По умолчанию: сегодня |

### Response (200 OK)

```json
{
  "queries": [
    {
      "query": "react hooks",
      "count": 1543,
      "last_searched": "2024-11-03T14:30:00Z",
      "avg_results": 234,
      "click_through_rate": 0.78,
      "collections": {
        "symbols": 1200,
        "pages": 343
      }
    },
    {
      "query": "typescript generics",
      "count": 982,
      "last_searched": "2024-11-03T13:45:00Z",
      "avg_results": 156,
      "click_through_rate": 0.65,
      "collections": {
        "symbols": 890,
        "pages": 92
      }
    }
  ],
  "total": 100,
  "period": {
    "start": "2024-10-04T00:00:00Z",
    "end": "2024-11-03T23:59:59Z"
  }
}
```

### Response Fields

| Поле | Тип | Описание |
|------|-----|----------|
| `queries` | array | Массив популярных запросов |
| `queries[].query` | string | Текст запроса |
| `queries[].count` | number | Количество выполнений |
| `queries[].last_searched` | string | Дата последнего выполнения (ISO 8601) |
| `queries[].avg_results` | number | Среднее количество результатов |
| `queries[].click_through_rate` | number | CTR (0.0-1.0) |
| `queries[].collections` | object | Распределение по коллекциям |
| `total` | number | Всего запросов в ответе |
| `period` | object | Период выборки |

### Examples

#### cURL

```bash
curl -X GET "https://api.aacsearch.com/api/analytics/top-queries?limit=50&start_date=2024-10-01" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### JavaScript

```javascript
async function getTopQueries(limit = 100, startDate = null) {
  const params = new URLSearchParams({ limit: limit.toString() });
  if (startDate) {
    params.append('start_date', startDate);
  }

  const response = await fetch(
    `https://api.aacsearch.com/api/analytics/top-queries?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`
      }
    }
  );

  return response.json();
}

// Get top 50 queries from last month
const topQueries = await getTopQueries(50, '2024-10-01');
console.log('Most popular:', topQueries.queries[0].query);
```

#### Python

```python
import requests
from datetime import datetime, timedelta

def get_top_queries(limit=100, days_back=30):
    start_date = (datetime.now() - timedelta(days=days_back)).isoformat()

    response = requests.get(
        'https://api.aacsearch.com/api/analytics/top-queries',
        params={'limit': limit, 'start_date': start_date},
        headers={'Authorization': f'Bearer {JWT_TOKEN}'}
    )
    return response.json()

# Get top 100 queries from last 30 days
data = get_top_queries(100, 30)
for query in data['queries'][:10]:
    print(f"{query['query']}: {query['count']} searches")
```

---

## GET /api/analytics/no-hits

Получить запросы, которые не вернули результатов.

### Query Parameters

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `limit` | number | Нет | Количество запросов. По умолчанию: `50`, максимум: `500` |
| `collection` | string | Нет | Фильтр по коллекции |
| `min_count` | number | Нет | Минимальное количество повторений. По умолчанию: `1` |

### Response (200 OK)

```json
{
  "queries": [
    {
      "query": "react native windows 11",
      "count": 45,
      "last_searched": "2024-11-03T12:00:00Z",
      "collection": "symbols",
      "suggested_actions": [
        "Add synonyms for 'windows 11'",
        "Create content about React Native Windows support"
      ]
    },
    {
      "query": "svelte 5 runes",
      "count": 32,
      "last_searched": "2024-11-03T11:30:00Z",
      "collection": "symbols",
      "suggested_actions": [
        "Index new Svelte 5 documentation",
        "Add 'runes' to keywords"
      ]
    }
  ],
  "total": 50,
  "impact_score": 0.78
}
```

### Examples

#### JavaScript

```javascript
async function getNoHitsQueries(minCount = 5) {
  const response = await fetch(
    `https://api.aacsearch.com/api/analytics/no-hits?min_count=${minCount}`,
    {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`
      }
    }
  );

  return response.json();
}

// Get queries with no results that were searched at least 5 times
const noHits = await getNoHitsQueries(5);
console.log('Found', noHits.total, 'queries with no results');

// Identify content gaps
noHits.queries.forEach(q => {
  console.log(`"${q.query}" - searched ${q.count} times`);
  console.log('Actions:', q.suggested_actions.join(', '));
});
```

#### Python

```python
def get_no_hits_queries(min_count=1):
    response = requests.get(
        'https://api.aacsearch.com/api/analytics/no-hits',
        params={'min_count': min_count, 'limit': 100},
        headers={'Authorization': f'Bearer {JWT_TOKEN}'}
    )
    return response.json()

# Find content gaps
no_hits = get_no_hits_queries(min_count=3)
print(f"Impact Score: {no_hits['impact_score']}")

for query in no_hits['queries']:
    print(f"\n'{query['query']}' ({query['count']} searches)")
    for action in query['suggested_actions']:
        print(f"  - {action}")
```

---

## POST /api/analytics/enable

Включить аналитику для тенанта.

### Request Body

```json
{
  "collections": ["symbols", "pages", "products"],
  "track_queries": true,
  "track_clicks": true,
  "track_conversions": true,
  "anonymize_ip": true,
  "retention_days": 90
}
```

### Request Parameters

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `collections` | array | Нет | Список коллекций для аналитики. По умолчанию: все |
| `track_queries` | boolean | Нет | Отслеживать запросы. По умолчанию: `true` |
| `track_clicks` | boolean | Нет | Отслеживать клики. По умолчанию: `true` |
| `track_conversions` | boolean | Нет | Отслеживать конверсии. По умолчанию: `false` |
| `anonymize_ip` | boolean | Нет | Анонимизировать IP. По умолчанию: `true` |
| `retention_days` | number | Нет | Период хранения данных (30-365). По умолчанию: `90` |

### Response (200 OK)

```json
{
  "success": true,
  "message": "Analytics enabled successfully",
  "tenantId": "tenant_abc123",
  "collections": ["symbols", "pages", "products"],
  "config": {
    "track_queries": true,
    "track_clicks": true,
    "track_conversions": true,
    "anonymize_ip": true,
    "retention_days": 90
  },
  "analytics_rules": [
    {
      "name": "popular_queries",
      "source": {
        "collections": ["symbols", "pages", "products"]
      },
      "destination": {
        "collection": "tenant_abc123_popular_queries"
      },
      "type": "popular_queries",
      "limit": 1000
    },
    {
      "name": "nohits_queries",
      "source": {
        "collections": ["symbols", "pages", "products"]
      },
      "destination": {
        "collection": "tenant_abc123_nohits_queries"
      },
      "type": "nohits_queries",
      "limit": 1000
    }
  ]
}
```

### Examples

#### JavaScript

```javascript
async function enableAnalytics(collections) {
  const response = await fetch('https://api.aacsearch.com/api/analytics/enable', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      collections,
      track_queries: true,
      track_clicks: true,
      track_conversions: true,
      anonymize_ip: true,
      retention_days: 90
    })
  });

  return response.json();
}

const result = await enableAnalytics(['symbols', 'pages', 'products']);
console.log('Analytics enabled:', result.success);
```

#### Python

```python
def enable_analytics(collections, retention_days=90):
    response = requests.post(
        'https://api.aacsearch.com/api/analytics/enable',
        headers={'Authorization': f'Bearer {JWT_TOKEN}'},
        json={
            'collections': collections,
            'track_queries': True,
            'track_clicks': True,
            'track_conversions': True,
            'anonymize_ip': True,
            'retention_days': retention_days
        }
    )
    return response.json()

result = enable_analytics(['symbols', 'pages'], retention_days=90)
print(f"Analytics enabled for: {', '.join(result['collections'])}")
```

---

## POST /api/analytics/disable

Отключить аналитику для тенанта.

### Response (200 OK)

```json
{
  "success": true,
  "message": "Analytics disabled successfully",
  "tenantId": "tenant_abc123"
}
```

### Examples

#### JavaScript

```javascript
async function disableAnalytics() {
  const response = await fetch('https://api.aacsearch.com/api/analytics/disable', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`
    }
  });

  return response.json();
}

await disableAnalytics();
```

---

## GET /api/analytics/rules

Получить список правил аналитики.

### Response (200 OK)

```json
{
  "rules": [
    {
      "name": "tenant_abc123_popular_queries",
      "type": "popular_queries",
      "source": {
        "collections": ["symbols", "pages", "products"]
      },
      "destination": {
        "collection": "tenant_abc123_popular_queries"
      },
      "params": {
        "limit": 1000,
        "source": {
          "events": [
            {
              "type": "search",
              "name": "search_queries",
              "weight": 1
            }
          ]
        },
        "destination": {
          "counter_field": "count"
        }
      }
    },
    {
      "name": "tenant_abc123_nohits_queries",
      "type": "nohits_queries",
      "source": {
        "collections": ["symbols", "pages", "products"]
      },
      "destination": {
        "collection": "tenant_abc123_nohits_queries"
      },
      "params": {
        "limit": 1000,
        "source": {
          "events": [
            {
              "type": "search",
              "name": "nohits_queries",
              "weight": 1
            }
          ]
        }
      }
    }
  ],
  "total": 2
}
```

### Examples

#### JavaScript

```javascript
async function getAnalyticsRules() {
  const response = await fetch('https://api.aacsearch.com/api/analytics/rules', {
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`
    }
  });

  return response.json();
}

const rules = await getAnalyticsRules();
console.log(`Found ${rules.total} analytics rules`);
```

---

## Analytics Events

### Search Event

Автоматически отслеживается при каждом поиске:

```json
{
  "type": "search",
  "query": "react hooks",
  "collection": "symbols",
  "results_count": 234,
  "search_time_ms": 12,
  "user_id": "user_123",
  "session_id": "session_456",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "timestamp": "2024-11-03T14:30:00Z"
}
```

### Click Event

Отслеживается при клике на результат:

```json
{
  "type": "click",
  "query": "react hooks",
  "document_id": "doc_001",
  "position": 1,
  "collection": "symbols",
  "user_id": "user_123",
  "session_id": "session_456",
  "timestamp": "2024-11-03T14:30:15Z"
}
```

### Conversion Event

Отслеживается при целевом действии:

```json
{
  "type": "conversion",
  "query": "react hooks",
  "document_id": "doc_001",
  "conversion_type": "purchase",
  "value": 99.99,
  "currency": "USD",
  "user_id": "user_123",
  "session_id": "session_456",
  "timestamp": "2024-11-03T14:35:00Z"
}
```

## Tracking Events from Client

### Track Click

```javascript
async function trackClick(query, documentId, position) {
  await fetch('https://api.aacsearch.com/api/analytics/events/click', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      document_id: documentId,
      position,
      collection: 'symbols'
    })
  });
}

// Track when user clicks a search result
searchResults.forEach((result, index) => {
  result.addEventListener('click', () => {
    trackClick(currentQuery, result.id, index);
  });
});
```

### Track Conversion

```javascript
async function trackConversion(query, documentId, conversionType, value) {
  await fetch('https://api.aacsearch.com/api/analytics/events/conversion', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      document_id: documentId,
      conversion_type: conversionType,
      value,
      currency: 'USD'
    })
  });
}

// Track when user makes a purchase
checkoutButton.addEventListener('click', () => {
  trackConversion(searchQuery, productId, 'purchase', 99.99);
});
```

## Analytics Dashboard Metrics

### Key Metrics

1. **Search Volume**
   - Total searches per day/week/month
   - Unique queries
   - Searches per user

2. **Query Performance**
   - Average results per query
   - Queries with no results (%)
   - Average search time (ms)

3. **User Engagement**
   - Click-through rate (CTR)
   - Average position of clicked results
   - Time to first click

4. **Conversion Metrics**
   - Conversion rate
   - Revenue per search
   - Top converting queries

### Example Dashboard Query

```javascript
async function getDashboardMetrics(startDate, endDate) {
  const [topQueries, noHits, volume] = await Promise.all([
    getTopQueries(10, startDate),
    getNoHitsQueries(5),
    getSearchVolume(startDate, endDate)
  ]);

  return {
    topQueries: topQueries.queries,
    noHitsCount: noHits.total,
    totalSearches: volume.total,
    avgCTR: calculateCTR(topQueries.queries),
    noHitsRate: (noHits.total / volume.total) * 100
  };
}
```

## Export Analytics Data

### Export to CSV

```javascript
async function exportAnalytics(format = 'csv', startDate, endDate) {
  const response = await fetch(
    `https://api.aacsearch.com/api/analytics/export?format=${format}&start_date=${startDate}&end_date=${endDate}`,
    {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`
      }
    }
  );

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `analytics_${startDate}_${endDate}.${format}`;
  a.click();
}

// Export last 30 days
const endDate = new Date().toISOString().split('T')[0];
const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
await exportAnalytics('csv', startDate, endDate);
```

## Best Practices

### 1. Privacy & GDPR Compliance

```javascript
// Always anonymize IP addresses
await enableAnalytics(['symbols'], {
  anonymize_ip: true,
  retention_days: 90 // Maximum retention per GDPR
});

// Exclude PII from tracking
const sanitizedQuery = query.replace(/\b[\w._%+-]+@[\w.-]+\.[A-Z]{2,}\b/gi, '[EMAIL]');
```

### 2. Performance Optimization

```javascript
// Batch analytics events
const eventQueue = [];

function queueEvent(event) {
  eventQueue.push(event);

  if (eventQueue.length >= 10) {
    flushEvents();
  }
}

async function flushEvents() {
  if (eventQueue.length === 0) return;

  await fetch('/api/analytics/events/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events: eventQueue })
  });

  eventQueue.length = 0;
}

// Flush on page unload
window.addEventListener('beforeunload', flushEvents);
```

### 3. Query Analysis

```javascript
async function analyzeQueries() {
  const [topQueries, noHits] = await Promise.all([
    getTopQueries(100),
    getNoHitsQueries(50)
  ]);

  // Find queries to optimize
  const lowCTRQueries = topQueries.queries.filter(q => q.click_through_rate < 0.3);

  // Suggest synonyms for no-hits queries
  const synonymSuggestions = noHits.queries.map(q => ({
    query: q.query,
    similar: findSimilarQueries(q.query, topQueries.queries)
  }));

  return { lowCTRQueries, synonymSuggestions };
}
```

## Rate Limits

| Plan | Requests/Minute | Data Retention |
|------|-----------------|----------------|
| Free | 10 | 7 days |
| Starter | 60 | 30 days |
| Professional | 300 | 90 days |
| Enterprise | Custom | Custom (up to 365 days) |

## Error Codes

### 403 Forbidden

```json
{
  "error": "Analytics not enabled",
  "message": "Enable analytics for your tenant first"
}
```

### 429 Too Many Requests

```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

## Дополнительные ресурсы

- [Analytics Dashboard Guide](/docs/guides/analytics-dashboard)
- [Search Optimization](/docs/guides/search-optimization)
- [Privacy & Compliance](/docs/compliance/privacy)
- [Typesense Analytics Documentation](https://typesense.org/docs/latest/api/analytics-query-suggestions.html)
