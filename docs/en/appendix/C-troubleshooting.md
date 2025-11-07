# C. Troubleshooting

Руководство по диагностике и решению типичных проблем при работе с AACSearch/Typesense.

## Содержание

1. [Медленный поиск](#1-медленный-поиск)
2. [Нет результатов](#2-нет-результатов)
3. [CORS ошибки](#3-cors-ошибки)
4. [Rate Limiting](#4-rate-limiting)
5. [Billing Issues](#5-billing-issues)
6. [Integration Sync Failures](#6-integration-sync-failures)
7. [Performance Degradation](#7-performance-degradation)
8. [Security Incidents](#8-security-incidents)
9. [Deployment Issues](#9-deployment-issues)
10. [Data Inconsistency](#10-data-inconsistency)

---

## 1. Медленный поиск

### Симптомы

- Поиск занимает более 100-200ms
- Пользователи жалуются на задержки
- Timeout ошибки в production
- Медленная загрузка autocomplete

### Диагностика

#### Шаг 1: Измерение времени выполнения

```typescript
// Добавьте логирование времени
const startTime = Date.now();

const results = await client.search({
  query: 'laptop',
  collection: 'products',
});

const executionTime = Date.now() - startTime;

console.log(`Search took ${executionTime}ms`);
console.log(`Typesense search_time_ms: ${results.search_time_ms}ms`);

// Если executionTime >> search_time_ms, проблема в сети
// Если search_time_ms > 100ms, проблема в индексе/запросе
```

#### Шаг 2: Анализ запроса

```bash
# Проверьте сложность запроса
curl "http://localhost:8108/collections/products/documents/search?q=laptop&query_by=title,description,tags,brand,category&filter_by=category:=Electronics&&brand:=Dell&&price:>=100&&price:<=1000&facet_by=brand,category,subcategory,price_range&sort_by=_text_match:desc,popularity:desc,created_at:desc"
```

Проблемы:
- Слишком много полей в `query_by` (>5)
- Сложные фильтры с множественными условиями
- Много фасетов одновременно (>5)
- Множественная сортировка (>2 полей)

#### Шаг 3: Проверка размера индекса

```bash
# Получите статистику коллекции
curl "http://localhost:8108/collections/products"
```

Обратите внимание на:
- `num_documents` - количество документов
- `num_memory_shards` - количество шардов в памяти
- Размер полей (особенно массивов)

### Решения

#### Решение 1: Оптимизация запроса

```typescript
// ❌ Медленно
const results = await client.search({
  query: 'laptop',
  queryBy: 'title,description,content,tags,brand,category,sku,manufacturer',
  filterBy: 'category:=Electronics&&brand:=Dell&&price:>=100&&price:<=1000&&rating:>=4&&availability:=in_stock',
  facetBy: 'brand,category,subcategory,price_range,rating,color,size,weight',
  sortBy: '_text_match:desc,popularity:desc,rating:desc,created_at:desc',
});

// ✅ Быстро
const results = await client.search({
  query: 'laptop',
  queryBy: 'title:10,brand:8,description:5', // Только важные поля с весами
  filterBy: 'category:=Electronics&&brand:=Dell', // Минимум фильтров
  facetBy: 'brand,category,price_range', // Только нужные фасеты
  sortBy: '_text_match:desc,popularity:desc', // Max 2 поля
  perPage: 20, // Не больше 50
});
```

#### Решение 2: Кэширование

```typescript
import { LRUCache } from 'lru-cache';

const searchCache = new LRUCache({
  max: 10000,
  ttl: 5 * 60 * 1000, // 5 минут
});

async function cachedSearch(params: any) {
  const cacheKey = JSON.stringify(params);
  
  let results = searchCache.get(cacheKey);
  
  if (!results) {
    results = await client.search(params);
    searchCache.set(cacheKey, results);
  }
  
  return results;
}
```

#### Решение 3: Оптимизация индекса

```typescript
// Удалите неиспользуемые поля
const optimizedSchema = {
  name: 'products',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'title', type: 'string' },
    { name: 'brand', type: 'string', facet: true },
    { name: 'price', type: 'float' },
    { name: 'popularity', type: 'int32' },
    // Удалите поля, которые не используются в поиске
  ],
  default_sorting_field: 'popularity',
};

// Пересоздайте коллекцию
await client.collections('products').delete();
await client.collections().create(optimizedSchema);
```

#### Решение 4: Использование prefix search для autocomplete

```typescript
// Для autocomplete используйте prefix:true
const suggestions = await client.search({
  query: 'lap', // Неполный запрос
  queryBy: 'title',
  perPage: 5,
  prefix: true, // Ускоряет autocomplete
  cache_ttl: 60, // Кэш на 1 минуту
});
```

### Профилактика

1. **Мониторинг производительности**

```typescript
// Отслеживайте медленные запросы
const SLOW_QUERY_THRESHOLD = 100; // ms

client.on('search', (params, time) => {
  if (time > SLOW_QUERY_THRESHOLD) {
    analytics.track('slow_search', {
      query: params.q,
      time,
      params,
    });
  }
});
```

2. **Регулярная оптимизация**

```bash
# Еженедельно проверяйте статистику
curl "http://localhost:8108/metrics.json"

# Анализируйте медленные запросы
# Удаляйте неиспользуемые поля
# Обновляйте индексы
```

3. **Лимиты запросов**

```typescript
// Ограничьте сложность запросов на уровне API
const MAX_QUERY_BY_FIELDS = 5;
const MAX_FACETS = 5;
const MAX_FILTERS = 10;

function validateSearchParams(params: any) {
  const queryByCount = params.queryBy?.split(',').length || 0;
  const facetCount = params.facetBy?.split(',').length || 0;
  const filterCount = params.filterBy?.split('&&').length || 0;

  if (queryByCount > MAX_QUERY_BY_FIELDS) {
    throw new Error('Too many query_by fields');
  }

  if (facetCount > MAX_FACETS) {
    throw new Error('Too many facets');
  }

  if (filterCount > MAX_FILTERS) {
    throw new Error('Too many filters');
  }
}
```

---

## 2. Нет результатов

### Симптомы

- Поиск возвращает 0 результатов
- Пользователи не находят существующие документы
- Высокий процент "no-hits" запросов

### Диагностика

#### Проверка 1: Документы существуют?

```bash
# Получите все документы
curl "http://localhost:8108/collections/products/documents/search?q=*&per_page=1"

# Проверьте конкретный документ
curl "http://localhost:8108/collections/products/documents/123"
```

#### Проверка 2: Правильные поля для поиска?

```bash
# Проверьте schema
curl "http://localhost:8108/collections/products"

# Убедитесь, что query_by содержит существующие поля
```

#### Проверка 3: Фильтры корректны?

```typescript
// Тестируйте без фильтров
const withoutFilters = await client.search({
  query: 'laptop',
  queryBy: 'title',
});

console.log('Without filters:', withoutFilters.found);

// Добавляйте фильтры постепенно
const withCategory = await client.search({
  query: 'laptop',
  queryBy: 'title',
  filterBy: 'category:=Electronics',
});

console.log('With category:', withCategory.found);
```

### Решения

#### Решение 1: Опечатки и синонимы

```typescript
// Включите typo tolerance
const results = await client.search({
  query: 'laптоп', // Опечатка
  queryBy: 'title',
  numTypos: 2, // Разрешить до 2 опечаток
});

// Создайте синонимы
await client.collections('products').synonyms().upsert('laptop-synonyms', {
  synonyms: ['laptop', 'notebook', 'ноутбук', 'лаптоп'],
});
```

#### Решение 2: Wildcard search

```typescript
// Для частичного поиска
const results = await client.search({
  query: 'lap*', // Найдет laptop, lapis, etc.
  queryBy: 'title',
  prefix: true,
});
```

#### Решение 3: Снижение порога релевантности

```typescript
// Разрешите менее релевантные результаты
const results = await client.search({
  query: 'laptop gaming',
  queryBy: 'title,description',
  dropTokensThreshold: 1, // Игнорировать 1 токен если нет результатов
  typoTokensThreshold: 2, // Применить typo для всех токенов
});
```

### Профилактика

1. **Трекинг no-hits запросов**

```typescript
// Сохраняйте запросы без результатов
if (results.found === 0) {
  await analytics.track('no_hits_query', {
    query: params.q,
    filters: params.filterBy,
    timestamp: Date.now(),
  });
}
```

2. **Автоматическое создание синонимов**

См. раздел [B. Recipes - Оптимизация релевантности](./B-recipes.md#1-оптимизация-релевантности)

---

## 3. CORS ошибки

### Симптомы

```
Access to fetch at 'https://your-instance.aacsearch.com' from origin 'https://yoursite.com' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

### Решения

#### Решение 1: Серверный прокси (рекомендуется)

```typescript
// app/api/search/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Поиск на сервере (без CORS проблем)
  const results = await typesenseClient.search({
    query: searchParams.get('q') || '',
    collection: 'products',
    // ... other params
  });

  return Response.json(results);
}
```

```typescript
// Frontend - вызов через свой API
const results = await fetch('/api/search?q=laptop');
```

#### Решение 2: Scoped API keys (только для чтения)

```typescript
// Сгенерируйте scoped key на сервере
import { generateScopedSearchKey } from 'typesense';

const scopedKey = generateScopedSearchKey(
  process.env.TYPESENSE_API_KEY,
  {
    expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 час
    collections: ['products'], // Только эти коллекции
    filter_by: 'is_public:=true', // Только публичные документы
  }
);

// Отправьте ключ клиенту
return Response.json({ searchKey: scopedKey });
```

```typescript
// Frontend - используйте scoped key
const searchKey = await fetch('/api/auth/search-key').then(r => r.json());

const client = new Typesense.Client({
  nodes: [{
    host: 'your-instance.aacsearch.com',
    port: '443',
    protocol: 'https',
  }],
  apiKey: searchKey, // Scoped key
});
```

---

## 4. Rate Limiting

### Симптомы

```
HTTP 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1635780000
```

### Решения

#### Решение 1: Exponential Backoff

```typescript
async function searchWithRetry(params: any, maxRetries = 3): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await client.search(params);
    } catch (error) {
      if (error.httpStatus === 429 && i < maxRetries - 1) {
        const waitTime = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        
        console.log(`Rate limited, waiting ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        continue;
      }
      
      throw error;
    }
  }
}
```

#### Решение 2: Request Queuing

```typescript
import PQueue from 'p-queue';

const searchQueue = new PQueue({
  concurrency: 10, // Max 10 одновременных запросов
  interval: 1000, // В секунду
  intervalCap: 100, // Max 100 запросов
});

async function queuedSearch(params: any) {
  return searchQueue.add(() => client.search(params));
}
```

#### Решение 3: Кэширование агрессивное

```typescript
// Кэшируйте на больше времени
const searchCache = new LRUCache({
  max: 50000,
  ttl: 30 * 60 * 1000, // 30 минут
});
```

---

## 5. Billing Issues

### Проблемы и решения

#### Проблема: Неожиданно высокие расходы

**Диагностика:**

```typescript
// Отслеживайте количество запросов
let requestCount = 0;
let costEstimate = 0;

client.on('request', () => {
  requestCount++;
  costEstimate += 0.001; // $0.001 за запрос (примерная цена)
  
  if (requestCount % 1000 === 0) {
    console.log(`Requests: ${requestCount}, Estimated cost: $${costEstimate.toFixed(2)}`);
  }
});
```

**Решение:**

1. Включите агрессивное кэширование
2. Оптимизируйте запросы (меньше фасетов, фильтров)
3. Используйте rate limiting на уровне приложения
4. Рассмотрите self-hosted вариант для высоких нагрузок

---

## 6. Integration Sync Failures

### Симптомы

- Документы не индексируются
- Обновления не отражаются в поиске
- Ошибки в логах синхронизации

### Диагностика

```typescript
// Проверьте статус индексации
async function checkIndexingStatus(documentId: string) {
  try {
    const doc = await client.collections('products')
      .documents(documentId)
      .retrieve();
    
    console.log('Document indexed:', doc);
    return true;
  } catch (error) {
    console.error('Document not found:', error);
    return false;
  }
}
```

### Решения

#### Решение 1: Retry механизм

```typescript
// В Celery/Sidekiq job
async function indexDocument(productId: string, attempt = 1) {
  const MAX_ATTEMPTS = 3;
  
  try {
    const product = await db.products.findById(productId);
    const document = product.toTypesenseDocument();
    
    await client.collections('products').documents().upsert(document);
    
    console.log(`Document ${productId} indexed successfully`);
  } catch (error) {
    if (attempt < MAX_ATTEMPTS) {
      const delay = Math.pow(2, attempt) * 1000;
      
      console.log(`Indexing failed, retry ${attempt}/${MAX_ATTEMPTS} in ${delay}ms`);
      
      setTimeout(() => indexDocument(productId, attempt + 1), delay);
    } else {
      // После 3 попыток - сохраняем в dead letter queue
      await deadLetterQueue.add({ productId, error: error.message });
    }
  }
}
```

#### Решение 2: Batch indexing для массовых обновлений

```typescript
async function bulkReindex(productIds: string[]) {
  const BATCH_SIZE = 100;
  
  for (let i = 0; i < productIds.length; i += BATCH_SIZE) {
    const batch = productIds.slice(i, i + BATCH_SIZE);
    
    const documents = await db.products.find({ id: { $in: batch } });
    
    try {
      await client.collections('products').documents().import(
        documents.map(p => p.toTypesenseDocument()),
        { action: 'upsert' }
      );
      
      console.log(`Indexed batch ${i}-${i + BATCH_SIZE}`);
    } catch (error) {
      console.error(`Batch failed:`, error);
      
      // Попробуйте по одному
      for (const doc of documents) {
        await indexDocument(doc.id);
      }
    }
  }
}
```

---

## 7. Performance Degradation

См. подробно в разделе [B. Recipes - Производительность поиска](./B-recipes.md#2-производительность-поиска)

---

## 8. Security Incidents

### API Key Leak

**Если ваш API ключ утек:**

1. **Немедленно ротируйте ключ:**

```bash
# В админ панели AACSearch
# Settings → API Keys → Regenerate
```

2. **Проверьте usage:**

```bash
# Получите статистику за последние 24 часа
curl "https://api.aacsearch.com/v1/analytics/usage?period=24h" \
  -H "X-API-KEY: YOUR_ADMIN_KEY"
```

3. **Заблокируйте подозрительные IP:**

```bash
# В firewall rules
iptables -A INPUT -s 123.45.67.89 -j DROP
```

---

## 9. Deployment Issues

### Docker контейнер не стартует

```bash
# Проверьте логи
docker logs typesense

# Проверьте порты
docker ps -a

# Убедитесь в правильности конфигурации
docker run -p 8108:8108 \
  -v /tmp/typesense-data:/data \
  -e TYPESENSE_API_KEY=xyz \
  typesense/typesense:0.25.0 \
  --data-dir=/data \
  --api-key=xyz \
  --enable-cors
```

---

## 10. Data Inconsistency

### Симптомы

- Поиск возвращает устаревшие данные
- Удаленные документы все еще в результатах
- Обновления не отражаются

### Решение: Full Reindex

```typescript
async function fullReindex() {
  console.log('Starting full reindex...');
  
  // 1. Получите все документы из БД
  const products = await db.products.find({ isActive: true }).toArray();
  
  console.log(`Found ${products.length} products to index`);
  
  // 2. Удалите старую коллекцию
  try {
    await client.collections('products').delete();
  } catch (error) {
    // Коллекция может не существовать
  }
  
  // 3. Создайте новую коллекцию
  await client.collections().create(productsSchema);
  
  // 4. Индексируйте документы батчами
  const BATCH_SIZE = 1000;
  
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    
    const documents = batch.map(p => ({
      id: p.id.toString(),
      title: p.title,
      // ... other fields
    }));
    
    await client.collections('products').documents().import(documents, {
      action: 'create',
    });
    
    console.log(`Indexed ${Math.min(i + BATCH_SIZE, products.length)}/${products.length}`);
  }
  
  console.log('Full reindex completed');
}
```

---

## Дополнительные ресурсы

- **Официальная документация**: https://typesense.org/docs/
- **GitHub Issues**: https://github.com/typesense/typesense/issues
- **Community форум**: https://github.com/typesense/typesense/discussions
- **Status page**: https://status.aacsearch.com

---

**Не нашли решение?**

Создайте issue на GitHub или напишите в саппорт: support@aacsearch.com
