# API Продвинутого Поиска

Продвинутые возможности поиска включают Natural Language Search, Vector Search, Conversational Search (RAG), Image Search, Geo Search, Voice Search и JOIN queries.

## POST /api/search/nl - Natural Language Search

Поиск на естественном языке с автоматическим парсингом запросов и улучшенным пониманием интента.

### Аутентификация

**Требуется:** JWT Token

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Request Body

```json
{
  "q": "show me all react components with high rating",
  "collection": "symbols",
  "query_by": "title,keywords,description",
  "nl_model_id": "model_12345",
  "nl_query_debug": false,
  "per_page": 20,
  "page": 1,
  "highlight_fields": "title,description",
  "exclude_fields": "internal_data"
}
```

### Request Parameters

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `q` | string | Да | Natural language запрос |
| `collection` | string | Нет | Коллекция для поиска. По умолчанию: `symbols` |
| `query_by` | string | Нет | Поля для поиска. По умолчанию: `title,keywords,description` |
| `nl_model_id` | string | Нет | ID модели NL. Использует tenant default если не указан |
| `nl_query_debug` | boolean | Нет | Вернуть debug информацию о парсинге |
| `per_page` | number | Нет | Результатов на странице (1-100). По умолчанию: `20` |
| `page` | number | Нет | Номер страницы. По умолчанию: `1` |
| `highlight_fields` | string | Нет | Поля для подсветки |
| `exclude_fields` | string | Нет | Поля для исключения из ответа |

### Response (200 OK)

```json
{
  "results": [
    {
      "document": {
        "id": "doc_001",
        "title": "React Rating Component",
        "keywords": ["react", "rating", "component"],
        "description": "A highly customizable React rating component",
        "rating": 4.8
      },
      "highlight": {
        "title": {
          "snippet": "<mark>React</mark> <mark>Rating</mark> Component"
        }
      }
    }
  ],
  "found": 42,
  "page": 1,
  "out_of": 42,
  "search_time_ms": 15,
  "parsed_nl_query": {
    "keywords": ["react", "components", "high", "rating"],
    "filters": "rating:>=4.0",
    "sort": "rating:desc"
  },
  "original_query": "show me all react components with high rating"
}
```

### Examples

#### cURL

```bash
curl -X POST "https://api.aacsearch.com/api/search/nl" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "q": "find popular frontend frameworks released last year",
    "collection": "symbols",
    "per_page": 10,
    "nl_query_debug": true
  }'
```

#### JavaScript

```javascript
async function nlSearch(query) {
  const response = await fetch('https://api.aacsearch.com/api/search/nl', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      q: query,
      collection: 'symbols',
      per_page: 20
    })
  });

  return response.json();
}

const results = await nlSearch('show me typescript libraries for data validation');
```

#### Python

```python
import requests

def nl_search(query: str):
    response = requests.post(
        'https://api.aacsearch.com/api/search/nl',
        headers={'Authorization': f'Bearer {JWT_TOKEN}'},
        json={
            'q': query,
            'collection': 'symbols',
            'per_page': 20
        }
    )
    return response.json()

results = nl_search('find mobile UI components with good documentation')
```

---

## POST /api/search/vector - Vector Search

Семантический поиск с использованием vector embeddings для нахождения похожих документов по смыслу.

### Request Body

```json
{
  "q": "modern javascript framework",
  "collection": "symbols",
  "search_type": "semantic",
  "query_by": "embedding",
  "per_page": 20,
  "page": 1,
  "sort_by": "_text_match:desc"
}
```

### Search Types

#### 1. Semantic Search (по умолчанию)

```json
{
  "search_type": "semantic",
  "q": "machine learning libraries",
  "query_by": "embedding"
}
```

#### 2. Hybrid Search (keyword + semantic)

```json
{
  "search_type": "hybrid",
  "q": "react hooks",
  "query_by": "title,keywords,embedding"
}
```

#### 3. Similar Documents

```json
{
  "search_type": "similar",
  "document_id": "doc_12345",
  "per_page": 10
}
```

### Request Parameters

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `search_type` | string | Нет | Тип поиска: `semantic`, `hybrid`, `similar`. По умолчанию: `semantic` |
| `q` | string | Условно | Текстовый запрос (для semantic и hybrid) |
| `vector_query` | string | Условно | Base64 encoded vector |
| `document_id` | string | Условно | ID документа (для similar search) |
| `collection` | string | Нет | Коллекция. По умолчанию: `symbols` |
| `query_by` | string | Нет | Поля для поиска. По умолчанию: `embedding` |
| `per_page` | number | Нет | Результатов на странице |
| `page` | number | Нет | Номер страницы |
| `sort_by` | string | Нет | Поля сортировки |

### Response (200 OK)

```json
{
  "hits": [
    {
      "document": {
        "id": "doc_001",
        "title": "TensorFlow.js",
        "description": "Machine learning library for JavaScript"
      },
      "vector_distance": 0.234,
      "text_match": 985673421
    }
  ],
  "found": 156,
  "search_time_ms": 23
}
```

### Examples

#### JavaScript - Semantic Search

```javascript
async function semanticSearch(query) {
  const response = await fetch('https://api.aacsearch.com/api/search/vector', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      search_type: 'semantic',
      q: query,
      query_by: 'embedding',
      per_page: 20
    })
  });

  return response.json();
}
```

#### JavaScript - Hybrid Search

```javascript
async function hybridSearch(query) {
  const response = await fetch('https://api.aacsearch.com/api/search/vector', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      search_type: 'hybrid',
      q: query,
      query_by: 'title,keywords,embedding',
      per_page: 20
    })
  });

  return response.json();
}
```

#### JavaScript - Find Similar

```javascript
async function findSimilar(documentId) {
  const response = await fetch('https://api.aacsearch.com/api/search/vector', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      search_type: 'similar',
      document_id: documentId,
      per_page: 10
    })
  });

  return response.json();
}
```

---

## POST /api/search/conversational - Conversational Search (RAG)

Диалоговый поиск с контекстом предыдущих запросов и генерацией ответов с помощью LLM.

### Request Body

```json
{
  "q": "What are the benefits of React hooks?",
  "collection": "symbols",
  "conversation_model_id": "openai-gpt-4",
  "conversation_id": "conv_12345",
  "conversation_stream": false,
  "query_by": "embedding",
  "per_page": 10
}
```

### Request Parameters

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `q` | string | Да | Вопрос пользователя |
| `collection` | string | Нет | Коллекция. По умолчанию: `symbols` |
| `conversation_model_id` | string | Да | ID модели для генерации ответов |
| `conversation_id` | string | Нет | ID беседы для сохранения контекста |
| `conversation_stream` | boolean | Нет | Streaming ответ (SSE). По умолчанию: `false` |
| `query_by` | string | Нет | Поля для поиска. По умолчанию: `embedding` |
| `per_page` | number | Нет | Количество контекстных документов |

### Response (200 OK) - Non-Streaming

```json
{
  "conversation": {
    "answer": "React hooks provide several key benefits: 1) They allow you to use state and lifecycle features without writing classes. 2) Hooks make it easier to reuse stateful logic between components. 3) They help organize code by feature rather than by lifecycle method.",
    "conversation_id": "conv_12345",
    "conversation_history": [
      {
        "role": "user",
        "content": "What are React hooks?"
      },
      {
        "role": "assistant",
        "content": "React hooks are functions that..."
      }
    ]
  },
  "results": [
    {
      "document": {
        "id": "doc_001",
        "title": "React Hooks Guide"
      }
    }
  ]
}
```

### Response (Streaming) - Server-Sent Events

При `conversation_stream: true` ответ возвращается как SSE поток:

```
data: {"type":"chunk","content":"React hooks provide"}

data: {"type":"chunk","content":" several key"}

data: {"type":"chunk","content":" benefits:"}

data: {"type":"metadata","conversation_id":"conv_12345"}

data: [DONE]
```

### Examples

#### JavaScript - Non-Streaming

```javascript
async function conversationalSearch(question, conversationId) {
  const response = await fetch('https://api.aacsearch.com/api/search/conversational', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      q: question,
      conversation_model_id: 'openai-gpt-4',
      conversation_id: conversationId,
      collection: 'symbols'
    })
  });

  return response.json();
}

const result = await conversationalSearch('How do I use useState hook?', 'conv_001');
console.log(result.conversation.answer);
```

#### JavaScript - Streaming with SSE

```javascript
async function streamingConversationalSearch(question, onChunk, onComplete) {
  const response = await fetch('https://api.aacsearch.com/api/search/conversational', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      q: question,
      conversation_model_id: 'openai-gpt-4',
      conversation_stream: true,
      collection: 'symbols'
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') {
          onComplete();
          return;
        }

        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'chunk') {
            onChunk(parsed.content);
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }
}

// Usage
streamingConversationalSearch(
  'Explain React context API',
  (chunk) => {
    process.stdout.write(chunk); // Display chunk as it arrives
  },
  () => {
    console.log('\n[Stream complete]');
  }
);
```

---

## POST /api/search/image - Image Search

Поиск изображений с помощью CLIP (text-to-image, image-to-image).

### Search Modes

1. **text-to-image** - поиск изображений по текстовому описанию
2. **image-to-image** - reverse image search
3. **similar-to-id** - найти похожие изображения

### Request Body - Text to Image

```json
{
  "mode": "text-to-image",
  "q": "sunset over mountains",
  "collection": "media_searchable",
  "per_page": 20,
  "page": 1
}
```

### Request Body - Image to Image

```json
{
  "mode": "image-to-image",
  "image_base64": "iVBORw0KGgoAAAANSUhEUgAA...",
  "collection": "media_searchable",
  "per_page": 20
}
```

### Request Body - Similar Images

```json
{
  "mode": "similar-to-id",
  "document_id": "img_12345",
  "collection": "media_searchable",
  "per_page": 10
}
```

### Response (200 OK)

```json
{
  "hits": [
    {
      "document": {
        "id": "img_001",
        "filename": "sunset_mountains.jpg",
        "url": "https://cdn.example.com/sunset_mountains.jpg",
        "width": 1920,
        "height": 1080,
        "format": "jpeg"
      },
      "vector_distance": 0.123
    }
  ],
  "found": 89,
  "search_time_ms": 45
}
```

### Examples

#### JavaScript - Text to Image

```javascript
async function searchImagesByText(query) {
  const response = await fetch('https://api.aacsearch.com/api/search/image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      mode: 'text-to-image',
      q: query,
      collection: 'media_searchable',
      per_page: 20
    })
  });

  return response.json();
}
```

#### JavaScript - Reverse Image Search

```javascript
async function reverseImageSearch(imageFile) {
  // Convert image to base64
  const base64 = await fileToBase64(imageFile);

  const response = await fetch('https://api.aacsearch.com/api/search/image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      mode: 'image-to-image',
      image_base64: base64,
      collection: 'media_searchable',
      per_page: 20
    })
  });

  return response.json();
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
```

---

## POST /api/search/geo - Geo Search

Геопространственный поиск с поддержкой radius, bounding box и polygon запросов.

### Search Types

1. **radius** - поиск в радиусе от точки
2. **bounding_box** - поиск в прямоугольной области
3. **polygon** - поиск в произвольной полигональной области

### Request Body - Radius Search

```json
{
  "search_type": "radius",
  "q": "coffee shops",
  "query_by": "name,description",
  "collection": "places",
  "center": [40.7128, -74.0060],
  "radius": 5,
  "radius_unit": "km",
  "per_page": 20
}
```

### Request Body - Bounding Box

```json
{
  "search_type": "bounding_box",
  "q": "restaurants",
  "query_by": "name",
  "collection": "places",
  "bounding_box": {
    "top_left": [40.8, -74.1],
    "bottom_right": [40.7, -74.0]
  },
  "per_page": 50
}
```

### Request Body - Polygon

```json
{
  "search_type": "polygon",
  "q": "*",
  "query_by": "name",
  "collection": "places",
  "polygon": [
    [40.7128, -74.0060],
    [40.7580, -73.9855],
    [40.7489, -73.9680],
    [40.7128, -74.0060]
  ],
  "per_page": 100
}
```

### Request Parameters

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `search_type` | string | Нет | `radius`, `bounding_box`, `polygon`. По умолчанию: `radius` |
| `q` | string | Нет | Поисковый запрос |
| `query_by` | string | Нет | Поля для поиска |
| `collection` | string | Нет | Коллекция. По умолчанию: `places` |
| `center` | array | Условно | `[lat, lon]` для radius search |
| `radius` | number | Условно | Радиус для radius search |
| `radius_unit` | string | Нет | `km` или `mi`. По умолчанию: `km` |
| `bounding_box` | object | Условно | `{top_left, bottom_right}` для bbox |
| `polygon` | array | Условно | Массив точек `[[lat,lon], ...]` |
| `per_page` | number | Нет | Результатов на странице |

### Response (200 OK)

```json
{
  "hits": [
    {
      "document": {
        "id": "place_001",
        "name": "Blue Bottle Coffee",
        "location": [40.7589, -73.9851],
        "address": "54 W 40th St, New York, NY 10018",
        "rating": 4.5
      },
      "geo_distance_meters": 1234
    }
  ],
  "found": 23,
  "search_time_ms": 18
}
```

### Examples

#### JavaScript - Radius Search

```javascript
async function searchNearby(lat, lon, radiusKm) {
  const response = await fetch('https://api.aacsearch.com/api/search/geo', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      search_type: 'radius',
      q: 'coffee',
      query_by: 'name,description',
      center: [lat, lon],
      radius: radiusKm,
      radius_unit: 'km',
      per_page: 20
    })
  });

  return response.json();
}

// Find coffee shops within 5km
const nearby = await searchNearby(40.7128, -74.0060, 5);
```

#### Python - Bounding Box Search

```python
def search_in_bounds(top_left, bottom_right, query='*'):
    response = requests.post(
        'https://api.aacsearch.com/api/search/geo',
        headers={'Authorization': f'Bearer {JWT_TOKEN}'},
        json={
            'search_type': 'bounding_box',
            'q': query,
            'query_by': 'name,category',
            'bounding_box': {
                'top_left': top_left,
                'bottom_right': bottom_right
            },
            'per_page': 50
        }
    )
    return response.json()

# Search in Manhattan area
results = search_in_bounds([40.8, -74.1], [40.7, -74.0], 'restaurants')
```

---

## POST /api/search/voice - Voice Search

Голосовой поиск с транскрипцией через Whisper API.

### Request Body

```json
{
  "audio_base64": "//uQxAAAAAAAAAAAAAAASW5mbw...",
  "collection": "symbols",
  "query_by": "title,keywords,description",
  "per_page": 20
}
```

### Request Parameters

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `audio_base64` | string | Да | Base64 encoded audio (wav, mp3, m4a, webm) |
| `collection` | string | Нет | Коллекция. По умолчанию: `symbols` |
| `query_by` | string | Нет | Поля для поиска |
| `per_page` | number | Нет | Результатов на странице |

### Response (200 OK)

```json
{
  "transcript": "find react components",
  "original_query": "find react components",
  "results": [
    {
      "document": {
        "id": "doc_001",
        "title": "React Button Component"
      }
    }
  ],
  "found": 45,
  "search_time_ms": 234
}
```

### Examples

#### JavaScript

```javascript
async function voiceSearch(audioBlob) {
  // Convert audio blob to base64
  const base64Audio = await blobToBase64(audioBlob);

  const response = await fetch('https://api.aacsearch.com/api/search/voice', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      audio_base64: base64Audio,
      collection: 'symbols',
      query_by: 'title,keywords',
      per_page: 20
    })
  });

  return response.json();
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Record audio and search
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(chunks, { type: 'audio/webm' });
      const results = await voiceSearch(audioBlob);
      console.log('Transcript:', results.transcript);
      console.log('Found:', results.found, 'results');
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 5000); // Record for 5 seconds
  });
```

---

## POST /api/search/join - JOIN Search

SQL-подобные JOIN запросы для связывания данных из разных коллекций.

### JOIN Types

1. **one-to-one** - связь 1:1
2. **one-to-many** - связь 1:N
3. **many-to-many** - связь N:M через junction table
4. **nested** - вложенные JOIN
5. **left** - LEFT JOIN

### Request Body - One-to-One

```json
{
  "join_type": "one-to-one",
  "collection": "products",
  "joined_collection": "categories",
  "joined_fields": ["name", "description"],
  "q": "*",
  "query_by": "title"
}
```

### Request Body - One-to-Many

```json
{
  "join_type": "one-to-many",
  "collection": "users",
  "joined_collection": "orders",
  "filter_condition": "status:=completed",
  "q": "*"
}
```

### Request Body - Many-to-Many

```json
{
  "join_type": "many-to-many",
  "collection": "products",
  "junction_collection": "product_tags",
  "target_collection": "tags",
  "junction_filter": "active:=true",
  "q": "electronics"
}
```

### Response (200 OK)

```json
{
  "hits": [
    {
      "document": {
        "id": "prod_001",
        "title": "Laptop",
        "category": {
          "id": "cat_001",
          "name": "Electronics",
          "description": "Electronic devices"
        }
      }
    }
  ],
  "found": 156
}
```

### Examples

#### JavaScript - One-to-One JOIN

```javascript
async function joinSearch() {
  const response = await fetch('https://api.aacsearch.com/api/search/join', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      join_type: 'one-to-one',
      collection: 'products',
      joined_collection: 'categories',
      joined_fields: ['name', 'slug'],
      q: 'laptop',
      query_by: 'title,description'
    })
  });

  return response.json();
}
```

---

## POST /api/search/multi - Multi-Search

Выполнение нескольких поисковых запросов за один API вызов.

### Request Body

```json
{
  "mode": "federated",
  "searches": [
    {
      "collection": "symbols",
      "q": "react",
      "query_by": "title,keywords",
      "per_page": 10
    },
    {
      "collection": "pages",
      "q": "react",
      "query_by": "title,content",
      "per_page": 5
    },
    {
      "collection": "products",
      "q": "react",
      "query_by": "name,description",
      "filter_by": "in_stock:=true",
      "per_page": 10
    }
  ]
}
```

### Modes

- **federated** - возвращает результаты раздельно по коллекциям
- **union** - объединяет все результаты в один список

### Response (200 OK) - Federated Mode

```json
{
  "mode": "federated",
  "searches_count": 3,
  "results": [
    {
      "collection": "symbols",
      "hits": [...],
      "found": 234
    },
    {
      "collection": "pages",
      "hits": [...],
      "found": 45
    },
    {
      "collection": "products",
      "hits": [...],
      "found": 89
    }
  ]
}
```

### Examples

#### JavaScript

```javascript
async function multiSearch(query) {
  const response = await fetch('https://api.aacsearch.com/api/search/multi', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      mode: 'federated',
      searches: [
        {
          collection: 'symbols',
          q: query,
          query_by: 'title,keywords',
          per_page: 5
        },
        {
          collection: 'pages',
          q: query,
          query_by: 'title,content',
          per_page: 5
        }
      ]
    })
  });

  return response.json();
}

const results = await multiSearch('react hooks');
console.log('Symbols:', results.results[0].found);
console.log('Pages:', results.results[1].found);
```

---

## Rate Limits

Все advanced search endpoints подчиняются следующим лимитам:

| План | Requests/Minute | Requests/Day |
|------|-----------------|--------------|
| Free | 5 | 50 |
| Starter | 30 | 500 |
| Professional | 120 | 5,000 |
| Enterprise | Custom | Custom |

**Специальные лимиты:**
- Voice Search: -50% от базового лимита (требует дополнительных ресурсов)
- Conversational Search (streaming): -30% от базового лимита
- Image Search: стандартный лимит

## Error Codes

### 503 Service Unavailable

```json
{
  "error": "Failed to convert speech to text",
  "message": "Whisper API timeout",
  "hint": "Ensure OPENAI_API_KEY or GOOGLE_API_KEY is configured"
}
```

Возвращается когда external service (Whisper, CLIP, LLM) недоступен.

## Best Practices

### 1. Natural Language Search

- Используйте полные предложения вместо ключевых слов
- Указывайте контекст в запросе
- Включайте `nl_query_debug` для отладки

### 2. Vector Search

- Используйте hybrid search для лучшей точности
- Кэшируйте embeddings на клиенте
- Устанавливайте reasonable `per_page` (10-20)

### 3. Conversational Search

- Передавайте `conversation_id` для сохранения контекста
- Используйте streaming для real-time UI
- Ограничивайте длину истории (последние 5-10 сообщений)

### 4. Image Search

- Оптимизируйте изображения перед отправкой (max 2MB)
- Используйте WebP формат для меньшего размера
- Кэшируйте результаты reverse image search

### 5. Geo Search

- Используйте radius search для мобильных приложений
- Используйте bounding box для map views
- Сортируйте по расстоянию: `sort_by=location(lat,lon):asc`

---

## Дополнительные ресурсы

- [Basic Search API](/docs/api-reference/search-api)
- [Collections API](/docs/api-reference/collections-api)
- [NL Models Configuration](/docs/guides/nl-models)
- [Vector Embeddings Guide](/docs/guides/vector-embeddings)
- [Conversational AI Setup](/docs/guides/conversational-ai)
