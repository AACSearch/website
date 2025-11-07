# Руководство администратора

> Полное руководство по администрированию платформы AACSearch — управление tenant'ами, пользователями, биллингом, безопасностью и мониторингом.

## Содержание

### 📋 Основные разделы

1. **[Управление Tenant'ами](./01-tenant-management.md)** (15-18 страниц)
   - Создание tenant через wizard
   - Настройка организации (название, slug, domain)
   - Кастомные домены
   - Настройки (locale, features, limits)
   - Управление планом подписки
   - Transfer ownership
   - Удаление tenant

2. **[Пользователи и роли](./02-users-and-roles.md)** (18-20 страниц)
   - Система ролей (Owner, Admin, Editor, Viewer)
   - Memberships (связь Users ↔ Tenants)
   - Создание пользователей
   - Приглашение по email
   - Управление доступом (Access Control)
   - Permissions per role
   - Деактивация пользователей
   - Аудит действий пользователей

3. **[Биллинг и подписки](./03-billing.md)** (25-30 страниц)
   - Тарифные планы (Starter, Pro, Enterprise)
   - Лимиты по плану (users, documents, searches, storage)
   - Stripe интеграция
   - Создание Checkout Session
   - Customer Portal
   - Управление подписками (создание, обновление, отмена)
   - Счета (Invoices)
   - Платежи и их статусы
   - Webhooks от Stripe
   - Usage counters (отслеживание использования)
   - Billing events (аудит)
   - Grace period при просрочке
   - Апгрейд/даунгрейд плана

4. **[API ключи](./04-api-keys.md)** (15-18 страниц)
   - Создание API ключей
   - Типы ключей (Master, Read-only, Custom)
   - Scoped keys для клиентов
   - TTL и expiration
   - Permissions и scopes
   - Rate limiting per key
   - Usage tracking
   - Ротация ключей
   - Revocation (отзыв)
   - Best practices безопасности

5. **[Безопасность](./05-security.md)** (20-25 страниц)
   - Data isolation (tenant изоляция)
   - Row Level Security (PostgreSQL RLS)
   - Шифрование (at rest, in transit)
   - GDPR compliance
   - Right to be forgotten
   - Data portability
   - PII scanner
   - Аудит логи
   - Security events
   - Compliance checker (GDPR, CCPA, SOC2)
   - Penetration testing
   - Vulnerability scanning

6. **[Мониторинг и метрики](./06-monitoring.md)** (18-20 страниц)
   - Dashboard overview
   - Метрики использования
   - Search analytics
   - API usage stats
   - Performance metrics (latency, throughput)
   - Error tracking
   - Health checks (/health, /health/ready, /health/live)
   - Prometheus metrics
   - Grafana dashboards
   - Alerting (email, Slack, PagerDuty)

7. **[Резервное копирование](./07-backups.md)** (12-15 страниц)
   - Автоматические snapshot (daily job)
   - Manual backups
   - Backup retention (7 days)
   - Restore процедура
   - Point-in-time recovery
   - Disaster recovery plan
   - S3 storage для backups

---

## Для кого это руководство

### Целевая аудитория

- **Platform Administrators** — управление всей платформой
- **Tenant Owners** — владельцы организаций
- **Tenant Admins** — администраторы организаций
- **DevOps Engineers** — развертывание и мониторинг
- **Security Officers** — аудит безопасности

### Необходимые знания

- Базовое понимание SaaS multi-tenancy
- Знание REST API и HTTP
- Опыт работы с PostgreSQL (для продвинутых настроек)
- Знание Typesense (для поисковых настроек)
- Понимание OAuth/JWT для безопасности

---

## Быстрый старт

### Типичные задачи администратора

**Новый администратор? Начните здесь:**

1. **Создать новый tenant** → [01-tenant-management.md](./01-tenant-management.md#создание-tenant)
2. **Пригласить пользователей** → [02-users-and-roles.md](./02-users-and-roles.md#приглашение-пользователей)
3. **Настроить биллинг** → [03-billing.md](./03-billing.md#настройка-подписки)
4. **Создать API ключи** → [04-api-keys.md](./04-api-keys.md#создание-api-ключей)
5. **Настроить мониторинг** → [06-monitoring.md](./06-monitoring.md#dashboard-overview)

**Ежедневные задачи:**

- Проверка метрик использования → [06-monitoring.md](./06-monitoring.md#метрики-использования)
- Управление пользователями → [02-users-and-roles.md](./02-users-and-roles.md#управление-пользователями)
- Мониторинг безопасности → [05-security.md](./05-security.md#аудит-логи)
- Проверка backups → [07-backups.md](./07-backups.md#автоматические-snapshot)

**Ежемесячные задачи:**

- Анализ usage counters → [03-billing.md](./03-billing.md#usage-counters)
- Ротация API ключей → [04-api-keys.md](./04-api-keys.md#ротация-ключей)
- Аудит безопасности → [05-security.md](./05-security.md#compliance-checker)
- Disaster recovery testing → [07-backups.md](./07-backups.md#disaster-recovery)

---

## Архитектура платформы

### Multi-Tenancy модель

AACSearch использует **строгую изоляцию данных**:

```
Platform Level
├── Platform Admins (платформенная роль)
└── Tenants (организации)
    ├── Tenant Owner
    ├── Tenant Admins
    ├── Editors
    └── Viewers
```

**Ключевые концепции:**

- **Tenant** — изолированная организация со своими данными
- **Membership** — связь User ↔ Tenant с ролью
- **Plan** — тарифный план с лимитами
- **Subscription** — активная подписка tenant на план

### Схема базы данных (упрощенно)

```
┌─────────────┐
│   Tenants   │
├─────────────┤
│ id          │
│ name        │
│ slug        │──┐
│ domain      │  │
│ plan_id     │──┼──────────────────┐
└─────────────┘  │                  │
                 │                  │
┌────────────────▼──┐           ┌───▼──────┐
│   Memberships     │           │  Plans   │
├───────────────────┤           ├──────────┤
│ tenant_id         │           │ name     │
│ user_id           │           │ limits   │
│ role              │           │ price    │
└───────────────────┘           └──────────┘
        │
        │
┌───────▼────┐
│   Users    │
├────────────┤
│ email      │
│ name       │
│ auth_data  │
└────────────┘
```

### Интеграции

- **PostgreSQL** — основная база данных
- **Typesense** — поисковый движок
- **Stripe** — биллинг и платежи
- **S3** — хранение backups
- **Prometheus/Grafana** — мониторинг

---

## Важные концепции

### 1. Роли и доступ

| Роль | Уровень | Описание |
|------|---------|----------|
| `platform:admin` | Platform | Полный доступ ко всей платформе |
| `owner` | Tenant | Владелец организации |
| `admin` | Tenant | Администратор организации |
| `editor` | Tenant | Редактор контента |
| `viewer` | Tenant | Просмотр данных |

**Подробнее:** [02-users-and-roles.md](./02-users-and-roles.md#система-ролей)

### 2. Тарифные планы

| План | Пользователи | Документы | Searches/мес | Цена |
|------|--------------|-----------|--------------|------|
| Starter | 5 | 10,000 | 50,000 | $29/мес |
| Pro | 25 | 100,000 | 500,000 | $99/мес |
| Enterprise | Unlimited | Unlimited | Unlimited | Custom |

**Подробнее:** [03-billing.md](./03-billing.md#тарифные-планы)

### 3. API ключи

- **Admin Key** — полный доступ (только server-side)
- **Search Key** — read-only поиск
- **Scoped Key** — ограниченный доступ с фильтрами

**Подробнее:** [04-api-keys.md](./04-api-keys.md#типы-ключей)

---

## Best Practices

### Безопасность

✅ **Рекомендуется:**

- Используйте scoped keys для клиентских приложений
- Ротируйте API ключи каждые 90 дней
- Включите 2FA для всех администраторов
- Регулярно проверяйте аудит логи
- Настройте алерты на подозрительную активность

❌ **Избегайте:**

- Использования admin ключей в frontend
- Хранения ключей в git репозиториях
- Отключения Row Level Security
- Передачи доступа Owner другим пользователям без проверки

**Подробнее:** [05-security.md](./05-security.md#best-practices)

### Производительность

✅ **Рекомендуется:**

- Настройте кэширование для search API
- Используйте CDN для статических ресурсов
- Мониторьте Typesense метрики
- Оптимизируйте индексы базы данных
- Включите connection pooling

❌ **Избегайте:**

- Слишком частого reindexing
- Большого количества facets
- Неограниченных queries без pagination
- Хранения больших JSON в базе

**Подробнее:** [06-monitoring.md](./06-monitoring.md#performance-metrics)

### Биллинг

✅ **Рекомендуется:**

- Настройте usage alerts
- Мониторьте approaching limits
- Используйте grace period для критичных tenant'ов
- Автоматизируйте downgrade при просрочке
- Сохраняйте billing events для аудита

❌ **Избегайте:**

- Мгновенного отключения при просрочке
- Удаления данных без backup
- Игнорирования failed payments
- Неконтролируемого usage

**Подробнее:** [03-billing.md](./03-billing.md#best-practices)

---

## Типичные сценарии

### Сценарий 1: Новый tenant

1. Создание через wizard → [01-tenant-management.md](./01-tenant-management.md#wizard)
2. Выбор плана → [03-billing.md](./03-billing.md#выбор-плана)
3. Настройка Stripe → [03-billing.md](./03-billing.md#stripe-интеграция)
4. Приглашение владельца → [02-users-and-roles.md](./02-users-and-roles.md#создание-owner)
5. Генерация API ключей → [04-api-keys.md](./04-api-keys.md#первичная-генерация)

### Сценарий 2: Апгрейд плана

1. Проверка текущего usage → [03-billing.md](./03-billing.md#usage-counters)
2. Выбор нового плана → [03-billing.md](./03-billing.md#тарифные-планы)
3. Создание checkout session → [03-billing.md](./03-billing.md#апгрейд-плана)
4. Обновление лимитов → [01-tenant-management.md](./01-tenant-management.md#лимиты)

### Сценарий 3: Безопасность инцидент

1. Проверка аудит логов → [05-security.md](./05-security.md#аудит-логи)
2. Revoke скомпрометированных ключей → [04-api-keys.md](./04-api-keys.md#revocation)
3. Уведомление пользователей → [02-users-and-roles.md](./02-users-and-roles.md#уведомления)
4. Создание новых ключей → [04-api-keys.md](./04-api-keys.md#ротация-ключей)
5. Обновление security policy → [05-security.md](./05-security.md#security-events)

### Сценарий 4: Disaster recovery

1. Обнаружение проблемы → [06-monitoring.md](./06-monitoring.md#health-checks)
2. Получение последнего snapshot → [07-backups.md](./07-backups.md#список-backups)
3. Остановка приложения → [07-backups.md](./07-backups.md#процедура-restore)
4. Восстановление данных → [07-backups.md](./07-backups.md#restore-базы)
5. Проверка целостности → [07-backups.md](./07-backups.md#валидация)
6. Запуск приложения → [06-monitoring.md](./06-monitoring.md#readiness-check)

---

## Инструменты администратора

### Admin UI

Доступ: `https://yourdomain.com/admin`

**Основные разделы:**

- **Dashboard** — overview метрик
- **Tenants** — управление организациями
- **Users** — управление пользователями
- **Plans** — тарифные планы
- **Subscriptions** — активные подписки
- **Billing Events** — история платежей
- **API Keys** — управление ключами
- **Logs** — аудит логи

### CLI инструменты

```bash
# Создание tenant
npm run cli tenant:create --name "Acme Corp" --slug acme

# Генерация API ключа
npm run cli apikey:create --tenant acme --type search

# Запуск backup
npm run cli backup:create --snapshot

# Проверка health
npm run cli health:check

# Экспорт данных (GDPR)
npm run cli gdpr:export --user user@example.com
```

**Подробнее:** [06-developer-guide](../06-developer-guide/README.md)

### REST API

```bash
# Health check
GET /api/health

# Метрики (Prometheus)
GET /api/metrics

# Создание checkout session
POST /api/billing/checkout

# Customer portal
POST /api/billing/portal

# Generate scoped key
POST /api/keys/scoped
```

**Подробнее:** [05-api-reference](../05-api-reference/README.md)

---

## Troubleshooting

### Частые проблемы

**1. Tenant не может войти**

- Проверьте membership → [02-users-and-roles.md](./02-users-and-roles.md#troubleshooting)
- Проверьте статус subscription → [03-billing.md](./03-billing.md#статусы-подписки)
- Проверьте аудит логи → [05-security.md](./05-security.md#аудит-логи)

**2. API ключи не работают**

- Проверьте expiration → [04-api-keys.md](./04-api-keys.md#expiration)
- Проверьте revocation → [04-api-keys.md](./04-api-keys.md#revocation)
- Проверьте scopes → [04-api-keys.md](./04-api-keys.md#scopes)

**3. Биллинг проблемы**

- Проверьте webhook delivery → [03-billing.md](./03-billing.md#webhooks)
- Проверьте Stripe dashboard
- Проверьте billing events → [03-billing.md](./03-billing.md#billing-events)

**4. Performance деградация**

- Проверьте Typesense metrics → [06-monitoring.md](./06-monitoring.md#typesense-metrics)
- Проверьте database slow queries → [06-monitoring.md](./06-monitoring.md#database-metrics)
- Проверьте memory usage → [06-monitoring.md](./06-monitoring.md#system-metrics)

---

## Дополнительные ресурсы

### Документация

- [Руководство пользователя](../04-user-guide/README.md)
- [Руководство разработчика](../06-developer-guide/README.md)
- [API Reference](../05-api-reference/README.md)
- [Deployment Guide](../07-deployment/README.md)

### Внешние ресурсы

- [PayloadCMS Documentation](https://payloadcms.com/docs)
- [Typesense Documentation](https://typesense.org/docs/)
- [Stripe Documentation](https://stripe.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Поддержка

- **Email:** admin@aacsearch.com
- **Slack:** [AACSearch Community](https://slack.aacsearch.com)
- **GitHub Issues:** [Platform Issues](https://github.com/aacsearch/platform/issues)
- **Status Page:** [status.aacsearch.com](https://status.aacsearch.com)

---

## Лицензия и условия использования

Эта документация является частью AACSearch Platform.

**Версия:** 1.0.0
**Дата обновления:** 2025-11-02
**Автор:** AACSearch Team
