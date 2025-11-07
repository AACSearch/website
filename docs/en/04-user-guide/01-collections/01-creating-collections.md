# 4.1.1 Создание коллекций

## Обзор

В AACSearch существует несколько способов создания коллекций: через графический интерфейс (UI), с помощью мастера создания (Wizard), из готовых шаблонов (Templates) или программно через API. В этом руководстве подробно рассмотрены все методы.

## Содержание

- [Создание через UI](#создание-через-ui)
- [Wizard создания коллекций](#wizard-создания-коллекций)
- [Использование Templates](#использование-templates)
- [Создание через API](#создание-через-api)
- [Импорт существующих данных](#импорт-существующих-данных)
- [Клонирование коллекций](#клонирование-коллекций)
- [Best Practices](#best-practices)

---

## Создание через UI

### Шаг 1: Открытие интерфейса создания

1. Войдите в административную панель AACSearch
2. Перейдите в раздел **"Коллекции"** в боковом меню
3. Нажмите кнопку **"+ Создать коллекцию"**

![Create Collection Button](../../assets/screenshots/create-collection-btn.png)

### Шаг 2: Выбор способа создания

После нажатия кнопки создания откроется модальное окно с тремя опциями:

```
┌──────────────────────────────────────────┐
│  Как вы хотите создать коллекцию?        │
├──────────────────────────────────────────┤
│  🧙 Использовать мастер                  │
│     Пошаговое создание с подсказками     │
│                                          │
│  📋 Выбрать шаблон                       │
│     Готовые настройки для типовых задач  │
│                                          │
│  ⚡ Создать вручную                      │
│     Полный контроль над настройками      │
└──────────────────────────────────────────┘
```

### Шаг 3: Ручное создание

Если выбран ручной режим:

#### 3.1 Основные настройки

```typescript
// Форма основных настроек
{
  name: string              // Имя коллекции (обязательно)
  description?: string      // Описание коллекции
  enable_nested_fields: boolean  // Поддержка вложенных полей
}
```

**Пример заполнения:**

- **Имя коллекции**: `products`
- **Описание**: `Каталог товаров интернет-магазина`
- **Вложенные поля**: ✅ Включено

#### 3.2 Определение полей

После основных настроек переходим к добавлению полей:

**Форма добавления поля:**

```typescript
{
  name: string           // Имя поля
  type: FieldType        // Тип данных
  optional: boolean      // Необязательное поле
  index: boolean         // Индексировать для поиска
  facet: boolean         // Использовать для фасетов
  sort: boolean          // Использовать для сортировки
  locale: string         // Локаль для языкозависимых операций
}
```

**Пример добавления поля "name":**

```
Имя поля:        name
Тип:             string
Необязательное:  ☐
Индексируемое:   ☑
Фасет:          ☐
Сортировка:     ☐
```

**Пример добавления поля "price":**

```
Имя поля:        price
Тип:             float
Необязательное:  ☐
Индексируемое:   ☐
Фасет:          ☑
Сортировка:     ☑
```

#### 3.3 Настройки индексации

После определения полей настраиваем параметры индексации:

```typescript
{
  // Поле для сортировки по умолчанию
  default_sorting_field?: string

  // Символы-разделители для токенизации
  token_separators?: string[]

  // Символы, сохраняемые в индексе
  symbols_to_index?: string[]

  // Язык для стемминга
  stem_language?: string
}
```

**Пример настроек:**

```yaml
default_sorting_field: "created_at"
token_separators: ["-", "_"]
symbols_to_index: ["+", "#", "@"]
stem_language: "russian"
```

#### 3.4 Предпросмотр и создание

Перед созданием система показывает JSON-схему:

```json
{
  "name": "products",
  "fields": [
    {
      "name": "id",
      "type": "string"
    },
    {
      "name": "name",
      "type": "string",
      "index": true
    },
    {
      "name": "price",
      "type": "float",
      "facet": true,
      "sort": true
    }
  ],
  "default_sorting_field": "created_at"
}
```

Нажмите **"Создать коллекцию"** для завершения.

---

## Wizard создания коллекций

Мастер создания (Wizard) - это интерактивный пошаговый процесс, идеальный для начинающих пользователей.

### Запуск Wizard

1. Нажмите **"+ Создать коллекцию"**
2. Выберите **"🧙 Использовать мастер"**

### Шаг 1/5: Тип данных

Wizard первым делом спросит о типе данных:

```
┌─────────────────────────────────────────┐
│  Какой тип данных вы будете хранить?    │
├─────────────────────────────────────────┤
│  ○ E-commerce товары                    │
│  ○ Блог / Новости                       │
│  ○ Пользователи / Профили               │
│  ○ Документы / Файлы                    │
│  ○ Геоданные / Локации                  │
│  ○ События / Календарь                  │
│  ○ Другое                               │
└─────────────────────────────────────────┘
```

**Выбор типа определяет:**
- Предзаполненные поля схемы
- Рекомендуемые настройки индексации
- Подсказки по best practices

**Пример выбора**: E-commerce товары

### Шаг 2/5: Основные поля

На основе выбранного типа Wizard предложит базовые поля:

```typescript
// Для E-commerce автоматически добавляются:
{
  fields: [
    { name: 'id', type: 'string' },           // ID товара
    { name: 'name', type: 'string', index: true },    // Название
    { name: 'description', type: 'string', index: true }, // Описание
    { name: 'price', type: 'float', facet: true },   // Цена
    { name: 'brand', type: 'string', facet: true },  // Бренд
    { name: 'in_stock', type: 'bool', facet: true }, // В наличии
  ]
}
```

**Интерфейс редактирования:**

```
┌─────────────────────────────────────────────────┐
│  Базовые поля для товаров                       │
├─────────────────────────────────────────────────┤
│  ☑ ID товара           [string]                 │
│  ☑ Название            [string] [indexed]       │
│  ☑ Описание            [string] [indexed]       │
│  ☑ Цена                [float] [facet]          │
│  ☑ Бренд               [string] [facet]         │
│  ☑ В наличии           [bool] [facet]           │
│                                                  │
│  + Добавить поле                                │
└─────────────────────────────────────────────────┘
```

Вы можете:
- Снять галочки с ненужных полей
- Добавить свои кастомные поля
- Изменить типы и настройки

### Шаг 3/5: Дополнительные возможности

Wizard предлагает включить дополнительные функции:

```
┌─────────────────────────────────────────────────┐
│  Дополнительные возможности                     │
├─────────────────────────────────────────────────┤
│  ☑ Поддержка изображений                        │
│     Добавить поля для URL изображений           │
│                                                  │
│  ☑ Категории                                    │
│     Многоуровневая система категорий            │
│                                                  │
│  ☐ Рейтинги и отзывы                            │
│     Поля для оценок и количества отзывов        │
│                                                  │
│  ☑ Временные метки                              │
│     created_at, updated_at                      │
│                                                  │
│  ☐ Гео-поиск                                    │
│     Поля для координат и адресов                │
└─────────────────────────────────────────────────┘
```

**Если включена "Поддержка изображений", добавятся:**

```typescript
{
  name: 'image_url',
  type: 'string'
},
{
  name: 'image_urls',
  type: 'string[]'
}
```

**Если включены "Категории", добавятся:**

```typescript
{
  name: 'category',
  type: 'string',
  facet: true
},
{
  name: 'category_path',
  type: 'string[]',
  facet: true
}
```

### Шаг 4/5: Настройки поиска

Wizard помогает настроить параметры поиска:

```
┌─────────────────────────────────────────────────┐
│  Настройки поиска                               │
├─────────────────────────────────────────────────┤
│  Язык контента:                                 │
│  ○ Русский         ● Английский                 │
│  ○ Мультиязычный   ○ Другой                     │
│                                                  │
│  Опечатки (typo tolerance):                     │
│  [■■■□□] Средняя (2 символа)                    │
│                                                  │
│  Поиск по префиксу:                             │
│  ☑ Включить (рекомендуется)                     │
│                                                  │
│  Сортировка по умолчанию:                       │
│  [price ▼]                                      │
└─────────────────────────────────────────────────┘
```

**Эти настройки влияют на:**

```typescript
{
  // Язык стемминга
  stem_language: 'english',

  // Допустимое количество опечаток
  num_typos: 2,

  // Поиск по префиксу последнего слова
  prefix: true,

  // Поле сортировки по умолчанию
  default_sorting_field: 'price'
}
```

### Шаг 5/5: Итоговый обзор

Финальный шаг показывает полную схему и предлагает:

1. **Предпросмотр JSON схемы**
2. **Тестирование с примерами данных**
3. **Сохранение как шаблон**

```json
{
  "name": "products",
  "fields": [
    {
      "name": "id",
      "type": "string"
    },
    {
      "name": "name",
      "type": "string",
      "index": true,
      "locale": "en"
    },
    {
      "name": "description",
      "type": "string",
      "index": true
    },
    {
      "name": "price",
      "type": "float",
      "facet": true,
      "sort": true
    },
    {
      "name": "brand",
      "type": "string",
      "facet": true
    },
    {
      "name": "image_url",
      "type": "string"
    },
    {
      "name": "category_path",
      "type": "string[]",
      "facet": true
    },
    {
      "name": "in_stock",
      "type": "bool",
      "facet": true
    },
    {
      "name": "created_at",
      "type": "int64"
    }
  ],
  "default_sorting_field": "price",
  "token_separators": ["-", "_"],
  "stem_language": "english"
}
```

**Кнопки действий:**

- **← Назад** - вернуться к предыдущему шагу
- **💾 Сохранить как шаблон** - сохранить для повторного использования
- **🧪 Протестировать** - загрузить тестовые данные
- **✅ Создать коллекцию** - финальное создание

---

## Использование Templates

Templates (шаблоны) - это готовые конфигурации коллекций для популярных сценариев использования.

### Доступные шаблоны

#### 1. E-commerce Products

**Описание**: Коллекция для интернет-магазинов с товарами, ценами, категориями.

**Схема:**

```typescript
{
  name: 'products',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string', index: true },
    { name: 'description', type: 'string', index: true },
    { name: 'sku', type: 'string', facet: true },
    { name: 'price', type: 'float', facet: true },
    { name: 'sale_price', type: 'float', optional: true },
    { name: 'currency', type: 'string', facet: true },
    { name: 'brand', type: 'string', facet: true },
    { name: 'categories', type: 'string[]', facet: true },
    { name: 'tags', type: 'string[]', facet: true },
    { name: 'image_url', type: 'string' },
    { name: 'in_stock', type: 'bool', facet: true },
    { name: 'stock_quantity', type: 'int32' },
    { name: 'rating', type: 'float', sort: true },
    { name: 'num_reviews', type: 'int32', sort: true },
    { name: 'created_at', type: 'int64', sort: true },
    { name: 'updated_at', type: 'int64' }
  ],
  default_sorting_field: 'created_at'
}
```

**Использование:**

```bash
# Через UI
Collections → Create → Choose Template → E-commerce Products

# Через API
POST /collections/create-from-template
{
  "template": "ecommerce-products",
  "name": "my_products"
}
```

#### 2. Blog Posts

**Описание**: Коллекция для блогов и новостных сайтов.

**Схема:**

```typescript
{
  name: 'posts',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'title', type: 'string', index: true },
    { name: 'content', type: 'string', index: true },
    { name: 'excerpt', type: 'string', index: true },
    { name: 'slug', type: 'string', unique: true },
    { name: 'author', type: 'string', facet: true },
    { name: 'author_id', type: 'string', facet: true },
    { name: 'categories', type: 'string[]', facet: true },
    { name: 'tags', type: 'string[]', facet: true },
    { name: 'featured_image', type: 'string' },
    { name: 'published', type: 'bool', facet: true },
    { name: 'published_at', type: 'int64', sort: true },
    { name: 'views', type: 'int32', sort: true },
    { name: 'likes', type: 'int32', sort: true }
  ],
  default_sorting_field: 'published_at'
}
```

#### 3. Geo Locations

**Описание**: Коллекция для локаций с географическим поиском.

**Схема:**

```typescript
{
  name: 'locations',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string', index: true },
    { name: 'description', type: 'string', index: true },
    { name: 'address', type: 'string', index: true },
    { name: 'city', type: 'string', facet: true },
    { name: 'state', type: 'string', facet: true },
    { name: 'country', type: 'string', facet: true },
    { name: 'postal_code', type: 'string' },
    { name: 'location', type: 'geopoint' },
    { name: 'phone', type: 'string' },
    { name: 'website', type: 'string' },
    { name: 'rating', type: 'float', sort: true },
    { name: 'category', type: 'string', facet: true },
    { name: 'tags', type: 'string[]', facet: true }
  ],
  default_sorting_field: 'rating'
}
```

#### 4. Documents Library

**Описание**: Коллекция для хранения документов и файлов.

**Схема:**

```typescript
{
  name: 'documents',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'title', type: 'string', index: true },
    { name: 'content', type: 'string', index: true },
    { name: 'file_type', type: 'string', facet: true },
    { name: 'file_size', type: 'int64', sort: true },
    { name: 'file_url', type: 'string' },
    { name: 'mime_type', type: 'string', facet: true },
    { name: 'author', type: 'string', facet: true },
    { name: 'tags', type: 'string[]', facet: true },
    { name: 'folder', type: 'string', facet: true },
    { name: 'created_at', type: 'int64', sort: true },
    { name: 'modified_at', type: 'int64', sort: true },
    { name: 'downloads', type: 'int32', sort: true }
  ],
  default_sorting_field: 'modified_at'
}
```

#### 5. Events Calendar

**Описание**: Коллекция для событий и мероприятий.

**Схема:**

```typescript
{
  name: 'events',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'title', type: 'string', index: true },
    { name: 'description', type: 'string', index: true },
    { name: 'organizer', type: 'string', facet: true },
    { name: 'venue', type: 'string', index: true },
    { name: 'location', type: 'geopoint' },
    { name: 'start_date', type: 'int64', sort: true },
    { name: 'end_date', type: 'int64' },
    { name: 'category', type: 'string', facet: true },
    { name: 'tags', type: 'string[]', facet: true },
    { name: 'price', type: 'float', facet: true },
    { name: 'free', type: 'bool', facet: true },
    { name: 'capacity', type: 'int32' },
    { name: 'registered', type: 'int32' },
    { name: 'status', type: 'string', facet: true }
  ],
  default_sorting_field: 'start_date'
}
```

### Кастомизация шаблона

После выбора шаблона можно:

1. **Изменить имя коллекции**
2. **Добавить/удалить поля**
3. **Изменить типы полей**
4. **Настроить индексацию**
5. **Добавить кастомные настройки**

**Пример кастомизации:**

```typescript
// Базовый шаблон E-commerce
const template = getTemplate('ecommerce-products')

// Добавляем свои поля
template.fields.push(
  { name: 'supplier', type: 'string', facet: true },
  { name: 'warranty_months', type: 'int32' },
  { name: 'eco_friendly', type: 'bool', facet: true }
)

// Изменяем настройки
template.default_sorting_field = 'rating'
template.stem_language = 'russian'

// Создаем коллекцию
await createCollection(template)
```

---

## Создание через API

### REST API

#### Базовое создание

```typescript
import { TypesenseClient } from '@aacsearch/client'

const client = new TypesenseClient({
  nodes: [{
    host: 'localhost',
    port: 8108,
    protocol: 'http'
  }],
  apiKey: 'your-api-key'
})

// Создание коллекции
const schema = {
  name: 'products',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string', index: true },
    { name: 'price', type: 'float', facet: true }
  ],
  default_sorting_field: 'price'
}

const collection = await client.collections().create(schema)
console.log('Collection created:', collection.name)
```

#### С дополнительными настройками

```typescript
const advancedSchema = {
  name: 'products_advanced',
  fields: [
    {
      name: 'id',
      type: 'string'
    },
    {
      name: 'name',
      type: 'string',
      index: true,
      locale: 'ru'  // Русская локаль
    },
    {
      name: 'description',
      type: 'string',
      index: true,
      store: false  // Не сохранять в индексе (экономия места)
    },
    {
      name: 'price',
      type: 'float',
      facet: true,
      sort: true
    }
  ],
  default_sorting_field: 'price',
  token_separators: ['-', '_', '/'],
  symbols_to_index: ['+', '#', '@'],
  stem_language: 'russian',
  enable_nested_fields: true
}

await client.collections().create(advancedSchema)
```

### GraphQL API

```graphql
mutation CreateCollection($input: CreateCollectionInput!) {
  createCollection(input: $input) {
    id
    name
    fields {
      name
      type
      index
      facet
    }
    numDocuments
    createdAt
  }
}
```

**Variables:**

```json
{
  "input": {
    "name": "products",
    "fields": [
      {
        "name": "id",
        "type": "string"
      },
      {
        "name": "name",
        "type": "string",
        "index": true
      },
      {
        "name": "price",
        "type": "float",
        "facet": true
      }
    ],
    "defaultSortingField": "price"
  }
}
```

### SDK Examples

#### JavaScript/TypeScript

```typescript
import { AACSearchClient } from '@aacsearch/sdk-js'

const client = new AACSearchClient({
  apiKey: process.env.AACSEARCH_API_KEY,
  apiUrl: 'https://api.aacsearch.com'
})

// Создание с builder pattern
const collection = await client.collections
  .create()
  .name('products')
  .field('id', 'string')
  .field('name', 'string', { index: true })
  .field('price', 'float', { facet: true, sort: true })
  .defaultSort('price')
  .build()

console.log(`Created: ${collection.name}`)
```

#### Python

```python
from aacsearch import Client

client = Client(
    api_key='your-api-key',
    api_url='https://api.aacsearch.com'
)

# Создание коллекции
schema = {
    'name': 'products',
    'fields': [
        {'name': 'id', 'type': 'string'},
        {'name': 'name', 'type': 'string', 'index': True},
        {'name': 'price', 'type': 'float', 'facet': True}
    ],
    'default_sorting_field': 'price'
}

collection = client.collections.create(schema)
print(f'Collection created: {collection.name}')
```

#### PHP

```php
<?php
use AACSearch\Client;

$client = new Client([
    'api_key' => 'your-api-key',
    'api_url' => 'https://api.aacsearch.com'
]);

$schema = [
    'name' => 'products',
    'fields' => [
        ['name' => 'id', 'type' => 'string'],
        ['name' => 'name', 'type' => 'string', 'index' => true],
        ['name' => 'price', 'type' => 'float', 'facet' => true]
    ],
    'default_sorting_field' => 'price'
];

$collection = $client->collections()->create($schema);
echo "Collection created: {$collection->name}\n";
```

---

## Импорт существующих данных

### Создание коллекции с автоопределением схемы

AACSearch может автоматически создать схему на основе данных:

```typescript
// Загрузка данных
const sampleData = [
  {
    id: '1',
    name: 'iPhone 14',
    price: 999.99,
    brand: 'Apple',
    in_stock: true,
    tags: ['mobile', 'tech']
  },
  {
    id: '2',
    name: 'Samsung Galaxy S23',
    price: 899.99,
    brand: 'Samsung',
    in_stock: true,
    tags: ['mobile', 'android']
  }
]

// Автосоздание схемы
const collection = await client.collections().createFromData({
  name: 'products',
  data: sampleData,
  options: {
    autoIndex: true,      // Автоматически определить индексируемые поля
    autoFacet: true,      // Автоматически определить фасетируемые поля
    detectArrays: true    // Определить поля-массивы
  }
})

console.log('Schema created:', collection.fields)
```

**Результат автоопределения:**

```typescript
{
  name: 'products',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string', index: true },
    { name: 'price', type: 'float', facet: true },
    { name: 'brand', type: 'string', facet: true },
    { name: 'in_stock', type: 'bool', facet: true },
    { name: 'tags', type: 'string[]', facet: true }
  ]
}
```

### Импорт из файла

```typescript
// Из JSON файла
const jsonData = await fs.readFile('products.json', 'utf-8')
const data = JSON.parse(jsonData)

await client.collections().createFromData({
  name: 'products',
  data: data
})

// Из CSV файла
const csvData = await fs.readFile('products.csv', 'utf-8')

await client.collections().createFromCSV({
  name: 'products',
  csv: csvData,
  options: {
    delimiter: ',',
    headers: true,
    typeInference: true
  }
})
```

---

## Клонирование коллекций

### Клонирование схемы

Создание новой коллекции на основе существующей:

```typescript
// Получить схему существующей коллекции
const sourceCollection = await client.collections('products').retrieve()

// Создать новую с той же схемой
const clonedSchema = {
  ...sourceCollection,
  name: 'products_backup'  // Новое имя
}

delete clonedSchema.num_documents
delete clonedSchema.created_at

await client.collections().create(clonedSchema)
```

### Клонирование с данными

```typescript
// Функция полного клонирования
async function cloneCollection(
  sourceName: string,
  targetName: string,
  includeData: boolean = true
) {
  // 1. Получить схему
  const source = await client.collections(sourceName).retrieve()

  // 2. Создать новую коллекцию
  const schema = {
    name: targetName,
    fields: source.fields,
    default_sorting_field: source.default_sorting_field,
    token_separators: source.token_separators,
    symbols_to_index: source.symbols_to_index
  }

  const target = await client.collections().create(schema)

  // 3. Копировать данные (если нужно)
  if (includeData) {
    // Экспорт из источника
    const documents = await client.collections(sourceName)
      .documents()
      .export()

    // Импорт в целевую
    await client.collections(targetName)
      .documents()
      .import(documents)
  }

  return target
}

// Использование
await cloneCollection('products', 'products_v2', true)
```

---

## Best Practices

### 1. Именование коллекций

**✅ Хорошо:**
```
products
blog_posts
user_profiles
```

**❌ Плохо:**
```
Produc1!
data_123
temp
```

**Правила:**
- Используйте snake_case или kebab-case
- Описательные имена (не `col1`, `temp`)
- Без специальных символов
- Английские названия для совместимости

### 2. Планирование схемы

```typescript
// ✅ Продумайте схему заранее
const schema = {
  name: 'products',
  fields: [
    // ID всегда первым
    { name: 'id', type: 'string' },

    // Индексируемые поля
    { name: 'name', type: 'string', index: true },
    { name: 'description', type: 'string', index: true },

    // Фасетируемые поля
    { name: 'brand', type: 'string', facet: true },
    { name: 'category', type: 'string', facet: true },

    // Числовые поля для сортировки
    { name: 'price', type: 'float', sort: true },
    { name: 'rating', type: 'float', sort: true },

    // Временные метки
    { name: 'created_at', type: 'int64' },
    { name: 'updated_at', type: 'int64' }
  ]
}
```

### 3. Версионирование коллекций

Для безопасных миграций используйте версии:

```typescript
// Создание новой версии
await client.collections().create({
  name: 'products_v2',
  fields: [/* новая схема */]
})

// Миграция данных
await migrateData('products_v1', 'products_v2')

// Переключение через alias
await client.aliases().upsert({
  name: 'products',
  collection_name: 'products_v2'
})

// Удаление старой версии (опционально)
await client.collections('products_v1').delete()
```

### 4. Тестирование перед созданием

```typescript
// Валидация схемы перед созданием
function validateSchema(schema: CollectionSchema): ValidationResult {
  const errors: string[] = []

  // Проверка имени
  if (!/^[a-z0-9_-]+$/.test(schema.name)) {
    errors.push('Invalid collection name')
  }

  // Проверка полей
  const fieldNames = new Set()
  for (const field of schema.fields) {
    if (fieldNames.has(field.name)) {
      errors.push(`Duplicate field: ${field.name}`)
    }
    fieldNames.add(field.name)

    // Проверка типов
    const validTypes = ['string', 'int32', 'int64', 'float', 'bool', 'geopoint']
    if (!validTypes.includes(field.type.replace(/\*|\[\]/, ''))) {
      errors.push(`Invalid type for field ${field.name}`)
    }
  }

  // Проверка default_sorting_field
  if (schema.default_sorting_field) {
    const sortField = schema.fields.find(f => f.name === schema.default_sorting_field)
    if (!sortField) {
      errors.push('default_sorting_field not found in fields')
    } else if (!['int32', 'int64', 'float'].includes(sortField.type)) {
      errors.push('default_sorting_field must be numeric type')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// Использование
const result = validateSchema(mySchema)
if (result.valid) {
  await client.collections().create(mySchema)
} else {
  console.error('Validation errors:', result.errors)
}
```

### 5. Обработка ошибок

```typescript
async function createCollectionSafe(schema: CollectionSchema) {
  try {
    const collection = await client.collections().create(schema)
    console.log(`✅ Collection created: ${collection.name}`)
    return collection
  } catch (error) {
    if (error.httpStatus === 409) {
      console.error('❌ Collection already exists')
      // Опция: обновить существующую или использовать другое имя
    } else if (error.httpStatus === 400) {
      console.error('❌ Invalid schema:', error.message)
      // Опция: исправить схему и повторить
    } else {
      console.error('❌ Unexpected error:', error)
    }
    throw error
  }
}
```

---

## Следующие шаги

- Изучите [проектирование схем](./02-schemas.md) для сложных структур данных
- Познакомьтесь с [типами полей](./03-field-types.md) подробно
- Настройте [индексацию документов](./04-indexing.md)
- Освойте [массовый импорт](./05-bulk-import.md) для миграции данных

---

**Назад**: [← Обзор коллекций](./README.md) | **Далее**: [Проектирование схем →](./02-schemas.md)
