# Sprint 1: Foundation & Setup

**Длительность**: 1 неделя (5 рабочих дней)
**Приоритет**: P0 (Critical)
**Команда**: 2 Frontend разработчика + 1 Дизайнер

## Цель спринта

Подготовить базовую инфраструктуру проекта, заменить все упоминания Appwrite на AACSearch, настроить дизайн-систему и создать базовые компоненты.

## Ключевые результаты (KR)

✅ Все константы и конфигурации обновлены на AACSearch
✅ Дизайн-система настроена (цвета, шрифты, компоненты)
✅ Базовые компоненты брендинга созданы
✅ Главная страница работает с новым брендингом
✅ Build проходит без ошибок

---

## Задачи

### 1. Обновление констант и конфигурации (1 день)

#### 1.1 Обновить файл констант
**Файл**: `src/lib/constants.ts`

- [ ] Заменить все URL на aacsearch.io домены
- [ ] Обновить названия продуктов (10 продуктов AACSearch)
- [ ] Обновить social media ссылки
- [ ] Добавить константы для 3 языков (en, ru, de)
- [ ] Обновить API endpoints

```typescript
// Пример структуры
export const SITE = {
  name: 'AACSearch',
  url: 'https://aacsearch.io',
  title: 'AACSearch - Enterprise Search Platform',
  description: 'Professional SaaS platform for enterprise search management'
};

export const PRODUCTS = {
  searchCore: { name: 'Search Core', url: '/products/search-core' },
  aiSearch: { name: 'AI Search', url: '/products/ai-search' },
  integrations: { name: 'Integrations', url: '/products/integrations' },
  widgets: { name: 'Widgets', url: '/products/widgets' },
  analytics: { name: 'Analytics', url: '/products/analytics' },
  merchandising: { name: 'Merchandising', url: '/products/merchandising' },
  multiSearch: { name: 'Multi-Search', url: '/products/multi-search' },
  advancedSearch: { name: 'Advanced Search', url: '/products/advanced-search' },
  developerTools: { name: 'Developer Tools', url: '/products/developer-tools' },
  enterprise: { name: 'Enterprise', url: '/products/enterprise' }
};

export const LANGUAGES = {
  en: { name: 'English', code: 'en' },
  ru: { name: 'Русский', code: 'ru' },
  de: { name: 'Deutsch', code: 'de' }
};
```

**Приоритет**: P0
**Оценка**: 4 часа

---

#### 1.2 Обновить package.json и метаданные
**Файл**: `package.json`

- [ ] Изменить name на "aacsearch-website"
- [ ] Обновить description
- [ ] Обновить repository URL
- [ ] Обновить author и contributors
- [ ] Проверить все зависимости

**Приоритет**: P0
**Оценка**: 1 час

---

#### 1.3 Обновить environment переменные
**Файлы**: `.env.example`, `.env`

- [ ] Обновить все URL и endpoints
- [ ] Добавить переменные для мультиязычности
- [ ] Настроить analytics endpoints
- [ ] Добавить API keys для AACSearch

```bash
PUBLIC_SITE_URL=https://aacsearch.io
PUBLIC_API_URL=https://api.aacsearch.com
PUBLIC_CONSOLE_URL=https://console.aacsearch.io
PUBLIC_DOCS_URL=https://aacsearch.io/docs

# Languages
PUBLIC_DEFAULT_LANG=en
PUBLIC_SUPPORTED_LANGS=en,ru,de

# Analytics
PUBLIC_ANALYTICS_ID=your-analytics-id
```

**Приоритет**: P0
**Оценка**: 2 часа

---

### 2. Дизайн-система и брендинг (1.5 дня)

#### 2.1 Обновить цветовую палитру
**Файл**: `src/app.css` или `tailwind.config.js`

- [ ] Определить primary цвета AACSearch
- [ ] Определить secondary цвета
- [ ] Обновить градиенты
- [ ] Создать цветовые токены для dark/light тем

```css
:root {
  /* AACSearch Brand Colors */
  --color-primary: #YOUR_PRIMARY_COLOR;
  --color-secondary: #YOUR_SECONDARY_COLOR;
  --color-accent: #YOUR_ACCENT_COLOR;

  /* Gradients */
  --gradient-primary: linear-gradient(135deg, ...);
}
```

**Приоритет**: P0
**Оценка**: 4 часа

---

#### 2.2 Создать лого компонент
**Файл**: `src/lib/components/brand/Logo.svelte`

- [ ] SVG лого AACSearch
- [ ] Варианты: full, icon-only, monochrome
- [ ] Адаптивность под размеры
- [ ] Dark/Light theme versions

**Приоритет**: P0
**Оценка**: 3 часа

---

#### 2.3 Обновить шрифты
**Файлы**: `local-fonts/`, `src/app.css`

- [ ] Выбрать и добавить шрифты для AACSearch
- [ ] Настроить font-face declarations
- [ ] Обновить типографику (headings, body, code)
- [ ] Оптимизировать загрузку шрифтов

**Приоритет**: P1
**Оценка**: 3 часа

---

#### 2.4 Создать иконки для продуктов
**Папка**: `src/icons/svg/`

- [ ] 10 иконок для продуктов AACSearch
- [ ] Иконки в едином стиле
- [ ] SVG оптимизация
- [ ] Добавить в icon build process

**Приоритет**: P0
**Оценка**: 4 часа

---

### 3. Базовые компоненты (1.5 дня)

#### 3.1 Обновить Header компонент
**Файл**: `src/lib/components/layout/site-header.svelte`

- [ ] Лого AACSearch
- [ ] Навигация по продуктам (10 продуктов)
- [ ] Языковой переключатель (EN/RU/DE)
- [ ] CTA кнопки (Console, Docs)
- [ ] Mobile navigation

**Приоритет**: P0
**Оценка**: 6 часов

---

#### 3.2 Обновить Footer компонент
**Файл**: `src/lib/components/layout/site-footer.svelte`

- [ ] Обновить ссылки на документацию
- [ ] Обновить продукты в футере
- [ ] Social media links для AACSearch
- [ ] Newsletter subscription
- [ ] Compliance links (Privacy, Terms)

**Приоритет**: P0
**Оценка**: 4 часа

---

#### 3.3 Создать ProductCard компонент
**Файл**: `src/lib/components/ProductCard.svelte`

- [ ] Карточка продукта с иконкой
- [ ] Название и описание
- [ ] CTA кнопка
- [ ] Hover эффекты
- [ ] Адаптивность

**Приоритет**: P0
**Оценка**: 3 часа

---

#### 3.4 Создать LanguageSwitcher компонент
**Файл**: `src/lib/components/LanguageSwitcher.svelte`

- [ ] Dropdown с языками (EN/RU/DE)
- [ ] Сохранение выбора в localStorage
- [ ] Редирект на нужный язык
- [ ] Флаги или названия языков

**Приоритет**: P0
**Оценка**: 4 часа

---

### 4. Главная страница (1 день)

#### 4.1 Обновить Hero секцию
**Файл**: `src/routes/(marketing)/+page.svelte`

- [ ] Новый заголовок для AACSearch
- [ ] Описание платформы из docs/en/01-introduction/01-about.md
- [ ] CTA кнопки (Start Free, View Demo, Read Docs)
- [ ] Hero изображение/анимация
- [ ] Gradient background

```svelte
<section class="hero">
  <h1>Enterprise Search Platform</h1>
  <p>Professional SaaS platform for search management with multi-tenancy,
     AI search, and complete billing lifecycle</p>
  <div class="ctas">
    <Button href="/console">Start Free</Button>
    <Button href="/demo" variant="outline">View Demo</Button>
  </div>
</section>
```

**Приоритет**: P0
**Оценка**: 6 часов

---

#### 4.2 Создать секцию Products Overview
**Файл**: `src/routes/(marketing)/+page.svelte`

- [ ] Grid из 10 продуктов
- [ ] Каждый продукт с иконкой и кратким описанием
- [ ] Ссылки на детальные страницы
- [ ] Адаптивная сетка (1/2/3/4 колонки)

**Приоритет**: P0
**Оценка**: 4 часа

---

#### 4.3 Создать секцию Key Features
**Файл**: `src/routes/(marketing)/+page.svelte`

- [ ] 6-8 ключевых фич из docs/en/01-introduction/02-features.md
- [ ] Иконки для каждой фичи
- [ ] Краткое описание
- [ ] Визуальные элементы

**Приоритет**: P1
**Оценка**: 4 часа

---

### 5. Роутинг и навигация (0.5 дня)

#### 5.1 Настроить базовую структуру роутов
**Папка**: `src/routes/`

- [ ] Создать структуру для языков: `[lang]/...`
- [ ] Создать папки для всех продуктов: `products/search-core/`, etc.
- [ ] Настроить redirects с корня на /en/
- [ ] Создать 404 страницу

**Приоритет**: P0
**Оценка**: 3 часа

---

#### 5.2 Обновить навигационное меню
**Файл**: `src/lib/components/layout/navigation/`

- [ ] Меню продуктов (dropdown или mega menu)
- [ ] Меню документации
- [ ] Pricing link
- [ ] Enterprise link
- [ ] Адаптивность для мобильных

**Приоритет**: P0
**Оценка**: 4 часа

---

### 6. Утилиты и хелперы (0.5 дня)

#### 6.1 Создать i18n utilities
**Файл**: `src/lib/utils/i18n.ts`

- [ ] Функция для получения текущего языка
- [ ] Функция для получения переводов
- [ ] Функция для форматирования дат по языкам
- [ ] Хелперы для мультиязычных URL

```typescript
export function getLanguage(params: any): Language {
  return params.lang || 'en';
}

export function t(key: string, lang: Language): string {
  // Translation logic
}
```

**Приоритет**: P0
**Оценка**: 3 часа

---

#### 6.2 Создать metadata utilities
**Файл**: `src/lib/utils/metadata.ts`

- [ ] Обновить SEO метаданные для AACSearch
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Structured Data для поисковиков

**Приоритет**: P1
**Оценка**: 2 часа

---

## Критерии приёмки (Definition of Done)

✅ **Build успешен**: `bun run build` проходит без ошибок
✅ **Все константы обновлены**: Нет упоминаний Appwrite в коде
✅ **Дизайн-система настроена**: Цвета, шрифты, компоненты работают
✅ **Главная страница работает**: Показывает AACSearch брендинг
✅ **Header и Footer обновлены**: Все ссылки рабочие
✅ **Тесты проходят**: Базовые unit тесты проходят
✅ **Lighthouse score**: > 80 по всем метрикам

---

## Риски и зависимости

### Риски
- **Дизайн**: Финализация логотипа и цветовой схемы может занять больше времени
- **Шрифты**: Лицензирование шрифтов может потребовать времени
- **Контент**: Нужен финальный текст для Hero секции

### Зависимости
- Лого AACSearch от дизайнера
- Финальная цветовая палитра
- Тексты для главной страницы

---

## Следующий спринт

После завершения Sprint 1, переходим к [Sprint 2: Content Migration](../sprint-2/README.md)

---

**Last Updated**: 2025-11-07
**Status**: Planning
