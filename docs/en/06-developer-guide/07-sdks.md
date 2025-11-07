# SDKs

Официальные SDK для AACSearch на всех основных языках программирования.

## Содержание

- [JavaScript/TypeScript](#javascripttypescript-sdk)
- [Python](#python-sdk)
- [PHP](#php-sdk)
- [Ruby](#ruby-sdk)
- [Go](#go-sdk)
- [Java](#java-sdk)
- [C#/.NET](#cnet-sdk)

---

## JavaScript/TypeScript SDK

### Installation

```bash
npm install @aacsearch/js-client
# or
pnpm add @aacsearch/js-client
# or
yarn add @aacsearch/js-client
```

### Configuration

```typescript
import { AACSearchClient } from '@aacsearch/js-client'

const client = new AACSearchClient({
  apiKey: 'your-api-key',
  endpoint: 'https://api.aacsearch.com', // optional, defaults to production
  timeout: 30000, // optional, default 30s
})
```

### Search

```typescript
// Basic search
const results = await client.search({
  q: 'JavaScript',
  collection: 'symbols',
  page: 1,
  limit: 20,
})

console.log(results.hits)       // SearchResult[]
console.log(results.found)      // Total results count
console.log(results.facets)     // Facet counts

// Advanced search with filters
const filtered = await client.search({
  q: 'React',
  collection: 'symbols',
  filters: {
    category: 'framework',
    tags: ['javascript', 'frontend'],
  },
  sort: [
    { field: 'popularity', order: 'desc' },
    { field: 'created_at', order: 'desc' },
  ],
  facets: ['category', 'tags'],
})

// Natural language search
const nlResults = await client.nlSearch({
  query: 'Show me modern JavaScript frameworks for building SPAs',
  collection: 'symbols',
  limit: 10,
})

// Semantic/Vector search
const semanticResults = await client.vectorSearch({
  query: 'machine learning algorithms',
  collection: 'symbols',
  threshold: 0.8,
})

// Image search
const imageResults = await client.imageSearch({
  imageUrl: 'https://example.com/image.jpg',
  // or imageFile: File object
  collection: 'products',
})

// Geo search
const geoResults = await client.geoSearch({
  lat: 37.7749,
  lon: -122.4194,
  radius: 5000, // meters
  collection: 'stores',
})
```

### Autocomplete

```typescript
const suggestions = await client.getSuggestions({
  q: 'Java',
  limit: 10,
})

console.log(suggestions) // ['JavaScript', 'Java', 'JavaFX', ...]
```

### CRUD Operations

```typescript
// Create document
const doc = await client.documents.create({
  collection: 'symbols',
  document: {
    name: 'TypeScript',
    description: 'Typed superset of JavaScript',
    category: 'language',
    tags: ['javascript', 'microsoft'],
  },
})

// Update document
await client.documents.update({
  collection: 'symbols',
  id: doc.id,
  document: {
    description: 'Updated description',
  },
})

// Delete document
await client.documents.delete({
  collection: 'symbols',
  id: doc.id,
})

// Bulk operations
await client.documents.bulkCreate({
  collection: 'symbols',
  documents: [
    { name: 'React', category: 'framework' },
    { name: 'Vue', category: 'framework' },
    { name: 'Angular', category: 'framework' },
  ],
})
```

### Collections Management

```typescript
// List collections
const collections = await client.collections.list()

// Get collection info
const info = await client.collections.get('symbols')

// Create collection
await client.collections.create({
  name: 'my_collection',
  schema: {
    fields: [
      { name: 'title', type: 'string' },
      { name: 'content', type: 'string' },
      { name: 'created_at', type: 'int64' },
    ],
  },
})
```

### Error Handling

```typescript
import { AACSearchError, NotFoundError, ValidationError } from '@aacsearch/js-client'

try {
  const results = await client.search({ q: 'test' })
} catch (error) {
  if (error instanceof NotFoundError) {
    console.error('Collection not found')
  } else if (error instanceof ValidationError) {
    console.error('Invalid parameters:', error.details)
  } else if (error instanceof AACSearchError) {
    console.error('API error:', error.message)
  } else {
    console.error('Unknown error:', error)
  }
}
```

### TypeScript Types

```typescript
import type {
  SearchParams,
  SearchResponse,
  SearchResult,
  Document,
  Collection,
  Facet,
} from '@aacsearch/js-client'

const params: SearchParams = {
  q: 'test',
  collection: 'symbols',
  filters: { category: 'language' },
}

const response: SearchResponse = await client.search(params)
```

---

## Python SDK

### Installation

```bash
pip install aacsearch
```

### Configuration

```python
from aacsearch import AACSearchClient

client = AACSearchClient(
    api_key='your-api-key',
    endpoint='https://api.aacsearch.com',  # optional
    timeout=30  # optional, seconds
)
```

### Search

```python
# Basic search
results = client.search(
    q='Python',
    collection='symbols',
    page=1,
    limit=20
)

print(results['hits'])      # List of results
print(results['found'])     # Total count
print(results['facets'])    # Facet counts

# Advanced search
filtered = client.search(
    q='Django',
    collection='symbols',
    filters={'category': 'framework', 'tags': ['python', 'web']},
    sort=[
        {'field': 'popularity', 'order': 'desc'},
        {'field': 'created_at', 'order': 'desc'}
    ],
    facets=['category', 'tags']
)

# Natural language search
nl_results = client.nl_search(
    query='Show me Python web frameworks',
    collection='symbols',
    limit=10
)

# Semantic search
semantic_results = client.vector_search(
    query='data science libraries',
    collection='symbols',
    threshold=0.8
)

# Image search
with open('image.jpg', 'rb') as f:
    image_results = client.image_search(
        image_file=f,
        collection='products'
    )

# Geo search
geo_results = client.geo_search(
    lat=37.7749,
    lon=-122.4194,
    radius=5000,  # meters
    collection='stores'
)
```

### Autocomplete

```python
suggestions = client.get_suggestions(q='Pyth', limit=10)
print(suggestions)  # ['Python', 'Pythonic', 'PyTorch', ...]
```

### CRUD Operations

```python
# Create document
doc = client.documents.create(
    collection='symbols',
    document={
        'name': 'FastAPI',
        'description': 'Modern Python web framework',
        'category': 'framework',
        'tags': ['python', 'async', 'api']
    }
)

# Update document
client.documents.update(
    collection='symbols',
    id=doc['id'],
    document={'description': 'Updated description'}
)

# Delete document
client.documents.delete(collection='symbols', id=doc['id'])

# Bulk create
client.documents.bulk_create(
    collection='symbols',
    documents=[
        {'name': 'Flask', 'category': 'framework'},
        {'name': 'Django', 'category': 'framework'},
        {'name': 'FastAPI', 'category': 'framework'}
    ]
)
```

### Error Handling

```python
from aacsearch.exceptions import (
    AACSearchError,
    NotFoundError,
    ValidationError,
    AuthenticationError
)

try:
    results = client.search(q='test')
except NotFoundError as e:
    print(f'Collection not found: {e}')
except ValidationError as e:
    print(f'Invalid parameters: {e.details}')
except AuthenticationError as e:
    print(f'Authentication failed: {e}')
except AACSearchError as e:
    print(f'API error: {e}')
```

### Async Support

```python
from aacsearch import AsyncAACSearchClient

client = AsyncAACSearchClient(api_key='your-api-key')

async def search():
    results = await client.search(q='Python', collection='symbols')
    return results

# Or use with asyncio
import asyncio

async def main():
    results = await client.search(q='Python')
    print(results)

asyncio.run(main())
```

---

## PHP SDK

### Installation

```bash
composer require aacsearch/php-client
```

### Configuration

```php
<?php
require 'vendor/autoload.php';

use AACSearch\Client;

$client = new Client([
    'api_key' => 'your-api-key',
    'endpoint' => 'https://api.aacsearch.com', // optional
    'timeout' => 30 // optional, seconds
]);
```

### Search

```php
// Basic search
$results = $client->search([
    'q' => 'PHP',
    'collection' => 'symbols',
    'page' => 1,
    'limit' => 20
]);

echo $results['found']; // Total results
print_r($results['hits']);

// Advanced search
$filtered = $client->search([
    'q' => 'Laravel',
    'collection' => 'symbols',
    'filters' => [
        'category' => 'framework',
        'tags' => ['php', 'web']
    ],
    'sort' => [
        ['field' => 'popularity', 'order' => 'desc']
    ],
    'facets' => ['category', 'tags']
]);

// Natural language search
$nlResults = $client->nlSearch([
    'query' => 'Show me PHP frameworks for building APIs',
    'collection' => 'symbols',
    'limit' => 10
]);

// Semantic search
$semanticResults = $client->vectorSearch([
    'query' => 'content management systems',
    'collection' => 'symbols',
    'threshold' => 0.8
]);
```

### Autocomplete

```php
$suggestions = $client->getSuggestions([
    'q' => 'PHP',
    'limit' => 10
]);

print_r($suggestions); // ['PHP', 'PHPUnit', 'PHPStan', ...]
```

### CRUD Operations

```php
// Create document
$doc = $client->documents()->create([
    'collection' => 'symbols',
    'document' => [
        'name' => 'Symfony',
        'description' => 'PHP framework',
        'category' => 'framework',
        'tags' => ['php', 'web']
    ]
]);

// Update document
$client->documents()->update([
    'collection' => 'symbols',
    'id' => $doc['id'],
    'document' => ['description' => 'Updated description']
]);

// Delete document
$client->documents()->delete([
    'collection' => 'symbols',
    'id' => $doc['id']
]);

// Bulk create
$client->documents()->bulkCreate([
    'collection' => 'symbols',
    'documents' => [
        ['name' => 'Laravel', 'category' => 'framework'],
        ['name' => 'Symfony', 'category' => 'framework'],
        ['name' => 'CodeIgniter', 'category' => 'framework']
    ]
]);
```

### Error Handling

```php
use AACSearch\Exceptions\{
    AACSearchException,
    NotFoundException,
    ValidationException,
    AuthenticationException
};

try {
    $results = $client->search(['q' => 'test']);
} catch (NotFoundException $e) {
    echo "Collection not found: " . $e->getMessage();
} catch (ValidationException $e) {
    echo "Invalid parameters: " . $e->getDetails();
} catch (AuthenticationException $e) {
    echo "Authentication failed: " . $e->getMessage();
} catch (AACSearchException $e) {
    echo "API error: " . $e->getMessage();
}
```

---

## Ruby SDK

### Installation

```bash
gem install aacsearch
```

Or in Gemfile:

```ruby
gem 'aacsearch'
```

### Configuration

```ruby
require 'aacsearch'

client = AACSearch::Client.new(
  api_key: 'your-api-key',
  endpoint: 'https://api.aacsearch.com', # optional
  timeout: 30 # optional, seconds
)
```

### Search

```ruby
# Basic search
results = client.search(
  q: 'Ruby',
  collection: 'symbols',
  page: 1,
  limit: 20
)

puts results[:found]
puts results[:hits]

# Advanced search
filtered = client.search(
  q: 'Rails',
  collection: 'symbols',
  filters: { category: 'framework', tags: ['ruby', 'web'] },
  sort: [
    { field: 'popularity', order: 'desc' },
    { field: 'created_at', order: 'desc' }
  ],
  facets: ['category', 'tags']
)

# Natural language search
nl_results = client.nl_search(
  query: 'Show me Ruby web frameworks',
  collection: 'symbols',
  limit: 10
)

# Semantic search
semantic_results = client.vector_search(
  query: 'testing frameworks',
  collection: 'symbols',
  threshold: 0.8
)
```

### Autocomplete

```ruby
suggestions = client.get_suggestions(q: 'Ruby', limit: 10)
puts suggestions # ['Ruby', 'RubyGems', 'RubyMine', ...]
```

### CRUD Operations

```ruby
# Create document
doc = client.documents.create(
  collection: 'symbols',
  document: {
    name: 'Sinatra',
    description: 'Lightweight Ruby web framework',
    category: 'framework',
    tags: ['ruby', 'web']
  }
)

# Update document
client.documents.update(
  collection: 'symbols',
  id: doc[:id],
  document: { description: 'Updated description' }
)

# Delete document
client.documents.delete(collection: 'symbols', id: doc[:id])

# Bulk create
client.documents.bulk_create(
  collection: 'symbols',
  documents: [
    { name: 'Rails', category: 'framework' },
    { name: 'Sinatra', category: 'framework' },
    { name: 'Hanami', category: 'framework' }
  ]
)
```

### Error Handling

```ruby
begin
  results = client.search(q: 'test')
rescue AACSearch::NotFoundError => e
  puts "Collection not found: #{e.message}"
rescue AACSearch::ValidationError => e
  puts "Invalid parameters: #{e.details}"
rescue AACSearch::AuthenticationError => e
  puts "Authentication failed: #{e.message}"
rescue AACSearch::Error => e
  puts "API error: #{e.message}"
end
```

---

## Go SDK

### Installation

```bash
go get github.com/aacsearch/go-client
```

### Configuration

```go
package main

import (
    "github.com/aacsearch/go-client"
)

func main() {
    client := aacsearch.NewClient(&aacsearch.Config{
        APIKey:   "your-api-key",
        Endpoint: "https://api.aacsearch.com", // optional
        Timeout:  30 * time.Second,             // optional
    })
}
```

### Search

```go
// Basic search
results, err := client.Search(&aacsearch.SearchParams{
    Q:          "Go",
    Collection: "symbols",
    Page:       1,
    Limit:      20,
})
if err != nil {
    log.Fatal(err)
}

fmt.Println(results.Found)
fmt.Println(results.Hits)

// Advanced search
filtered, err := client.Search(&aacsearch.SearchParams{
    Q:          "Gin",
    Collection: "symbols",
    Filters: map[string]interface{}{
        "category": "framework",
        "tags":     []string{"go", "web"},
    },
    Sort: []aacsearch.Sort{
        {Field: "popularity", Order: "desc"},
        {Field: "created_at", Order: "desc"},
    },
    Facets: []string{"category", "tags"},
})
if err != nil {
    log.Fatal(err)
}

// Natural language search
nlResults, err := client.NLSearch(&aacsearch.NLSearchParams{
    Query:      "Show me Go web frameworks",
    Collection: "symbols",
    Limit:      10,
})

// Semantic search
semanticResults, err := client.VectorSearch(&aacsearch.VectorSearchParams{
    Query:      "concurrency patterns",
    Collection: "symbols",
    Threshold:  0.8,
})
```

### Autocomplete

```go
suggestions, err := client.GetSuggestions(&aacsearch.SuggestionsParams{
    Q:     "Go",
    Limit: 10,
})
if err != nil {
    log.Fatal(err)
}

fmt.Println(suggestions) // [Go, Golang, GoLand, ...]
```

### CRUD Operations

```go
// Create document
doc, err := client.Documents.Create(&aacsearch.CreateDocumentParams{
    Collection: "symbols",
    Document: map[string]interface{}{
        "name":        "Echo",
        "description": "High performance Go web framework",
        "category":    "framework",
        "tags":        []string{"go", "web"},
    },
})
if err != nil {
    log.Fatal(err)
}

// Update document
err = client.Documents.Update(&aacsearch.UpdateDocumentParams{
    Collection: "symbols",
    ID:         doc.ID,
    Document: map[string]interface{}{
        "description": "Updated description",
    },
})

// Delete document
err = client.Documents.Delete(&aacsearch.DeleteDocumentParams{
    Collection: "symbols",
    ID:         doc.ID,
})

// Bulk create
err = client.Documents.BulkCreate(&aacsearch.BulkCreateParams{
    Collection: "symbols",
    Documents: []map[string]interface{}{
        {"name": "Gin", "category": "framework"},
        {"name": "Echo", "category": "framework"},
        {"name": "Fiber", "category": "framework"},
    },
})
```

### Error Handling

```go
import "github.com/aacsearch/go-client/errors"

results, err := client.Search(params)
if err != nil {
    switch e := err.(type) {
    case *errors.NotFoundError:
        fmt.Println("Collection not found:", e.Message)
    case *errors.ValidationError:
        fmt.Println("Invalid parameters:", e.Details)
    case *errors.AuthenticationError:
        fmt.Println("Authentication failed:", e.Message)
    default:
        fmt.Println("API error:", err)
    }
}
```

---

## Java SDK

### Installation (Maven)

```xml
<dependency>
    <groupId>com.aacsearch</groupId>
    <artifactId>aacsearch-java-client</artifactId>
    <version>1.0.0</version>
</dependency>
```

### Installation (Gradle)

```gradle
implementation 'com.aacsearch:aacsearch-java-client:1.0.0'
```

### Configuration

```java
import com.aacsearch.Client;
import com.aacsearch.Config;

public class Example {
    public static void main(String[] args) {
        Client client = new Client(new Config()
            .setApiKey("your-api-key")
            .setEndpoint("https://api.aacsearch.com") // optional
            .setTimeout(30000) // optional, milliseconds
        );
    }
}
```

### Search

```java
import com.aacsearch.models.*;

// Basic search
SearchParams params = new SearchParams()
    .setQ("Java")
    .setCollection("symbols")
    .setPage(1)
    .setLimit(20);

SearchResponse results = client.search(params);

System.out.println(results.getFound());
System.out.println(results.getHits());

// Advanced search
Map<String, Object> filters = new HashMap<>();
filters.put("category", "language");
filters.put("tags", Arrays.asList("jvm", "oop"));

SearchParams filtered = new SearchParams()
    .setQ("Spring")
    .setCollection("symbols")
    .setFilters(filters)
    .setSort(Arrays.asList(
        new Sort("popularity", "desc"),
        new Sort("created_at", "desc")
    ))
    .setFacets(Arrays.asList("category", "tags"));

SearchResponse response = client.search(filtered);

// Natural language search
NLSearchParams nlParams = new NLSearchParams()
    .setQuery("Show me Java web frameworks")
    .setCollection("symbols")
    .setLimit(10);

NLSearchResponse nlResults = client.nlSearch(nlParams);

// Semantic search
VectorSearchParams vectorParams = new VectorSearchParams()
    .setQuery("design patterns")
    .setCollection("symbols")
    .setThreshold(0.8);

VectorSearchResponse semanticResults = client.vectorSearch(vectorParams);
```

### Autocomplete

```java
SuggestionsParams params = new SuggestionsParams()
    .setQ("Java")
    .setLimit(10);

List<String> suggestions = client.getSuggestions(params);
System.out.println(suggestions); // [Java, JavaScript, JavaFX, ...]
```

### CRUD Operations

```java
// Create document
Map<String, Object> document = new HashMap<>();
document.put("name", "Hibernate");
document.put("description", "ORM framework for Java");
document.put("category", "framework");
document.put("tags", Arrays.asList("java", "orm"));

CreateDocumentParams createParams = new CreateDocumentParams()
    .setCollection("symbols")
    .setDocument(document);

Document doc = client.documents().create(createParams);

// Update document
Map<String, Object> updates = new HashMap<>();
updates.put("description", "Updated description");

UpdateDocumentParams updateParams = new UpdateDocumentParams()
    .setCollection("symbols")
    .setId(doc.getId())
    .setDocument(updates);

client.documents().update(updateParams);

// Delete document
DeleteDocumentParams deleteParams = new DeleteDocumentParams()
    .setCollection("symbols")
    .setId(doc.getId());

client.documents().delete(deleteParams);

// Bulk create
List<Map<String, Object>> documents = Arrays.asList(
    Map.of("name", "Spring", "category", "framework"),
    Map.of("name", "Hibernate", "category", "framework"),
    Map.of("name", "Quarkus", "category", "framework")
);

BulkCreateParams bulkParams = new BulkCreateParams()
    .setCollection("symbols")
    .setDocuments(documents);

client.documents().bulkCreate(bulkParams);
```

### Error Handling

```java
import com.aacsearch.exceptions.*;

try {
    SearchResponse results = client.search(params);
} catch (NotFoundException e) {
    System.err.println("Collection not found: " + e.getMessage());
} catch (ValidationException e) {
    System.err.println("Invalid parameters: " + e.getDetails());
} catch (AuthenticationException e) {
    System.err.println("Authentication failed: " + e.getMessage());
} catch (AACSearchException e) {
    System.err.println("API error: " + e.getMessage());
}
```

---

## C#/.NET SDK

### Installation (NuGet)

```bash
dotnet add package AACSearch.Client
```

### Configuration

```csharp
using AACSearch;

var client = new AACSearchClient(new ClientConfig
{
    ApiKey = "your-api-key",
    Endpoint = "https://api.aacsearch.com", // optional
    Timeout = TimeSpan.FromSeconds(30) // optional
});
```

### Search

```csharp
using AACSearch.Models;

// Basic search
var results = await client.SearchAsync(new SearchParams
{
    Q = "C#",
    Collection = "symbols",
    Page = 1,
    Limit = 20
});

Console.WriteLine(results.Found);
Console.WriteLine(results.Hits);

// Advanced search
var filtered = await client.SearchAsync(new SearchParams
{
    Q = "ASP.NET",
    Collection = "symbols",
    Filters = new Dictionary<string, object>
    {
        ["category"] = "framework",
        ["tags"] = new[] { "csharp", "web" }
    },
    Sort = new[]
    {
        new Sort { Field = "popularity", Order = "desc" },
        new Sort { Field = "created_at", Order = "desc" }
    },
    Facets = new[] { "category", "tags" }
});

// Natural language search
var nlResults = await client.NLSearchAsync(new NLSearchParams
{
    Query = "Show me C# web frameworks",
    Collection = "symbols",
    Limit = 10
});

// Semantic search
var semanticResults = await client.VectorSearchAsync(new VectorSearchParams
{
    Query = "async programming patterns",
    Collection = "symbols",
    Threshold = 0.8
});
```

### Autocomplete

```csharp
var suggestions = await client.GetSuggestionsAsync(new SuggestionsParams
{
    Q = "C#",
    Limit = 10
});

Console.WriteLine(string.Join(", ", suggestions)); // C#, C# 12, CSharp, ...
```

### CRUD Operations

```csharp
// Create document
var doc = await client.Documents.CreateAsync(new CreateDocumentParams
{
    Collection = "symbols",
    Document = new Dictionary<string, object>
    {
        ["name"] = "Blazor",
        ["description"] = "Web framework for C#",
        ["category"] = "framework",
        ["tags"] = new[] { "csharp", "web", "spa" }
    }
});

// Update document
await client.Documents.UpdateAsync(new UpdateDocumentParams
{
    Collection = "symbols",
    Id = doc.Id,
    Document = new Dictionary<string, object>
    {
        ["description"] = "Updated description"
    }
});

// Delete document
await client.Documents.DeleteAsync(new DeleteDocumentParams
{
    Collection = "symbols",
    Id = doc.Id
});

// Bulk create
await client.Documents.BulkCreateAsync(new BulkCreateParams
{
    Collection = "symbols",
    Documents = new[]
    {
        new Dictionary<string, object> { ["name"] = "ASP.NET", ["category"] = "framework" },
        new Dictionary<string, object> { ["name"] = "Blazor", ["category"] = "framework" },
        new Dictionary<string, object> { ["name"] = "MAUI", ["category"] = "framework" }
    }
});
```

### Error Handling

```csharp
using AACSearch.Exceptions;

try
{
    var results = await client.SearchAsync(params);
}
catch (NotFoundException ex)
{
    Console.Error.WriteLine($"Collection not found: {ex.Message}");
}
catch (ValidationException ex)
{
    Console.Error.WriteLine($"Invalid parameters: {ex.Details}");
}
catch (AuthenticationException ex)
{
    Console.Error.WriteLine($"Authentication failed: {ex.Message}");
}
catch (AACSearchException ex)
{
    Console.Error.WriteLine($"API error: {ex.Message}");
}
```

---

## Common Features Across All SDKs

### Rate Limiting

Все SDK автоматически обрабатывают rate limiting:

```
HTTP 429 Too Many Requests
Retry-After: 60

SDK automatically retries after specified delay
```

### Pagination

```
// Most SDKs support cursor-based pagination
{
  "page": 1,
  "limit": 20,
  "total_pages": 5,
  "next_page": 2,
  "prev_page": null
}
```

### Timeouts

Все SDK поддерживают настраиваемые timeouts:

- Default: 30 seconds
- Configurable per request or globally

### Retries

Automatic retry с exponential backoff для transient errors:

- Network errors
- 5xx server errors
- Rate limit errors (429)

### Logging

Включение debug logging:

```javascript
// JavaScript
const client = new AACSearchClient({ apiKey: '...', debug: true })

# Python
import logging
logging.basicConfig(level=logging.DEBUG)

// PHP
$client->setDebug(true);

# Ruby
client.debug = true

// Go
client.SetDebug(true)

// Java
client.setDebugMode(true);

// C#
client.EnableDebugLogging();
```

---

## Support & Resources

- **Documentation**: https://docs.aacsearch.com
- **GitHub**: https://github.com/aacsearch
- **npm**: https://www.npmjs.com/package/@aacsearch/js-client
- **PyPI**: https://pypi.org/project/aacsearch
- **Packagist**: https://packagist.org/packages/aacsearch/php-client
- **RubyGems**: https://rubygems.org/gems/aacsearch
- **Go**: https://pkg.go.dev/github.com/aacsearch/go-client
- **Maven**: https://mvnrepository.com/artifact/com.aacsearch/aacsearch-java-client
- **NuGet**: https://www.nuget.org/packages/AACSearch.Client

## Contributing

SDK contributions are welcome! See [CONTRIBUTING.md](https://github.com/aacsearch/sdk-contributing) для guidelines.

---

Все SDK поддерживают одинаковый набор функций и следуют схожим паттернам для consistency!
