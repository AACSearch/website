# Bulk Operations API

API массовых операций позволяет эффективно импортировать, экспортировать, обновлять и удалять большие объемы документов.

## Обзор

Bulk API поддерживает:
- Импорт тысяч документов из JSONL файлов
- Экспорт коллекций в JSONL формат
- Массовое обновление документов по запросу
- Массовое удаление документов по фильтру
- Batch операции с высокой производительностью

## POST /api/bulk/import

Импорт документов из JSONL файла.

### Аутентификация

**Требуется:** JWT Token + Admin/Owner role

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Request (multipart/form-data)

```
POST /api/bulk/import
Content-Type: multipart/form-data

file: [JSONL file]
collection: symbols
action: upsert
```

### Form Parameters

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `file` | File | Да | JSONL файл с документами |
| `collection` | string | Да | Целевая коллекция |
| `action` | string | Нет | Действие: `create`, `upsert`, `update`, `emplace`. По умолчанию: `upsert` |

### Actions

- **create** - создает только новые документы (ошибка если существует)
- **upsert** - создает или обновляет документы
- **update** - обновляет только существующие документы
- **emplace** - создает или заменяет документы полностью

### JSONL Format

Каждая строка - отдельный JSON объект:

```jsonl
{"id":"doc_001","title":"React Component","keywords":["react","component"],"status":"active"}
{"id":"doc_002","title":"Vue Directive","keywords":["vue","directive"],"status":"active"}
{"id":"doc_003","title":"Angular Service","keywords":["angular","service"],"status":"draft"}
```

**Требования:**
- Каждый документ должен иметь поле `id`
- Максимальный размер файла: 100MB
- Максимум документов: 100,000 за один импорт

### Response (200 OK)

```json
{
  "success": true,
  "result": {
    "num_imported": 2543,
    "num_updated": 1876,
    "num_created": 667,
    "num_errors": 3,
    "errors": [
      {
        "line": 145,
        "document_id": "doc_145",
        "error": "Schema validation failed: missing required field 'title'"
      },
      {
        "line": 892,
        "document_id": "doc_892",
        "error": "Duplicate ID"
      }
    ],
    "import_time_ms": 3456
  }
}
```

### Examples

#### cURL

```bash
curl -X POST "https://api.aacsearch.com/api/bulk/import" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@documents.jsonl" \
  -F "collection=symbols" \
  -F "action=upsert"
```

#### JavaScript (Browser)

```javascript
async function bulkImport(file, collection, action = 'upsert') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('collection', collection);
  formData.append('action', action);

  const response = await fetch('https://api.aacsearch.com/api/bulk/import', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`
    },
    body: formData
  });

  return response.json();
}

// Usage with file input
const fileInput = document.getElementById('jsonlFile');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const result = await bulkImport(file, 'symbols', 'upsert');

  console.log(`Imported: ${result.result.num_imported} documents`);
  console.log(`Errors: ${result.result.num_errors}`);

  if (result.result.errors.length > 0) {
    console.error('Import errors:', result.result.errors);
  }
});
```

#### JavaScript (Node.js)

```javascript
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

async function bulkImportFile(filePath, collection, action = 'upsert') {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));
  formData.append('collection', collection);
  formData.append('action', action);

  const response = await fetch('https://api.aacsearch.com/api/bulk/import', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      ...formData.getHeaders()
    },
    body: formData
  });

  return response.json();
}

// Import from file
const result = await bulkImportFile('./data/symbols.jsonl', 'symbols', 'upsert');
console.log(`Imported ${result.result.num_imported} documents in ${result.result.import_time_ms}ms`);
```

#### Python

```python
import requests

def bulk_import(file_path: str, collection: str, action: str = 'upsert'):
    with open(file_path, 'rb') as f:
        files = {'file': f}
        data = {
            'collection': collection,
            'action': action
        }

        response = requests.post(
            'https://api.aacsearch.com/api/bulk/import',
            headers={'Authorization': f'Bearer {JWT_TOKEN}'},
            files=files,
            data=data
        )

        return response.json()

# Import documents
result = bulk_import('documents.jsonl', 'symbols', 'upsert')
print(f"Imported: {result['result']['num_imported']}")
print(f"Errors: {result['result']['num_errors']}")

for error in result['result']['errors']:
    print(f"Line {error['line']}: {error['error']}")
```

#### PHP

```php
<?php

function bulkImport($filePath, $collection, $action = 'upsert') {
    $ch = curl_init('https://api.aacsearch.com/api/bulk/import');

    $file = new CURLFile($filePath, 'application/x-ndjson', 'documents.jsonl');

    $data = [
        'file' => $file,
        'collection' => $collection,
        'action' => $action
    ];

    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $data,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . JWT_TOKEN
        ]
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true);
}

// Import documents
$result = bulkImport('documents.jsonl', 'symbols', 'upsert');
echo "Imported: {$result['result']['num_imported']} documents\n";

?>
```

---

## GET /api/bulk/export

Экспорт документов из коллекции в JSONL формат.

### Query Parameters

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `collection` | string | Да | Коллекция для экспорта |
| `filter_by` | string | Нет | Условия фильтрации |
| `include_fields` | string | Нет | Список полей через запятую |
| `exclude_fields` | string | Нет | Исключить поля |

### Response (200 OK)

```
Content-Type: application/x-ndjson
Content-Disposition: attachment; filename="symbols_export.jsonl"

{"id":"doc_001","title":"React Component","keywords":["react","component"]}
{"id":"doc_002","title":"Vue Directive","keywords":["vue","directive"]}
{"id":"doc_003","title":"Angular Service","keywords":["angular","service"]}
```

### Examples

#### cURL

```bash
# Export all documents
curl -X GET "https://api.aacsearch.com/api/bulk/export?collection=symbols" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o symbols_export.jsonl

# Export with filter
curl -X GET "https://api.aacsearch.com/api/bulk/export?collection=symbols&filter_by=status:=active" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o symbols_active.jsonl

# Export specific fields
curl -X GET "https://api.aacsearch.com/api/bulk/export?collection=symbols&include_fields=id,title,keywords" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o symbols_minimal.jsonl
```

#### JavaScript

```javascript
async function bulkExport(collection, filterBy = null, includeFields = null) {
  const params = new URLSearchParams({ collection });
  if (filterBy) params.append('filter_by', filterBy);
  if (includeFields) params.append('include_fields', includeFields);

  const response = await fetch(
    `https://api.aacsearch.com/api/bulk/export?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`
      }
    }
  );

  // Save as file
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${collection}_export.jsonl`;
  a.click();
}

// Export active documents
await bulkExport('symbols', 'status:=active', 'id,title,keywords');
```

#### Python

```python
def bulk_export(collection: str, filter_by: str = None, output_file: str = None):
    params = {'collection': collection}
    if filter_by:
        params['filter_by'] = filter_by

    response = requests.get(
        'https://api.aacsearch.com/api/bulk/export',
        params=params,
        headers={'Authorization': f'Bearer {JWT_TOKEN}'},
        stream=True
    )

    output_file = output_file or f'{collection}_export.jsonl'

    with open(output_file, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

    return output_file

# Export to file
exported_file = bulk_export('symbols', filter_by='status:=active')
print(f"Exported to {exported_file}")
```

---

## POST /api/bulk/update-by-query

Массовое обновление документов по запросу.

### Request Body

```json
{
  "collection": "symbols",
  "filter_by": "status:=draft && created_at:<1699564800",
  "updates": {
    "status": "archived",
    "archived_at": 1699564800,
    "archived_by": "system"
  }
}
```

### Request Parameters

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `collection` | string | Да | Целевая коллекция |
| `filter_by` | string | Да | Условия фильтрации |
| `updates` | object | Да | Объект с обновлениями |

### Response (200 OK)

```json
{
  "success": true,
  "result": {
    "num_updated": 1234,
    "update_time_ms": 567
  }
}
```

### Examples

#### JavaScript

```javascript
async function updateByQuery(collection, filterBy, updates) {
  const response = await fetch('https://api.aacsearch.com/api/bulk/update-by-query', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      collection,
      filter_by: filterBy,
      updates
    })
  });

  return response.json();
}

// Archive old draft documents
const result = await updateByQuery(
  'symbols',
  'status:=draft && created_at:<1699564800',
  {
    status: 'archived',
    archived_at: Date.now(),
    archived_by: 'system'
  }
);

console.log(`Updated ${result.result.num_updated} documents`);
```

#### Python

```python
def update_by_query(collection: str, filter_by: str, updates: dict):
    response = requests.post(
        'https://api.aacsearch.com/api/bulk/update-by-query',
        headers={'Authorization': f'Bearer {JWT_TOKEN}'},
        json={
            'collection': collection,
            'filter_by': filter_by,
            'updates': updates
        }
    )
    return response.json()

# Bulk update status
result = update_by_query(
    'symbols',
    'category:=deprecated',
    {
        'status': 'archived',
        'archived_at': int(time.time())
    }
)

print(f"Updated {result['result']['num_updated']} documents")
```

---

## POST /api/bulk/delete-by-query

Массовое удаление документов по запросу.

### Request Body

```json
{
  "collection": "symbols",
  "filter_by": "status:=archived && archived_at:<1696896000"
}
```

### Request Parameters

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `collection` | string | Да | Целевая коллекция |
| `filter_by` | string | Да | Условия фильтрации |

### Response (200 OK)

```json
{
  "success": true,
  "result": {
    "num_deleted": 456,
    "delete_time_ms": 123
  }
}
```

### Examples

#### JavaScript

```javascript
async function deleteByQuery(collection, filterBy) {
  // Confirm before deleting
  if (!confirm(`Delete documents matching: ${filterBy}?`)) {
    return null;
  }

  const response = await fetch('https://api.aacsearch.com/api/bulk/delete-by-query', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      collection,
      filter_by: filterBy
    })
  });

  return response.json();
}

// Delete old archived documents
const result = await deleteByQuery(
  'symbols',
  'status:=archived && archived_at:<1696896000'
);

if (result) {
  console.log(`Deleted ${result.result.num_deleted} documents`);
}
```

#### Python

```python
def delete_by_query(collection: str, filter_by: str):
    # Confirm before deleting
    print(f"About to delete documents matching: {filter_by}")
    confirm = input("Confirm deletion (yes/no): ")

    if confirm.lower() != 'yes':
        return None

    response = requests.post(
        'https://api.aacsearch.com/api/bulk/delete-by-query',
        headers={'Authorization': f'Bearer {JWT_TOKEN}'},
        json={
            'collection': collection,
            'filter_by': filter_by
        }
    )
    return response.json()

# Delete old documents
result = delete_by_query('symbols', 'status:=archived && archived_at:<1696896000')
if result:
    print(f"Deleted {result['result']['num_deleted']} documents")
```

---

## Best Practices

### 1. Preparing JSONL Files

```javascript
// Convert array of objects to JSONL
function arrayToJSONL(documents) {
  return documents.map(doc => JSON.stringify(doc)).join('\n');
}

// Add tenant field to all documents
function prepareBulkImport(documents, tenantId) {
  return documents.map(doc => ({
    ...doc,
    tenant: tenantId,
    updated_at: Date.now()
  }));
}

const documents = [
  { id: '1', title: 'Doc 1' },
  { id: '2', title: 'Doc 2' }
];

const prepared = prepareBulkImport(documents, 'tenant_123');
const jsonl = arrayToJSONL(prepared);
const blob = new Blob([jsonl], { type: 'application/x-ndjson' });
```

### 2. Handling Large Imports

```javascript
// Split large files into chunks
async function bulkImportLarge(documents, collection, chunkSize = 10000) {
  const results = [];

  for (let i = 0; i < documents.length; i += chunkSize) {
    const chunk = documents.slice(i, i + chunkSize);
    const jsonl = arrayToJSONL(chunk);
    const blob = new Blob([jsonl], { type: 'application/x-ndjson' });
    const file = new File([blob], `chunk_${i}.jsonl`);

    console.log(`Importing chunk ${i / chunkSize + 1}...`);
    const result = await bulkImport(file, collection);
    results.push(result);

    // Wait between chunks to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  const totalImported = results.reduce((sum, r) => sum + r.result.num_imported, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.result.num_errors, 0);

  return { totalImported, totalErrors, chunks: results };
}

// Import 100k documents in chunks of 10k
const result = await bulkImportLarge(largeDataset, 'symbols', 10000);
console.log(`Total imported: ${result.totalImported}`);
console.log(`Total errors: ${result.totalErrors}`);
```

### 3. Error Handling

```javascript
async function safeBulkImport(file, collection) {
  try {
    const result = await bulkImport(file, collection);

    if (result.result.num_errors > 0) {
      console.warn(`Import completed with ${result.result.num_errors} errors`);

      // Log errors
      result.result.errors.forEach(error => {
        console.error(`Line ${error.line}: ${error.error}`);
      });

      // Retry failed documents
      const failedLines = result.result.errors.map(e => e.line);
      // ... retry logic
    }

    return result;
  } catch (error) {
    console.error('Bulk import failed:', error);

    // Fallback to single document imports
    console.log('Falling back to single document import...');
    // ... fallback logic
  }
}
```

### 4. Validation Before Import

```javascript
function validateJSONL(jsonlContent) {
  const lines = jsonlContent.split('\n').filter(line => line.trim());
  const errors = [];

  lines.forEach((line, index) => {
    try {
      const doc = JSON.parse(line);

      // Check required fields
      if (!doc.id) {
        errors.push({ line: index + 1, error: 'Missing id field' });
      }
      if (!doc.title) {
        errors.push({ line: index + 1, error: 'Missing title field' });
      }

      // Validate field types
      if (doc.price && typeof doc.price !== 'number') {
        errors.push({ line: index + 1, error: 'Price must be a number' });
      }
    } catch (e) {
      errors.push({ line: index + 1, error: `Invalid JSON: ${e.message}` });
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    totalLines: lines.length
  };
}

// Validate before import
const fileContent = await file.text();
const validation = validateJSONL(fileContent);

if (!validation.valid) {
  console.error('Validation failed:', validation.errors);
  return;
}

await bulkImport(file, 'symbols');
```

### 5. Progress Tracking

```javascript
async function bulkImportWithProgress(file, collection, onProgress) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('collection', collection);

  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percent = (e.loaded / e.total) * 100;
        onProgress({ phase: 'upload', percent });
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    });

    xhr.open('POST', 'https://api.aacsearch.com/api/bulk/import');
    xhr.setRequestHeader('Authorization', `Bearer ${JWT_TOKEN}`);
    xhr.send(formData);
  });
}

// Usage with progress bar
await bulkImportWithProgress(file, 'symbols', ({ phase, percent }) => {
  console.log(`${phase}: ${percent.toFixed(2)}%`);
  progressBar.style.width = `${percent}%`;
});
```

## Performance Tips

### 1. Optimize JSONL Files

- Удалите ненужные поля перед импортом
- Используйте сжатие (gzip) для больших файлов
- Минифицируйте JSON (без пробелов и переносов)

### 2. Batch Size

Оптимальный размер batch:

| Размер документа | Batch Size |
|------------------|------------|
| Small (<1KB) | 10,000 |
| Medium (1-10KB) | 5,000 |
| Large (>10KB) | 1,000 |

### 3. Parallel Processing

```javascript
async function parallelBulkImport(files, collection, concurrency = 3) {
  const queue = [...files];
  const results = [];
  const active = new Set();

  while (queue.length > 0 || active.size > 0) {
    // Start new imports up to concurrency limit
    while (active.size < concurrency && queue.length > 0) {
      const file = queue.shift();
      const promise = bulkImport(file, collection)
        .then(result => {
          results.push(result);
          active.delete(promise);
        });
      active.add(promise);
    }

    // Wait for at least one to complete
    if (active.size > 0) {
      await Promise.race(active);
    }
  }

  return results;
}
```

## Rate Limits

| Plan | Max File Size | Max Documents/Import | Imports/Hour |
|------|---------------|----------------------|--------------|
| Free | 10 MB | 10,000 | 5 |
| Starter | 50 MB | 50,000 | 20 |
| Professional | 100 MB | 100,000 | 100 |
| Enterprise | Custom | Custom | Custom |

## Error Codes

### 400 Bad Request

```json
{
  "error": "Invalid collection",
  "allowed": ["symbols", "pages", "symbol_collections"]
}
```

### 413 Payload Too Large

```json
{
  "error": "File too large",
  "max_size": "100MB",
  "your_size": "150MB"
}
```

### 422 Unprocessable Entity

```json
{
  "error": "Invalid JSONL format",
  "line": 145,
  "message": "Expected JSON object, got string"
}
```

## Дополнительные ресурсы

- [JSONL Format Specification](https://jsonlines.org/)
- [Data Migration Guide](/docs/guides/data-migration)
- [Collections API](/docs/api-reference/collections-api)
- [Typesense Import Documentation](https://typesense.org/docs/latest/api/documents.html#import-a-jsonl-file)
