# AACSearch Website - Implementation Plan

План реализации с переиспользованием ГОТОВЫХ компонентов и структуры.

## Стратегия

✅ Сайт УЖЕ ГОТОВ - структура, компоненты, дизайн есть
✅ Нужно ЗАМЕНИТЬ КОНТЕНТ из `docs/en/`
✅ Создать 10 страниц продуктов на основе СУЩЕСТВУЮЩЕГО template
✅ Интегрировать документацию в существующую структуру

---

## Sprint 1: Content Replacement (2-3 дня)

### Цель
Заменить ВСЕ тексты на правильные из документации, обновить главную страницу

### Задачи

#### 1.1 Главная страница - Hero Section
**Файл**: `src/routes/(marketing)/(components)/hero.svelte`
**Время**: 1 час

```svelte
// БЫЛО:
title = "The developers' cloud"
subtitle = 'AACSearch is an open-source...'

// СТАЛО (из docs/en/01-introduction/README.md):
title = "Enterprise Search Platform"
subtitle = 'Professional SaaS platform for search management with multi-tenancy,
           AI search, and complete billing lifecycle'
```

- [ ] Обновить title
- [ ] Обновить subtitle
- [ ] Обновить CTA текст кнопки

---

#### 1.2 Features Section
**Файл**: `src/routes/(marketing)/(components)/features.svelte`
**Источник**: `docs/en/01-introduction/02-features.md`
**Время**: 2 часа

- [ ] Заменить 6-8 features на ключевые из документации:
  - Intelligent Search (6 типов)
  - Multi-tenancy
  - Integrations (10+)
  - Analytics
  - Billing
  - API-first
  - Enterprise Security

---

#### 1.3 Bento Grid (Product Cards)
**Файл**: `src/routes/(marketing)/(components)/bento/bento.svelte`
**Источник**: `docs/en/01-introduction/02-features.md`
**Время**: 3 часа

ТЕКУЩИЕ карточки (6): auth, databases, functions, storage, messaging, realtime

НОВЫЕ карточки (6 главных):
1. Search Core - `/products/search-core`
2. AI Search - `/products/ai-search`
3. Integrations - `/products/integrations`
4. Analytics - `/products/analytics`
5. Widgets - `/products/widgets`
6. Merchandising - `/products/merchandising`

- [ ] Обновить заголовки карточек
- [ ] Обновить описания
- [ ] Обновить иконки (или оставить временно)
- [ ] Обновить ссылки на страницы продуктов

---

#### 1.4 Pricing
**Файл**: `src/routes/(marketing)/(components)/pricing.svelte`
**Источник**: `docs/en/03-admin-guide/03-billing.md`
**Время**: 2 часа

- [ ] Обновить тарифные планы (5 тарифов)
- [ ] Обновить описания возможностей
- [ ] Обновить цены (если есть)
- [ ] Обновить features в каждом тарифе

---

#### 1.5 Testimonials и Case Studies
**Файлы**:
- `src/routes/(marketing)/(components)/case-studies.svelte`
- `$lib/components/product-pages/testimonials.svelte`
**Время**: 1 час

- [ ] Временно оставить существующие testimonials
- [ ] Обновить компанию/имя на AACSearch context
- [ ] Подготовить список для будущих реальных testimonials

---

## Sprint 2: Product Pages (3-4 дня)

### Цель
Создать 10 страниц продуктов на основе существующего template

### Template для копирования
**Базовая страница**: `src/routes/products/auth/+page.svelte`

### Структура каждой страницы:
```
/products/[product-name]/
  ├── +page.svelte
  ├── +page.ts
  └── (components)/
      ├── Hero.svelte
      ├── Features.svelte
      ├── Bento.svelte
      ├── UseCases.svelte
      └── Access.svelte (опционально)
```

---

### 2.1 Search Core (`/products/search-core`)
**Источник**: `docs/en/01-introduction/02-features.md` - раздел 1
**Время**: 3 часа

**Файлы для создания**:
- [x] `src/routes/products/search-core/+page.svelte`
- [x] `src/routes/products/search-core/+page.ts`
- [x] `src/routes/products/search-core/(components)/Hero.svelte`
- [x] `src/routes/products/search-core/(components)/Features.svelte`

**Контент**:
```
Hero:
  Title: "Search Core"
  Description: "Enterprise-grade full-text search engine powered by Typesense"

Features:
  - Full-text search with typo tolerance
  - Faceted navigation
  - Autocomplete and suggestions
  - Multi-language support (100+)
  - Real-time indexing
  - Advanced query DSL

Code Example:
  (копировать из документации раздел 1.1)
```

---

### 2.2 AI Search (`/products/ai-search`)
**Источник**: `docs/en/01-introduction/02-features.md` - раздел 2
**Время**: 3 часа

**Контент**:
```
Hero:
  Title: "AI Search"
  Description: "Natural language, conversational, and voice search powered by AI"

Features:
  - Natural Language Search (NL)
  - Conversational Search (RAG)
  - Voice Search (Whisper, STT)
  - Image Search (CLIP)
  - Auto-embedding generation
  - Hybrid Search

Code Example:
  (из документации раздел 2.1)
```

---

### 2.3 Integrations (`/products/integrations`)
**Источник**: `docs/en/01-introduction/02-features.md` - раздел 3
**Время**: 3 часа

**Дополнительно**: Показать grid интеграций (10+ карточек)

---

### 2.4 Widgets (`/products/widgets`)
**Источник**: `docs/en/01-introduction/02-features.md` - раздел 4
**Время**: 3 часа

**Дополнительно**: Интерактивный preview виджетов

---

### 2.5 Analytics (`/products/analytics`)
**Источник**: `docs/en/01-introduction/02-features.md` - раздел 5
**Время**: 3 часа

---

### 2.6 Merchandising (`/products/merchandising`)
**Источник**: `docs/en/01-introduction/02-features.md` - раздел 6
**Время**: 3 часа

---

### 2.7 Multi-Search (`/products/multi-search`)
**Источник**: `docs/en/01-introduction/02-features.md` - раздел 7
**Время**: 3 часа

---

### 2.8 Advanced Search (`/products/advanced-search`)
**Источник**: `docs/en/01-introduction/02-features.md` - раздел 8
**Время**: 3 часа

---

### 2.9 Developer Tools (`/products/developer-tools`)
**Источник**: `docs/en/01-introduction/02-features.md` - раздел 9
**Время**: 3 часа

---

### 2.10 Enterprise (`/products/enterprise`)
**Источник**: `docs/en/01-introduction/02-features.md` - раздел 10
**Время**: 3 часа

**Дополнительно**: Показать enterprise features из `docs/en/01-introduction/03-architecture.md`

---

## Sprint 3: Documentation Integration (2-3 дня)

### Цель
Интегрировать полную документацию из `docs/en/` в существующую структуру `/docs`

### 3.1 Структура роутов документации
**Время**: 2 часа

Создать структуру папок:
```
src/routes/docs/
  ├── introduction/
  ├── quickstart/
  ├── admin-guide/
  ├── user-guide/
  ├── api-reference/
  ├── developer-guide/
  ├── deployment/
  └── saas-requirements/
```

---

### 3.2 Копирование markdown файлов
**Время**: 3 часа

Для каждой секции:
- [ ] Создать папку
- [ ] Копировать markdown файлы из `docs/en/XX-название/`
- [ ] Создать `+page.svelte` для рендеринга
- [ ] Создать `+page.ts` для загрузки контента

**Переиспользуем компоненты**:
- `src/lib/layouts/Docs.svelte` - layout
- `src/lib/layouts/DocsArticle.svelte` - article wrapper
- Существующую систему Markdoc

---

### 3.3 Навигация по документации
**Файл**: `src/lib/components/TocNav.svelte`
**Время**: 2 часа

- [ ] Создать структуру навигации из README.md файлов
- [ ] Создать sidebar с разделами
- [ ] Добавить breadcrumbs
- [ ] Добавить search по документации (существующий компонент)

---

### 3.4 Code highlighting и примеры
**Время**: 2 часа

- [ ] Проверить работу syntax highlighting
- [ ] Добавить copy-to-clipboard для примеров кода
- [ ] Убедиться что все примеры из документации отображаются корректно

---

## Sprint 4: Additional Pages (1-2 дня)

### 4.1 Comparison Page (`/comparison`)
**Источник**: `docs/en/01-introduction/06-comparison.md`
**Время**: 3 часа

**Создать**:
- [ ] `/src/routes/comparison/+page.svelte`
- [ ] Comparison table компонент
- [ ] Показать: AACSearch vs Algolia, Elasticsearch, Typesense

---

### 4.2 Use Cases Page (`/use-cases`)
**Источник**: `docs/en/01-introduction/05-use-cases.md`
**Время**: 2 часа

**Создать**:
- [ ] Grid из use cases (4 карточки)
- [ ] E-commerce, Content, SaaS, Enterprise
- [ ] Переиспользовать существующие card компоненты

---

### 4.3 Company/About Page (`/company`)
**Источник**: `docs/en/01-introduction/01-about.md`
**Время**: 2 часа

Обновить существующую страницу `/company`

---

## Sprint 5: Internationalization (2-3 дня)

### Цель
Добавить поддержку 3 языков (EN, RU, DE)

### 5.1 i18n Routing Setup
**Время**: 4 часа

**Создать структуру**:
```
src/routes/
  ├── [lang]/
  │   ├── +layout.svelte
  │   ├── +layout.ts
  │   ├── products/
  │   ├── docs/
  │   └── ...
  └── +page.ts (redirect to /en/)
```

**Файлы**:
- [ ] `src/lib/utils/i18n.ts` - utilities
- [ ] `src/lib/i18n/translations/` - файлы переводов
- [ ] `src/lib/components/LanguageSwitcher.svelte`

---

### 5.2 Translations
**Время**: 6-8 часов (с помощью переводчиков)

**Для каждого языка**:
- [ ] Перевести тексты интерфейса (buttons, labels)
- [ ] Перевести Hero sections
- [ ] Перевести Product descriptions
- [ ] Перевести Features списки

**Приоритет**:
1. EN - уже готово
2. RU - высокий приоритет
3. DE - средний приоритет

---

### 5.3 Documentation Translation
**Время**: depends on translators

**Опции**:
1. Автоматический перевод (DeepL, GPT) + ручная проверка
2. Профессиональные переводчики
3. Community contributions

---

## Sprint 6: Polish & Launch (1-2 дня)

### 6.1 Performance Optimization
**Время**: 3 часа

- [ ] Lighthouse audit
- [ ] Оптимизация изображений
- [ ] Code splitting
- [ ] Lazy loading

---

### 6.2 SEO
**Время**: 2 часа

- [ ] Meta tags для всех страниц
- [ ] Open Graph images
- [ ] Sitemap.xml
- [ ] robots.txt

---

### 6.3 Final Testing
**Время**: 3 часа

- [ ] Тестирование всех страниц
- [ ] Проверка всех ссылок
- [ ] Мобильная адаптивность
- [ ] Cross-browser testing

---

## Общая оценка времени

| Sprint | Задачи | Время |
|--------|--------|-------|
| 1 | Content Replacement | 2-3 дня |
| 2 | Product Pages (10 штук) | 3-4 дня |
| 3 | Documentation Integration | 2-3 дня |
| 4 | Additional Pages | 1-2 дня |
| 5 | Internationalization | 2-3 дня |
| 6 | Polish & Launch | 1-2 дня |
| **TOTAL** | | **11-17 дней** |

---

## Критические файлы для изменения

### Обязательно обновить:

1. **Главная страница**:
   - `src/routes/(marketing)/+page.svelte`
   - `src/routes/(marketing)/(components)/hero.svelte`
   - `src/routes/(marketing)/(components)/features.svelte`
   - `src/routes/(marketing)/(components)/bento/bento.svelte`
   - `src/routes/(marketing)/(components)/pricing.svelte`

2. **Константы**:
   - `src/lib/constants.ts`
   - `.env.example`

3. **Навигация**:
   - `src/lib/components/layout/site-header.svelte`
   - `src/lib/components/layout/site-footer.svelte`

4. **Metadata**:
   - `src/lib/utils/metadata.ts`

---

## Риски

### Низкий риск:
✅ Структура сайта готова
✅ Компоненты готовы
✅ Дизайн готов

### Средний риск:
⚠️ Качество переводов на RU/DE
⚠️ Наличие реальных testimonials
⚠️ Качество скриншотов/изображений

### Высокий риск:
🔴 Нет - все под контролем!

---

**Next Steps**: Начинаем с Sprint 1 - замена контента главной страницы

**Last Updated**: 2025-11-07
