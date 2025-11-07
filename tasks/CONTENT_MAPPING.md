# AACSearch Website - Content Mapping & Replacement Plan

Этот документ показывает ПОЛНУЮ карту замены контента с использованием СУЩЕСТВУЮЩИХ компонентов и структуры сайта.

## Общая стратегия

✅ **ИСПОЛЬЗУЕМ** готовую структуру сайта
✅ **ПЕРЕИСПОЛЬЗУЕМ** существующие компоненты
✅ **ЗАМЕНЯЕМ** только контент текстами из `docs/en/`
✅ **АДАПТИРУЕМ** страницы продуктов под 10 продуктов AACSearch

---

## 1. Существующие страницы продуктов (Products)

### Текущие продукты Appwrite (5 штук):
1. `/products/auth` - Authentication
2. `/products/functions` - Functions
3. `/products/messaging` - Messaging
4. `/products/storage` - Storage
5. `/products/sites` - Sites

### Новые продукты AACSearch (10 штук):

| №  | Продукт | URL | Документация | Статус |
|----|---------|-----|--------------|--------|
| 1  | Search Core | `/products/search-core` | `docs/en/01-introduction/02-features.md` #1 | Создать |
| 2  | AI Search | `/products/ai-search` | `docs/en/01-introduction/02-features.md` #2 | Создать |
| 3  | Integrations | `/products/integrations` | `docs/en/01-introduction/02-features.md` #3 | Создать |
| 4  | Widgets | `/products/widgets` | `docs/en/01-introduction/02-features.md` #4 | Создать |
| 5  | Analytics | `/products/analytics` | `docs/en/01-introduction/02-features.md` #5 | Создать |
| 6  | Merchandising | `/products/merchandising` | `docs/en/01-introduction/02-features.md` #6 | Создать |
| 7  | Multi-Search | `/products/multi-search` | `docs/en/01-introduction/02-features.md` #7 | Создать |
| 8  | Advanced Search | `/products/advanced-search` | `docs/en/01-introduction/02-features.md` #8 | Создать |
| 9  | Developer Tools | `/products/developer-tools` | `docs/en/01-introduction/02-features.md` #9 | Создать |
| 10 | Enterprise | `/products/enterprise` | `docs/en/01-introduction/02-features.md` #10 | Создать |

---

## 2. Главная страница - `src/routes/(marketing)/+page.svelte`

### Существующие компоненты (переиспользуем):
```svelte
<Hero />                 ← Обновить title и subtitle
<Platforms />            ← Обновить список платформ/технологий
<LogoList />             ← Обновить логотипы клиентов
<Bento />                ← Заменить анимации на продукты AACSearch
<Pullquote />            ← Обновить testimonial
<CaseStudies />          ← Обновить кейсы клиентов
<Features />             ← Обновить список features
<Map />                  ← Оставить как есть (глобальная сеть)
<Scale />                ← Обновить testimonial
<Pricing />              ← Обновить тарифы
```

### Замена контента:

#### Hero Section
**Источник**: `docs/en/01-introduction/README.md`
```
Title: "Enterprise Search Platform"
Subtitle: "Professional SaaS platform for search management with multi-tenancy,
          AI search, and complete billing lifecycle"
```

#### Bento (Product Grid)
**Источник**: `docs/en/01-introduction/02-features.md`
- Заменить 6 карточек на 6 главных продуктов
- Обновить анимации в `bento/(animations)/`

#### Features
**Источник**: `docs/en/01-introduction/02-features.md`
Показать 6-8 ключевых фич:
- Multi-tenant architecture
- Intelligent search (6 типов)
- Ready-made integrations (10+)
- Complete billing via Stripe
- Enterprise security
- API-first approach

---

## 3. Страницы продуктов - Template

### Структура (копируем из `/products/auth/+page.svelte`):
```svelte
<Main>
  <Hero />              ← Заголовок продукта
  <Features />          ← Список возможностей
  <Bento />             ← Визуальные блоки
  <Access />            ← Примеры использования
  <SSR />               ← Технические детали
  <UseCases />          ← Кейсы использования
  <Testimonials />      ← Отзывы клиентов
  <OpenSource />        ← Open source info (если применимо)
  <ProductCards />      ← Другие продукты
</Main>
```

### Компоненты для переиспользования:

| Компонент | Путь | Что заменить |
|-----------|------|--------------|
| Hero | `(components)/Hero.svelte` | title, description |
| Features | `(components)/features/Features.svelte` | список фич |
| Bento | `(components)/Bento.svelte` | визуальные блоки |
| UseCases | `(components)/UseCases.svelte` | примеры использования |
| Testimonials | `$lib/components/product-pages/testimonials.svelte` | отзывы |

---

## 4. Примеры замены контента для продуктов

### 4.1 Search Core (`/products/search-core`)

**Источник контента**: `docs/en/01-introduction/02-features.md` - раздел "1. Search Core Features"

#### Hero:
```
Title: "Search Core"
Description: "Enterprise-grade full-text search engine powered by Typesense"
```

#### Features (из документации):
- Full-text search with typo tolerance
- Faceted navigation and filtering
- Autocomplete and suggestions
- Multi-language support (100+ languages)
- Real-time indexing
- Advanced query DSL

#### Code Examples (из документации):
```javascript
// Basic search
const results = await fetch('https://api.aacsearch.com/search', {
  params: {
    q: 'search query',
    collection: 'products'
  }
})
```

---

### 4.2 AI Search (`/products/ai-search`)

**Источник контента**: `docs/en/01-introduction/02-features.md` - раздел "2. AI Search Features"

#### Hero:
```
Title: "AI Search"
Description: "Natural language, conversational, and voice search powered by AI"
```

#### Features:
- Natural Language Search (NL)
- Conversational Search (RAG)
- Voice Search (Whisper, Google STT)
- Image Search (CLIP)
- Auto-embedding generation
- Hybrid Search (keyword + vector)

---

### 4.3 Integrations (`/products/integrations`)

**Источник**: `docs/en/01-introduction/02-features.md` - раздел "3. Integrations"

#### Hero:
```
Title: "Integrations"
Description: "Connect 10+ platforms instantly with ready-made integrations"
```

#### Integration Grid (использовать существующий grid):
- WordPress
- Shopify
- WooCommerce
- Magento
- Ghost
- Strapi
- Contentful
- Sanity
- Webflow
- + Custom via API

---

## 5. Документация - `/docs`

### Существующая структура:
```
/docs
  /advanced
  /apis
  /products
  /quick-starts
  /references
  /sdks
  /tooling
  /tutorials
```

### Замена на структуру из `docs/en/`:
```
/docs
  /introduction        ← docs/en/01-introduction/
  /quickstart          ← docs/en/02-quickstart/
  /admin-guide         ← docs/en/03-admin-guide/
  /user-guide          ← docs/en/04-user-guide/
  /api-reference       ← docs/en/05-api-reference/
  /developer-guide     ← docs/en/06-developer-guide/
  /deployment          ← docs/en/07-deployment/
  /saas-requirements   ← docs/en/08-saas-requirements/
```

**Компоненты для переиспользования**:
- `src/lib/layouts/Docs.svelte` - layout документации
- `src/lib/layouts/DocsArticle.svelte` - статья документации
- `src/lib/components/TocNav.svelte` - навигация
- Markdoc для рендеринга markdown

---

## 6. Pricing - `/pricing`

### Существующая страница: ✅ Переиспользуем
**Компонент**: `src/routes/(marketing)/(components)/pricing.svelte`

### Замена контента:
**Источник**: `docs/en/03-admin-guide/03-billing.md`

#### Тарифные планы:
1. **Free** - $0/month
   - 10,000 searches/month
   - 1 collection
   - Basic support

2. **Starter** - $29/month
   - 100,000 searches/month
   - 10 collections
   - 2 integrations
   - Email support

3. **Professional** - $99/month
   - 500,000 searches/month
   - Unlimited collections
   - 5 integrations
   - AI Search (limited)
   - Priority support

4. **Business** - $299/month
   - 2M searches/month
   - Unlimited everything
   - Full AI Search
   - Phone support
   - SLA 99.9%

5. **Enterprise** - Custom
   - Custom volume
   - Enterprise features
   - Dedicated support
   - SLA 99.99%
   - On-premise option

---

## 7. Другие страницы

### 7.1 About / Company (`/company`)
**Источник**: `docs/en/01-introduction/01-about.md`
- История AACSearch
- Миссия и ценности
- Команда

### 7.2 Use Cases
**Источник**: `docs/en/01-introduction/05-use-cases.md`
- E-commerce
- Content platforms
- SaaS applications
- Enterprise

### 7.3 Comparison (`/comparison` или `/vs`)
**Источник**: `docs/en/01-introduction/06-comparison.md`
- vs Algolia
- vs Elasticsearch
- vs Typesense standalone

### 7.4 Blog (`/blog`)
✅ Оставляем структуру как есть
Добавляем контент из `docs/en/appendix/D-changelog.md` как посты

---

## 8. Компоненты для переиспользования

### Layout компоненты:
| Компонент | Путь | Использование |
|-----------|------|---------------|
| Main | `$lib/layouts/Main.svelte` | Основной layout |
| Docs | `$lib/layouts/Docs.svelte` | Layout документации |
| Header | `$lib/components/layout/site-header.svelte` | Навигация |
| Footer | `$lib/components/layout/site-footer.svelte` | Футер |

### UI компоненты:
| Компонент | Путь | Использование |
|-----------|------|---------------|
| Button | `$lib/components/ui/button.svelte` | CTA кнопки |
| Card | `$lib/components/ui/card.svelte` | Карточки продуктов |
| Badge | `$lib/components/ui/badge.svelte` | Теги и метки |
| Hero | `$lib/components/ui/hero.svelte` | Hero секции |

### Product компоненты:
| Компонент | Путь | Использование |
|-----------|------|---------------|
| ProductCards | `$lib/components/product-pages/product-cards.svelte` | Список продуктов |
| Testimonials | `$lib/components/product-pages/testimonials.svelte` | Отзывы |
| Hero | `$lib/components/product-pages/hero.svelte` | Product hero |

### Marketing компоненты:
| Компонент | Путь | Использование |
|-----------|------|---------------|
| Features | `(marketing)/(components)/features.svelte` | Список фич |
| Pricing | `(marketing)/(components)/pricing.svelte` | Pricing таблица |
| CaseStudies | `(marketing)/(components)/case-studies.svelte` | Кейсы клиентов |
| Platforms | `(marketing)/(components)/platforms.svelte` | Поддерживаемые платформы |
| Map | `(marketing)/(components)/map.svelte` | Карта мира |

---

## 9. Контент из документации - Mapping

### Главные файлы для замены:

| Файл документации | Где использовать | Что заменить |
|-------------------|------------------|--------------|
| `01-introduction/README.md` | Главная страница Hero | Title, description |
| `01-introduction/01-about.md` | `/company`, Hero sections | О платформе |
| `01-introduction/02-features.md` | Все страницы продуктов | Описания фич |
| `01-introduction/03-architecture.md` | `/products/enterprise` | Техническая архитектура |
| `01-introduction/05-use-cases.md` | Страницы продуктов UseCases | Примеры использования |
| `01-introduction/06-comparison.md` | `/comparison` страница | Сравнение с конкурентами |
| `02-quickstart/*` | `/docs/quickstart` | Quick Start гайды |
| `03-admin-guide/03-billing.md` | `/pricing` | Тарифные планы |
| `04-user-guide/*` | `/docs/user-guide` | Документация пользователя |
| `05-api-reference/*` | `/docs/api` | API документация |

---

## 10. План работы (правильный подход)

### Этап 1: Замена контента главной страницы (1 день)
- [ ] Обновить Hero title и subtitle из `01-introduction/README.md`
- [ ] Обновить Features секцию из `01-introduction/02-features.md`
- [ ] Обновить Bento карточки на 10 продуктов
- [ ] Обновить testimonials (временные тексты)

### Этап 2: Создание страниц 10 продуктов (3 дня)
Для каждого продукта:
- [ ] Копировать структуру из `/products/auth/+page.svelte`
- [ ] Заменить контент из `01-introduction/02-features.md`
- [ ] Обновить Hero компонент
- [ ] Обновить Features список
- [ ] Добавить примеры кода из документации

### Этап 3: Интеграция документации (2 дня)
- [ ] Копировать структуру роутов из `docs/en/`
- [ ] Настроить Markdoc для рендеринга
- [ ] Создать навигацию по разделам
- [ ] Добавить search по документации

### Этап 4: Pricing и другие страницы (1 день)
- [ ] Обновить Pricing из `03-admin-guide/03-billing.md`
- [ ] Создать Comparison страницу
- [ ] Обновить Company страницу

### Этап 5: Мультиязычность (2 дня)
- [ ] Настроить i18n роутинг `[lang]/...`
- [ ] Добавить переводы для RU и DE
- [ ] Создать language switcher
- [ ] Обновить SEO для языков

---

## 11. Приоритеты замены

### P0 (Must Have):
✅ Главная страница Hero и Features
✅ 10 страниц продуктов
✅ Pricing страница
✅ Базовая документация (EN)

### P1 (Should Have):
✅ Полная документация из docs/en/
✅ Comparison страница
✅ Use Cases примеры
✅ Testimonials и case studies

### P2 (Nice to Have):
✅ Переводы на RU и DE
✅ Blog посты
✅ Interactive demos
✅ Video контент

---

**Last Updated**: 2025-11-07
**Status**: Ready for implementation
