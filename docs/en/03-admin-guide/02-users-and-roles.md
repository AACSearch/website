# Пользователи и роли

> Полное руководство по управлению пользователями, ролями и правами доступа в AACSearch Platform.

## Содержание

- [Система ролей](#система-ролей)
- [Memberships](#memberships)
- [Создание пользователей](#создание-пользователей)
- [Приглашение по email](#приглашение-по-email)
- [Управление доступом](#управление-доступом)
- [Permissions per role](#permissions-per-role)
- [Деактивация пользователей](#деактивация-пользователей)
- [Аудит действий](#аудит-действий)

---

## Система ролей

### Иерархия ролей

```
Platform Level:
└── platform:admin (супер-админ всей платформы)

Tenant Level:
├── owner (владелец организации)
├── admin (администратор)
├── editor (редактор)
└── viewer (наблюдатель)
```

### Таблица ролей

| Роль | Уровень | Создание | Чтение | Обновление | Удаление | Настройки | Биллинг | Пользователи |
|------|---------|----------|--------|------------|----------|-----------|---------|--------------|
| **platform:admin** | Platform | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **owner** | Tenant | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **admin** | Tenant | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **editor** | Tenant | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **viewer** | Tenant | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Определение ролей

#### Platform Admin

**Описание:** Супер-администратор всей платформы

**Возможности:**
- Управление всеми tenant'ами
- Создание/удаление организаций
- Управление тарифными планами
- Доступ ко всем данным
- Системные настройки
- Мониторинг всей платформы

**Назначение:** Только DevOps/Platform team

```typescript
// Проверка platform admin
function isPlatformAdmin(user: User): boolean {
  return user.platformRole === 'platform:admin'
}
```

#### Owner

**Описание:** Владелец tenant (организации)

**Возможности:**
- Полный контроль над tenant
- Управление подпиской и биллингом
- Transfer ownership
- Управление всеми пользователями
- Все права admin + billing

**Назначение:** Создатель tenant или transfer от предыдущего owner

**Ограничения:**
- Только один owner на tenant
- Не может быть удален (только transfer)

#### Admin

**Описание:** Администратор tenant

**Возможности:**
- Управление пользователями
- Настройки tenant (кроме billing)
- Создание/удаление контента
- Управление API ключами
- Просмотр аналитики

**Назначение:** Owner или другой admin

**Ограничения:**
- Не может изменять подписку
- Не может удалить tenant
- Не может удалить owner

#### Editor

**Описание:** Редактор контента

**Возможности:**
- Создание контента
- Редактирование своего контента
- Чтение всего контента
- Использование поиска

**Назначение:** Admin или owner

**Ограничения:**
- Не может удалять контент
- Не видит настройки tenant
- Не видит биллинг
- Не может управлять пользователями

#### Viewer

**Описание:** Наблюдатель (read-only)

**Возможности:**
- Просмотр контента
- Использование поиска
- Экспорт данных (если разрешено)

**Назначение:** Admin или owner

**Ограничения:**
- Только чтение
- Не может создавать/редактировать
- Не видит настройки
- Не видит биллинг

---

## Memberships

### Что такое Membership

**Membership** — это связь User ↔ Tenant с назначенной ролью.

```typescript
interface Membership {
  id: string
  tenant: string | Tenant
  user: string | User
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  createdAt: Date
  updatedAt: Date
}
```

### Схема

```
┌─────────┐       ┌──────────────┐       ┌─────────┐
│  User   │◄──────┤  Membership  ├──────►│ Tenant  │
├─────────┤       ├──────────────┤       ├─────────┤
│ id      │       │ user_id      │       │ id      │
│ email   │       │ tenant_id    │       │ name    │
│ name    │       │ role         │       │ slug    │
└─────────┘       └──────────────┘       └─────────┘
```

### Пример

Пользователь может быть членом нескольких tenant'ов с разными ролями:

```json
[
  {
    "user": "john@example.com",
    "tenant": "acme-corp",
    "role": "owner"
  },
  {
    "user": "john@example.com",
    "tenant": "startup-inc",
    "role": "admin"
  },
  {
    "user": "john@example.com",
    "tenant": "client-project",
    "role": "viewer"
  }
]
```

### Создание Membership

#### Через API

```http
POST /api/admin/collections/memberships
Authorization: Bearer <admin_token>
Content-Type: application/json
```

```json
{
  "tenant": "tenant_abc123",
  "user": "user_xyz789",
  "role": "editor"
}
```

#### Через CLI

```bash
npm run cli membership:create \
  --tenant acme-corp \
  --user john@example.com \
  --role editor
```

### Изменение роли

```http
PATCH /api/admin/collections/memberships/:id
```

```json
{
  "role": "admin"
}
```

⚠️ **Ограничения:**
- Owner может изменить роль любого пользователя (кроме себя)
- Admin может изменить роль editor/viewer
- Нельзя изменить роль owner (только transfer)

---

## Создание пользователей

### Метод 1: Через Admin UI

1. **Admin → Users → Create New**
2. Заполнить форму:
   - Email (обязательно, уникальный)
   - Name
   - Password (или отправить invite)
3. **Save**
4. Создать membership для tenant

### Метод 2: Через API

```http
POST /api/admin/collections/users
Authorization: Bearer <admin_token>
```

```json
{
  "email": "john@example.com",
  "name": "John Doe",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "doc": {
    "id": "user_xyz789",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2025-11-02T10:00:00Z"
  }
}
```

### Метод 3: Self-Registration

Пользователи могут регистрироваться сами (если включено в настройках tenant).

```http
POST /api/auth/register
```

```json
{
  "email": "john@example.com",
  "name": "John Doe",
  "password": "securePassword123",
  "tenant": "acme-corp"
}
```

⚠️ **Требует approval** от admin или owner (опционально)

---

## Приглашение по email

### Процесс приглашения

1. Admin/Owner создает invite
2. Система отправляет email с ссылкой
3. Пользователь переходит по ссылке
4. Создается аккаунт и membership
5. Пользователь получает доступ

### Создание invite

```http
POST /api/invites/create
Authorization: Bearer <admin_token>
```

```json
{
  "email": "new-user@example.com",
  "tenant": "acme-corp",
  "role": "editor",
  "expiresIn": 604800,
  "message": "Welcome to Acme Corp team!"
}
```

**Response:**
```json
{
  "invite": {
    "id": "invite_abc123",
    "email": "new-user@example.com",
    "tenant": "acme-corp",
    "role": "editor",
    "token": "inv_secret_token_here",
    "expiresAt": "2025-11-09T10:00:00Z",
    "status": "pending"
  },
  "inviteLink": "https://yourdomain.com/accept-invite?token=inv_secret_token_here"
}
```

### Email шаблон

```html
<h1>Вы приглашены в Acme Corporation</h1>

<p>Здравствуйте!</p>

<p>Вы были приглашены присоединиться к организации <strong>Acme Corporation</strong> 
   в качестве <strong>Editor</strong>.</p>

<p>
  <a href="https://yourdomain.com/accept-invite?token=inv_secret_token_here">
    Принять приглашение
  </a>
</p>

<p>Ссылка действительна 7 дней.</p>
```

### Принятие invite

```http
POST /api/invites/accept
```

```json
{
  "token": "inv_secret_token_here",
  "name": "John Doe",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_xyz789",
    "email": "new-user@example.com",
    "name": "John Doe"
  },
  "membership": {
    "tenant": "acme-corp",
    "role": "editor"
  },
  "session": {
    "token": "session_token_here",
    "expiresAt": "2025-11-03T10:00:00Z"
  }
}
```

---

## Управление доступом

### Access Control Rules

PayloadCMS использует функции access control для проверки прав:

```typescript
// Пример из src/collections/Users/index.ts
export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  // ...
}
```

### Tenant Isolation

Все данные автоматически фильтруются по tenant:

```typescript
// Access control с tenant isolation
const tenantAccess: Access = ({ req: { user } }) => {
  if (!user) return false
  
  // Platform admin видит все
  if (user.platformRole === 'platform:admin') {
    return true
  }
  
  // Фильтр по tenant пользователя
  return {
    tenant: {
      in: user.tenants, // Массив tenant IDs пользователя
    },
  }
}
```

### Row Level Security (RLS)

PostgreSQL RLS обеспечивает дополнительную защиту на уровне базы данных:

```sql
-- Автоматически применяется к каждому запросу
CREATE POLICY tenant_isolation ON documents
  FOR ALL
  TO authenticated_user
  USING (tenant_id = current_setting('app.current_tenant')::uuid);
```

---

## Permissions per role

### Детальные permissions

```typescript
interface RolePermissions {
  role: TenantRole
  permissions: {
    documents: {
      create: boolean
      read: boolean
      update: 'own' | 'all' | false
      delete: 'own' | 'all' | false
    }
    users: {
      invite: boolean
      manage: boolean
      remove: boolean
    }
    settings: {
      view: boolean
      update: boolean
    }
    billing: {
      view: boolean
      manage: boolean
    }
    apiKeys: {
      create: boolean
      revoke: boolean
    }
  }
}
```

### Owner permissions

```json
{
  "role": "owner",
  "permissions": {
    "documents": {
      "create": true,
      "read": true,
      "update": "all",
      "delete": "all"
    },
    "users": {
      "invite": true,
      "manage": true,
      "remove": true
    },
    "settings": {
      "view": true,
      "update": true
    },
    "billing": {
      "view": true,
      "manage": true
    },
    "apiKeys": {
      "create": true,
      "revoke": true
    }
  }
}
```

### Проверка permissions

```typescript
// Middleware для проверки прав
async function checkPermission(
  user: User,
  action: string,
  resource: string
): Promise<boolean> {
  // Получить membership пользователя
  const membership = await getMembership(user.id, currentTenant)
  
  // Получить permissions для роли
  const permissions = getRolePermissions(membership.role)
  
  // Проверить конкретное право
  return permissions[resource]?.[action] ?? false
}

// Использование
if (await checkPermission(user, 'delete', 'documents')) {
  // Разрешено удалять документы
}
```

---

## Деактивация пользователей

### Soft Deactivation

Временное отключение доступа без удаления данных.

```http
POST /api/admin/users/:id/deactivate
```

```json
{
  "reason": "Left company",
  "notifyUser": true
}
```

**Что происходит:**
- ✅ Пользователь не может войти
- ✅ Данные сохраняются
- ✅ Можно восстановить
- ✅ Все membership остаются

### Восстановление

```http
POST /api/admin/users/:id/reactivate
```

### Удаление membership

Удаление пользователя из конкретного tenant:

```http
DELETE /api/admin/collections/memberships/:id
```

⚠️ **Внимание:** Нельзя удалить единственного owner!

---

## Аудит действий

### Audit Logs

Все действия пользователей логируются:

```typescript
interface AuditLog {
  id: string
  user: string | User
  tenant: string | Tenant
  action: string
  resource: string
  resourceId?: string
  changes?: object
  ipAddress: string
  userAgent: string
  timestamp: Date
}
```

### Примеры логов

```json
[
  {
    "user": "john@example.com",
    "tenant": "acme-corp",
    "action": "create",
    "resource": "document",
    "resourceId": "doc_123",
    "timestamp": "2025-11-02T10:30:00Z"
  },
  {
    "user": "admin@acme.com",
    "tenant": "acme-corp",
    "action": "update",
    "resource": "membership",
    "resourceId": "membership_456",
    "changes": {
      "role": {
        "from": "editor",
        "to": "admin"
      }
    },
    "timestamp": "2025-11-02T11:00:00Z"
  }
]
```

### Просмотр логов

```http
GET /api/audit-logs?tenant=acme-corp&user=john@example.com&limit=50
```

```bash
# CLI
npm run cli logs --tenant acme-corp --user john@example.com
```

---

## Best Practices

### Управление пользователями

✅ **Рекомендуется:**
- Использовать invite для новых пользователей
- Назначать минимально необходимые права
- Регулярно проверять active пользователей
- Удалять неактивных пользователей
- Включить 2FA для admin/owner

❌ **Избегайте:**
- Давать роль admin всем
- Использовать один аккаунт для нескольких людей
- Не отслеживать audit logs
- Не удалять покинувших компанию

### Безопасность

1. **Принцип наименьших привилегий** — давать только необходимые права
2. **Регулярный аудит** — проверять права доступа каждый квартал
3. **Мониторинг активности** — отслеживать подозрительные действия
4. **Быстрое реагирование** — немедленно деактивировать при увольнении

---

**Версия:** 1.0.0  
**Дата обновления:** 2025-11-02  
**Следующий раздел:** [03-billing.md](./03-billing.md)
