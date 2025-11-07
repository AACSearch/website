# Сравнение AACSearch с конкурентами

## Содержание

- [Обзор конкурентов](#обзор-конкурентов)
- [1. AACSearch vs Algolia](#1-aacsearch-vs-algolia)
- [2. AACSearch vs Elasticsearch](#2-aacsearch-vs-elasticsearch)
- [3. AACSearch vs Meilisearch](#3-aacsearch-vs-meilisearch)
- [4. AACSearch vs Azure Cognitive Search](#4-aacsearch-vs-azure-cognitive-search)
- [5. Сводная таблица](#5-сводная-таблица)
- [6. TCO Analysis](#6-tco-analysis)
- [7. Migration Guide](#7-migration-guide)

---

## Обзор конкурентов

| Платформа | Тип | Ценообразование | Основной фокус |
|-----------|-----|-----------------|----------------|
| **AACSearch** | SaaS / On-premise | Usage-based | Multi-tenant, Developer-friendly |
| **Algolia** | SaaS | Usage-based | E-commerce, Speed |
| **Elasticsearch** | Self-hosted / SaaS | Free / License | Full-text search, Analytics |
| **Meilisearch** | Open-source / Cloud | Free / Usage | Simplicity, Typo tolerance |
| **Azure Cognitive** | Cloud | Pay-as-you-go | AI/ML integration |

---

## 1. AACSearch vs Algolia

### Сравнение функций

| Функция | AACSearch | Algolia |
|---------|-----------|---------|
| **Цена (1M searches/mo)** | $49 | $299 |
| **Typo tolerance** | ✅ До 2 опечаток | ✅ До 2 опечаток |
| **Faceted search** | ✅ Unlimited | ✅ Limited по плану |
| **Geo search** | ✅ Included | ✅ Included |
| **Vector search** | ✅ Included | ✅ Premium ($$$) |
| **Analytics** | ✅ Full analytics | ✅ Extra cost |
| **Multi-tenancy** | ✅ Native | ❌ Manual |
| **Self-hosted** | ✅ Available | ❌ Cloud only |
| **API limits** | 1000 req/s | Limited by plan |
| **Support** | 24/7 Enterprise | Business hours |

### Ценообразование

**AACSearch:**
```
Starter: $49/mo
- 1M searches
- 100K documents
- 10 collections
- Standard support

Pro: $199/mo
- 10M searches
- 1M documents
- Unlimited collections
- Priority support

Enterprise: Custom
- Unlimited searches
- Unlimited documents
- On-premise option
- 24/7 support
```

**Algolia:**
```
Build: $1/mo (limited)
- 10K searches
- 10K records

Grow: $299/mo
- 1M searches
- 100K records
- Basic analytics

Enterprise: $1500+/mo
- Custom searches
- Advanced features
- ML/AI extras
```

### Performance

| Метрика | AACSearch | Algolia |
|---------|-----------|---------|
| Search latency | <50ms | <20ms |
| Index latency | <100ms | <50ms |
| Throughput | 1000 req/s | 10000 req/s |
| Uptime SLA | 99.99% | 99.99% |

### Migration от Algolia

```typescript
// Algolia
const client = algoliasearch('APP_ID', 'API_KEY')
const index = client.initIndex('products')

const results = await index.search('query', {
  filters: 'category:Electronics',
  hitsPerPage: 20
})

// AACSearch (compatible API)
const client = aacsearch('API_KEY')
const index = client.collection('products')

const results = await index.search({
  q: 'query',
  filter_by: 'category:=Electronics',
  per_page: 20
})
```

**Плюсы миграции на AACSearch:**
- 💰 Экономия до 70% на costs
- 🔐 Built-in multi-tenancy
- 📊 Бесплатная аналитика
- 🏢 Self-hosted опция

**Минусы:**
- Меньше geo-распределенных серверов
- Более молодая платформа

---

## 2. AACSearch vs Elasticsearch

### Сравнение

| Функция | AACSearch | Elasticsearch |
|---------|-----------|---------------|
| **Тип** | SaaS + Self-hosted | Self-hosted + Cloud |
| **Простота setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Relevance tuning** | Built-in | Manual config |
| **Managed service** | ✅ Included | Elastic Cloud ($$$) |
| **Typo tolerance** | ✅ Auto | ⚙️ Manual fuzzy |
| **Facets** | ✅ Easy | ⚙️ Aggregations |
| **Vector search** | ✅ Native | ✅ kNN plugin |
| **Cost (small)** | $49/mo | $0 (self) / $95 (cloud) |
| **Cost (large)** | $499/mo | $1000+ (cloud) |

### Use Cases

**Выбирайте AACSearch если:**
- Нужен быстрый старт (minutes vs days)
- Хотите managed solution
- E-commerce / SaaS приложение
- Ограниченные DevOps ресурсы

**Выбирайте Elasticsearch если:**
- Нужен полный контроль
- Сложные aggregations
- Log analytics / APM
- Большая команда DevOps

### Performance Comparison

**Indexing Speed:**
```
AACSearch: 10K docs/sec
Elasticsearch: 50K docs/sec (tuned cluster)
```

**Search Latency:**
```
AACSearch: <50ms (p95)
Elasticsearch: <100ms (p95, default config)
```

**Resource Usage:**
```
AACSearch SaaS: $0 infrastructure
Elasticsearch:
- 3 nodes × 8GB RAM = $300/mo
- + DevOps time
```

### Migration

**From Elasticsearch:**
```typescript
// Elasticsearch
const response = await client.search({
  index: 'products',
  body: {
    query: {
      bool: {
        must: [
          {match: {title: 'laptop'}},
          {range: {price: {gte: 500, lte: 2000}}}
        ]
      }
    },
    aggs: {
      categories: {terms: {field: 'category'}}
    }
  }
})

// AACSearch
const response = await typesense.collections('products')
  .documents()
  .search({
    q: 'laptop',
    query_by: 'title',
    filter_by: 'price:[500..2000]',
    facet_by: 'category'
  })
```

---

## 3. AACSearch vs Meilisearch

### Comparison

| Функция | AACSearch | Meilisearch |
|---------|-----------|-------------|
| **Модель** | SaaS + On-premise | Open-source + Cloud |
| **Цена** | $49-499/mo | Free / $29+ cloud |
| **Typo tolerance** | ✅ Auto | ✅ Auto |
| **Multi-tenancy** | ✅ Native | ⚙️ Manual |
| **Vector search** | ✅ Yes | ✅ Experimental |
| **Geo search** | ✅ Full | ✅ Basic |
| **Analytics** | ✅ Built-in | ❌ No |
| **Enterprise features** | ✅ Yes | ⚙️ Limited |

### Когда выбирать что

**AACSearch:**
- Multi-tenant SaaS
- Need analytics
- Enterprise compliance
- Managed service

**Meilisearch:**
- Open-source requirement
- Budget constraints
- Simple use case
- Self-hosting preferred

### Pricing Comparison

**Small app (100K docs, 100K searches/mo):**
- AACSearch: $49/mo
- Meilisearch Cloud: $29/mo
- Meilisearch Self-hosted: $0 + infra

**Medium app (1M docs, 1M searches/mo):**
- AACSearch: $199/mo
- Meilisearch Cloud: $99/mo
- Meilisearch Self-hosted: $150/mo infra

**Enterprise (10M+ docs):**
- AACSearch: $499-999/mo
- Meilisearch Cloud: $299+/mo
- Meilisearch Self-hosted: $1000+/mo infra

---

## 4. AACSearch vs Azure Cognitive Search

### Feature Matrix

| Функция | AACSearch | Azure Cognitive |
|---------|-----------|-----------------|
| **Cloud** | Multi-cloud | Azure only |
| **AI Features** | OpenAI integration | Built-in AI |
| **OCR** | ⚙️ Via integration | ✅ Native |
| **Pricing model** | Simple usage | Complex tiers |
| **Setup time** | 5 minutes | 30+ minutes |
| **Developer UX** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

### Pricing

**AACSearch vs Azure (1M docs, 1M queries):**

```
AACSearch Pro: $199/mo flat
- All features included
- Predictable cost

Azure Cognitive Standard:
- $250/mo base
- + Query charges
- + Indexing charges
- = $400-600/mo total
```

### When to choose

**AACSearch:**
- Multi-cloud strategy
- Simple pricing
- Fast time-to-market
- Developer-friendly API

**Azure Cognitive:**
- Azure-native stack
- Need OCR/AI extras
- Enterprise Azure contract

---

## 5. Сводная таблица

### Feature Comparison Matrix

| Feature | AACSearch | Algolia | Elasticsearch | Meilisearch | Azure |
|---------|-----------|---------|---------------|-------------|-------|
| **Setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Speed** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Relevance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Price** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Analytics** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **Multi-tenant** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Self-hosted** | ✅ | ❌ | ✅ | ✅ | ❌ |
| **Vector search** | ✅ | ✅ $ | ✅ | ✅ exp | ✅ |

### Use Case Fit

| Use Case | Best Choice | Runner-up |
|----------|-------------|-----------|
| **E-commerce** | AACSearch | Algolia |
| **Content/Blog** | AACSearch | Meilisearch |
| **SaaS Platform** | AACSearch | Elasticsearch |
| **Enterprise Docs** | AACSearch | Azure Cognitive |
| **Log Analytics** | Elasticsearch | - |
| **Very Large Scale** | Elasticsearch | Algolia |

---

## 6. TCO Analysis

### 3-Year Total Cost of Ownership

**Scenario: Medium SaaS (1M docs, 5M searches/mo)**

#### AACSearch
```
Year 1: $199/mo × 12 = $2,388
Year 2: $199/mo × 12 = $2,388
Year 3: $199/mo × 12 = $2,388
Total: $7,164
```

#### Algolia
```
Year 1: $499/mo × 12 = $5,988
Year 2: $599/mo × 12 = $7,188 (growth)
Year 3: $699/mo × 12 = $8,388
Total: $21,564
```

#### Elasticsearch (Self-hosted)
```
Infrastructure:
- 3× m5.large = $300/mo
- Storage = $50/mo
- Total: $350/mo × 36 = $12,600

DevOps time:
- Setup: 40h × $100 = $4,000
- Maintenance: 5h/mo × $100 × 36 = $18,000

Total: $34,600
```

#### Meilisearch Cloud
```
Year 1: $99/mo × 12 = $1,188
Year 2: $149/mo × 12 = $1,788
Year 3: $199/mo × 12 = $2,388
Total: $5,364
```

### ROI Comparison

**Cost Savings vs Algolia:**
- 3-year savings: $14,400
- ROI: 67% reduction

**Cost Savings vs Elasticsearch:**
- 3-year savings: $27,436
- ROI: 79% reduction

**vs Meilisearch:**
- Additional cost: $1,800
- But includes: Analytics, Multi-tenancy, Enterprise support

---

## 7. Migration Guide

### From Algolia

**Step 1: Export data**
```bash
# Using Algolia CLI
algolia export --app-id XXX --api-key YYY --index products > products.json
```

**Step 2: Transform schema**
```typescript
// Algolia → AACSearch field mapping
const fieldMapping = {
  'objectID': 'id',
  'hierarchicalCategories.lvl0': 'category',
  '_tags': 'tags'
}
```

**Step 3: Import to AACSearch**
```bash
curl -X POST https://api.aacsearch.com/collections/products/import \
  -H "X-API-Key: YOUR_KEY" \
  -d @products.json
```

### From Elasticsearch

**Step 1: Create reindex script**
```bash
elasticdump \
  --input=http://localhost:9200/products \
  --output=products.json \
  --type=data
```

**Step 2: Transform & Upload**
```typescript
import { createReadStream } from 'fs'
import { parse } from 'ndjson'

const stream = createReadStream('products.json').pipe(parse())

for await (const doc of stream) {
  await aacsearch.collection('products').documents().create(
    transformElasticsearchDoc(doc)
  )
}
```

### Migration Checklist

- [ ] Export existing data
- [ ] Create AACSearch collections
- [ ] Test search queries
- [ ] Update frontend code
- [ ] Run parallel (Algolia + AACSearch) for 1 week
- [ ] Monitor metrics
- [ ] Switch DNS/traffic
- [ ] Cancel old service

**Estimated Migration Time:**
- Small app (< 100K docs): 1-2 days
- Medium app (< 1M docs): 3-5 days
- Large app (> 1M docs): 1-2 weeks

---

## Заключение

### Рекомендации по выбору

**Выбирайте AACSearch если:**
- ✅ Нужен баланс цены и функций
- ✅ Multi-tenant SaaS
- ✅ Встроенная аналитика
- ✅ Быстрый time-to-market
- ✅ Предсказуемое ценообразование

**Выбирайте Algolia если:**
- Нужна максимальная скорость (< 20ms)
- Global CDN критичен
- Готовы платить premium

**Выбирайте Elasticsearch если:**
- Нужен full control
- Log analytics use case
- Большая DevOps команда

**Выбирайте Meilisearch если:**
- Open-source requirement
- Очень ограниченный бюджет
- Простой use case

**Выбирайте Azure Cognitive если:**
- Azure-only infrastructure
- Нужны AI features (OCR, etc.)

### Итоговая матрица решений

| Критерий | Лучший выбор |
|----------|--------------|
| **Лучшее соотношение цена/качество** | AACSearch |
| **Максимальная скорость** | Algolia |
| **Максимальная гибкость** | Elasticsearch |
| **Минимальная цена** | Meilisearch (self-hosted) |
| **Простота использования** | AACSearch |
| **Enterprise features** | AACSearch |
| **Multi-tenancy** | AACSearch |
| **Analytics** | AACSearch |

Следующий раздел: [Глоссарий](./07-glossary.md)
