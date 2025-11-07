# API Поиска

Основной Search API предоставляет мощные возможности полнотекстового поиска с поддержкой фильтрации, сортировки, фасетов и продвинутых алгоритмов ранжирования.

## GET /api/search

Выполняет полнотекстовый поиск по коллекции с поддержкой всех возможностей Typesense.

### Аутентификация

**Требуется:** API Key или JWT токен

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

или

```http
X-API-Key: YOUR_API_KEY
```

### Query Parameters

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `q` | string | Да | Поисковый запрос. Используйте `*` для возврата всех документов |
| `query_by` | string | Да | Список полей для поиска через запятую (например, `title,keywords,description`) |
| `collection` | string | Нет | Название коллекции. По умолчанию: `symbols` |
| `per_page` | number | Нет | Количество результатов на странице (1-250). По умолчанию: `20` |
| `page` | number | Нет | Номер страницы (начинается с 1). По умолчанию: `1` |
| `filter_by` | string | Нет | Условия фильтрации (например, `status:=active && price:>100`) |
| `sort_by` | string | Нет | Поля для сортировки (например, `price:desc,created_at:asc`) |
| `facet_by` | string | Нет | Поля для фасетирования через запятую |
| `max_facet_values` | number | Нет | Максимум значений на фасет. По умолчанию: `10` |
| `query_by_weights` | string | Нет | Веса для полей поиска (например, `3,2,1`) |
| `prefix` | boolean/string | Нет | Поиск по префиксу: `true`, `false`, `multi` |
| `prioritize_exact_match` | boolean | Нет | Приоритет точных совпадений. По умолчанию: `true` |
| `prioritize_num_matching_fields` | boolean | Нет | Приоритет документов с большим числом совпадающих полей |
| `prioritize_token_position` | boolean | Нет | Приоритет совпадений в начале поля |
| `highlight_fields` | string | Нет | Поля для подсветки совпадений |
| `highlight_full_fields` | string | Нет | Поля для полной подсветки |
| `snippet_threshold` | number | Нет | Порог для создания сниппетов |
| `drop_tokens_threshold` | number | Нет | Порог для удаления токенов |
| `num_typos` | string/number | Нет | Допустимое количество опечаток: `0`, `1`, `2`, `auto` |
| `group_by` | string | Нет | Поле для группировки результатов |
| `group_limit` | number | Нет | Максимум документов в группе |
| `use_cache` | boolean | Нет | Использовать кэш запросов |
| `cache_ttl` | number | Нет | TTL кэша в секундах |
| `preset` | string | Нет | Название пресета поиска |

### Tenant Isolation

Все запросы автоматически фильтруются по tenant ID текущего пользователя. Это обеспечивает изоляцию данных между тенантами.

### Response (200 OK)

```json
{
  "found": 1234,
  "hits": [
    {
      "document": {
        "id": "symbol_001",
        "title": "React Component",
        "keywords": ["react", "component", "jsx"],
        "description": "A reusable React component for...",
        "category": "Frontend",
        "status": "active",
        "price": 99.99,
        "created_at": 1699564800,
        "tenant": "tenant_abc123"
      },
      "highlight": {
        "title": {
          "snippet": "<mark>React</mark> Component",
          "matched_tokens": ["React"]
        },
        "keywords": {
          "snippet": "<mark>react</mark>, component, jsx",
          "matched_tokens": ["react"]
        }
      },
      "text_match": 578947392,
      "text_match_info": {
        "best_field_score": "1108091339008",
        "best_field_weight": 15,
        "fields_matched": 3,
        "score": "578947392",
        "tokens_matched": 1
      }
    }
  ],
  "out_of": 1234,
  "page": 1,
  "request_params": {
    "collection_name": "symbols",
    "per_page": 20,
    "q": "react"
  },
  "search_time_ms": 12,
  "facet_counts": [
    {
      "field_name": "category",
      "counts": [
        {
          "count": 450,
          "highlighted": "<mark>Frontend</mark>",
          "value": "Frontend"
        },
        {
          "count": 320,
          "highlighted": "Backend",
          "value": "Backend"
        }
      ],
      "stats": {
        "total_values": 5
      }
    }
  ]
}
```

### Response Fields

| Поле | Тип | Описание |
|------|-----|----------|
| `found` | number | Общее количество найденных документов |
| `hits` | array | Массив результатов поиска |
| `hits[].document` | object | Оригинальный документ |
| `hits[].highlight` | object | Подсвеченные фрагменты |
| `hits[].text_match` | number | Оценка релевантности |
| `hits[].text_match_info` | object | Детали совпадения |
| `out_of` | number | Всего документов в коллекции |
| `page` | number | Текущая страница |
| `search_time_ms` | number | Время выполнения поиска в миллисекундах |
| `facet_counts` | array | Фасеты (если запрошены) |

### Error Responses

#### 401 Unauthorized

```json
{
  "error": "Unauthorized"
}
```

**Причина:** Отсутствует или невалидный токен аутентификации.

#### 403 Forbidden

```json
{
  "error": "No tenant access"
}
```

**Причина:** У пользователя нет доступа к тенанту.

#### 429 Too Many Requests

```json
{
  "error": "Rate limit exceeded",
  "limit": 100,
  "remaining": 0,
  "resetAt": 1699564800,
  "retryAfter": 60
}
```

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1699564800
Retry-After: 60
```

**Причина:** Превышен лимит запросов (rate limit).

#### 429 Usage Limit Exceeded

```json
{
  "error": "Usage limit exceeded",
  "reason": "Subscription limit reached",
  "usage": 10000,
  "limit": 10000,
  "remaining": 0
}
```

**Причина:** Превышен месячный лимит поисков по подписке.

#### 500 Internal Server Error

```json
{
  "error": "Search failed",
  "message": "Collection not found: symbols"
}
```

**Причина:** Внутренняя ошибка сервера или проблема с Typesense.

## Примеры использования

### cURL

#### Базовый поиск

```bash
curl -X GET "https://api.aacsearch.com/api/search?q=react&query_by=title,keywords&collection=symbols&per_page=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Поиск с фильтрацией

```bash
curl -X GET "https://api.aacsearch.com/api/search?q=react&query_by=title,keywords&filter_by=status:=active%20%26%26%20price:>50&sort_by=price:desc" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Поиск с фасетами

```bash
curl -X GET "https://api.aacsearch.com/api/search?q=*&query_by=title&facet_by=category,status&max_facet_values=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### JavaScript (Fetch API)

```javascript
// Базовый поиск
async function searchSymbols(query) {
  const params = new URLSearchParams({
    q: query,
    query_by: 'title,keywords,description',
    collection: 'symbols',
    per_page: '20',
    page: '1'
  });

  const response = await fetch(`https://api.aacsearch.com/api/search?${params}`, {
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`
    }
  });

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

// Использование
try {
  const results = await searchSymbols('react component');
  console.log(`Found ${results.found} results`);
  results.hits.forEach(hit => {
    console.log(hit.document.title);
  });
} catch (error) {
  console.error('Search error:', error);
}
```

### JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.aacsearch.com',
  headers: {
    'Authorization': `Bearer ${JWT_TOKEN}`
  }
});

// Поиск с фильтрацией и сортировкой
async function advancedSearch(options) {
  try {
    const response = await api.get('/api/search', {
      params: {
        q: options.query || '*',
        query_by: options.queryBy || 'title,keywords',
        collection: options.collection || 'symbols',
        filter_by: options.filterBy,
        sort_by: options.sortBy,
        per_page: options.perPage || 20,
        page: options.page || 1,
        facet_by: options.facetBy,
        highlight_fields: options.highlightFields
      }
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      // Обработка различных ошибок
      if (error.response.status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        console.error(`Rate limited. Retry after ${retryAfter}s`);
      } else {
        console.error('Search error:', error.response.data);
      }
    }
    throw error;
  }
}

// Использование
const results = await advancedSearch({
  query: 'react',
  queryBy: 'title,keywords,description',
  filterBy: 'status:=active && category:=Frontend',
  sortBy: 'created_at:desc',
  perPage: 50,
  facetBy: 'category,status',
  highlightFields: 'title,description'
});
```

### TypeScript

```typescript
interface SearchParams {
  q: string;
  query_by: string;
  collection?: string;
  per_page?: number;
  page?: number;
  filter_by?: string;
  sort_by?: string;
  facet_by?: string;
  query_by_weights?: string;
  prefix?: boolean | 'multi';
  prioritize_exact_match?: boolean;
  highlight_fields?: string;
}

interface SearchHit {
  document: Record<string, any>;
  highlight?: Record<string, {
    snippet: string;
    matched_tokens: string[];
  }>;
  text_match: number;
  text_match_info: {
    best_field_score: string;
    best_field_weight: number;
    fields_matched: number;
    score: string;
    tokens_matched: number;
  };
}

interface SearchResponse {
  found: number;
  hits: SearchHit[];
  out_of: number;
  page: number;
  search_time_ms: number;
  facet_counts?: Array<{
    field_name: string;
    counts: Array<{
      count: number;
      value: string;
      highlighted: string;
    }>;
    stats: {
      total_values: number;
    };
  }>;
}

async function search(params: SearchParams): Promise<SearchResponse> {
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString();

  const response = await fetch(
    `https://api.aacsearch.com/api/search?${queryString}`,
    {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }

  return response.json();
}

// Использование с type safety
const results = await search({
  q: 'react hooks',
  query_by: 'title,keywords,description',
  query_by_weights: '3,2,1',
  filter_by: 'status:=active',
  sort_by: 'created_at:desc',
  per_page: 20,
  prefix: true,
  prioritize_exact_match: true,
  highlight_fields: 'title,description'
});
```

### Python (requests)

```python
import requests
from typing import Dict, List, Optional

class SearchClient:
    def __init__(self, api_url: str, token: str):
        self.api_url = api_url
        self.headers = {
            'Authorization': f'Bearer {token}'
        }

    def search(
        self,
        query: str,
        query_by: str,
        collection: str = 'symbols',
        per_page: int = 20,
        page: int = 1,
        filter_by: Optional[str] = None,
        sort_by: Optional[str] = None,
        facet_by: Optional[str] = None,
        **kwargs
    ) -> Dict:
        """
        Выполняет поиск в коллекции

        Args:
            query: Поисковый запрос
            query_by: Поля для поиска (через запятую)
            collection: Название коллекции
            per_page: Результатов на странице
            page: Номер страницы
            filter_by: Условия фильтрации
            sort_by: Поля сортировки
            facet_by: Поля фасетирования
            **kwargs: Дополнительные параметры

        Returns:
            Dict с результатами поиска
        """
        params = {
            'q': query,
            'query_by': query_by,
            'collection': collection,
            'per_page': per_page,
            'page': page
        }

        # Добавляем опциональные параметры
        if filter_by:
            params['filter_by'] = filter_by
        if sort_by:
            params['sort_by'] = sort_by
        if facet_by:
            params['facet_by'] = facet_by

        # Добавляем дополнительные параметры
        params.update(kwargs)

        try:
            response = requests.get(
                f'{self.api_url}/api/search',
                params=params,
                headers=self.headers,
                timeout=30
            )
            response.raise_for_status()
            return response.json()

        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                # Обработка rate limit
                retry_after = e.response.headers.get('Retry-After')
                raise Exception(f'Rate limited. Retry after {retry_after}s')
            else:
                raise Exception(f'Search failed: {e.response.text}')

        except requests.exceptions.RequestException as e:
            raise Exception(f'Request failed: {str(e)}')

# Использование
client = SearchClient('https://api.aacsearch.com', 'YOUR_JWT_TOKEN')

# Базовый поиск
results = client.search(
    query='react',
    query_by='title,keywords,description'
)

print(f"Найдено: {results['found']} документов")
for hit in results['hits']:
    print(f"- {hit['document']['title']}")

# Продвинутый поиск
advanced_results = client.search(
    query='react component',
    query_by='title,keywords,description',
    query_by_weights='3,2,1',
    filter_by='status:=active && category:=Frontend',
    sort_by='created_at:desc',
    per_page=50,
    page=1,
    facet_by='category,status',
    highlight_fields='title,description',
    prefix=True,
    prioritize_exact_match=True
)
```

### PHP

```php
<?php

class SearchClient {
    private $apiUrl;
    private $token;

    public function __construct($apiUrl, $token) {
        $this->apiUrl = $apiUrl;
        $this->token = $token;
    }

    public function search($params) {
        $queryString = http_build_query($params);
        $url = $this->apiUrl . '/api/search?' . $queryString;

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $this->token
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if (curl_errno($ch)) {
            throw new Exception('Curl error: ' . curl_error($ch));
        }

        curl_close($ch);

        $data = json_decode($response, true);

        if ($httpCode !== 200) {
            if ($httpCode === 429) {
                throw new Exception('Rate limit exceeded');
            }
            throw new Exception('Search failed: ' . ($data['error'] ?? 'Unknown error'));
        }

        return $data;
    }
}

// Использование
$client = new SearchClient('https://api.aacsearch.com', 'YOUR_JWT_TOKEN');

// Базовый поиск
$results = $client->search([
    'q' => 'react',
    'query_by' => 'title,keywords,description',
    'collection' => 'symbols',
    'per_page' => 20
]);

echo "Найдено: " . $results['found'] . " документов\n";
foreach ($results['hits'] as $hit) {
    echo "- " . $hit['document']['title'] . "\n";
}

// Продвинутый поиск с фильтрацией
$advancedResults = $client->search([
    'q' => 'react component',
    'query_by' => 'title,keywords,description',
    'query_by_weights' => '3,2,1',
    'filter_by' => 'status:=active && category:=Frontend',
    'sort_by' => 'created_at:desc',
    'per_page' => 50,
    'page' => 1,
    'facet_by' => 'category,status',
    'highlight_fields' => 'title,description',
    'prefix' => 'true',
    'prioritize_exact_match' => 'true'
]);

?>
```

## Продвинутые параметры

### Query By Weights

Укажите веса для каждого поля поиска, чтобы контролировать их влияние на релевантность:

```
query_by=title,keywords,description
query_by_weights=3,2,1
```

Поле `title` будет иметь вес 3, `keywords` - вес 2, `description` - вес 1.

### Prefix Search

Управление поиском по префиксу:

- `prefix=true` - включить поиск по префиксу (по умолчанию)
- `prefix=false` - отключить поиск по префиксу
- `prefix=multi` - поиск по префиксу для всех токенов

```bash
# Найдет "react", "reactive", "reaction"
?q=reac&prefix=true

# Найдет только точное совпадение "reac"
?q=reac&prefix=false
```

### Typo Tolerance

Контроль допустимых опечаток:

```bash
# Автоматическое определение (рекомендуется)
?q=reakt&num_typos=auto

# Без допуска опечаток
?q=react&num_typos=0

# До 1 опечатки
?q=reakt&num_typos=1

# До 2 опечаток
?q=raect&num_typos=2
```

### Filtering

Мощная система фильтрации с поддержкой операторов:

**Операторы сравнения:**
- `:=` - равно
- `:!=` - не равно
- `:>` - больше
- `:>=` - больше или равно
- `:<` - меньше
- `:<=` - меньше или равно

**Логические операторы:**
- `&&` - AND
- `||` - OR

**Примеры:**

```bash
# Простая фильтрация
?filter_by=status:=active

# Множественные условия (AND)
?filter_by=status:=active && price:>50

# OR условие
?filter_by=category:=Frontend || category:=Backend

# Диапазон значений
?filter_by=price:>=10 && price:<=100

# Проверка на существование
?filter_by=tags:!=[]

# Фильтрация по массиву
?filter_by=tags:=[react,vue]

# Комбинированная фильтрация
?filter_by=(category:=Frontend || category:=Mobile) && status:=active && price:>0
```

### Sorting

Сортировка по одному или нескольким полям:

```bash
# По одному полю (убывание)
?sort_by=created_at:desc

# По нескольким полям
?sort_by=price:desc,created_at:asc

# Сортировка по релевантности (по умолчанию)
?sort_by=_text_match:desc

# Сортировка по геолокации (для гео-поиска)
?sort_by=location(40.7128,-74.0060):asc
```

### Faceting

Фасеты позволяют получить агрегированную статистику по полям:

```bash
# Фасеты по категориям и статусам
?q=*&facet_by=category,status&max_facet_values=10

# Результат:
{
  "facet_counts": [
    {
      "field_name": "category",
      "counts": [
        {"value": "Frontend", "count": 450},
        {"value": "Backend", "count": 320},
        {"value": "Mobile", "count": 180}
      ],
      "stats": {"total_values": 3}
    },
    {
      "field_name": "status",
      "counts": [
        {"value": "active", "count": 890},
        {"value": "draft", "count": 60}
      ],
      "stats": {"total_values": 2}
    }
  ]
}
```

### Grouping

Группировка результатов по полю:

```bash
# Группировка по категориям
?q=react&group_by=category&group_limit=3

# Результат:
{
  "grouped_hits": [
    {
      "group_key": ["Frontend"],
      "hits": [/* максимум 3 документа */]
    },
    {
      "group_key": ["Mobile"],
      "hits": [/* максимум 3 документа */]
    }
  ]
}
```

### Highlighting

Подсветка совпадений в результатах:

```bash
# Базовая подсветка
?q=react&highlight_fields=title,description

# Полная подсветка (без сниппетов)
?q=react&highlight_full_fields=title

# Настройка сниппетов
?q=react&highlight_fields=description&snippet_threshold=30

# Результат:
{
  "highlight": {
    "title": {
      "snippet": "<mark>React</mark> Component Library",
      "matched_tokens": ["React"]
    },
    "description": {
      "snippet": "A powerful <mark>React</mark> library for...",
      "matched_tokens": ["React"]
    }
  }
}
```

## Rate Limits

Все поисковые запросы подчиняются rate limits в зависимости от плана подписки:

| План | Requests/Minute | Requests/Hour |
|------|-----------------|---------------|
| Free | 10 | 100 |
| Starter | 60 | 1,000 |
| Professional | 300 | 10,000 |
| Enterprise | Custom | Custom |

При превышении лимита возвращается код 429 с заголовками:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1699564860
Retry-After: 60
```

## Usage Tracking

Каждый поисковый запрос учитывается в месячном лимите использования:

| План | Searches/Month |
|------|----------------|
| Free | 1,000 |
| Starter | 10,000 |
| Professional | 100,000 |
| Enterprise | Unlimited |

## Presets (Пресеты поиска)

Вы можете создавать именованные пресеты с предустановленными параметрами поиска:

```bash
# Использование пресета
?q=react&preset=frontend_search

# Пресет может содержать:
# - query_by
# - query_by_weights
# - filter_by
# - sort_by
# - facet_by
# - и другие параметры

# Параметры в URL переопределяют пресет
```

## Best Practices

### 1. Оптимизация Query By

Указывайте только необходимые поля для поиска:

```bash
# Плохо (медленно)
?query_by=title,description,content,metadata,tags,categories,author

# Хорошо (быстро)
?query_by=title,keywords
```

### 2. Использование весов

Используйте веса для контроля релевантности:

```bash
# Приоритет заголовку
?query_by=title,description,keywords&query_by_weights=5,2,1
```

### 3. Пагинация

Используйте разумные значения `per_page`:

```bash
# Оптимально для веб-интерфейса
?per_page=20

# Для мобильных приложений
?per_page=10

# Для экспорта (не рекомендуется для больших объемов)
?per_page=250
```

### 4. Кэширование

Включайте кэш для часто выполняемых запросов:

```bash
?q=popular query&use_cache=true&cache_ttl=300
```

### 5. Обработка ошибок

Всегда обрабатывайте rate limits и ошибки:

```javascript
async function searchWithRetry(params, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await search(params);
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        const retryAfter = parseInt(error.headers['retry-after']) || 60;
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      }
      throw error;
    }
  }
}
```

## Use Cases

### 1. Простой поиск по сайту

```javascript
// Поиск по заголовкам и описаниям
const results = await search({
  q: userInput,
  query_by: 'title,description',
  per_page: 10,
  highlight_fields: 'title,description'
});
```

### 2. Каталог товаров с фильтрами

```javascript
// E-commerce поиск
const products = await search({
  q: searchQuery || '*',
  query_by: 'name,description,brand',
  filter_by: `price:>=${minPrice} && price:<=${maxPrice} && in_stock:=true`,
  sort_by: sortOption, // 'price:asc' или 'created_at:desc'
  facet_by: 'category,brand,color',
  per_page: 24
});
```

### 3. Автодополнение

```javascript
// Быстрое автодополнение с prefix search
const suggestions = await search({
  q: partialQuery,
  query_by: 'title',
  prefix: true,
  per_page: 5,
  drop_tokens_threshold: 0
});
```

### 4. Поиск с геолокацией

```javascript
// Поиск ближайших мест
const places = await search({
  q: query,
  query_by: 'name,description',
  filter_by: `location:(${lat},${lon},10 km)`,
  sort_by: `location(${lat},${lon}):asc`,
  per_page: 20
});
```

### 5. Многоязычный поиск

```javascript
// Поиск с учетом языка
const results = await search({
  q: query,
  query_by: `title_${locale},description_${locale}`,
  filter_by: `language:=${locale}`,
  per_page: 20
});
```

## Troubleshooting

### Медленные запросы

1. Уменьшите количество полей в `query_by`
2. Используйте более строгие фильтры
3. Уменьшите `per_page`
4. Включите кэширование

### Нерелевантные результаты

1. Настройте `query_by_weights`
2. Включите `prioritize_exact_match`
3. Отрегулируйте `num_typos`
4. Используйте более специфичные поля в `query_by`

### Нет результатов

1. Проверьте `filter_by` условия
2. Увеличьте `num_typos`
3. Измените `prefix` на `true` или `multi`
4. Проверьте tenant isolation

## Дополнительные ресурсы

- [Официальная документация Typesense](https://typesense.org/docs/)
- [Multi-Search API](/docs/api-reference/multi-search)
- [Advanced Search](/docs/api-reference/advanced-search)
- [Presets Management](/docs/guides/search-presets)
