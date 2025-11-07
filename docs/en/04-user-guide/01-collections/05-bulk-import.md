# 4.1.5 Массовый импорт данных

## Обзор

Массовый импорт позволяет эффективно загружать большие объемы данных в AACSearch из различных источников: CSV, JSON, JSONL файлов, баз данных и внешних API.

## Содержание

- [Импорт из CSV](#импорт-из-csv)
- [Импорт из JSON](#импорт-из-json)
- [Импорт из JSONL](#импорт-из-jsonl)
- [Импорт из баз данных](#импорт-из-баз-данных)
- [Импорт из API](#импорт-из-api)
- [Оптимизация импорта](#оптимизация-импорта)

---

## Импорт из CSV

### Базовый импорт

```typescript
import { parse } from 'csv-parse/sync'
import { readFileSync } from 'fs'

// Чтение CSV файла
const csvData = readFileSync('products.csv', 'utf-8')

// Парсинг CSV
const records = parse(csvData, {
  columns: true,        // Первая строка - заголовки
  skip_empty_lines: true,
  trim: true
})

// Трансформация данных
const documents = records.map(record => ({
  id: record.id,
  name: record.name,
  price: parseFloat(record.price),
  brand: record.brand,
  in_stock: record.in_stock === 'true',
  tags: record.tags ? record.tags.split(',') : []
}))

// Импорт в Typesense
const jsonl = documents.map(d => JSON.stringify(d)).join('\n')
await client.collections('products')
  .documents()
  .import(jsonl, { action: 'upsert' })

console.log(`Imported ${documents.length} products`)
```

### CSV с различными разделителями

```typescript
import { parse } from 'csv-parse/sync'

// Точка с запятой как разделитель
const records = parse(csvData, {
  columns: true,
  delimiter: ';',  // или '\t' для TSV
  quote: '"',
  escape: '\\'
})
```

### Обработка больших CSV файлов

```typescript
import { createReadStream } from 'fs'
import { parse } from 'csv-parse'

async function importLargeCSV(
  filePath: string,
  collection: string,
  batchSize: number = 1000
) {
  const parser = createReadStream(filePath)
    .pipe(parse({
      columns: true,
      skip_empty_lines: true
    }))

  let batch: any[] = []
  let totalProcessed = 0

  for await (const record of parser) {
    // Трансформация
    const doc = {
      id: record.id,
      name: record.name,
      price: parseFloat(record.price),
      created_at: new Date(record.created_at).getTime()
    }

    batch.push(doc)

    // Импорт батча
    if (batch.length >= batchSize) {
      const jsonl = batch.map(d => JSON.stringify(d)).join('\n')
      await client.collections(collection)
        .documents()
        .import(jsonl, { action: 'upsert' })

      totalProcessed += batch.length
      console.log(`Processed: ${totalProcessed}`)

      batch = []
    }
  }

  // Импорт оставшихся документов
  if (batch.length > 0) {
    const jsonl = batch.map(d => JSON.stringify(d)).join('\n')
    await client.collections(collection)
      .documents()
      .import(jsonl, { action: 'upsert' })

    totalProcessed += batch.length
  }

  console.log(`Total imported: ${totalProcessed}`)
}

// Использование
await importLargeCSV('large_products.csv', 'products', 1000)
```

---

## Импорт из JSON

### Массив объектов

```typescript
import { readFileSync } from 'fs'

// Чтение JSON файла
const jsonData = readFileSync('products.json', 'utf-8')
const products = JSON.parse(jsonData)

// Преобразование в JSONL
const jsonl = products.map(p => JSON.stringify(p)).join('\n')

// Импорт
await client.collections('products')
  .documents()
  .import(jsonl, { action: 'upsert' })
```

### Вложенная структура JSON

```typescript
// Файл: data.json
{
  "products": [
    {
      "id": "1",
      "name": "Product 1",
      "variants": [
        { "sku": "P1-RED", "color": "red" },
        { "sku": "P1-BLUE", "color": "blue" }
      ]
    }
  ],
  "metadata": {
    "exported_at": "2024-01-01T00:00:00Z"
  }
}

// Импорт
const data = JSON.parse(readFileSync('data.json', 'utf-8'))

// Извлекаем продукты
const documents = data.products.map(p => ({
  id: p.id,
  name: p.name,
  variants: p.variants  // Typesense поддерживает вложенные объекты
}))

const jsonl = documents.map(d => JSON.stringify(d)).join('\n')
await client.collections('products')
  .documents()
  .import(jsonl, { action: 'upsert' })
```

---

## Импорт из JSONL

JSONL (JSON Lines) - оптимальный формат для больших датасетов.

### Прямой импорт

```typescript
import { readFileSync } from 'fs'

// JSONL файл (каждая строка - отдельный JSON)
const jsonlData = readFileSync('products.jsonl', 'utf-8')

// Прямой импорт без парсинга
await client.collections('products')
  .documents()
  .import(jsonlData, { action: 'upsert' })
```

### Потоковый импорт

```typescript
import { createReadStream } from 'fs'
import { createInterface } from 'readline'

async function importJSONL(
  filePath: string,
  collection: string,
  batchSize: number = 1000
) {
  const fileStream = createReadStream(filePath)
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })

  let batch: string[] = []
  let totalProcessed = 0

  for await (const line of rl) {
    if (line.trim()) {
      batch.push(line)

      if (batch.length >= batchSize) {
        const jsonl = batch.join('\n')
        await client.collections(collection)
          .documents()
          .import(jsonl, { action: 'upsert' })

        totalProcessed += batch.length
        console.log(`Processed: ${totalProcessed}`)

        batch = []
      }
    }
  }

  // Оставшиеся
  if (batch.length > 0) {
    const jsonl = batch.join('\n')
    await client.collections(collection)
      .documents()
      .import(jsonl, { action: 'upsert' })

    totalProcessed += batch.length
  }

  console.log(`Total imported: ${totalProcessed}`)
}

await importJSONL('products.jsonl', 'products', 1000)
```

---

## Импорт из баз данных

### PostgreSQL

```typescript
import { Client } from 'pg'

async function importFromPostgres() {
  const pgClient = new Client({
    host: 'localhost',
    database: 'mydb',
    user: 'user',
    password: 'pass'
  })

  await pgClient.connect()

  // Получить данные
  const result = await pgClient.query(`
    SELECT
      id::text,
      name,
      price::float,
      brand,
      in_stock,
      created_at
    FROM products
    ORDER BY created_at DESC
  `)

  // Трансформация
  const documents = result.rows.map(row => ({
    id: row.id,
    name: row.name,
    price: row.price,
    brand: row.brand,
    in_stock: row.in_stock,
    created_at: new Date(row.created_at).getTime()
  }))

  // Импорт батчами
  const batchSize = 1000
  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize)
    const jsonl = batch.map(d => JSON.stringify(d)).join('\n')

    await client.collections('products')
      .documents()
      .import(jsonl, { action: 'upsert' })

    console.log(`Imported batch ${i / batchSize + 1}`)
  }

  await pgClient.end()
  console.log(`Total imported: ${documents.length}`)
}

await importFromPostgres()
```

### MongoDB

```typescript
import { MongoClient } from 'mongodb'

async function importFromMongoDB() {
  const mongoClient = new MongoClient('mongodb://localhost:27017')
  await mongoClient.connect()

  const db = mongoClient.db('mydb')
  const collection = db.collection('products')

  // Курсор для больших датасетов
  const cursor = collection.find({})

  let batch: any[] = []
  const batchSize = 1000

  while (await cursor.hasNext()) {
    const doc = await cursor.next()

    // Трансформация MongoDB -> Typesense
    const transformed = {
      id: doc._id.toString(),
      name: doc.name,
      price: doc.price,
      brand: doc.brand,
      tags: doc.tags || [],
      created_at: doc.createdAt.getTime()
    }

    batch.push(transformed)

    if (batch.length >= batchSize) {
      const jsonl = batch.map(d => JSON.stringify(d)).join('\n')
      await client.collections('products')
        .documents()
        .import(jsonl, { action: 'upsert' })

      console.log(`Imported batch`)
      batch = []
    }
  }

  // Оставшиеся
  if (batch.length > 0) {
    const jsonl = batch.map(d => JSON.stringify(d)).join('\n')
    await client.collections('products')
      .documents()
      .import(jsonl, { action: 'upsert' })
  }

  await mongoClient.close()
}

await importFromMongoDB()
```

### MySQL

```typescript
import mysql from 'mysql2/promise'

async function importFromMySQL() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass',
    database: 'mydb'
  })

  // Потоковое чтение
  const [rows] = await connection.query(`
    SELECT * FROM products
  `)

  const documents = (rows as any[]).map(row => ({
    id: String(row.id),
    name: row.name,
    price: parseFloat(row.price),
    brand: row.brand,
    created_at: new Date(row.created_at).getTime()
  }))

  // Импорт батчами
  const batchSize = 1000
  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize)
    const jsonl = batch.map(d => JSON.stringify(d)).join('\n')

    await client.collections('products')
      .documents()
      .import(jsonl, { action: 'upsert' })
  }

  await connection.end()
  console.log(`Imported ${documents.length} documents`)
}

await importFromMySQL()
```

---

## Импорт из API

### REST API

```typescript
async function importFromAPI(apiUrl: string) {
  let page = 1
  let hasMore = true
  let totalImported = 0

  while (hasMore) {
    // Получить данные
    const response = await fetch(`${apiUrl}?page=${page}&limit=100`)
    const data = await response.json()

    if (data.products.length === 0) {
      hasMore = false
      break
    }

    // Трансформация
    const documents = data.products.map(p => ({
      id: String(p.id),
      name: p.name,
      price: p.price,
      brand: p.brand
    }))

    // Импорт
    const jsonl = documents.map(d => JSON.stringify(d)).join('\n')
    await client.collections('products')
      .documents()
      .import(jsonl, { action: 'upsert' })

    totalImported += documents.length
    console.log(`Page ${page}: imported ${documents.length} products`)

    page++
  }

  console.log(`Total imported: ${totalImported}`)
}

await importFromAPI('https://api.example.com/products')
```

### GraphQL API

```typescript
async function importFromGraphQL(endpoint: string) {
  let offset = 0
  const limit = 100
  let hasMore = true

  while (hasMore) {
    const query = `
      query GetProducts($offset: Int!, $limit: Int!) {
        products(offset: $offset, limit: $limit) {
          id
          name
          price
          brand
        }
      }
    `

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { offset, limit }
      })
    })

    const { data } = await response.json()

    if (data.products.length === 0) {
      hasMore = false
      break
    }

    // Импорт
    const jsonl = data.products.map(p => JSON.stringify(p)).join('\n')
    await client.collections('products')
      .documents()
      .import(jsonl, { action: 'upsert' })

    console.log(`Imported ${data.products.length} products`)
    offset += limit
  }
}

await importFromGraphQL('https://api.example.com/graphql')
```

---

## Оптимизация импорта

### Параллельный импорт

```typescript
async function parallelImport(
  documents: any[],
  concurrency: number = 5
) {
  const chunkSize = Math.ceil(documents.length / concurrency)
  const chunks = []

  for (let i = 0; i < documents.length; i += chunkSize) {
    chunks.push(documents.slice(i, i + chunkSize))
  }

  await Promise.all(
    chunks.map(async (chunk, index) => {
      const jsonl = chunk.map(d => JSON.stringify(d)).join('\n')

      await client.collections('products')
        .documents()
        .import(jsonl, { action: 'upsert' })

      console.log(`Worker ${index + 1}: imported ${chunk.length}`)
    })
  )

  console.log(`Total imported: ${documents.length}`)
}

await parallelImport(bigDataset, 10)
```

### Progress Bar

```typescript
import cliProgress from 'cli-progress'

async function importWithProgress(
  documents: any[],
  batchSize: number = 1000
) {
  const progressBar = new cliProgress.SingleBar({
    format: 'Progress |{bar}| {percentage}% | {value}/{total} documents'
  })

  progressBar.start(documents.length, 0)

  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize)
    const jsonl = batch.map(d => JSON.stringify(d)).join('\n')

    await client.collections('products')
      .documents()
      .import(jsonl, { action: 'upsert' })

    progressBar.update(Math.min(i + batchSize, documents.length))
  }

  progressBar.stop()
  console.log('Import complete!')
}

await importWithProgress(documents)
```

### Обработка ошибок

```typescript
async function safeImport(
  documents: any[],
  batchSize: number = 1000
) {
  const failed: any[] = []
  let successCount = 0

  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize)
    const jsonl = batch.map(d => JSON.stringify(d)).join('\n')

    try {
      const results = await client.collections('products')
        .documents()
        .import(jsonl, { action: 'upsert' })

      // Проверяем результаты
      results.forEach((result, index) => {
        if (!result.success) {
          failed.push({
            document: batch[index],
            error: result.error
          })
        } else {
          successCount++
        }
      })
    } catch (error) {
      console.error(`Batch ${i / batchSize + 1} failed:`, error)
      failed.push(...batch)
    }
  }

  console.log(`Success: ${successCount}`)
  console.log(`Failed: ${failed.length}`)

  // Сохранить failed для повторной попытки
  if (failed.length > 0) {
    const failedJsonl = failed.map(f => JSON.stringify(f.document)).join('\n')
    await writeFileSync('failed_imports.jsonl', failedJsonl)
  }

  return { successCount, failed }
}

await safeImport(documents)
```

---

## CLI Utility

Готовая утилита для импорта:

```bash
# Установка
npm install -g @aacsearch/import-cli

# Импорт из CSV
aacsearch-import \
  --file products.csv \
  --format csv \
  --collection products \
  --batch-size 1000

# Импорт из JSON
aacsearch-import \
  --file products.json \
  --format json \
  --collection products

# Импорт из Database
aacsearch-import \
  --source postgres://user:pass@localhost/db \
  --table products \
  --collection products

# С трансформацией
aacsearch-import \
  --file products.csv \
  --collection products \
  --transform "./transform.js"
```

**transform.js:**

```javascript
module.exports = function transform(record) {
  return {
    id: record.id,
    name: record.name.trim(),
    price: parseFloat(record.price),
    tags: record.tags.split(',').map(t => t.trim()),
    created_at: Date.now()
  }
}
```

---

## Следующие шаги

- Изучите [базовый поиск](../02-search/01-basic-search.md)
- Настройте [интеграции](../05-integrations/README.md) для автоматической синхронизации
- Изучите [аналитику](../04-analytics/README.md) для мониторинга данных

---

**Назад**: [← Индексация документов](./04-indexing.md) | **Далее**: [Основы поиска →](../02-search/01-basic-search.md)
