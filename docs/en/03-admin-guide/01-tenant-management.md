# Управление Tenant'ами

> Полное руководство по созданию, настройке и управлению tenant'ами (организациями) в AACSearch Platform.

## Содержание

- [Введение](#введение)
- [Что такое Tenant](#что-такое-tenant)
- [Создание Tenant](#создание-tenant)
- [Настройка организации](#настройка-организации)
- [Кастомные домены](#кастомные-домены)
- [Настройки Tenant](#настройки-tenant)
- [Управление планом подписки](#управление-планом-подписки)
- [Transfer Ownership](#transfer-ownership)
- [Удаление Tenant](#удаление-tenant)
- [Troubleshooting](#troubleshooting)

---

## Введение

Tenant (организация) — это изолированная единица данных в AACSearch Platform. Каждый tenant имеет собственных пользователей, данные, настройки и подписку.

### Ключевые концепции

- **Multi-Tenancy** — строгая изоляция данных между организациями
- **Slug** — уникальный идентификатор tenant (используется в URLs)
- **Domain** — кастомный домен для tenant (опционально)
- **Plan** — тарифный план с лимитами
- **Owner** — владелец организации с полными правами

### Архитектура

```
┌─────────────────────────────────────────┐
│           Platform Level                │
│  (Platform Admins управляют всем)       │
└────────────────┬────────────────────────┘
                 │
     ┌───────────┴───────────┐
     │                       │
┌────▼─────┐         ┌──────▼───┐
│ Tenant A │         │ Tenant B │
├──────────┤         ├──────────┤
│ Users    │         │ Users    │
│ Data     │         │ Data     │
│ Settings │         │ Settings │
│ Plan     │         │ Plan     │
└──────────┘         └──────────┘
```

---

## Что такое Tenant

### Определение

**Tenant** — это изолированная организация в платформе со следующими характеристиками:

1. **Уникальный идентификатор** (slug)
2. **Собственные пользователи** через Memberships
3. **Изолированные данные** (Row Level Security)
4. **Отдельная подписка** и биллинг
5. **Независимые настройки** (locale, features)

### Структура Tenant

```typescript
interface Tenant {
  id: string
  name: string              // Название организации
  slug: string              // Уникальный slug (acme-corp)
  domain?: string           // Кастомный домен (search.acme.com)
  plan: string | Plan       // Связь с тарифным планом
  settings: {
    localeDefault: string   // Язык по умолчанию (en, ru, etc)
    features: TenantFeatures
  }
  createdAt: Date
  updatedAt: Date
}

interface TenantFeatures {
  drafts: boolean           // Черновики
  versions: boolean         // Версионирование
  trash: boolean            // Корзина
  searchType: 'text' | 'hybrid' | 'image' | 'geo'
  indexingMode: 'realtime' | 'batch'
}
```

### Примеры

**SaaS компания:**
```json
{
  "name": "Acme Corporation",
  "slug": "acme-corp",
  "domain": "search.acme.com",
  "plan": "enterprise",
  "settings": {
    "localeDefault": "en",
    "features": {
      "drafts": true,
      "versions": true,
      "trash": true,
      "searchType": "hybrid",
      "indexingMode": "realtime"
    }
  }
}
```

**Стартап:**
```json
{
  "name": "TechStart",
  "slug": "techstart",
  "plan": "starter",
  "settings": {
    "localeDefault": "en",
    "features": {
      "drafts": false,
      "versions": false,
      "trash": true,
      "searchType": "text",
      "indexingMode": "batch"
    }
  }
}
```

---

## Создание Tenant

### Метод 1: Через Wizard (Рекомендуется)

Wizard — это пошаговый интерфейс для создания tenant с автоматической настройкой всех компонентов.

#### Шаг 1: Доступ к Wizard

**URL:** `https://yourdomain.com/admin/wizard/new-tenant`

**Требования:**
- Роль: `platform:admin` или специальное разрешение
- Активная сессия

#### Шаг 2: Basic Information

![Wizard Step 1 - Basic Info](../assets/wizard-step-1.png)

**Поля:**

| Поле | Тип | Обязательно | Описание | Пример |
|------|-----|-------------|----------|--------|
| **Name** | Text | ✅ | Название организации | "Acme Corporation" |
| **Slug** | Text | ✅ | URL-friendly идентификатор | "acme-corp" |
| **Domain** | Text | ❌ | Кастомный домен | "search.acme.com" |
| **Locale** | Select | ✅ | Язык по умолчанию | "en" |

**Validation правила:**

- **Name:**
  - Минимум 2 символа
  - Максимум 100 символов
  - Допустимы буквы, цифры, пробелы, дефисы

- **Slug:**
  - Минимум 3 символа
  - Максимум 50 символов
  - Только lowercase буквы, цифры, дефисы
  - Уникальность в пределах платформы
  - Regex: `^[a-z0-9]+(?:-[a-z0-9]+)*$`

- **Domain:**
  - Валидный DNS формат
  - HTTPS поддержка обязательна
  - Уникальность в пределах платформы
  - Regex: `^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$`

**Пример валидации:**

```typescript
// Валидный slug
"acme-corp"        ✅
"tech-start-2024"  ✅
"my-company"       ✅

// Невалидный slug
"Acme Corp"        ❌ (uppercase, пробелы)
"acme_corp"        ❌ (underscore)
"-acme"            ❌ (начинается с дефиса)
"ac"               ❌ (слишком короткий)
```

#### Шаг 3: Features Configuration

![Wizard Step 2 - Features](../assets/wizard-step-2.png)

**Включение/выключение функций:**

| Feature | Описание | Рекомендация | Влияние на производительность |
|---------|----------|--------------|------------------------------|
| **Drafts** | Черновики документов | Включить для CMS | Низкое |
| **Versions** | История изменений | Включить для аудита | Среднее (+20% storage) |
| **Trash** | Корзина удаленных | Всегда включать | Низкое |
| **Auto-save** | Автосохранение | Для редакторов | Среднее (частые writes) |

**Пример конфигурации:**

```json
{
  "features": {
    "drafts": true,
    "versions": true,
    "trash": true,
    "autoSave": false,
    "maxVersionsPerDoc": 10,
    "trashRetentionDays": 30
  }
}
```

#### Шаг 4: Search Type Selection

![Wizard Step 3 - Search Type](../assets/wizard-step-3.png)

**Типы поиска:**

**1. Text Search** (базовый)
- Полнотекстовый поиск по строкам
- Быстрый и эффективный
- Низкие требования к ресурсам
- **Использование:** Блоги, документация, каталоги

**2. Hybrid Search** (рекомендуется)
- Комбинация text + vector search
- Semantic поиск (по смыслу)
- Средние требования к ресурсам
- **Использование:** E-commerce, FAQ, knowledge bases

**3. Image Search**
- Поиск по изображениям
- Требует vector embeddings
- Высокие требования к ресурсам
- **Использование:** Галереи, медиа-библиотеки

**4. Geo Search**
- Поиск с геолокацией
- Radius и polygon фильтры
- Средние требования к ресурсам
- **Использование:** Карты, локации, доставка

**Сравнительная таблица:**

| Тип | Скорость | Storage | Complexity | Use Cases |
|-----|----------|---------|------------|-----------|
| Text | 🟢 Быстро | 🟢 Низко | 🟢 Просто | Документы, блоги |
| Hybrid | 🟡 Средне | 🟡 Средне | 🟡 Средне | E-commerce, FAQ |
| Image | 🔴 Медленно | 🔴 Высоко | 🔴 Сложно | Галереи, media |
| Geo | 🟡 Средне | 🟢 Низко | 🟡 Средне | Карты, локации |

#### Шаг 5: Indexing Mode

![Wizard Step 4 - Indexing](../assets/wizard-step-4.png)

**Режимы индексации:**

**1. Realtime (Real-time)**
```json
{
  "indexing": {
    "mode": "realtime",
    "realtime": true,
    "batch": false,
    "dualWrite": false
  }
}
```

**Характеристики:**
- ✅ Мгновенная индексация после сохранения
- ✅ Данные доступны сразу в поиске
- ❌ Высокая нагрузка на Typesense
- ❌ Больше ресурсов

**Использование:** CMS, чаты, новостные сайты

**2. Batch (Пакетная)**
```json
{
  "indexing": {
    "mode": "batch",
    "realtime": false,
    "batch": true,
    "batchInterval": "5m",
    "batchSize": 1000
  }
}
```

**Характеристики:**
- ✅ Низкая нагрузка на систему
- ✅ Эффективная обработка
- ❌ Задержка индексации (5-15 минут)
- ❌ Данные не сразу в поиске

**Использование:** Аналитика, отчеты, архивы

**3. Dual Write (Гибридный)**
```json
{
  "indexing": {
    "mode": "dual",
    "realtime": true,
    "batch": true,
    "dualWrite": true
  }
}
```

**Характеристики:**
- ✅ Realtime для критичных данных
- ✅ Batch для фоновых задач
- ✅ Балансировка нагрузки
- ❌ Сложная настройка

**Использование:** Большие платформы с разными типами данных

#### Шаг 6: Plan Selection

![Wizard Step 5 - Plan](../assets/wizard-step-5.png)

**Выбор тарифного плана:**

| Plan | Цена | Users | Documents | Searches/мес | Storage |
|------|------|-------|-----------|--------------|---------|
| **Starter** | $29/мес | 5 | 10,000 | 50,000 | 1 GB |
| **Pro** | $99/мес | 25 | 100,000 | 500,000 | 10 GB |
| **Enterprise** | Custom | ∞ | ∞ | ∞ | ∞ |

**Рекомендации:**

- **Starter:** Стартапы, MVP, тестирование
- **Pro:** Малый/средний бизнес, production
- **Enterprise:** Корпорации, высокие нагрузки

#### Шаг 7: Review & Create

![Wizard Step 6 - Review](../assets/wizard-step-6.png)

**Предпросмотр конфигурации:**

```yaml
Tenant Configuration:
  Name: Acme Corporation
  Slug: acme-corp
  Domain: search.acme.com
  Locale: en

Features:
  Drafts: Enabled
  Versions: Enabled (max 10 per doc)
  Trash: Enabled (30 days retention)

Search:
  Type: Hybrid (Text + Vector)
  Indexing: Realtime

Plan:
  Name: Pro
  Price: $99/month
  Users: Up to 25
  Documents: Up to 100,000
  Searches: Up to 500,000/month
```

**Действия при создании:**

1. ✅ Валидация всех параметров
2. ✅ Проверка уникальности slug и domain
3. ✅ Создание записи в коллекции `tenants`
4. ✅ Создание Typesense collection (если realtime)
5. ✅ Генерация начальных API ключей
6. ✅ Создание membership для создателя (role: owner)
7. ✅ Отправка welcome email
8. ✅ Создание начальной subscription

**Время создания:** 5-30 секунд (зависит от indexing mode)

### Метод 2: Через API

Для программного создания tenant используйте REST API.

#### Endpoint

```http
POST /api/admin/collections/tenants
Authorization: Bearer <admin_token>
Content-Type: application/json
```

#### Request Body

```json
{
  "name": "Acme Corporation",
  "slug": "acme-corp",
  "domain": "search.acme.com",
  "plan": "pro_plan_id",
  "settings": {
    "localeDefault": "en",
    "features": {
      "drafts": true,
      "versions": true,
      "trash": true,
      "searchType": "hybrid",
      "indexingMode": "realtime"
    }
  }
}
```

#### Response

```json
{
  "doc": {
    "id": "tenant_abc123",
    "name": "Acme Corporation",
    "slug": "acme-corp",
    "domain": "search.acme.com",
    "plan": {
      "id": "pro_plan_id",
      "name": "Pro",
      "priceMonthlyCents": 9900
    },
    "settings": {
      "localeDefault": "en",
      "features": { ... }
    },
    "createdAt": "2025-11-02T10:00:00Z",
    "updatedAt": "2025-11-02T10:00:00Z"
  }
}
```

#### Error Responses

**400 Bad Request** — Валидация не прошла
```json
{
  "errors": [
    {
      "field": "slug",
      "message": "Slug must be unique",
      "value": "acme-corp"
    }
  ]
}
```

**401 Unauthorized** — Нет прав доступа
```json
{
  "error": "Unauthorized",
  "message": "Platform admin role required"
}
```

**409 Conflict** — Slug или domain уже существует
```json
{
  "error": "Conflict",
  "message": "Tenant with slug 'acme-corp' already exists"
}
```

#### cURL Example

```bash
curl -X POST https://yourdomain.com/api/admin/collections/tenants \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corporation",
    "slug": "acme-corp",
    "plan": "pro_plan_id",
    "settings": {
      "localeDefault": "en",
      "features": {
        "drafts": true,
        "versions": true,
        "trash": true,
        "searchType": "hybrid",
        "indexingMode": "realtime"
      }
    }
  }'
```

#### TypeScript Example

```typescript
import { createTenant } from '@/lib/api'

async function setupNewTenant() {
  try {
    const tenant = await createTenant({
      name: 'Acme Corporation',
      slug: 'acme-corp',
      domain: 'search.acme.com',
      plan: 'pro_plan_id',
      settings: {
        localeDefault: 'en',
        features: {
          drafts: true,
          versions: true,
          trash: true,
          searchType: 'hybrid',
          indexingMode: 'realtime',
        },
      },
    })

    console.log('Tenant created:', tenant.id)

    // Создание owner membership
    await createMembership({
      tenant: tenant.id,
      user: 'user_id',
      role: 'owner',
    })

    // Генерация API ключей
    await generateAPIKeys(tenant.id)

    return tenant
  } catch (error) {
    console.error('Failed to create tenant:', error)
    throw error
  }
}
```

### Метод 3: Через CLI

Для DevOps и автоматизации используйте CLI инструмент.

```bash
# Базовое создание
npm run cli tenant:create \
  --name "Acme Corporation" \
  --slug acme-corp \
  --plan pro

# С дополнительными параметрами
npm run cli tenant:create \
  --name "Acme Corporation" \
  --slug acme-corp \
  --domain search.acme.com \
  --plan pro \
  --locale en \
  --features drafts,versions,trash \
  --search-type hybrid \
  --indexing realtime

# С JSON конфигом
npm run cli tenant:create --config tenant-config.json
```

**tenant-config.json:**
```json
{
  "name": "Acme Corporation",
  "slug": "acme-corp",
  "domain": "search.acme.com",
  "plan": "pro",
  "settings": {
    "localeDefault": "en",
    "features": {
      "drafts": true,
      "versions": true,
      "trash": true,
      "searchType": "hybrid",
      "indexingMode": "realtime"
    }
  },
  "owner": {
    "email": "admin@acme.com",
    "name": "John Doe"
  }
}
```

---

## Настройка организации

После создания tenant можно изменить его настройки.

### Обновление базовой информации

#### Через Admin UI

1. Перейти в **Admin → Tenants**
2. Найти нужный tenant
3. Нажать **Edit**
4. Изменить поля
5. Сохранить

#### Через API

```http
PATCH /api/admin/collections/tenants/:id
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Acme Corporation Inc.",
  "domain": "search.acme.com"
}
```

**Response:**
```json
{
  "doc": {
    "id": "tenant_abc123",
    "name": "Acme Corporation Inc.",
    "slug": "acme-corp",
    "domain": "search.acme.com",
    "updatedAt": "2025-11-02T11:00:00Z"
  },
  "message": "Tenant updated successfully"
}
```

### Изменение slug

⚠️ **ВНИМАНИЕ:** Изменение slug может сломать существующие интеграции!

**Процедура:**

1. Уведомить всех пользователей tenant
2. Обновить slug через API
3. Обновить все ссылки и интеграции
4. Настроить редирект со старого slug
5. Обновить DNS (если используется кастомный домен)

```typescript
// Пример с редиректом
await updateTenantSlug({
  tenantId: 'tenant_abc123',
  newSlug: 'acme-inc',
  createRedirect: true, // Создать редирект
  notifyUsers: true,    // Уведомить пользователей
})
```

### Настройка локали

Изменение языка по умолчанию:

```http
PATCH /api/admin/collections/tenants/:id
```

```json
{
  "settings": {
    "localeDefault": "ru"
  }
}
```

**Поддерживаемые локали:**
- `en` — English
- `ru` — Русский
- `de` — Deutsch
- `fr` — Français
- `es` — Español
- `zh` — 中文

---

## Кастомные домены

Кастомный домен позволяет использовать собственный URL для поиска.

### Требования

- Валидный DNS домен
- SSL сертификат (Let's Encrypt)
- CNAME или A запись на платформу

### Настройка DNS

#### Вариант 1: CNAME (рекомендуется)

```dns
search.acme.com.  CNAME  platform.aacsearch.com.
```

#### Вариант 2: A Record

```dns
search.acme.com.  A  1.2.3.4
```

### Добавление домена

#### Через Admin UI

1. **Tenants → Edit Tenant**
2. Поле **Domain:** `search.acme.com`
3. **Save**
4. Дождаться DNS propagation (до 24 часов)
5. SSL будет настроен автоматически

#### Через API

```http
PATCH /api/admin/collections/tenants/:id
```

```json
{
  "domain": "search.acme.com"
}
```

### Проверка статуса

```bash
# Проверка DNS
dig search.acme.com

# Проверка SSL
curl -I https://search.acme.com
```

### SSL сертификаты

Платформа автоматически создает SSL сертификаты через Let's Encrypt.

**Статусы:**
- `pending` — Ожидание DNS propagation
- `provisioning` — Создание сертификата
- `active` — Сертификат активен
- `failed` — Ошибка создания

**Проверка статуса:**

```http
GET /api/admin/tenants/:id/ssl-status
```

```json
{
  "domain": "search.acme.com",
  "status": "active",
  "certificate": {
    "issuer": "Let's Encrypt",
    "validFrom": "2025-11-01T00:00:00Z",
    "validTo": "2026-02-01T00:00:00Z",
    "autoRenew": true
  }
}
```

### Troubleshooting

**Проблема:** DNS не резолвится

```bash
# Проверка DNS propagation
nslookup search.acme.com
dig search.acme.com @8.8.8.8
```

**Решение:** Подождать 24-48 часов или обновить TTL

**Проблема:** SSL сертификат не создается

**Причины:**
- DNS не настроен правильно
- Порт 80/443 закрыт
- Rate limit Let's Encrypt

**Решение:**
```bash
# Проверка доступности
curl -I http://search.acme.com/.well-known/acme-challenge/test

# Перезапуск provisioning
npm run cli ssl:retry --domain search.acme.com
```

---

## Настройки Tenant

### Features (функции)

Включение/выключение функций tenant.

```typescript
interface TenantFeatures {
  drafts: boolean
  versions: boolean
  trash: boolean
  autoSave: boolean
  maxVersionsPerDoc: number
  trashRetentionDays: number
  searchType: 'text' | 'hybrid' | 'image' | 'geo'
  indexingMode: 'realtime' | 'batch' | 'dual'
}
```

#### Обновление features

```http
PATCH /api/admin/collections/tenants/:id
```

```json
{
  "settings": {
    "features": {
      "drafts": true,
      "versions": true,
      "maxVersionsPerDoc": 20,
      "trash": true,
      "trashRetentionDays": 60
    }
  }
}
```

### Лимиты

Лимиты определяются тарифным планом, но могут быть переопределены.

```typescript
interface TenantLimits {
  maxUsers?: number
  maxDocuments?: number
  maxSearches?: number
  maxStorageGB?: number
  maxAPICallsPerMin?: number
}
```

#### Просмотр лимитов

```http
GET /api/admin/tenants/:id/limits
```

```json
{
  "tenant": "acme-corp",
  "plan": "Pro",
  "limits": {
    "maxUsers": 25,
    "maxDocuments": 100000,
    "maxSearches": 500000,
    "maxStorageGB": 10,
    "maxAPICallsPerMin": 1000
  },
  "current": {
    "users": 12,
    "documents": 45230,
    "searches": 234560,
    "storageGB": 4.2
  },
  "usage": {
    "users": "48%",
    "documents": "45.2%",
    "searches": "46.9%",
    "storage": "42%"
  }
}
```

#### Переопределение лимитов

⚠️ Только для platform admins

```http
POST /api/admin/tenants/:id/override-limits
```

```json
{
  "limits": {
    "maxUsers": 50,
    "maxDocuments": 200000
  },
  "reason": "Enterprise trial extended",
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

---

## Управление планом подписки

См. подробнее: [03-billing.md](./03-billing.md)

### Просмотр текущего плана

```http
GET /api/admin/tenants/:id/subscription
```

```json
{
  "tenant": "acme-corp",
  "subscription": {
    "plan": {
      "name": "Pro",
      "slug": "pro",
      "price": 9900
    },
    "status": "active",
    "currentPeriodStart": "2025-11-01T00:00:00Z",
    "currentPeriodEnd": "2025-12-01T00:00:00Z",
    "cancelAtPeriodEnd": false
  }
}
```

### Смена плана

```http
POST /api/billing/change-plan
```

```json
{
  "tenantId": "tenant_abc123",
  "newPlanId": "enterprise_plan_id",
  "proration": true
}
```

---

## Transfer Ownership

Передача владения tenant другому пользователю.

### Процедура

1. **Проверка** — убедиться, что новый владелец существует
2. **Уведомление** — отправить email обоим владельцам
3. **Transfer** — обновить membership
4. **Audit** — записать в логи

### Через Admin UI

1. **Tenants → Select Tenant**
2. **Members → Owner**
3. **Transfer Ownership**
4. Выбрать нового владельца
5. Подтвердить

### Через API

```http
POST /api/admin/tenants/:id/transfer-ownership
```

```json
{
  "newOwnerId": "user_xyz789",
  "reason": "Company acquisition",
  "notifyUsers": true
}
```

**Response:**
```json
{
  "success": true,
  "oldOwner": {
    "id": "user_abc123",
    "email": "old@acme.com"
  },
  "newOwner": {
    "id": "user_xyz789",
    "email": "new@acme.com"
  },
  "transferredAt": "2025-11-02T12:00:00Z"
}
```

### Что происходит

- ✅ Старый owner → роль `admin`
- ✅ Новый owner → роль `owner`
- ✅ Email уведомления обоим
- ✅ Audit log запись
- ✅ Обновление billing contact (опционально)

---

## Удаление Tenant

⚠️ **КРИТИЧЕСКИ ВАЖНО:** Удаление tenant необратимо и удаляет ВСЕ данные!

### Процедура удаления

#### Шаг 1: Backup данных

```bash
# Создать snapshot
npm run cli backup:create --tenant acme-corp --type full

# Экспорт данных
npm run cli export --tenant acme-corp --format jsonl
```

#### Шаг 2: Уведомление пользователей

```typescript
await notifyTenantUsers({
  tenantId: 'tenant_abc123',
  message: 'Tenant будет удален через 7 дней',
  urgency: 'high',
})
```

#### Шаг 3: Soft Delete (рекомендуется)

```http
POST /api/admin/tenants/:id/soft-delete
```

```json
{
  "reason": "Account closed by owner",
  "retentionDays": 30
}
```

**Что происходит:**
- Tenant помечается как `deleted`
- Доступ блокируется
- Данные сохраняются 30 дней
- Можно восстановить

#### Шаг 4: Hard Delete

⚠️ Только после soft delete

```http
DELETE /api/admin/tenants/:id/hard-delete
Authorization: Bearer <platform_admin_token>
```

```json
{
  "confirmSlug": "acme-corp",
  "confirmPhrase": "DELETE PERMANENTLY"
}
```

**Что удаляется:**
- ✅ Все документы tenant
- ✅ Все пользователи (memberships)
- ✅ API ключи
- ✅ Typesense collections
- ✅ Subscription и billing данные
- ✅ Audit logs (опционально)

### Восстановление после Soft Delete

```http
POST /api/admin/tenants/:id/restore
```

```json
{
  "reason": "Customer changed mind",
  "restoreBilling": true
}
```

---

## Troubleshooting

### Tenant не создается

**Проблема:** Ошибка "Slug already exists"

**Причина:** Slug не уникален

**Решение:**
```bash
# Проверка существующих slugs
npm run cli tenant:list --slugs-only

# Использование другого slug
acme-corp-2024
```

---

**Проблема:** Ошибка "Plan not found"

**Причина:** Неверный plan ID

**Решение:**
```bash
# Список доступных планов
npm run cli plans:list
```

---

### Кастомный домен не работает

**Проблема:** DNS не резолвится

**Диагностика:**
```bash
dig search.acme.com
nslookup search.acme.com 8.8.8.8
```

**Решение:**
1. Проверить CNAME запись
2. Подождать DNS propagation (24-48 часов)
3. Очистить DNS cache

---

**Проблема:** SSL не создается

**Диагностика:**
```bash
# Проверка SSL status
curl -I https://search.acme.com

# Логи
npm run cli logs --filter ssl --tenant acme-corp
```

**Решение:**
1. Проверить порты 80/443
2. Проверить firewall
3. Перезапустить provisioning

---

### Лимиты превышены

**Проблема:** "User limit exceeded"

**Решение:**
1. Апгрейд плана → [03-billing.md](./03-billing.md#апгрейд-плана)
2. Или временное переопределение лимитов

```http
POST /api/admin/tenants/:id/override-limits
{
  "limits": { "maxUsers": 30 },
  "expiresAt": "2025-12-01"
}
```

---

## Best Practices

### Naming Conventions

✅ **Рекомендуется:**
- Slug: `company-name` (lowercase, дефисы)
- Name: `Company Name Inc.` (Title Case)
- Domain: `search.company.com` (subdomain)

❌ **Избегайте:**
- Slug: `CompanyName`, `company_name` (uppercase, underscores)
- Name: `COMPANY NAME` (all caps)
- Domain: `company.com/search` (путь вместо subdomain)

### Планирование ресурсов

**Starter Plan:**
- Подходит для: MVP, тестирование, малые проекты
- Не подходит для: Production с высокой нагрузкой

**Pro Plan:**
- Подходит для: Малый/средний бизнес, production
- Не подходит для: Enterprise-уровень

**Enterprise Plan:**
- Подходит для: Корпорации, высокие нагрузки, compliance
- Кастомные SLA и support

### Безопасность

1. **Регулярная ротация API ключей** (каждые 90 дней)
2. **Использование scoped keys** для клиентских приложений
3. **Мониторинг аудит логов** на подозрительную активность
4. **Backup каждый день** (автоматический snapshot)
5. **2FA для всех администраторов** tenant

---

**Версия:** 1.0.0
**Дата обновления:** 2025-11-02
**Следующий раздел:** [02-users-and-roles.md](./02-users-and-roles.md)
