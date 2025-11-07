# 4.2 Поиск

## Обзор

Система поиска AACSearch предоставляет мощные возможности для полнотекстового поиска с поддержкой опечаток, фасетов, фильтрации, сортировки и многого другого.

## Основные возможности

- **Полнотекстовый поиск** - быстрый поиск по индексируемым полям
- **Typo tolerance** - автоматическое исправление опечаток
- **Prefix/Infix search** - поиск по началу и середине слов
- **Фасеты** - группировка и фильтрация результатов
- **Сортировка** - множественные поля сортировки
- **Highlighting** - подсветка найденных терминов
- **Geo-поиск** - поиск по географическим координатам
- **Vector search** - семантический поиск

## Базовый запрос

```typescript
const results = await client.collections('products')
  .documents()
  .search({
    q: 'iPhone',
    query_by: 'name,description',
    filter_by: 'price:<1000',
    sort_by: 'rating:desc'
  })

console.log(`Found ${results.found} results`)
console.log('Hits:', results.hits)
```

## Структура ответа

```typescript
{
  found: 42,              // Общее количество найденных документов
  hits: [                 // Массив результатов
    {
      document: {         // Сам документ
        id: '1',
        name: 'iPhone 14',
        price: 999.99
      },
      highlight: {        // Подсветка
        name: {
          snippet: '<mark>iPhone</mark> 14',
          matched_tokens: ['iPhone']
        }
      },
      text_match: 578     // Релевантность (выше = лучше)
    }
  ],
  facet_counts: [         // Фасеты
    {
      field_name: 'brand',
      counts: [
        { value: 'Apple', count: 15 },
        { value: 'Samsung', count: 12 }
      ]
    }
  ],
  search_time_ms: 3       // Время поиска в мс
}
```

## Разделы документации

### [01-basic-search.md](./01-basic-search.md)
Основы поиска: query_by, prefix, infix, базовая фильтрация

**Темы:**
- Простой поиск по одному полю
- Поиск по нескольким полям
- Prefix search
- Infix search
- Wildcard поиск
- Exact match поиск

### [02-advanced-search.md](./02-advanced-search.md)
Продвинутый поиск: weights, typo tolerance, stemming, синонимы

**Темы:**
- Весовые коэффициенты полей
- Настройка typo tolerance
- Stemming и токенизация
- Локализация поиска
- Boost по полям
- Custom ranking

### [03-filters-facets.md](./03-filters-facets.md)
Фильтрация и фасеты: filter_by, facet_by, динамические фильтры

**Темы:**
- Базовая фильтрация
- Логические операторы (AND, OR, NOT)
- Диапазоны значений
- Фасетная навигация
- Динамические фасеты
- Numerical facets

### [04-sorting.md](./04-sorting.md)
Сортировка результатов: sort_by, multiple fields, custom ranking

**Темы:**
- Простая сортировка
- Множественная сортировка
- Сортировка по релевантности
- Сортировка по geo-расстоянию
- Custom ranking формулы

### [05-highlighting.md](./05-highlighting.md)
Подсветка результатов: highlight_fields, snippet generation

**Темы:**
- Базовая подсветка
- Настройка highlight тегов
- Snippet generation
- Highlight в разных полях
- Custom highlight styles

### [06-presets.md](./06-presets.md)
Search presets: сохранение и переиспользование конфигураций поиска

**Темы:**
- Создание presets
- Параметры presets
- Использование presets
- Overrides в presets
- Best practices

## Примеры использования

### E-commerce поиск

```typescript
// Поиск товаров с фильтрацией и фасетами
const results = await client.collections('products')
  .documents()
  .search({
    q: 'smartphone',
    query_by: 'name,description,brand',
    filter_by: 'price:[100..500] && in_stock:true',
    facet_by: 'brand,category,price',
    sort_by: 'rating:desc,num_reviews:desc',
    per_page: 20
  })

// Отображение фасетов
results.facet_counts.forEach(facet => {
  console.log(`${facet.field_name}:`)
  facet.counts.forEach(count => {
    console.log(`  ${count.value}: ${count.count}`)
  })
})
```

### Поиск с автодополнением

```typescript
// Autocomplete с prefix search
const suggestions = await client.collections('products')
  .documents()
  .search({
    q: 'iph',
    query_by: 'name',
    prefix: true,
    per_page: 10,
    highlight_full_fields: 'name'
  })

// Топ 10 предложений
const autocomplete = suggestions.hits.map(hit => ({
  text: hit.document.name,
  highlight: hit.highlight.name?.snippet
}))
```

### Поиск с опечатками

```typescript
// Автоматическое исправление опечаток
const results = await client.collections('products')
  .documents()
  .search({
    q: 'ipone',  // Опечатка в "iPhone"
    query_by: 'name',
    num_typos: 2,  // Допустить 2 опечатки
    typo_tokens_threshold: 1
  })

// AACSearch автоматически найдет "iPhone"
```

### Гео-поиск

```typescript
// Поиск магазинов в радиусе 5 км
const results = await client.collections('stores')
  .documents()
  .search({
    q: '*',
    filter_by: 'location:(37.7749, -122.4194, 5 km)',
    sort_by: 'location(37.7749, -122.4194):asc'
  })

// Результаты отсортированы по расстоянию
```

## Параметры поиска

### Обязательные параметры

| Параметр | Тип | Описание |
|----------|-----|----------|
| `q` | string | Поисковый запрос (`*` для всех документов) |
| `query_by` | string | Поля для поиска (через запятую) |

### Опциональные параметры

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `filter_by` | string | - | Фильтрация результатов |
| `facet_by` | string | - | Поля для фасетов |
| `sort_by` | string | - | Сортировка результатов |
| `per_page` | number | 10 | Количество результатов на страницу |
| `page` | number | 1 | Номер страницы |
| `prefix` | boolean | true | Включить prefix search |
| `num_typos` | number | 2 | Допустимое количество опечаток |
| `highlight_fields` | string | - | Поля для подсветки |
| `group_by` | string | - | Группировка результатов |
| `limit_hits` | number | - | Ограничение количества хитов |

## Best Practices

### 1. Оптимизация query_by

```typescript
// ✅ Указывайте только нужные поля
query_by: 'name,description'

// ❌ Не индексируйте все поля
query_by: 'name,description,id,price,created_at'  // Плохо
```

### 2. Используйте filter_by вместо поиска

```typescript
// ✅ Фильтруйте по точным значениям
filter_by: 'brand:Apple'

// ❌ Не ищите по точным значениям
q: 'Apple'
query_by: 'brand'  // Медленнее
```

### 3. Кешируйте популярные запросы

```typescript
const cache = new Map()

async function cachedSearch(params) {
  const key = JSON.stringify(params)

  if (cache.has(key)) {
    return cache.get(key)
  }

  const results = await client.collections('products')
    .documents()
    .search(params)

  cache.set(key, results)
  setTimeout(() => cache.delete(key), 60000)  // 1 минута

  return results
}
```

### 4. Используйте pagination

```typescript
// ✅ Пагинация для больших результатов
const results = await search({
  q: 'smartphone',
  query_by: 'name',
  per_page: 20,
  page: 1
})

// ❌ Не загружайте все сразу
const results = await search({
  q: 'smartphone',
  query_by: 'name',
  per_page: 10000  // Медленно
})
```

## Производительность

### Типичное время ответа

- Простой поиск: **1-5 мс**
- Поиск с фасетами: **5-15 мс**
- Сложный поиск с фильтрами: **10-30 мс**
- Geo-поиск: **5-20 мс**
- Vector search: **20-50 мс**

### Факторы производительности

1. **Размер индекса** - больше документов = медленнее
2. **Количество полей в query_by** - меньше полей = быстрее
3. **Сложность фильтров** - простые фильтры быстрее
4. **Количество фасетов** - меньше фасетов = быстрее
5. **Размер результатов** - меньше per_page = быстрее

## Следующие шаги

- Изучите [базовый поиск](./01-basic-search.md) для начала работы
- Освойте [продвинутые техники](./02-advanced-search.md)
- Настройте [фильтры и фасеты](./03-filters-facets.md)
- Оптимизируйте [сортировку](./04-sorting.md)
- Добавьте [подсветку](./05-highlighting.md) результатов
- Создайте [presets](./06-presets.md) для повторного использования

## Полезные ссылки

- [API Reference - Search](/docs/ru/05-api-reference/search.md)
- [Typesense Search Guide](https://typesense.org/docs/latest/api/search.html)
- [Search Best Practices](https://typesense.org/docs/guide/search-settings.html)

---

**Назад**: [← Массовый импорт](../01-collections/05-bulk-import.md) | **Далее**: [Базовый поиск →](./01-basic-search.md)
