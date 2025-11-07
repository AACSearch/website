# Расширение платформы

Полное руководство по расширению функциональности AACSearch через hooks, plugins, custom fields и другие механизмы.

## Содержание

- [Plugin система](#plugin-система)
- [Custom Hooks](#custom-hooks)
- [Custom Field Types](#custom-field-types)
- [Custom Search Algorithms](#custom-search-algorithms)
- [Custom Analytics Modules](#custom-analytics-modules)
- [Custom UI Components](#custom-ui-components)
- [Custom API Endpoints](#custom-api-endpoints)
- [Custom Jobs/Cron Tasks](#custom-jobscron-tasks)
- [Custom Authentication Providers](#custom-authentication-providers)
- [Webhooks Customization](#webhooks-customization)
- [Middleware Development](#middleware-development)
- [Event System](#event-system)

---

## Plugin система

AACSearch поддерживает расширяемую plugin-архитектуру на базе PayloadCMS v3.

### Архитектура плагинов

```
┌────────────────────────────────────┐
│       Payload Config               │
│  (payload.config.ts)               │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│        Plugins Array               │
│  - Core Plugins                    │
│  - Custom Plugins                  │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│      Plugin Interface              │
│  - name: string                    │
│  - init: (config) => Config        │
│  - hooks?: {...}                   │
│  - endpoints?: [...]               │
│  - fields?: [...]                  │
└────────────────────────────────────┘
```

### Базовая структура плагина

```typescript
/**
 * Plugin interface
 */
import type { Config, Plugin } from 'payload'

export interface MyPluginOptions {
  enabled?: boolean
  apiKey?: string
  settings?: Record<string, unknown>
}

/**
 * Create plugin function
 */
export const myPlugin = (options: MyPluginOptions): Plugin => {
  return {
    name: 'my-plugin',

    /**
     * Initialize plugin and modify config
     */
    init: (config: Config): Config => {
      return {
        ...config,

        // Add collections
        collections: [
          ...(config.collections || []),
          // Custom collections here
        ],

        // Add globals
        globals: [
          ...(config.globals || []),
          // Custom globals here
        ],

        // Add endpoints
        endpoints: [
          ...(config.endpoints || []),
          {
            path: '/my-plugin/action',
            method: 'post',
            handler: async (req) => {
              // Handler logic
              return Response.json({ success: true })
            },
          },
        ],

        // Add hooks
        hooks: {
          ...config.hooks,
          // Custom hooks here
        },
      }
    },
  }
}
```

### Пример: Analytics Plugin

```typescript
/**
 * Enhanced Analytics Plugin
 * Adds advanced analytics tracking and reporting
 */

import type { Config, Plugin } from 'payload'

export interface AnalyticsPluginOptions {
  enabled?: boolean
  providers?: Array<'google' | 'mixpanel' | 'amplitude'>
  trackPageViews?: boolean
  trackEvents?: boolean
  customDimensions?: Record<string, string>
}

export const analyticsPlugin = (options: AnalyticsPluginOptions = {}): Plugin => {
  const {
    enabled = true,
    providers = ['google'],
    trackPageViews = true,
    trackEvents = true,
    customDimensions = {},
  } = options

  return {
    name: 'enhanced-analytics',

    init: (config: Config): Config => {
      if (!enabled) return config

      return {
        ...config,

        // Add analytics collection
        collections: [
          ...(config.collections || []),
          {
            slug: 'analytics_events',
            admin: {
              useAsTitle: 'eventName',
              group: 'Analytics',
            },
            fields: [
              {
                name: 'eventName',
                type: 'text',
                required: true,
                index: true,
              },
              {
                name: 'eventType',
                type: 'select',
                options: ['pageview', 'click', 'search', 'conversion', 'custom'],
                required: true,
              },
              {
                name: 'userId',
                type: 'text',
                index: true,
              },
              {
                name: 'sessionId',
                type: 'text',
                index: true,
              },
              {
                name: 'properties',
                type: 'json',
              },
              {
                name: 'dimensions',
                type: 'json',
                defaultValue: customDimensions,
              },
              {
                name: 'timestamp',
                type: 'date',
                required: true,
                admin: {
                  date: {
                    displayFormat: 'YYYY-MM-DD HH:mm:ss',
                  },
                },
              },
              {
                name: 'tenant',
                type: 'relationship',
                relationTo: 'tenants',
                required: true,
                index: true,
              },
            ],
            hooks: {
              afterChange: [
                async ({ doc, req }) => {
                  // Send to external analytics providers
                  for (const provider of providers) {
                    await sendToProvider(provider, doc, req)
                  }
                },
              ],
            },
          },
        ],

        // Add analytics endpoints
        endpoints: [
          ...(config.endpoints || []),

          // Track event endpoint
          {
            path: '/analytics/track',
            method: 'post',
            handler: async (req) => {
              const { eventName, eventType, properties, userId, sessionId } = await req.json()

              const tenantId = await getTenantId(req)

              const event = await req.payload.create({
                collection: 'analytics_events',
                data: {
                  eventName,
                  eventType,
                  properties,
                  userId,
                  sessionId,
                  tenant: tenantId,
                  timestamp: new Date(),
                },
              })

              return Response.json({ success: true, eventId: event.id })
            },
          },

          // Analytics report endpoint
          {
            path: '/analytics/report',
            method: 'get',
            handler: async (req) => {
              const { searchParams } = new URL(req.url)
              const startDate = searchParams.get('startDate')
              const endDate = searchParams.get('endDate')
              const eventType = searchParams.get('eventType')

              const tenantId = await getTenantId(req)

              const where: Record<string, unknown> = {
                tenant: { equals: tenantId },
              }

              if (startDate && endDate) {
                where.timestamp = {
                  greater_than_equal: new Date(startDate),
                  less_than_equal: new Date(endDate),
                }
              }

              if (eventType) {
                where.eventType = { equals: eventType }
              }

              const events = await req.payload.find({
                collection: 'analytics_events',
                where,
                limit: 1000,
              })

              // Aggregate data
              const aggregated = aggregateEvents(events.docs)

              return Response.json({
                success: true,
                data: aggregated,
                total: events.totalDocs,
              })
            },
          },
        ],

        // Add global hook for auto-tracking
        hooks: {
          ...config.hooks,

          afterRead: [
            ...(config.hooks?.afterRead || []),
            async ({ doc, req, collection }) => {
              if (trackPageViews && collection) {
                // Track page view
                await trackEvent({
                  eventName: `${collection}:read`,
                  eventType: 'pageview',
                  properties: { docId: doc.id, collection },
                  req,
                })
              }
              return doc
            },
          ],
        },
      }
    },
  }
}

/**
 * Helper: Send event to external provider
 */
async function sendToProvider(
  provider: 'google' | 'mixpanel' | 'amplitude',
  event: Record<string, unknown>,
  req: Request
): Promise<void> {
  try {
    switch (provider) {
      case 'google':
        // Google Analytics 4
        await fetch('https://www.google-analytics.com/mp/collect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: event.sessionId,
            events: [{
              name: event.eventName,
              params: event.properties,
            }],
          }),
        })
        break

      case 'mixpanel':
        // Mixpanel
        await fetch('https://api.mixpanel.com/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: event.eventName,
            properties: {
              ...event.properties,
              distinct_id: event.userId,
              time: new Date(event.timestamp as string).getTime(),
            },
          }),
        })
        break

      case 'amplitude':
        // Amplitude
        await fetch('https://api2.amplitude.com/2/httpapi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: process.env.AMPLITUDE_API_KEY,
            events: [{
              user_id: event.userId,
              event_type: event.eventName,
              event_properties: event.properties,
              time: new Date(event.timestamp as string).getTime(),
            }],
          }),
        })
        break
    }
  } catch (error) {
    console.error(`Failed to send event to ${provider}:`, error)
  }
}

/**
 * Helper: Aggregate events
 */
function aggregateEvents(events: Record<string, unknown>[]): Record<string, unknown> {
  const byType: Record<string, number> = {}
  const byName: Record<string, number> = {}
  const byHour: Record<string, number> = {}

  for (const event of events) {
    const type = event.eventType as string
    const name = event.eventName as string
    const timestamp = new Date(event.timestamp as string)
    const hour = timestamp.toISOString().slice(0, 13) // YYYY-MM-DDTHH

    byType[type] = (byType[type] || 0) + 1
    byName[name] = (byName[name] || 0) + 1
    byHour[hour] = (byHour[hour] || 0) + 1
  }

  return {
    byType,
    byName,
    byHour,
    total: events.length,
  }
}

/**
 * Helper: Track event
 */
async function trackEvent({
  eventName,
  eventType,
  properties = {},
  req,
}: {
  eventName: string
  eventType: string
  properties?: Record<string, unknown>
  req: Request
}): Promise<void> {
  try {
    await fetch(`${req.url.origin}/api/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.get('authorization') || '',
      },
      body: JSON.stringify({
        eventName,
        eventType,
        properties,
      }),
    })
  } catch (error) {
    // Silently fail
  }
}

/**
 * Helper: Get tenant ID from request
 */
async function getTenantId(req: Request): Promise<string> {
  // Extract from user or headers
  const user = req.user as Record<string, unknown> | undefined
  if (user?.tenant) {
    return String(user.tenant)
  }
  return 'default'
}
```

### Использование плагинов

**payload.config.ts**:

```typescript
import { buildConfig } from 'payload'
import { analyticsPlugin } from './plugins/analytics'
import { searchPlugin } from './plugins/search'
import { notificationsPlugin } from './plugins/notifications'

export default buildConfig({
  // ... other config

  plugins: [
    // Core analytics
    analyticsPlugin({
      enabled: true,
      providers: ['google', 'mixpanel'],
      trackPageViews: true,
      trackEvents: true,
      customDimensions: {
        app: 'aacsearch',
        environment: process.env.NODE_ENV || 'development',
      },
    }),

    // Enhanced search
    searchPlugin({
      enabled: true,
      engine: 'typesense',
      features: ['semantic', 'facets', 'synonyms'],
    }),

    // Notifications
    notificationsPlugin({
      enabled: true,
      channels: ['email', 'slack', 'webhook'],
      templates: {
        welcome: './templates/welcome.html',
        alert: './templates/alert.html',
      },
    }),
  ],
})
```

---

## Custom Hooks

Hooks позволяют выполнять код в определенные моменты жизненного цикла документов и операций.

### Типы hooks

```typescript
import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'

interface HookTypes {
  // Collection hooks
  beforeOperation: CollectionBeforeOperationHook[]
  beforeValidate: CollectionBeforeValidateHook[]
  beforeChange: CollectionBeforeChangeHook[]
  afterChange: CollectionAfterChangeHook[]
  beforeRead: CollectionBeforeReadHook[]
  afterRead: CollectionAfterReadHook[]
  beforeDelete: CollectionBeforeDeleteHook[]
  afterDelete: CollectionAfterDeleteHook[]

  // Global hooks
  beforeLogin: GlobalBeforeLoginHook[]
  afterLogin: GlobalAfterLoginHook[]
  afterLogout: GlobalAfterLogoutHook[]
  refresh: GlobalRefreshHook[]

  // Field hooks
  beforeValidate: FieldBeforeValidateHook[]
  beforeChange: FieldBeforeChangeHook[]
  afterChange: FieldAfterChangeHook[]
  afterRead: FieldAfterReadHook[]
}
```

### Пример: Auto-slug hook

```typescript
/**
 * Auto-generate slug from title field
 */
import type { CollectionBeforeChangeHook } from 'payload'

export const autoSlugHook: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  // Only generate slug on create or if title changed
  if (operation === 'create' || (data?.title && data.title !== originalDoc?.title)) {
    if (data?.title && typeof data.title === 'string') {
      // Generate slug
      data.slug = slugify(data.title)

      // Ensure uniqueness
      let suffix = 0
      let uniqueSlug = data.slug

      while (await slugExists(uniqueSlug, req.payload, data.id)) {
        suffix++
        uniqueSlug = `${data.slug}-${suffix}`
      }

      data.slug = uniqueSlug
    }
  }

  return data
}

/**
 * Slugify helper
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/--+/g, '-')     // Replace multiple - with single -
    .trim()
}

/**
 * Check if slug exists
 */
async function slugExists(
  slug: string,
  payload: Payload,
  excludeId?: string | number
): Promise<boolean> {
  const result = await payload.find({
    collection: 'symbols',
    where: {
      and: [
        { slug: { equals: slug } },
        excludeId ? { id: { not_equals: excludeId } } : {},
      ],
    },
    limit: 1,
  })

  return result.docs.length > 0
}
```

### Пример: Audit log hook

```typescript
/**
 * Log all changes to audit log
 */
import type { CollectionAfterChangeHook } from 'payload'

export const auditLogHook: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
  collection,
}) => {
  // Skip for certain collections
  if (['audit_logs', 'media'].includes(collection.slug)) {
    return doc
  }

  // Create audit log entry
  await req.payload.create({
    collection: 'audit_logs',
    data: {
      action: operation,
      collection: collection.slug,
      documentId: String(doc.id),
      userId: req.user?.id ? String(req.user.id) : null,
      timestamp: new Date(),
      changes: operation === 'update' ? calculateChanges(previousDoc, doc) : undefined,
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
      userAgent: req.headers.get('user-agent'),
    },
  })

  return doc
}

/**
 * Calculate changes between documents
 */
function calculateChanges(
  before: Record<string, unknown>,
  after: Record<string, unknown>
): Record<string, { before: unknown; after: unknown }> {
  const changes: Record<string, { before: unknown; after: unknown }> = {}

  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)])

  for (const key of allKeys) {
    if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
      changes[key] = {
        before: before[key],
        after: after[key],
      }
    }
  }

  return changes
}
```

### Пример: BeforeIndex hook (Typesense)

```typescript
/**
 * Transform data before indexing in Typesense
 */
import type { CollectionAfterChangeHook } from 'payload'
import { getTypesenseClient } from '@/lib/typesense-api-complete'

export const beforeIndexHook: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  collection,
}) => {
  // Get tenant ID
  const tenantId = doc.tenant ? String(doc.tenant) : 'default'

  // Transform document for Typesense
  const indexableDoc = {
    id: String(doc.id),
    name: doc.name || doc.title || '',
    description: doc.description || '',
    tenant_id: tenantId,
    created_at: new Date(doc.createdAt).getTime() / 1000,
    updated_at: new Date(doc.updatedAt).getTime() / 1000,

    // Custom fields
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    category: doc.category || '',

    // Searchable content (combine multiple fields)
    searchable_content: [
      doc.name,
      doc.description,
      doc.content,
      ...(Array.isArray(doc.tags) ? doc.tags : []),
    ]
      .filter(Boolean)
      .join(' '),
  }

  // Index in Typesense
  const client = getTypesenseClient()
  const collectionName = `${collection.slug}_${tenantId}`

  try {
    await client.collections(collectionName).documents().upsert(indexableDoc)
  } catch (error) {
    console.error('Failed to index document:', error)
  }

  return doc
}
```

### Пример: Field-level hook

```typescript
/**
 * Encrypt sensitive field before saving
 */
import type { FieldHook } from 'payload'
import crypto from 'crypto'

export const encryptFieldHook: FieldHook = async ({ value, operation }) => {
  // Encrypt on create/update
  if ((operation === 'create' || operation === 'update') && value) {
    return encrypt(String(value))
  }

  return value
}

/**
 * Decrypt field after reading
 */
export const decryptFieldHook: FieldHook = async ({ value }) => {
  if (value && typeof value === 'string') {
    try {
      return decrypt(value)
    } catch {
      return value
    }
  }

  return value
}

/**
 * Encryption helpers
 */
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-me'
const ALGORITHM = 'aes-256-cbc'

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex').slice(0, 32),
    iv
  )

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  return `${iv.toString('hex')}:${encrypted}`
}

function decrypt(text: string): string {
  const [ivHex, encrypted] = text.split(':')
  const iv = Buffer.from(ivHex!, 'hex')

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex').slice(0, 32),
    iv
  )

  let decrypted = decipher.update(encrypted!, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}
```

### Применение hooks в коллекциях

```typescript
import type { CollectionConfig } from 'payload'
import { autoSlugHook } from '@/hooks/autoSlug'
import { auditLogHook } from '@/hooks/auditLog'
import { beforeIndexHook } from '@/hooks/beforeIndex'

export const Symbols: CollectionConfig = {
  slug: 'symbols',

  hooks: {
    beforeChange: [
      autoSlugHook,
    ],
    afterChange: [
      auditLogHook,
      beforeIndexHook,
    ],
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'apiKey',
      type: 'text',
      admin: {
        description: 'Encrypted API key',
      },
      hooks: {
        beforeChange: [encryptFieldHook],
        afterRead: [decryptFieldHook],
      },
    },
  ],
}
```

---

## Custom Field Types

Создание собственных типов полей для PayloadCMS.

### Структура custom field

```typescript
import type { Field } from 'payload'

export interface ColorPickerField extends Field {
  type: 'colorPicker'
  name: string
  defaultValue?: string
  format?: 'hex' | 'rgb' | 'hsl'
  presets?: string[]
}
```

### Пример: Color Picker Field

**server/fields/ColorPicker.ts**:

```typescript
/**
 * Color Picker Field - Server-side
 */
import type { Field, FieldHook } from 'payload'

export interface ColorPickerFieldProps {
  name: string
  label?: string
  defaultValue?: string
  format?: 'hex' | 'rgb' | 'hsl'
  presets?: string[]
  required?: boolean
  admin?: {
    condition?: (data: Record<string, unknown>) => boolean
    description?: string
  }
}

export const colorPickerField = (props: ColorPickerFieldProps): Field => {
  const {
    name,
    label,
    defaultValue = '#000000',
    format = 'hex',
    presets = [],
    required = false,
    admin = {},
  } = props

  // Validation hook
  const validateColor: FieldHook = ({ value }) => {
    if (!value) return true

    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    const rgbRegex = /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/
    const hslRegex = /^hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)$/

    const stringValue = String(value)

    switch (format) {
      case 'hex':
        if (!hexRegex.test(stringValue)) {
          return 'Invalid hex color format'
        }
        break
      case 'rgb':
        if (!rgbRegex.test(stringValue)) {
          return 'Invalid RGB color format'
        }
        break
      case 'hsl':
        if (!hslRegex.test(stringValue)) {
          return 'Invalid HSL color format'
        }
        break
    }

    return true
  }

  return {
    name,
    type: 'text',
    label: label || name,
    defaultValue,
    required,
    admin: {
      ...admin,
      components: {
        Field: '@/fields/ColorPicker/component#ColorPickerField',
      },
    },
    hooks: {
      beforeValidate: [validateColor],
    },
    custom: {
      format,
      presets,
    },
  }
}
```

**client/fields/ColorPicker/component.tsx**:

```typescript
'use client'

/**
 * Color Picker Field - Client component
 */
import React, { useState } from 'react'
import { useField, type FieldProps } from '@payloadcms/ui'

export const ColorPickerField: React.FC<FieldProps> = (props) => {
  const { path, field, value: initialValue, setValue } = useField(props)
  const [showPicker, setShowPicker] = useState(false)

  const format = field.custom?.format || 'hex'
  const presets = field.custom?.presets || []
  const value = String(initialValue || field.defaultValue || '#000000')

  const handleChange = (newValue: string) => {
    setValue(newValue)
  }

  return (
    <div className="field-type-color-picker">
      <label htmlFor={path} className="field-label">
        {field.label}
        {field.required && <span className="required">*</span>}
      </label>

      {field.admin?.description && (
        <p className="field-description">{field.admin.description}</p>
      )}

      <div className="color-picker-wrapper">
        {/* Color preview */}
        <div
          className="color-preview"
          style={{ backgroundColor: value }}
          onClick={() => setShowPicker(!showPicker)}
        />

        {/* Text input */}
        <input
          type="text"
          id={path}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Enter ${format} color`}
          className="color-input"
        />

        {/* Picker popover */}
        {showPicker && (
          <div className="color-picker-popover">
            <input
              type="color"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              className="native-picker"
            />

            {/* Presets */}
            {presets.length > 0 && (
              <div className="color-presets">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className="preset-button"
                    style={{ backgroundColor: preset }}
                    onClick={() => {
                      handleChange(preset)
                      setShowPicker(false)
                    }}
                    title={preset}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .field-type-color-picker {
          margin-bottom: 1rem;
        }

        .field-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .required {
          color: red;
          margin-left: 0.25rem;
        }

        .field-description {
          font-size: 0.875rem;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .color-picker-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .color-preview {
          width: 40px;
          height: 40px;
          border: 2px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .color-preview:hover {
          border-color: #999;
        }

        .color-input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: monospace;
        }

        .color-picker-popover {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 0.5rem;
          padding: 1rem;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }

        .native-picker {
          width: 200px;
          height: 150px;
          border: none;
          cursor: pointer;
        }

        .color-presets {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(30px, 1fr));
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .preset-button {
          width: 30px;
          height: 30px;
          border: 2px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .preset-button:hover {
          transform: scale(1.1);
          border-color: #999;
        }
      `}</style>
    </div>
  )
}
```

### Использование custom field

```typescript
import { colorPickerField } from '@/fields/ColorPicker'

export const BrandSettings: GlobalConfig = {
  slug: 'brand_settings',
  fields: [
    colorPickerField({
      name: 'primaryColor',
      label: 'Primary Brand Color',
      defaultValue: '#0070f3',
      format: 'hex',
      presets: [
        '#0070f3', '#ff0080', '#7928ca',
        '#ff4081', '#00e676', '#ffc400',
      ],
      required: true,
      admin: {
        description: 'Main brand color used throughout the application',
      },
    }),

    colorPickerField({
      name: 'secondaryColor',
      label: 'Secondary Color',
      defaultValue: '#666666',
      format: 'hex',
    }),
  ],
}
```

---

## Custom Search Algorithms

Расширение поисковых возможностей кастомными алгоритмами.

### Пример: Fuzzy Search Algorithm

```typescript
/**
 * Fuzzy search with Levenshtein distance
 */

export interface FuzzySearchOptions {
  maxDistance: number        // Maximum edit distance
  threshold: number          // Similarity threshold (0-1)
  caseSensitive?: boolean
  ignoreSpaces?: boolean
}

export class FuzzySearchAlgorithm {
  private options: Required<FuzzySearchOptions>

  constructor(options: FuzzySearchOptions) {
    this.options = {
      maxDistance: options.maxDistance,
      threshold: options.threshold,
      caseSensitive: options.caseSensitive ?? false,
      ignoreSpaces: options.ignoreSpaces ?? true,
    }
  }

  /**
   * Search documents using fuzzy matching
   */
  async search(
    query: string,
    documents: Array<Record<string, unknown>>,
    searchFields: string[]
  ): Promise<Array<{ doc: Record<string, unknown>; score: number }>> {
    const results: Array<{ doc: Record<string, unknown>; score: number }> = []

    // Normalize query
    const normalizedQuery = this.normalize(query)

    for (const doc of documents) {
      let bestScore = 0

      // Check each search field
      for (const field of searchFields) {
        const value = this.getFieldValue(doc, field)
        if (!value) continue

        const normalizedValue = this.normalize(String(value))
        const score = this.calculateSimilarity(normalizedQuery, normalizedValue)

        if (score > bestScore) {
          bestScore = score
        }
      }

      // Add to results if above threshold
      if (bestScore >= this.options.threshold) {
        results.push({ doc, score: bestScore })
      }
    }

    // Sort by score (descending)
    results.sort((a, b) => b.score - a.score)

    return results
  }

  /**
   * Calculate similarity score between two strings
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const distance = this.levenshteinDistance(str1, str2)
    const maxLength = Math.max(str1.length, str2.length)

    if (maxLength === 0) return 1
    if (distance > this.options.maxDistance) return 0

    return 1 - distance / maxLength
  }

  /**
   * Levenshtein distance algorithm
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0]![j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2[i - 1] === str1[j - 1]) {
          matrix[i]![j] = matrix[i - 1]![j - 1]!
        } else {
          matrix[i]![j] = Math.min(
            matrix[i - 1]![j - 1]! + 1, // substitution
            matrix[i]![j - 1]! + 1,     // insertion
            matrix[i - 1]![j]! + 1      // deletion
          )
        }
      }
    }

    return matrix[str2.length]![str1.length]!
  }

  /**
   * Normalize string
   */
  private normalize(str: string): string {
    let normalized = str

    if (!this.options.caseSensitive) {
      normalized = normalized.toLowerCase()
    }

    if (this.options.ignoreSpaces) {
      normalized = normalized.replace(/\s+/g, '')
    }

    return normalized.trim()
  }

  /**
   * Get field value from document
   */
  private getFieldValue(doc: Record<string, unknown>, field: string): unknown {
    const keys = field.split('.')
    let value: unknown = doc

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = (value as Record<string, unknown>)[key]
      } else {
        return undefined
      }
    }

    return value
  }
}
```

### Пример: Semantic Search with Embeddings

```typescript
/**
 * Semantic search using vector embeddings
 */

import { OpenAI } from 'openai'

export interface SemanticSearchOptions {
  model: string
  apiKey: string
  threshold?: number
  topK?: number
}

export class SemanticSearchAlgorithm {
  private openai: OpenAI
  private options: SemanticSearchOptions

  constructor(options: SemanticSearchOptions) {
    this.options = {
      threshold: 0.7,
      topK: 10,
      ...options,
    }

    this.openai = new OpenAI({
      apiKey: options.apiKey,
    })
  }

  /**
   * Generate embedding for text
   */
  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: this.options.model,
      input: text,
    })

    return response.data[0]!.embedding
  }

  /**
   * Search using semantic similarity
   */
  async search(
    query: string,
    documents: Array<{ id: string; embedding: number[]; data: Record<string, unknown> }>
  ): Promise<Array<{ id: string; score: number; data: Record<string, unknown> }>> {
    // Generate query embedding
    const queryEmbedding = await this.generateEmbedding(query)

    // Calculate cosine similarity for each document
    const results = documents.map((doc) => {
      const similarity = this.cosineSimilarity(queryEmbedding, doc.embedding)

      return {
        id: doc.id,
        score: similarity,
        data: doc.data,
      }
    })

    // Filter by threshold and sort
    return results
      .filter((result) => result.score >= (this.options.threshold ?? 0.7))
      .sort((a, b) => b.score - a.score)
      .slice(0, this.options.topK)
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same length')
    }

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i]! * vecB[i]!
      normA += vecA[i]! * vecA[i]!
      normB += vecB[i]! * vecB[i]!
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  /**
   * Batch generate embeddings
   */
  async batchGenerateEmbeddings(
    texts: string[],
    batchSize: number = 100
  ): Promise<number[][]> {
    const embeddings: number[][] = []

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize)

      const response = await this.openai.embeddings.create({
        model: this.options.model,
        input: batch,
      })

      embeddings.push(...response.data.map((item) => item.embedding))
    }

    return embeddings
  }
}
```

### Интеграция с Typesense

```typescript
/**
 * Custom search algorithm endpoint
 */

import { fuzzySearchAlgorithm } from '@/lib/search/fuzzy'
import { semanticSearchAlgorithm } from '@/lib/search/semantic'

export default async function customSearchHandler(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')
  const algorithm = searchParams.get('algorithm') || 'default'
  const collection = searchParams.get('collection') || 'symbols'

  if (!query) {
    return Response.json({ error: 'Query parameter required' }, { status: 400 })
  }

  // Get documents from Payload
  const docs = await req.payload.find({
    collection,
    limit: 1000,
  })

  let results

  switch (algorithm) {
    case 'fuzzy':
      const fuzzy = new FuzzySearchAlgorithm({
        maxDistance: 3,
        threshold: 0.6,
      })
      results = await fuzzy.search(query, docs.docs, ['name', 'description'])
      break

    case 'semantic':
      // Assuming embeddings are pre-generated and stored
      const semantic = new SemanticSearchAlgorithm({
        model: 'text-embedding-ada-002',
        apiKey: process.env.OPENAI_API_KEY!,
        threshold: 0.7,
        topK: 20,
      })

      const docsWithEmbeddings = docs.docs.map((doc) => ({
        id: String(doc.id),
        embedding: doc.embedding as number[],
        data: doc,
      }))

      results = await semantic.search(query, docsWithEmbeddings)
      break

    default:
      // Use Typesense default
      return Response.json({ error: 'Unknown algorithm' }, { status: 400 })
  }

  return Response.json({
    results: results.map((r) => ({
      ...r.doc || r.data,
      _score: r.score,
    })),
    total: results.length,
  })
}
```

Продолжение следует... (файл слишком большой, разобью на несколько частей)
