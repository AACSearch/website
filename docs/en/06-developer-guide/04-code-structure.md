# Структура кодовой базы

Детальное описание архитектуры и организации кода платформы AACSearch.

## Обзор

```
platform/
├── src/                    # Исходный код
│   ├── collections/        # 32 коллекции PayloadCMS
│   ├── endpoints/          # 33+ API endpoints
│   ├── integrations/       # 13 интеграций
│   ├── jobs/              # 10 cron jobs
│   ├── lib/               # 36+ утилит
│   ├── components/        # React компоненты
│   ├── hooks/             # Custom hooks
│   ├── fields/            # Custom fields
│   ├── blocks/            # Content blocks
│   └── typesense/         # Typesense integration
├── docs/                  # Документация
├── tests/                 # Тесты
└── scripts/               # Скрипты утилит
```

**Статистика**: ~265 TypeScript файлов, ~50,000+ строк кода

---

## Collections (`src/collections/`)

Все коллекции PayloadCMS с детальным описанием.

### Core Collections

#### 1. **Users.ts** - Пользователи системы
```typescript
slug: 'users'
auth: true
admin: { useAsTitle: 'email' }

Fields:
- email: string (unique, required)
- password: string (required, hashed)
- role: 'platform:admin' | 'admin' | 'editor' | 'user'
- tenant: relationship → tenants
- firstName: string
- lastName: string
- avatar: relationship → media
- lastLogin: date
- isActive: boolean

Hooks:
- beforeChange: hashPassword, validateRole
- afterLogin: updateLastLogin

Access Control:
- read: authenticated users
- update: self or admins
- delete: platform admins only
```

#### 2. **Tenants.ts** - Мультитенантность
```typescript
slug: 'tenants'

Fields:
- name: string (required, unique)
- slug: string (auto-generated, unique)
- domain: string (custom domain)
- settings: json (tenant-specific config)
- subscription: relationship → subscriptions
- owner: relationship → users
- members: relationship[] → users
- status: 'active' | 'suspended' | 'trial'
- metadata: json

Hooks:
- beforeChange: autoSlug, validateDomain
- afterCreate: setupTypesenseCollections

Access Control:
- read: tenant members
- update: tenant admins
- delete: platform admins only
```

#### 3. **Symbols.ts** - Основная searchable коллекция
```typescript
slug: 'symbols'

Fields:
- name: string (required, searchable)
- slug: string (unique, indexed)
- description: richText (searchable)
- category: relationship → categories
- tags: string[] (searchable)
- metadata: json
- tenant: relationship → tenants (required)
- collection: relationship → symbol_collections
- status: 'published' | 'draft' | 'archived'
- visibility: 'public' | 'private' | 'internal'
- searchPriority: number (1-10, default: 5)

Hooks:
- beforeChange: autoSlug, validateTenant
- afterChange: syncToTypesense
- afterDelete: removeFromTypesense

Access Control:
- read: public (if visibility=public), tenant members
- create/update: editors+
- delete: admins only
```

#### 4. **Categories.ts** - Категории символов
```typescript
slug: 'categories'

Fields:
- name: string (required)
- slug: string (auto-generated)
- parent: relationship → categories (self-referencing)
- description: text
- icon: string (icon class or URL)
- color: string (hex color)
- order: number
- tenant: relationship → tenants

Hooks:
- beforeChange: autoSlug, preventCircularReference

Access Control:
- read: public
- create/update: editors+
```

### Search & Analytics Collections

#### 5. **SearchAnalytics.ts**
```typescript
slug: 'search_analytics'

Fields:
- query: string (required, indexed)
- results: number (results count)
- clickedResult: relationship → symbols
- clickPosition: number
- userId: relationship → users
- sessionId: string (indexed)
- timestamp: date (required, indexed)
- tenant: relationship → tenants
- metadata: json (browser, IP, etc.)

Indexes:
- compound: [tenant, timestamp]
- compound: [query, tenant]

Hooks:
- afterCreate: aggregateMetrics
```

#### 6. **SearchPresets.ts**
```typescript
slug: 'search_presets'

Fields:
- name: string (required)
- query: json (search params)
- filters: json
- sorting: json
- tenant: relationship → tenants
- isPublic: boolean
- createdBy: relationship → users

Access Control:
- read: tenant members (if public) or owner
- update/delete: owner only
```

#### 7. **SearchSuggestions.ts**
```typescript
slug: 'search_suggestions'

Fields:
- text: string (required, indexed)
- count: number (usage count)
- tenant: relationship → tenants
- lastUsed: date

Hooks:
- afterCreate: updateCount
```

### Typesense Collections

#### 8. **TS_Synonyms.ts**
```typescript
slug: 'ts_synonyms'

Fields:
- synonyms: string[] (required, min 2 terms)
- tenant: relationship → tenants
- enabled: boolean

Hooks:
- afterChange: syncToTypesense
```

#### 9. **TS_Stopwords.ts**
```typescript
slug: 'ts_stopwords'

Fields:
- words: string[] (required)
- language: string (ISO code)
- tenant: relationship → tenants

Hooks:
- afterChange: syncToTypesense
```

#### 10. **TS_Overrides.ts**
```typescript
slug: 'ts_overrides'

Fields:
- rule_id: string (unique)
- match: json (match condition)
- includes: json[] (force include documents)
- excludes: json[] (force exclude documents)
- tenant: relationship → tenants
- enabled: boolean

Hooks:
- afterChange: syncToTypesense
```

### Integration Collections

#### 11. **IntegrationConfigs.ts**
```typescript
slug: 'integration_configs'

Fields:
- provider: select (wordpress, shopify, etc.)
- name: string (required)
- credentials: json (encrypted)
- settings: json
- enabled: boolean
- lastSyncAt: date
- lastSyncStatus: 'success' | 'failed' | 'pending'
- tenant: relationship → tenants

Hooks:
- beforeChange: encryptCredentials
- afterRead: decryptCredentials

Access Control:
- read: admins only (credentials hidden)
- update: admins only
```

#### 12. **ResourceMappings.ts**
```typescript
slug: 'resource_mappings'

Fields:
- externalId: string (required, indexed)
- externalType: string (required)
- internalId: string (required)
- internalCollection: string (required)
- provider: select (integration provider)
- tenant: relationship → tenants
- metadata: json

Indexes:
- compound: [externalId, provider, tenant]
- compound: [internalId, internalCollection]

Access Control:
- read/write: system only
```

### Billing & Subscription Collections

#### 13. **Plans.ts**
```typescript
slug: 'plans'

Fields:
- name: string (required)
- slug: string (unique)
- price: number (cents)
- currency: string (USD, EUR, etc.)
- interval: 'month' | 'year'
- features: json (feature flags)
- limits: json (usage limits)
- stripePriceId: string

Access Control:
- read: public
- update: platform admins only
```

#### 14. **Subscriptions.ts**
```typescript
slug: 'subscriptions'

Fields:
- tenant: relationship → tenants (required, unique)
- plan: relationship → plans (required)
- status: 'active' | 'canceled' | 'past_due' | 'trialing'
- currentPeriodStart: date
- currentPeriodEnd: date
- stripeSubscriptionId: string (unique)
- stripeCustomerId: string

Hooks:
- afterChange: updateTenantLimits
```

#### 15. **Invoices.ts**
```typescript
slug: 'invoices'

Fields:
- subscription: relationship → subscriptions
- amount: number (cents)
- currency: string
- status: 'draft' | 'open' | 'paid' | 'void'
- invoiceNumber: string (unique)
- invoiceDate: date
- dueDate: date
- paidAt: date
- stripeInvoiceId: string

Access Control:
- read: tenant admins
- update: system only
```

#### 16. **UsageCounters.ts**
```typescript
slug: 'usage_counters'

Fields:
- tenant: relationship → tenants (required, indexed)
- metric: string (searches, api_calls, storage, etc.)
- count: number
- period: string (YYYY-MM)
- limit: number
- exceeded: boolean

Indexes:
- compound: [tenant, metric, period]

Hooks:
- beforeChange: checkLimit
```

#### 17. **BillingEvents.ts**
```typescript
slug: 'billing_events'

Fields:
- tenant: relationship → tenants
- eventType: string (subscription.created, invoice.paid, etc.)
- data: json
- timestamp: date

Access Control:
- read: platform admins
- create: system only (webhook handler)
```

### API & Security Collections

#### 18. **APIKeys.ts**
```typescript
slug: 'api_keys'

Fields:
- name: string (required)
- key: string (hashed, unique, indexed)
- prefix: string (visible prefix, e.g., "pk_live_...")
- tenant: relationship → tenants
- permissions: string[] (scopes)
- rateLimitTier: number (requests per minute)
- expiresAt: date
- lastUsedAt: date
- createdBy: relationship → users

Hooks:
- beforeCreate: generateKey, hashKey
- afterRead: hideKey (show prefix only)

Access Control:
- read: tenant admins (key hidden)
- create: tenant admins
- delete: tenant admins or key owner
```

#### 19. **ScopedKeyUsage.ts**
```typescript
slug: 'scoped_key_usage'

Fields:
- apiKey: relationship → api_keys
- endpoint: string
- count: number
- timestamp: date (hour precision)

Indexes:
- compound: [apiKey, timestamp]
```

### Content Collections

#### 20. **ContentPages.ts**
```typescript
slug: 'content_pages'

Fields:
- title: string (required)
- slug: string (auto-generated, unique)
- content: richText (Lexical)
- excerpt: text
- author: relationship → users
- publishedAt: date
- status: 'draft' | 'published'
- tenant: relationship → tenants

Hooks:
- beforeChange: autoSlug
- afterChange: revalidateCache
```

#### 21. **Media.ts**
```typescript
slug: 'media'
upload: true

Fields:
- filename: string (auto)
- mimeType: string (auto)
- filesize: number (auto)
- width: number (images only)
- height: number (images only)
- alt: string
- caption: text
- tenant: relationship → tenants
- externalId: string (for synced media)
- externalProvider: string

Hooks:
- beforeChange: optimizeImage, generateThumbnails
```

### AI & NLP Collections

#### 22. **NLSearchModels.ts**
```typescript
slug: 'nl_search_models'

Fields:
- name: string (required)
- modelId: string (OpenAI model ID)
- provider: 'openai' | 'anthropic' | 'cohere'
- config: json (temperature, max_tokens, etc.)
- tenant: relationship → tenants
- enabled: boolean

Access Control:
- read/update: admins only
```

#### 23. **ConversationModels.ts**
```typescript
slug: 'conversation_models'

Fields:
- name: string (required)
- systemPrompt: text
- model: relationship → nl_search_models
- tenant: relationship → tenants
- settings: json

Access Control:
- read/update: admins only
```

#### 24. **ConversationStore.ts**
```typescript
slug: 'conversation_store'

Fields:
- conversationId: string (UUID, indexed)
- userId: relationship → users
- messages: json[] (history)
- tenant: relationship → tenants
- createdAt: date
- updatedAt: date

Hooks:
- beforeChange: limitHistory (max 100 messages)
```

### Wizard Collections

#### 25. **WizardConfigs.ts**
```typescript
slug: 'wizard_configs'

Fields:
- name: string (required)
- steps: json[] (wizard steps config)
- tenant: relationship → tenants
- enabled: boolean

Access Control:
- read/update: admins only
```

#### 26. **SymbolCollections.ts**
```typescript
slug: 'symbol_collections'

Fields:
- name: string (required)
- description: text
- symbols: relationship[] → symbols
- tenant: relationship → tenants
- visibility: 'public' | 'private'
- owner: relationship → users

Access Control:
- read: tenant members (if public) or owner
- update: owner or admins
```

### Membership & Permissions

#### 27. **Memberships.ts**
```typescript
slug: 'memberships'

Fields:
- user: relationship → users (required)
- tenant: relationship → tenants (required)
- role: 'admin' | 'editor' | 'viewer'
- permissions: string[] (custom permissions)
- invitedBy: relationship → users
- invitedAt: date
- acceptedAt: date
- status: 'pending' | 'active' | 'suspended'

Indexes:
- compound: [user, tenant] (unique)

Access Control:
- read: tenant members
- create: tenant admins
- update: tenant admins
- delete: tenant admins or self
```

---

## Endpoints (`src/endpoints/`)

Все 33+ custom API endpoints.

### Search Endpoints

#### 1. **search.ts** - Основной поиск
```typescript
Path: /api/search
Method: GET
Query Params:
  - q: string (required)
  - collection: string (default: 'symbols')
  - filters: json
  - page: number (default: 1)
  - limit: number (default: 20, max: 100)

Response:
{
  hits: SearchResult[]
  found: number
  page: number
  facets: Record<string, Facet[]>
  search_time_ms: number
}

Authentication: API key or user session
Rate Limit: 100 req/min (tier-based)
```

#### 2. **publicSearch.ts** - Публичный поиск
```typescript
Path: /api/public-search
Method: GET
Query Params: (same as search)

Response: (same as search)

Authentication: None (public access)
Rate Limit: 20 req/min per IP
```

#### 3. **nlSearch.ts** - Natural Language поиск
```typescript
Path: /api/nl-search
Method: POST
Body:
{
  query: string (natural language query)
  collection: string
  context?: string (additional context)
}

Response:
{
  interpretation: string (interpreted query)
  results: SearchResult[]
  suggestions: string[] (alternative queries)
}

Authentication: API key required
Rate Limit: 20 req/min
```

#### 4. **conversationalSearch.ts**
```typescript
Path: /api/conversational-search
Method: POST
Body:
{
  message: string
  conversationId?: string (for continuing conversation)
  model?: string (conversation model)
}

Response:
{
  reply: string
  results: SearchResult[]
  conversationId: string
  followUpQuestions: string[]
}

Authentication: User session required
Rate Limit: 10 req/min
```

#### 5. **vectorSearch.ts**
```typescript
Path: /api/vector-search
Method: POST
Body:
{
  vector: number[] (embedding vector)
  k: number (top-k results, default: 10)
  collection: string
}

Response:
{
  results: SearchResult[]
  distances: number[]
}

Authentication: API key required
```

#### 6. **imageSearch.ts**
```typescript
Path: /api/image-search
Method: POST
Body: FormData
  - image: File (or URL)
  - collection: string

Response:
{
  results: SearchResult[] (similar images)
  embedding: number[] (image embedding)
}

Authentication: API key required
Rate Limit: 10 req/min
```

#### 7. **geoSearch.ts**
```typescript
Path: /api/geo-search
Method: GET
Query Params:
  - lat: number (latitude)
  - lon: number (longitude)
  - radius: number (meters, default: 5000)
  - collection: string

Response:
{
  results: SearchResult[]
  distances: number[] (in meters)
}

Authentication: API key required
```

#### 8. **voiceSearch.ts**
```typescript
Path: /api/voice-search
Method: POST
Body: FormData
  - audio: File (wav, mp3, etc.)

Response:
{
  transcript: string
  results: SearchResult[]
  confidence: number
}

Authentication: User session required
```

#### 9. **multiSearch.ts**
```typescript
Path: /api/multi-search
Method: POST
Body:
{
  searches: Array<{
    collection: string
    q: string
    filters?: json
  }>
}

Response:
{
  results: Record<string, SearchResult[]>
}

Authentication: API key required
```

#### 10. **joinSearch.ts**
```typescript
Path: /api/join-search
Method: POST
Body:
{
  collection: string
  q: string
  join: {
    collection: string
    on: string (field name)
  }
}

Response:
{
  results: SearchResult[] (with joined data)
}

Authentication: API key required
```

#### 11. **collectionSearch.ts**
```typescript
Path: /api/collections/:slug/search
Method: GET

Response: (collection-specific search)
```

#### 12. **collectionAdvancedSearch.ts**
```typescript
Path: /api/collections/:slug/advanced-search
Method: POST
Body:
{
  query_by: string[]
  filter_by: string
  sort_by: string
  facet_by: string[]
  max_facet_values: number
  per_page: number
}

Response: (Typesense-compatible response)
```

### Suggestions & Analytics

#### 13. **suggestions.ts**
```typescript
Path: /api/suggestions
Method: GET
Query Params:
  - q: string (partial query)
  - limit: number (default: 10)

Response:
{
  suggestions: string[]
}

Rate Limit: 60 req/min
```

#### 14. **analytics.ts**
```typescript
Path: /api/analytics
Method: GET/POST

GET /api/analytics?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
Response:
{
  topQueries: Array<{ query: string, count: number }>
  noResultsQueries: string[]
  clickThroughRate: number
  averagePosition: number
}

POST /api/analytics (track event)
Body:
{
  event: string
  data: json
}
```

#### 15. **dashboardStats.ts**
```typescript
Path: /api/dashboard/stats
Method: GET

Response:
{
  totalSearches: number
  totalDocuments: number
  averageLatency: number
  topCollections: Array<{ name: string, count: number }>
  recentActivity: Activity[]
}

Authentication: User session required
```

### API Key Management

#### 16. **apiKeys.ts**
```typescript
Path: /api/api-keys
Method: GET/POST/DELETE

GET: List all API keys for tenant
POST: Create new API key
DELETE /:id: Revoke API key

Authentication: Tenant admin required
```

#### 17. **scopedKeys.ts**
```typescript
Path: /api/scoped-keys
Method: POST
Body:
{
  scopes: string[]
  expiresIn: number (seconds)
}

Response:
{
  key: string (temporary scoped key)
  expiresAt: date
}

Authentication: API key required
```

### Search Configuration

#### 18. **searchPresets.ts**
```typescript
Path: /api/search-presets
Method: GET/POST/PUT/DELETE

CRUD operations for search presets
```

#### 19. **nlSearchModels.ts**
```typescript
Path: /api/nl-search-models
Method: GET/POST/PUT/DELETE

CRUD operations for NL search models
Authentication: Admin only
```

### Bulk Operations

#### 20. **bulkOperations.ts**
```typescript
Path: /api/bulk
Method: POST
Body:
{
  operation: 'index' | 'delete' | 'update'
  collection: string
  documents: json[]
}

Response:
{
  success: number
  failed: number
  errors: Array<{ id: string, error: string }>
}

Authentication: API key required
Rate Limit: 10 req/min
```

### Integration Webhooks

#### 21. **integrationWebhooks.ts**
```typescript
Path: /api/webhooks/:provider
Method: POST

Handles webhooks from external integrations
(WordPress, Shopify, etc.)

Authentication: Signature validation
```

### Billing

#### 22. **billingCheckout.ts**
```typescript
Path: /api/billing/checkout
Method: POST
Body:
{
  planId: string
  successUrl: string
  cancelUrl: string
}

Response:
{
  sessionId: string (Stripe checkout session)
  url: string (checkout URL)
}

Authentication: User session required
```

#### 23. **billingStatus.ts**
```typescript
Path: /api/billing/status
Method: GET

Response:
{
  subscription: Subscription
  usage: UsageCounter[]
  nextBillingDate: date
}

Authentication: Tenant admin required
```

#### 24. **billingInvoices.ts**
```typescript
Path: /api/billing/invoices
Method: GET

Response:
{
  invoices: Invoice[]
}

Authentication: Tenant admin required
```

#### 25. **stripeWebhook.ts**
```typescript
Path: /api/webhooks/stripe
Method: POST

Handles Stripe webhook events:
- invoice.paid
- subscription.created
- subscription.updated
- subscription.deleted
- payment_intent.succeeded

Authentication: Stripe signature validation
```

### Jobs Management

#### 26. **jobs.ts**
```typescript
Path: /api/jobs
Method: GET/POST

GET: List all jobs and their status
POST /jobs/:slug/trigger: Manually trigger job

Authentication: Platform admin required
```

### Wizard

#### 27. **wizard.ts**
```typescript
Path: /api/wizard
Method: GET/POST/PUT

GET /api/wizard/:id: Get wizard config
POST /api/wizard/:id/step: Submit wizard step
PUT /api/wizard/:id/complete: Complete wizard

Authentication: User session required
```

### Collection Builder

#### 28. **collectionBuilder.ts**
```typescript
Path: /api/collection-builder
Method: POST
Body:
{
  name: string
  schema: json (field definitions)
}

Response:
{
  collectionId: string
  typesenseCollection: string
}

Authentication: Admin required
```

### Health & System

#### 29. **health.ts**
```typescript
Path: /api/health
Method: GET

Response:
{
  status: 'healthy' | 'degraded' | 'down'
  services: {
    database: 'up' | 'down'
    typesense: 'up' | 'down'
    redis: 'up' | 'down'
  }
  uptime: number (seconds)
}

Authentication: None (public)
```

---

## Integrations (`src/integrations/`)

### Base Classes

```
src/integrations/base/
├── connector.ts          # BaseConnector abstract class
├── types.ts              # Shared types
├── AuthManager.ts        # Authentication handling
├── RetryHandler.ts       # Retry logic with backoff
├── RateLimiter.ts        # Rate limiting
├── ThrottleManager.ts    # Request throttling
├── DataNormalizer.ts     # Data normalization
└── ConflictResolver.ts   # Conflict resolution
```

### Provider Implementations

1. **WordPress** (`src/integrations/wordpress/`)
```typescript
- connector.ts: WordPressConnector extends BaseConnector
- Supports: Posts, Pages, Media, Categories
- Auth: Basic Auth, JWT, Application Passwords
```

2. **Shopify** (`src/integrations/shopify/`)
```typescript
- connector.ts: ShopifyConnector
- Supports: Products, Collections, Orders
- Auth: OAuth2, API keys
```

3. **WooCommerce** (`src/integrations/woocommerce/`)
```typescript
- connector.ts: WooCommerceConnector
- Supports: Products, Orders, Categories
- Auth: Consumer key/secret
```

4. **Webflow** (`src/integrations/webflow/`)
```typescript
- connector.ts: WebflowConnector
- Supports: CMS items, Collections
- Auth: OAuth2
```

5. **Contentful** (`src/integrations/contentful/`)
```typescript
- connector.ts: ContentfulConnector
- Supports: Entries, Assets
- Auth: Access tokens
```

6. **Magento** (`src/integrations/magento/`)
```typescript
- connector.ts: MagentoConnector
- Supports: Products, Categories
- Auth: OAuth2
```

7. **BigCommerce** (`src/integrations/bigcommerce/`)
```typescript
- connector.ts: BigCommerceConnector
- Supports: Products, Categories, Brands
- Auth: OAuth2, API tokens
```

8. **Ghost** (`src/integrations/ghost/`)
```typescript
- connector.ts: GhostConnector
- Supports: Posts, Pages, Tags
- Auth: Admin API key
```

9. **Sanity** (`src/integrations/sanity/`)
```typescript
- connector.ts: SanityConnector
- Supports: Documents
- Auth: Token
```

10. **Strapi** (`src/integrations/strapi/`)
```typescript
- connector.ts: StrapiConnector
- Supports: Content types
- Auth: JWT, API tokens
```

11. **Notion** (`src/integrations/notion/`)
```typescript
- connector.ts: NotionConnector
- Supports: Pages, Databases
- Auth: OAuth2, Integration tokens
```

12. **PrestaShop** (`src/integrations/prestashop/`)
```typescript
- connector.ts: PrestaShopConnector
- Supports: Products, Categories
- Auth: API key
```

13. **Airtable** (`src/integrations/airtable/`)
```typescript
- connector.ts: AirtableConnector
- Supports: Tables, Records
- Auth: Personal access token
```

---

## Jobs (`src/jobs/`)

Все 10 scheduled jobs с подробным описанием.

### 1. **reindexJob.ts** - Полная переиндексация
```typescript
Schedule: Daily at 2:00 AM
Queue: 'nightly'
Retries: 2

Функции:
- Получает все документы из Payload
- Пересоздает Typesense collections
- Индексирует все документы
- Обновляет aliases

Параллелизм: 5 коллекций одновременно
```

### 2. **analyticsAggregationJob.ts**
```typescript
Schedule: Daily at 2:00 AM
Queue: 'nightly'

Функции:
- Агрегирует search_analytics за день
- Вычисляет топ запросы
- Вычисляет CTR (click-through rate)
- Создает сводные отчеты
```

### 3. **dictionaryUpdateJob.ts**
```typescript
Schedule: Weekly (Sunday at 3:00 AM)
Queue: 'weekly'

Функции:
- Анализирует no-result queries
- Генерирует кандидаты на синонимы
- Обновляет словари Typesense
- Уведомляет админов о новых кандидатах
```

### 4. **webhookRetryJob.ts**
```typescript
Schedule: Every 15 minutes
Queue: 'frequent'

Функции:
- Обрабатывает failed webhook deliveries
- Retry с exponential backoff
- Dead letter queue для постоянных failure
```

### 5. **snapshotJob.ts**
```typescript
Schedule: Daily at 1:00 AM
Queue: 'nightly'

Функции:
- Создает snapshot Typesense collections
- Backup базы данных
- Сохраняет в S3/storage
- Rotates old snapshots (keep last 7 days)
```

### 6. **dataSanitationJob.ts**
```typescript
Schedule: Weekly (Sunday at 4:00 AM)
Queue: 'weekly'

Функции:
- Удаляет stale locks
- Очищает broken references
- Удаляет дубликаты
- Оптимизирует индексы
```

### 7. **gdprCleanupJob.ts**
```typescript
Schedule: Daily at 5:00 AM
Queue: 'nightly'

Функции:
- Обрабатывает GDPR deletion requests
- Анонимизирует user data
- Удаляет expired data
- Генерирует compliance reports
```

### 8. **keyRotationJob.ts**
```typescript
Schedule: Monthly (1st at 00:00 AM)
Queue: 'monthly'

Функции:
- Ротирует API keys (по истечению срока)
- Обновляет encryption keys
- Уведомляет пользователей
- Revokes expired keys
```

### 9. **ecommerceSyncJob.ts**
```typescript
Schedule: Every 5 minutes
Queue: 'frequent'

Функции:
- Синхронизирует продукты из e-commerce
- Обновляет stock levels
- Обновляет prices
- Batch processing (100 items/batch)
```

### 10. **integrationSyncJob.ts**
```typescript
Schedule: Every 15 minutes
Queue: 'frequent'

Функции:
- Синхронизирует данные из integrations
- Incremental sync (только изменения)
- Error handling и logging
- Updates resource mappings
```

---

## Lib (`src/lib/`)

36+ утилит и helper functions.

### Core Search Libraries

#### 1. **typesense-api-complete.ts** - Полный Typesense API wrapper
```typescript
Functions:
- getTypesenseClient(): Client
- createCollection(schema: CollectionSchema): Promise<void>
- indexDocument(collection: string, doc: object): Promise<void>
- search(params: SearchParams): Promise<SearchResponse>
- deleteCollection(name: string): Promise<void>
```

#### 2. **search-config-generator.ts** - Генератор search конфигов
```typescript
Functions:
- generateSearchParams(query: string, options: SearchOptions): TypesenseSearchParams
- buildFilterQuery(filters: Record<string, unknown>): string
- buildSortQuery(sort: SortOptions): string
```

#### 3. **nl-search.ts** - Natural language search
```typescript
Functions:
- parseNaturalQuery(query: string): ParsedQuery
- extractIntent(query: string): Intent
- generateSearchQuery(intent: Intent): SearchParams
```

#### 4. **vector-search.ts** - Vector/semantic search
```typescript
Functions:
- generateEmbedding(text: string): Promise<number[]>
- vectorSearch(embedding: number[], collection: string): Promise<SearchResult[]>
```

#### 5. **image-search.ts** - Image search
```typescript
Functions:
- generateImageEmbedding(image: Buffer): Promise<number[]>
- findSimilarImages(embedding: number[], k: number): Promise<SearchResult[]>
```

#### 6. **voice-search.ts** - Voice search
```typescript
Functions:
- transcribeAudio(audio: Buffer): Promise<string>
- voiceSearch(audio: Buffer): Promise<SearchResult[]>
```

#### 7. **geo-search.ts** - Geographic search
```typescript
Functions:
- geoSearch(lat: number, lon: number, radius: number): Promise<SearchResult[]>
- calculateDistance(point1: GeoPoint, point2: GeoPoint): number
```

#### 8. **multi-search.ts** - Multi-collection search
```typescript
Functions:
- multiSearch(searches: SearchRequest[]): Promise<Record<string, SearchResult[]>>
```

#### 9. **advanced-search-features.ts** - Advanced features
```typescript
Functions:
- facetedSearch(params: FacetParams): Promise<FacetedResults>
- groupedSearch(params: GroupParams): Promise<GroupedResults>
- geographicSearch(params: GeoParams): Promise<GeoResults>
```

### Typesense Utilities

#### 10. **typesense-collection-manager.ts**
```typescript
Functions:
- createOrUpdateCollection(schema: CollectionSchema): Promise<void>
- deleteCollection(name: string, skipMissing?: boolean): Promise<void>
- listCollections(): Promise<CollectionResponse[]>
- getCollectionInfo(name: string): Promise<CollectionSchema>
```

#### 11. **typesense-alias.ts**
```typescript
Functions:
- createAlias(alias: string, collection: string): Promise<void>
- updateAlias(alias: string, collection: string): Promise<void>
- deleteAlias(alias: string): Promise<void>
```

#### 12. **typesense-analytics.ts**
```typescript
Functions:
- createAnalyticsRule(rule: AnalyticsRule): Promise<void>
- updateAnalyticsRule(name: string, rule: AnalyticsRule): Promise<void>
- getAnalyticsRules(): Promise<AnalyticsRule[]>
```

#### 13. **typesense-joins.ts**
```typescript
Functions:
- performJoin(params: JoinParams): Promise<JoinedResults>
```

#### 14. **typesense-geo-search.ts**
```typescript
Functions:
- setupGeoField(collection: string, field: string): Promise<void>
- geoRadiusSearch(params: GeoRadiusParams): Promise<SearchResult[]>
```

#### 15. **typesense-nl-search.ts**
```typescript
Functions:
- setupNLSearchModel(model: NLSearchModel): Promise<void>
- nlSearch(query: string, collection: string): Promise<SearchResult[]>
```

### Business Logic

#### 16. **dual-write.ts** - Dual write strategy
```typescript
Functions:
- dualWrite(collection: string, doc: object): Promise<void>
- ensureConsistency(collection: string): Promise<void>
```

#### 17. **backfill.ts** - Data backfilling
```typescript
Functions:
- backfillCollection(collection: string): Promise<BackfillResult>
- backfillTenant(tenantId: string): Promise<BackfillResult>
```

#### 18. **backfill-service.ts**
```typescript
Class: BackfillService
Methods:
- start(): Promise<void>
- stop(): void
- getProgress(): BackfillProgress
```

#### 19. **bulk-operations.ts**
```typescript
Functions:
- bulkIndex(collection: string, docs: object[]): Promise<BulkResult>
- bulkDelete(collection: string, ids: string[]): Promise<BulkResult>
- bulkUpdate(collection: string, updates: UpdateOp[]): Promise<BulkResult>
```

#### 20. **presets.ts**
```typescript
Functions:
- savePreset(preset: SearchPreset): Promise<string>
- getPreset(id: string): Promise<SearchPreset>
- applyPreset(id: string, query?: string): Promise<SearchResult[]>
```

#### 21. **query-suggestions.ts**
```typescript
Functions:
- getSuggestions(partial: string): Promise<string[]>
- recordSuggestion(query: string): Promise<void>
```

### Utility Functions

#### 22. **cache.ts** - Caching layer
```typescript
Functions:
- get<T>(key: string): Promise<T | null>
- set<T>(key: string, value: T, ttl?: number): Promise<void>
- del(key: string): Promise<void>
- clear(pattern?: string): Promise<void>
```

#### 23. **rate-limiter.ts**
```typescript
Class: RateLimiter
Methods:
- checkLimit(key: string): Promise<boolean>
- increment(key: string): Promise<number>
- reset(key: string): Promise<void>
```

#### 24. **usage-tracking.ts**
```typescript
Functions:
- trackUsage(tenantId: string, metric: string, count?: number): Promise<void>
- getUsage(tenantId: string, metric: string, period: string): Promise<UsageData>
- checkLimit(tenantId: string, metric: string): Promise<boolean>
```

#### 25. **scoped-keys.ts**
```typescript
Functions:
- generateScopedKey(scopes: string[], expiresIn: number): Promise<string>
- validateScopedKey(key: string, requiredScope: string): Promise<boolean>
```

#### 26. **get-user-tenant.ts**
```typescript
Functions:
- getUserTenant(userId: string): Promise<string | null>
- getTenantMembers(tenantId: string): Promise<User[]>
```

### Billing & Subscriptions

#### 27. **stripe.ts**
```typescript
Functions:
- createCheckoutSession(params: CheckoutParams): Promise<Session>
- createCustomer(email: string, metadata: object): Promise<Customer>
- createSubscription(customerId: string, priceId: string): Promise<Subscription>
- cancelSubscription(subscriptionId: string): Promise<Subscription>
```

#### 28. **subscription-utils.ts**
```typescript
Functions:
- getActiveSubscription(tenantId: string): Promise<Subscription | null>
- hasFeature(tenantId: string, feature: string): Promise<boolean>
- checkLimit(tenantId: string, resource: string): Promise<boolean>
```

### AI & Models

#### 29. **nl-search-models.ts**
```typescript
Functions:
- createModel(config: ModelConfig): Promise<string>
- updateModel(id: string, config: Partial<ModelConfig>): Promise<void>
- deleteModel(id: string): Promise<void>
- listModels(): Promise<NLSearchModel[]>
```

#### 30. **conversation-models.ts**
```typescript
Functions:
- createConversation(userId: string, model: string): Promise<string>
- addMessage(conversationId: string, message: Message): Promise<void>
- getConversation(conversationId: string): Promise<Conversation>
```

#### 31. **conversational-search.ts**
```typescript
Functions:
- chat(message: string, conversationId?: string): Promise<ChatResponse>
- search(message: string): Promise<SearchResult[]>
```

### Other Utilities

#### 32. **schema-generator.ts**
```typescript
Functions:
- generateTypesenseSchema(payloadCollection: CollectionConfig): CollectionSchema
- inferFieldType(field: Field): string
```

#### 33. **collection-dependencies.ts**
```typescript
Functions:
- getDependencies(collection: string): string[]
- getTopologicalOrder(collections: string[]): string[]
```

#### 34. **typesense-features-v29.ts**
```typescript
Functions:
- setupVectorSearch(collection: string): Promise<void>
- setupJoinFeatures(collection: string): Promise<void>
- setupAnalytics(collection: string): Promise<void>
```

#### 35. **typesense-types.ts**
```typescript
Types:
- CollectionSchema
- SearchParams
- SearchResponse
- FacetCounts
- GroupedHit
etc.
```

---

## Components (`src/components/`)

React компоненты для UI.

### Admin Components

```
src/components/
├── Dashboard/
│   ├── StatsCard.tsx
│   ├── RecentActivity.tsx
│   └── QuickActions.tsx
├── Search/
│   ├── SearchBar.tsx
│   ├── SearchResults.tsx
│   ├── Filters.tsx
│   └── Facets.tsx
├── Analytics/
│   ├── TopQueries.tsx
│   ├── ClickThroughRate.tsx
│   └── PerformanceChart.tsx
├── Settings/
│   ├── APIKeyManager.tsx
│   ├── IntegrationSettings.tsx
│   └── BillingSettings.tsx
└── Wizard/
    ├── WizardStep.tsx
    └── WizardProgress.tsx
```

---

## Patterns & Conventions

### Naming Conventions

1. **Files**: camelCase.ts (e.g., `typesenseClient.ts`)
2. **Components**: PascalCase.tsx (e.g., `SearchBar.tsx`)
3. **Collections**: PascalCase (e.g., `Symbols`, `APIKeys`)
4. **Endpoints**: kebab-case (e.g., `/api/search-presets`)
5. **Functions**: camelCase (e.g., `getUserTenant()`)
6. **Types**: PascalCase (e.g., `SearchResult`, `User`)
7. **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RESULTS`)

### Code Organization

```typescript
// 1. Imports
import type { Payload } from 'payload'
import type { User } from '@/payload-types'

// 2. Types/Interfaces
export interface MyFunctionParams {
  // ...
}

// 3. Constants
const MAX_RETRIES = 3

// 4. Helper functions (private)
function helperFunction() {
  // ...
}

// 5. Main exports
export async function mainFunction(params: MyFunctionParams) {
  // ...
}
```

### Error Handling

```typescript
try {
  // Operation
  const result = await someOperation()
  return result
} catch (error: unknown) {
  // Type-safe error handling
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'

  // Log error
  console.error('Operation failed:', errorMessage)

  // Return or throw
  throw new Error(`Failed to perform operation: ${errorMessage}`)
}
```

### Async/Await Patterns

```typescript
// ✅ Good: Parallel execution
const [users, tenants] = await Promise.all([
  payload.find({ collection: 'users' }),
  payload.find({ collection: 'tenants' }),
])

// ❌ Bad: Sequential execution
const users = await payload.find({ collection: 'users' })
const tenants = await payload.find({ collection: 'tenants' })
```

### TypeScript Strict Mode

```typescript
// Always use strict typing
function processUser(user: User): string {
  // Type guards
  if (!user || typeof user !== 'object') {
    throw new Error('Invalid user object')
  }

  // Null checks
  const name = user.firstName ?? 'Anonymous'

  return name
}
```

---

## Заключение

Кодовая база AACSearch организована следующим образом:

- **265+ TypeScript файлов** с строгой типизацией
- **32 коллекции** для различных сущностей
- **33+ API endpoints** для всех операций
- **13 интеграций** с внешними системами
- **10 scheduled jobs** для автоматизации
- **36+ утилит** для различных задач
- **PayloadCMS v3** в качестве headless CMS
- **Typesense** в качестве search engine
- **Multi-tenant architecture** с изоляцией данных

Следуйте conventions и patterns для поддержания консистентности кода!
