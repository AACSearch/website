# 4. Руководство пользователя

## Обзор

Полное руководство по использованию AACSearch для создания мощных поисковых решений. Документация охватывает все аспекты работы с платформой - от базовых операций до продвинутых AI-powered функций.

## Структура документации

### [4.1 Коллекции](./01-collections/README.md)

Создание и управление коллекциями данных, проектирование схем, индексация документов.

**Файлы:**
- [README.md](./01-collections/README.md) - Обзор работы с коллекциями
- [01-creating-collections.md](./01-collections/01-creating-collections.md) - Создание коллекций через UI, Wizard, Templates (15+ страниц)
- [02-schemas.md](./01-collections/02-schemas.md) - Schema builder, валидация, миграции (18+ страниц)
- [03-field-types.md](./01-collections/03-field-types.md) - Все типы полей с примерами (25+ страниц)
- [04-indexing.md](./01-collections/04-indexing.md) - Индексация, hooks, автосинхронизация (20+ страниц)
- [05-bulk-import.md](./01-collections/05-bulk-import.md) - Массовый импорт CSV/JSON/JSONL (15+ страниц)

**Статус:** ✅ Полностью завершено (~5000 строк кода и примеров)

### [4.2 Поиск](./02-search/README.md)

Полнотекстовый поиск, фильтрация, фасеты, сортировка, подсветка результатов.

**Планируемые файлы:**
- [README.md](./02-search/README.md) - Обзор системы поиска ✅
- [01-basic-search.md](./02-search/01-basic-search.md) - query_by, prefix, infix (15 страниц)
- [02-advanced-search.md](./02-search/02-advanced-search.md) - weights, typo tolerance, stemming (25 страниц)
- [03-filters-facets.md](./02-search/03-filters-facets.md) - filter_by, facet_by (20 страниц)
- [04-sorting.md](./02-search/04-sorting.md) - sort_by, custom ranking (12 страниц)
- [05-highlighting.md](./02-search/05-highlighting.md) - highlight_fields, snippets (10 страниц)
- [06-presets.md](./02-search/06-presets.md) - Search presets (15 страниц)

**Статус:** 📋 README создан, детальные файлы планируются

### [4.3 Кураторство](./03-curation/README.md)

Синонимы, merchandising, overrides, управление результатами поиска.

**Планируемые файлы:**
- [README.md](./03-curation/README.md) - Обзор кураторства ✅
- [01-synonyms.md](./03-curation/01-synonyms.md) - Multi-way, One-way синонимы (18 страниц)
- [02-overrides.md](./03-curation/02-overrides.md) - Merchandising, pinning, excluding (25 страниц)
- [03-stopwords.md](./03-curation/03-stopwords.md) - Стоп-слова по языкам (10 страниц)
- [04-pinning.md](./03-curation/04-pinning.md) - Закрепление результатов (12 страниц)

**Статус:** 📋 README создан, детальные файлы планируются

### [4.4 Аналитика](./04-analytics/README.md)

Analytics dashboard, топ запросы, no-hits analysis, click tracking, A/B тестирование.

**Планируемые файлы:**
- [README.md](./04-analytics/README.md) - Обзор аналитики ✅
- [01-overview.md](./04-analytics/01-overview.md) - Analytics dashboard (15 страниц)
- [02-top-queries.md](./04-analytics/02-top-queries.md) - Анализ популярных запросов (12 страниц)
- [03-no-hits.md](./04-analytics/03-no-hits.md) - No-hits queries, автосинонимы (15 страниц)
- [04-click-tracking.md](./04-analytics/04-click-tracking.md) - CTR tracking (12 страниц)
- [05-ab-testing.md](./04-analytics/05-ab-testing.md) - A/B тестирование (18 страниц)

**Статус:** 📋 README создан, детальные файлы планируются

### [4.5 Интеграции](./05-integrations/README.md)

Готовые интеграции с CMS, e-commerce платформами, headless CMS.

**Планируемые файлы:**
- [README.md](./05-integrations/README.md) - Обзор интеграций ✅
- [01-wordpress.md](./05-integrations/01-wordpress.md) - Posts, Pages, ACF, webhooks (15 страниц)
- [02-shopify.md](./05-integrations/02-shopify.md) - Products, variants, inventory (18 страниц)
- [03-woocommerce.md](./05-integrations/03-woocommerce.md) - WooCommerce products (15 страниц)
- [04-magento.md](./05-integrations/04-magento.md) - Magento 2 integration (20 страниц)
- [05-ghost.md](./05-integrations/05-ghost.md) - Ghost CMS (12 страниц)
- [06-strapi.md](./05-integrations/06-strapi.md) - Strapi headless CMS (15 страниц)
- [07-contentful.md](./05-integrations/07-contentful.md) - Contentful (15 страниц)
- [08-sanity.md](./05-integrations/08-sanity.md) - Sanity.io, GROQ (18 страниц)
- [09-webflow.md](./05-integrations/09-webflow.md) - Webflow CMS (12 страниц)
- [10-other.md](./05-integrations/10-other.md) - Notion, Airtable (10 страниц)

**Статус:** 📋 README создан, детальные файлы планируются

### [4.6 Продвинутые функции](./06-advanced/README.md)

AI-powered поиск, vector search, image search, conversational search, geo-поиск.

**Планируемые файлы:**
- [README.md](./06-advanced/README.md) - Обзор продвинутых функций ✅
- [01-nl-search.md](./06-advanced/01-nl-search.md) - Natural Language Search (20 страниц)
- [02-vector-search.md](./06-advanced/02-vector-search.md) - Vector embeddings (18 страниц)
- [03-semantic-search.md](./06-advanced/03-semantic-search.md) - Semantic understanding (15 страниц)
- [04-conversational-search.md](./06-advanced/04-conversational-search.md) - RAG, chat (25 страниц)
- [05-image-search.md](./06-advanced/05-image-search.md) - CLIP, multimodal (15 страниц)
- [06-geo-search.md](./06-advanced/06-geo-search.md) - Advanced geo (18 страниц)
- [07-voice-search.md](./06-advanced/07-voice-search.md) - Whisper integration (12 страниц)
- [08-joins.md](./06-advanced/08-joins.md) - JOIN queries (20 страниц)
- [09-grouping.md](./06-advanced/09-grouping.md) - Result grouping (15 страниц)
- [10-federated-search.md](./06-advanced/10-federated-search.md) - Multi-search (15 страниц)

**Статус:** 📋 README создан, детальные файлы планируются

## Статистика созданной документации

### Файлы

**Создано:** 11 файлов
- ✅ 6 полных детальных файлов (раздел 4.1 Коллекции)
- ✅ 5 README файлов (разделы 4.2-4.6)

**Планируется:** 35+ файлов

### Объем

**Текущий объем:**
- **~5000 строк** детальной документации (раздел 4.1)
- **~3000 строк** README файлов (разделы 4.2-4.6)
- **Итого: ~8000 строк** готовой документации

**Примеры кода:**
- 100+ полных примеров TypeScript/JavaScript
- 50+ конфигураций и схем
- 30+ CLI команд
- 20+ архитектурных диаграмм

### Покрытие тем

#### ✅ Полностью готово (100%)

**4.1 Коллекции:**
- ✅ Создание коллекций (UI, Wizard, Templates, API)
- ✅ Проектирование схем (Builder, валидация, миграции)
- ✅ Все типы полей (string, int, float, bool, geopoint, object, auto, embeddings)
- ✅ Индексация (одиночная, массовая, hooks, автосинхронизация)
- ✅ Массовый импорт (CSV, JSON, JSONL, databases, API)

#### 📋 README готов (структура определена)

**4.2 Поиск:**
- 📋 Базовый поиск (query_by, prefix, infix)
- 📋 Продвинутый поиск (weights, typo tolerance, stemming)
- 📋 Фильтры и фасеты
- 📋 Сортировка
- 📋 Подсветка
- 📋 Presets

**4.3 Кураторство:**
- 📋 Синонимы (Multi-way, One-way)
- 📋 Overrides (Merchandising)
- 📋 Стоп-слова
- 📋 Pinning

**4.4 Аналитика:**
- 📋 Dashboard
- 📋 Топ запросы
- 📋 No-hits analysis
- 📋 Click tracking
- 📋 A/B тестирование

**4.5 Интеграции:**
- 📋 WordPress
- 📋 Shopify
- 📋 WooCommerce
- 📋 Magento
- 📋 Ghost
- 📋 Strapi
- 📋 Contentful
- 📋 Sanity
- 📋 Webflow
- 📋 Другие (Notion, Airtable)

**4.6 Продвинутые функции:**
- 📋 Natural Language Search
- 📋 Vector Search
- 📋 Semantic Search
- 📋 Conversational Search (RAG)
- 📋 Image Search (CLIP)
- 📋 Geo Search
- 📋 Voice Search (Whisper)
- 📋 JOINs
- 📋 Grouping
- 📋 Federated Search

## Быстрая навигация

### Начало работы

1. **Создайте первую коллекцию:**
   - [Через UI](./01-collections/01-creating-collections.md#создание-через-ui)
   - [Через API](./01-collections/01-creating-collections.md#создание-через-api)
   - [С Wizard](./01-collections/01-creating-collections.md#wizard-создания-коллекций)

2. **Спроектируйте схему:**
   - [Основы схем](./01-collections/02-schemas.md#основы-схем)
   - [Schema Builder](./01-collections/02-schemas.md#schema-builder)
   - [Валидация](./01-collections/02-schemas.md#валидация-схем)

3. **Добавьте данные:**
   - [Индексация документов](./01-collections/04-indexing.md)
   - [Массовый импорт](./01-collections/05-bulk-import.md)

4. **Настройте поиск:**
   - [Основы поиска](./02-search/README.md)

### E-commerce

1. [Создание коллекции товаров](./01-collections/01-creating-collections.md#e-commerce-коллекция)
2. [Shopify интеграция](./05-integrations/README.md#shopify)
3. [Поиск с фасетами](./02-search/README.md#e-commerce-поиск)
4. [Merchandising](./03-curation/README.md)

### Блог/Контент

1. [Коллекция постов](./01-collections/01-creating-collections.md#блог-коллекция)
2. [WordPress интеграция](./05-integrations/README.md#wordpress)
3. [Полнотекстовый поиск](./02-search/README.md)
4. [Аналитика запросов](./04-analytics/README.md)

### AI-powered Search

1. [Natural Language Search](./06-advanced/README.md#natural-language-search)
2. [Vector Search](./06-advanced/README.md#vector-search--embeddings)
3. [Conversational Search](./06-advanced/README.md#conversational-search--rag)
4. [Image Search](./06-advanced/README.md#image-search-with-clip)

## Дополнительные ресурсы

### Связанные разделы

- [Введение](/docs/ru/01-introduction/README.md) - Обзор платформы
- [Быстрый старт](/docs/ru/02-quickstart/README.md) - Начало работы
- [API Reference](/docs/ru/05-api-reference/README.md) - Полная документация API
- [Руководство разработчика](/docs/ru/06-developer-guide/README.md) - SDK и интеграции
- [Развертывание](/docs/ru/07-deployment/README.md) - Production deployment

### Внешние ссылки

- [Typesense Documentation](https://typesense.org/docs/)
- [OpenSearch Documentation](https://opensearch.org/docs/)
- [Elasticsearch Guide](https://www.elastic.co/guide/)

## Вклад в документацию

Нашли ошибку или хотите улучшить документацию? Мы приветствуем ваш вклад!

### Как помочь

1. **Сообщите об ошибке** - создайте issue в репозитории
2. **Предложите улучшение** - опишите что можно улучшить
3. **Создайте PR** - отправьте pull request с изменениями

### Стандарты документации

- Пишите на русском языке
- Используйте Markdown форматирование
- Включайте примеры кода
- Добавляйте скриншоты где необходимо
- Следуйте существующей структуре

## Обратная связь

Есть вопросы или предложения?

- **Email:** docs@aacsearch.com
- **GitHub:** [AACSearch Issues](https://github.com/aacsearch/platform/issues)
- **Slack:** [AACSearch Community](https://aacsearch.slack.com)

---

**Последнее обновление:** 2 ноября 2025
**Версия документации:** 1.0.0
**Статус:** В разработке
