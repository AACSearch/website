# 4.6 Продвинутые функции поиска

## Обзор

Продвинутые возможности AACSearch включают AI-powered поиск, семантический и векторный поиск, поиск по изображениям, geo-поиск, федеративный поиск и другие инновационные функции.

## Основные возможности

### AI-Powered Search
- **Natural Language Search** - поиск на естественном языке
- **Conversational Search** - диалоговый поиск с контекстом
- **Question Answering** - ответы на вопросы из документов
- **Semantic Search** - понимание смысла запросов

### Specialized Search
- **Vector Search** - поиск по векторным embeddings
- **Image Search** - поиск по изображениям (CLIP)
- **Voice Search** - голосовой поиск (Whisper)
- **Geo Search** - расширенный географический поиск

### Advanced Features
- **Joins** - связывание документов из разных коллекций
- **Grouping** - группировка результатов
- **Federated Search** - поиск по нескольким коллекциям одновременно
- **Hybrid Search** - комбинация keyword + vector search

## Разделы документации

### [01-nl-search.md](./01-nl-search.md) (20 страниц)
**Natural Language Search**

Содержание:
- Что такое NL Search
- Настройка моделей (GPT-4, Claude)
- Query understanding
- Intent detection
- Entity extraction
- Примеры использования
- Best practices

Пример:
```typescript
// Natural Language запрос
const results = await client.collections('products')
  .documents()
  .search({
    q: 'I need a laptop for video editing under $2000',
    query_by: 'name,description',
    use_natural_language: true,
    nl_model: 'gpt-4'
  })

// AI автоматически извлечет:
// - Category: laptop
// - Use case: video editing
// - Price: < $2000
```

### [02-vector-search.md](./02-vector-search.md) (18 страниц)
**Vector Search & Embeddings**

Содержание:
- Что такое векторный поиск
- Создание embeddings
- Модели (OpenAI, Cohere, local)
- Индексация векторов
- Hybrid search (keyword + vector)
- ANN алгоритмы
- Performance optimization

Пример:
```typescript
// Создание embedding
const embedding = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: 'smartphone with great camera'
});

// Vector search
const results = await client.collections('products')
  .documents()
  .search({
    q: '*',
    vector_query: `embedding:(${embedding.data[0].embedding.join(',')}, k:10)`
  })
```

### [03-semantic-search.md](./03-semantic-search.md) (15 страниц)
**Semantic Search**

Содержание:
- Семантическое понимание
- Cross-encoder models
- Reranking результатов
- Contextual search
- Multilingual semantic search

### [04-conversational-search.md](./04-conversational-search.md) (25 страниц)
**Conversational Search & RAG**

Содержание:
- RAG (Retrieval Augmented Generation)
- Chat interface
- Context management
- Follow-up questions
- Citation sources
- Streaming responses
- Memory & history

Пример:
```typescript
// Conversational search
const conversation = await client.conversations().create({
  collection: 'docs',
  system_prompt: 'You are a helpful documentation assistant'
})

// User message
const response = await conversation.message({
  content: 'How do I create a collection?',
  stream: true
})

// AI ответ с цитированием источников
console.log(response.answer)
console.log('Sources:', response.sources)
```

### [05-image-search.md](./05-image-search.md) (15 страниц)
**Image Search with CLIP**

Содержание:
- CLIP model setup
- Image embeddings
- Text-to-image search
- Image-to-image search
- Multimodal search
- OCR integration

Пример:
```typescript
// Поиск по описанию изображения
const results = await client.collections('products')
  .documents()
  .search({
    q: 'red sports car',
    query_by: 'image_embedding',
    use_clip: true
  })

// Поиск похожих изображений
const similar = await client.collections('products')
  .documents()
  .search({
    image_query: imageUrl,
    k: 10
  })
```

### [06-geo-search.md](./06-geo-search.md) (18 страниц)
**Advanced Geo Search**

Содержание:
- Radius search
- Polygon search
- Bounding box search
- Multi-location search
- Distance calculation
- Geo-filtering
- Map integration

Пример:
```typescript
// Поиск в радиусе
const results = await client.collections('stores')
  .documents()
  .search({
    q: '*',
    filter_by: 'location:(37.7749, -122.4194, 10 km)',
    sort_by: 'location(37.7749, -122.4194):asc'
  })

// Поиск в полигоне
const polygonResults = await client.collections('stores')
  .documents()
  .search({
    q: '*',
    filter_by: 'location:(37.7, -122.4, 37.8, -122.3, 37.75, -122.35)'
  })
```

### [07-voice-search.md](./07-voice-search.md) (12 страниц)
**Voice Search with Whisper**

Содержание:
- OpenAI Whisper integration
- Speech-to-text
- Voice commands
- Multilingual voice search
- Real-time transcription

### [08-joins.md](./08-joins.md) (20 страниц)
**JOIN Queries**

Содержание:
- Что такое joins
- Inner joins
- Left joins
- Nested joins
- Performance considerations
- Use cases

Пример:
```typescript
// JOIN products с reviews
const results = await client.collections('products')
  .documents()
  .search({
    q: 'laptop',
    query_by: 'name',
    join: {
      reviews: {
        collection: 'reviews',
        on: 'product_id',
        fields: ['rating', 'comment', 'author']
      }
    }
  })

// Результат включает вложенные reviews
results.hits[0].document.reviews  // Array of reviews
```

### [09-grouping.md](./09-grouping.md) (15 страниц)
**Result Grouping**

Содержание:
- Group by field
- Group limit
- Group sorting
- Nested grouping
- Faceted grouping

Пример:
```typescript
// Группировка по бренду
const results = await client.collections('products')
  .documents()
  .search({
    q: 'smartphone',
    query_by: 'name',
    group_by: 'brand',
    group_limit: 3  // Топ 3 из каждого бренда
  })

// Результат сгруппирован
// Apple: [iPhone 14, iPhone 13, iPhone 12]
// Samsung: [Galaxy S23, Galaxy S22, Galaxy S21]
```

### [10-federated-search.md](./10-federated-search.md) (15 страниц)
**Federated Multi-Search**

Содержание:
- Поиск по нескольким коллекциям
- Merging результатов
- Weighted collections
- Cross-collection ranking
- Performance optimization

Пример:
```typescript
// Поиск одновременно в products, articles, docs
const results = await client.multiSearch({
  searches: [
    {
      collection: 'products',
      q: 'iphone',
      query_by: 'name'
    },
    {
      collection: 'articles',
      q: 'iphone',
      query_by: 'title,content'
    },
    {
      collection: 'docs',
      q: 'iphone',
      query_by: 'title,body'
    }
  ]
})

// Результаты из всех коллекций
results.forEach(result => {
  console.log(`${result.collection}: ${result.found} results`)
})
```

## Примеры продвинутого использования

### Hybrid Search (Keyword + Vector)

```typescript
// Комбинация keyword и semantic search
async function hybridSearch(query: string) {
  // 1. Keyword search
  const keywordResults = await client.collections('products')
    .documents()
    .search({
      q: query,
      query_by: 'name,description'
    })

  // 2. Vector search
  const embedding = await generateEmbedding(query)
  const vectorResults = await client.collections('products')
    .documents()
    .search({
      q: '*',
      vector_query: `embedding:(${embedding.join(',')}, k:100)`
    })

  // 3. Merge & rerank
  const merged = mergeResults(keywordResults, vectorResults, {
    keywordWeight: 0.7,
    vectorWeight: 0.3
  })

  return merged
}
```

### RAG (Retrieval Augmented Generation)

```typescript
import { ChatOpenAI } from '@langchain/openai'
import { AACSearchVectorStore } from '@aacsearch/langchain'

// Setup
const vectorStore = new AACSearchVectorStore({
  client: client,
  collection: 'knowledge_base'
})

const llm = new ChatOpenAI({
  modelName: 'gpt-4',
  temperature: 0
})

// RAG query
async function ragQuery(question: string) {
  // 1. Retrieve relevant documents
  const docs = await vectorStore.similaritySearch(question, 5)

  // 2. Build context
  const context = docs.map(d => d.pageContent).join('\n\n')

  // 3. Generate answer
  const prompt = `
Context:
${context}

Question: ${question}

Answer based only on the context above. If you cannot answer, say "I don't know".
  `

  const response = await llm.invoke(prompt)

  return {
    answer: response.content,
    sources: docs.map(d => d.metadata)
  }
}

// Usage
const result = await ragQuery('How do I create a collection?')
console.log('Answer:', result.answer)
console.log('Sources:', result.sources)
```

### Image Search with CLIP

```typescript
import { CLIPModel } from '@aacsearch/clip'

const clip = new CLIPModel()

// Index images
async function indexProductImages(products: Product[]) {
  for (const product of products) {
    // Generate image embedding
    const imageEmbedding = await clip.encodeImage(product.imageUrl)

    // Generate text embedding for description
    const textEmbedding = await clip.encodeText(product.description)

    await client.collections('products').documents().create({
      id: product.id,
      name: product.name,
      image_url: product.imageUrl,
      image_embedding: imageEmbedding,
      text_embedding: textEmbedding
    })
  }
}

// Text-to-image search
async function searchByText(query: string) {
  const textEmbedding = await clip.encodeText(query)

  return await client.collections('products')
    .documents()
    .search({
      q: '*',
      vector_query: `image_embedding:(${textEmbedding.join(',')}, k:20)`
    })
}

// Image-to-image search
async function searchByImage(imageUrl: string) {
  const imageEmbedding = await clip.encodeImage(imageUrl)

  return await client.collections('products')
    .documents()
    .search({
      q: '*',
      vector_query: `image_embedding:(${imageEmbedding.join(',')}, k:20)`
    })
}

// Multimodal search (text + image)
async function multimodalSearch(text: string, imageUrl: string) {
  const textEmb = await clip.encodeText(text)
  const imageEmb = await clip.encodeImage(imageUrl)

  // Combine embeddings (average)
  const combined = textEmb.map((val, i) => (val + imageEmb[i]) / 2)

  return await client.collections('products')
    .documents()
    .search({
      q: '*',
      vector_query: `image_embedding:(${combined.join(',')}, k:20)`
    })
}
```

### Voice Search with Whisper

```typescript
import { Whisper } from 'openai'

const whisper = new Whisper({ apiKey: process.env.OPENAI_API_KEY })

// Voice search handler
async function voiceSearch(audioFile: File) {
  // 1. Transcribe audio
  const transcription = await whisper.transcribe(audioFile)
  const query = transcription.text

  console.log('Transcribed query:', query)

  // 2. Perform search
  const results = await client.collections('products')
    .documents()
    .search({
      q: query,
      query_by: 'name,description'
    })

  return {
    query,
    results
  }
}

// Real-time voice search (streaming)
async function* streamingVoiceSearch(audioStream: ReadableStream) {
  let buffer = ''

  for await (const chunk of whisper.transcribeStream(audioStream)) {
    buffer += chunk.text

    // Search as we transcribe
    if (buffer.length > 10) {
      const results = await client.collections('products')
        .documents()
        .search({
          q: buffer,
          query_by: 'name',
          prefix: true,
          per_page: 5
        })

      yield {
        transcript: buffer,
        results
      }
    }
  }
}
```

### Federated Search с весами

```typescript
// Weighted federated search
async function federatedSearch(query: string) {
  const results = await client.multiSearch({
    searches: [
      {
        collection: 'products',
        q: query,
        query_by: 'name,description',
        weight: 1.0  // Наивысший приоритет
      },
      {
        collection: 'articles',
        q: query,
        query_by: 'title,content',
        weight: 0.8
      },
      {
        collection: 'docs',
        q: query,
        query_by: 'title,body',
        weight: 0.6
      },
      {
        collection: 'faqs',
        q: query,
        query_by: 'question,answer',
        weight: 0.4
      }
    ]
  })

  // Merge и sort по weighted score
  const allHits = []

  results.forEach(result => {
    result.hits.forEach(hit => {
      allHits.push({
        ...hit,
        collection: result.request_params.collection,
        weighted_score: hit.text_match * result.request_params.weight
      })
    })
  })

  // Sort by weighted score
  allHits.sort((a, b) => b.weighted_score - a.weighted_score)

  return allHits.slice(0, 20)  // Top 20
}
```

## Performance Optimization

### Vector Search Optimization

```typescript
// Использование HNSW index для быстрого ANN поиска
{
  name: 'products',
  fields: [
    {
      name: 'embedding',
      type: 'float[]',
      num_dim: 384,
      hnsw_config: {
        ef_construction: 200,  // Качество индекса
        m: 16                  // Количество связей
      }
    }
  ]
}

// Batch vector search
async function batchVectorSearch(queries: string[]) {
  const embeddings = await Promise.all(
    queries.map(q => generateEmbedding(q))
  )

  return await client.multiSearch({
    searches: embeddings.map(emb => ({
      collection: 'products',
      q: '*',
      vector_query: `embedding:(${emb.join(',')}, k:10)`
    }))
  })
}
```

### Caching Strategy

```typescript
// Кеширование embeddings
import { createClient } from 'redis'

const redis = createClient()

async function getCachedEmbedding(text: string): Promise<number[]> {
  const cached = await redis.get(`embedding:${text}`)

  if (cached) {
    return JSON.parse(cached)
  }

  const embedding = await generateEmbedding(text)
  await redis.set(`embedding:${text}`, JSON.stringify(embedding), {
    EX: 86400  // 24 часа
  })

  return embedding
}
```

## Best Practices

### 1. Выбор правильной техники

```typescript
// ✅ Используйте keyword search для точных совпадений
q: 'iPhone 14 Pro'

// ✅ Используйте vector search для семантического поиска
q: 'affordable smartphone with good camera'
use_semantic_search: true

// ✅ Используйте hybrid для лучших результатов
hybridSearch('laptop for programming')
```

### 2. Оптимизация embeddings

```typescript
// ✅ Batch processing для embeddings
const embeddings = await batchGenerateEmbeddings(texts)

// ✅ Кеширование популярных запросов
const embedding = await getCachedEmbedding(query)

// ✅ Использование меньших моделей где возможно
model: 'text-embedding-3-small'  // 384 dim вместо 1536
```

### 3. Мониторинг производительности

```typescript
class SearchMonitor {
  async trackAdvancedSearch(type: string, duration: number) {
    await metrics.track({
      search_type: type,
      duration_ms: duration,
      timestamp: Date.now()
    })

    if (duration > 1000) {
      await alert(`Slow ${type} search: ${duration}ms`)
    }
  }
}
```

## Следующие шаги

- Попробуйте [Natural Language Search](./01-nl-search.md)
- Освойте [Vector Search](./02-vector-search.md)
- Внедрите [Conversational Search](./04-conversational-search.md)
- Добавьте [Image Search](./05-image-search.md)
- Изучите [Geo Search](./06-geo-search.md)

---

**Назад**: [← Интеграции](../05-integrations/README.md) | **Далее**: [Natural Language Search →](./01-nl-search.md)
