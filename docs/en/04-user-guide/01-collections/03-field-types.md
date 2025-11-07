# 4.1.3 Типы полей

## Обзор

AACSearch поддерживает множество типов данных для различных сценариев использования. Правильный выбор типа поля критически важен для производительности, точности поиска и эффективности хранения.

## Содержание

- [String Types](#string-types)
- [Numeric Types](#numeric-types)
- [Boolean Type](#boolean-type)
- [Geopoint Types](#geopoint-types)
- [Object Types](#object-types)
- [Auto Type](#auto-type)
- [Array Types](#array-types)
- [Embedding Types](#embedding-types)

---

## String Types

### string - Обязательная строка

```typescript
{
  name: 'title',
  type: 'string',
  index: true,
  locale: 'ru'
}
```

**Использование:**
- Названия, заголовки
- Текстовый контент для поиска
- SKU, артикулы
- Email, URL

**Примеры:**

```typescript
// Индексируемая строка
{ name: 'product_name', type: 'string', index: true }

// С локалью для правильной токенизации
{ name: 'title_ru', type: 'string', index: true, locale: 'ru' }
{ name: 'title_en', type: 'string', index: true, locale: 'en' }

// Фасетируемая строка (для фильтрации)
{ name: 'category', type: 'string', facet: true }
{ name: 'brand', type: 'string', facet: true }
```

### string* - Необязательная строка

```typescript
{
  name: 'subtitle',
  type: 'string*',  // или type: 'string', optional: true
  index: true
}
```

**Использование:**
- Опциональные поля (subtitle, middle_name)
- Дополнительные описания
- Вторичные атрибуты

### string[] - Массив строк

```typescript
{
  name: 'tags',
  type: 'string[]',
  facet: true,
  index: true
}
```

**Документ:**
```json
{
  "id": "1",
  "tags": ["electronics", "smartphone", "5g"]
}
```

**Поиск:**
```typescript
// Поиск по тегам
const results = await search({
  q: 'smartphone',
  query_by: 'tags'
})

// Фильтрация
const results = await search({
  q: '*',
  filter_by: 'tags:=[electronics, smartphone]'
})
```

### Примеры использования String

#### E-commerce
```typescript
{
  fields: [
    { name: 'name', type: 'string', index: true },
    { name: 'description', type: 'string', index: true },
    { name: 'sku', type: 'string', facet: true },
    { name: 'brand', type: 'string', facet: true },
    { name: 'category', type: 'string', facet: true },
    { name: 'tags', type: 'string[]', facet: true }
  ]
}
```

#### Блог
```typescript
{
  fields: [
    { name: 'title', type: 'string', index: true },
    { name: 'content', type: 'string', index: true, store: false },
    { name: 'slug', type: 'string' },
    { name: 'author', type: 'string', facet: true },
    { name: 'categories', type: 'string[]', facet: true }
  ]
}
```

---

## Numeric Types

### int32 - 32-битное целое число

**Диапазон:** -2,147,483,648 до 2,147,483,647

```typescript
{
  name: 'quantity',
  type: 'int32',
  facet: true
}
```

**Использование:**
- Количество товаров
- Счетчики (просмотры, лайки)
- Возраст
- Год выпуска
- Рейтинги (целые числа)

**Примеры:**

```typescript
// Количество на складе
{ name: 'stock_quantity', type: 'int32', facet: true }

// Год
{ name: 'year', type: 'int32', facet: true, sort: true }

// Счетчики
{ name: 'views', type: 'int32', sort: true }
{ name: 'likes', type: 'int32', sort: true }
{ name: 'comments_count', type: 'int32' }
```

### int64 - 64-битное целое число

**Диапазон:** -9,223,372,036,854,775,808 до 9,223,372,036,854,775,807

```typescript
{
  name: 'timestamp',
  type: 'int64',
  sort: true
}
```

**Использование:**
- Unix timestamps (миллисекунды)
- Очень большие числа
- ID из внешних систем
- Размеры файлов (байты)

**Примеры:**

```typescript
// Временные метки
{ name: 'created_at', type: 'int64', sort: true }
{ name: 'updated_at', type: 'int64' }
{ name: 'published_at', type: 'int64', sort: true }

// Размер файла
{ name: 'file_size', type: 'int64', sort: true }

// Большие ID
{ name: 'external_id', type: 'int64' }
```

**Работа с датами:**

```typescript
// JavaScript
const timestamp = Date.now()  // 1704067200000

// Индексация
await client.collections('posts').documents().create({
  id: '1',
  title: 'My Post',
  created_at: Date.now()
})

// Поиск по дате
const results = await search({
  q: '*',
  filter_by: `created_at:>${Date.now() - 86400000}`  // Последние 24 часа
})

// Сортировка по дате
const results = await search({
  q: '*',
  sort_by: 'created_at:desc'  // Новые первыми
})
```

### float - Число с плавающей точкой

```typescript
{
  name: 'price',
  type: 'float',
  facet: true,
  sort: true
}
```

**Использование:**
- Цены
- Рейтинги (с дробной частью)
- Координаты (не geopoint)
- Проценты
- Любые дробные числа

**Примеры:**

```typescript
// Цена
{ name: 'price', type: 'float', facet: true, sort: true }
{ name: 'sale_price', type: 'float*', facet: true }

// Рейтинг
{ name: 'rating', type: 'float', facet: true, sort: true }

// Проценты
{ name: 'discount_percent', type: 'float', facet: true }

// Вес, размеры
{ name: 'weight_kg', type: 'float' }
{ name: 'height_cm', type: 'float' }
```

**Работа с ценами:**

```typescript
// Индексация
await client.collections('products').documents().create({
  id: '1',
  name: 'iPhone 14',
  price: 999.99,
  sale_price: 899.99,
  discount_percent: 10.0
})

// Фильтрация по диапазону
const results = await search({
  q: '*',
  filter_by: 'price:[100..500]'  // От $100 до $500
})

// Фасеты для ценовых диапазонов
const results = await search({
  q: '*',
  facet_by: 'price',
  facet_query: 'price:[0..100],price:[100..500],price:[500..1000]'
})
```

### Массивы чисел

```typescript
// Массив int32
{ name: 'scores', type: 'int32[]' }

// Массив float
{ name: 'ratings', type: 'float[]' }

// Пример документа
{
  "id": "1",
  "scores": [85, 90, 78, 92],
  "ratings": [4.5, 4.7, 4.2]
}
```

---

## Boolean Type

### bool - Логическое значение

```typescript
{
  name: 'in_stock',
  type: 'bool',
  facet: true
}
```

**Значения:** `true` или `false`

**Использование:**
- Наличие товара
- Публикация (published/draft)
- Флаги состояния
- Включено/выключено

**Примеры:**

```typescript
// E-commerce
{ name: 'in_stock', type: 'bool', facet: true }
{ name: 'on_sale', type: 'bool', facet: true }
{ name: 'free_shipping', type: 'bool', facet: true }

// Контент
{ name: 'published', type: 'bool', facet: true }
{ name: 'featured', type: 'bool', facet: true }

// Разрешения
{ name: 'is_public', type: 'bool', facet: true }
{ name: 'verified', type: 'bool', facet: true }
```

**Фильтрация:**

```typescript
// Только товары в наличии
const results = await search({
  q: '*',
  filter_by: 'in_stock:true'
})

// Опубликованные и featured
const results = await search({
  q: '*',
  filter_by: 'published:true && featured:true'
})

// Фасеты
const results = await search({
  q: '*',
  facet_by: 'in_stock,on_sale,free_shipping'
})
```

---

## Geopoint Types

### geopoint - Географическая точка

```typescript
{
  name: 'location',
  type: 'geopoint',
  index: true
}
```

**Формат:** `[latitude, longitude]` или `"lat,lng"`

**Использование:**
- Адреса магазинов
- Локации событий
- Координаты доставки
- Геопоиск

**Примеры документов:**

```typescript
// Массив [lat, lng]
{
  "id": "1",
  "name": "Apple Store",
  "location": [37.7749, -122.4194]  // Сан-Франциско
}

// Строка "lat,lng"
{
  "id": "2",
  "name": "Google Office",
  "location": "37.4220,-122.0841"  // Маунтин-Вью
}
```

**Геопоиск по радиусу:**

```typescript
// Найти магазины в радиусе 10 км
const results = await search({
  q: '*',
  filter_by: 'location:(37.7749, -122.4194, 10 km)'
})

// С сортировкой по расстоянию
const results = await search({
  q: '*',
  filter_by: 'location:(37.7749, -122.4194, 50 km)',
  sort_by: 'location(37.7749, -122.4194):asc'
})
```

**Геопоиск по полигону:**

```typescript
// Поиск внутри области (polygon)
const results = await search({
  q: '*',
  filter_by: 'location:(37.7749, -122.4194, 37.8044, -122.2711, 37.7294, -122.3927)'
})
```

### geopoint[] - Массив координат

```typescript
{
  name: 'route',
  type: 'geopoint[]'
}
```

**Использование:**
- Маршруты доставки
- Границы зон
- Множественные локации

**Пример:**

```typescript
{
  "id": "delivery-1",
  "route": [
    [37.7749, -122.4194],  // Точка A
    [37.7849, -122.4094],  // Точка B
    [37.7949, -122.3994]   // Точка C
  ]
}
```

---

## Object Types

### object - Вложенный объект

```typescript
{
  name: 'address',
  type: 'object',
  fields: [
    { name: 'street', type: 'string' },
    { name: 'city', type: 'string', facet: true },
    { name: 'postal_code', type: 'string' },
    { name: 'country', type: 'string', facet: true }
  ]
}
```

**Документ:**

```json
{
  "id": "1",
  "name": "John Doe",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "postal_code": "10001",
    "country": "USA"
  }
}
```

**Поиск по вложенным полям:**

```typescript
// Поиск по городу
const results = await search({
  q: 'New York',
  query_by: 'address.city'
})

// Фильтрация
const results = await search({
  q: '*',
  filter_by: 'address.country:USA && address.city:New York'
})

// Фасеты
const results = await search({
  q: '*',
  facet_by: 'address.city,address.country'
})
```

### object[] - Массив объектов

```typescript
{
  name: 'variants',
  type: 'object[]',
  fields: [
    { name: 'sku', type: 'string', index: true },
    { name: 'color', type: 'string', facet: true },
    { name: 'size', type: 'string', facet: true },
    { name: 'price', type: 'float', facet: true }
  ]
}
```

**Документ:**

```json
{
  "id": "1",
  "name": "T-Shirt",
  "variants": [
    {
      "sku": "TSHIRT-RED-S",
      "color": "red",
      "size": "S",
      "price": 19.99
    },
    {
      "sku": "TSHIRT-RED-M",
      "color": "red",
      "size": "M",
      "price": 19.99
    }
  ]
}
```

**Поиск в массиве объектов:**

```typescript
// Поиск по SKU варианта
const results = await search({
  q: 'TSHIRT-RED-M',
  query_by: 'variants.sku'
})

// Фильтрация по цвету и размеру
const results = await search({
  q: '*',
  filter_by: 'variants.color:red && variants.size:M'
})

// Фасеты по вариантам
const results = await search({
  q: '*',
  facet_by: 'variants.color,variants.size'
})
```

### Глубокая вложенность

```typescript
{
  name: 'company',
  type: 'object',
  fields: [
    { name: 'name', type: 'string', index: true },
    {
      name: 'address',
      type: 'object',
      fields: [
        { name: 'street', type: 'string' },
        { name: 'city', type: 'string', facet: true },
        {
          name: 'coordinates',
          type: 'object',
          fields: [
            { name: 'lat', type: 'float' },
            { name: 'lng', type: 'float' }
          ]
        }
      ]
    }
  ]
}

// Документ
{
  "company": {
    "name": "Acme Corp",
    "address": {
      "street": "123 Business Ave",
      "city": "New York",
      "coordinates": {
        "lat": 40.7128,
        "lng": -74.0060
      }
    }
  }
}

// Поиск
filter_by: 'company.address.city:New York'
```

---

## Auto Type

### auto - Автоопределяемый тип

```typescript
{
  name: 'custom_field',
  type: 'auto'
}
```

**Автоматическое определение типа:**

```typescript
// String
{ "custom_field": "hello" } → type: 'string'

// Number
{ "custom_field": 42 } → type: 'int32'
{ "custom_field": 3.14 } → type: 'float'

// Boolean
{ "custom_field": true } → type: 'bool'

// Array
{ "custom_field": ["a", "b"] } → type: 'string[]'
{ "custom_field": [1, 2, 3] } → type: 'int32[]'
```

**Использование:**

- Динамические поля
- Прототипирование
- Интеграции с неопределенной схемой

**⚠️ Ограничения:**

- Первый документ определяет тип
- Все последующие документы должны соответствовать
- Менее производительно, чем явные типы

---

## Array Types

Любой базовый тип можно сделать массивом, добавив `[]`:

```typescript
// Массивы строк
type: 'string[]'
type: 'string[]*'  // Необязательный массив

// Массивы чисел
type: 'int32[]'
type: 'int64[]'
type: 'float[]'

// Массив geopoint
type: 'geopoint[]'

// Массив объектов
type: 'object[]'
```

**Примеры использования:**

```typescript
{
  fields: [
    // Теги
    { name: 'tags', type: 'string[]', facet: true },

    // Категории
    { name: 'categories', type: 'string[]', facet: true },

    // Оценки
    { name: 'ratings', type: 'float[]' },

    // Множественные локации
    { name: 'stores', type: 'geopoint[]' }
  ]
}
```

---

## Embedding Types

### float[] - Векторные embeddings

```typescript
{
  name: 'embedding',
  type: 'float[]',
  num_dim: 384  // Размерность вектора
}
```

**Использование:**
- Semantic search
- Vector search
- AI-powered поиск
- Поиск по изображениям

**Создание embeddings:**

```typescript
import { OpenAIEmbeddings } from '@langchain/openai'

const embeddings = new OpenAIEmbeddings({
  modelName: 'text-embedding-3-small',
  dimensions: 384
})

// Генерация embedding
const vector = await embeddings.embedQuery('iPhone 14 Pro')

// Индексация с embedding
await client.collections('products').documents().create({
  id: '1',
  name: 'iPhone 14 Pro',
  embedding: vector  // [0.123, -0.456, 0.789, ...]
})
```

**Vector search:**

```typescript
// Поиск похожих товаров
const queryVector = await embeddings.embedQuery('smartphone')

const results = await search({
  q: '*',
  vector_query: `embedding:(${queryVector.join(',')}, k:10)`
})
```

**Поддерживаемые модели:**

| Модель | Размерность | Описание |
|--------|------------|----------|
| OpenAI text-embedding-3-small | 384-1536 | Быстрый, недорогой |
| OpenAI text-embedding-3-large | 1024-3072 | Высокая точность |
| Cohere embed-english-v3.0 | 1024 | Английский язык |
| Cohere embed-multilingual-v3.0 | 1024 | Мультиязычный |
| sentence-transformers/all-MiniLM-L6-v2 | 384 | Open source |

---

## Сравнительная таблица типов

| Тип | Размер | Индекс | Фасет | Сортировка | Geo | Пример |
|-----|--------|--------|-------|------------|-----|--------|
| string | Переменный | ✅ | ✅ | ❌ | ❌ | "iPhone" |
| string[] | Переменный | ✅ | ✅ | ❌ | ❌ | ["tech", "mobile"] |
| int32 | 4 bytes | ❌ | ✅ | ✅ | ❌ | 42 |
| int64 | 8 bytes | ❌ | ✅ | ✅ | ❌ | 1704067200000 |
| float | 8 bytes | ❌ | ✅ | ✅ | ❌ | 99.99 |
| bool | 1 byte | ❌ | ✅ | ❌ | ❌ | true |
| geopoint | 16 bytes | ✅ | ❌ | ✅ | ✅ | [37.7749, -122.4194] |
| object | Переменный | ✅ | ✅ | ❌ | ❌ | {"city": "NY"} |
| auto | Переменный | ✅ | ✅ | ✅ | ❌ | any |
| float[] (embedding) | num_dim * 4 | ❌ | ❌ | ❌ | ❌ | [0.1, 0.2, ...] |

---

## Best Practices

### 1. Выбор правильного типа

```typescript
// ✅ Правильно
{ name: 'year', type: 'int32' }        // Год как число
{ name: 'price', type: 'float' }       // Цена как float
{ name: 'tags', type: 'string[]' }     // Теги как массив

// ❌ Неправильно
{ name: 'year', type: 'string' }       // Год как строка
{ name: 'price', type: 'int32' }       // Цена без копеек
{ name: 'tags', type: 'string' }       // Теги как одна строка
```

### 2. Оптимизация размера

```typescript
// ✅ Используйте int32 где возможно
{ name: 'quantity', type: 'int32' }    // Достаточно для количества

// ❌ Не используйте int64 без необходимости
{ name: 'quantity', type: 'int64' }    // Избыточно (в 2 раза больше памяти)
```

### 3. Индексация

```typescript
// ✅ Индексируйте только текстовые поля для поиска
{ name: 'title', type: 'string', index: true }
{ name: 'description', type: 'string', index: true }

// ❌ Не индексируйте числа и ID
{ name: 'id', type: 'string', index: true }      // Не нужно
{ name: 'price', type: 'float', index: true }    // Не работает
```

### 4. Фасеты

```typescript
// ✅ Используйте фасеты для фильтрации
{ name: 'category', type: 'string', facet: true }
{ name: 'brand', type: 'string', facet: true }
{ name: 'price', type: 'float', facet: true }
{ name: 'in_stock', type: 'bool', facet: true }

// ✅ Фасеты работают с массивами
{ name: 'tags', type: 'string[]', facet: true }
```

---

## Следующие шаги

- Настройте [индексацию документов](./04-indexing.md)
- Изучите [массовый импорт](./05-bulk-import.md)
- Перейдите к [основам поиска](../02-search/01-basic-search.md)

---

**Назад**: [← Проектирование схем](./02-schemas.md) | **Далее**: [Индексация документов →](./04-indexing.md)
