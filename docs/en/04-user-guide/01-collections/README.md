# 4.1 Работа с коллекциями

## Обзор

Коллекции в AACSearch - это основные контейнеры для хранения и индексации данных. Каждая коллекция представляет собой структурированную схему полей с настройками индексации и поиска.

## Что такое коллекция?

Коллекция - это аналог таблицы в реляционных базах данных или индекса в Elasticsearch. Она содержит:

- **Схему полей** - структуру данных (string, int32, float, geopoint, etc.)
- **Настройки индексации** - какие поля индексировать для поиска
- **Документы** - фактические данные, соответствующие схеме

## Ключевые концепции

### Схема коллекции

Схема определяет структуру документов:

```typescript
{
  name: 'products',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'price', type: 'float' },
    { name: 'category', type: 'string[]' },
    { name: 'location', type: 'geopoint' }
  ]
}
```

### Типы полей

AACSearch поддерживает различные типы данных:

| Тип | Описание | Пример |
|-----|----------|--------|
| `string` | Текстовая строка | `"iPhone 14"` |
| `string*` | Необязательная строка | `"optional"` |
| `string[]` | Массив строк | `["tech", "mobile"]` |
| `int32` | 32-битное целое | `42` |
| `int64` | 64-битное целое | `9223372036854775807` |
| `float` | Число с плавающей точкой | `99.99` |
| `bool` | Логическое значение | `true` / `false` |
| `geopoint` | Географическая точка | `[48.8566, 2.3522]` |
| `object` | Вложенный объект | `{ "street": "..." }` |
| `auto` | Автоопределяемый тип | - |

### Индексация

Индексируемые поля (`index: true`) доступны для полнотекстового поиска:

```typescript
{
  name: 'description',
  type: 'string',
  index: true,      // Можно искать по этому полю
  facet: true       // Можно использовать для фасетов
}
```

## Основные операции

### 1. Создание коллекции

Через UI или API:

```typescript
const schema = {
  name: 'products',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string', index: true },
    { name: 'price', type: 'float' }
  ],
  default_sorting_field: 'price'
}

await client.collections().create(schema)
```

### 2. Добавление документов

Индексация отдельных документов или массовый импорт:

```typescript
// Один документ
await client.collections('products').documents().create({
  id: '1',
  name: 'iPhone 14',
  price: 999.99
})

// Массовый импорт
await client.collections('products').documents().import(jsonlData)
```

### 3. Поиск

Выполнение поисковых запросов:

```typescript
const results = await client.collections('products')
  .documents()
  .search({
    q: 'iPhone',
    query_by: 'name',
    filter_by: 'price:<1000'
  })
```

### 4. Обновление схемы

Добавление новых полей или изменение настроек:

```typescript
await client.collections('products').update({
  fields: [
    { name: 'rating', type: 'float', drop: false }
  ]
})
```

### 5. Удаление коллекции

```typescript
await client.collections('products').delete()
```

## Структура директории

Подробная документация по работе с коллекциями:

- **[01-creating-collections.md](./01-creating-collections.md)** - Создание коллекций через UI и API
- **[02-schemas.md](./02-schemas.md)** - Проектирование схем, валидация, миграции
- **[03-field-types.md](./03-field-types.md)** - Детальное описание всех типов полей
- **[04-indexing.md](./04-indexing.md)** - Индексация документов, обработчики, автосинхронизация
- **[05-bulk-import.md](./05-bulk-import.md)** - Массовый импорт из CSV, JSON, JSONL

## Примеры использования

### E-commerce коллекция

```typescript
{
  name: 'products',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string', index: true },
    { name: 'description', type: 'string', index: true },
    { name: 'price', type: 'float', facet: true },
    { name: 'brand', type: 'string', facet: true },
    { name: 'categories', type: 'string[]', facet: true },
    { name: 'in_stock', type: 'bool', facet: true },
    { name: 'rating', type: 'float' },
    { name: 'num_reviews', type: 'int32' },
    { name: 'created_at', type: 'int64' }
  ],
  default_sorting_field: 'num_reviews'
}
```

### Блог коллекция

```typescript
{
  name: 'posts',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'title', type: 'string', index: true },
    { name: 'content', type: 'string', index: true },
    { name: 'author', type: 'string', facet: true },
    { name: 'tags', type: 'string[]', facet: true },
    { name: 'published_at', type: 'int64' },
    { name: 'views', type: 'int32' }
  ],
  default_sorting_field: 'published_at'
}
```

### Geo-поиск коллекция

```typescript
{
  name: 'locations',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string', index: true },
    { name: 'address', type: 'string', index: true },
    { name: 'location', type: 'geopoint' },
    { name: 'city', type: 'string', facet: true },
    { name: 'rating', type: 'float' }
  ],
  default_sorting_field: 'rating'
}
```

## Best Practices

### 1. Проектирование схем

- **Используйте осмысленные имена полей** - `product_name` лучше чем `pn`
- **Определяйте обязательные поля** - используйте `string` вместо `string*` для обязательных
- **Выбирайте правильные типы** - `int32` vs `int64`, `string` vs `string[]`
- **Планируйте фасеты заранее** - установите `facet: true` для полей фильтрации

### 2. Индексация

- **Индексируйте только нужные поля** - не все поля должны быть `index: true`
- **Используйте весовые коэффициенты** - важные поля с большим весом
- **Оптимизируйте для своего языка** - настройте токенизацию и стемминг

### 3. Производительность

- **Batch операции** - используйте массовый импорт для больших объемов
- **Правильный тип сортировки** - `int32`/`float` быстрее чем `string`
- **Ограничивайте размер документа** - большие тексты разбивайте на части

### 4. Миграции

- **Версионируйте схемы** - храните историю изменений
- **Тестируйте перед продакшеном** - проверяйте миграции на копии данных
- **Используйте aliases** - для безопасного переключения между версиями

## Ограничения

### Размеры

- **Максимальный размер документа**: 10 MB
- **Максимальное количество полей**: 200 полей на схему
- **Максимальная длина имени поля**: 100 символов
- **Максимальная длина имени коллекции**: 50 символов

### Имена

- **Разрешенные символы**: `a-z`, `A-Z`, `0-9`, `_`, `-`
- **Первый символ**: должен быть буквой
- **Зарезервированные имена**: `_all`, `_search`, `_export`

### Изменения схемы

- **Нельзя изменить тип существующего поля** - только удаление и пересоздание
- **Нельзя переименовать поле** - создайте новое и мигрируйте данные
- **Можно добавлять новые поля** - без перезагрузки существующих документов

## Следующие шаги

- Изучите [создание коллекций](./01-creating-collections.md) через wizard и templates
- Познакомьтесь с [проектированием схем](./02-schemas.md) и валидацией
- Освойте все [типы полей](./03-field-types.md) для разных сценариев
- Настройте [индексацию](./04-indexing.md) и hooks для автоматизации
- Изучите [массовый импорт](./05-bulk-import.md) для миграции данных

## Полезные ссылки

- [API Reference - Collections](/docs/ru/05-api-reference/collections.md)
- [Typesense Collection Schema](https://typesense.org/docs/latest/api/collections.html)
- [Schema Design Best Practices](https://typesense.org/docs/guide/tips-for-searching-common-types-of-data.html)

---

**Далее**: [Создание коллекций →](./01-creating-collections.md)
