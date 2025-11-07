# 4.1.2 Проектирование схем данных

## Обзор

Схема коллекции определяет структуру документов: какие поля могут содержать данные, их типы, правила индексации и валидации. Правильное проектирование схемы критически важно для производительности и функциональности поиска.

## Содержание

- [Основы схем](#основы-схем)
- [Schema Builder](#schema-builder)
- [Определение полей](#определение-полей)
- [Индексы и ограничения](#индексы-и-ограничения)
- [Валидация схем](#валидация-схем)
- [Миграции схем](#миграции-схем)
- [Вложенные объекты](#вложенные-объекты)
- [Best Practices](#best-practices)

---

## Основы схем

### Структура схемы

Минимальная схема коллекции:

```typescript
interface CollectionSchema {
  name: string                    // Имя коллекции
  fields: Field[]                 // Массив полей
  default_sorting_field?: string  // Поле для сортировки по умолчанию
}
```

### Базовая схема

```typescript
const basicSchema: CollectionSchema = {
  name: 'products',
  fields: [
    {
      name: 'id',
      type: 'string'
    },
    {
      name: 'name',
      type: 'string',
      index: true
    },
    {
      name: 'price',
      type: 'float'
    }
  ],
  default_sorting_field: 'price'
}
```

### Расширенная схема

```typescript
const advancedSchema: CollectionSchema = {
  name: 'products',

  // Поля
  fields: [
    {
      name: 'id',
      type: 'string'
    },
    {
      name: 'name',
      type: 'string',
      index: true,
      locale: 'ru',
      infix: true
    },
    {
      name: 'description',
      type: 'string',
      index: true,
      store: false  // Не сохранять в индексе (экономия памяти)
    },
    {
      name: 'price',
      type: 'float',
      facet: true,
      sort: true
    }
  ],

  // Настройки индексации
  default_sorting_field: 'price',
  token_separators: ['-', '_', '/'],
  symbols_to_index: ['+', '#', '@', '&'],

  // Языковые настройки
  stem_language: 'russian',

  // Дополнительные опции
  enable_nested_fields: true
}
```

---

## Schema Builder

AACSearch предоставляет удобный Builder API для создания схем.

### Базовый Builder

```typescript
import { SchemaBuilder } from '@aacsearch/schema-builder'

const schema = new SchemaBuilder('products')
  .addField('id', 'string')
  .addField('name', 'string', { index: true })
  .addField('price', 'float', { facet: true, sort: true })
  .setDefaultSort('price')
  .build()
```

### Fluent API

```typescript
const schema = SchemaBuilder
  .create('products')

  // Добавление полей
  .string('id')
  .string('name', { index: true, locale: 'ru' })
  .text('description', { index: true, store: false })
  .float('price', { facet: true, sort: true })
  .int32('stock', { facet: true })
  .bool('in_stock', { facet: true })
  .stringArray('tags', { facet: true })
  .geopoint('location')

  // Настройки
  .defaultSort('price')
  .tokenSeparators(['-', '_'])
  .symbolsToIndex(['+', '#'])
  .stemLanguage('russian')

  // Генерация
  .build()
```

### Типобезопасный Builder (TypeScript)

```typescript
// Определяем интерфейс документа
interface Product {
  id: string
  name: string
  description: string
  price: number
  brand: string
  category: string[]
  in_stock: boolean
  rating?: number
}

// Builder с проверкой типов
const schema = SchemaBuilder
  .createTyped<Product>('products')
  .field('id', 'string')
  .field('name', 'string', { index: true })
  .field('description', 'string', { index: true })
  .field('price', 'float', { facet: true })
  .field('brand', 'string', { facet: true })
  .field('category', 'string[]', { facet: true })
  .field('in_stock', 'bool', { facet: true })
  .field('rating', 'float', { optional: true })
  .build()

// TypeScript проверит, что все обязательные поля добавлены
```

### Builder с валидацией

```typescript
const schema = SchemaBuilder
  .create('products')
  .string('id')
  .string('name', {
    index: true,
    validate: (value: string) => {
      if (value.length < 3) {
        throw new Error('Name must be at least 3 characters')
      }
      return true
    }
  })
  .float('price', {
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('Price cannot be negative')
      }
      return true
    }
  })
  .build()
```

---

## Определение полей

### Типы полей

#### String поля

```typescript
// Обязательная строка
{
  name: 'title',
  type: 'string',
  index: true
}

// Необязательная строка
{
  name: 'subtitle',
  type: 'string*'  // или type: 'string', optional: true
}

// Массив строк
{
  name: 'tags',
  type: 'string[]',
  facet: true
}

// Необязательный массив строк
{
  name: 'categories',
  type: 'string[]*'
}
```

#### Числовые поля

```typescript
// 32-битное целое (-2,147,483,648 до 2,147,483,647)
{
  name: 'quantity',
  type: 'int32',
  facet: true
}

// 64-битное целое (очень большие числа)
{
  name: 'timestamp',
  type: 'int64',
  sort: true
}

// Число с плавающей точкой
{
  name: 'price',
  type: 'float',
  facet: true,
  sort: true
}

// Массив чисел
{
  name: 'scores',
  type: 'float[]'
}
```

#### Boolean поля

```typescript
{
  name: 'in_stock',
  type: 'bool',
  facet: true  // Полезно для фильтрации
}

{
  name: 'featured',
  type: 'bool*',  // Необязательный
  facet: true
}
```

#### Geopoint поля

```typescript
// Одна географическая точка
{
  name: 'location',
  type: 'geopoint'
}

// Массив точек (например, маршрут)
{
  name: 'route',
  type: 'geopoint[]'
}

// С индексацией для поиска
{
  name: 'store_location',
  type: 'geopoint',
  index: true  // Позволяет искать по радиусу
}
```

#### Object поля

```typescript
// Вложенный объект
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

// Массив объектов
{
  name: 'variants',
  type: 'object[]',
  fields: [
    { name: 'sku', type: 'string' },
    { name: 'color', type: 'string', facet: true },
    { name: 'size', type: 'string', facet: true },
    { name: 'price', type: 'float' }
  ]
}
```

#### Auto поля

```typescript
// Автоопределяемый тип
{
  name: 'dynamic_field',
  type: 'auto'
}

// AACSearch автоматически определит тип при индексации:
// "hello" → string
// 42 → int32
// 3.14 → float
// true → bool
// [1, 2, 3] → int32[]
```

### Опции полей

```typescript
interface FieldOptions {
  // Основные опции
  optional?: boolean        // Поле необязательное (default: false)
  index?: boolean          // Индексировать для поиска (default: false)
  facet?: boolean          // Использовать для фасетов (default: false)
  sort?: boolean           // Использовать для сортировки (default: false)

  // Расширенные опции
  locale?: string          // Локаль для языкозависимых операций
  infix?: boolean          // Поддержка infix поиска (default: false)
  store?: boolean          // Сохранять в индексе (default: true)

  // Вложенные поля (для object типа)
  fields?: Field[]         // Схема вложенного объекта
}
```

**Пример с опциями:**

```typescript
const field = {
  name: 'title',
  type: 'string',

  // Индексация
  index: true,              // Можно искать по этому полю
  infix: true,              // Поддержка infix поиска (поиск в середине слова)

  // Язык
  locale: 'ru',             // Русская локаль для токенизации

  // Хранение
  store: true               // Сохранять значение в индексе
}
```

---

## Индексы и ограничения

### Индексируемые поля

Поля с `index: true` доступны для полнотекстового поиска:

```typescript
{
  fields: [
    // Эти поля можно искать
    { name: 'title', type: 'string', index: true },
    { name: 'description', type: 'string', index: true },

    // Эти поля только для фильтрации/сортировки
    { name: 'price', type: 'float', facet: true },
    { name: 'category', type: 'string', facet: true }
  ]
}

// Поиск работает только по индексируемым полям
const results = await search({
  q: 'iPhone',
  query_by: 'title,description'  // Оба поля index: true
})
```

### Фасетные поля

Поля с `facet: true` используются для фильтрации и группировки:

```typescript
{
  fields: [
    { name: 'brand', type: 'string', facet: true },
    { name: 'price', type: 'float', facet: true },
    { name: 'in_stock', type: 'bool', facet: true }
  ]
}

// Фильтрация по фасетам
const results = await search({
  q: '*',
  filter_by: 'brand:Apple && in_stock:true && price:<1000'
})

// Получение фасетов
const results = await search({
  q: '*',
  facet_by: 'brand,price'
})
```

### Сортируемые поля

Поля для сортировки должны быть числового типа:

```typescript
{
  fields: [
    { name: 'price', type: 'float', sort: true },
    { name: 'rating', type: 'float', sort: true },
    { name: 'created_at', type: 'int64', sort: true }
  ],
  default_sorting_field: 'created_at'
}

// Сортировка
const results = await search({
  q: '*',
  sort_by: 'price:asc,rating:desc'
})
```

### Уникальные поля

```typescript
// ID всегда уникален
{
  name: 'id',
  type: 'string'
}

// Другие уникальные поля (через валидацию на уровне приложения)
{
  name: 'slug',
  type: 'string',
  index: true
}

// Перед индексацией проверяем уникальность
const existing = await search({ q: slug, query_by: 'slug' })
if (existing.found > 0) {
  throw new Error('Slug already exists')
}
```

---

## Валидация схем

### Встроенная валидация

AACSearch автоматически валидирует:

- Уникальность имен полей
- Корректность типов данных
- Существование `default_sorting_field`
- Правильность `locale` значений

### Кастомная валидация

```typescript
import { SchemaValidator } from '@aacsearch/schema-validator'

class ProductSchemaValidator extends SchemaValidator {
  validate(schema: CollectionSchema): ValidationResult {
    const errors: string[] = []

    // 1. Проверка обязательных полей
    const requiredFields = ['id', 'name', 'price']
    for (const fieldName of requiredFields) {
      if (!schema.fields.find(f => f.name === fieldName)) {
        errors.push(`Missing required field: ${fieldName}`)
      }
    }

    // 2. Проверка типов
    const priceField = schema.fields.find(f => f.name === 'price')
    if (priceField && priceField.type !== 'float') {
      errors.push('Price field must be float type')
    }

    // 3. Проверка индексации
    const nameField = schema.fields.find(f => f.name === 'name')
    if (nameField && !nameField.index) {
      errors.push('Name field should be indexed')
    }

    // 4. Проверка default_sorting_field
    if (schema.default_sorting_field) {
      const sortField = schema.fields.find(
        f => f.name === schema.default_sorting_field
      )

      if (!sortField) {
        errors.push('default_sorting_field does not exist')
      } else if (!['int32', 'int64', 'float'].includes(sortField.type)) {
        errors.push('default_sorting_field must be numeric')
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}

// Использование
const validator = new ProductSchemaValidator()
const result = validator.validate(mySchema)

if (!result.valid) {
  console.error('Schema validation errors:', result.errors)
} else {
  await createCollection(mySchema)
}
```

### Валидация данных при индексации

```typescript
interface DocumentValidator<T> {
  validate(document: T): ValidationResult
}

class ProductValidator implements DocumentValidator<Product> {
  validate(doc: Product): ValidationResult {
    const errors: string[] = []

    // Валидация обязательных полей
    if (!doc.id) errors.push('id is required')
    if (!doc.name) errors.push('name is required')
    if (doc.price === undefined) errors.push('price is required')

    // Валидация форматов
    if (doc.price < 0) {
      errors.push('price cannot be negative')
    }

    if (doc.name.length < 3) {
      errors.push('name must be at least 3 characters')
    }

    // Валидация email (если есть)
    if (doc.email && !isValidEmail(doc.email)) {
      errors.push('invalid email format')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}

// Использование перед индексацией
const validator = new ProductValidator()

for (const doc of documents) {
  const result = validator.validate(doc)

  if (result.valid) {
    await client.collections('products').documents().create(doc)
  } else {
    console.error(`Invalid document ${doc.id}:`, result.errors)
  }
}
```

---

## Миграции схем

### Типы миграций

#### 1. Добавление новых полей

```typescript
// Старая схема
const v1Schema = {
  name: 'products',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string', index: true },
    { name: 'price', type: 'float' }
  ]
}

// Новая схема с дополнительными полями
const v2Schema = {
  name: 'products',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string', index: true },
    { name: 'price', type: 'float' },

    // Новые поля
    { name: 'brand', type: 'string', facet: true },
    { name: 'rating', type: 'float*', optional: true },
    { name: 'tags', type: 'string[]', facet: true }
  ]
}

// Обновление схемы
await client.collections('products').update({
  fields: [
    { name: 'brand', type: 'string', facet: true, drop: false },
    { name: 'rating', type: 'float', optional: true, drop: false },
    { name: 'tags', type: 'string[]', facet: true, drop: false }
  ]
})
```

#### 2. Изменение типа поля (requires re-indexing)

```typescript
async function changeFieldType(
  collectionName: string,
  fieldName: string,
  newType: string
) {
  // 1. Получить текущую схему
  const current = await client.collections(collectionName).retrieve()

  // 2. Экспортировать данные
  const documents = await client.collections(collectionName)
    .documents()
    .export()

  // 3. Создать новую коллекцию с обновленной схемой
  const newSchema = {
    ...current,
    name: `${collectionName}_v2`,
    fields: current.fields.map(f =>
      f.name === fieldName
        ? { ...f, type: newType }
        : f
    )
  }

  await client.collections().create(newSchema)

  // 4. Трансформировать и импортировать данные
  const transformedDocs = documents.map(doc => ({
    ...doc,
    [fieldName]: transformFieldValue(doc[fieldName], newType)
  }))

  await client.collections(`${collectionName}_v2`)
    .documents()
    .import(transformedDocs)

  // 5. Переключить alias
  await client.aliases().upsert({
    name: collectionName,
    collection_name: `${collectionName}_v2`
  })

  // 6. Удалить старую коллекцию
  await client.collections(`${collectionName}_old`).delete()
}

function transformFieldValue(value: any, newType: string): any {
  switch (newType) {
    case 'string':
      return String(value)
    case 'int32':
    case 'int64':
      return parseInt(value)
    case 'float':
      return parseFloat(value)
    case 'bool':
      return Boolean(value)
    default:
      return value
  }
}
```

#### 3. Удаление полей

```typescript
// Удаление полей из схемы
await client.collections('products').update({
  fields: [
    { name: 'old_field', drop: true }
  ]
})

// Документы сохранят данные в удаленном поле,
// но оно не будет использоваться для поиска/фильтрации
```

#### 4. Переименование полей

```typescript
async function renameField(
  collectionName: string,
  oldName: string,
  newName: string
) {
  // 1. Добавить новое поле
  await client.collections(collectionName).update({
    fields: [
      {
        name: newName,
        type: getFieldType(collectionName, oldName),
        drop: false
      }
    ]
  })

  // 2. Скопировать данные
  const documents = await client.collections(collectionName)
    .documents()
    .export()

  for (const doc of documents) {
    await client.collections(collectionName)
      .documents(doc.id)
      .update({
        [newName]: doc[oldName]
      })
  }

  // 3. Удалить старое поле
  await client.collections(collectionName).update({
    fields: [
      { name: oldName, drop: true }
    ]
  })
}
```

### Migration Scripts

```typescript
interface Migration {
  version: number
  description: string
  up: (client: TypesenseClient) => Promise<void>
  down: (client: TypesenseClient) => Promise<void>
}

const migrations: Migration[] = [
  {
    version: 1,
    description: 'Add brand and rating fields',
    up: async (client) => {
      await client.collections('products').update({
        fields: [
          { name: 'brand', type: 'string', facet: true, drop: false },
          { name: 'rating', type: 'float', optional: true, drop: false }
        ]
      })
    },
    down: async (client) => {
      await client.collections('products').update({
        fields: [
          { name: 'brand', drop: true },
          { name: 'rating', drop: true }
        ]
      })
    }
  },

  {
    version: 2,
    description: 'Change price type from int32 to float',
    up: async (client) => {
      // Требует пересоздания коллекции
      await changeFieldType('products', 'price', 'float')
    },
    down: async (client) => {
      await changeFieldType('products', 'price', 'int32')
    }
  }
]

// Migration Runner
async function runMigrations(
  client: TypesenseClient,
  targetVersion: number
) {
  const currentVersion = await getCurrentMigrationVersion(client)

  for (const migration of migrations) {
    if (migration.version > currentVersion && migration.version <= targetVersion) {
      console.log(`Running migration ${migration.version}: ${migration.description}`)
      await migration.up(client)
      await setMigrationVersion(client, migration.version)
      console.log(`✓ Migration ${migration.version} completed`)
    }
  }
}

// Rollback
async function rollbackMigration(
  client: TypesenseClient,
  targetVersion: number
) {
  const currentVersion = await getCurrentMigrationVersion(client)

  for (let i = migrations.length - 1; i >= 0; i--) {
    const migration = migrations[i]
    if (migration.version <= currentVersion && migration.version > targetVersion) {
      console.log(`Rolling back migration ${migration.version}`)
      await migration.down(client)
      await setMigrationVersion(client, migration.version - 1)
      console.log(`✓ Rollback ${migration.version} completed`)
    }
  }
}
```

---

## Вложенные объекты

### Простой вложенный объект

```typescript
const schema = {
  name: 'products',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string', index: true },

    // Вложенный объект address
    {
      name: 'address',
      type: 'object',
      fields: [
        { name: 'street', type: 'string' },
        { name: 'city', type: 'string', facet: true },
        { name: 'country', type: 'string', facet: true },
        { name: 'postal_code', type: 'string' }
      ]
    }
  ]
}

// Документ
const doc = {
  id: '1',
  name: 'Product',
  address: {
    street: '123 Main St',
    city: 'New York',
    country: 'USA',
    postal_code: '10001'
  }
}
```

### Поиск по вложенным полям

```typescript
// Поиск по вложенному полю
const results = await search({
  q: 'New York',
  query_by: 'address.city'
})

// Фильтрация по вложенному полю
const results = await search({
  q: '*',
  filter_by: 'address.country:USA'
})

// Фасеты по вложенному полю
const results = await search({
  q: '*',
  facet_by: 'address.city,address.country'
})
```

### Массив объектов

```typescript
const schema = {
  name: 'products',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string', index: true },

    // Массив вариантов товара
    {
      name: 'variants',
      type: 'object[]',
      fields: [
        { name: 'sku', type: 'string', index: true },
        { name: 'color', type: 'string', facet: true },
        { name: 'size', type: 'string', facet: true },
        { name: 'price', type: 'float', facet: true },
        { name: 'in_stock', type: 'bool', facet: true }
      ]
    }
  ]
}

// Документ
const doc = {
  id: '1',
  name: 'T-Shirt',
  variants: [
    {
      sku: 'TSHIRT-RED-S',
      color: 'red',
      size: 'S',
      price: 19.99,
      in_stock: true
    },
    {
      sku: 'TSHIRT-RED-M',
      color: 'red',
      size: 'M',
      price: 19.99,
      in_stock: false
    },
    {
      sku: 'TSHIRT-BLUE-S',
      color: 'blue',
      size: 'S',
      price: 21.99,
      in_stock: true
    }
  ]
}
```

### Глубоко вложенные объекты

```typescript
const schema = {
  name: 'orders',
  fields: [
    { name: 'id', type: 'string' },

    // 3 уровня вложенности
    {
      name: 'customer',
      type: 'object',
      fields: [
        { name: 'name', type: 'string', index: true },
        { name: 'email', type: 'string' },
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
  ],
  enable_nested_fields: true  // Обязательно для глубокой вложенности
}

// Поиск по глубоко вложенным полям
const results = await search({
  q: '*',
  filter_by: 'customer.address.city:Moscow'
})
```

---

## Best Practices

### 1. Проектирование для поиска

```typescript
// ✅ Хорошо: Четкое разделение полей
const goodSchema = {
  name: 'products',
  fields: [
    // Поля для поиска
    { name: 'name', type: 'string', index: true },
    { name: 'description', type: 'string', index: true },
    { name: 'tags', type: 'string[]', index: true },

    // Поля для фильтрации
    { name: 'category', type: 'string', facet: true },
    { name: 'brand', type: 'string', facet: true },
    { name: 'price', type: 'float', facet: true },

    // Поля для сортировки
    { name: 'rating', type: 'float', sort: true },
    { name: 'sales_count', type: 'int32', sort: true }
  ]
}

// ❌ Плохо: Все поля индексируемые
const badSchema = {
  name: 'products',
  fields: [
    { name: 'id', type: 'string', index: true },        // Зачем?
    { name: 'name', type: 'string', index: true },
    { name: 'price', type: 'float', index: true },      // Числа не индексируют
    { name: 'created_at', type: 'int64', index: true }  // Зачем?
  ]
}
```

### 2. Оптимизация памяти

```typescript
// ✅ Используйте store: false для больших текстов
{
  name: 'full_content',
  type: 'string',
  index: true,
  store: false  // Не сохранять в индексе (экономия 50-90% памяти)
}

// ✅ Правильный выбор типа
{
  name: 'year',
  type: 'int32'  // Не int64 для малых чисел
}

{
  name: 'timestamp',
  type: 'int64'  // int64 для Unix timestamps
}
```

### 3. Нормализация данных

```typescript
// ✅ Хорошо: Нормализованные значения
const doc = {
  brand: 'apple',           // Все в нижнем регистре
  color: 'red',
  size: 'xl'
}

// ❌ Плохо: Разный регистр
const doc = {
  brand: 'Apple',           // Разный регистр
  color: 'Red',
  size: 'XL'
}

// Функция нормализации
function normalizeDocument(doc: any) {
  return {
    ...doc,
    brand: doc.brand?.toLowerCase(),
    color: doc.color?.toLowerCase(),
    size: doc.size?.toLowerCase(),
    tags: doc.tags?.map((t: string) => t.toLowerCase())
  }
}
```

### 4. Версионирование схем

```typescript
// ✅ Храните версию схемы
const schema = {
  name: 'products_v2',  // Версия в имени
  fields: [
    { name: 'schema_version', type: 'int32' },  // Версия в данных
    // ... остальные поля
  ]
}

// При индексации добавляйте версию
const doc = {
  ...data,
  schema_version: 2
}

// Поддержка миграций
if (doc.schema_version < 2) {
  doc = migrateToV2(doc)
}
```

### 5. Документация схемы

```typescript
/**
 * Products Collection Schema v2
 *
 * Changelog:
 * - v2 (2024-01-15): Added 'brand' and 'rating' fields
 * - v1 (2024-01-01): Initial schema
 *
 * @see docs/schemas/products.md
 */
const productsSchema = {
  name: 'products',
  fields: [
    /**
     * Unique product identifier
     * Format: UUID v4
     */
    { name: 'id', type: 'string' },

    /**
     * Product name
     * Indexed for full-text search
     * Locale: Russian
     */
    { name: 'name', type: 'string', index: true, locale: 'ru' },

    /**
     * Product price in USD
     * Used for filtering and sorting
     */
    { name: 'price', type: 'float', facet: true, sort: true }
  ]
}
```

---

## Следующие шаги

- Изучите [все типы полей](./03-field-types.md) детально
- Настройте [индексацию документов](./04-indexing.md)
- Освойте [массовый импорт](./05-bulk-import.md)

---

**Назад**: [← Создание коллекций](./01-creating-collections.md) | **Далее**: [Типы полей →](./03-field-types.md)
