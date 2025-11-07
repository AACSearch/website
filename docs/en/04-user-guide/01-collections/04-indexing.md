# 4.1.4 Индексация документов

## Обзор

Индексация - это процесс добавления, обновления и удаления документов в коллекции AACSearch. Правильная настройка индексации обеспечивает актуальность данных и оптимальную производительность поиска.

## Содержание

- [Базовая индексация](#базовая-индексация)
- [Массовая индексация](#массовая-индексация)
- [Обновление документов](#обновление-документов)
- [Удаление документов](#удаление-документов)
- [Hooks и обработчики](#hooks-и-обработчики)
- [Автосинхронизация](#автосинхронизация)
- [Оптимизация производительности](#оптимизация-производительности)

---

## Базовая индексация

### Индексация одного документа

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

// Создание документа
const document = {
  id: '1',
  name: 'iPhone 14 Pro',
  description: 'Latest smartphone from Apple',
  price: 999.99,
  brand: 'Apple',
  in_stock: true,
  created_at: Date.now()
}

const result = await client.collections('products')
  .documents()
  .create(document)

console.log('Document indexed:', result.id)
```

### Автоматическая генерация ID

```typescript
// Без указания ID - будет сгенерирован автоматически
const document = {
  name: 'Samsung Galaxy S23',
  price: 899.99,
  brand: 'Samsung'
}

const result = await client.collections('products')
  .documents()
  .create(document)

console.log('Generated ID:', result.id)  // Например: "42"
```

### Upsert (Create or Update)

```typescript
// Upsert - создать или обновить если существует
const document = {
  id: '1',
  name: 'iPhone 14 Pro',
  price: 949.99  // Новая цена
}

await client.collections('products')
  .documents()
  .upsert(document)
```

---

## Массовая индексация

### Import JSONL

```typescript
// Формат JSONL (JSON Lines)
const jsonlData = `
{"id":"1","name":"iPhone 14","price":799.99}
{"id":"2","name":"Samsung S23","price":899.99}
{"id":"3","name":"Google Pixel 7","price":599.99}
`.trim()

const results = await client.collections('products')
  .documents()
  .import(jsonlData, {
    action: 'create'  // 'create' | 'upsert' | 'update'
  })

console.log('Imported:', results.length, 'documents')
```

### Batch indexing

```typescript
const documents = [
  { id: '1', name: 'Product 1', price: 10 },
  { id: '2', name: 'Product 2', price: 20 },
  { id: '3', name: 'Product 3', price: 30 }
]

// Преобразуем в JSONL
const jsonl = documents.map(doc => JSON.stringify(doc)).join('\n')

const results = await client.collections('products')
  .documents()
  .import(jsonl, {
    action: 'upsert',
    batch_size: 100  // Размер батча
  })

// Проверка результатов
const failed = results.filter(r => !r.success)
if (failed.length > 0) {
  console.error('Failed documents:', failed)
}
```

### Chunked import

```typescript
// Для больших датасетов - импорт частями
async function importInChunks(
  collection: string,
  documents: any[],
  chunkSize: number = 1000
) {
  const chunks = []

  for (let i = 0; i < documents.length; i += chunkSize) {
    chunks.push(documents.slice(i, i + chunkSize))
  }

  console.log(`Importing ${documents.length} documents in ${chunks.length} chunks`)

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    const jsonl = chunk.map(doc => JSON.stringify(doc)).join('\n')

    const results = await client.collections(collection)
      .documents()
      .import(jsonl, { action: 'upsert' })

    const failed = results.filter(r => !r.success)

    console.log(`Chunk ${i + 1}/${chunks.length}: ${chunk.length - failed.length}/${chunk.length} success`)

    if (failed.length > 0) {
      console.error('Failed:', failed)
    }

    // Задержка между чанками
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log('Import complete!')
}

// Использование
await importInChunks('products', bigDataset, 1000)
```

---

## Обновление документов

### Полное обновление

```typescript
// Полная замена документа
const updatedDoc = {
  id: '1',
  name: 'iPhone 14 Pro Max',  // Обновлено
  price: 1099.99,              // Обновлено
  brand: 'Apple',
  in_stock: true,
  updated_at: Date.now()       // Добавлено
}

await client.collections('products')
  .documents('1')
  .update(updatedDoc)
```

### Частичное обновление

```typescript
// Обновить только определенные поля
await client.collections('products')
  .documents('1')
  .update({
    price: 949.99,
    updated_at: Date.now()
  }, {
    partial: true  // Важно!
  })
```

### Массовое обновление

```typescript
// Обновить несколько документов
const updates = [
  { id: '1', price: 949.99 },
  { id: '2', price: 849.99 },
  { id: '3', price: 549.99 }
]

const jsonl = updates.map(doc => JSON.stringify(doc)).join('\n')

await client.collections('products')
  .documents()
  .import(jsonl, {
    action: 'update'  // Только обновление существующих
  })
```

### Conditional updates

```typescript
// Обновить с условием
await client.collections('products')
  .documents('1')
  .update({
    price: 899.99
  }, {
    filter_by: 'price:>950'  // Обновить только если цена > 950
  })
```

---

## Удаление документов

### Удаление одного документа

```typescript
await client.collections('products')
  .documents('1')
  .delete()
```

### Массовое удаление

```typescript
// Удалить по фильтру
await client.collections('products')
  .documents()
  .delete({
    filter_by: 'in_stock:false && created_at:<1672531200000'
  })

// Удалить все документы
await client.collections('products')
  .documents()
  .delete({
    filter_by: '*'
  })
```

### Soft delete

```typescript
// Вместо удаления помечаем документ как deleted
await client.collections('products')
  .documents('1')
  .update({
    deleted: true,
    deleted_at: Date.now()
  }, {
    partial: true
  })

// При поиске исключаем удаленные
const results = await search({
  q: 'iPhone',
  query_by: 'name',
  filter_by: 'deleted:false'  // Только не удаленные
})
```

---

## Hooks и обработчики

### Before Index Hook

```typescript
// Hook перед индексацией
class ProductIndexer {
  async beforeIndex(document: any) {
    // 1. Валидация
    if (!document.name || !document.price) {
      throw new Error('Missing required fields')
    }

    // 2. Нормализация
    document.name = document.name.trim()
    document.brand = document.brand?.toLowerCase()

    // 3. Обогащение данных
    document.indexed_at = Date.now()
    document.search_keywords = this.generateKeywords(document)

    // 4. Генерация embeddings (для vector search)
    if (document.description) {
      document.embedding = await this.generateEmbedding(document.description)
    }

    return document
  }

  generateKeywords(doc: any): string[] {
    const keywords = []
    keywords.push(...doc.name.split(' '))
    keywords.push(doc.brand)
    keywords.push(...(doc.tags || []))
    return [...new Set(keywords.map(k => k.toLowerCase()))]
  }

  async generateEmbedding(text: string): Promise<number[]> {
    // OpenAI embeddings
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-3-small'
      })
    })

    const data = await response.json()
    return data.data[0].embedding
  }
}

// Использование
const indexer = new ProductIndexer()

const document = {
  id: '1',
  name: 'iPhone 14',
  price: 999.99,
  brand: 'Apple'
}

const processed = await indexer.beforeIndex(document)
await client.collections('products').documents().create(processed)
```

### After Index Hook

```typescript
class ProductIndexer {
  async afterIndex(document: any, result: any) {
    // 1. Логирование
    console.log(`Indexed document ${document.id}`)

    // 2. Обновление счетчиков
    await this.updateStats(document)

    // 3. Инвалидация кеша
    await this.invalidateCache(document.id)

    // 4. Webhook уведомления
    await this.sendWebhook({
      event: 'document.indexed',
      document_id: document.id
    })

    // 5. Обновление связанных документов
    if (document.related_ids) {
      await this.updateRelatedDocuments(document.related_ids)
    }
  }

  async updateStats(doc: any) {
    // Обновить статистику в отдельной коллекции
    await client.collections('stats').documents().upsert({
      id: 'global',
      total_products: { '+': 1 }  // Инкремент
    })
  }
}
```

### On Update Hook

```typescript
class ProductIndexer {
  async onUpdate(oldDoc: any, newDoc: any) {
    // Сравнение изменений
    const changes = this.detectChanges(oldDoc, newDoc)

    // Логирование изменений
    await this.logChanges(newDoc.id, changes)

    // Если изменилась цена - отправить уведомления
    if (changes.includes('price')) {
      await this.notifyPriceChange(newDoc)
    }

    return newDoc
  }

  detectChanges(old: any, newDoc: any): string[] {
    const changed = []
    for (const key of Object.keys(newDoc)) {
      if (old[key] !== newDoc[key]) {
        changed.push(key)
      }
    }
    return changed
  }
}
```

---

## Автосинхронизация

### Database Sync

```typescript
// Синхронизация с PostgreSQL
import { createClient } from '@supabase/supabase-js'

class DatabaseSync {
  private supabase: any
  private typesense: TypesenseClient

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    )
    this.typesense = new TypesenseClient({...})
  }

  async syncProducts() {
    // 1. Получить данные из базы
    const { data: products } = await this.supabase
      .from('products')
      .select('*')
      .order('updated_at', { ascending: false })

    // 2. Трансформировать для Typesense
    const transformed = products.map(p => ({
      id: String(p.id),
      name: p.name,
      description: p.description,
      price: p.price,
      brand: p.brand,
      in_stock: p.stock > 0,
      created_at: new Date(p.created_at).getTime(),
      updated_at: new Date(p.updated_at).getTime()
    }))

    // 3. Импортировать в Typesense
    const jsonl = transformed.map(d => JSON.stringify(d)).join('\n')
    await this.typesense.collections('products')
      .documents()
      .import(jsonl, { action: 'upsert' })

    console.log(`Synced ${products.length} products`)
  }

  // Периодическая синхронизация
  async startSync(intervalMs: number = 60000) {
    console.log('Starting sync...')
    await this.syncProducts()

    setInterval(async () => {
      console.log('Syncing...')
      await this.syncProducts()
    }, intervalMs)
  }

  // Инкрементальная синхронизация
  async syncSince(timestamp: number) {
    const { data: products } = await this.supabase
      .from('products')
      .select('*')
      .gt('updated_at', new Date(timestamp).toISOString())

    if (products.length > 0) {
      const transformed = products.map(p => this.transform(p))
      const jsonl = transformed.map(d => JSON.stringify(d)).join('\n')

      await this.typesense.collections('products')
        .documents()
        .import(jsonl, { action: 'upsert' })

      console.log(`Synced ${products.length} updated products`)
    }
  }
}

// Использование
const sync = new DatabaseSync()
await sync.startSync(60000)  // Каждую минуту
```

### Real-time Sync с Webhooks

```typescript
// Обработчик вебхуков от CMS/Database
import { Router } from 'express'

const router = Router()

router.post('/webhook/product-updated', async (req, res) => {
  const { id, action, data } = req.body

  try {
    switch (action) {
      case 'create':
      case 'update':
        await client.collections('products')
          .documents()
          .upsert({
            id: String(id),
            ...transformData(data)
          })
        break

      case 'delete':
        await client.collections('products')
          .documents(String(id))
          .delete()
        break
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
```

### Change Data Capture (CDC)

```typescript
// Использование Debezium или аналогов для CDC
import { Kafka } from 'kafkajs'

class CDCSync {
  private kafka: Kafka
  private typesense: TypesenseClient

  constructor() {
    this.kafka = new Kafka({
      clientId: 'typesense-sync',
      brokers: ['kafka:9092']
    })
    this.typesense = new TypesenseClient({...})
  }

  async consume() {
    const consumer = this.kafka.consumer({ groupId: 'typesense' })

    await consumer.connect()
    await consumer.subscribe({ topic: 'products.changes' })

    await consumer.run({
      eachMessage: async ({ message }) => {
        const change = JSON.parse(message.value.toString())

        switch (change.op) {
          case 'c':  // Create
          case 'u':  // Update
            await this.typesense.collections('products')
              .documents()
              .upsert(this.transform(change.after))
            break

          case 'd':  // Delete
            await this.typesense.collections('products')
              .documents(change.before.id)
              .delete()
            break
        }
      }
    })
  }
}

const cdc = new CDCSync()
await cdc.consume()
```

---

## Оптимизация производительности

### Batch Processing

```typescript
// Оптимизированная батч-обработка
class BatchIndexer {
  private queue: any[] = []
  private batchSize: number = 100
  private flushInterval: number = 5000
  private timer: any

  constructor(
    private collection: string,
    private client: TypesenseClient
  ) {
    this.startTimer()
  }

  async add(document: any) {
    this.queue.push(document)

    if (this.queue.length >= this.batchSize) {
      await this.flush()
    }
  }

  async flush() {
    if (this.queue.length === 0) return

    const batch = this.queue.splice(0, this.batchSize)
    const jsonl = batch.map(d => JSON.stringify(d)).join('\n')

    try {
      await this.client.collections(this.collection)
        .documents()
        .import(jsonl, { action: 'upsert' })

      console.log(`Flushed ${batch.length} documents`)
    } catch (error) {
      console.error('Flush error:', error)
      // Вернуть в очередь для повтора
      this.queue.unshift(...batch)
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.flush()
    }, this.flushInterval)
  }

  async close() {
    clearInterval(this.timer)
    await this.flush()
  }
}

// Использование
const indexer = new BatchIndexer('products', client)

for (const doc of documents) {
  await indexer.add(doc)
}

await indexer.close()
```

### Parallel Indexing

```typescript
// Параллельная индексация
async function parallelIndex(
  collection: string,
  documents: any[],
  concurrency: number = 5
) {
  const chunks = []
  const chunkSize = Math.ceil(documents.length / concurrency)

  for (let i = 0; i < documents.length; i += chunkSize) {
    chunks.push(documents.slice(i, i + chunkSize))
  }

  const results = await Promise.all(
    chunks.map(async (chunk, index) => {
      const jsonl = chunk.map(d => JSON.stringify(d)).join('\n')

      const result = await client.collections(collection)
        .documents()
        .import(jsonl, { action: 'upsert' })

      console.log(`Worker ${index + 1}: indexed ${chunk.length} documents`)

      return result
    })
  )

  return results.flat()
}

// Использование
await parallelIndex('products', bigDataset, 10)
```

### Throttling

```typescript
// Rate limiting для API
import pThrottle from 'p-throttle'

const throttle = pThrottle({
  limit: 10,      // 10 запросов
  interval: 1000  // за 1 секунду
})

async function indexDocument(doc: any) {
  return await client.collections('products')
    .documents()
    .create(doc)
}

const throttledIndex = throttle(indexDocument)

// Использование
for (const doc of documents) {
  await throttledIndex(doc)
}
```

---

## Best Practices

### 1. Валидация перед индексацией

```typescript
function validateDocument(doc: any): boolean {
  // Обязательные поля
  if (!doc.id || !doc.name) {
    console.error('Missing required fields')
    return false
  }

  // Типы данных
  if (typeof doc.price !== 'number') {
    console.error('Price must be a number')
    return false
  }

  // Диапазоны
  if (doc.price < 0) {
    console.error('Price cannot be negative')
    return false
  }

  return true
}

// Использование
if (validateDocument(document)) {
  await client.collections('products').documents().create(document)
}
```

### 2. Обработка ошибок

```typescript
async function safeIndex(doc: any, retries: number = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await client.collections('products')
        .documents()
        .create(doc)
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error)

      if (i === retries - 1) {
        // Последняя попытка - сохраняем в dead letter queue
        await saveToDeadLetterQueue(doc, error)
        throw error
      }

      // Exponential backoff
      await new Promise(resolve =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      )
    }
  }
}
```

### 3. Мониторинг

```typescript
class IndexingMonitor {
  private stats = {
    total: 0,
    success: 0,
    failed: 0,
    duration: 0
  }

  async trackIndex(fn: () => Promise<any>) {
    const start = Date.now()
    this.stats.total++

    try {
      const result = await fn()
      this.stats.success++
      return result
    } catch (error) {
      this.stats.failed++
      throw error
    } finally {
      this.stats.duration = Date.now() - start
    }
  }

  getStats() {
    return {
      ...this.stats,
      successRate: (this.stats.success / this.stats.total) * 100,
      avgDuration: this.stats.duration / this.stats.total
    }
  }
}

// Использование
const monitor = new IndexingMonitor()

for (const doc of documents) {
  await monitor.trackIndex(() =>
    client.collections('products').documents().create(doc)
  )
}

console.log('Stats:', monitor.getStats())
```

---

## Следующие шаги

- Изучите [массовый импорт](./05-bulk-import.md) из файлов
- Настройте [поиск](../02-search/01-basic-search.md)
- Изучите [интеграции](../05-integrations/README.md) для автосинхронизации

---

**Назад**: [← Типы полей](./03-field-types.md) | **Далее**: [Массовый импорт →](./05-bulk-import.md)
