# 4.3 Кураторство результатов поиска

## Обзор

Кураторство (Curation) позволяет контролировать и улучшать результаты поиска через синонимы, merchandising правила, закрепление документов и управление стоп-словами.

## Основные инструменты

### 1. Синонимы (Synonyms)
Определяют эквивалентные термины для улучшения поиска.

**Типы:**
- **Multi-way** - все термины равнозначны: `laptop = notebook = portable computer`
- **One-way** - односторонняя замена: `iphone → apple iphone`

### 2. Overrides (Merchandising)
Правила для управления результатами поиска при определенных запросах.

**Возможности:**
- Pinning - закрепление документов на определенных позициях
- Excluding - исключение документов из результатов
- Filtering - автоматическое применение фильтров
- Replacement - полная замена результатов

### 3. Stopwords (Стоп-слова)
Слова, игнорируемые при поиске (артикли, предлоги, союзы).

### 4. Pinning (Закрепление)
Закрепление документов на топовых позициях для конкретных запросов.

## Разделы документации

### [01-synonyms.md](./01-synonyms.md) (18 страниц)
Multi-way и One-way синонимы, примеры использования

**Содержание:**
- Создание синонимов через UI и API
- Multi-way синонимы
- One-way синонимы
- Синонимы по категориям
- Locale-specific синонимы
- Управление синонимами
- Best practices

**Пример:**
```typescript
// Multi-way синонимы
{
  id: 'synonym-1',
  synonyms: ['laptop', 'notebook', 'portable computer']
}

// One-way синонимы
{
  id: 'synonym-2',
  root: 'iphone',
  synonyms: ['apple iphone', 'айфон', 'iphone 14']
}
```

### [02-overrides.md](./02-overrides.md) (25 страниц)
Merchandising, pinning, excluding, динамические правила

**Содержание:**
- Создание overrides
- Pinning документов
- Excluding документов
- Replace query
- Динамические правила
- A/B тестирование overrides
- Временные промо-кампании

**Пример:**
```typescript
{
  id: 'promo-iphone',
  rule: {
    query: 'smartphone',
    match: 'contains'
  },
  includes: [
    { id: 'iphone-14-promo', position: 1 }
  ],
  excludes: [
    { id: 'competitor-phone' }
  ]
}
```

### [03-stopwords.md](./03-stopwords.md) (10 страниц)
Стоп-слова по языкам, кастомные списки

**Содержание:**
- Встроенные стоп-слова
- Кастомные стоп-слова
- Стоп-слова по языкам
- Управление стоп-словами
- Когда использовать/не использовать

**Пример:**
```typescript
// Русские стоп-слова
const ruStopwords = ['и', 'в', 'на', 'с', 'по', 'для', 'не', 'от', 'до']

// Добавление к коллекции
{
  name: 'products',
  stopwords: ruStopwords
}
```

### [04-pinning.md](./04-pinning.md) (12 страниц)
Закрепление результатов, позиционирование

**Содержание:**
- Простое закрепление
- Закрепление на позициях
- Условное закрепление
- Временное закрепление
- Приоритеты

**Пример:**
```typescript
{
  rule: {
    query: 'laptop',
    match: 'exact'
  },
  includes: [
    { id: 'featured-laptop-1', position: 1 },
    { id: 'featured-laptop-2', position: 2 }
  ]
}
```

## Примеры использования

### E-commerce: Промо-кампания

```typescript
// Закрепить новую коллекцию в топе результатов
await client.collections('products').overrides().upsert('new-collection-promo', {
  rule: {
    query: 'shoes',
    match: 'contains'
  },
  includes: [
    { id: 'new-sneakers-2024', position: 1 },
    { id: 'new-boots-2024', position: 2 }
  ],
  filter_by: 'category:shoes',
  effective_from_ts: Date.now(),
  effective_to_ts: Date.now() + 7 * 24 * 60 * 60 * 1000  // 7 дней
})
```

### Исправление популярных опечаток

```typescript
// Синонимы для частых опечаток
await client.collections('products').synonyms().upsert('iphone-typos', {
  synonyms: ['iphone', 'iphone', 'aifone', 'айфон']
})
```

### Брендовые запросы

```typescript
// One-way синонимы для расширения брендовых запросов
await client.collections('products').synonyms().upsert('brand-apple', {
  root: 'apple',
  synonyms: ['apple inc', 'apple computer', 'купить apple', 'яблоко']
})
```

### Сезонный merchandising

```typescript
// Летняя коллекция
await client.collections('products').overrides().upsert('summer-2024', {
  rule: {
    query: 't-shirt',
    match: 'exact'
  },
  includes: [
    { id: 'summer-tshirt-1', position: 1 },
    { id: 'summer-tshirt-2', position: 2 },
    { id: 'summer-tshirt-3', position: 3 }
  ],
  filter_by: 'tags:=summer_2024',
  effective_from_ts: new Date('2024-06-01').getTime(),
  effective_to_ts: new Date('2024-09-01').getTime()
})
```

## Best Practices

### 1. Синонимы

**✅ Хорошо:**
```typescript
// Группируйте связанные термины
{ synonyms: ['laptop', 'notebook', 'portable computer'] }

// Локализованные синонимы
{ synonyms: ['smartphone', 'смартфон', 'мобильный телефон'] }
```

**❌ Плохо:**
```typescript
// Слишком общие синонимы
{ synonyms: ['phone', 'device', 'gadget', 'thing'] }

// Не связанные термины
{ synonyms: ['laptop', 'mouse', 'keyboard'] }
```

### 2. Overrides

**✅ Хорошо:**
```typescript
// Конкретные правила
{
  rule: { query: 'iphone 14 pro', match: 'exact' },
  includes: [{ id: 'iphone-14-pro', position: 1 }]
}

// С временными рамками
{
  effective_from_ts: promoStart,
  effective_to_ts: promoEnd
}
```

**❌ Плохо:**
```typescript
// Слишком широкие правила
{
  rule: { query: 'phone', match: 'contains' },
  includes: [/* тысячи документов */]
}
```

### 3. Тестирование

```typescript
// Тестируйте перед применением
const testResults = await client.collections('products')
  .documents()
  .search({
    q: 'smartphone',
    query_by: 'name',
    override_tags: ['test-promo']  // Тестовый override
  })

console.log('Test results:', testResults.hits)
```

### 4. Мониторинг

```typescript
// Отслеживайте влияние overrides
class OverrideMonitor {
  async trackOverride(overrideId: string) {
    const analytics = await client.analytics
      .queries()
      .aggregate({
        filter_by: `override_id:${overrideId}`,
        group_by: 'query'
      })

    return {
      totalQueries: analytics.total,
      topQueries: analytics.groups,
      avgCTR: analytics.avg_ctr
    }
  }
}
```

## Управление через UI

### Dashboard функции

1. **Synonyms Manager**
   - Просмотр всех синонимов
   - Создание/редактирование
   - Импорт из CSV
   - Тестирование эффекта

2. **Overrides Manager**
   - Список активных overrides
   - Создание правил через wizard
   - Предпросмотр результатов
   - Планирование кампаний

3. **Analytics Integration**
   - Популярные запросы без результатов
   - Автоматические предложения синонимов
   - Эффективность overrides

## CLI Tools

```bash
# Импорт синонимов из CSV
aacsearch synonyms:import \
  --collection products \
  --file synonyms.csv

# Создание override
aacsearch override:create \
  --collection products \
  --query "iphone" \
  --pin "iphone-14-pro:1"

# Экспорт всех правил
aacsearch curation:export \
  --collection products \
  --output curation-backup.json
```

## Следующие шаги

- Изучите [синонимы](./01-synonyms.md) для улучшения поиска
- Настройте [overrides](./02-overrides.md) для merchandising
- Управляйте [стоп-словами](./03-stopwords.md)
- Освойте [закрепление](./04-pinning.md) результатов
- Изучите [аналитику](../04-analytics/README.md) для оптимизации

---

**Назад**: [← Поиск](../02-search/README.md) | **Далее**: [Синонимы →](./01-synonyms.md)
