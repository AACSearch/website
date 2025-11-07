# Биллинг и подписки

> Полное руководство по управлению подписками, платежами и биллингом в AACSearch Platform через Stripe.

## Содержание

- [Тарифные планы](#тарифные-планы)
- [Stripe интеграция](#stripe-интеграция)
- [Создание подписки](#создание-подписки)
- [Checkout Session](#checkout-session)
- [Customer Portal](#customer-portal)
- [Управление подписками](#управление-подписками)
- [Счета (Invoices)](#счета-invoices)
- [Webhooks от Stripe](#webhooks-от-stripe)
- [Usage Counters](#usage-counters)
- [Billing Events](#billing-events)
- [Grace Period](#grace-period)
- [Апгрейд/Даунгрейд](#апгрейддаунгрейд)

---

## Тарифные планы

### Структура плана

```typescript
interface Plan {
  id: string
  name: string
  slug: string
  priceMonthlyCents: number
  limits: {
    maxUsers?: number
    maxSymbols?: number
    searchRatePerMin?: number
  }
  stripePriceId: string
  features: Array<{ label: string }>
}
```

### Доступные планы

| План | Цена (мес) | Пользователи | Документы | Searches | Storage | API Calls |
|------|------------|--------------|-----------|----------|---------|-----------|
| **Starter** | $29 | 5 | 10,000 | 50,000 | 1 GB | 10,000/мин |
| **Pro** | $99 | 25 | 100,000 | 500,000 | 10 GB | 100,000/мин |
| **Enterprise** | Custom | Unlimited | Unlimited | Unlimited | Unlimited | Unlimited |

### Просмотр планов

```http
GET /api/admin/collections/plans
```

**Response:**
```json
{
  "docs": [
    {
      "id": "starter_plan",
      "name": "Starter",
      "slug": "starter",
      "priceMonthlyCents": 2900,
      "limits": {
        "maxUsers": 5,
        "maxSymbols": 10000,
        "searchRatePerMin": 100
      },
      "stripePriceId": "price_starter_monthly",
      "features": [
        { "label": "Basic search" },
        { "label": "Email support" },
        { "label": "5 users included" }
      ]
    }
  ]
}
```

---

## Stripe интеграция

### Настройка Stripe

#### 1. Создание Stripe аккаунта

1. Зарегистрироваться на [stripe.com](https://stripe.com)
2. Активировать аккаунт
3. Получить API ключи

#### 2. API ключи

**Dashboard → Developers → API keys**

```env
# .env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

⚠️ **Важно:** Используйте test keys для разработки, live keys для production

#### 3. Создание продуктов и цен

```bash
# Создание продукта
stripe products create \
  --name="AACSearch Pro" \
  --description="Professional search plan"

# Создание recurring цены
stripe prices create \
  --product=prod_... \
  --currency=usd \
  --unit-amount=9900 \
  --recurring[interval]=month
```

#### 4. Webhook endpoint

**Dashboard → Developers → Webhooks → Add endpoint**

```
Endpoint URL: https://yourdomain.com/api/webhooks/stripe
Events to send:
  ✅ customer.subscription.created
  ✅ customer.subscription.updated
  ✅ customer.subscription.deleted
  ✅ invoice.payment_succeeded
  ✅ invoice.payment_failed
  ✅ checkout.session.completed
```

---

## Создание подписки

### Workflow

```
1. Tenant выбирает план
2. Создается Stripe Customer
3. Создается Checkout Session
4. Пользователь вводит payment method
5. Webhook создает Subscription в DB
6. Tenant получает доступ
```

### Через Checkout (рекомендуется)

```typescript
// Client-side
async function startCheckout(planId: string) {
  const response = await fetch('/api/billing/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      priceId: 'price_pro_monthly',
      tenantId: 'tenant_abc123',
      seats: 1,
    }),
  })

  const { url } = await response.json()
  
  // Редирект на Stripe Checkout
  window.location.href = url
}
```

**Server-side обработка:**
```typescript
// src/endpoints/billingCheckout.ts
export const createCheckoutHandler: PayloadHandler = async (req) => {
  const { priceId, tenantId, seats } = await req.json()

  // Создание Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{
      price: priceId,
      quantity: seats,
    }],
    subscription_data: {
      metadata: {
        tenantId,
        userId: req.user.id,
      },
    },
    success_url: `${baseURL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseURL}/billing/cancel`,
    automatic_tax: { enabled: true },
  })

  return Response.json({ url: session.url })
}
```

---

## Checkout Session

### Создание Session

```http
POST /api/billing/checkout
Authorization: Bearer <token>
```

**Request:**
```json
{
  "priceId": "price_pro_monthly",
  "tenantId": "tenant_abc123",
  "seats": 5,
  "trialDays": 14
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_...",
  "sessionId": "cs_test_abc123"
}
```

### Redirect flow

```typescript
// 1. Создать session
const { url } = await createCheckoutSession(...)

// 2. Редирект пользователя
window.location.href = url

// 3. После оплаты Stripe редиректит на success_url
// /billing/success?session_id=cs_test_abc123

// 4. Получить результат
const session = await stripe.checkout.sessions.retrieve(sessionId)
```

### Success Page

```typescript
// /billing/success
async function SuccessPage({ searchParams }) {
  const sessionId = searchParams.session_id

  const session = await stripe.checkout.sessions.retrieve(sessionId)

  if (session.payment_status === 'paid') {
    return <div>Подписка активирована!</div>
  }
}
```

---

## Customer Portal

### Что это?

**Customer Portal** — готовый интерфейс от Stripe для управления подпиской:
- Изменение payment method
- Просмотр invoices
- Отмена подписки
- Обновление billing info

### Создание Portal Session

```http
POST /api/billing/portal
Authorization: Bearer <token>
```

**Request:**
```json
{
  "tenantId": "tenant_abc123"
}
```

**Response:**
```json
{
  "url": "https://billing.stripe.com/p/session/..."
}
```

### Пример использования

```typescript
async function openCustomerPortal() {
  const response = await fetch('/api/billing/portal', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tenantId: currentTenantId,
    }),
  })

  const { url } = await response.json()
  window.location.href = url
}
```

---

## Управление подписками

### Структура Subscription

```typescript
interface Subscription {
  id: string
  tenant: string | Tenant
  plan: string | Plan
  stripeCustomerId: string
  stripeSubscriptionId: string
  status: SubscriptionStatus
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  seats: number
  currency: string
  amountDueCents: number
}

type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'incomplete'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'paused'
```

### Просмотр подписки

```http
GET /api/billing/subscription?tenantId=tenant_abc123
```

**Response:**
```json
{
  "subscription": {
    "id": "sub_123",
    "status": "active",
    "plan": {
      "name": "Pro",
      "price": 9900
    },
    "currentPeriodStart": "2025-11-01T00:00:00Z",
    "currentPeriodEnd": "2025-12-01T00:00:00Z",
    "cancelAtPeriodEnd": false,
    "seats": 5
  }
}
```

### Обновление seats

```http
POST /api/billing/update-seats
```

```json
{
  "tenantId": "tenant_abc123",
  "seats": 10
}
```

### Отмена подписки

```http
POST /api/billing/cancel
```

```json
{
  "tenantId": "tenant_abc123",
  "immediately": false,
  "reason": "No longer needed"
}
```

**Опции:**
- `immediately: true` — отменить сразу
- `immediately: false` — отменить в конце периода

---

## Счета (Invoices)

### Структура Invoice

```typescript
interface Invoice {
  id: string
  tenant: string | Tenant
  stripeInvoiceId: string
  amountDueCents: number
  currency: string
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'
  issuedAt: Date
  paidAt?: Date
  hostedInvoiceUrl?: string
  invoicePdf?: string
}
```

### Список invoices

```http
GET /api/billing/invoices?tenantId=tenant_abc123
```

**Response:**
```json
{
  "invoices": [
    {
      "id": "inv_123",
      "stripeInvoiceId": "in_abc123",
      "amountDueCents": 9900,
      "currency": "USD",
      "status": "paid",
      "issuedAt": "2025-11-01T00:00:00Z",
      "paidAt": "2025-11-01T10:30:00Z",
      "invoicePdf": "https://pay.stripe.com/invoice/..."
    }
  ]
}
```

### Скачать invoice

```typescript
async function downloadInvoice(invoiceId: string) {
  const invoice = await stripe.invoices.retrieve(invoiceId)
  
  // Открыть PDF
  window.open(invoice.invoice_pdf, '_blank')
}
```

---

## Webhooks от Stripe

### Настройка обработчика

```typescript
// src/app/api/webhooks/stripe/route.ts
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return new Response('Webhook signature verification failed', { status: 400 })
  }

  // Обработка событий
  switch (event.type) {
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object)
      break
    
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object)
      break

    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object)
      break

    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object)
      break
  }

  return new Response('Webhook handled', { status: 200 })
}
```

### События

#### subscription.created

Новая подписка создана.

```typescript
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const tenantId = subscription.metadata.tenantId

  await payload.create({
    collection: 'subscriptions',
    data: {
      tenant: tenantId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  })
}
```

#### invoice.payment_succeeded

Платеж прошел успешно.

```typescript
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  await payload.create({
    collection: 'invoices',
    data: {
      stripeInvoiceId: invoice.id,
      amountDueCents: invoice.amount_due,
      status: 'paid',
      paidAt: new Date(),
    },
  })

  // Отправить квитанцию
  await sendReceiptEmail(invoice)
}
```

#### invoice.payment_failed

Платеж не прошел.

```typescript
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Уведомить владельца
  await sendPaymentFailedEmail(invoice)

  // Создать billing event
  await payload.create({
    collection: 'billing_events',
    data: {
      type: 'invoice.payment_failed',
      payload: invoice,
    },
  })
}
```

---

## Usage Counters

### Отслеживание использования

```typescript
// src/lib/usage-tracking.ts
export async function trackUsageEvent(
  payload: Payload,
  tenantId: string,
  eventType: 'search' | 'api_call' | 'symbol_create',
  quantity: number = 1
) {
  // Обновить локальный счетчик
  const counter = await getOrCreateCounter(tenantId)
  
  await payload.update({
    collection: 'usage_counters',
    id: counter.id,
    data: {
      searchesCount: counter.searchesCount + quantity,
    },
  })

  // Отправить в Stripe Meters (для metered billing)
  if (subscription.hasMeteredPricing) {
    await stripe.billing.meterEvents.create({
      event_name: `${eventType}_count`,
      payload: {
        stripe_customer_id: subscription.stripeCustomerId,
        value: String(quantity),
      },
    })
  }
}
```

### Просмотр usage

```http
GET /api/billing/usage?tenantId=tenant_abc123
```

**Response:**
```json
{
  "period": {
    "start": "2025-11-01T00:00:00Z",
    "end": "2025-12-01T00:00:00Z"
  },
  "usage": {
    "searches": 45230,
    "apiCalls": 123456,
    "symbols": 8500
  },
  "limits": {
    "searches": 500000,
    "apiCalls": 1000000,
    "symbols": 100000
  },
  "percentage": {
    "searches": "9.0%",
    "apiCalls": "12.3%",
    "symbols": "8.5%"
  }
}
```

---

## Billing Events

### Аудит всех billing событий

```typescript
interface BillingEvent {
  id: string
  eventId: string
  type: string
  occurredAt: Date
  payload: object
  tenant?: string
  processed: boolean
  error?: string
}
```

### Список событий

```http
GET /api/admin/collections/billing_events?tenant=tenant_abc123&limit=50
```

**Response:**
```json
{
  "docs": [
    {
      "eventId": "evt_abc123",
      "type": "invoice.payment_succeeded",
      "occurredAt": "2025-11-01T10:30:00Z",
      "processed": true
    }
  ]
}
```

---

## Grace Period

### Что это?

**Grace Period** — период после просрочки, когда доступ не отключается сразу.

### Конфигурация

```typescript
const GRACE_PERIOD_DAYS = 7

// После failed payment
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscription = await getSubscription(invoice.subscription)
  
  // Установить grace period
  await payload.update({
    collection: 'subscriptions',
    id: subscription.id,
    data: {
      gracePeriodEndsAt: addDays(new Date(), GRACE_PERIOD_DAYS),
    },
  })

  // Уведомление каждый день
  scheduleGracePeriodReminders(subscription)
}
```

### Проверка доступа

```typescript
function canAccessTenant(subscription: Subscription): boolean {
  if (subscription.status === 'active') return true
  if (subscription.status === 'trialing') return true
  
  // Grace period
  if (subscription.gracePeriodEndsAt) {
    return new Date() < subscription.gracePeriodEndsAt
  }
  
  return false
}
```

---

## Апгрейд/Даунгрейд

### Апгрейд плана

```http
POST /api/billing/upgrade
```

**Request:**
```json
{
  "tenantId": "tenant_abc123",
  "newPlanId": "pro_plan",
  "proration": true
}
```

**Что происходит:**
1. ✅ Создается новый Stripe subscription
2. ✅ Proration кредит за оставшееся время
3. ✅ Обновление лимитов
4. ✅ Немедленный доступ к новым features

### Даунгрейд плана

```http
POST /api/billing/downgrade
```

**Request:**
```json
{
  "tenantId": "tenant_abc123",
  "newPlanId": "starter_plan",
  "effectiveDate": "end_of_period"
}
```

**Опции:**
- `immediately` — даунгрейд сразу
- `end_of_period` — в конце billing периода (рекомендуется)

⚠️ **Внимание:** Проверьте, что текущее usage вписывается в новые лимиты!

### Проверка перед downgrade

```typescript
async function canDowngrade(
  currentUsage: Usage,
  newPlan: Plan
): Promise<{ allowed: boolean; violations: string[] }> {
  const violations = []

  if (currentUsage.users > newPlan.limits.maxUsers) {
    violations.push(`Удалите ${currentUsage.users - newPlan.limits.maxUsers} пользователей`)
  }

  if (currentUsage.symbols > newPlan.limits.maxSymbols) {
    violations.push(`Удалите ${currentUsage.symbols - newPlan.limits.maxSymbols} символов`)
  }

  return {
    allowed: violations.length === 0,
    violations,
  }
}
```

---

## Best Practices

### Биллинг

✅ **Рекомендуется:**
- Включить automatic tax в Stripe
- Использовать webhooks для синхронизации
- Сохранять все billing events
- Настроить grace period (7 дней)
- Уведомлять перед отменой подписки

❌ **Избегайте:**
- Мгновенного отключения при просрочке
- Удаления данных без backup
- Игнорирования failed webhooks
- Жесткого enforcement лимитов без warning

### Мониторинг

**Настройте алерты на:**
- Failed payments
- Approaching limits (80% usage)
- Expired trials
- Subscription cancellations

---

**Версия:** 1.0.0  
**Дата обновления:** 2025-11-02  
**Следующий раздел:** [04-api-keys.md](./04-api-keys.md)
