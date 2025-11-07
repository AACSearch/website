# Billing API

API биллинга обеспечивает интеграцию со Stripe для управления подписками, платежами, счетами и использованием ресурсов.

## Обзор

Billing API предоставляет:
- Создание Stripe Checkout сессий для новых подписок
- Управление подписками через Billing Portal
- Получение информации о текущей подписке
- Просмотр счетов и истории платежей
- Мониторинг использования ресурсов
- Обработку вебхуков от Stripe

## POST /api/billing/checkout

Создать Stripe Checkout сессию для оформления подписки.

### Аутентификация

**Требуется:** JWT Token + Owner/Admin role

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Request Body

```json
{
  "priceId": "price_1PQ2R3SJ5K6L7M8N9",
  "tenantId": "tenant_abc123",
  "seats": 5,
  "successUrl": "https://yourapp.com/billing/success",
  "cancelUrl": "https://yourapp.com/billing/cancel"
}
```

### Request Parameters

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `priceId` | string | Да | Stripe Price ID |
| `tenantId` | string | Да | ID тенанта |
| `seats` | number | Нет | Количество seats (для per-seat pricing). По умолчанию: `1` |
| `successUrl` | string | Нет | URL для redirect после успеха |
| `cancelUrl` | string | Нет | URL для redirect при отмене |
| `trialDays` | number | Нет | Дней пробного периода |
| `promotionCode` | string | Нет | Промо-код |

### Response (200 OK)

```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_...",
  "sessionId": "cs_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
}
```

### Response Fields

| Поле | Тип | Описание |
|------|-----|----------|
| `url` | string | URL для редиректа на Stripe Checkout |
| `sessionId` | string | ID сессии для отслеживания |

### Examples

#### cURL

```bash
curl -X POST "https://api.aacsearch.com/api/billing/checkout" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "priceId": "price_1PQ2R3SJ5K6L7M8N9",
    "tenantId": "tenant_abc123",
    "seats": 5
  }'
```

#### JavaScript

```javascript
async function createCheckoutSession(priceId, tenantId, seats = 1) {
  const response = await fetch('https://api.aacsearch.com/api/billing/checkout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      priceId,
      tenantId,
      seats,
      successUrl: `${window.location.origin}/billing/success`,
      cancelUrl: `${window.location.origin}/billing`
    })
  });

  const data = await response.json();

  // Redirect to Stripe Checkout
  window.location.href = data.url;
}

// Start subscription flow
document.getElementById('subscribeBtn').addEventListener('click', () => {
  createCheckoutSession('price_professional_monthly', 'tenant_123', 5);
});
```

#### TypeScript

```typescript
interface CheckoutSessionRequest {
  priceId: string;
  tenantId: string;
  seats?: number;
  successUrl?: string;
  cancelUrl?: string;
  trialDays?: number;
  promotionCode?: string;
}

interface CheckoutSessionResponse {
  url: string;
  sessionId: string;
}

async function createCheckoutSession(
  params: CheckoutSessionRequest
): Promise<CheckoutSessionResponse> {
  const response = await fetch('https://api.aacsearch.com/api/billing/checkout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  return response.json();
}

// Usage with type safety
const session = await createCheckoutSession({
  priceId: 'price_123',
  tenantId: 'tenant_456',
  seats: 10,
  trialDays: 14,
  successUrl: '/billing/success',
  cancelUrl: '/billing'
});

window.location.href = session.url;
```

#### Python

```python
import requests

def create_checkout_session(price_id: str, tenant_id: str, seats: int = 1):
    response = requests.post(
        'https://api.aacsearch.com/api/billing/checkout',
        headers={'Authorization': f'Bearer {JWT_TOKEN}'},
        json={
            'priceId': price_id,
            'tenantId': tenant_id,
            'seats': seats,
            'successUrl': 'https://yourapp.com/billing/success',
            'cancelUrl': 'https://yourapp.com/billing'
        }
    )

    data = response.json()
    return data['url']

# Create checkout session and get redirect URL
checkout_url = create_checkout_session('price_pro_monthly', 'tenant_123', 5)
print(f"Redirect user to: {checkout_url}")
```

---

## POST /api/billing/portal

Создать сессию Stripe Billing Portal для управления подпиской.

### Request Body

```json
{
  "tenantId": "tenant_abc123",
  "returnUrl": "https://yourapp.com/settings/billing"
}
```

### Request Parameters

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `tenantId` | string | Да | ID тенанта |
| `returnUrl` | string | Нет | URL для возврата после изменений |

### Response (200 OK)

```json
{
  "url": "https://billing.stripe.com/p/session/test_..."
}
```

### Examples

#### JavaScript

```javascript
async function openBillingPortal(tenantId) {
  const response = await fetch('https://api.aacsearch.com/api/billing/portal', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tenantId,
      returnUrl: window.location.href
    })
  });

  const data = await response.json();
  window.location.href = data.url;
}

// Open billing portal
document.getElementById('manageBillingBtn').addEventListener('click', () => {
  openBillingPortal('tenant_123');
});
```

В Billing Portal клиенты могут:
- Обновлять способ оплаты
- Изменять план подписки
- Добавлять/удалять seats
- Отменять подписку
- Просматривать счета
- Скачивать receipts

---

## GET /api/billing/status

Получить статус текущей подписки.

### Query Parameters

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `tenantId` | string | Да | ID тенанта |

### Response (200 OK)

```json
{
  "subscription": {
    "id": "sub_1PQ2R3SJ5K6L7M8N9",
    "status": "active",
    "plan": {
      "id": "price_professional_monthly",
      "name": "Professional",
      "interval": "month",
      "amount": 9900,
      "currency": "usd",
      "seats": 5
    },
    "currentPeriod": {
      "start": "2024-11-01T00:00:00Z",
      "end": "2024-12-01T00:00:00Z"
    },
    "trialEnd": null,
    "cancelAtPeriodEnd": false,
    "canceledAt": null
  },
  "customer": {
    "id": "cus_PQ2R3SJ5K6L7M8N9",
    "email": "customer@example.com",
    "name": "ACME Corp"
  },
  "usage": {
    "searches": {
      "current": 5432,
      "limit": 100000,
      "remaining": 94568,
      "percentage": 5.43
    },
    "documents": {
      "current": 12345,
      "limit": 1000000,
      "remaining": 987655,
      "percentage": 1.23
    }
  },
  "upcomingInvoice": {
    "amount": 9900,
    "currency": "usd",
    "date": "2024-12-01T00:00:00Z"
  }
}
```

### Response Fields

| Поле | Тип | Описание |
|------|-----|----------|
| `subscription.id` | string | Stripe subscription ID |
| `subscription.status` | string | `active`, `trialing`, `past_due`, `canceled`, `incomplete` |
| `subscription.plan` | object | Детали плана |
| `subscription.currentPeriod` | object | Текущий billing период |
| `subscription.trialEnd` | string/null | Дата окончания trial |
| `subscription.cancelAtPeriodEnd` | boolean | Запланирована отмена |
| `usage` | object | Использование ресурсов |
| `upcomingInvoice` | object | Предстоящий платеж |

### Examples

#### JavaScript

```javascript
async function getSubscriptionStatus(tenantId) {
  const response = await fetch(
    `https://api.aacsearch.com/api/billing/status?tenantId=${tenantId}`,
    {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`
      }
    }
  );

  return response.json();
}

// Display subscription info
const status = await getSubscriptionStatus('tenant_123');

console.log(`Plan: ${status.subscription.plan.name}`);
console.log(`Status: ${status.subscription.status}`);
console.log(`Searches: ${status.usage.searches.current} / ${status.usage.searches.limit}`);

if (status.subscription.cancelAtPeriodEnd) {
  console.warn('Subscription will be canceled at:', status.subscription.currentPeriod.end);
}
```

#### React Component

```jsx
import { useState, useEffect } from 'react';

function BillingStatus({ tenantId }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await fetch(
          `https://api.aacsearch.com/api/billing/status?tenantId=${tenantId}`,
          {
            headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
          }
        );
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error('Failed to fetch billing status:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
  }, [tenantId]);

  if (loading) return <div>Loading...</div>;
  if (!status) return <div>No subscription found</div>;

  const { subscription, usage } = status;

  return (
    <div className="billing-status">
      <h2>Subscription Status</h2>

      <div className="plan-info">
        <h3>{subscription.plan.name} Plan</h3>
        <p className={`status ${subscription.status}`}>
          {subscription.status}
        </p>
        <p>
          ${subscription.plan.amount / 100}/{subscription.plan.interval}
        </p>
        {subscription.plan.seats > 1 && (
          <p>{subscription.plan.seats} seats</p>
        )}
      </div>

      <div className="usage-info">
        <h3>Usage</h3>
        <div className="usage-bar">
          <label>Searches</label>
          <progress
            value={usage.searches.current}
            max={usage.searches.limit}
          />
          <span>
            {usage.searches.current.toLocaleString()} /
            {usage.searches.limit.toLocaleString()}
            ({usage.searches.percentage.toFixed(1)}%)
          </span>
        </div>

        <div className="usage-bar">
          <label>Documents</label>
          <progress
            value={usage.documents.current}
            max={usage.documents.limit}
          />
          <span>
            {usage.documents.current.toLocaleString()} /
            {usage.documents.limit.toLocaleString()}
            ({usage.documents.percentage.toFixed(1)}%)
          </span>
        </div>
      </div>

      {subscription.cancelAtPeriodEnd && (
        <div className="alert warning">
          Your subscription will be canceled on{' '}
          {new Date(subscription.currentPeriod.end).toLocaleDateString()}
        </div>
      )}

      {subscription.status === 'trialing' && subscription.trialEnd && (
        <div className="alert info">
          Trial ends on{' '}
          {new Date(subscription.trialEnd).toLocaleDateString()}
        </div>
      )}

      <button onClick={() => openBillingPortal(tenantId)}>
        Manage Subscription
      </button>
    </div>
  );
}
```

---

## GET /api/billing/invoices

Получить список счетов.

### Query Parameters

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `tenantId` | string | Да | ID тенанта |
| `limit` | number | Нет | Количество счетов. По умолчанию: `12` |
| `starting_after` | string | Нет | Invoice ID для пагинации |

### Response (200 OK)

```json
{
  "invoices": [
    {
      "id": "in_1PQ2R3SJ5K6L7M8N9",
      "number": "AC123456-0001",
      "status": "paid",
      "amount": 9900,
      "currency": "usd",
      "created": "2024-11-01T00:00:00Z",
      "periodStart": "2024-11-01T00:00:00Z",
      "periodEnd": "2024-12-01T00:00:00Z",
      "pdfUrl": "https://pay.stripe.com/invoice/.../pdf",
      "hostedInvoiceUrl": "https://invoice.stripe.com/i/acct_.../invst_...",
      "lineItems": [
        {
          "description": "Professional Plan × 5 seats",
          "amount": 9900,
          "quantity": 5,
          "unitAmount": 1980
        }
      ]
    },
    {
      "id": "in_0OQ1P2NI4J5K6L7M8",
      "number": "AC123456-0002",
      "status": "paid",
      "amount": 9900,
      "currency": "usd",
      "created": "2024-10-01T00:00:00Z",
      "periodStart": "2024-10-01T00:00:00Z",
      "periodEnd": "2024-11-01T00:00:00Z",
      "pdfUrl": "https://pay.stripe.com/invoice/.../pdf",
      "hostedInvoiceUrl": "https://invoice.stripe.com/i/acct_.../invst_..."
    }
  ],
  "hasMore": true,
  "total": 24
}
```

### Examples

#### JavaScript

```javascript
async function getInvoices(tenantId, limit = 12) {
  const response = await fetch(
    `https://api.aacsearch.com/api/billing/invoices?tenantId=${tenantId}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`
      }
    }
  );

  return response.json();
}

// Display invoices
const { invoices } = await getInvoices('tenant_123');

invoices.forEach(invoice => {
  console.log(`${invoice.number} - ${invoice.status} - $${invoice.amount / 100}`);
});
```

#### React Component

```jsx
function InvoicesList({ tenantId }) {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    async function fetchInvoices() {
      const data = await getInvoices(tenantId);
      setInvoices(data.invoices);
    }
    fetchInvoices();
  }, [tenantId]);

  return (
    <div className="invoices-list">
      <h2>Invoices</h2>
      <table>
        <thead>
          <tr>
            <th>Number</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(invoice => (
            <tr key={invoice.id}>
              <td>{invoice.number}</td>
              <td>{new Date(invoice.created).toLocaleDateString()}</td>
              <td>${invoice.amount / 100}</td>
              <td className={`status ${invoice.status}`}>
                {invoice.status}
              </td>
              <td>
                <a href={invoice.pdfUrl} target="_blank">Download PDF</a>
                <a href={invoice.hostedInvoiceUrl} target="_blank">View Online</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## GET /api/billing/usage

Получить детальную информацию об использовании ресурсов.

### Query Parameters

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `tenantId` | string | Да | ID тенанта |
| `startDate` | string | Нет | Начальная дата (ISO 8601) |
| `endDate` | string | Нет | Конечная дата (ISO 8601) |
| `granularity` | string | Нет | `daily`, `weekly`, `monthly`. По умолчанию: `daily` |

### Response (200 OK)

```json
{
  "period": {
    "start": "2024-10-01T00:00:00Z",
    "end": "2024-11-01T00:00:00Z"
  },
  "summary": {
    "searches": {
      "total": 5432,
      "limit": 100000,
      "percentage": 5.43
    },
    "documents": {
      "total": 12345,
      "limit": 1000000,
      "percentage": 1.23
    },
    "storage": {
      "bytes": 1234567890,
      "limit": 10737418240,
      "percentage": 11.49
    }
  },
  "timeline": [
    {
      "date": "2024-10-01",
      "searches": 156,
      "documents": 12000,
      "storage": 1200000000
    },
    {
      "date": "2024-10-02",
      "searches": 189,
      "documents": 12100,
      "storage": 1205000000
    }
  ],
  "breakdown": {
    "searchesByCollection": {
      "symbols": 3245,
      "pages": 1876,
      "products": 311
    },
    "searchesByType": {
      "basic": 4123,
      "nl": 867,
      "vector": 342,
      "image": 100
    }
  }
}
```

### Examples

#### JavaScript - Usage Chart

```javascript
import Chart from 'chart.js/auto';

async function displayUsageChart(tenantId) {
  const data = await fetch(
    `https://api.aacsearch.com/api/billing/usage?tenantId=${tenantId}&granularity=daily`,
    {
      headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
    }
  ).then(r => r.json());

  const ctx = document.getElementById('usageChart');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.timeline.map(t => t.date),
      datasets: [
        {
          label: 'Searches',
          data: data.timeline.map(t => t.searches),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Daily Search Usage'
        }
      }
    }
  });
}
```

---

## Subscription Plans

### Available Plans

```json
{
  "plans": [
    {
      "id": "free",
      "name": "Free",
      "price": 0,
      "interval": "month",
      "limits": {
        "searches": 1000,
        "documents": 10000,
        "storage": "100MB",
        "seats": 1
      },
      "features": [
        "Basic search",
        "1,000 searches/month",
        "10,000 documents",
        "Community support"
      ]
    },
    {
      "id": "starter",
      "name": "Starter",
      "price": 2900,
      "interval": "month",
      "limits": {
        "searches": 10000,
        "documents": 100000,
        "storage": "1GB",
        "seats": 3
      },
      "features": [
        "All Free features",
        "10,000 searches/month",
        "100,000 documents",
        "Advanced search",
        "Email support"
      ]
    },
    {
      "id": "professional",
      "name": "Professional",
      "price": 9900,
      "interval": "month",
      "pricePerSeat": 1980,
      "limits": {
        "searches": 100000,
        "documents": 1000000,
        "storage": "10GB",
        "seats": 10
      },
      "features": [
        "All Starter features",
        "100,000 searches/month",
        "1M documents",
        "NL Search",
        "Vector Search",
        "Analytics",
        "Priority support"
      ]
    },
    {
      "id": "enterprise",
      "name": "Enterprise",
      "price": "custom",
      "limits": {
        "searches": "unlimited",
        "documents": "unlimited",
        "storage": "unlimited",
        "seats": "unlimited"
      },
      "features": [
        "All Professional features",
        "Unlimited usage",
        "Custom models",
        "SSO",
        "SLA",
        "Dedicated support",
        "On-premise option"
      ]
    }
  ]
}
```

### Plan Comparison Component

```jsx
function PlanComparison({ currentPlan, onSelectPlan }) {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: ['1K searches', '10K docs', 'Basic search']
    },
    {
      id: 'starter',
      name: 'Starter',
      price: 29,
      features: ['10K searches', '100K docs', 'Advanced search']
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 99,
      features: ['100K searches', '1M docs', 'NL Search', 'Analytics']
    }
  ];

  return (
    <div className="plans-grid">
      {plans.map(plan => (
        <div
          key={plan.id}
          className={`plan-card ${plan.id === currentPlan ? 'current' : ''}`}
        >
          <h3>{plan.name}</h3>
          <div className="price">
            {plan.price === 0 ? (
              'Free'
            ) : (
              <>${plan.price}<span>/month</span></>
            )}
          </div>
          <ul className="features">
            {plan.features.map(feature => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <button
            onClick={() => onSelectPlan(plan.id)}
            disabled={plan.id === currentPlan}
          >
            {plan.id === currentPlan ? 'Current Plan' : 'Upgrade'}
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## Webhook Events

### stripe.webhook

Обрабатывает вебхуки от Stripe для синхронизации подписок.

**Поддерживаемые события:**

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`
- `payment_method.attached`
- `payment_method.detached`

### Webhook Setup

1. В Stripe Dashboard создайте webhook endpoint:
   ```
   https://api.aacsearch.com/api/webhooks/stripe
   ```

2. Выберите события для отслеживания

3. Скопируйте signing secret

4. Добавьте в переменные окружения:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Webhook Verification

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle event
  switch (event.type) {
    case 'customer.subscription.updated':
      const subscription = event.data.object;
      await updateSubscriptionInDatabase(subscription);
      break;

    case 'invoice.paid':
      const invoice = event.data.object;
      await recordPayment(invoice);
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      await notifyPaymentFailure(failedInvoice);
      break;
  }

  res.json({ received: true });
});
```

---

## Error Codes

### 402 Payment Required

```json
{
  "error": "Subscription required",
  "message": "This feature requires an active subscription",
  "upgradeUrl": "/billing"
}
```

### 403 Forbidden

```json
{
  "error": "Insufficient permissions",
  "message": "Only tenant owners and admins can manage billing"
}
```

### 429 Usage Limit Exceeded

```json
{
  "error": "Usage limit exceeded",
  "usage": 10000,
  "limit": 10000,
  "resetDate": "2024-12-01T00:00:00Z"
}
```

---

## Best Practices

### 1. Trial Period Management

```javascript
async function checkTrialStatus(tenantId) {
  const status = await getSubscriptionStatus(tenantId);

  if (status.subscription.status === 'trialing') {
    const daysLeft = Math.ceil(
      (new Date(status.subscription.trialEnd) - new Date()) /
      (1000 * 60 * 60 * 24)
    );

    if (daysLeft <= 3) {
      // Show trial ending warning
      showNotification(`Trial ends in ${daysLeft} days. Upgrade now!`);
    }
  }
}
```

### 2. Usage Monitoring

```javascript
async function monitorUsage(tenantId) {
  const status = await getSubscriptionStatus(tenantId);
  const { searches, documents } = status.usage;

  // Warn at 80% usage
  if (searches.percentage >= 80) {
    showWarning('You have used 80% of your monthly search quota');
  }

  // Block at 100% usage
  if (searches.percentage >= 100) {
    showError('Search quota exceeded. Please upgrade your plan');
    disableSearchFeatures();
  }
}
```

### 3. Failed Payment Handling

```javascript
async function handlePaymentFailure(subscription) {
  // Send email notification
  await sendEmail({
    to: subscription.customer.email,
    subject: 'Payment Failed',
    template: 'payment_failed',
    data: {
      amount: subscription.latestInvoice.amount,
      retryDate: subscription.latestInvoice.nextPaymentAttempt
    }
  });

  // Show in-app notification
  showPaymentFailureDialog({
    amount: subscription.latestInvoice.amount,
    updatePaymentUrl: await createPortalSession(subscription.tenantId)
  });

  // Downgrade features after grace period
  if (subscription.daysOverdue > 7) {
    await downgradeToFreePlan(subscription.tenantId);
  }
}
```

---

## Rate Limits

| Endpoint | Rate Limit |
|----------|------------|
| `/billing/checkout` | 10/hour |
| `/billing/portal` | 20/hour |
| `/billing/status` | 100/hour |
| `/billing/invoices` | 50/hour |
| `/billing/usage` | 100/hour |

---

## Дополнительные ресурсы

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Billing Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
- [Subscription Management Guide](/docs/guides/subscription-management)
- [Usage Tracking](/docs/guides/usage-tracking)
