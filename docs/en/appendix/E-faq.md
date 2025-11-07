# E. FAQ (Часто задаваемые вопросы)

Ответы на самые частые вопросы о AACSearch/Typesense.

## Содержание

1. [Общие вопросы](#общие-вопросы) (10)
2. [Технические вопросы](#технические-вопросы) (15)
3. [Интеграции](#интеграции) (10)
4. [Биллинг и планы](#биллинг-и-планы) (8)
5. [Безопасность](#безопасность) (7)
6. [Performance](#performance) (10)

---

## Общие вопросы

### 1. Что такое AACSearch?

**Ответ:** AACSearch - это современная платформа для полнотекстового поиска, построенная на базе Typesense. Она предоставляет:

- Мгновенный поиск (typo-tolerant)
- Векторный поиск (semantic search)
- Conversational search с LLM
- Image search
- Geo search
- Real-time индексацию
- Multi-tenancy
- Встроенную аналитику

**Для кого:**
- E-commerce сайты
- SaaS приложения
- Документация и knowledge bases
- Media и content platforms
- Any application requiring search

### 2. Чем AACSearch отличается от Algolia?

**Сравнение:**

| Feature | AACSearch | Algolia |
|---------|-----------|---------|
| **Цена** | От $29/мес | От $99/мес |
| **Open Source** | ✅ (Typesense) | ❌ |
| **Self-hosted** | ✅ | ❌ |
| **Vector Search** | ✅ Встроен | ✅ Платно |
| **Conversational Search** | ✅ | ❌ |
| **Image Search** | ✅ | ❌ |
| **API Calls Limit** | Unlimited* | Limited by plan |
| **Storage** | Unlimited* | Limited by plan |

*на определенных планах

**Миграция:** См. [B. Recipes - Migration from Algolia](./B-recipes.md#migration-from-algolia)

### 3. Нужно ли мне знание машинного обучения для использования?

**Ответ:** Нет! AACSearch работает "из коробки" для большинства сценариев:

```typescript
// Простейший поиск - никакого ML
const results = await client.search({
  query: 'laptop',
  collection: 'products',
  queryBy: 'title,description',
});
```

ML фичи (векторный поиск, conversational search) опциональны и включаются по требованию.

### 4. Какие языки программирования поддерживаются?

**Официальные SDK:**
- JavaScript/TypeScript
- Python
- Ruby
- Go
- PHP
- Java
- C#
- Swift (iOS)
- Kotlin (Android)

**Community SDK:**
- Rust
- Elixir
- Dart/Flutter

**REST API:** Работает с любым языком, поддерживающим HTTP.

### 5. Можно ли использовать AACSearch бесплатно?

**Да!** Несколько вариантов:

1. **Developer Plan** (бесплатно):
   - До 1M документов
   - До 100K поисковых запросов/месяц
   - Базовые фичи
   - Community support

2. **Self-hosted Typesense** (полностью бесплатно):
   - Неограниченное использование
   - Все функции
   - Open source (Apache 2.0)
   - Вы управляете инфраструктурой

3. **Open Source проекты** (бесплатно):
   - Подайте заявку для OSS plan
   - Все Pro функции бесплатно

### 6. Сколько времени занимает настройка?

**Быстрый старт:** 15 минут

```bash
# 1. Установка (1 мин)
npm install typesense

# 2. Запуск сервера (1 мин)
docker run -p 8108:8108 typesense/typesense:latest

# 3. Создание коллекции (2 мин)
curl -X POST http://localhost:8108/collections \
  -H "X-TYPESENSE-API-KEY: xyz" \
  -d '{...schema...}'

# 4. Индексация данных (5 мин)
# См. примеры в A-integration-examples.md

# 5. Первый поиск (1 мин)
curl "http://localhost:8108/collections/products/documents/search?q=laptop"

# Готово! (Еще 5 мин на UI интеграцию)
```

**Production setup:** 1-2 дня
- Настройка инфраструктуры
- Оптимизация схемы
- UI интеграция
- Тестирование

### 7. Какая максимальная производительность?

**Бенчмарки:**

- **Latency**: < 10ms (p50), < 50ms (p99)
- **Throughput**: 10,000+ requests/sec на одном сервере
- **Indexing**: 10,000 docs/sec
- **Concurrent searches**: Thousands

**Real-world примеры:**
- **E-commerce (10M products)**: 15ms average search time
- **Documentation (1M pages)**: 8ms average search time
- **Media platform (50M items)**: 25ms average search time

### 8. Поддерживается ли мультиязычность?

**Да!** Полная поддержка:

- **40+ языков** с автоматической обработкой
- **Per-language tokenization**
- **Language-specific stemming**
- **Multi-language synonyms**
- **Unicode support** (китайский, арабский, русский, и т.д.)

```typescript
const schema = {
  name: 'articles',
  fields: [
    { 
      name: 'title', 
      type: 'string',
      locale: 'ru', // Русская обработка
    },
    {
      name: 'title_en',
      type: 'string',
      locale: 'en',
    },
  ],
};
```

### 9. Как AACSearch обрабатывает опечатки?

**Автоматическая обработка опечаток:**

```typescript
// По умолчанию разрешено до 2 опечаток
const results = await client.search({
  query: 'laptp', // Опечатка в "laptop"
  queryBy: 'title',
  numTypos: 2, // Макс опечаток
});

// Результат: находит "laptop"
```

**Алгоритм:**
- Damerau-Levenshtein distance
- Учитывает частоту слов
- Смарт-коррекция на основе контекста

### 10. Есть ли лимит на размер документов?

**Лимиты:**

- **Max document size**: 1 MB
- **Max field length**: 2,000 characters (рекомендуется)
- **Max array length**: 10,000 элементов
- **Max nested depth**: 10 уровней

**Рекомендации:**

```typescript
// ❌ Слишком большой документ
{
  id: '1',
  title: 'Product',
  description: '...<10,000 characters>...', // Медленно
  reviews: [...] // 50,000 элементов - слишком много
}

// ✅ Оптимизированный
{
  id: '1',
  title: 'Product',
  description: '...<300 characters>...', // Сниппет
  reviewCount: 50000,
  topReviews: [...] // Топ 10 ревью
}
// Полные данные храните в основной БД
```

---

## Технические вопросы

### 11. Как работает индексация в реальном времени?

**Архитектура:**

```
Client Request → API Layer → Indexing Queue → In-Memory Index
                                ↓
                            Disk Persistence (async)
```

**Латентность:**
- **Synchronous**: < 10ms (документ сразу доступен для поиска)
- **Persistence**: < 100ms (запись на диск)

**Пример:**

```typescript
const startTime = Date.now();

// Индексация
await client.collections('products').documents().create({
  id: '123',
  title: 'New Product',
});

console.log('Indexed in:', Date.now() - startTime, 'ms'); // ~5ms

// Сразу доступно для поиска
const results = await client.search({
  query: 'New Product',
  collection: 'products',
});

console.log('Found:', results.found); // 1
```

### 12. Можно ли использовать SQL-like запросы?

**Нет прямой поддержки SQL**, но есть мощный filtering DSL:

```typescript
// SQL-like фильтрация
const results = await client.search({
  query: 'laptop',
  filterBy: [
    'price:[100..1000]',           // BETWEEN
    'brand:=[Dell,HP,Lenovo]',     // IN
    'rating:>=4',                   // Comparison
    'availability:=in_stock',       // Equality
    '(category:=Electronics || category:=Computers)', // OR
  ].join(' && '), // AND
});

// Эквивалент SQL:
// SELECT * FROM products
// WHERE title LIKE '%laptop%'
//   AND price BETWEEN 100 AND 1000
//   AND brand IN ('Dell', 'HP', 'Lenovo')
//   AND rating >= 4
//   AND availability = 'in_stock'
//   AND (category = 'Electronics' OR category = 'Computers')
```

### 13. Поддерживается ли full-text search по PDF/DOCX?

**Да, но требуется предобработка:**

```typescript
import { PDFExtract } from 'pdf.js-extract';
import mammoth from 'mammoth';

// Извлечение текста из PDF
async function extractPdfText(pdfPath: string): Promise<string> {
  const extractor = new PDFExtract();
  const data = await extractor.extract(pdfPath);
  
  return data.pages
    .map(page => page.content.map(item => item.str).join(' '))
    .join('\n');
}

// Извлечение из DOCX
async function extractDocxText(docxPath: string): Promise<string> {
  const result = await mammoth.extractRawText({ path: docxPath });
  return result.value;
}

// Индексация
const text = await extractPdfText('document.pdf');

await client.collections('documents').documents().create({
  id: 'doc-123',
  title: 'Document Title',
  content: text,
  file_type: 'pdf',
  file_url: 'https://...',
});
```

### 14. Как реализовать autocomplete?

**Рекомендуемый подход:**

```typescript
// Компонент autocomplete
import { useState, useEffect } from 'react';
import { useDebouncedValue } from './hooks';

function Autocomplete() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    fetchSuggestions(debouncedQuery);
  }, [debouncedQuery]);

  async function fetchSuggestions(q: string) {
    const results = await client.search({
      query: q,
      queryBy: 'title',
      perPage: 5,
      prefix: true, // Важно для autocomplete!
      filterBy: 'is_active:=true',
      cacheSearchResultsForSeconds: 60, // Кэш для популярных запросов
    });

    setSuggestions(results.hits.map(hit => hit.document));
  }

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map(item => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### 15. Можно ли делать JOIN-ы между коллекциями?

**Нет прямых JOIN**, но есть workarounds:

**Подход 1: Denormalization (рекомендуется)**

```typescript
// Вместо:
// products { id, title, categoryId }
// categories { id, name }

// Денормализуйте:
{
  id: '123',
  title: 'Laptop',
  category: { // Embedded
    id: '456',
    name: 'Electronics',
  }
}
```

**Подход 2: Multi-search (параллельные запросы)**

```typescript
async function searchWithJoin(query: string) {
  // Поиск продуктов
  const products = await client.search({
    query,
    collection: 'products',
  });

  // Получаем категории для найденных продуктов
  const categoryIds = products.hits.map(h => h.document.categoryId);
  
  const categories = await client.multiSearch({
    searches: categoryIds.map(id => ({
      collection: 'categories',
      q: '*',
      filterBy: `id:=${id}`,
    })),
  });

  // Объединяем результаты
  return products.hits.map(hit => ({
    ...hit.document,
    category: categories.find(c => c.id === hit.document.categoryId),
  }));
}
```

### 16. Как бороться с duplicate content?

**Deduplication стратегии:**

```typescript
// 1. Уникальный ID based on content hash
import crypto from 'crypto';

function generateContentHash(content: string): string {
  return crypto.createHash('md5').update(content).digest('hex');
}

await client.collections('articles').documents().upsert({
  id: generateContentHash(article.content),
  title: article.title,
  content: article.content,
});

// 2. Grouping duplicates
const results = await client.search({
  query: 'search term',
  groupBy: 'content_hash',
  groupLimit: 1, // Один документ из каждой группы
});

// 3. Pre-processing: удаление дубликатов перед индексацией
const uniqueDocuments = removeDuplicates(documents);
await client.bulkIndex(uniqueDocuments);
```

### 17. Поддерживается ли GDPR compliance?

**Да!** Встроенные функции:

```typescript
// 1. Right to be forgotten (удаление данных пользователя)
await client.collections('users').documents().delete('user-123');

// 2. Data export (экспорт данных пользователя)
const userData = await client.collections('users').documents().retrieve('user-123');

// 3. Anonymization (анонимизация)
await client.collections('analytics').documents().update('event-456', {
  userId: 'anonymous',
  ipAddress: null,
});

// 4. Audit logging (логирование действий)
// Включается в конфигурации
```

**Self-hosted:** Полный контроль над данными.

### 18-25. (Дополнительные технические вопросы)

См. полную документацию и примеры в основных разделах.

---

## Интеграции

### 26. Как интегрировать с React?

См. [A. Примеры интеграций - React](./A-integration-examples.md#1-react-search-component-production-ready)

### 27. Как интегрировать с Django?

См. [A. Примеры интеграций - Django](./A-integration-examples.md#1-django-full-integration)

### 28. Как интегрировать с Laravel?

См. [A. Примеры интеграций - Laravel](./A-integration-examples.md#1-laravel-полная-интеграция)

### 29. Есть ли готовые плагины для WordPress?

**Да!** См. [A. Примеры интеграций - WordPress](./A-integration-examples.md#3-wordpress-plugin-полный-код)

### 30. Как интегрировать с Shopify?

```typescript
// Shopify Webhook handler
app.post('/webhooks/products/create', async (req, res) => {
  const product = req.body;

  await client.collections('products').documents().create({
    id: product.id.toString(),
    title: product.title,
    description: product.body_html,
    price: parseFloat(product.variants[0].price),
    vendor: product.vendor,
    product_type: product.product_type,
    tags: product.tags.split(','),
    images: product.images.map(img => img.src),
  });

  res.sendStatus(200);
});
```

### 31-35. (Другие интеграции)

См. [A. Примеры интеграций](./A-integration-examples.md)

---

## Биллинг и планы

### 36. Сколько стоит AACSearch?

**Pricing plans:**

1. **Developer** (Free)
   - 1M documents
   - 100K searches/month
   - Community support

2. **Startup** ($29/month)
   - 10M documents
   - 1M searches/month
   - Email support
   - Basic analytics

3. **Business** ($99/month)
   - 50M documents
   - 10M searches/month
   - Priority support
   - Advanced analytics
   - SLA 99.9%

4. **Enterprise** (Custom)
   - Unlimited documents
   - Unlimited searches
   - 24/7 support
   - Custom SLA
   - Dedicated infrastructure
   - On-premise option

### 37. Что считается как "search request"?

**Search request:**
- Любой вызов `/search` endpoint
- Autocomplete request
- Facet-only request

**Не считается:**
- Document indexing
- Collection management
- Analytics queries
- Webhook callbacks

### 38. Можно ли перейти на более дешевый план?

**Да!** Можно в любой момент:
- Downgrade в конце billing периода
- Prorated refund неиспользованной части
- Данные сохраняются (если в лимитах)

### 39. Что будет при превышении лимитов?

**Soft limits:**
- Searches > limit → throttling (429 errors)
- Documents > limit → уведомление, grace period 30 дней

**Автоматическая защита:**
- Rate limiting
- Graceful degradation
- Notifications перед hard limit

### 40-43. (Другие вопросы по биллингу)

Email: billing@aacsearch.com

---

## Безопасность

### 44. Как защитить API ключи?

**Best practices:**

```typescript
// ❌ НИКОГДА не коммитьте ключи в git
const apiKey = 'xyz123abc'; // ПЛОХО

// ✅ Используйте environment variables
const apiKey = process.env.TYPESENSE_API_KEY;

// ✅ Для frontend используйте scoped keys
const scopedKey = await fetch('/api/auth/search-key').then(r => r.json());

// ✅ Ротация ключей
// Регулярно меняйте ключи (quarterly)
```

### 45. Поддерживается ли шифрование данных?

**Да:**

- **In-transit**: TLS 1.3
- **At-rest**: AES-256 encryption
- **Database**: Encrypted backups

**Self-hosted:** Вы контролируете шифрование.

### 46. Как ограничить доступ по IP?

```typescript
// В API gateway или firewall
const allowedIPs = ['203.0.113.0/24', '198.51.100.0/24'];

app.use((req, res, next) => {
  const clientIP = req.ip;
  
  if (!allowedIPs.some(range => ipInRange(clientIP, range))) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  next();
});
```

### 47-50. (Другие вопросы безопасности)

См. [B. Recipes - Security best practices](./B-recipes.md#5-security-best-practices)

---

## Performance

### 51. Почему поиск медленный?

См. [C. Troubleshooting - Медленный поиск](./C-troubleshooting.md#1-медленный-поиск)

### 52. Как масштабировать на миллионы документов?

См. [B. Recipes - Scaling strategies](./B-recipes.md#7-scaling-strategies)

### 53. Какой оптимальный размер коллекции?

**Рекомендации:**

- **< 10M docs**: Одна коллекция на одном сервере
- **10M-50M docs**: Одна коллекция, многоядерный сервер
- **50M-100M docs**: Sharding (несколько серверов)
- **> 100M docs**: Distributed setup

### 54. Как оптимизировать memory usage?

```typescript
// 1. Удалите неиспользуемые поля
// 2. Используйте правильные типы данных
{
  price: 99.99, // float (4 bytes)
  // vs
  price: "99.99", // string (8+ bytes)
}

// 3. Ограничьте размер массивов
{
  tags: ['tag1', 'tag2'], // Хорошо
  // vs
  tags: [...10000 tags...], // Плохо
}

// 4. Включите compression
// В конфигурации Typesense
```

### 55-60. (Другие вопросы производительности)

См. [B. Recipes - Производительность поиска](./B-recipes.md#2-производительность-поиска)

---

## Не нашли ответ?

- **Документация**: https://docs.aacsearch.com
- **Community форум**: https://community.aacsearch.com
- **GitHub Issues**: https://github.com/aacsearch/platform/issues
- **Email поддержка**: support@aacsearch.com
- **Enterprise support**: enterprise@aacsearch.com

---

**Последнее обновление**: 3 ноября 2025
