# 4.2.1 Базовый поиск

## Обзор

Базовый поиск в AACSearch - это фундамент всех поисковых операций. Он включает простой полнотекстовый поиск, prefix/infix поиск, wildcard запросы и точное совпадение. В этом руководстве подробно рассмотрены все базовые техники поиска с примерами и best practices.

## Содержание

- [Простой поисковый запрос](#простой-поисковый-запрос)
- [Поиск по одному полю](#поиск-по-одному-полю)
- [Поиск по нескольким полям](#поиск-по-нескольким-полям)
- [Prefix Search](#prefix-search)
- [Infix Search](#infix-search)
- [Wildcard поиск](#wildcard-поиск)
- [Exact Match поиск](#exact-match-поиск)
- [Пустые запросы](#пустые-запросы)
- [Пагинация результатов](#пагинация-результатов)
- [Best Practices](#best-practices)

---

## Простой поисковый запрос

### Минимальный запрос

Самый простой поисковый запрос требует только два параметра:

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

// Минимальный поиск
const results = await client.collections('products')
  .documents()
  .search({
    q: 'iPhone',           // Поисковый запрос
    query_by: 'name'       // Поле для поиска
  })

console.log(`Найдено: ${results.found} документов`)
console.log('Результаты:', results.hits)
```

### Структура ответа

```typescript
{
  found: 42,                    // Общее количество найденных документов
  out_of: 1000,                 // Общее количество документов в коллекции
  page: 1,                      // Текущая страница
  request_params: {             // Параметры запроса
    collection_name: 'products',
    per_page: 10,
    q: 'iPhone'
  },
  search_time_ms: 3,            // Время поиска в миллисекундах
  hits: [                       // Массив результатов
    {
      document: {               // Найденный документ
        id: '1',
        name: 'iPhone 14 Pro',
        price: 999.99,
        brand: 'Apple'
      },
      highlight: {              // Подсветка совпадений
        name: {
          snippet: '<mark>iPhone</mark> 14 Pro',
          matched_tokens: ['iPhone']
        }
      },
      text_match: 578394216,    // Оценка релевантности
      text_match_info: {        // Детали совпадения
        best_field_score: '578394216',
        best_field_weight: 15,
        fields_matched: 1,
        score: '578394216',
        tokens_matched: 1
      }
    }
  ]
}
```

### Через cURL

```bash
curl "http://localhost:8108/collections/products/documents/search" \
  -H "X-TYPESENSE-API-KEY: your-api-key" \
  -d "q=iPhone" \
  -d "query_by=name"
```

### Через fetch API

```typescript
const response = await fetch(
  'https://api.aacsearch.com/collections/products/documents/search',
  {
    method: 'POST',
    headers: {
      'X-TYPESENSE-API-KEY': 'your-api-key',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      q: 'iPhone',
      query_by: 'name'
    })
  }
)

const results = await response.json()
```

---

## Поиск по одному полю

### Поиск в текстовом поле

```typescript
// Поиск только в названии
const results = await client.collections('products')
  .documents()
  .search({
    q: 'wireless headphones',
    query_by: 'name'
  })

// Найдет: "Sony Wireless Headphones WH-1000XM5"
```

### Поиск в поле описания

```typescript
// Поиск в описании товара
const results = await client.collections('products')
  .documents()
  .search({
    q: 'noise cancellation',
    query_by: 'description'
  })

// Найдет товары с "noise cancellation" в описании
```

### Поиск по бренду

```typescript
// Поиск по точному имени бренда
const results = await client.collections('products')
  .documents()
  .search({
    q: 'Apple',
    query_by: 'brand'
  })

// Найдет все товары бренда Apple
```

### Пример UI

```html
<!-- Простая форма поиска -->
<form id="search-form">
  <input
    type="text"
    id="search-input"
    placeholder="Поиск товаров..."
    value=""
  >
  <button type="submit">Найти</button>
</form>

<div id="results"></div>

<script>
document.getElementById('search-form').addEventListener('submit', async (e) => {
  e.preventDefault()

  const query = document.getElementById('search-input').value

  const results = await client.collections('products')
    .documents()
    .search({
      q: query,
      query_by: 'name'
    })

  displayResults(results.hits)
})

function displayResults(hits) {
  const container = document.getElementById('results')

  container.innerHTML = hits.map(hit => `
    <div class="result-item">
      <h3>${hit.highlight.name?.snippet || hit.document.name}</h3>
      <p>Цена: $${hit.document.price}</p>
    </div>
  `).join('')
}
</script>
```

---

## Поиск по нескольким полям

### Базовый мультиполевый поиск

```typescript
// Поиск одновременно в названии и описании
const results = await client.collections('products')
  .documents()
  .search({
    q: 'smartphone',
    query_by: 'name,description'  // Через запятую, без пробелов
  })

// Найдет "smartphone" в любом из указанных полей
```

### Поиск в трех и более полях

```typescript
// Расширенный мультиполевый поиск
const results = await client.collections('products')
  .documents()
  .search({
    q: 'gaming laptop',
    query_by: 'name,description,brand,category'
  })
```

### Порядок полей имеет значение

```typescript
// Поля слева имеют больший приоритет
const results = await client.collections('products')
  .documents()
  .search({
    q: 'MacBook',
    query_by: 'name,brand,description'
    // name имеет наивысший приоритет
    // brand средний
    // description наименьший
  })
```

### Пример с весами (preview для advanced)

```typescript
// Явное указание весов полей
const results = await client.collections('products')
  .documents()
  .search({
    q: 'laptop',
    query_by: 'name,description,brand',
    query_by_weights: '3,2,1'  // name весит 3x, description 2x, brand 1x
  })
```

---

## Prefix Search

### Что такое Prefix Search?

Prefix search позволяет находить документы по началу слова. Это критически важно для автодополнения и поиска в реальном времени.

### Включение Prefix Search

```typescript
// Prefix search включен по умолчанию для последнего слова
const results = await client.collections('products')
  .documents()
  .search({
    q: 'iph',              // Найдет "iPhone", "iPhoto" и т.д.
    query_by: 'name',
    prefix: true           // По умолчанию true
  })
```

### Автодополнение с Prefix Search

```typescript
// Реализация автодополнения
async function autocomplete(query: string) {
  const results = await client.collections('products')
    .documents()
    .search({
      q: query,
      query_by: 'name',
      prefix: true,
      per_page: 10,
      highlight_full_fields: 'name'
    })

  return results.hits.map(hit => ({
    text: hit.document.name,
    highlight: hit.highlight.name?.snippet
  }))
}

// Использование
const suggestions = await autocomplete('macb')
// Вернет: ["MacBook Pro", "MacBook Air", "MacBook accessories"]
```

### UI для автодополнения

```html
<input
  type="text"
  id="autocomplete-input"
  placeholder="Начните вводить..."
>
<div id="suggestions"></div>

<script>
let debounceTimer
const input = document.getElementById('autocomplete-input')
const suggestionsEl = document.getElementById('suggestions')

input.addEventListener('input', (e) => {
  clearTimeout(debounceTimer)

  debounceTimer = setTimeout(async () => {
    const query = e.target.value

    if (query.length < 2) {
      suggestionsEl.innerHTML = ''
      return
    }

    const results = await client.collections('products')
      .documents()
      .search({
        q: query,
        query_by: 'name',
        prefix: true,
        per_page: 5
      })

    suggestionsEl.innerHTML = results.hits.map(hit => `
      <div class="suggestion">
        ${hit.highlight.name?.snippet || hit.document.name}
      </div>
    `).join('')
  }, 300) // Debounce 300ms
})
</script>

<style>
#suggestions {
  border: 1px solid #ccc;
  max-height: 200px;
  overflow-y: auto;
}

.suggestion {
  padding: 8px;
  cursor: pointer;
}

.suggestion:hover {
  background-color: #f0f0f0;
}

.suggestion mark {
  background-color: #ffeb3b;
  font-weight: bold;
}
</style>
```

### Prefix для всех слов

```typescript
// Prefix search для каждого слова в запросе
const results = await client.collections('products')
  .documents()
  .search({
    q: 'appl macb',        // Найдет "Apple MacBook"
    query_by: 'name,brand',
    prefix: 'true,true'    // Prefix для обоих слов
  })
```

### Отключение Prefix Search

```typescript
// Когда prefix может мешать
const results = await client.collections('products')
  .documents()
  .search({
    q: 'pro',
    query_by: 'name',
    prefix: false          // Не найдет "Professional", "Product"
  })
// Найдет только документы с точным словом "pro"
```

---

## Infix Search

### Что такое Infix Search?

Infix search позволяет находить документы по части слова (не только по началу). Полезно для поиска артикулов, серийных номеров, частей слов.

### Настройка коллекции для Infix

```typescript
// При создании коллекции включите infix indexing
const schema = {
  name: 'products',
  fields: [
    { name: 'id', type: 'string' },
    {
      name: 'sku',
      type: 'string',
      index: true,
      infix: true          // Включить infix для этого поля
    },
    {
      name: 'name',
      type: 'string',
      index: true,
      infix: true          // И для названия
    }
  ]
}

await client.collections().create(schema)
```

### Использование Infix Search

```typescript
// Поиск по части слова
const results = await client.collections('products')
  .documents()
  .search({
    q: 'book',            // Найдет "MacBook", "notebook", "bookshelf"
    query_by: 'name',
    infix: 'always'       // Режимы: 'off', 'always', 'fallback'
  })
```

### Режимы Infix

#### 1. `infix: 'off'` (по умолчанию)

```typescript
// Infix отключен - только prefix
const results = await client.collections('products')
  .documents()
  .search({
    q: 'book',
    query_by: 'name',
    infix: 'off'
  })
// Найдет: "Bookshelf", "Books collection"
// НЕ найдет: "MacBook", "notebook"
```

#### 2. `infix: 'always'`

```typescript
// Всегда использовать infix
const results = await client.collections('products')
  .documents()
  .search({
    q: 'book',
    query_by: 'name',
    infix: 'always'
  })
// Найдет: "MacBook", "notebook", "Bookshelf", "Books"
```

#### 3. `infix: 'fallback'`

```typescript
// Использовать infix только если prefix не дал результатов
const results = await client.collections('products')
  .documents()
  .search({
    q: 'book',
    query_by: 'name',
    infix: 'fallback'
  })
// Сначала попытается prefix, если пусто - попробует infix
```

### Поиск артикулов

```typescript
// Коллекция с артикулами
const results = await client.collections('products')
  .documents()
  .search({
    q: '1234',            // Часть SKU
    query_by: 'sku',
    infix: 'always'
  })

// Найдет:
// - "SKU-1234-ABC"
// - "PRD-ABC-1234"
// - "1234567890"
```

### Производительность Infix

**Важно**: Infix search медленнее prefix search и требует больше памяти.

```typescript
// Оптимизация: используйте fallback вместо always
const results = await client.collections('products')
  .documents()
  .search({
    q: 'laptop',
    query_by: 'name',
    infix: 'fallback'      // Быстрее чем 'always'
  })
```

---

## Wildcard поиск

### Что такое Wildcard?

Wildcard позволяет использовать специальные символы `?` (один любой символ) и `*` (любое количество символов).

### Использование `*`

```typescript
// Звездочка заменяет любое количество символов
const results = await client.collections('products')
  .documents()
  .search({
    q: 'Mac*',            // Найдет "MacBook", "Mac Mini", "MacBook Pro"
    query_by: 'name'
  })

// В середине слова
const results2 = await client.collections('products')
  .documents()
  .search({
    q: 'i*e',             // Найдет "iPhone", "ice", "inspire"
    query_by: 'name'
  })
```

### Использование `?`

```typescript
// Вопросительный знак заменяет ровно один символ
const results = await client.collections('products')
  .documents()
  .search({
    q: 'iP?one',          // Найдет "iPhone", но не "iPoone"
    query_by: 'name'
  })
```

### Комбинация wildcards

```typescript
// Сложные паттерны
const results = await client.collections('products')
  .documents()
  .search({
    q: 'Mac*Pro?',        // "MacBook Pro 13", "Mac Mini Pro 2"
    query_by: 'name'
  })
```

### Wildcard в начале слова

```typescript
// * в начале (работает с infix)
const results = await client.collections('products')
  .documents()
  .search({
    q: '*Book',           // "MacBook", "NoteBook", "PlayBook"
    query_by: 'name',
    infix: 'always'       // Требует infix
  })
```

### Кейс: поиск моделей

```typescript
// Поиск товаров по паттерну модели
async function findByModel(pattern: string) {
  return await client.collections('products')
    .documents()
    .search({
      q: pattern,         // Например: "iPhone *"
      query_by: 'name',
      per_page: 50
    })
}

// Примеры использования
await findByModel('iPhone 1*')      // iPhone 10, 11, 12, 13, 14
await findByModel('Galaxy S2?')     // Galaxy S20, S21, S22, S23
await findByModel('MacBook * 2023') // MacBook Pro 2023, MacBook Air 2023
```

---

## Exact Match поиск

### Точное совпадение фразы

```typescript
// Поиск фразы целиком (обернуть в кавычки)
const results = await client.collections('products')
  .documents()
  .search({
    q: '"iPhone 14 Pro"',     // Только точное совпадение фразы
    query_by: 'name'
  })

// Найдет: "iPhone 14 Pro"
// НЕ найдет: "iPhone 14 Pro Max", "New iPhone 14 Pro"
```

### Exact match vs Regular search

```typescript
// Обычный поиск
const regularResults = await client.collections('products')
  .documents()
  .search({
    q: 'Apple iPhone',
    query_by: 'name,brand'
  })
// Найдет: "Apple iPhone", "iPhone by Apple", "Apple - iPhone 14"

// Точный поиск
const exactResults = await client.collections('products')
  .documents()
  .search({
    q: '"Apple iPhone"',
    query_by: 'name,brand'
  })
// Найдет только: "Apple iPhone" (точная фраза)
```

### Комбинирование exact и regular

```typescript
// Можно комбинировать
const results = await client.collections('products')
  .documents()
  .search({
    q: '"MacBook Pro" 2023',  // "MacBook Pro" точно, 2023 anywhere
    query_by: 'name'
  })

// Найдет: "MacBook Pro 2023", "2023 MacBook Pro"
```

### Exact match для артикулов

```typescript
// Поиск по точному SKU
const results = await client.collections('products')
  .documents()
  .search({
    q: '"SKU-12345-ABC"',
    query_by: 'sku'
  })
```

---

## Пустые запросы

### Получение всех документов

```typescript
// Звездочка возвращает все документы
const results = await client.collections('products')
  .documents()
  .search({
    q: '*',
    query_by: 'name'
  })

// Вернет все документы в коллекции
```

### Использование с фильтрами

```typescript
// Пустой запрос + фильтрация
const results = await client.collections('products')
  .documents()
  .search({
    q: '*',
    query_by: 'name',
    filter_by: 'price:<500 && in_stock:true'
  })

// Получить все товары дешевле $500 в наличии
```

### Пустой запрос с сортировкой

```typescript
// Получить топ товаров по рейтингу
const results = await client.collections('products')
  .documents()
  .search({
    q: '*',
    query_by: 'name',
    sort_by: 'rating:desc',
    per_page: 10
  })
```

### Browse режим (без поиска)

```typescript
// Просмотр категории без поискового запроса
const results = await client.collections('products')
  .documents()
  .search({
    q: '*',
    query_by: 'name',
    filter_by: 'category:Electronics',
    sort_by: 'created_at:desc',
    per_page: 24
  })
```

---

## Пагинация результатов

### Базовая пагинация

```typescript
// Первая страница (по умолчанию)
const page1 = await client.collections('products')
  .documents()
  .search({
    q: 'laptop',
    query_by: 'name',
    per_page: 20,         // 20 результатов на страницу
    page: 1               // Страница 1
  })

// Вторая страница
const page2 = await client.collections('products')
  .documents()
  .search({
    q: 'laptop',
    query_by: 'name',
    per_page: 20,
    page: 2               // Страница 2
  })
```

### Расчет количества страниц

```typescript
async function searchWithPagination(query: string, pageNum: number = 1) {
  const perPage = 20

  const results = await client.collections('products')
    .documents()
    .search({
      q: query,
      query_by: 'name',
      per_page: perPage,
      page: pageNum
    })

  const totalPages = Math.ceil(results.found / perPage)

  return {
    hits: results.hits,
    currentPage: pageNum,
    totalPages: totalPages,
    totalResults: results.found,
    hasNextPage: pageNum < totalPages,
    hasPrevPage: pageNum > 1
  }
}

// Использование
const data = await searchWithPagination('smartphone', 2)
console.log(`Страница ${data.currentPage} из ${data.totalPages}`)
```

### UI компонент пагинации

```typescript
// React компонент пагинации
function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) {
  const pages = []

  // Показать макс 5 страниц одновременно
  let startPage = Math.max(1, currentPage - 2)
  let endPage = Math.min(totalPages, currentPage + 2)

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Назад
      </button>

      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)}>1</button>
          {startPage > 2 && <span>...</span>}
        </>
      )}

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? 'active' : ''}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span>...</span>}
          <button onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Далее →
      </button>
    </div>
  )
}
```

### Infinite scroll

```typescript
// Реализация бесконечного скролла
class InfiniteSearch {
  private currentPage = 1
  private allHits: any[] = []
  private hasMore = true

  async loadMore(query: string) {
    if (!this.hasMore) return []

    const results = await client.collections('products')
      .documents()
      .search({
        q: query,
        query_by: 'name',
        per_page: 20,
        page: this.currentPage
      })

    this.allHits.push(...results.hits)
    this.currentPage++
    this.hasMore = results.hits.length === 20

    return results.hits
  }

  reset() {
    this.currentPage = 1
    this.allHits = []
    this.hasMore = true
  }
}

// Использование
const searcher = new InfiniteSearch()

// Первая загрузка
const initial = await searcher.loadMore('laptop')

// При скролле вниз
window.addEventListener('scroll', async () => {
  if (isNearBottom() && !isLoading) {
    const more = await searcher.loadMore('laptop')
    appendResults(more)
  }
})
```

### Offset-based пагинация

```typescript
// Альтернатива: offset вместо page
const results = await client.collections('products')
  .documents()
  .search({
    q: 'smartphone',
    query_by: 'name',
    per_page: 20,
    offset: 40            // Пропустить первые 40 результатов
  })

// offset = (page - 1) * per_page
// page 3, per_page 20 => offset 40
```

---

## Best Practices

### 1. Оптимальная конфигурация query_by

```typescript
// ✅ Хорошо: только релевантные поля
const results = await client.collections('products')
  .documents()
  .search({
    q: 'laptop',
    query_by: 'name,description'  // Только то, что нужно
  })

// ❌ Плохо: слишком много полей
const results = await client.collections('products')
  .documents()
  .search({
    q: 'laptop',
    query_by: 'name,description,brand,category,tags,sku,id'  // Избыточно
  })
```

### 2. Когда использовать prefix vs infix

```typescript
// ✅ Используйте prefix для автодополнения
const autocomplete = await client.collections('products')
  .documents()
  .search({
    q: 'mac',
    query_by: 'name',
    prefix: true
  })

// ✅ Используйте infix для артикулов/кодов
const byCode = await client.collections('products')
  .documents()
  .search({
    q: '1234',
    query_by: 'sku',
    infix: 'always'
  })

// ❌ Не используйте infix везде (медленно)
```

### 3. Debounce для живого поиска

```typescript
// ✅ Используйте debounce чтобы не перегружать сервер
let debounceTimer: NodeJS.Timeout

function handleSearchInput(query: string) {
  clearTimeout(debounceTimer)

  debounceTimer = setTimeout(async () => {
    const results = await search(query)
    displayResults(results)
  }, 300)  // 300ms задержка
}

// ❌ Не делайте запрос на каждый ввод символа
input.addEventListener('input', async (e) => {
  const results = await search(e.target.value)  // Слишком много запросов!
})
```

### 4. Кеширование популярных запросов

```typescript
// ✅ Кешируйте часто используемые запросы
class SearchCache {
  private cache = new Map<string, any>()
  private ttl = 60000  // 1 минута

  async search(params: SearchParams) {
    const key = JSON.stringify(params)

    if (this.cache.has(key)) {
      const cached = this.cache.get(key)
      if (Date.now() - cached.timestamp < this.ttl) {
        return cached.data
      }
    }

    const results = await client.collections('products')
      .documents()
      .search(params)

    this.cache.set(key, {
      data: results,
      timestamp: Date.now()
    })

    return results
  }
}
```

### 5. Оптимальный per_page

```typescript
// ✅ Разумные значения per_page
const results = await client.collections('products')
  .documents()
  .search({
    q: 'laptop',
    query_by: 'name',
    per_page: 20          // Оптимально для большинства случаев
  })

// ❌ Избегайте очень больших значений
const results = await client.collections('products')
  .documents()
  .search({
    q: 'laptop',
    query_by: 'name',
    per_page: 1000        // Медленно и избыточно
  })
```

### 6. Валидация пользовательского ввода

```typescript
// ✅ Очистка и валидация запроса
function sanitizeQuery(query: string): string {
  // Удалить лишние пробелы
  query = query.trim()

  // Ограничить длину
  if (query.length > 200) {
    query = query.substring(0, 200)
  }

  // Экранировать специальные символы (если нужно)
  // query = query.replace(/[^\w\s-]/g, '')

  return query
}

async function safeSearch(userInput: string) {
  const query = sanitizeQuery(userInput)

  if (query.length < 2) {
    return { hits: [], found: 0 }
  }

  return await client.collections('products')
    .documents()
    .search({
      q: query,
      query_by: 'name'
    })
}
```

### 7. Обработка пустых результатов

```typescript
// ✅ Graceful обработка отсутствия результатов
async function searchWithFallback(query: string) {
  let results = await client.collections('products')
    .documents()
    .search({
      q: query,
      query_by: 'name',
      num_typos: 2
    })

  // Если ничего не найдено, попробуйте более мягкие параметры
  if (results.found === 0) {
    results = await client.collections('products')
      .documents()
      .search({
        q: query,
        query_by: 'name,description',
        num_typos: 3,
        prefix: true
      })
  }

  return results
}
```

### 8. Мониторинг производительности

```typescript
// ✅ Логируйте медленные запросы
async function monitoredSearch(params: SearchParams) {
  const start = Date.now()

  try {
    const results = await client.collections('products')
      .documents()
      .search(params)

    const duration = Date.now() - start

    if (duration > 100) {
      console.warn(`Slow search: ${duration}ms`, params)
    }

    return results
  } catch (error) {
    console.error('Search error:', error, params)
    throw error
  }
}
```

---

## Troubleshooting

### Проблема: Не находит результаты

```typescript
// ❌ Проблема
const results = await client.collections('products')
  .documents()
  .search({
    q: 'iphone',
    query_by: 'name'
  })
// found: 0

// ✅ Решение 1: проверьте регистр (query приводится к lowercase)
// ✅ Решение 2: проверьте индексацию поля
const collection = await client.collections('products').retrieve()
console.log('Indexed fields:', collection.fields.filter(f => f.index))

// ✅ Решение 3: увеличьте typo tolerance
const results = await client.collections('products')
  .documents()
  .search({
    q: 'iphone',
    query_by: 'name',
    num_typos: 3
  })
```

### Проблема: Медленный поиск

```typescript
// ❌ Медленно
const results = await client.collections('products')
  .documents()
  .search({
    q: 'laptop',
    query_by: 'name,description,long_text_field',
    infix: 'always',
    per_page: 100
  })

// ✅ Оптимизация
const results = await client.collections('products')
  .documents()
  .search({
    q: 'laptop',
    query_by: 'name',              // Меньше полей
    infix: 'fallback',             // Не always
    per_page: 20                   // Меньше результатов
  })
```

### Проблема: Неправильная релевантность

```typescript
// ❌ Не те результаты сверху
const results = await client.collections('products')
  .documents()
  .search({
    q: 'laptop gaming',
    query_by: 'name,description'
  })

// ✅ Настройте веса полей
const results = await client.collections('products')
  .documents()
  .search({
    q: 'laptop gaming',
    query_by: 'name,description',
    query_by_weights: '3,1'        // name важнее в 3 раза
  })
```

---

## FAQ

**Q: Можно ли искать по полям, не являющимся string?**

A: Нет, `query_by` работает только с `string` и `string[]` полями. Для числовых/bool полей используйте `filter_by`.

**Q: Как искать по массиву строк?**

A: Просто добавьте поле `string[]` в `query_by`:

```typescript
const results = await client.collections('products')
  .documents()
  .search({
    q: 'electronics',
    query_by: 'name,tags'  // tags это string[]
  })
```

**Q: Сколько полей можно указать в query_by?**

A: Технически неограниченно, но рекомендуется не более 5-7 для производительности.

**Q: Как искать в nested полях?**

A: Используйте точечную нотацию:

```typescript
const results = await client.collections('products')
  .documents()
  .search({
    q: 'Apple',
    query_by: 'details.manufacturer'  // Вложенное поле
  })
```

**Q: Работает ли поиск с emoji?**

A: Да, emoji индексируются:

```typescript
const results = await client.collections('products')
  .documents()
  .search({
    q: '🔥',
    query_by: 'name,description'
  })
```

---

## Следующие шаги

- Изучите [продвинутый поиск](./02-advanced-search.md) для weights, typo tolerance, stemming
- Настройте [фильтры и фасеты](./03-filters-facets.md) для уточнения результатов
- Оптимизируйте [сортировку](./04-sorting.md) результатов
- Добавьте [подсветку](./05-highlighting.md) найденных терминов
- Создайте [presets](./06-presets.md) для повторного использования

---

**Назад**: [← Обзор поиска](./README.md) | **Далее**: [Продвинутый поиск →](./02-advanced-search.md)
