# Кастомные интеграции

Полное руководство по созданию собственных коннекторов для интеграции внешних источников данных с AACSearch.

## Содержание

- [Обзор системы интеграций](#обзор-системы-интеграций)
- [BaseConnector API](#baseconnector-api)
- [Пошаговое создание интеграции](#пошаговое-создание-интеграции)
- [Примеры коннекторов](#примеры-коннекторов)
- [Аутентификация](#аутентификация)
- [Обработка вебхуков](#обработка-вебхуков)
- [Best Practices](#best-practices)
- [Публикация в Marketplace](#публикация-в-marketplace)

---

## Обзор системы интеграций

AACSearch поддерживает интеграцию с различными внешними системами через универсальный интерфейс коннекторов.

### Архитектура

```
┌─────────────────────────────────────────────┐
│          External Services                  │
│  (WordPress, Shopify, Custom API, etc.)     │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│          Custom Connector                   │
│  - Authentication                           │
│  - Data Fetching                            │
│  - Field Mapping                            │
│  - Webhook Processing                       │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│          BaseConnector (Abstract)           │
│  - Sync Logic                               │
│  - Retry/Rate Limiting                      │
│  - Resource Mapping                         │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│          Payload CMS                        │
│  - Collections (symbols, categories, etc.)  │
│  - Resource Mappings                        │
└─────────────────────────────────────────────┘
```

### Поддерживаемые провайдеры

```typescript
type IntegrationProvider =
  | 'wordpress'      // WordPress REST API
  | 'webflow'        // Webflow CMS API
  | 'contentful'     // Contentful CMS
  | 'shopify'        // Shopify Admin API
  | 'woocommerce'    // WooCommerce REST API
  | 'magento'        // Magento 2 API
  | 'bigcommerce'    // BigCommerce API
  | 'ghost'          // Ghost Content API
  | 'sanity'         // Sanity.io API
  | 'strapi'         // Strapi CMS
  | 'notion'         // Notion API
  | 'prestashop'     // PrestaShop API
  | 'airtable'       // Airtable API
  | 'custom'         // Custom integration
```

---

## BaseConnector API

Базовый класс для всех интеграций. Все кастомные коннекторы должны наследоваться от `BaseConnector`.

### Интерфейс

```typescript
import type { Payload } from 'payload'
import type {
  IntegrationProvider,
  SyncContext,
  SyncResult,
  BatchSyncResult,
  WebhookPayload,
  WebhookValidation,
  CollectionSyncConfig,
} from './types'

abstract class BaseConnector {
  protected payload: Payload
  protected provider: IntegrationProvider
  protected tenantId: string
  protected credentials: Record<string, unknown>
  protected settings: Record<string, unknown>

  constructor(context: SyncContext)

  // ОБЯЗАТЕЛЬНЫЕ МЕТОДЫ (должны быть реализованы)

  /**
   * Тестирование подключения к внешнему сервису
   * @returns Promise с результатом проверки
   */
  abstract testConnection(): Promise<{
    success: boolean
    error?: string
  }>

  /**
   * Получение списка ресурсов (с пагинацией)
   * @param resourceType - Тип ресурса (posts, products, etc.)
   * @param options - Опции (page, limit, filters)
   */
  abstract fetchResources(
    resourceType: string,
    options?: {
      page?: number
      limit?: number
      filters?: Record<string, unknown>
    }
  ): Promise<{
    data: unknown[]
    hasMore: boolean
    total?: number
  }>

  /**
   * Получение одного ресурса по ID
   * @param resourceType - Тип ресурса
   * @param id - ID ресурса
   */
  abstract fetchResource(
    resourceType: string,
    id: string
  ): Promise<unknown>

  /**
   * Валидация вебхука от внешнего сервиса
   * @param payload - Данные вебхука
   * @param signature - Подпись (опционально)
   */
  abstract validateWebhook(
    payload: WebhookPayload,
    signature?: string
  ): WebhookValidation

  /**
   * Обработка события вебхука
   * @param payload - Данные вебхука
   * @param context - Контекст синхронизации
   */
  abstract processWebhook(
    payload: WebhookPayload,
    context: SyncContext
  ): Promise<SyncResult>

  /**
   * Извлечение ID из объекта ресурса
   * @param resource - Объект ресурса
   */
  protected abstract extractId(resource: unknown): string

  /**
   * Получение конфигурации синхронизации для типа ресурса
   * @param resourceType - Тип ресурса
   */
  protected abstract getSyncConfig(
    resourceType: string
  ): Promise<CollectionSyncConfig | null>

  // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ (уже реализованы)

  /**
   * Синхронизация одного ресурса
   * @param resourceType - Тип ресурса
   * @param externalId - ID во внешней системе
   * @param context - Контекст синхронизации
   */
  async syncResource(
    resourceType: string,
    externalId: string,
    context: SyncContext
  ): Promise<SyncResult>

  /**
   * Полная синхронизация всех ресурсов типа
   * @param resourceType - Тип ресурса
   * @param context - Контекст синхронизации
   */
  async syncAll(
    resourceType: string,
    context: SyncContext
  ): Promise<BatchSyncResult>

  /**
   * Трансформация данных с использованием field mappings
   * @param externalData - Данные из внешней системы
   * @param mappings - Маппинги полей
   * @param context - Контекст синхронизации
   */
  protected async transformData(
    externalData: unknown,
    mappings: FieldMapping[],
    context: SyncContext
  ): Promise<Record<string, unknown>>

  /**
   * Получение значения по вложенному пути (dot notation)
   */
  protected getNestedValue(obj: unknown, path: string): unknown

  /**
   * Установка значения по вложенному пути (dot notation)
   */
  protected setNestedValue(
    obj: Record<string, unknown>,
    path: string,
    value: unknown
  ): void

  /**
   * Получение маппинга ресурса из БД
   */
  protected async getResourceMapping(
    externalId: string,
    externalType: string
  ): Promise<ResourceMapping | null>

  /**
   * Создание маппинга ресурса в БД
   */
  protected async createResourceMapping(
    mapping: Omit<ResourceMapping, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<void>

  /**
   * Retry с экспоненциальной задержкой
   */
  protected async retryWithBackoff<T>(
    fn: () => Promise<T>,
    config: RetryConfig
  ): Promise<T>
}
```

### Типы данных

```typescript
// Контекст синхронизации
interface SyncContext {
  payload: Payload              // Payload CMS instance
  tenantId: string              // ID тенанта
  config: IntegrationConfig     // Конфигурация интеграции
  logger: {
    info: (message: string, meta?: unknown) => void
    warn: (message: string, meta?: unknown) => void
    error: (message: string, meta?: unknown) => void
  }
}

// Результат синхронизации
interface SyncResult {
  success: boolean
  operation: 'create' | 'update' | 'delete' | 'full_sync'
  provider: IntegrationProvider
  resourceType: string
  resourceId: string
  tenantId: string
  error?: string
  metadata?: Record<string, unknown>
  syncedAt: Date
}

// Результат batch-синхронизации
interface BatchSyncResult {
  totalItems: number
  successCount: number
  failedCount: number
  skippedCount: number
  results: SyncResult[]
  errors: Array<{ resourceId: string; error: string }>
  duration: number
  startedAt: Date
  completedAt: Date
}

// Field mapping
interface FieldMapping {
  source: string              // Путь к полю в источнике (например, "title.rendered")
  target: string              // Путь к полю в Payload (например, "name")
  transform?: FieldTransformer // Функция трансформации
  required?: boolean          // Обязательное поле
  defaultValue?: unknown      // Значение по умолчанию
}

// Collection sync config
interface CollectionSyncConfig {
  externalType: string         // Тип в источнике (например, "post")
  payloadCollection: string    // Коллекция в Payload (например, "symbols")
  fieldMappings: FieldMapping[]
  filters?: Record<string, unknown>
  batchSize?: number
  enabled?: boolean
}
```

---

## Пошаговое создание интеграции

Рассмотрим создание коннектора на примере **Slack** интеграции.

### Шаг 1: Структура файлов

Создайте следующую структуру:

```
src/integrations/slack/
├── connector.ts      # Основной класс коннектора
├── types.ts          # TypeScript типы для Slack API
├── auth.ts           # Логика OAuth2
├── transforms.ts     # Трансформеры данных
└── __tests__/
    ├── connector.test.ts
    └── fixtures.ts
```

### Шаг 2: Определение типов

**types.ts**:

```typescript
/**
 * Slack API Types
 */

export interface SlackChannel {
  id: string
  name: string
  is_channel: boolean
  is_group: boolean
  is_im: boolean
  is_mpim: boolean
  is_private: boolean
  created: number
  is_archived: boolean
  is_general: boolean
  unlinked: number
  name_normalized: string
  is_shared: boolean
  is_org_shared: boolean
  is_pending_ext_shared: boolean
  pending_shared: string[]
  context_team_id: string
  updated: number
  parent_conversation: null | string
  creator: string
  is_ext_shared: boolean
  shared_team_ids: string[]
  pending_connected_team_ids: string[]
  is_member: boolean
  topic: {
    value: string
    creator: string
    last_set: number
  }
  purpose: {
    value: string
    creator: string
    last_set: number
  }
  num_members?: number
}

export interface SlackMessage {
  type: string
  user: string
  text: string
  ts: string
  team: string
  thread_ts?: string
  reply_count?: number
  reply_users_count?: number
  latest_reply?: string
  reply_users?: string[]
  subscribed?: boolean
  reactions?: Array<{
    name: string
    count: number
    users: string[]
  }>
  files?: SlackFile[]
  attachments?: SlackAttachment[]
}

export interface SlackFile {
  id: string
  created: number
  timestamp: number
  name: string
  title: string
  mimetype: string
  filetype: string
  pretty_type: string
  user: string
  size: number
  mode: string
  is_external: boolean
  external_type: string
  is_public: boolean
  public_url_shared: boolean
  display_as_bot: boolean
  username: string
  url_private: string
  url_private_download: string
  permalink: string
  permalink_public: string
  preview?: string
  preview_highlight?: string
}

export interface SlackAttachment {
  id: number
  fallback: string
  text?: string
  pretext?: string
  title?: string
  title_link?: string
  author_name?: string
  author_link?: string
  author_icon?: string
  color?: string
  fields?: Array<{
    title: string
    value: string
    short: boolean
  }>
  image_url?: string
  thumb_url?: string
  footer?: string
  footer_icon?: string
  ts?: number
}

export interface SlackUser {
  id: string
  team_id: string
  name: string
  deleted: boolean
  color: string
  real_name: string
  tz: string
  tz_label: string
  tz_offset: number
  profile: {
    title: string
    phone: string
    skype: string
    real_name: string
    real_name_normalized: string
    display_name: string
    display_name_normalized: string
    status_text: string
    status_emoji: string
    status_expiration: number
    avatar_hash: string
    email: string
    first_name: string
    last_name: string
    image_24: string
    image_32: string
    image_48: string
    image_72: string
    image_192: string
    image_512: string
    team: string
  }
  is_admin: boolean
  is_owner: boolean
  is_primary_owner: boolean
  is_restricted: boolean
  is_ultra_restricted: boolean
  is_bot: boolean
  updated: number
  is_app_user: boolean
}

export interface SlackOAuthResponse {
  ok: boolean
  access_token: string
  token_type: string
  scope: string
  bot_user_id: string
  app_id: string
  team: {
    name: string
    id: string
  }
  enterprise: null | {
    name: string
    id: string
  }
  authed_user: {
    id: string
    scope: string
    access_token: string
    token_type: string
  }
}
```

### Шаг 3: Реализация OAuth2

**auth.ts**:

```typescript
/**
 * Slack OAuth2 Authentication
 */

import { AuthManager, type OAuth2TokenResponse } from '../base/AuthManager'

export class SlackAuthManager extends AuthManager {
  private static readonly AUTH_URL = 'https://slack.com/oauth/v2/authorize'
  private static readonly TOKEN_URL = 'https://slack.com/api/oauth.v2.access'

  /**
   * Получить URL для авторизации
   */
  getAuthorizationUrl(
    redirectUri: string,
    scopes: string[],
    state?: string
  ): string {
    if (!this.credentials.clientId) {
      throw new Error('Client ID is required')
    }

    const params = new URLSearchParams({
      client_id: this.credentials.clientId,
      redirect_uri: redirectUri,
      scope: scopes.join(','),
      state: state || '',
    })

    return `${SlackAuthManager.AUTH_URL}?${params.toString()}`
  }

  /**
   * Обмен кода на токен
   */
  async exchangeCodeForToken(
    code: string,
    redirectUri: string
  ): Promise<OAuth2TokenResponse> {
    if (!this.credentials.clientId || !this.credentials.clientSecret) {
      throw new Error('Client ID and secret are required')
    }

    const params = new URLSearchParams({
      code,
      client_id: this.credentials.clientId,
      client_secret: this.credentials.clientSecret,
      redirect_uri: redirectUri,
    })

    const response = await fetch(SlackAuthManager.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    if (!response.ok) {
      throw new Error(`OAuth token exchange failed: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.ok) {
      throw new Error(`Slack OAuth error: ${data.error}`)
    }

    return {
      access_token: data.access_token,
      token_type: data.token_type || 'Bearer',
      scope: data.scope,
    }
  }

  /**
   * Обновить access token (Slack не использует refresh tokens)
   */
  async refreshAccessToken(): Promise<string> {
    throw new Error('Slack does not support token refresh. Please re-authenticate.')
  }
}
```

### Шаг 4: Основной коннектор

**connector.ts**:

```typescript
/**
 * Slack Connector
 * Sync channels, messages, and files from Slack to Payload
 */

import { BaseConnector } from '../base/connector'
import type {
  WebhookPayload,
  WebhookValidation,
  CollectionSyncConfig,
  SyncContext,
  SyncResult,
} from '../base/types'
import type { SlackChannel, SlackMessage, SlackUser } from './types'
import { SlackAuthManager } from './auth'
import crypto from 'crypto'

export class SlackConnector extends BaseConnector {
  private baseUrl = 'https://slack.com/api'
  private authManager: SlackAuthManager

  constructor(context: SyncContext) {
    super(context)

    // Initialize auth manager
    this.authManager = new SlackAuthManager({
      method: 'oauth2',
      clientId: this.credentials.clientId as string,
      clientSecret: this.credentials.clientSecret as string,
      accessToken: this.credentials.accessToken as string,
    })
  }

  /**
   * Test connection to Slack API
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.makeRequest('auth.test')

      if (!response.ok) {
        return {
          success: false,
          error: response.error as string,
        }
      }

      return { success: true }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Fetch channels/conversations
   */
  async fetchResources(
    resourceType: string,
    options?: { page?: number; limit?: number; filters?: Record<string, unknown> }
  ): Promise<{ data: unknown[]; hasMore: boolean; total?: number }> {
    const { limit = 100 } = options || {}

    if (resourceType === 'channels') {
      return this.fetchChannels(limit, options?.filters?.cursor as string | undefined)
    } else if (resourceType === 'messages') {
      const channelId = options?.filters?.channel as string
      if (!channelId) {
        throw new Error('Channel ID is required for fetching messages')
      }
      return this.fetchMessages(channelId, limit)
    }

    throw new Error(`Unknown resource type: ${resourceType}`)
  }

  /**
   * Fetch single resource by ID
   */
  async fetchResource(resourceType: string, id: string): Promise<unknown> {
    if (resourceType === 'channels') {
      return this.fetchChannel(id)
    } else if (resourceType === 'messages') {
      const [channelId, ts] = id.split(':')
      if (!channelId || !ts) {
        throw new Error('Invalid message ID format. Expected: channelId:timestamp')
      }
      return this.fetchMessage(channelId, ts)
    }

    throw new Error(`Unknown resource type: ${resourceType}`)
  }

  /**
   * Validate Slack webhook signature
   * https://api.slack.com/authentication/verifying-requests-from-slack
   */
  validateWebhook(payload: WebhookPayload, signature?: string): WebhookValidation {
    const signingSecret = this.settings.webhookSecret as string | undefined

    if (!signingSecret) {
      return {
        valid: false,
        error: 'Signing secret not configured',
      }
    }

    if (!signature) {
      return {
        valid: false,
        error: 'Signature missing',
      }
    }

    // Slack sends X-Slack-Request-Timestamp and X-Slack-Signature headers
    const timestamp = payload.timestamp
    const basestring = `v0:${timestamp}:${JSON.stringify(payload.data)}`

    const expectedSignature = `v0=${crypto
      .createHmac('sha256', signingSecret)
      .update(basestring)
      .digest('hex')}`

    // Защита от replay attacks (timestamp не должен быть старше 5 минут)
    const currentTimestamp = Math.floor(Date.now() / 1000)
    if (Math.abs(currentTimestamp - timestamp) > 60 * 5) {
      return {
        valid: false,
        error: 'Request timestamp is too old',
      }
    }

    if (signature !== expectedSignature) {
      return {
        valid: false,
        error: 'Invalid signature',
      }
    }

    return {
      valid: true,
      provider: 'custom',
      event: payload.event,
    }
  }

  /**
   * Process Slack webhook event
   */
  async processWebhook(payload: WebhookPayload, context: SyncContext): Promise<SyncResult> {
    const { event, data } = payload

    // Slack webhook events: message.channels, channel.created, etc.
    const eventData = data as {
      type: string
      channel?: string
      user?: string
      ts?: string
      text?: string
    }

    if (event === 'message' && eventData.channel) {
      // Sync new message
      const messageId = `${eventData.channel}:${eventData.ts}`
      return await this.syncResource('messages', messageId, context)
    } else if (event === 'channel_created') {
      // Sync new channel
      return await this.syncResource('channels', eventData.channel || '', context)
    }

    return {
      success: false,
      operation: 'update',
      provider: this.provider,
      resourceType: 'unknown',
      resourceId: '',
      tenantId: this.tenantId,
      error: `Unsupported event: ${event}`,
      syncedAt: new Date(),
    }
  }

  /**
   * Extract ID from resource object
   */
  protected extractId(resource: unknown): string {
    if (resource && typeof resource === 'object' && 'id' in resource) {
      return String(resource.id)
    }
    throw new Error('Invalid resource: missing id')
  }

  /**
   * Get sync configuration for resource type
   */
  protected async getSyncConfig(resourceType: string): Promise<CollectionSyncConfig | null> {
    const configs: Record<string, CollectionSyncConfig> = {
      channels: {
        externalType: 'channels',
        payloadCollection: 'symbols',
        batchSize: 100,
        enabled: true,
        fieldMappings: [
          {
            source: 'name',
            target: 'name',
            required: true,
          },
          {
            source: 'topic.value',
            target: 'description',
          },
          {
            source: 'id',
            target: 'metadata.slackId',
            required: true,
          },
          {
            source: 'is_private',
            target: 'metadata.isPrivate',
          },
          {
            source: 'created',
            target: 'metadata.createdAt',
            transform: (value: unknown) => {
              if (typeof value === 'number') {
                return new Date(value * 1000).toISOString()
              }
              return value
            },
          },
        ],
      },
      messages: {
        externalType: 'messages',
        payloadCollection: 'symbols',
        batchSize: 100,
        enabled: true,
        fieldMappings: [
          {
            source: 'text',
            target: 'name',
            required: true,
          },
          {
            source: 'text',
            target: 'description',
          },
          {
            source: 'ts',
            target: 'metadata.timestamp',
            required: true,
          },
          {
            source: 'user',
            target: 'metadata.userId',
          },
          {
            source: 'thread_ts',
            target: 'metadata.threadId',
          },
        ],
      },
    }

    return configs[resourceType] || null
  }

  // PRIVATE HELPER METHODS

  /**
   * Make API request to Slack
   */
  private async makeRequest(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<{ ok: boolean; error?: string; [key: string]: unknown }> {
    const url = new URL(`${this.baseUrl}/${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    const headers = await this.authManager.getHeaders()

    const response = await fetch(url.toString(), { headers })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return (await response.json()) as { ok: boolean; error?: string; [key: string]: unknown }
  }

  /**
   * Fetch channels list
   */
  private async fetchChannels(
    limit: number,
    cursor?: string
  ): Promise<{ data: unknown[]; hasMore: boolean }> {
    const params: Record<string, string> = {
      limit: limit.toString(),
      exclude_archived: 'true',
    }

    if (cursor) {
      params.cursor = cursor
    }

    const response = await this.makeRequest('conversations.list', params)

    if (!response.ok) {
      throw new Error(`Failed to fetch channels: ${response.error}`)
    }

    return {
      data: (response.channels as SlackChannel[]) || [],
      hasMore: !!response.response_metadata &&
        typeof response.response_metadata === 'object' &&
        'next_cursor' in response.response_metadata &&
        !!response.response_metadata.next_cursor,
    }
  }

  /**
   * Fetch single channel
   */
  private async fetchChannel(channelId: string): Promise<SlackChannel> {
    const response = await this.makeRequest('conversations.info', { channel: channelId })

    if (!response.ok) {
      throw new Error(`Failed to fetch channel: ${response.error}`)
    }

    return response.channel as SlackChannel
  }

  /**
   * Fetch messages from channel
   */
  private async fetchMessages(
    channelId: string,
    limit: number
  ): Promise<{ data: unknown[]; hasMore: boolean }> {
    const response = await this.makeRequest('conversations.history', {
      channel: channelId,
      limit: limit.toString(),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.error}`)
    }

    return {
      data: (response.messages as SlackMessage[]) || [],
      hasMore: !!response.has_more,
    }
  }

  /**
   * Fetch single message
   */
  private async fetchMessage(channelId: string, timestamp: string): Promise<SlackMessage> {
    const response = await this.makeRequest('conversations.history', {
      channel: channelId,
      latest: timestamp,
      inclusive: 'true',
      limit: '1',
    })

    if (!response.ok || !Array.isArray(response.messages) || response.messages.length === 0) {
      throw new Error(`Failed to fetch message: ${response.error || 'Message not found'}`)
    }

    return response.messages[0] as SlackMessage
  }
}
```

### Шаг 5: Unit-тесты

**__tests__/connector.test.ts**:

```typescript
/**
 * Unit tests for Slack Connector
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SlackConnector } from '../connector'
import type { SyncContext } from '../../base/types'
import { mockPayload, mockLogger } from '../../base/__tests__/mocks'

describe('SlackConnector', () => {
  let connector: SlackConnector
  let context: SyncContext

  beforeEach(() => {
    context = {
      payload: mockPayload(),
      tenantId: 'test-tenant',
      config: {
        provider: 'custom',
        credentials: {
          clientId: 'test-client-id',
          clientSecret: 'test-secret',
          accessToken: 'test-token',
        },
        settings: {
          webhookSecret: 'test-webhook-secret',
        },
      },
      logger: mockLogger(),
    }

    connector = new SlackConnector(context)
  })

  describe('testConnection', () => {
    it('should return success for valid credentials', async () => {
      // Mock fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true, user: 'test-user' }),
      })

      const result = await connector.testConnection()

      expect(result.success).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should return error for invalid credentials', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: false, error: 'invalid_auth' }),
      })

      const result = await connector.testConnection()

      expect(result.success).toBe(false)
      expect(result.error).toBe('invalid_auth')
    })
  })

  describe('validateWebhook', () => {
    it('should validate correct signature', () => {
      const payload = {
        provider: 'custom' as const,
        event: 'message',
        data: { type: 'message', text: 'Hello' },
        timestamp: Math.floor(Date.now() / 1000),
      }

      // Generate valid signature
      const crypto = require('crypto')
      const basestring = `v0:${payload.timestamp}:${JSON.stringify(payload.data)}`
      const signature = `v0=${crypto
        .createHmac('sha256', 'test-webhook-secret')
        .update(basestring)
        .digest('hex')}`

      const result = connector.validateWebhook(payload, signature)

      expect(result.valid).toBe(true)
    })

    it('should reject invalid signature', () => {
      const payload = {
        provider: 'custom' as const,
        event: 'message',
        data: { type: 'message' },
        timestamp: Math.floor(Date.now() / 1000),
      }

      const result = connector.validateWebhook(payload, 'invalid-signature')

      expect(result.valid).toBe(false)
      expect(result.error).toContain('Invalid signature')
    })

    it('should reject old timestamps', () => {
      const payload = {
        provider: 'custom' as const,
        event: 'message',
        data: { type: 'message' },
        timestamp: Math.floor(Date.now() / 1000) - 400, // 6+ minutes ago
      }

      const result = connector.validateWebhook(payload, 'any-signature')

      expect(result.valid).toBe(false)
      expect(result.error).toContain('too old')
    })
  })

  describe('fetchResources', () => {
    it('should fetch channels', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          ok: true,
          channels: [
            { id: 'C123', name: 'general', is_private: false },
            { id: 'C456', name: 'random', is_private: false },
          ],
          response_metadata: { next_cursor: '' },
        }),
      })

      const result = await connector.fetchResources('channels', { limit: 10 })

      expect(result.data).toHaveLength(2)
      expect(result.hasMore).toBe(false)
    })
  })

  describe('syncResource', () => {
    it('should sync channel to symbols collection', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          ok: true,
          channel: {
            id: 'C123',
            name: 'general',
            topic: { value: 'General discussion' },
            created: 1234567890,
            is_private: false,
          },
        }),
      })

      // Mock Payload methods
      context.payload.find = vi.fn().mockResolvedValue({ docs: [] })
      context.payload.create = vi.fn().mockResolvedValue({ id: 'new-id' })

      const result = await connector.syncResource('channels', 'C123', context)

      expect(result.success).toBe(true)
      expect(result.operation).toBe('create')
      expect(context.payload.create).toHaveBeenCalled()
    })
  })
})
```

---

## Примеры коннекторов

### Google Drive Connector

```typescript
/**
 * Google Drive Connector
 * Sync files and folders from Google Drive
 */

import { BaseConnector } from '../base/connector'
import type { CollectionSyncConfig, SyncContext } from '../base/types'
import { google } from 'googleapis'

export class GoogleDriveConnector extends BaseConnector {
  private drive: ReturnType<typeof google.drive>

  constructor(context: SyncContext) {
    super(context)

    const auth = new google.auth.OAuth2(
      this.credentials.clientId as string,
      this.credentials.clientSecret as string,
      this.credentials.redirectUri as string
    )

    auth.setCredentials({
      access_token: this.credentials.accessToken as string,
      refresh_token: this.credentials.refreshToken as string,
    })

    this.drive = google.drive({ version: 'v3', auth })
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.drive.about.get({ fields: 'user' })
      return { success: true }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: errorMessage }
    }
  }

  async fetchResources(
    resourceType: string,
    options?: { page?: number; limit?: number; filters?: Record<string, unknown> }
  ): Promise<{ data: unknown[]; hasMore: boolean; total?: number }> {
    const { limit = 100 } = options || {}
    const pageToken = options?.filters?.pageToken as string | undefined

    const response = await this.drive.files.list({
      pageSize: limit,
      fields: 'nextPageToken, files(id, name, mimeType, createdTime, modifiedTime, size, webViewLink)',
      pageToken,
      q: "trashed = false and 'me' in owners",
    })

    return {
      data: response.data.files || [],
      hasMore: !!response.data.nextPageToken,
    }
  }

  async fetchResource(resourceType: string, id: string): Promise<unknown> {
    const response = await this.drive.files.get({
      fileId: id,
      fields: 'id, name, mimeType, createdTime, modifiedTime, size, webViewLink, description',
    })

    return response.data
  }

  validateWebhook() {
    // Google Drive uses push notifications with channel verification
    return { valid: true }
  }

  async processWebhook() {
    throw new Error('Not implemented')
  }

  protected extractId(resource: unknown): string {
    if (resource && typeof resource === 'object' && 'id' in resource) {
      return String(resource.id)
    }
    throw new Error('Invalid resource')
  }

  protected async getSyncConfig(resourceType: string): Promise<CollectionSyncConfig | null> {
    return {
      externalType: 'files',
      payloadCollection: 'symbols',
      batchSize: 100,
      enabled: true,
      fieldMappings: [
        {
          source: 'name',
          target: 'name',
          required: true,
        },
        {
          source: 'description',
          target: 'description',
        },
        {
          source: 'webViewLink',
          target: 'metadata.url',
        },
        {
          source: 'mimeType',
          target: 'metadata.mimeType',
        },
        {
          source: 'modifiedTime',
          target: 'updatedAt',
          transform: (value: unknown) => {
            if (typeof value === 'string') {
              return new Date(value).toISOString()
            }
            return value
          },
        },
      ],
    }
  }
}
```

### Dropbox Connector

```typescript
/**
 * Dropbox Connector
 * Sync files from Dropbox
 */

import { BaseConnector } from '../base/connector'
import { Dropbox } from 'dropbox'

export class DropboxConnector extends BaseConnector {
  private dbx: Dropbox

  constructor(context: SyncContext) {
    super(context)

    this.dbx = new Dropbox({
      accessToken: this.credentials.accessToken as string,
    })
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.dbx.usersGetCurrentAccount()
      return { success: true }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: errorMessage }
    }
  }

  async fetchResources(
    resourceType: string,
    options?: { page?: number; limit?: number; filters?: Record<string, unknown> }
  ): Promise<{ data: unknown[]; hasMore: boolean }> {
    const path = (options?.filters?.path as string) || ''
    const cursor = options?.filters?.cursor as string | undefined

    let response

    if (cursor) {
      response = await this.dbx.filesListFolderContinue({ cursor })
    } else {
      response = await this.dbx.filesListFolder({
        path,
        recursive: false,
        limit: options?.limit || 100,
      })
    }

    return {
      data: response.result.entries,
      hasMore: response.result.has_more,
    }
  }

  async fetchResource(resourceType: string, id: string): Promise<unknown> {
    const response = await this.dbx.filesGetMetadata({ path: id })
    return response.result
  }

  validateWebhook(payload: WebhookPayload, signature?: string): WebhookValidation {
    // Dropbox webhook validation
    // Challenge-response for initial verification
    if ('challenge' in payload.data) {
      return { valid: true }
    }

    const hmacSecret = this.settings.webhookSecret as string
    if (!hmacSecret || !signature) {
      return { valid: false, error: 'Missing signature or secret' }
    }

    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', hmacSecret)
      .update(JSON.stringify(payload.data))
      .digest('hex')

    return {
      valid: signature === expectedSignature,
      error: signature !== expectedSignature ? 'Invalid signature' : undefined,
    }
  }

  async processWebhook(payload: WebhookPayload, context: SyncContext) {
    // Dropbox sends notifications without full data
    // Need to fetch actual changes
    const accounts = (payload.data as { list_folder: { accounts: string[] } }).list_folder.accounts

    for (const account of accounts) {
      // Trigger full sync for this account
      await this.syncAll('files', context)
    }

    return {
      success: true,
      operation: 'full_sync' as const,
      provider: this.provider,
      resourceType: 'files',
      resourceId: '',
      tenantId: this.tenantId,
      syncedAt: new Date(),
    }
  }

  protected extractId(resource: unknown): string {
    if (resource && typeof resource === 'object' && 'path_display' in resource) {
      return String(resource.path_display)
    }
    throw new Error('Invalid resource')
  }

  protected async getSyncConfig(resourceType: string): Promise<CollectionSyncConfig | null> {
    return {
      externalType: 'files',
      payloadCollection: 'symbols',
      batchSize: 100,
      enabled: true,
      fieldMappings: [
        {
          source: 'name',
          target: 'name',
          required: true,
        },
        {
          source: 'path_display',
          target: 'metadata.path',
        },
        {
          source: 'client_modified',
          target: 'updatedAt',
        },
      ],
    }
  }
}
```

---

## Аутентификация

### Поддерживаемые методы

```typescript
type AuthMethod =
  | 'api-key'     // API ключ в headers
  | 'oauth2'      // OAuth 2.0
  | 'basic'       // HTTP Basic Auth
  | 'bearer'      // Bearer Token
  | 'hmac'        // HMAC signature
  | 'jwt'         // JSON Web Token
```

### Использование AuthManager

```typescript
import { AuthManager } from '../base/AuthManager'

const authManager = new AuthManager({
  method: 'oauth2',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  accessToken: 'user-access-token',
  refreshToken: 'user-refresh-token',
})

// Получить headers для запроса
const headers = await authManager.getHeaders()

// Обменять код на токен
const tokens = await authManager.exchangeCodeForToken(
  code,
  'https://provider.com/oauth/token',
  'https://yourapp.com/callback'
)

// Проверить HMAC подпись
const isValid = authManager.validateHmacSignature(data, signature, 'sha256')
```

---

## Обработка вебхуков

### Валидация подписей

Разные провайдеры используют разные методы:

#### 1. HMAC-SHA256 (Shopify, Stripe)

```typescript
validateWebhook(payload: WebhookPayload, signature?: string): WebhookValidation {
  const secret = this.settings.webhookSecret as string

  const hmac = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload.data))
    .digest('base64')

  return {
    valid: hmac === signature,
    error: hmac !== signature ? 'Invalid signature' : undefined,
  }
}
```

#### 2. SHA256 with prefix (WordPress)

```typescript
validateWebhook(payload: WebhookPayload, signature?: string): WebhookValidation {
  const secret = this.settings.webhookSecret as string

  const expected = `sha256=${crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload.data))
    .digest('hex')}`

  return {
    valid: signature === expected,
  }
}
```

#### 3. Timestamp-based (Slack)

```typescript
validateWebhook(payload: WebhookPayload, signature?: string): WebhookValidation {
  const secret = this.settings.webhookSecret as string
  const timestamp = payload.timestamp

  // Check timestamp freshness (prevent replay attacks)
  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - timestamp) > 300) { // 5 minutes
    return { valid: false, error: 'Timestamp too old' }
  }

  const basestring = `v0:${timestamp}:${JSON.stringify(payload.data)}`
  const expected = `v0=${crypto
    .createHmac('sha256', secret)
    .update(basestring)
    .digest('hex')}`

  return {
    valid: signature === expected,
  }
}
```

### Обработка событий

```typescript
async processWebhook(payload: WebhookPayload, context: SyncContext): Promise<SyncResult> {
  const { event, data } = payload

  // Parse event type
  const [resource, action] = event.split('.')

  switch (action) {
    case 'created':
      return await this.syncResource(resource, data.id, context)

    case 'updated':
      return await this.syncResource(resource, data.id, context)

    case 'deleted':
      const mapping = await this.getResourceMapping(data.id, resource)
      if (mapping) {
        await context.payload.delete({
          collection: mapping.internalCollection,
          id: mapping.internalId,
        })
      }
      return {
        success: true,
        operation: 'delete',
        provider: this.provider,
        resourceType: resource,
        resourceId: data.id,
        tenantId: this.tenantId,
        syncedAt: new Date(),
      }

    default:
      throw new Error(`Unknown action: ${action}`)
  }
}
```

---

## Best Practices

### 1. Batch Processing

Используйте batch processing для больших объемов данных:

```typescript
async syncAllOptimized(resourceType: string, context: SyncContext) {
  const batchSize = 50
  const concurrency = 5
  let page = 1
  let hasMore = true

  while (hasMore) {
    const { data, hasMore: more } = await this.fetchResources(resourceType, {
      page,
      limit: batchSize,
    })

    // Process in parallel chunks
    const chunks = this.chunkArray(data, concurrency)

    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(resource =>
          this.syncResource(resourceType, this.extractId(resource), context)
        )
      )
    }

    hasMore = more
    page++
  }
}
```

### 2. Incremental Sync

Синхронизируйте только измененные данные:

```typescript
async incrementalSync(resourceType: string, context: SyncContext) {
  const lastSyncAt = await this.getLastSyncTimestamp(resourceType)

  const { data } = await this.fetchResources(resourceType, {
    filters: {
      modified_since: lastSyncAt,
    },
  })

  for (const resource of data) {
    await this.syncResource(resourceType, this.extractId(resource), context)
  }

  await this.updateLastSyncTimestamp(resourceType, new Date())
}
```

### 3. Conflict Resolution

Обрабатывайте конфликты при синхронизации:

```typescript
import { ConflictResolver } from '../base/ConflictResolver'

protected async handleConflict(
  externalData: unknown,
  internalData: unknown,
  context: SyncContext
): Promise<unknown> {
  const resolver = new ConflictResolver({
    strategy: 'last-write-wins', // или 'external-wins', 'internal-wins'
  })

  return resolver.resolve(externalData, internalData, {
    externalModifiedAt: this.getNestedValue(externalData, 'modified'),
    internalModifiedAt: this.getNestedValue(internalData, 'updatedAt'),
  })
}
```

### 4. Rate Limiting

Соблюдайте rate limits API:

```typescript
import { RateLimiter } from '../base/RateLimiter'

private rateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60000, // 100 requests per minute
})

private async makeRequest(url: string) {
  await this.rateLimiter.acquire()

  try {
    return await fetch(url, { headers: await this.authManager.getHeaders() })
  } finally {
    this.rateLimiter.release()
  }
}
```

### 5. Error Handling & Retry

Используйте retry с exponential backoff:

```typescript
import { RetryHandler } from '../base/RetryHandler'

private retryHandler = new RetryHandler({
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  onRetry: (attempt, error, delay) => {
    this.logger.warn(`Retry attempt ${attempt} after ${delay}ms`, { error })
  },
})

async fetchResourceWithRetry(resourceType: string, id: string): Promise<unknown> {
  return this.retryHandler.execute(() =>
    this.fetchResource(resourceType, id)
  )
}
```

### 6. Data Normalization

Нормализуйте данные перед сохранением:

```typescript
import { DataNormalizer } from '../base/DataNormalizer'

private normalizer = new DataNormalizer()

protected async transformData(
  externalData: unknown,
  mappings: FieldMapping[],
  context: SyncContext
): Promise<Record<string, unknown>> {
  const transformed = await super.transformData(externalData, mappings, context)

  // Normalize text fields
  if (transformed.name) {
    transformed.name = this.normalizer.normalizeText(transformed.name as string)
  }

  // Normalize URLs
  if (transformed.url) {
    transformed.url = this.normalizer.normalizeUrl(transformed.url as string)
  }

  // Sanitize HTML
  if (transformed.description) {
    transformed.description = this.normalizer.sanitizeHtml(transformed.description as string)
  }

  return transformed
}
```

### 7. Logging & Monitoring

Логируйте все операции:

```typescript
async syncResource(
  resourceType: string,
  externalId: string,
  context: SyncContext
): Promise<SyncResult> {
  const startTime = Date.now()

  context.logger.info(`Starting sync: ${resourceType}/${externalId}`)

  try {
    const result = await super.syncResource(resourceType, externalId, context)

    context.logger.info(`Sync completed: ${resourceType}/${externalId}`, {
      duration: Date.now() - startTime,
      operation: result.operation,
    })

    return result
  } catch (error) {
    context.logger.error(`Sync failed: ${resourceType}/${externalId}`, {
      duration: Date.now() - startTime,
      error,
    })
    throw error
  }
}
```

---

## Публикация в Marketplace

### 1. Подготовка

Создайте файл `integration.json`:

```json
{
  "name": "slack",
  "displayName": "Slack",
  "description": "Sync channels, messages, and files from Slack workspace",
  "version": "1.0.0",
  "author": "Your Name",
  "icon": "slack-icon.svg",
  "category": "collaboration",
  "tags": ["messaging", "team", "collaboration"],
  "provider": "custom",
  "authMethods": ["oauth2"],
  "requiredScopes": [
    "channels:read",
    "channels:history",
    "users:read"
  ],
  "webhookSupport": true,
  "resourceTypes": [
    {
      "type": "channels",
      "displayName": "Channels",
      "description": "Slack channels and conversations",
      "syncable": true
    },
    {
      "type": "messages",
      "displayName": "Messages",
      "description": "Channel messages",
      "syncable": true
    }
  ],
  "configuration": {
    "fields": [
      {
        "name": "workspace",
        "type": "text",
        "label": "Workspace ID",
        "required": true
      },
      {
        "name": "syncFrequency",
        "type": "select",
        "label": "Sync Frequency",
        "options": ["hourly", "daily", "weekly"],
        "default": "hourly"
      }
    ]
  },
  "documentation": "https://docs.yourplatform.com/integrations/slack",
  "support": "support@yourplatform.com"
}
```

### 2. Документация

Создайте `README.md`:

```markdown
# Slack Integration

Connect your Slack workspace to AACSearch for powerful search across channels and messages.

## Features

- Sync all public channels
- Index channel messages
- Real-time updates via webhooks
- User and file metadata

## Setup

1. Create Slack App at https://api.slack.com/apps
2. Add OAuth scopes: `channels:read`, `channels:history`, `users:read`
3. Install app to workspace
4. Copy OAuth tokens to integration settings

## Configuration

| Field | Description |
|-------|-------------|
| Workspace ID | Your Slack workspace ID |
| Sync Frequency | How often to sync (hourly/daily/weekly) |

## Troubleshooting

### Error: invalid_auth
- Check that OAuth token is valid
- Verify app is installed to workspace

### Missing messages
- Ensure app has `channels:history` scope
- Check that bot is member of channel
```

### 3. Тестирование

Создайте integration tests:

```typescript
// __tests__/integration.test.ts
import { describe, it, expect } from 'vitest'
import { testIntegration } from '@aacsearch/integration-testing'

describe('Slack Integration', () => {
  it('should pass all integration tests', async () => {
    const results = await testIntegration({
      connector: SlackConnector,
      credentials: {
        clientId: process.env.SLACK_CLIENT_ID!,
        clientSecret: process.env.SLACK_CLIENT_SECRET!,
        accessToken: process.env.SLACK_ACCESS_TOKEN!,
      },
      tests: [
        'connection',
        'fetch_resources',
        'sync',
        'webhook_validation',
      ],
    })

    expect(results.passed).toBe(results.total)
  })
})
```

### 4. Публикация

```bash
# Build connector
pnpm build

# Run tests
pnpm test

# Package integration
pnpm package

# Publish to marketplace
pnpm publish:marketplace --tag=slack --version=1.0.0
```

### 5. Метаданные для Marketplace

```typescript
// package.json
{
  "name": "@aacsearch/integration-slack",
  "version": "1.0.0",
  "description": "Slack integration for AACSearch",
  "keywords": ["aacsearch", "integration", "slack", "messaging"],
  "license": "MIT",
  "author": "Your Name <email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/aacsearch-slack"
  },
  "peerDependencies": {
    "@aacsearch/platform": "^1.0.0"
  }
}
```

---

## Полный пример workflow

```typescript
/**
 * Example: Complete integration workflow
 */

// 1. Initialize connector
const context: SyncContext = {
  payload,
  tenantId: 'tenant-123',
  config: {
    provider: 'custom',
    credentials: { /* ... */ },
    settings: { /* ... */ },
  },
  logger: console,
}

const connector = new SlackConnector(context)

// 2. Test connection
const connectionTest = await connector.testConnection()
if (!connectionTest.success) {
  throw new Error(`Connection failed: ${connectionTest.error}`)
}

// 3. Full initial sync
const syncResult = await connector.syncAll('channels', context)
console.log(`Synced ${syncResult.successCount}/${syncResult.totalItems} channels`)

// 4. Setup webhook endpoint
app.post('/webhooks/slack', async (req, res) => {
  const signature = req.headers['x-slack-signature'] as string
  const payload: WebhookPayload = {
    provider: 'custom',
    event: req.body.event.type,
    data: req.body.event,
    timestamp: parseInt(req.headers['x-slack-request-timestamp'] as string, 10),
  }

  // Validate webhook
  const validation = connector.validateWebhook(payload, signature)
  if (!validation.valid) {
    return res.status(401).json({ error: validation.error })
  }

  // Process webhook
  const result = await connector.processWebhook(payload, context)

  res.json({ success: result.success })
})

// 5. Incremental sync (scheduled job)
cron.schedule('0 * * * *', async () => { // Every hour
  const lastHour = new Date(Date.now() - 60 * 60 * 1000)

  const result = await connector.fetchResources('messages', {
    filters: { since: lastHour.toISOString() },
  })

  for (const message of result.data) {
    await connector.syncResource('messages', connector.extractId(message), context)
  }
})
```

---

## Заключение

Создание кастомной интеграции включает:

1. **Наследование от BaseConnector** - используйте готовую логику синхронизации
2. **Реализация обязательных методов** - подключение, получение данных, вебхуки
3. **Настройка field mappings** - трансформация данных из источника в Payload
4. **Аутентификация** - OAuth2, API keys, или другие методы
5. **Обработка ошибок** - retry, rate limiting, logging
6. **Тестирование** - unit и integration tests
7. **Документация** - README, примеры, troubleshooting
8. **Публикация** - packaging и публикация в marketplace

Следуйте best practices для надежной и производительной интеграции!
