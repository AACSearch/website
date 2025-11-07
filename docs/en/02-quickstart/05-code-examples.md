# 2.5 Примеры кода

Полное руководство с примерами кода для всех популярных языков программирования. Все примеры готовы к использованию и покрывают основные операции с API.

## Содержание

- [JavaScript / TypeScript](#javascript--typescript)
- [Python](#python)
- [PHP](#php)
- [Ruby](#ruby)
- [Go](#go)
- [Java](#java)
- [C# / .NET](#c--net)
- [Общие операции](#общие-операции)

---

## JavaScript / TypeScript

### Установка

```bash
# npm
npm install @aacsearch/js

# yarn
yarn add @aacsearch/js

# pnpm
pnpm add @aacsearch/js
```

### Базовая настройка

```typescript
import AACSearch from '@aacsearch/js';

const client = new AACSearch({
  apiKey: 'aacs_live_pk_abc123...',
  tenantId: 'ten_xyz789...',
  // Опциональные параметры
  timeout: 5000, // ms
  retries: 3,
  logger: console // для отладки
});
```

### 1. Поиск документов

```typescript
// Базовый поиск
const results = await client.search({
  collection: 'products',
  q: 'laptop',
  per_page: 10
});

console.log(results);
// {
//   found: 45,
//   hits: [...],
//   facet_counts: [...],
//   search_time_ms: 12
// }
```

### 2. Поиск с фильтрами

```typescript
const results = await client.search({
  collection: 'products',
  q: 'laptop',
  query_by: 'title,description',
  filter_by: 'price:[500..1500] && category:Electronics',
  sort_by: '_text_match:desc,price:asc',
  facet_by: 'category,brand',
  max_facet_values: 10,
  per_page: 20,
  page: 1
});
```

### 3. Создание документа

```typescript
const document = {
  id: '1', // опционально, будет сгенерирован автоматически
  title: 'Ноутбук HP ProBook 450',
  description: 'Профессиональный ноутбук для бизнеса',
  price: 899.99,
  category: 'Электроника',
  in_stock: true,
  tags: ['laptop', 'business', 'hp']
};

const result = await client.collections('products').documents().create(document);

console.log(result);
// { id: '1', title: 'Ноутбук HP ProBook 450', ... }
```

### 4. Обновление документа

```typescript
// Полное обновление
await client.collections('products').documents('1').update({
  title: 'Ноутбук HP ProBook 450 G9',
  price: 949.99
});

// Частичное обновление
await client.collections('products').documents('1').patch({
  price: 949.99,
  in_stock: false
});
```

### 5. Удаление документа

```typescript
// Удалить один документ
await client.collections('products').documents('1').delete();

// Удалить по фильтру
await client.collections('products').documents().delete({
  filter_by: 'in_stock:false && price:<100'
});
```

### 6. Bulk операции (массовые)

```typescript
// Импорт множества документов
const documents = [
  { id: '1', title: 'Product 1', price: 99.99 },
  { id: '2', title: 'Product 2', price: 149.99 },
  { id: '3', title: 'Product 3', price: 199.99 }
];

const result = await client.collections('products')
  .documents()
  .import(documents, {
    action: 'upsert', // create, update, upsert
    batch_size: 100
  });

console.log(result);
// { success: true, num_imported: 3 }
```

### 7. Multi-Search (множественный поиск)

```typescript
const results = await client.multiSearch({
  searches: [
    {
      collection: 'products',
      q: 'laptop',
      query_by: 'title'
    },
    {
      collection: 'articles',
      q: 'laptop review',
      query_by: 'title,content'
    }
  ]
});

console.log(results.results[0]); // products results
console.log(results.results[1]); // articles results
```

### 8. Автодополнение (Suggestions)

```typescript
const suggestions = await client.collections('products')
  .documents()
  .autocomplete({
    q: 'lap',
    query_by: 'title',
    limit: 5
  });

console.log(suggestions);
// ['laptop', 'laptop bag', 'lap desk', ...]
```

### 9. Управление коллекциями

```typescript
// Создать коллекцию
await client.collections().create({
  name: 'products',
  fields: [
    { name: 'title', type: 'string', optional: false },
    { name: 'price', type: 'float', optional: false },
    { name: 'category', type: 'string', facet: true }
  ],
  default_sorting_field: 'price'
});

// Получить информацию о коллекции
const collection = await client.collections('products').retrieve();

// Удалить коллекцию
await client.collections('products').delete();
```

### 10. TypeScript типизация

```typescript
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  in_stock: boolean;
  tags: string[];
}

const results = await client.search<Product>({
  collection: 'products',
  q: 'laptop'
});

// TypeScript знает типы
results.hits.forEach(hit => {
  const product: Product = hit.document;
  console.log(product.title); // string
  console.log(product.price); // number
});
```

### 11. Error handling

```typescript
import { AACSearchError } from '@aacsearch/js';

try {
  const results = await client.search({
    collection: 'products',
    q: 'laptop'
  });
} catch (error) {
  if (error instanceof AACSearchError) {
    console.error('Status:', error.statusCode);
    console.error('Message:', error.message);
    console.error('Details:', error.details);
  } else {
    console.error('Unknown error:', error);
  }
}
```

---

## Python

### Установка

```bash
pip install aacsearch

# Или с poetry
poetry add aacsearch
```

### Базовая настройка

```python
from aacsearch import Client

client = Client(
    api_key='aacs_live_pk_abc123...',
    tenant_id='ten_xyz789...',
    timeout=5,  # seconds
    retries=3
)
```

### 1. Поиск документов

```python
# Базовый поиск
results = client.collections['products'].documents.search({
    'q': 'laptop',
    'query_by': 'title,description',
    'per_page': 10
})

print(f"Найдено: {results['found']}")
for hit in results['hits']:
    print(hit['document']['title'])
```

### 2. Поиск с фильтрами

```python
results = client.collections['products'].documents.search({
    'q': 'laptop',
    'query_by': 'title,description',
    'filter_by': 'price:[500..1500] && category:Electronics',
    'sort_by': '_text_match:desc,price:asc',
    'facet_by': 'category,brand',
    'max_facet_values': 10,
    'per_page': 20,
    'page': 1
})
```

### 3. Создание документа

```python
document = {
    'id': '1',
    'title': 'Ноутбук HP ProBook 450',
    'description': 'Профессиональный ноутбук',
    'price': 899.99,
    'category': 'Электроника',
    'in_stock': True,
    'tags': ['laptop', 'business', 'hp']
}

result = client.collections['products'].documents.create(document)
print(result)
```

### 4. Обновление документа

```python
# Полное обновление
client.collections['products'].documents['1'].update({
    'title': 'Ноутбук HP ProBook 450 G9',
    'price': 949.99
})

# Частичное обновление
client.collections['products'].documents['1'].patch({
    'price': 949.99
})
```

### 5. Удаление документа

```python
# Удалить один документ
client.collections['products'].documents['1'].delete()

# Удалить по фильтру
client.collections['products'].documents.delete({
    'filter_by': 'in_stock:false'
})
```

### 6. Bulk операции

```python
documents = [
    {'id': '1', 'title': 'Product 1', 'price': 99.99},
    {'id': '2', 'title': 'Product 2', 'price': 149.99},
    {'id': '3', 'title': 'Product 3', 'price': 199.99}
]

result = client.collections['products'].documents.import_(
    documents,
    {'action': 'upsert', 'batch_size': 100}
)

print(f"Импортировано: {result['num_imported']}")
```

### 7. Multi-Search

```python
results = client.multi_search({
    'searches': [
        {
            'collection': 'products',
            'q': 'laptop',
            'query_by': 'title'
        },
        {
            'collection': 'articles',
            'q': 'laptop review',
            'query_by': 'title,content'
        }
    ]
})

print(results['results'][0])  # products
print(results['results'][1])  # articles
```

### 8. Работа с коллекциями

```python
# Создать коллекцию
schema = {
    'name': 'products',
    'fields': [
        {'name': 'title', 'type': 'string', 'optional': False},
        {'name': 'price', 'type': 'float', 'optional': False},
        {'name': 'category', 'type': 'string', 'facet': True}
    ],
    'default_sorting_field': 'price'
}

client.collections.create(schema)

# Получить коллекцию
collection = client.collections['products'].retrieve()

# Удалить коллекцию
client.collections['products'].delete()
```

### 9. Context Manager (автоматическое закрытие)

```python
from aacsearch import Client

with Client(api_key='...', tenant_id='...') as client:
    results = client.collections['products'].documents.search({
        'q': 'laptop'
    })
    print(results)
# Соединение автоматически закроется
```

### 10. Async/await поддержка

```python
import asyncio
from aacsearch import AsyncClient

async def main():
    client = AsyncClient(
        api_key='aacs_live_pk_abc123...',
        tenant_id='ten_xyz789...'
    )

    results = await client.collections['products'].documents.search({
        'q': 'laptop'
    })

    print(results)

    await client.close()

asyncio.run(main())
```

### 11. Error handling

```python
from aacsearch.exceptions import AACSearchError, NotFoundError

try:
    results = client.collections['products'].documents.search({
        'q': 'laptop'
    })
except NotFoundError as e:
    print(f"Коллекция не найдена: {e}")
except AACSearchError as e:
    print(f"Ошибка API: {e.status_code} - {e.message}")
except Exception as e:
    print(f"Неизвестная ошибка: {e}")
```

---

## PHP

### Установка

```bash
composer require aacsearch/aacsearch-php
```

### Базовая настройка

```php
<?php
require 'vendor/autoload.php';

use AACSearch\Client;

$client = new Client([
    'api_key' => 'aacs_live_pk_abc123...',
    'tenant_id' => 'ten_xyz789...',
    'timeout' => 5, // seconds
]);
```

### 1. Поиск документов

```php
// Базовый поиск
$results = $client->collections['products']->documents->search([
    'q' => 'laptop',
    'query_by' => 'title,description',
    'per_page' => 10
]);

echo "Найдено: " . $results['found'] . "\n";

foreach ($results['hits'] as $hit) {
    echo $hit['document']['title'] . "\n";
}
```

### 2. Поиск с фильтрами

```php
$results = $client->collections['products']->documents->search([
    'q' => 'laptop',
    'query_by' => 'title,description',
    'filter_by' => 'price:[500..1500] && category:Electronics',
    'sort_by' => '_text_match:desc,price:asc',
    'facet_by' => 'category,brand',
    'max_facet_values' => 10,
    'per_page' => 20,
    'page' => 1
]);
```

### 3. Создание документа

```php
$document = [
    'id' => '1',
    'title' => 'Ноутбук HP ProBook 450',
    'description' => 'Профессиональный ноутбук',
    'price' => 899.99,
    'category' => 'Электроника',
    'in_stock' => true,
    'tags' => ['laptop', 'business', 'hp']
];

$result = $client->collections['products']->documents->create($document);

print_r($result);
```

### 4. Обновление документа

```php
// Полное обновление
$client->collections['products']->documents['1']->update([
    'title' => 'Ноутбук HP ProBook 450 G9',
    'price' => 949.99
]);

// Частичное обновление
$client->collections['products']->documents['1']->patch([
    'price' => 949.99
]);
```

### 5. Удаление документа

```php
// Удалить один документ
$client->collections['products']->documents['1']->delete();

// Удалить по фильтру
$client->collections['products']->documents->delete([
    'filter_by' => 'in_stock:false'
]);
```

### 6. Bulk операции

```php
$documents = [
    ['id' => '1', 'title' => 'Product 1', 'price' => 99.99],
    ['id' => '2', 'title' => 'Product 2', 'price' => 149.99],
    ['id' => '3', 'title' => 'Product 3', 'price' => 199.99]
];

$result = $client->collections['products']->documents->import(
    $documents,
    ['action' => 'upsert', 'batch_size' => 100]
);

echo "Импортировано: " . $result['num_imported'] . "\n";
```

### 7. Multi-Search

```php
$results = $client->multiSearch([
    'searches' => [
        [
            'collection' => 'products',
            'q' => 'laptop',
            'query_by' => 'title'
        ],
        [
            'collection' => 'articles',
            'q' => 'laptop review',
            'query_by' => 'title,content'
        ]
    ]
]);

print_r($results['results'][0]); // products
print_r($results['results'][1]); // articles
```

### 8. Работа с коллекциями

```php
// Создать коллекцию
$schema = [
    'name' => 'products',
    'fields' => [
        ['name' => 'title', 'type' => 'string', 'optional' => false],
        ['name' => 'price', 'type' => 'float', 'optional' => false],
        ['name' => 'category', 'type' => 'string', 'facet' => true]
    ],
    'default_sorting_field' => 'price'
];

$client->collections->create($schema);

// Получить коллекцию
$collection = $client->collections['products']->retrieve();

// Удалить коллекцию
$client->collections['products']->delete();
```

### 9. Error handling

```php
use AACSearch\Exceptions\AACSearchException;
use AACSearch\Exceptions\NotFoundException;

try {
    $results = $client->collections['products']->documents->search([
        'q' => 'laptop'
    ]);
} catch (NotFoundException $e) {
    echo "Коллекция не найдена: " . $e->getMessage() . "\n";
} catch (AACSearchException $e) {
    echo "Ошибка API: " . $e->getStatusCode() . " - " . $e->getMessage() . "\n";
} catch (Exception $e) {
    echo "Неизвестная ошибка: " . $e->getMessage() . "\n";
}
```

### 10. Laravel интеграция

```php
// config/aacsearch.php
return [
    'api_key' => env('AACSEARCH_API_KEY'),
    'tenant_id' => env('AACSEARCH_TENANT_ID'),
];

// app/Providers/AppServiceProvider.php
use AACSearch\Client;

public function register()
{
    $this->app->singleton(Client::class, function ($app) {
        return new Client([
            'api_key' => config('aacsearch.api_key'),
            'tenant_id' => config('aacsearch.tenant_id'),
        ]);
    });
}

// Использование в контроллере
use AACSearch\Client;

class SearchController extends Controller
{
    public function search(Request $request, Client $client)
    {
        $results = $client->collections['products']->documents->search([
            'q' => $request->input('q')
        ]);

        return view('search.results', compact('results'));
    }
}
```

---

## Ruby

### Установка

```bash
gem install aacsearch

# Или в Gemfile
gem 'aacsearch'
```

### Базовая настройка

```ruby
require 'aacsearch'

client = AACSearch::Client.new(
  api_key: 'aacs_live_pk_abc123...',
  tenant_id: 'ten_xyz789...',
  timeout: 5 # seconds
)
```

### 1. Поиск документов

```ruby
# Базовый поиск
results = client.collections['products'].documents.search(
  q: 'laptop',
  query_by: 'title,description',
  per_page: 10
)

puts "Найдено: #{results['found']}"
results['hits'].each do |hit|
  puts hit['document']['title']
end
```

### 2. Поиск с фильтрами

```ruby
results = client.collections['products'].documents.search(
  q: 'laptop',
  query_by: 'title,description',
  filter_by: 'price:[500..1500] && category:Electronics',
  sort_by: '_text_match:desc,price:asc',
  facet_by: 'category,brand',
  max_facet_values: 10,
  per_page: 20,
  page: 1
)
```

### 3. Создание документа

```ruby
document = {
  id: '1',
  title: 'Ноутбук HP ProBook 450',
  description: 'Профессиональный ноутбук',
  price: 899.99,
  category: 'Электроника',
  in_stock: true,
  tags: ['laptop', 'business', 'hp']
}

result = client.collections['products'].documents.create(document)
puts result
```

### 4. Обновление документа

```ruby
# Полное обновление
client.collections['products'].documents['1'].update(
  title: 'Ноутбук HP ProBook 450 G9',
  price: 949.99
)

# Частичное обновление
client.collections['products'].documents['1'].patch(
  price: 949.99
)
```

### 5. Удаление документа

```ruby
# Удалить один документ
client.collections['products'].documents['1'].delete

# Удалить по фильтру
client.collections['products'].documents.delete(
  filter_by: 'in_stock:false'
)
```

### 6. Bulk операции

```ruby
documents = [
  { id: '1', title: 'Product 1', price: 99.99 },
  { id: '2', title: 'Product 2', price: 149.99 },
  { id: '3', title: 'Product 3', price: 199.99 }
]

result = client.collections['products'].documents.import(
  documents,
  action: 'upsert',
  batch_size: 100
)

puts "Импортировано: #{result['num_imported']}"
```

### 7. Multi-Search

```ruby
results = client.multi_search(
  searches: [
    {
      collection: 'products',
      q: 'laptop',
      query_by: 'title'
    },
    {
      collection: 'articles',
      q: 'laptop review',
      query_by: 'title,content'
    }
  ]
)

puts results['results'][0] # products
puts results['results'][1] # articles
```

### 8. Работа с коллекциями

```ruby
# Создать коллекцию
schema = {
  name: 'products',
  fields: [
    { name: 'title', type: 'string', optional: false },
    { name: 'price', type: 'float', optional: false },
    { name: 'category', type: 'string', facet: true }
  ],
  default_sorting_field: 'price'
}

client.collections.create(schema)

# Получить коллекцию
collection = client.collections['products'].retrieve

# Удалить коллекцию
client.collections['products'].delete
```

### 9. Error handling

```ruby
begin
  results = client.collections['products'].documents.search(q: 'laptop')
rescue AACSearch::Error::NotFound => e
  puts "Коллекция не найдена: #{e.message}"
rescue AACSearch::Error => e
  puts "Ошибка API: #{e.status_code} - #{e.message}"
rescue StandardError => e
  puts "Неизвестная ошибка: #{e.message}"
end
```

### 10. Rails интеграция

```ruby
# config/initializers/aacsearch.rb
AACSearch.configure do |config|
  config.api_key = Rails.application.credentials.aacsearch[:api_key]
  config.tenant_id = Rails.application.credentials.aacsearch[:tenant_id]
end

# app/models/product.rb
class Product < ApplicationRecord
  include AACSearch::Model

  aacsearch collection: 'products',
            fields: [:id, :title, :description, :price, :category]

  after_commit :index_to_search, on: [:create, :update]
  after_commit :remove_from_search, on: :destroy

  def index_to_search
    aacsearch_index
  end

  def remove_from_search
    aacsearch_remove
  end
end

# Использование
Product.search('laptop')
```

---

## Go

### Установка

```bash
go get github.com/aacsearch/aacsearch-go
```

### Базовая настройка

```go
package main

import (
    "github.com/aacsearch/aacsearch-go"
)

func main() {
    client := aacsearch.NewClient(
        "aacs_live_pk_abc123...",
        "ten_xyz789...",
        aacsearch.WithTimeout(5),
    )
}
```

### 1. Поиск документов

```go
package main

import (
    "fmt"
    "log"
    "github.com/aacsearch/aacsearch-go"
)

func main() {
    client := aacsearch.NewClient("api_key", "tenant_id")

    // Базовый поиск
    results, err := client.Collections("products").Documents().Search(&aacsearch.SearchParams{
        Q:         "laptop",
        QueryBy:   "title,description",
        PerPage:   10,
    })

    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Найдено: %d\n", results.Found)
    for _, hit := range results.Hits {
        fmt.Println(hit.Document["title"])
    }
}
```

### 2. Поиск с фильтрами

```go
results, err := client.Collections("products").Documents().Search(&aacsearch.SearchParams{
    Q:              "laptop",
    QueryBy:        "title,description",
    FilterBy:       "price:[500..1500] && category:Electronics",
    SortBy:         "_text_match:desc,price:asc",
    FacetBy:        "category,brand",
    MaxFacetValues: 10,
    PerPage:        20,
    Page:           1,
})
```

### 3. Создание документа

```go
document := map[string]interface{}{
    "id":          "1",
    "title":       "Ноутбук HP ProBook 450",
    "description": "Профессиональный ноутбук",
    "price":       899.99,
    "category":    "Электроника",
    "in_stock":    true,
    "tags":        []string{"laptop", "business", "hp"},
}

result, err := client.Collections("products").Documents().Create(document)
if err != nil {
    log.Fatal(err)
}

fmt.Println(result)
```

### 4. Обновление документа

```go
// Полное обновление
err := client.Collections("products").Documents("1").Update(map[string]interface{}{
    "title": "Ноутбук HP ProBook 450 G9",
    "price": 949.99,
})

// Частичное обновление
err = client.Collections("products").Documents("1").Patch(map[string]interface{}{
    "price": 949.99,
})
```

### 5. Удаление документа

```go
// Удалить один документ
err := client.Collections("products").Documents("1").Delete()

// Удалить по фильтру
err = client.Collections("products").Documents().Delete(&aacsearch.DeleteParams{
    FilterBy: "in_stock:false",
})
```

### 6. Bulk операции

```go
documents := []interface{}{
    map[string]interface{}{"id": "1", "title": "Product 1", "price": 99.99},
    map[string]interface{}{"id": "2", "title": "Product 2", "price": 149.99},
    map[string]interface{}{"id": "3", "title": "Product 3", "price": 199.99},
}

result, err := client.Collections("products").Documents().Import(documents, &aacsearch.ImportParams{
    Action:    "upsert",
    BatchSize: 100,
})

if err != nil {
    log.Fatal(err)
}

fmt.Printf("Импортировано: %d\n", result.NumImported)
```

### 7. Multi-Search

```go
results, err := client.MultiSearch(&aacsearch.MultiSearchParams{
    Searches: []aacsearch.SearchParams{
        {
            Collection: "products",
            Q:          "laptop",
            QueryBy:    "title",
        },
        {
            Collection: "articles",
            Q:          "laptop review",
            QueryBy:    "title,content",
        },
    },
})

fmt.Println(results.Results[0]) // products
fmt.Println(results.Results[1]) // articles
```

### 8. Работа с коллекциями

```go
// Создать коллекцию
schema := &aacsearch.CollectionSchema{
    Name: "products",
    Fields: []aacsearch.Field{
        {Name: "title", Type: "string", Optional: false},
        {Name: "price", Type: "float", Optional: false},
        {Name: "category", Type: "string", Facet: true},
    },
    DefaultSortingField: "price",
}

err := client.Collections().Create(schema)

// Получить коллекцию
collection, err := client.Collections("products").Retrieve()

// Удалить коллекцию
err = client.Collections("products").Delete()
```

### 9. Typed structs

```go
type Product struct {
    ID          string   `json:"id"`
    Title       string   `json:"title"`
    Description string   `json:"description"`
    Price       float64  `json:"price"`
    Category    string   `json:"category"`
    InStock     bool     `json:"in_stock"`
    Tags        []string `json:"tags"`
}

func main() {
    client := aacsearch.NewClient("api_key", "tenant_id")

    // Поиск с typed результатами
    var products []Product
    results, err := client.Collections("products").Documents().SearchTyped(&products, &aacsearch.SearchParams{
        Q: "laptop",
    })

    for _, product := range products {
        fmt.Printf("%s - $%.2f\n", product.Title, product.Price)
    }
}
```

### 10. Error handling

```go
import (
    "errors"
    "github.com/aacsearch/aacsearch-go"
)

results, err := client.Collections("products").Documents().Search(&aacsearch.SearchParams{
    Q: "laptop",
})

if err != nil {
    var apiErr *aacsearch.APIError
    if errors.As(err, &apiErr) {
        fmt.Printf("API Error: %d - %s\n", apiErr.StatusCode, apiErr.Message)
    } else {
        fmt.Printf("Unknown error: %v\n", err)
    }
    return
}
```

---

## Java

### Установка (Maven)

```xml
<dependency>
    <groupId>com.aacsearch</groupId>
    <artifactId>aacsearch-java</artifactId>
    <version>1.0.0</version>
</dependency>
```

### Установка (Gradle)

```gradle
implementation 'com.aacsearch:aacsearch-java:1.0.0'
```

### Базовая настройка

```java
import com.aacsearch.Client;
import com.aacsearch.ClientConfiguration;

public class Main {
    public static void main(String[] args) {
        ClientConfiguration config = new ClientConfiguration.Builder()
            .apiKey("aacs_live_pk_abc123...")
            .tenantId("ten_xyz789...")
            .timeout(5000) // milliseconds
            .build();

        Client client = new Client(config);
    }
}
```

### 1. Поиск документов

```java
import com.aacsearch.SearchParameters;
import com.aacsearch.SearchResult;

// Базовый поиск
SearchParameters params = new SearchParameters.Builder()
    .q("laptop")
    .queryBy("title,description")
    .perPage(10)
    .build();

SearchResult result = client.collections("products").documents().search(params);

System.out.println("Найдено: " + result.getFound());
result.getHits().forEach(hit -> {
    System.out.println(hit.getDocument().get("title"));
});
```

### 2. Создание документа

```java
import java.util.HashMap;
import java.util.Arrays;
import java.util.Map;

Map<String, Object> document = new HashMap<>();
document.put("id", "1");
document.put("title", "Ноутбук HP ProBook 450");
document.put("description", "Профессиональный ноутбук");
document.put("price", 899.99);
document.put("category", "Электроника");
document.put("in_stock", true);
document.put("tags", Arrays.asList("laptop", "business", "hp"));

Map<String, Object> result = client
    .collections("products")
    .documents()
    .create(document);

System.out.println(result);
```

### 3. Typed документы

```java
import com.aacsearch.annotations.Field;
import com.aacsearch.annotations.Document;

@Document(collection = "products")
public class Product {
    @Field(name = "id")
    private String id;

    @Field(name = "title")
    private String title;

    @Field(name = "price")
    private double price;

    @Field(name = "category")
    private String category;

    @Field(name = "tags")
    private List<String> tags;

    // Getters and setters
}

// Использование
Product product = new Product();
product.setTitle("Ноутбук HP ProBook 450");
product.setPrice(899.99);

Product saved = client.collections("products").documents().create(product, Product.class);
```

### 4. Error handling

```java
import com.aacsearch.exceptions.AACSearchException;
import com.aacsearch.exceptions.NotFoundException;

try {
    SearchResult result = client.collections("products").documents().search(params);
} catch (NotFoundException e) {
    System.err.println("Коллекция не найдена: " + e.getMessage());
} catch (AACSearchException e) {
    System.err.println("API Error: " + e.getStatusCode() + " - " + e.getMessage());
} catch (Exception e) {
    System.err.println("Unknown error: " + e.getMessage());
}
```

---

## C# / .NET

### Установка (NuGet)

```bash
dotnet add package AACSearch.Client
```

### Базовая настройка

```csharp
using AACSearch;

var client = new AACSearchClient(new Configuration
{
    ApiKey = "aacs_live_pk_abc123...",
    TenantId = "ten_xyz789...",
    Timeout = TimeSpan.FromSeconds(5)
});
```

### 1. Поиск документов

```csharp
using AACSearch.Models;

// Базовый поиск
var results = await client.Collections["products"].Documents.SearchAsync(new SearchParameters
{
    Q = "laptop",
    QueryBy = "title,description",
    PerPage = 10
});

Console.WriteLine($"Найдено: {results.Found}");
foreach (var hit in results.Hits)
{
    Console.WriteLine(hit.Document["title"]);
}
```

### 2. Создание документа

```csharp
var document = new Dictionary<string, object>
{
    ["id"] = "1",
    ["title"] = "Ноутбук HP ProBook 450",
    ["description"] = "Профессиональный ноутбук",
    ["price"] = 899.99,
    ["category"] = "Электроника",
    ["in_stock"] = true,
    ["tags"] = new[] { "laptop", "business", "hp" }
};

var result = await client.Collections["products"].Documents.CreateAsync(document);
Console.WriteLine(result);
```

### 3. Typed модели

```csharp
using System.Text.Json.Serialization;

public class Product
{
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; }

    [JsonPropertyName("price")]
    public double Price { get; set; }

    [JsonPropertyName("category")]
    public string Category { get; set; }

    [JsonPropertyName("tags")]
    public List<string> Tags { get; set; }
}

// Использование
var product = new Product
{
    Title = "Ноутбук HP ProBook 450",
    Price = 899.99,
    Category = "Электроника"
};

var saved = await client.Collections["products"].Documents.CreateAsync(product);
```

### 4. Error handling

```csharp
using AACSearch.Exceptions;

try
{
    var results = await client.Collections["products"].Documents.SearchAsync(new SearchParameters
    {
        Q = "laptop"
    });
}
catch (NotFoundException ex)
{
    Console.WriteLine($"Коллекция не найдена: {ex.Message}");
}
catch (AACSearchException ex)
{
    Console.WriteLine($"API Error: {ex.StatusCode} - {ex.Message}");
}
catch (Exception ex)
{
    Console.WriteLine($"Unknown error: {ex.Message}");
}
```

---

## Общие операции

### Пагинация

```javascript
// JavaScript
let page = 1;
const perPage = 20;

while (true) {
  const results = await client.search({
    collection: 'products',
    q: 'laptop',
    per_page: perPage,
    page: page
  });

  if (results.hits.length === 0) break;

  // Обработка результатов
  results.hits.forEach(hit => {
    console.log(hit.document.title);
  });

  page++;
}
```

### Rate limiting

```python
# Python с retry
import time
from aacsearch.exceptions import RateLimitError

def search_with_retry(client, params, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.collections['products'].documents.search(params)
        except RateLimitError as e:
            if attempt < max_retries - 1:
                wait_time = 2 ** attempt  # Exponential backoff
                time.sleep(wait_time)
            else:
                raise
```

### Streaming импорт

```go
// Go streaming import
func streamImport(client *aacsearch.Client, data chan map[string]interface{}) error {
    batch := make([]interface{}, 0, 100)

    for doc := range data {
        batch = append(batch, doc)

        if len(batch) >= 100 {
            _, err := client.Collections("products").Documents().Import(batch, nil)
            if err != nil {
                return err
            }
            batch = batch[:0]
        }
    }

    // Import remaining
    if len(batch) > 0 {
        _, err := client.Collections("products").Documents().Import(batch, nil)
        return err
    }

    return nil
}
```

---

## Дополнительные ресурсы

### Документация
- [API Reference](../../05-api-reference/README.md)
- [SDK документация](../../06-developer-guide/07-sdks.md)

### GitHub репозитории
- [JavaScript SDK](https://github.com/aacsearch/aacsearch-js)
- [Python SDK](https://github.com/aacsearch/aacsearch-python)
- [PHP SDK](https://github.com/aacsearch/aacsearch-php)
- [Ruby SDK](https://github.com/aacsearch/aacsearch-ruby)
- [Go SDK](https://github.com/aacsearch/aacsearch-go)

### Примеры проектов
- [E-commerce примеры](https://github.com/aacsearch/examples/ecommerce)
- [Blog примеры](https://github.com/aacsearch/examples/blog)
- [SaaS примеры](https://github.com/aacsearch/examples/saas)

---

**Назад:** [2.4 Интеграция с сайтом](./04-website-integration.md)
**Главная:** [Руководство быстрого старта](./README.md)

**Обновлено:** 02.11.2025
