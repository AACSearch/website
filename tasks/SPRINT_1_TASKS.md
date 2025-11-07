# Sprint 1: Content Replacement - Detailed Tasks

**Цель**: Заменить контент на главной странице правильными текстами из документации
**Время**: 2-3 дня
**Приоритет**: P0 (Critical)

---

## Чеклист задач

### ✅ Подготовка (30 минут)

- [ ] Прочитать `docs/en/01-introduction/README.md`
- [ ] Прочитать `docs/en/01-introduction/01-about.md`
- [ ] Прочитать `docs/en/01-introduction/02-features.md`
- [ ] Создать branch: `feature/sprint-1-content-replacement`

---

## Задача 1: Hero Section (1 час)

### Файл для изменения
**Путь**: `src/routes/(marketing)/(components)/hero.svelte`

### Текущее состояние
```svelte
const {
    title = "The developers' cloud",
    subtitle = 'AACSearch is an open-source, cloud development platform...'
}: Props = $props();
```

### Что заменить

**Источник**: `docs/en/01-introduction/README.md` строки 10-21

```svelte
const {
    title = "Enterprise Search Platform",
    subtitle = 'Professional SaaS platform for search management with multi-tenancy, AI search, and complete billing lifecycle'
}: Props = $props();
```

### Шаги:
1. [ ] Открыть файл `src/routes/(marketing)/(components)/hero.svelte`
2. [ ] Изменить `title` на "Enterprise Search Platform"
3. [ ] Изменить `subtitle` на текст из документации
4. [ ] Сохранить файл
5. [ ] Запустить `bun run dev` и проверить на localhost
6. [ ] Сделать commit: `feat: update hero section content`

### Результат
Hero section показывает правильный title и description для AACSearch Platform

---

## Задача 2: Features Section (2 часа)

### Файл для изменения
**Путь**: `src/routes/(marketing)/(components)/features.svelte`

### Что заменить

**Источник**: `docs/en/01-introduction/02-features.md` - разделы 1-10

Заменить существующие features на:

1. **Intelligent Search**
   - Title: "6 Types of Search"
   - Description: "Full-text, vector, semantic, conversational, image, and geo search"
   - Icon: search icon

2. **Multi-tenancy**
   - Title: "Complete Data Isolation"
   - Description: "Each organization has its own isolated data and resources"
   - Icon: shield/lock icon

3. **Integrations**
   - Title: "10+ Ready Integrations"
   - Description: "WordPress, Shopify, Magento, Ghost, Strapi, and more"
   - Icon: puzzle/integration icon

4. **Analytics**
   - Title: "Search Analytics"
   - Description: "Track queries, clicks, conversions, and performance metrics"
   - Icon: chart/analytics icon

5. **Billing**
   - Title: "Complete Billing System"
   - Description: "Stripe integration, subscriptions, invoices, and usage limits"
   - Icon: credit card icon

6. **API-first**
   - Title: "RESTful API"
   - Description: "Complete API with JWT auth, API keys, and comprehensive SDKs"
   - Icon: code/API icon

7. **Enterprise Security**
   - Title: "Security & Compliance"
   - Description: "GDPR, encryption, audit logs, and enterprise features"
   - Icon: security icon

8. **AI Search**
   - Title: "AI-Powered Search"
   - Description: "Natural language, conversational search with RAG, and voice search"
   - Icon: AI/brain icon

### Шаги:
1. [ ] Открыть файл
2. [ ] Найти массив features
3. [ ] Заменить каждый feature объект
4. [ ] Обновить тексты
5. [ ] Проверить иконки (можно оставить временные)
6. [ ] Сохранить и проверить
7. [ ] Commit: `feat: update features section content`

---

## Задача 3: Bento Grid - Product Cards (3 часа)

### Файл для изменения
**Путь**: `src/routes/(marketing)/(components)/bento/bento.svelte`

### Текущие карточки
```
1. Auth
2. Databases
3. Functions
4. Storage
5. Messaging
6. Realtime
```

### Новые карточки (6 главных продуктов)

**Источник**: `docs/en/01-introduction/02-features.md`

```javascript
const products = [
  {
    title: 'Search Core',
    description: 'Enterprise-grade full-text search with typo tolerance and facets',
    href: '/products/search-core',
    icon: '/images/products/search-core.svg' // временно
  },
  {
    title: 'AI Search',
    description: 'Natural language, conversational, and voice search powered by AI',
    href: '/products/ai-search',
    icon: '/images/products/ai-search.svg'
  },
  {
    title: 'Integrations',
    description: 'Connect 10+ platforms instantly with ready-made integrations',
    href: '/products/integrations',
    icon: '/images/products/integrations.svg'
  },
  {
    title: 'Analytics',
    description: 'Track queries, clicks, and conversions with detailed insights',
    href: '/products/analytics',
    icon: '/images/products/analytics.svg'
  },
  {
    title: 'Widgets',
    description: 'Embeddable search and chat widgets with full customization',
    href: '/products/widgets',
    icon: '/images/products/widgets.svg'
  },
  {
    title: 'Merchandising',
    description: 'Control search results with synonyms, overrides, and curation',
    href: '/products/merchandising',
    icon: '/images/products/merchandising.svg'
  }
]
```

### Шаги:
1. [ ] Открыть файл `bento.svelte`
2. [ ] Найти массив products/cards
3. [ ] Заменить каждую карточку
4. [ ] Обновить title, description, href
5. [ ] Обновить анимации (опционально, можно оставить старые)
6. [ ] Проверить что ссылки рабочие (будут вести на 404 пока страницы не созданы)
7. [ ] Commit: `feat: update bento grid products`

### Дополнительно:
Обновить анимации в папке `bento/(animations)/`:
- [ ] `search-core.svelte` (можно скопировать из существующей)
- [ ] `ai-search.svelte`
- [ ] `integrations.svelte`
- [ ] и т.д.

**Или**: оставить существующие анимации временно

---

## Задача 4: Pricing Section (2 часа)

### Файл для изменения
**Путь**: `src/routes/(marketing)/(components)/pricing.svelte`

### Что заменить

**Источник**: `docs/en/03-admin-guide/03-billing.md` (нужно создать этот раздел на основе анализа)

Обновить тарифные планы:

```javascript
const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for testing and small projects',
    features: [
      '10,000 searches/month',
      '1 collection',
      'Basic search',
      'Community support',
      'API access'
    ],
    cta: 'Start Free',
    highlighted: false
  },
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'For growing projects and startups',
    features: [
      '100,000 searches/month',
      '10 collections',
      'Full-text search',
      '2 integrations',
      'Email support',
      'Basic analytics'
    ],
    cta: 'Start Trial',
    highlighted: false
  },
  {
    name: 'Professional',
    price: '$99',
    period: '/month',
    description: 'For professional teams',
    features: [
      '500,000 searches/month',
      'Unlimited collections',
      'AI Search (limited)',
      '5 integrations',
      'Advanced analytics',
      'Priority support',
      'Custom widgets'
    ],
    cta: 'Start Trial',
    highlighted: true
  },
  {
    name: 'Business',
    price: '$299',
    period: '/month',
    description: 'For scaling businesses',
    features: [
      '2M searches/month',
      'Unlimited collections',
      'Full AI Search',
      'Unlimited integrations',
      'Full analytics',
      'Phone support',
      'SLA 99.9%',
      'A/B testing'
    ],
    cta: 'Contact Sales',
    highlighted: false
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: [
      'Custom volume',
      'Enterprise features',
      'Dedicated support',
      'SLA 99.99%',
      'On-premise option',
      'White-label',
      'Custom integrations',
      'Training & onboarding'
    ],
    cta: 'Contact Sales',
    highlighted: false
  }
]
```

### Шаги:
1. [ ] Открыть файл pricing.svelte
2. [ ] Найти массив тарифных планов
3. [ ] Заменить каждый план
4. [ ] Обновить features списки
5. [ ] Проверить визуально
6. [ ] Commit: `feat: update pricing plans`

---

## Задача 5: Platforms/Technologies Section (1 час)

### Файл для изменения
**Путь**: `src/routes/(marketing)/(components)/platforms.svelte`

### Что обновить

Показать платформы/технологии, с которыми интегрируется AACSearch:

**E-commerce**:
- Shopify
- WooCommerce
- Magento
- PrestaShop
- BigCommerce

**CMS**:
- WordPress
- Ghost
- Strapi
- Contentful
- Sanity
- Webflow

**Frameworks**:
- Next.js
- React
- Vue
- Svelte
- Angular

**Languages**:
- JavaScript/TypeScript
- Python
- PHP
- Ruby
- Go

### Шаги:
1. [ ] Открыть файл
2. [ ] Обновить список платформ
3. [ ] Добавить логотипы (если есть)
4. [ ] Проверить
5. [ ] Commit: `feat: update platforms section`

---

## Задача 6: Case Studies / Testimonials (1 час)

### Файлы для изменения
- `src/routes/(marketing)/(components)/case-studies.svelte`
- `$lib/components/product-pages/testimonials.svelte`

### Что сделать

**Временное решение**:
- [ ] Оставить существующую структуру
- [ ] Заменить тексты на generic для AACSearch
- [ ] Пометить TODO для будущих реальных testimonials

**Пример временного testimonial**:
```javascript
{
  name: "John Smith",
  title: "CTO",
  company: "E-commerce Platform",
  quote: "AACSearch transformed our product search. Conversion rate increased by 40%.",
  avatar: "/images/testimonials/placeholder.jpg"
}
```

### Шаги:
1. [ ] Открыть файлы
2. [ ] Заменить тексты на временные
3. [ ] Добавить TODO комментарий
4. [ ] Commit: `feat: add temporary testimonials`

---

## Задача 7: Footer & Header Links (1 час)

### Файлы для изменения
- `src/lib/components/layout/site-header.svelte`
- `src/lib/components/layout/site-footer.svelte`

### Header - Products Menu

Обновить dropdown меню продуктов:
```
Products:
  - Search Core
  - AI Search
  - Integrations
  - Widgets
  - Analytics
  - Merchandising
  - Multi-Search
  - Advanced Search
  - Developer Tools
  - Enterprise
```

### Footer - Quick Links

Обновить ссылки:
```
Products:
  - Search Core → /products/search-core
  - AI Search → /products/ai-search
  - Integrations → /products/integrations
  - View all → /products

Resources:
  - Documentation → /docs
  - API Reference → /docs/api-reference
  - Quick Start → /docs/quickstart
  - Blog → /blog

Company:
  - About → /company
  - Careers → /careers
  - Contact → /contact-us
  - Pricing → /pricing
```

### Шаги:
1. [ ] Обновить Header navigation
2. [ ] Обновить Footer links
3. [ ] Проверить все ссылки
4. [ ] Commit: `feat: update navigation links`

---

## Задача 8: Meta Tags & SEO (1 час)

### Файлы для изменения
- `src/routes/(marketing)/+page.svelte` - head section
- `src/lib/utils/metadata.ts`

### Что обновить

```svelte
<svelte:head>
  <title>AACSearch - Enterprise Search Platform</title>
  <meta name="description" content="Professional SaaS platform for search management with multi-tenancy, AI search, and complete billing lifecycle" />

  <!-- Open Graph -->
  <meta property="og:title" content="AACSearch - Enterprise Search Platform" />
  <meta property="og:description" content="Professional SaaS platform for search management..." />
  <meta property="og:image" content="https://aacsearch.io/images/og/home.png" />
  <meta property="og:url" content="https://aacsearch.io" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="AACSearch - Enterprise Search Platform" />
  <meta name="twitter:description" content="..." />
  <meta name="twitter:image" content="..." />
</svelte:head>
```

### Шаги:
1. [ ] Обновить meta tags
2. [ ] Обновить Open Graph tags
3. [ ] Добавить Twitter Card tags
4. [ ] Commit: `feat: update SEO meta tags`

---

## Задача 9: Constants Update (30 минут)

### Файл для изменения
**Путь**: `src/lib/constants.ts`

### Что обновить

```typescript
export const PRODUCTS = {
  searchCore: {
    name: 'Search Core',
    title: 'Enterprise Search Engine',
    description: 'Full-text search with typo tolerance',
    url: '/products/search-core',
    icon: 'search'
  },
  aiSearch: {
    name: 'AI Search',
    title: 'AI-Powered Search',
    description: 'Natural language and conversational search',
    url: '/products/ai-search',
    icon: 'ai'
  },
  // ... остальные продукты
};

export const SOCIAL_LINKS = {
  github: 'https://github.com/AACSearch',
  twitter: 'https://twitter.com/aacsearch',
  discord: 'https://discord.gg/aacsearch',
  linkedin: 'https://linkedin.com/company/aacsearch'
};
```

### Шаги:
1. [ ] Открыть constants.ts
2. [ ] Обновить PRODUCTS объект
3. [ ] Обновить SOCIAL_LINKS
4. [ ] Проверить использование в коде
5. [ ] Commit: `feat: update product constants`

---

## Задача 10: Testing & Verification (1 час)

### Чеклист проверки

- [ ] `bun run dev` запускается без ошибок
- [ ] Главная страница открывается
- [ ] Hero section показывает правильный текст
- [ ] Features секция показывает правильные features
- [ ] Bento grid показывает 6 продуктов
- [ ] Pricing показывает 5 тарифов
- [ ] Header navigation работает
- [ ] Footer links правильные
- [ ] Мобильная версия работает
- [ ] No console errors

### Шаги:
1. [ ] Запустить dev server
2. [ ] Проверить каждый раздел
3. [ ] Проверить responsive design
4. [ ] Проверить console на ошибки
5. [ ] Сделать скриншоты before/after
6. [ ] Final commit: `feat: sprint 1 complete - content replacement`

---

## Критерии приёмки (Definition of Done)

✅ Главная страница показывает правильные тексты из документации
✅ Hero section обновлен
✅ Features section обновлен (8 features)
✅ Bento grid показывает 6 продуктов AACSearch
✅ Pricing показывает 5 тарифных планов
✅ Navigation обновлена (header + footer)
✅ SEO meta tags обновлены
✅ Constants обновлены
✅ Нет console errors
✅ Build проходит успешно: `bun run build`
✅ Lighthouse score > 80

---

## Коммиты

Рекомендуемая структура коммитов:
```
feat: update hero section content
feat: update features section content
feat: update bento grid products
feat: update pricing plans
feat: update platforms section
feat: add temporary testimonials
feat: update navigation links
feat: update SEO meta tags
feat: update product constants
feat: sprint 1 complete - content replacement
```

---

## Next Steps

После завершения Sprint 1:
➡️ Sprint 2: Создание 10 страниц продуктов

---

**Last Updated**: 2025-11-07
**Status**: Ready to start
