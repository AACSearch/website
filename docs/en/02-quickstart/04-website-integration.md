# 2.4 Интеграция с сайтом

В этом руководстве вы узнаете, как интегрировать поиск AACSearch на ваш сайт или в приложение. Мы рассмотрим различные варианты интеграции для популярных фреймворков и платформ.

## Содержание

- [Получение API ключа](#получение-api-ключа)
- [JavaScript SDK](#javascript-sdk)
- [React интеграция](#react-интеграция)
- [Vue.js интеграция](#vuejs-интеграция)
- [Vanilla JavaScript](#vanilla-javascript)
- [WordPress Plugin](#wordpress-plugin)
- [Shopify App](#shopify-app)
- [Что дальше](#что-дальше)

---

## Получение API ключа

Перед интеграцией вам нужен API ключ для авторизации запросов.

### Создание Search Only ключа

Для фронтенда используйте **Search Only** ключ (безопасно публиковать в коде):

**Меню** → **"Настройки"** → **"API ключи"** → **"Создать ключ"**

```
┌─────────────────────────────────────────┐
│  Создать API ключ                       │
├─────────────────────────────────────────┤
│ Название:                               │
│ [Frontend Search Key]                   │
│                                         │
│ Тип:                                    │
│ (•) Search Only (для фронтенда)         │
│ ( ) Admin (для бэкенда)                 │
│                                         │
│ Коллекции:                              │
│ [✓] products                            │
│ [✓] articles                            │
│                                         │
│ [Создать]                               │
└─────────────────────────────────────────┘
```

**Сохраните ключ:**
```
API Key: aacs_live_pk_abc123def456ghi789
Tenant ID: ten_xyz789abc123
```

---

## JavaScript SDK

Самый простой способ интеграции — использовать официальный JavaScript SDK.

### Установка

#### Через CDN (быстрый старт)

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.aacsearch.com/sdk/v1/aacsearch.min.js"></script>
</head>
<body>
  <script>
    const client = new AACSearch({
      apiKey: 'aacs_live_pk_abc123...',
      tenantId: 'ten_xyz789...'
    });
  </script>
</body>
</html>
```

#### Через npm/yarn

```bash
npm install @aacsearch/js

# или
yarn add @aacsearch/js
```

```javascript
import AACSearch from '@aacsearch/js';

const client = new AACSearch({
  apiKey: 'aacs_live_pk_abc123...',
  tenantId: 'ten_xyz789...'
});
```

### Базовое использование

```javascript
// Поиск
const results = await client.search({
  collection: 'products',
  q: 'laptop',
  per_page: 10
});

console.log(results);
// {
//   found: 45,
//   hits: [{ document: {...}, highlights: {...} }],
//   facet_counts: [...],
//   search_time_ms: 12
// }
```

### Полный пример

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Поиск товаров</title>
  <script src="https://cdn.aacsearch.com/sdk/v1/aacsearch.min.js"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
    }

    #search-input {
      width: 100%;
      padding: 15px;
      font-size: 16px;
      border: 2px solid #ddd;
      border-radius: 8px;
    }

    #results {
      margin-top: 30px;
    }

    .result-item {
      padding: 20px;
      margin-bottom: 15px;
      border: 1px solid #eee;
      border-radius: 8px;
    }

    .result-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 8px;
    }

    .result-description {
      color: #666;
      margin-bottom: 8px;
    }

    .result-price {
      font-size: 20px;
      color: #27ae60;
      font-weight: bold;
    }

    mark {
      background-color: #fff3cd;
      padding: 2px 4px;
    }

    .loading {
      text-align: center;
      color: #999;
    }
  </style>
</head>
<body>
  <h1>Поиск товаров</h1>

  <input
    type="text"
    id="search-input"
    placeholder="Поиск по каталогу..."
    autocomplete="off"
  >

  <div id="results"></div>

  <script>
    // Инициализация клиента
    const client = new AACSearch({
      apiKey: 'aacs_live_pk_abc123def456ghi789',
      tenantId: 'ten_xyz789abc123'
    });

    const searchInput = document.getElementById('search-input');
    const resultsDiv = document.getElementById('results');

    let debounceTimer;

    // Обработчик ввода
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();

      // Debounce для оптимизации
      clearTimeout(debounceTimer);

      if (query.length < 2) {
        resultsDiv.innerHTML = '';
        return;
      }

      resultsDiv.innerHTML = '<div class="loading">Поиск...</div>';

      debounceTimer = setTimeout(() => {
        performSearch(query);
      }, 300);
    });

    // Функция поиска
    async function performSearch(query) {
      try {
        const results = await client.search({
          collection: 'products',
          q: query,
          query_by: 'title,description',
          per_page: 10,
          facet_by: 'category',
          sort_by: '_text_match:desc',
          highlight_full_fields: 'title,description'
        });

        displayResults(results);
      } catch (error) {
        console.error('Search error:', error);
        resultsDiv.innerHTML = `
          <div class="error">
            Произошла ошибка при поиске. Попробуйте еще раз.
          </div>
        `;
      }
    }

    // Отображение результатов
    function displayResults(results) {
      if (results.found === 0) {
        resultsDiv.innerHTML = '<div>Ничего не найдено</div>';
        return;
      }

      const html = `
        <div style="margin-bottom: 15px;">
          Найдено: <strong>${results.found}</strong>
          (за ${results.search_time_ms}ms)
        </div>
        ${results.hits.map(hit => {
          const doc = hit.document;
          const title = hit.highlights?.title?.snippet || doc.title;
          const description = hit.highlights?.description?.snippet || doc.description;

          return `
            <div class="result-item">
              <div class="result-title">${title}</div>
              <div class="result-description">${description}</div>
              <div class="result-price">$${doc.price}</div>
            </div>
          `;
        }).join('')}
      `;

      resultsDiv.innerHTML = html;
    }

    // Фокус на input при загрузке
    searchInput.focus();
  </script>
</body>
</html>
```

---

## React интеграция

Для React приложений используйте официальный хук `useSearch`.

### Установка

```bash
npm install @aacsearch/react

# Зависимости
npm install react react-dom
```

### Базовый компонент

```jsx
import React from 'react';
import { AACSearchProvider, useSearch } from '@aacsearch/react';

// Обертка приложения
function App() {
  return (
    <AACSearchProvider
      apiKey="aacs_live_pk_abc123..."
      tenantId="ten_xyz789..."
    >
      <SearchBox />
    </AACSearchProvider>
  );
}

// Компонент поиска
function SearchBox() {
  const {
    query,
    setQuery,
    results,
    loading,
    error
  } = useSearch({
    collection: 'products',
    searchOptions: {
      query_by: 'title,description',
      per_page: 10,
      facet_by: 'category'
    }
  });

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск товаров..."
      />

      {loading && <div>Загрузка...</div>}
      {error && <div>Ошибка: {error.message}</div>}

      {results && (
        <div>
          <p>Найдено: {results.found}</p>
          {results.hits.map(hit => (
            <div key={hit.document.id}>
              <h3>{hit.document.title}</h3>
              <p>{hit.document.description}</p>
              <strong>${hit.document.price}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
```

### Продвинутый пример с фильтрами

```jsx
import React, { useState } from 'react';
import { AACSearchProvider, useSearch } from '@aacsearch/react';

function SearchWithFilters() {
  const [filters, setFilters] = useState({
    category: null,
    priceRange: null
  });

  const {
    query,
    setQuery,
    results,
    loading
  } = useSearch({
    collection: 'products',
    searchOptions: {
      query_by: 'title,description',
      filter_by: buildFilterString(filters),
      facet_by: 'category,brand',
      sort_by: '_text_match:desc',
      per_page: 20
    },
    debounce: 300 // Задержка перед поиском
  });

  function buildFilterString(filters) {
    const conditions = [];

    if (filters.category) {
      conditions.push(`category:${filters.category}`);
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      conditions.push(`price:[${min}..${max}]`);
    }

    return conditions.join(' && ');
  }

  return (
    <div className="search-container">
      {/* Поисковая строка */}
      <div className="search-box">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск..."
        />
      </div>

      <div className="search-content">
        {/* Фильтры */}
        <aside className="filters">
          <h3>Фильтры</h3>

          {/* Категории из фасетов */}
          {results?.facet_counts?.[0]?.counts && (
            <div>
              <h4>Категория</h4>
              {results.facet_counts[0].counts.map(facet => (
                <label key={facet.value}>
                  <input
                    type="checkbox"
                    checked={filters.category === facet.value}
                    onChange={(e) => setFilters({
                      ...filters,
                      category: e.target.checked ? facet.value : null
                    })}
                  />
                  {facet.value} ({facet.count})
                </label>
              ))}
            </div>
          )}

          {/* Ценовой диапазон */}
          <div>
            <h4>Цена</h4>
            <label>
              <input
                type="radio"
                name="price"
                onChange={() => setFilters({
                  ...filters,
                  priceRange: [0, 100]
                })}
              />
              До $100
            </label>
            <label>
              <input
                type="radio"
                name="price"
                onChange={() => setFilters({
                  ...filters,
                  priceRange: [100, 500]
                })}
              />
              $100 - $500
            </label>
            <label>
              <input
                type="radio"
                name="price"
                onChange={() => setFilters({
                  ...filters,
                  priceRange: [500, 9999]
                })}
              />
              От $500
            </label>
          </div>
        </aside>

        {/* Результаты */}
        <main className="results">
          {loading && <div>Загрузка...</div>}

          {results && (
            <>
              <div className="results-header">
                <span>Найдено: {results.found}</span>
                <span>Время: {results.search_time_ms}ms</span>
              </div>

              <div className="results-grid">
                {results.hits.map(hit => (
                  <ProductCard key={hit.document.id} hit={hit} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

// Компонент карточки товара
function ProductCard({ hit }) {
  const doc = hit.document;
  const title = hit.highlights?.title?.snippet || doc.title;

  return (
    <div className="product-card">
      {doc.image_url && (
        <img src={doc.image_url} alt={doc.title} />
      )}
      <h3 dangerouslySetInnerHTML={{ __html: title }} />
      <p>{doc.description}</p>
      <div className="price">${doc.price}</div>
      <button>В корзину</button>
    </div>
  );
}

export default SearchWithFilters;
```

### TypeScript типизация

```typescript
import { SearchResponse, SearchParams } from '@aacsearch/react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
}

function TypedSearchBox() {
  const {
    results
  } = useSearch<Product>({
    collection: 'products',
    searchOptions: {
      query_by: 'title,description'
    }
  });

  return (
    <div>
      {results?.hits.map(hit => {
        // TypeScript знает структуру Product
        const product: Product = hit.document;
        return <div key={product.id}>{product.title}</div>;
      })}
    </div>
  );
}
```

---

## Vue.js интеграция

Для Vue.js используйте composable `useSearch`.

### Установка

```bash
npm install @aacsearch/vue

# Для Vue 3
npm install vue@^3.0.0
```

### Composition API (Vue 3)

```vue
<template>
  <div class="search-container">
    <input
      v-model="query"
      type="text"
      placeholder="Поиск..."
      @input="handleSearch"
    />

    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error">Ошибка: {{ error.message }}</div>

    <div v-else-if="results">
      <p>Найдено: {{ results.found }}</p>

      <div
        v-for="hit in results.hits"
        :key="hit.document.id"
        class="result-item"
      >
        <h3 v-html="hit.highlights?.title?.snippet || hit.document.title"></h3>
        <p>{{ hit.document.description }}</p>
        <strong>${{ hit.document.price }}</strong>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSearch } from '@aacsearch/vue';

const query = ref('');

const {
  results,
  loading,
  error,
  search
} = useSearch({
  apiKey: 'aacs_live_pk_abc123...',
  tenantId: 'ten_xyz789...',
  collection: 'products',
  searchOptions: {
    query_by: 'title,description',
    per_page: 10
  }
});

let debounceTimer;

function handleSearch() {
  clearTimeout(debounceTimer);

  if (query.value.length < 2) return;

  debounceTimer = setTimeout(() => {
    search(query.value);
  }, 300);
}
</script>

<style scoped>
.search-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

input {
  width: 100%;
  padding: 15px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
}

.result-item {
  padding: 20px;
  margin: 15px 0;
  border: 1px solid #eee;
  border-radius: 8px;
}
</style>
```

### Options API (Vue 2)

```vue
<template>
  <div>
    <input
      v-model="query"
      @input="handleSearch"
      placeholder="Поиск..."
    />

    <div v-if="loading">Загрузка...</div>

    <div v-else-if="results">
      <div
        v-for="hit in results.hits"
        :key="hit.document.id"
      >
        <h3>{{ hit.document.title }}</h3>
        <p>{{ hit.document.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import AACSearch from '@aacsearch/vue';

export default {
  data() {
    return {
      query: '',
      results: null,
      loading: false,
      debounceTimer: null
    };
  },

  created() {
    this.client = new AACSearch({
      apiKey: 'aacs_live_pk_abc123...',
      tenantId: 'ten_xyz789...'
    });
  },

  methods: {
    handleSearch() {
      clearTimeout(this.debounceTimer);

      if (this.query.length < 2) {
        this.results = null;
        return;
      }

      this.debounceTimer = setTimeout(() => {
        this.performSearch();
      }, 300);
    },

    async performSearch() {
      this.loading = true;

      try {
        this.results = await this.client.search({
          collection: 'products',
          q: this.query,
          query_by: 'title,description',
          per_page: 10
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
```

---

## Vanilla JavaScript

Интеграция без фреймворков с использованием чистого JavaScript.

### Минимальный пример

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Search</title>
</head>
<body>
  <input type="text" id="search" placeholder="Поиск...">
  <div id="results"></div>

  <script>
    const API_KEY = 'aacs_live_pk_abc123...';
    const TENANT_ID = 'ten_xyz789...';
    const API_URL = 'https://api.aacsearch.com/v1';

    const searchInput = document.getElementById('search');
    const resultsDiv = document.getElementById('results');

    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);

      const query = e.target.value.trim();
      if (query.length < 2) {
        resultsDiv.innerHTML = '';
        return;
      }

      debounceTimer = setTimeout(() => {
        performSearch(query);
      }, 300);
    });

    async function performSearch(query) {
      resultsDiv.innerHTML = 'Загрузка...';

      try {
        const response = await fetch(
          `${API_URL}/collections/products/search?q=${encodeURIComponent(query)}&per_page=10`,
          {
            headers: {
              'X-API-Key': API_KEY,
              'X-Tenant-ID': TENANT_ID
            }
          }
        );

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        displayResults(data);
      } catch (error) {
        resultsDiv.innerHTML = 'Ошибка поиска';
        console.error(error);
      }
    }

    function displayResults(data) {
      if (data.found === 0) {
        resultsDiv.innerHTML = 'Ничего не найдено';
        return;
      }

      resultsDiv.innerHTML = data.hits.map(hit => `
        <div style="border:1px solid #ddd; padding:15px; margin:10px 0;">
          <h3>${hit.document.title}</h3>
          <p>${hit.document.description}</p>
          <strong>$${hit.document.price}</strong>
        </div>
      `).join('');
    }
  </script>
</body>
</html>
```

### С использованием Fetch API и async/await

```javascript
class SearchClient {
  constructor(apiKey, tenantId) {
    this.apiKey = apiKey;
    this.tenantId = tenantId;
    this.baseURL = 'https://api.aacsearch.com/v1';
  }

  async search(collection, params) {
    const url = new URL(`${this.baseURL}/collections/${collection}/search`);

    // Добавление параметров
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-Key': this.apiKey,
        'X-Tenant-ID': this.tenantId,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Search failed');
    }

    return await response.json();
  }

  async multiSearch(searches) {
    const response = await fetch(`${this.baseURL}/multi_search`, {
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
        'X-Tenant-ID': this.tenantId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ searches })
    });

    if (!response.ok) {
      throw new Error('Multi-search failed');
    }

    return await response.json();
  }
}

// Использование
const client = new SearchClient(
  'aacs_live_pk_abc123...',
  'ten_xyz789...'
);

// Поиск
const results = await client.search('products', {
  q: 'laptop',
  query_by: 'title,description',
  filter_by: 'price:>500',
  sort_by: 'price:asc',
  per_page: 20
});

console.log(results);
```

---

## WordPress Plugin

Официальный плагин для WordPress.

### Установка

1. **Через WordPress Admin:**
   - Плагины → Добавить новый
   - Поиск: "AACSearch"
   - Установить → Активировать

2. **Вручную:**
   ```bash
   cd wp-content/plugins/
   wget https://downloads.aacsearch.com/wordpress/aacsearch.zip
   unzip aacsearch.zip
   ```

### Настройка

После активации:

**Настройки** → **AACSearch**

```
┌─────────────────────────────────────────┐
│  AACSearch Settings                     │
├─────────────────────────────────────────┤
│                                         │
│ API Key:                                │
│ [aacs_live_pk_abc123...     ]           │
│                                         │
│ Tenant ID:                              │
│ [ten_xyz789...              ]           │
│                                         │
│ Collection Name:                        │
│ [wordpress_posts            ]           │
│                                         │
│ ──── Что индексировать? ────            │
│                                         │
│ [✓] Posts                               │
│ [✓] Pages                               │
│ [✓] Custom Post Types                   │
│ [ ] Comments                            │
│                                         │
│ ──── Поля для индексации ────           │
│                                         │
│ [✓] Title                               │
│ [✓] Content                             │
│ [✓] Excerpt                             │
│ [✓] Categories                          │
│ [✓] Tags                                │
│ [ ] Custom Fields                       │
│                                         │
│ ──── Автосинхронизация ────             │
│                                         │
│ [✓] Индексировать при публикации        │
│ [✓] Обновлять при редактировании        │
│ [✓] Удалять при удалении поста          │
│                                         │
│ [Сохранить настройки]                   │
│ [Полная переиндексация]                 │
└─────────────────────────────────────────┘
```

### Использование shortcode

```
[aacsearch]
```

Параметры:
```
[aacsearch
  collection="wordpress_posts"
  placeholder="Поиск по блогу..."
  limit="10"
  show_categories="true"
]
```

### Пример темы

```php
<?php
// В header.php или любом другом файле темы
?>

<form role="search" class="search-form">
  <input
    type="text"
    id="aacsearch-input"
    placeholder="Поиск..."
  />
  <div id="aacsearch-results"></div>
</form>

<script>
  // JavaScript уже подключен плагином
  jQuery(document).ready(function($) {
    $('#aacsearch-input').aacSearch({
      collection: 'wordpress_posts',
      limit: 10,
      onSelect: function(result) {
        window.location.href = result.document.url;
      }
    });
  });
</script>
```

---

## Shopify App

Официальное приложение для Shopify.

### Установка

1. Откройте Shopify App Store
2. Поиск: "AACSearch"
3. Нажмите "Add app"
4. Разрешите необходимые права

### Настройка

После установки в Shopify Admin:

**Apps** → **AACSearch** → **Settings**

```
API Configuration:
- API Key: (автоматически)
- Collection: shopify_products

Sync Settings:
☑ Products
☑ Variants
☑ Collections
☑ Metafields

Search Settings:
☑ Enable instant search
☑ Show product images
☑ Show prices
☑ Show inventory status

Appearance:
Theme: [Light ▼]
Position: [Top Right ▼]
```

### Liquid integration

```liquid
<!-- В theme.liquid -->
<div id="aacsearch-container"></div>

{{ 'aacsearch.css' | asset_url | stylesheet_tag }}
{{ 'aacsearch.js' | asset_url | script_tag }}

<script>
  AACSearchShopify.init({
    apiKey: '{{ shop.metafields.aacsearch.api_key }}',
    tenantId: '{{ shop.metafields.aacsearch.tenant_id }}',
    collection: 'shopify_products'
  });
</script>
```

### Custom template

```liquid
<!-- templates/search.liquid -->
<div class="search-page">
  <h1>{{ 'general.search.title' | t }}</h1>

  <div id="aacsearch-box"></div>

  <div id="aacsearch-results">
    <!-- Results будут вставлены сюда -->
  </div>
</div>

<script>
  const search = new AACSearchShopify({
    container: '#aacsearch-box',
    resultsContainer: '#aacsearch-results',
    template: (hit) => `
      <div class="product-card">
        <img src="${hit.document.image_url}" alt="${hit.document.title}">
        <h3>${hit.document.title}</h3>
        <p>${hit.document.vendor}</p>
        <span class="price">${Shopify.formatMoney(hit.document.price)}</span>
        <a href="${hit.document.url}" class="btn">Подробнее</a>
      </div>
    `
  });
</script>
```

---

## Что дальше?

Поздравляем! Вы успешно интегрировали поиск на ваш сайт.

### Следующие шаги

#### 1. Примеры кода на других языках
➡️ **[2.5 Примеры кода](./05-code-examples.md)**

Узнайте, как работать с API на:
- Python
- PHP
- Ruby
- Go
- Java

#### 2. Настройте UI

**Кастомизация внешнего вида:**
```css
/* Ваши стили */
.aacsearch-container {
  /* ... */
}
```

**Используйте готовые темы:**
```javascript
AACSearch.init({
  theme: 'dark', // light, dark, custom
  customCSS: '/path/to/custom.css'
});
```

#### 3. Добавьте продвинутые функции

- **Автодополнение** (autocomplete)
- **Голосовой поиск**
- **Поиск по изображению**
- **Персонализация результатов**

---

## Troubleshooting

### CORS ошибки

**Проблема:**
```
Access to fetch at 'https://api.aacsearch.com'
from origin 'http://localhost:3000' has been blocked by CORS
```

**Решение:**
1. Используйте Search Only ключ (не Admin)
2. Добавьте домен в whitelist: Настройки → API ключи → Domains

### Медленная загрузка

**Оптимизация:**
- Используйте debounce (300-500ms)
- Кэшируйте результаты
- Загружайте SDK асинхронно
- Используйте CDN для статики

### API ключ виден в коде

**Это нормально для Search Only ключа:**
- Он ограничен только чтением
- Не может изменять данные
- Rate limited

**Для Admin ключей:**
- НИКОГДА не используйте в frontend
- Храните в переменных окружения
- Используйте только на backend

---

## FAQ

### Можно ли использовать без SDK?

Да! Просто делайте HTTP запросы к API:
```javascript
fetch('https://api.aacsearch.com/v1/collections/products/search?q=laptop', {
  headers: {
    'X-API-Key': 'YOUR_KEY',
    'X-Tenant-ID': 'YOUR_TENANT'
  }
})
```

### Поддерживается ли SSR (Server-Side Rendering)?

Да! SDK работает в Node.js:
```javascript
// Next.js example
export async function getServerSideProps() {
  const client = new AACSearch({...});
  const results = await client.search({...});

  return {
    props: { results }
  };
}
```

### Как работает offline?

SDK автоматически кэширует результаты в LocalStorage:
```javascript
AACSearch.init({
  cache: true,
  cacheTTL: 3600 // 1 час
});
```

---

## Дополнительные ресурсы

### Документация
- [JavaScript SDK Reference](../../06-developer-guide/07-sdks.md#javascript)
- [React Hooks API](../../06-developer-guide/07-sdks.md#react)
- [Vue Composables](../../06-developer-guide/07-sdks.md#vue)

### Примеры
- [GitHub: React Examples](https://github.com/aacsearch/examples/react)
- [GitHub: Vue Examples](https://github.com/aacsearch/examples/vue)
- [CodeSandbox: Live Demos](https://codesandbox.io/aacsearch)

### Видео
- [Видео: React интеграция (15 мин)](https://youtube.com/aacsearch/react-integration)
- [Видео: WordPress setup (10 мин)](https://youtube.com/aacsearch/wordpress)

---

**Следующий раздел:** [2.5 Примеры кода](./05-code-examples.md)

**Обновлено:** 02.11.2025
