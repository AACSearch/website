# Возможности платформы AACSearch

## Содержание

- [Возможности платформы AACSearch](#возможности-платформы-aacsearch)
  - [Содержание](#содержание)
  - [1. Поисковые возможности](#1-поисковые-возможности)
    - [1.1. Полнотекстовый поиск](#11-полнотекстовый-поиск)
    - [1.2. Векторный и семантический поиск](#12-векторный-и-семантический-поиск)
    - [1.3. Natural Language Search (NL Search)](#13-natural-language-search-nl-search)
    - [1.4. Conversational Search (RAG)](#14-conversational-search-rag)
    - [1.5. Image Search (CLIP)](#15-image-search-clip)
    - [1.6. Geo Search (Географический поиск)](#16-geo-search-географический-поиск)
  - [2. Интеграции с внешними системами](#2-интеграции-с-внешними-системами)
    - [2.1. E-commerce платформы](#21-e-commerce-платформы)
    - [2.2. CMS платформы](#22-cms-платформы)
    - [2.3. Headless CMS](#23-headless-cms)
    - [2.4. Пользовательские интеграции](#24-пользовательские-интеграции)
  - [3. Аналитика и мониторинг](#3-аналитика-и-мониторинг)
    - [3.1. Поисковая аналитика](#31-поисковая-аналитика)
    - [3.2. Аналитика без результатов (No-Hits)](#32-аналитика-без-результатов-no-hits)
    - [3.3. Click Tracking](#33-click-tracking)
    - [3.4. A/B тестирование](#34-ab-тестирование)
  - [4. Merchandising и управление результатами](#4-merchandising-и-управление-результатами)
    - [4.1. Синонимы](#41-синонимы)
    - [4.2. Overrides (Переопределения)](#42-overrides-переопределения)
    - [4.3. Закрепление результатов (Pinning)](#43-закрепление-результатов-pinning)
    - [4.4. Исключение результатов (Exclusions)](#44-исключение-результатов-exclusions)
    - [4.5. Динамические правила](#45-динамические-правила)
  - [5. Биллинг и монетизация](#5-биллинг-и-монетизация)
    - [5.1. Интеграция с Stripe](#51-интеграция-с-stripe)
    - [5.2. Планы и тарифы](#52-планы-и-тарифы)
    - [5.3. Отслеживание использования](#53-отслеживание-использования)
    - [5.4. Управление подписками](#54-управление-подписками)
  - [6. API и безопасность](#6-api-и-безопасность)
    - [6.1. API ключи](#61-api-ключи)
    - [6.2. Scoped Keys (Ограниченные ключи)](#62-scoped-keys-ограниченные-ключи)
    - [6.3. Rate Limiting](#63-rate-limiting)
    - [6.4. Аутентификация и авторизация](#64-аутентификация-и-авторизация)
  - [7. Multi-tenancy](#7-multi-tenancy)
    - [7.1. Изоляция данных](#71-изоляция-данных)
    - [7.2. Настройки на уровне тенанта](#72-настройки-на-уровне-тенанта)
    - [7.3. Управление пользователями](#73-управление-пользователями)
  - [8. Автоматизация и задачи](#8-автоматизация-и-задачи)
    - [8.1. Scheduled Jobs](#81-scheduled-jobs)
    - [8.2. Webhooks](#82-webhooks)
    - [8.3. Автоматическая синхронизация](#83-автоматическая-синхронизация)
  - [9. Производительность и масштабирование](#9-производительность-и-масштабирование)
    - [9.1. Кэширование (Redis)](#91-кэширование-redis)
    - [9.2. Индексация](#92-индексация)
    - [9.3. Zero-Downtime Reindex](#93-zero-downtime-reindex)
  - [10. Соответствие требованиям (Compliance)](#10-соответствие-требованиям-compliance)
    - [10.1. GDPR](#101-gdpr)
    - [10.2. Безопасность данных](#102-безопасность-данных)
    - [10.3. Аудит и логирование](#103-аудит-и-логирование)

---

## 1. Поисковые возможности

### 1.1. Полнотекстовый поиск

AACSearch предоставляет мощные возможности полнотекстового поиска с поддержкой продвинутых функций:

#### Typo Tolerance (Толерантность к опечаткам)

Автоматическое исправление опечаток в поисковых запросах:

```javascript
// JavaScript SDK
const results = await client.collections('products').documents().search({
  q: 'ipone',  // Опечатка в слове "iPhone"
  query_by: 'title,description',
  typo_tolerance: 'enabled',  // Автоматическое исправление
  num_typos: 2  // Максимум 2 опечатки
});

// Результат: найдены документы с "iPhone"
```

**Возможности:**
- Автоматическое определение и исправление опечаток
- Настраиваемое количество допустимых опечаток (0-2)
- Поддержка различных языков
- Префиксный поиск для незавершенных слов

#### Stemming (Стемминг)

Поиск по корням слов для улучшения релевантности:

```python
# Python SDK
search_params = {
    'q': 'running',
    'query_by': 'title,description',
    'stem_enabled': True,  # Включить стемминг
    'stem_language': 'en'  # Язык стемминга
}

# Найдет: "run", "running", "runs", "runner" и т.д.
results = client.collections['products'].documents.search(search_params)
```

**Поддерживаемые языки:**
- Английский (en)
- Русский (ru)
- Немецкий (de)
- Французский (fr)
- Испанский (es)
- Итальянский (it)
- Португальский (pt)
- И многие другие (30+ языков)

#### Синонимы

Расширение поисковых запросов с помощью синонимов:

```javascript
// Multi-way синонимы (двунаправленные)
{
  "name": "smartphone-synonyms",
  "synonyms": ["smartphone", "mobile", "phone", "cellphone"],
  "synonym_type": "multi-way"
}

// One-way синонимы (однонаправленные)
{
  "name": "sneakers-synonyms",
  "root": "sneakers",
  "synonyms": ["shoes", "footwear", "kicks"],
  "synonym_type": "one-way"
}
```

#### Фасетный поиск (Faceted Search)

Фильтрация результатов по категориям и атрибутам:

```javascript
const results = await client.collections('products').documents().search({
  q: 'laptop',
  query_by: 'title',
  facet_by: 'brand,category,price_range',
  filter_by: 'price:[500..1500] && brand:=[Dell,HP]',
  max_facet_values: 20
});

// Результат содержит:
// - facet_counts: количество товаров по каждой категории
// - hits: найденные документы
```

#### Ranking и Relevance

Настраиваемые алгоритмы ранжирования:

```javascript
{
  query_by: 'title,description,keywords',
  query_by_weights: '3,2,1',  // Веса полей
  sort_by: '_text_match:desc,sales:desc,created_at:desc',
  text_match_type: 'max_score',  // 'max_score' или 'max_weight'
  prefix: true,  // Префиксный поиск
  infix: 'fallback'  // Инфиксный поиск как fallback
}
```

### 1.2. Векторный и семантический поиск

Поиск по смыслу с использованием векторных представлений (embeddings):

#### Автоматическое создание embeddings

```javascript
// Настройка коллекции с векторным поиском
{
  "name": "products",
  "fields": [
    {"name": "title", "type": "string"},
    {"name": "description", "type": "string"},
    {
      "name": "embedding",
      "type": "float[]",
      "embed": {
        "from": ["title", "description"],
        "model_config": {
          "model_name": "ts/all-MiniLM-L12-v2",
          "api_key": "your-api-key"
        }
      }
    }
  ]
}
```

#### Векторный поиск

```python
# Поиск по векторам
search_params = {
    'q': 'wireless headphones with noise cancellation',
    'query_by': 'embedding',
    'vector_query': 'embedding:([], k:100)',
    'exclude_fields': 'embedding'  # Не возвращать векторы
}

results = client.collections['products'].documents.search(search_params)
```

#### Гибридный поиск (Hybrid Search)

Комбинация полнотекстового и векторного поиска:

```javascript
{
  q: 'laptop for gaming',
  query_by: 'title,description,embedding',
  vector_query: 'embedding:([], k:100, alpha: 0.5)',
  // alpha: 0.5 = 50% векторный + 50% текстовый поиск
  // alpha: 1.0 = 100% векторный поиск
  // alpha: 0.0 = 100% текстовый поиск
}
```

**Поддерживаемые модели embeddings:**
- OpenAI Ada-002
- Sentence Transformers (all-MiniLM-L12-v2)
- E5 Models
- BGE Models
- Custom ONNX Models

### 1.3. Natural Language Search (NL Search)

Поиск на естественном языке с автоматическим парсингом:

```javascript
// Endpoint: POST /api/search/nl
const response = await fetch('/api/search/nl', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    q: 'Show me red sneakers under $100 from Nike',
    collection: 'products',
    nl_model_id: 'openai/gpt-4',
    nl_query_debug: true  // Показать, как был разобран запрос
  })
});

const data = await response.json();

// Результат:
{
  "results": [...],
  "found": 42,
  "parsed_nl_query": {
    "extracted_filters": {
      "color": "red",
      "brand": "Nike",
      "price_max": 100
    },
    "refined_query": "sneakers"
  },
  "original_query": "Show me red sneakers under $100 from Nike"
}
```

**Возможности NL Search:**
- Автоматическое извлечение фильтров из текста
- Понимание временных запросов ("last week", "this month")
- Поддержка числовых диапазонов ("under $100", "between 10 and 20")
- Распознавание намерений пользователя
- Многоязычность

### 1.4. Conversational Search (RAG)

Контекстуальный диалоговый поиск с использованием RAG (Retrieval-Augmented Generation):

```javascript
// Endpoint: POST /api/search/conversational
const response = await fetch('/api/search/conversational', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    q: 'What are the best laptops for video editing?',
    collection: 'products',
    conversation_model_id: 'openai/gpt-4',
    conversation_id: 'user-123-session-456',  // Для сохранения контекста
    conversation_stream: false
  })
});

const data = await response.json();

// Результат:
{
  "conversation": {
    "answer": "Based on your needs for video editing, I recommend the following laptops:\n\n1. Dell XPS 15 - Features a powerful Intel i9 processor and NVIDIA RTX 4060, perfect for intensive video rendering...",
    "conversation_id": "user-123-session-456",
    "conversation_history": [
      {
        "role": "user",
        "content": "What are the best laptops for video editing?"
      },
      {
        "role": "assistant",
        "content": "Based on your needs..."
      }
    ]
  },
  "results": [...]  // Релевантные документы
}
```

#### Streaming Response

```javascript
// Streaming для real-time ответов
const response = await fetch('/api/search/conversational', {
  method: 'POST',
  body: JSON.stringify({
    q: 'Explain the differences between these GPUs',
    conversation_stream: true
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const {done, value} = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));

      if (data.type === 'chunk') {
        console.log(data.content);  // Выводим по мере получения
      } else if (data.type === 'metadata') {
        console.log('Conversation ID:', data.conversation_id);
      }
    }
  }
}
```

**Возможности Conversational Search:**
- Сохранение контекста диалога между запросами
- Streaming ответов для лучшего UX
- Настраиваемые промпты для разных сценариев
- Поддержка различных LLM (GPT-4, Claude, Llama)
- Автоматическое извлечение релевантных фактов из документов

### 1.5. Image Search (CLIP)

Поиск по изображениям и текстовым описаниям с использованием CLIP:

```javascript
// Настройка коллекции с image search
{
  "name": "products",
  "fields": [
    {"name": "title", "type": "string"},
    {"name": "image_url", "type": "string"},
    {
      "name": "image_embedding",
      "type": "float[]",
      "embed": {
        "from": ["image_url"],
        "model_config": {
          "model_name": "openai/clip-vit-base-patch32"
        }
      }
    }
  ]
}

// Поиск по текстовому описанию
const results = await client.collections('products').documents().search({
  q: 'red leather sofa',
  query_by: 'image_embedding',
  vector_query: 'image_embedding:([], k:50)',
  exclude_fields: 'image_embedding'
});

// Поиск по изображению (image-to-image)
const imageEmbedding = await generateImageEmbedding('/path/to/image.jpg');
const results = await client.collections('products').documents().search({
  q: '*',
  vector_query: `image_embedding:([${imageEmbedding.join(',')}], k:50)`
});
```

**Сценарии использования:**
- Поиск похожих товаров по фото
- Visual search в e-commerce
- Поиск по описанию изображения
- Reverse image search
- Модерация контента

### 1.6. Geo Search (Географический поиск)

Поиск с учетом географических координат:

```javascript
// Настройка коллекции с geo полями
{
  "name": "stores",
  "fields": [
    {"name": "name", "type": "string"},
    {"name": "location", "type": "geopoint"}  // [lat, lng]
  ]
}

// Поиск в радиусе (proximity search)
const results = await client.collections('stores').documents().search({
  q: 'coffee shop',
  query_by: 'name',
  filter_by: 'location:(37.7749, -122.4194, 5 km)',  // 5 км от SF
  sort_by: 'location(37.7749, -122.4194):asc'  // Сортировка по близости
});

// Поиск в полигоне (polygon search)
const polygon = '37.7,-122.5,37.8,-122.5,37.8,-122.4,37.7,-122.4';
const results = await client.collections('stores').documents().search({
  q: '*',
  filter_by: `location:(${polygon})`
});
```

**Возможности Geo Search:**
- Radius search (поиск в радиусе)
- Polygon search (поиск в полигоне)
- Bounding box search (поиск в прямоугольнике)
- Distance sorting (сортировка по расстоянию)
- Multi-location support (множественные локации)

---

## 2. Интеграции с внешними системами

AACSearch поддерживает широкий набор готовых интеграций для синхронизации данных из популярных платформ.

### 2.1. E-commerce платформы

#### Shopify

```javascript
// Настройка интеграции Shopify
{
  "provider": "shopify",
  "name": "My Shopify Store",
  "credentials": {
    "shop_domain": "mystore.myshopify.com",
    "access_token": "shpat_xxxxx",
    "api_version": "2024-01"
  },
  "settings": {
    "syncFrequency": 15,  // Минуты
    "collections": ["products", "collections", "orders"],
    "webhookUrl": "https://api.aacsearch.com/webhooks/shopify/tenant-123"
  }
}
```

**Синхронизируемые данные:**
- Products (товары)
- Collections (коллекции)
- Variants (варианты)
- Inventory (остатки)
- Prices (цены)
- Метаданные и теги

#### WooCommerce

```php
// WordPress Plugin для WooCommerce
add_action('woocommerce_product_updated', function($product_id) {
    $product = wc_get_product($product_id);

    // Отправка в AACSearch
    $response = wp_remote_post('https://api.aacsearch.com/api/sync', [
        'headers' => [
            'Authorization' => 'Bearer ' . AACSEARCH_API_KEY
        ],
        'body' => json_encode([
            'action' => 'upsert',
            'collection' => 'products',
            'document' => [
                'id' => $product->get_id(),
                'title' => $product->get_name(),
                'description' => $product->get_description(),
                'price' => $product->get_price(),
                'sku' => $product->get_sku(),
                'stock' => $product->get_stock_quantity(),
                'categories' => wp_get_post_terms($product_id, 'product_cat', ['fields' => 'names'])
            ]
        ])
    ]);
});
```

#### Magento

```php
// Magento 2 Module
namespace AACSearch\Integration\Observer;

use Magento\Framework\Event\ObserverInterface;

class ProductSaveObserver implements ObserverInterface
{
    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        $product = $observer->getEvent()->getProduct();

        $this->syncService->syncProduct([
            'id' => $product->getId(),
            'sku' => $product->getSku(),
            'name' => $product->getName(),
            'price' => $product->getPrice(),
            'stock' => $product->getQty(),
            'attributes' => $this->getProductAttributes($product)
        ]);
    }
}
```

### 2.2. CMS платформы

#### WordPress

```javascript
// REST API интеграция WordPress
{
  "provider": "wordpress",
  "name": "My Blog",
  "credentials": {
    "site_url": "https://myblog.com",
    "username": "admin",
    "application_password": "xxxx xxxx xxxx xxxx"
  },
  "settings": {
    "syncFrequency": 30,
    "collections": ["posts", "pages", "media"],
    "fieldMapping": {
      "post_title": "title",
      "post_content": "content",
      "post_excerpt": "excerpt",
      "post_date": "publishedAt"
    }
  }
}
```

#### Ghost

```javascript
// Ghost CMS Integration
const GhostContentAPI = require('@tryghost/content-api');

const api = new GhostContentAPI({
  url: 'https://myblog.ghost.io',
  key: 'your-content-api-key',
  version: 'v5.0'
});

// Синхронизация постов
const posts = await api.posts.browse({
  limit: 'all',
  include: 'tags,authors'
});

for (const post of posts) {
  await aacSearchClient.collections('posts').documents().upsert({
    id: post.id,
    title: post.title,
    content: post.html,
    excerpt: post.excerpt,
    tags: post.tags.map(t => t.name),
    authors: post.authors.map(a => a.name),
    publishedAt: post.published_at
  });
}
```

### 2.3. Headless CMS

#### Contentful

```javascript
// Contentful Webhook Handler
app.post('/webhooks/contentful', async (req, res) => {
  const {sys, fields} = req.body;

  // Определяем действие
  const action = sys.type === 'DeletedEntry' ? 'delete' : 'upsert';

  if (action === 'upsert') {
    await aacSearchClient.collections('content').documents().upsert({
      id: sys.id,
      title: fields.title['en-US'],
      content: fields.content['en-US'],
      contentType: sys.contentType.sys.id,
      updatedAt: sys.updatedAt
    });
  } else {
    await aacSearchClient.collections('content').documents(sys.id).delete();
  }

  res.status(200).send('OK');
});
```

#### Sanity

```javascript
// Sanity Webhook Integration
export const config = {
  dataset: 'production',
  projectId: 'your-project-id',
  webhooks: {
    onCreate: async (document) => {
      await syncToAACSearch(document, 'create');
    },
    onUpdate: async (document) => {
      await syncToAACSearch(document, 'update');
    },
    onDelete: async (documentId) => {
      await aacSearchClient.collections('content')
        .documents(documentId)
        .delete();
    }
  }
};
```

#### Strapi

```javascript
// Strapi Lifecycle Hook
module.exports = {
  async afterCreate(event) {
    const {result} = event;

    await fetch('https://api.aacsearch.com/api/sync', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AACSEARCH_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'upsert',
        collection: 'articles',
        document: {
          id: result.id,
          title: result.title,
          content: result.content,
          author: result.author?.name,
          publishedAt: result.publishedAt
        }
      })
    });
  }
};
```

#### Webflow

```javascript
// Webflow CMS Integration via API
const webflow = new Webflow({token: 'your-api-token'});

// Получение коллекций
const collections = await webflow.collections({siteId: 'site-id'});

for (const collection of collections) {
  const items = await webflow.items({collectionId: collection._id});

  for (const item of items.items) {
    await aacSearchClient.collections('cms_items').documents().upsert({
      id: item._id,
      name: item.name,
      slug: item.slug,
      ...item.fields  // Динамические поля
    });
  }
}
```

### 2.4. Пользовательские интеграции

#### Custom API Integration

```javascript
// Пользовательский коннектор
class CustomConnector {
  constructor(config) {
    this.apiUrl = config.apiUrl;
    this.apiKey = config.apiKey;
  }

  async sync() {
    // Получение данных из внешнего API
    const response = await fetch(`${this.apiUrl}/data`, {
      headers: {'X-API-Key': this.apiKey}
    });

    const data = await response.json();

    // Нормализация данных
    const documents = data.map(item => ({
      id: item.id,
      title: item.name,
      description: item.desc,
      metadata: {
        source: 'custom_api',
        imported_at: new Date().toISOString()
      }
    }));

    // Bulk import в AACSearch
    await aacSearchClient.collections('custom_data')
      .documents()
      .import(documents, {action: 'upsert'});
  }
}
```

---

## 3. Аналитика и мониторинг

### 3.1. Поисковая аналитика

AACSearch автоматически собирает детальную аналитику по всем поисковым запросам:

```javascript
// Получение аналитики за период
const analytics = await payload.find({
  collection: 'search_analytics',
  where: {
    tenant: {equals: 'tenant-123'},
    periodStart: {greater_than_equal: '2024-01-01'},
    periodEnd: {less_than_equal: '2024-01-31'}
  }
});

// Структура данных:
{
  "totalSearches": 15420,
  "uniqueQueries": 3240,
  "noHitsCount": 312,
  "avgLatency": 23.4,  // мс
  "p95Latency": 45.2,  // мс
  "p99Latency": 78.9,  // мс
  "topQueries": [
    {"query": "laptop", "count": 450, "avgSearchTime": 19.2},
    {"query": "headphones", "count": 380, "avgSearchTime": 21.5}
  ],
  "noHitsQueries": [
    {"query": "ipone 15", "count": 25},  // Опечатка
    {"query": "samsung galxy", "count": 18}
  ]
}
```

#### Метрики производительности

- **Search Time**: время выполнения запроса
- **Latency Percentiles**: P50, P95, P99
- **Query Volume**: количество запросов
- **Success Rate**: процент успешных запросов

### 3.2. Аналитика без результатов (No-Hits)

Отслеживание запросов, не вернувших результаты:

```javascript
// Топ запросов без результатов
const noHits = await payload.find({
  collection: 'search_analytics',
  sort: '-noHitsCount'
});

// Автоматическое создание синонимов на основе no-hits
// Job: dictionary-update-weekly
{
  "candidates": [
    {
      "query": "ipone",
      "suggestion": "iphone",
      "confidence": 0.95,
      "frequency": 25
    },
    {
      "query": "labtop",
      "suggestion": "laptop",
      "confidence": 0.92,
      "frequency": 18
    }
  ]
}
```

### 3.3. Click Tracking

Отслеживание кликов на результаты поиска:

```javascript
// Tracking API
await fetch('/api/analytics/click', {
  method: 'POST',
  body: JSON.stringify({
    query: 'laptop',
    document_id: 'prod-123',
    position: 3,  // Позиция в результатах
    collection: 'products',
    session_id: 'session-456'
  })
});

// Метрики:
// - Click-Through Rate (CTR)
// - Position-based CTR
// - Time to click
// - Result relevance
```

### 3.4. A/B тестирование

Тестирование различных конфигураций поиска:

```javascript
// Создание A/B теста
{
  "name": "Ranking Algorithm Test",
  "variants": [
    {
      "name": "Control",
      "weight": 50,  // 50% трафика
      "config": {
        "query_by_weights": "3,2,1",
        "text_match_type": "max_score"
      }
    },
    {
      "name": "Variant A",
      "weight": 50,
      "config": {
        "query_by_weights": "4,2,1",
        "text_match_type": "max_weight"
      }
    }
  ],
  "metrics": [
    "click_through_rate",
    "conversion_rate",
    "avg_position_clicked"
  ],
  "duration_days": 14
}

// Результаты:
{
  "winner": "Variant A",
  "improvement": {
    "click_through_rate": "+12.5%",
    "conversion_rate": "+8.3%"
  },
  "confidence": 0.95
}
```

---

## 4. Merchandising и управление результатами

### 4.1. Синонимы

#### Multi-way синонимы

Все термины эквивалентны:

```javascript
// Создание multi-way синонима
await payload.create({
  collection: 'ts_synonyms',
  data: {
    tenant: 'tenant-123',
    collection: 'products',
    name: 'smartphone-synonyms',
    synonym_type: 'multi-way',
    synonyms: [
      {value: 'smartphone'},
      {value: 'mobile phone'},
      {value: 'cellphone'},
      {value: 'mobile'}
    ]
  }
});

// Поиск "mobile" найдет все документы со словами:
// smartphone, mobile phone, cellphone, mobile
```

#### One-way синонимы

Root расширяется до синонимов:

```javascript
// Создание one-way синонима
await payload.create({
  collection: 'ts_synonyms',
  data: {
    tenant: 'tenant-123',
    collection: 'products',
    name: 'sneakers-expansion',
    synonym_type: 'one-way',
    root: 'sneakers',
    synonyms: [
      {value: 'shoes'},
      {value: 'footwear'},
      {value: 'kicks'},
      {value: 'trainers'}
    ]
  }
});

// Поиск "sneakers" найдет: sneakers, shoes, footwear, kicks, trainers
// Но поиск "shoes" НЕ найдет "sneakers"
```

### 4.2. Overrides (Переопределения)

Точный контроль над результатами поиска:

```javascript
// Создание override
await payload.create({
  collection: 'ts_overrides',
  data: {
    tenant: 'tenant-123',
    collection: 'products',
    name: 'black-friday-promo',
    rule: {
      query: 'laptop',
      match: 'exact'
    },
    includes: [
      {id: 'promo-laptop-1', position: 1},  // Закрепить на 1 позиции
      {id: 'promo-laptop-2', position: 2}
    ],
    excludes: [
      {id: 'out-of-stock-laptop'}  // Исключить из результатов
    ],
    filter_by: 'discount:>0',  // Только товары со скидкой
    sort_by: 'discount:desc'   // Сортировать по скидке
  }
});
```

### 4.3. Закрепление результатов (Pinning)

```javascript
// Закрепление конкретных документов на определенных позициях
{
  "name": "featured-products",
  "rule": {
    "query": "*",  // Для всех запросов
    "match": "exact"
  },
  "includes": [
    {"id": "featured-1", "position": 1},
    {"id": "featured-2", "position": 2},
    {"id": "featured-3", "position": 3}
  ]
}
```

### 4.4. Исключение результатов (Exclusions)

```javascript
// Исключение нежелательных результатов
{
  "name": "hide-discontinued",
  "rule": {
    "query": "*"
  },
  "excludes": [
    {"id": "discontinued-product-1"},
    {"id": "discontinued-product-2"}
  ]
}
```

### 4.5. Динамические правила

Использование переменных в overrides:

```javascript
// Override с динамическими параметрами
{
  "name": "regional-boost",
  "rule": {
    "filter_by": "region:={region}"  // Параметр из запроса
  },
  "sort_by": "popularity.{region}:desc"  // Динамическая сортировка
}

// Использование:
const results = await search({
  q: 'shoes',
  filter_by: 'region:=US'  // Подставится в override
});
```

---

## 5. Биллинг и монетизация

### 5.1. Интеграция с Stripe

AACSearch использует Stripe для обработки платежей:

```javascript
// Создание Checkout Session
const session = await stripe.checkout.sessions.create({
  customer: stripeCustomerId,
  mode: 'subscription',
  line_items: [{
    price: 'price_1234567890',  // Stripe Price ID
    quantity: 1
  }],
  success_url: 'https://app.aacsearch.com/success',
  cancel_url: 'https://app.aacsearch.com/cancel',
  metadata: {
    tenant_id: 'tenant-123',
    plan_id: 'plan-pro'
  }
});

// Webhook обработка
app.post('/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

  switch (event.type) {
    case 'checkout.session.completed':
      // Активация подписки
      await activateSubscription(event.data.object);
      break;
    case 'invoice.payment_failed':
      // Обработка неуспешного платежа
      await handlePaymentFailure(event.data.object);
      break;
    case 'customer.subscription.deleted':
      // Отмена подписки
      await cancelSubscription(event.data.object);
      break;
  }

  res.json({received: true});
});
```

### 5.2. Планы и тарифы

```javascript
// Структура планов
const plans = [
  {
    slug: 'free',
    name: 'Free',
    price: 0,
    limits: {
      searches: 1000,      // в месяц
      documents: 10000,
      api_calls: 10000,
      collections: 3
    },
    features: {
      basic_search: true,
      analytics: false,
      advanced_search: false,
      support: 'community'
    }
  },
  {
    slug: 'pro',
    name: 'Professional',
    price: 49,  // USD/месяц
    stripe_price_id: 'price_pro_monthly',
    limits: {
      searches: 100000,
      documents: 100000,
      api_calls: 1000000,
      collections: 10
    },
    features: {
      basic_search: true,
      analytics: true,
      advanced_search: true,
      vector_search: true,
      support: 'email'
    }
  },
  {
    slug: 'enterprise',
    name: 'Enterprise',
    price: null,  // Custom pricing
    limits: {
      searches: -1,  // Unlimited
      documents: -1,
      api_calls: -1,
      collections: -1
    },
    features: {
      basic_search: true,
      analytics: true,
      advanced_search: true,
      vector_search: true,
      nl_search: true,
      conversational_search: true,
      custom_integrations: true,
      support: 'priority'
    }
  }
];
```

### 5.3. Отслеживание использования

```javascript
// Автоматическое отслеживание использования
// Collection: usage_counters
{
  "tenant": "tenant-123",
  "period": "2024-01",
  "counters": {
    "searches": 45231,
    "documents": 85000,
    "api_calls": 523418,
    "bandwidth_gb": 12.4
  },
  "limits": {
    "searches": 100000,
    "documents": 100000,
    "api_calls": 1000000
  },
  "overage": {
    "searches": 0,
    "documents": 0,
    "api_calls": 0
  }
}

// Проверка лимитов перед запросом
const checkResult = await checkUsageLimit(payload, tenantId, 'searches');
if (!checkResult.allowed) {
  return Response.json({
    error: 'Usage limit exceeded',
    limit: checkResult.limit,
    usage: checkResult.usage,
    remaining: checkResult.remaining
  }, {status: 429});
}
```

### 5.4. Управление подписками

```javascript
// Обновление подписки
async function upgradePlan(tenantId, newPlanSlug) {
  const tenant = await payload.findByID({
    collection: 'tenants',
    id: tenantId
  });

  const subscription = await payload.findOne({
    collection: 'subscriptions',
    where: {
      tenant: {equals: tenantId},
      status: {equals: 'active'}
    }
  });

  const newPlan = await payload.findOne({
    collection: 'plans',
    where: {slug: {equals: newPlanSlug}}
  });

  // Обновление в Stripe
  const stripeSubscription = await stripe.subscriptions.update(
    subscription.stripeSubscriptionId,
    {
      items: [{
        id: subscription.stripeItemId,
        price: newPlan.stripePriceId
      }],
      proration_behavior: 'create_prorations'
    }
  );

  // Обновление в БД
  await payload.update({
    collection: 'subscriptions',
    id: subscription.id,
    data: {
      plan: newPlan.id,
      updatedAt: new Date()
    }
  });
}
```

---

## 6. API и безопасность

### 6.1. API ключи

```javascript
// Создание API ключа
const apiKey = await payload.create({
  collection: 'api_keys',
  data: {
    tenant: 'tenant-123',
    label: 'Production Key',
    keyHash: hashApiKey(generatedKey),  // Хэшированный ключ
    scopes: {
      collections: ['products', 'posts'],
      permissions: ['search', 'read']
    },
    expiresAt: new Date('2025-12-31'),
    isActive: true
  }
});

// Использование API ключа
const response = await fetch('https://api.aacsearch.com/api/search', {
  headers: {
    'X-API-Key': 'aac_live_xxxxxxxxxx'
  },
  method: 'POST',
  body: JSON.stringify({
    q: 'laptop',
    collection: 'products'
  })
});
```

### 6.2. Scoped Keys (Ограниченные ключи)

Создание ключей с ограниченным доступом:

```javascript
// Scoped key для определенного пользователя
const scopedKey = await generateScopedKey({
  parentKey: 'master-api-key',
  filters: {
    user_id: 'user-456',
    access_level: 'premium'
  },
  expiresIn: 3600  // 1 час
});

// Пример использования для row-level security
const results = await search({
  q: 'documents',
  api_key: scopedKey
  // Автоматически добавится filter: user_id:=user-456
});
```

### 6.3. Rate Limiting

```javascript
// Настройки rate limiting
const rateLimits = {
  free: {
    requests_per_minute: 10,
    requests_per_hour: 100,
    requests_per_day: 1000
  },
  pro: {
    requests_per_minute: 100,
    requests_per_hour: 5000,
    requests_per_day: 100000
  },
  enterprise: {
    requests_per_minute: 1000,
    requests_per_hour: -1,  // Unlimited
    requests_per_day: -1
  }
};

// Обработка rate limit
const rateLimit = await checkRateLimit(payload, tenantId, 'search');
if (!rateLimit.allowed) {
  return Response.json({
    error: 'Rate limit exceeded',
    limit: rateLimit.limit,
    remaining: rateLimit.remaining,
    resetAt: rateLimit.resetAt,
    retryAfter: rateLimit.retryAfter
  }, {
    status: 429,
    headers: {
      'X-RateLimit-Limit': rateLimit.limit,
      'X-RateLimit-Remaining': rateLimit.remaining,
      'X-RateLimit-Reset': rateLimit.resetAt,
      'Retry-After': rateLimit.retryAfter
    }
  });
}
```

### 6.4. Аутентификация и авторизация

```javascript
// Role-based Access Control (RBAC)
const roles = {
  'platform:admin': {
    description: 'Platform administrator',
    permissions: ['*']  // Все права
  },
  'admin': {
    description: 'Tenant administrator',
    permissions: [
      'manage:collections',
      'manage:users',
      'view:analytics',
      'manage:api_keys'
    ]
  },
  'editor': {
    description: 'Content editor',
    permissions: [
      'edit:documents',
      'view:analytics'
    ]
  },
  'viewer': {
    description: 'Read-only access',
    permissions: [
      'view:documents',
      'search'
    ]
  }
};

// Проверка прав доступа
function hasPermission(user, permission) {
  const userRole = user.role;
  const rolePermissions = roles[userRole]?.permissions || [];

  return rolePermissions.includes('*') ||
         rolePermissions.includes(permission);
}
```

---

## 7. Multi-tenancy

### 7.1. Изоляция данных

```javascript
// Row-Level Security (RLS) в PostgreSQL
CREATE POLICY tenant_isolation ON documents
  FOR ALL
  TO authenticated
  USING (tenant_id = current_setting('app.current_tenant')::uuid);

// Автоматическая фильтрация по tenant
const results = await client.collections('products').documents().search({
  q: 'laptop',
  filter_by: `tenant:=${tenantId}`  // Автоматически добавляется
});
```

### 7.2. Настройки на уровне тенанта

```javascript
// Tenant configuration
{
  "id": "tenant-123",
  "name": "Acme Corp",
  "slug": "acme",
  "domain": "acme.aacsearch.com",
  "plan": "enterprise",
  "settings": {
    "localeDefault": "en",
    "features": {
      "vector_search": true,
      "nl_search": true,
      "conversational_search": true,
      "custom_models": true
    },
    "branding": {
      "logo": "https://cdn.acme.com/logo.png",
      "primaryColor": "#007bff",
      "customDomain": "search.acme.com"
    },
    "search": {
      "defaultCollection": "products",
      "typoTolerance": true,
      "numTypos": 2,
      "prefix": true,
      "infix": "fallback"
    }
  }
}
```

### 7.3. Управление пользователями

```javascript
// Membership management
{
  "id": "membership-456",
  "tenant": "tenant-123",
  "user": "user-789",
  "role": "admin",
  "permissions": {
    "collections": ["*"],
    "actions": ["read", "write", "delete"]
  },
  "invitedBy": "user-111",
  "invitedAt": "2024-01-15T10:00:00Z",
  "acceptedAt": "2024-01-15T11:30:00Z"
}

// Приглашение пользователя
async function inviteUser(tenantId, email, role) {
  const invitation = await payload.create({
    collection: 'memberships',
    data: {
      tenant: tenantId,
      email: email,
      role: role,
      status: 'pending',
      invitedBy: currentUser.id,
      invitedAt: new Date(),
      token: generateInvitationToken()
    }
  });

  await sendInvitationEmail(email, invitation.token);
}
```

---

## 8. Автоматизация и задачи

### 8.1. Scheduled Jobs

AACSearch включает 10 автоматических задач:

1. **snapshot-daily** (01:00): Снапшоты коллекций
2. **reindex-nightly** (02:00): Переиндексация
3. **analytics-aggregation** (02:00): Агрегация аналитики
4. **dictionary-update-weekly** (03:00, воскресенье): Обновление словаря
5. **webhook-retry** (каждые 15 минут): Повтор неудачных вебхуков
6. **data-sanitation-weekly** (04:00, воскресенье): Очистка данных
7. **gdpr-cleanup-daily** (05:00): GDPR очистка
8. **key-rotation-monthly** (00:00, 1-е число): Ротация ключей
9. **ecommerce-sync** (каждые 5 минут): Синхронизация e-commerce
10. **integration-sync** (каждые 15 минут): Синхронизация интеграций

### 8.2. Webhooks

```javascript
// Настройка webhook
{
  "url": "https://myapp.com/webhooks/search",
  "events": [
    "search.completed",
    "document.created",
    "document.updated",
    "document.deleted"
  ],
  "secret": "whsec_xxxxxxxxxx",
  "active": true
}

// Обработка webhook
app.post('/webhooks/search', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const payload = req.body;

  // Верификация подписи
  const isValid = verifyWebhookSignature(payload, signature, secret);
  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  // Обработка события
  switch (payload.event) {
    case 'search.completed':
      console.log('Search query:', payload.data.query);
      console.log('Results found:', payload.data.found);
      break;
    case 'document.created':
      console.log('New document:', payload.data.id);
      break;
  }

  res.status(200).send('OK');
});
```

### 8.3. Автоматическая синхронизация

```javascript
// Webhook для автоматической синхронизации
app.post('/webhooks/shopify/products/update', async (req, res) => {
  const {id, title, variants, images} = req.body;

  // Автоматическое обновление в поисковом движке
  await aacSearchClient.collections('products').documents().upsert({
    id: id.toString(),
    title: title,
    price: variants[0]?.price,
    image: images[0]?.src,
    inventory: variants.reduce((sum, v) => sum + v.inventory_quantity, 0),
    updatedAt: new Date().toISOString()
  });

  res.status(200).send('OK');
});
```

---

## 9. Производительность и масштабирование

### 9.1. Кэширование (Redis)

```javascript
// Redis кэширование результатов
import {Redis} from 'redis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  password: process.env.REDIS_PASSWORD
});

async function cachedSearch(query, params) {
  const cacheKey = `search:${query}:${JSON.stringify(params)}`;

  // Проверка кэша
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Выполнение поиска
  const results = await search(query, params);

  // Сохранение в кэш (TTL: 5 минут)
  await redis.setex(cacheKey, 300, JSON.stringify(results));

  return results;
}
```

### 9.2. Индексация

```javascript
// Оптимизация индексов
{
  "name": "products",
  "fields": [
    {
      "name": "title",
      "type": "string",
      "index": true,
      "infix": true  // Для поиска внутри слова
    },
    {
      "name": "sku",
      "type": "string",
      "index": true,
      "facet": true
    },
    {
      "name": "price",
      "type": "float",
      "index": true,
      "facet": true,
      "sort": true
    },
    {
      "name": "stock",
      "type": "int32",
      "index": true,
      "facet": false
    }
  ],
  "default_sorting_field": "popularity"
}
```

### 9.3. Zero-Downtime Reindex

```javascript
// Переиндексация без простоя
async function reindexWithZeroDowntime(collectionName) {
  const timestamp = Date.now();
  const tempCollection = `${collectionName}_${timestamp}`;

  // 1. Создать временную коллекцию
  await createCollection(tempCollection, schema);

  // 2. Скопировать данные
  const documents = await getAllDocuments(collectionName);
  await bulkImport(tempCollection, documents);

  // 3. Создать алиас
  await createAlias(collectionName, tempCollection);

  // 4. Удалить старую коллекцию
  await deleteCollection(`${collectionName}_old`);

  console.log(`Reindex completed: ${collectionName}`);
}
```

---

## 10. Соответствие требованиям (Compliance)

### 10.1. GDPR

```javascript
// GDPR Data Deletion Request
async function processGDPRDeletion(userId) {
  // 1. Удаление пользовательских данных
  await payload.delete({
    collection: 'users',
    where: {id: {equals: userId}}
  });

  // 2. Анонимизация аналитики
  await payload.update({
    collection: 'search_analytics',
    where: {user: {equals: userId}},
    data: {user: null, anonymized: true}
  });

  // 3. Удаление сессий
  await redis.del(`session:${userId}:*`);

  // 4. Логирование
  await payload.create({
    collection: 'audit_log',
    data: {
      action: 'gdpr_deletion',
      userId: userId,
      timestamp: new Date(),
      status: 'completed'
    }
  });
}

// Автоматическая очистка (job: gdpr-cleanup-daily)
async function gdprCleanup() {
  const retentionDays = 90;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  // Удаление старых логов
  await payload.delete({
    collection: 'search_analytics',
    where: {
      createdAt: {less_than: cutoffDate},
      anonymized: {equals: false}
    }
  });
}
```

### 10.2. Безопасность данных

```javascript
// Encryption at rest
const encryptedField = {
  name: 'credentials',
  type: 'json',
  admin: {
    components: {
      Field: 'EncryptedField'  // Custom encrypted field
    }
  },
  hooks: {
    beforeChange: [
      async ({value}) => {
        return encrypt(value);  // AES-256-GCM
      }
    ],
    afterRead: [
      async ({value}) => {
        return decrypt(value);
      }
    ]
  }
};

// TLS/SSL для всех соединений
const sslConfig = {
  rejectUnauthorized: true,
  ca: fs.readFileSync('./certs/ca.pem'),
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
};
```

### 10.3. Аудит и логирование

```javascript
// Audit logging
async function auditLog(action, user, resource, metadata = {}) {
  await payload.create({
    collection: 'audit_log',
    data: {
      action: action,  // 'create', 'update', 'delete', 'search'
      user: user.id,
      userEmail: user.email,
      userRole: user.role,
      resource: resource,
      resourceId: metadata.resourceId,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      timestamp: new Date(),
      metadata: metadata
    }
  });
}

// Использование
await auditLog('delete', req.user, 'products', {
  resourceId: 'prod-123',
  ipAddress: req.ip,
  userAgent: req.headers['user-agent']
});
```

---

## Заключение

AACSearch предоставляет комплексное решение для поиска корпоративного уровня с:

- **6 типами поиска**: Полнотекстовый, векторный, NL, RAG, Image, Geo
- **10+ интеграций**: E-commerce, CMS, Headless CMS
- **Детальная аналитика**: Top queries, no-hits, click tracking, A/B testing
- **Продвинутый merchandising**: Синонимы, overrides, pinning
- **Enterprise функции**: Multi-tenancy, RBAC, GDPR, аудит
- **Автоматизация**: 10 scheduled jobs, webhooks, автосинхронизация
- **Высокая производительность**: Redis кэширование, zero-downtime reindex

Следующие разделы: [Архитектура](./03-architecture.md) | [Технологический стек](./04-tech-stack.md)
