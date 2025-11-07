# D. Changelog

История версий AACSearch Platform.

## Версии

- [v3.0.0 (Current)](#v300---2025-01-15)
- [v2.5.0](#v250---2024-10-01)
- [v2.0.0](#v200---2024-05-15)
- [v1.5.0](#v150---2023-12-01)
- [v1.0.0](#v100---2023-06-01)

---

## v3.0.0 - 2025-01-15

### 🎉 Major Features

#### 1. Vector Search & Semantic Search
- **Встроенная поддержка векторного поиска**
- Интеграция с OpenAI, Cohere, HuggingFace embeddings
- Гибридный поиск (keyword + semantic)
- Auto-embedding на лету

```typescript
// Новый API для векторного поиска
const results = await client.search({
  query: 'comfortable running shoes',
  collection: 'products',
  vectorSearch: {
    field: 'embedding',
    query: embeddingVector,
    k: 10,
  },
  hybridSearch: {
    alpha: 0.5, // 50% keyword, 50% vector
  },
});
```

#### 2. Conversational Search
- Естественно-языковые запросы
- Context-aware поиск
- Multi-turn диалоги
- Интеграция с LLM (GPT-4, Claude, Llama)

```typescript
const conversation = await client.conversationalSearch({
  messages: [
    { role: 'user', content: 'I need a laptop for programming' },
    { role: 'assistant', content: 'What is your budget?' },
    { role: 'user', content: 'Around $1500' },
  ],
  collection: 'products',
});
```

#### 3. Image Search
- Поиск по изображениям (CLIP embeddings)
- Similarity search для визуального контента
- Автоматическая генерация embeddings из изображений

```typescript
const results = await client.imageSearch({
  image: uploadedImage,
  collection: 'products',
  perPage: 20,
});
```

#### 4. Geo Search Enhancements
- Улучшенная производительность geo queries
- Polygon search (не только radius)
- Сложные geo фильтры

```typescript
const results = await client.search({
  query: 'restaurants',
  collection: 'places',
  filterBy: 'location:(48.8566, 2.3522, 5km)',
  sortBy: 'location(48.8566, 2.3522):asc',
});
```

#### 5. Analytics & Insights
- Встроенная аналитика поисковых запросов
- Dashboard для метрик
- A/B testing framework
- Click-through rate tracking
- No-hits query analysis

```typescript
// Новый analytics endpoint
const analytics = await client.analytics.get({
  collection: 'products',
  period: '30d',
  metrics: ['searches', 'clicks', 'conversions'],
});
```

### 🚀 Performance Improvements

- **50% faster indexing** для больших документов
- **30% reduction** в memory usage
- Improved cache hit rates
- Better handling of concurrent searches

### 🔧 API Changes

#### Breaking Changes

1. **Search API response format**

```typescript
// v2.x
{
  hits: [...],
  found: 100,
  facet_counts: [...]
}

// v3.x
{
  hits: [...],
  found: 100,
  facets: [...], // Renamed from facet_counts
  search_time_ms: 15,
  query_id: 'abc123', // Новое поле для аналитики
}
```

2. **Collection schema changes**

```typescript
// v2.x
{
  name: 'products',
  fields: [
    { name: 'title', type: 'string' }
  ]
}

// v3.x
{
  name: 'products',
  fields: [
    { 
      name: 'title', 
      type: 'string',
      // Новые опции
      stem: true, // Стемминг
      locale: 'ru', // Язык-специфичная обработка
    }
  ],
  // Новая секция для векторного поиска
  vectors: [
    {
      name: 'embedding',
      dimension: 1536,
      model: 'text-embedding-ada-002',
    }
  ]
}
```

3. **Authentication**

```typescript
// v2.x - только API key
const client = new Client({
  apiKey: 'xyz',
});

// v3.x - поддержка OAuth, JWT
const client = new Client({
  auth: {
    type: 'oauth',
    token: 'bearer_token',
  },
});
```

### 📦 New Packages

- `@aacsearch/vector-search` - Vector search utilities
- `@aacsearch/analytics` - Analytics helpers
- `@aacsearch/image-search` - Image search integration

### 🐛 Bug Fixes

- Fixed memory leak in long-running searches
- Fixed race condition in concurrent indexing
- Fixed incorrect facet counts with complex filters
- Fixed CORS issues with wildcard origins

### 📚 Documentation

- New [Vector Search Guide](../04-user-guide/06-advanced/vector-search.md)
- New [Conversational Search Guide](../04-user-guide/06-advanced/conversational-search.md)
- Updated [API Reference](../05-api-reference/)
- New [Migration Guide from v2.x to v3.x](#migration-guide-v2x-to-v3x)

### Migration Guide v2.x to v3.x

#### 1. Update packages

```bash
npm install @aacsearch/client@^3.0.0
```

#### 2. Update search response handling

```typescript
// Before (v2.x)
const { facet_counts } = await client.search(params);

// After (v3.x)
const { facets } = await client.search(params);
```

#### 3. Update collection schemas (if using vectors)

```typescript
// Добавьте vector fields
await client.collections('products').update({
  vectors: [
    {
      name: 'embedding',
      dimension: 1536,
    }
  ]
});
```

#### 4. Update analytics tracking (optional)

```typescript
// v3.x включает встроенную аналитику
// Включите в конфигурации
const client = new Client({
  // ...
  analytics: {
    enabled: true,
    trackClicks: true,
    trackConversions: true,
  },
});
```

---

## v2.5.0 - 2024-10-01

### Features

- **Multi-tenancy support** - Изоляция данных по tenant
- **API rate limiting** - Защита от DDoS
- **Improved autocomplete** - Faster prefix search
- **Custom ranking functions** - User-defined relevance

### Bug Fixes

- Fixed inconsistent sort order
- Fixed empty results with certain filters
- Fixed memory leak in WebSocket connections

---

## v2.0.0 - 2024-05-15

### Breaking Changes

- Minimum Node.js version: 18.x
- Changed default port from 8108 to 8108
- Removed deprecated `search_parameters` API

### Features

- **Real-time indexing** - Sub-second indexing latency
- **Improved faceting** - Nested facets support
- **Better typo tolerance** - Smarter typo detection
- **Bulk operations** - Batch indexing up to 10k docs

---

## v1.5.0 - 2023-12-01

### Features

- **Synonyms support**
- **Stop words** configuration
- **Custom tokenization**
- **Highlighting improvements**

---

## v1.0.0 - 2023-06-01

### Initial Release

- Full-text search
- Faceted search
- Typo tolerance
- Filtering and sorting
- RESTful API
- TypeScript support

---

## Deprecated Features

### v3.0

- `facet_counts` response field → use `facets`
- Basic API key auth → migrate to OAuth/JWT

### v2.0

- `search_parameters` API → use direct parameters
- Port 8107 → use 8108

---

## Breaking Changes Summary

| Version | Change | Migration |
|---------|--------|-----------|
| v3.0 | Response format change | Update response destructuring |
| v3.0 | Vector search required OpenAI API key | Add API key to config |
| v2.0 | Node.js 18+ required | Update Node.js version |
| v2.0 | Port changed to 8108 | Update configuration |

---

## Roadmap

### v3.1 (Q2 2025)

- GraphQL API
- Real-time collaboration
- Enhanced ML features
- Mobile SDK (iOS, Android)

### v3.2 (Q3 2025)

- Automated A/B testing
- Advanced personalization
- Multi-modal search (text + image + video)
- Knowledge graph integration

### v4.0 (Q4 2025)

- Distributed search
- Auto-scaling
- AI-powered relevance tuning
- Enterprise features (SSO, audit logs)

---

## Support Policy

- **Major versions**: 2 years support
- **Minor versions**: 1 year support
- **Patch versions**: 6 months support
- **Security patches**: All supported versions

---

**Questions about migration?**

- Read the [Migration Guide](../07-deployment/06-production-checklist.md#migration)
- Ask on [Community Forum](https://community.aacsearch.com)
- Email: support@aacsearch.com
