# Глоссарий терминов AACSearch

Полный словарь терминов и понятий, используемых в платформе AACSearch.

---

## A

### API Key (API Ключ)
**EN:** API Key
**RU:** Ключ для доступа к API платформы
**Описание:** Уникальный идентификатор для аутентификации запросов к API. Бывают Admin Keys (полный доступ) и Search-only Keys (только поиск).
**Пример:** `aac_1a2b3c4d5e6f7g8h9i0j`
**См. также:** Authentication, Scoped Key

### Analytics (Аналитика)
**EN:** Analytics
**RU:** Сбор и анализ данных о поисковых запросах
**Описание:** Автоматический мониторинг метрик: популярные запросы, no-hits queries, click-through rate, conversion rate.
**Пример:** Top 10 searched queries, Average search latency
**См. также:** Metrics, Dashboard

### Auto-complete (Автодополнение)
**EN:** Auto-complete / Type-ahead
**RU:** Автоматическое дополнение поискового запроса
**Описание:** Предложение вариантов завершения запроса по мере ввода пользователем.
**Пример:** Ввод "lapt" → предложения: "laptop", "laptop bag", "laptop stand"
**См. также:** Suggestions, Prefix Search

---

## B

### Billing (Биллинг)
**EN:** Billing
**RU:** Система расчетов и выставления счетов
**Описание:** Автоматический подсчет использования (searches, documents, API calls) и формирование инвойсов.
**См. также:** Subscription, Usage Tracking, Invoice

### Boosting (Буст)
**EN:** Boosting
**RU:** Повышение релевантности определенных документов
**Описание:** Увеличение веса (score) документов по заданным критериям для их появления выше в результатах.
**Пример:** `brand:Apple^3` - утроить вес для Apple продуктов
**См. также:** Ranking, Relevance, Weight

### Batch Operations (Пакетные операции)
**EN:** Batch Operations
**RU:** Массовые операции с документами
**Описание:** Индексация, обновление или удаление нескольких документов за один API запрос.
**Пример:** Импорт 10,000 продуктов за один раз
**См. также:** Bulk Import, Indexing

---

## C

### Collection (Коллекция)
**EN:** Collection
**RU:** Набор документов с общей схемой
**Описание:** Логическая группировка документов одного типа (аналог таблицы в БД или индекса в Elasticsearch).
**Пример:** Collections: `products`, `posts`, `users`
**См. также:** Schema, Document, Index

### CRUD (CRUD операции)
**EN:** Create, Read, Update, Delete
**RU:** Основные операции с данными
**Описание:** Создание, чтение, обновление и удаление документов через API.
**См. также:** REST API, GraphQL API

### Cache (Кэш)
**EN:** Cache
**RU:** Временное хранилище часто запрашиваемых данных
**Описание:** Redis-based кэширование результатов поиска для ускорения повторных запросов.
**Пример:** Кэш результатов на 5 минут
**См. также:** Redis, TTL, Performance

### Conversational Search (Диалоговый поиск)
**EN:** Conversational Search
**RU:** Поиск на естественном языке с контекстом
**Описание:** RAG-based поиск с использованием LLM для понимания сложных вопросов.
**Пример:** "What are the best laptops under $1000 for students?"
**См. также:** Natural Language, RAG, LLM

### Compliance (Соответствие требованиям)
**EN:** Compliance
**RU:** Соблюдение стандартов и регуляций
**Описание:** GDPR, HIPAA, SOC 2 compliance для enterprise клиентов.
**См. также:** GDPR, Audit Trail, Security

---

## D

### Document (Документ)
**EN:** Document
**RU:** Единица данных в коллекции
**Описание:** JSON объект с полями, определенными в схеме коллекции.
**Пример:**
```json
{
  "id": "123",
  "title": "Laptop",
  "price": 999.99,
  "category": "Electronics"
}
```
**См. также:** Collection, Schema, Field

### Dual-write (Двойная запись)
**EN:** Dual-write
**RU:** Одновременная запись в БД и поисковый индекс
**Описание:** Паттерн синхронизации PostgreSQL ↔ Typesense для консистентности данных.
**См. также:** Sync, Indexing, Consistency

---

## E

### Embedding (Эмбеддинг)
**EN:** Embedding / Vector Embedding
**RU:** Векторное представление текста
**Описание:** Преобразование текста в числовой вектор (обычно 384-1536 размерности) для семантического поиска.
**Пример:** "MacBook Pro" → [0.123, -0.456, 0.789, ...]
**См. также:** Vector Search, Semantic Search, OpenAI

### Exact Match (Точное совпадение)
**EN:** Exact Match
**RU:** Поиск точного совпадения
**Описание:** Поиск документов, где поле точно равно заданному значению.
**Пример:** `sku:="MBP16-001"`
**См. также:** Filter, Query

### Export (Экспорт)
**EN:** Export
**RU:** Выгрузка данных из коллекции
**Описание:** Получение всех документов коллекции в JSON/CSV формате.
**См. также:** Import, Backup, Migration

---

## F

### Facet (Фасет)
**EN:** Facet / Faceted Search
**RU:** Фасетная навигация
**Описание:** Группировка результатов по категориям с подсчетом количества в каждой группе.
**Пример:**
```
Category:
- Laptops (45)
- Tablets (23)
- Phones (67)
```
**См. также:** Filter, Aggregation, Navigation

### Filter (Фильтр)
**EN:** Filter
**RU:** Фильтрация результатов поиска
**Описание:** Ограничение результатов по определенным условиям.
**Пример:** `price:[100..500] && stock:>0`
**См. также:** Query, Facet, Range

### Federated Search (Федеративный поиск)
**EN:** Federated Search
**RU:** Поиск по нескольким коллекциям одновременно
**Описание:** Выполнение одного запроса к нескольким коллекциям с объединением результатов.
**См. также:** Multi-collection Search

---

## G

### Geo Search (Геопоиск)
**EN:** Geo Search / Geographic Search
**RU:** Поиск по географическим координатам
**Описание:** Фильтрация и сортировка результатов по расстоянию от точки или внутри области.
**Пример:** Рестораны в радиусе 5km от пользователя
**См. также:** Location, Radius, Geopoint

### Grouping (Группировка)
**EN:** Grouping / Group By
**RU:** Группировка результатов
**Описание:** Объединение похожих результатов (например, варианты одного продукта).
**См. также:** Deduplication, Variants

### GDPR (GDPR)
**EN:** General Data Protection Regulation
**RU:** Общий регламент по защите данных
**Описание:** EU регуляция по защите персональных данных.
**Функции:** Right to be forgotten, Data export, Consent management
**См. также:** Compliance, Privacy, PII

---

## H

### Highlighting (Подсветка)
**EN:** Highlighting / Hit Highlighting
**RU:** Выделение совпадений в результатах
**Описание:** Подсветка найденных терминов в тексте результатов.
**Пример:** "MacBook **Pro** 16 inch" (Pro подсвечен)
**См. также:** Snippet, Match

### HMAC (HMAC)
**EN:** Hash-based Message Authentication Code
**RU:** Подпись запросов для безопасности
**Описание:** Криптографическая подпись webhook событий для верификации источника.
**См. также:** Webhook Security, Signature

### Hooks (Хуки)
**EN:** Hooks / Lifecycle Hooks
**RU:** Обработчики событий жизненного цикла
**Описание:** Функции, вызываемые до/после операций (beforeCreate, afterUpdate, etc.).
**См. также:** Events, Lifecycle, Callbacks

---

## I

### Index (Индекс)
**EN:** Index / Search Index
**RU:** Поисковый индекс
**Описание:** Структура данных для быстрого поиска (inverted index, vector index, geo index).
**См. также:** Collection, Indexing, Schema

### Infix Search (Инфиксный поиск)
**EN:** Infix Search
**RU:** Поиск подстроки внутри слова
**Описание:** Нахождение совпадений в середине слова (не только в начале).
**Пример:** Поиск "book" находит "Facebook", "ebook"
**См. также:** Prefix Search, Substring

### Integration (Интеграция)
**EN:** Integration
**RU:** Интеграция с внешними системами
**Описание:** Коннекторы для синхронизации с Shopify, WordPress, WooCommerce и др.
**См. также:** Connector, Sync, Webhook

### Inverted Index (Инвертированный индекс)
**EN:** Inverted Index
**RU:** Обратный индекс
**Описание:** Структура данных: term → list of documents containing term.
**См. также:** Index, Full-text Search

---

## J

### JOIN (JOIN)
**EN:** JOIN
**RU:** Объединение данных из нескольких коллекций
**Описание:** Связывание документов из разных коллекций (relationship fields).
**Пример:** Product → Category relationship
**См. также:** Relationship, Reference

### JWT (JWT)
**EN:** JSON Web Token
**RU:** Токен для аутентификации
**Описание:** Токен для stateless authentication пользователей.
**См. также:** Authentication, Session, Token

### JSON (JSON)
**EN:** JavaScript Object Notation
**RU:** Формат данных
**Описание:** Формат для хранения и передачи документов.
**См. также:** Document, Schema, API

---

## K

### Keyword Search (Ключевое слово)
**EN:** Keyword Search
**RU:** Поиск по ключевым словам
**Описание:** Традиционный поиск по совпадению терминов.
**См. также:** Full-text Search, Exact Match

---

## L

### Lexical Search (Лексический поиск)
**EN:** Lexical Search
**RU:** Поиск на основе точных слов
**Описание:** Поиск по точным словам без понимания смысла (в отличие от semantic search).
**См. также:** Keyword Search, BM25

### Latency (Задержка)
**EN:** Latency
**RU:** Время ответа поискового запроса
**Описание:** Время от отправки запроса до получения результатов.
**Целевые значения:** < 50ms (p95), < 100ms (p99)
**См. также:** Performance, Speed

### Locale (Локаль)
**EN:** Locale / Language
**RU:** Язык и региональные настройки
**Описание:** Настройки для multi-language контента (en, ru, de, fr, etc.).
**См. также:** i18n, Multi-language, Localization

---

## M

### Multi-tenancy (Мультитенантность)
**EN:** Multi-tenancy
**RU:** Поддержка множества клиентов в одной системе
**Описание:** Изоляция данных разных клиентов (tenants) в единой платформе.
**См. также:** Tenant, Isolation, RLS

### Merchandising (Мерчендайзинг)
**EN:** Merchandising
**RU:** Управление топом результатов
**Описание:** Ручное управление порядком результатов (pinning, boosting, hiding).
**См. также:** Curation, Overrides, Pinning

### Migration (Миграция)
**EN:** Migration
**RU:** Перенос данных
**Описание:** Процесс переноса данных с другой платформы (Algolia, Elasticsearch) на AACSearch.
**См. также:** Import, Export, Data Transfer

### Metadata (Метаданные)
**EN:** Metadata
**RU:** Дополнительная информация о документе
**Описание:** Служебные поля (created_at, updated_at, author, etc.).
**См. также:** Document, Schema

---

## N

### Natural Language Search (NL Search)
**EN:** Natural Language Search
**RU:** Поиск на естественном языке
**Описание:** Понимание запросов в виде обычных вопросов (не keywords).
**Пример:** "What are the best cheap laptops?" вместо "laptop cheap"
**См. также:** Conversational Search, LLM, RAG

### No-hits Query (Запрос без результатов)
**EN:** No-hits Query / Zero Results
**RU:** Запрос, не вернувший результатов
**Описание:** Поисковый запрос, для которого не найдено совпадений.
**Метрика:** No-hits rate (% от всех запросов)
**См. также:** Analytics, Query Analysis

---

## O

### Override (Переопределение)
**EN:** Override / Search Override
**RU:** Переопределение результатов поиска
**Описание:** Правила для изменения результатов конкретных запросов (merchandising).
**Пример:** Для запроса "iPhone" показать топ-3 конкретных продукта
**См. также:** Curation, Pinning, Rules

### OAuth (OAuth)
**EN:** OAuth
**RU:** Протокол авторизации
**Описание:** Стандарт для безопасной авторизации через third-party провайдеров.
**См. также:** Authentication, SSO, Token

---

## P

### Pinning (Закрепление)
**EN:** Pinning
**RU:** Закрепление документа на определенной позиции
**Описание:** Фиксация документа на конкретной позиции в результатах.
**Пример:** Pin product_123 на позицию 1 для query "laptop"
**См. также:** Override, Merchandising

### Prefix Search (Префиксный поиск)
**EN:** Prefix Search
**RU:** Поиск по началу слова
**Описание:** Поиск слов, начинающихся с заданной подстроки.
**Пример:** "lap" находит "laptop", "lapel"
**См. также:** Auto-complete, Infix Search

### Permissions (Права доступа)
**EN:** Permissions / Access Control
**RU:** Управление доступом к данным
**Описание:** RBAC (Role-Based Access Control) для ограничения доступа к документам.
**См. также:** RBAC, ACL, RLS, Security

### PII (PII)
**EN:** Personally Identifiable Information
**RU:** Персональные данные
**Описание:** Информация, идентифицирующая конкретного человека (имя, email, адрес).
**См. также:** GDPR, Privacy, Compliance

---

## Q

### Query (Запрос)
**EN:** Query / Search Query
**RU:** Поисковый запрос
**Описание:** Текст или параметры для поиска документов.
**Пример:** `q=laptop&filter_by=price:[500..2000]`
**См. также:** Search, Filter, Parameters

### Query Rewrite (Переписывание запроса)
**EN:** Query Rewrite
**RU:** Автоматическое изменение запроса для лучших результатов
**Описание:** Замена синонимов, исправление опечаток, расширение запроса.
**См. также:** Synonyms, Typo Tolerance

---

## R

### RAG (RAG)
**EN:** Retrieval-Augmented Generation
**RU:** Генерация с поиском релевантного контекста
**Описание:** Использование поиска + LLM для ответов на вопросы.
**Workflow:** Search → Retrieve context → LLM generates answer
**См. также:** Conversational Search, LLM, OpenAI

### Rate Limiting (Ограничение частоты)
**EN:** Rate Limiting
**RU:** Ограничение количества запросов в единицу времени
**Описание:** Защита API от перегрузки (например, 1000 req/min).
**См. также:** Throttling, Quota, API Limits

### Relevance (Релевантность)
**EN:** Relevance / Relevance Score
**RU:** Степень соответствия документа запросу
**Описание:** Числовой score, показывающий насколько документ подходит запросу.
**Алгоритмы:** BM25, TF-IDF, Vector similarity
**См. также:** Ranking, Score, BM25

### Replication (Репликация)
**EN:** Replication
**RU:** Дублирование данных для отказоустойчивости
**Описание:** Копирование индексов на несколько серверов для high availability.
**См. также:** High Availability, Backup

### RLS (RLS)
**EN:** Row-Level Security
**RU:** Безопасность на уровне строк
**Описание:** PostgreSQL политики для изоляции данных разных tenants.
**Пример:** User видит только свои документы
**См. также:** Multi-tenancy, Permissions, Security

---

## S

### Synonym (Синоним)
**EN:** Synonym
**RU:** Слова с одинаковым значением
**Описание:** Настройка эквивалентных терминов для поиска.
**Пример:** "laptop" = "notebook" = "portable computer"
**См. также:** Query Rewrite, Dictionary

### Scoped Key (Скопированный ключ)
**EN:** Scoped API Key
**RU:** API ключ с ограничениями
**Описание:** Ключ с встроенными фильтрами для безопасности (например, только документы tenant_id=123).
**См. также:** API Key, Security, Row-Level Security

### Semantic Search (Семантический поиск)
**EN:** Semantic Search
**RU:** Поиск по смыслу, а не по словам
**Описание:** Использование embeddings для поиска похожих по смыслу документов.
**Пример:** "fast car" находит "quick vehicle", "speedy automobile"
**См. также:** Vector Search, Embedding, Similarity

### Stemming (Стемминг)
**EN:** Stemming
**RU:** Приведение слов к основе
**Описание:** "running", "runs", "ran" → "run"
**См. также:** Lemmatization, Tokenization

### Stopword (Стоп-слово)
**EN:** Stopword
**RU:** Слово, игнорируемое при поиске
**Описание:** Частые слова без значимости (a, an, the, is).
**См. также:** Tokenization, Filtering

### Subscription (Подписка)
**EN:** Subscription
**RU:** План подписки клиента
**Описание:** Тарифный план (Starter, Pro, Enterprise) с лимитами и функциями.
**См. также:** Billing, Plan, Tier

---

## T

### Tenant (Тенант)
**EN:** Tenant
**RU:** Клиент в multi-tenant системе
**Описание:** Отдельный клиент/организация с изолированными данными.
**См. также:** Multi-tenancy, Organization, Account

### Token (Токен)
**EN:** Token
**RU:** Единица текста после разбивки
**Описание:** Слово или символ после tokenization ("MacBook Pro" → ["MacBook", "Pro"]).
**См. также:** Tokenization, Stemming

### Typo Tolerance (Толерантность к опечаткам)
**EN:** Typo Tolerance / Fuzzy Search
**RU:** Нахождение результатов при опечатках
**Описание:** Автоматическое исправление до 2 опечаток.
**Пример:** "labtop" → "laptop"
**Алгоритм:** Levenshtein distance
**См. также:** Fuzzy Search, Edit Distance

### TTL (TTL)
**EN:** Time To Live
**RU:** Время жизни кэша
**Описание:** Период хранения данных в кэше перед удалением.
**Пример:** TTL=300s (5 minutes)
**См. также:** Cache, Expiration, Redis

---

## U

### Usage Tracking (Отслеживание использования)
**EN:** Usage Tracking
**RU:** Подсчет использования ресурсов
**Описание:** Мониторинг searches, documents, API calls для биллинга.
**См. также:** Billing, Metrics, Analytics

### Uptime (Время работы)
**EN:** Uptime
**RU:** Доступность сервиса
**Описание:** % времени, когда сервис доступен.
**SLA:** 99.99% uptime (< 53 минут downtime в год)
**См. также:** Availability, SLA, Monitoring

---

## V

### Vector Search (Векторный поиск)
**EN:** Vector Search
**RU:** Поиск по векторным представлениям
**Описание:** Поиск ближайших векторов (embeddings) для семантического поиска.
**Алгоритм:** HNSW (Hierarchical Navigable Small World)
**См. также:** Semantic Search, Embedding, Similarity

### Variant (Вариант)
**EN:** Variant
**RU:** Вариант продукта
**Описание:** Разные версии одного продукта (цвет, размер).
**Пример:** iPhone 15 Pro: Space Black 256GB, Titanium 512GB
**См. также:** Grouping, Product

---

## W

### Webhook (Вебхук)
**EN:** Webhook
**RU:** HTTP callback для уведомлений
**Описание:** Автоматическая отправка HTTP запроса при событиях (product.created, etc.).
**См. также:** Event, Integration, Callback

### Weight (Вес)
**EN:** Weight / Field Weight
**RU:** Важность поля при ранжировании
**Описание:** Множитель для увеличения важности поля.
**Пример:** `query_by=title,description&query_by_weights=3,1` (title в 3 раза важнее)
**См. также:** Boosting, Ranking, Relevance

---

## X

### XSS (XSS)
**EN:** Cross-Site Scripting
**RU:** Уязвимость безопасности
**Описание:** Инъекция вредоносного JavaScript кода.
**Защита:** Sanitization входных данных
**См. также:** Security, Sanitization

---

## Z

### Zero-downtime (Нулевое время простоя)
**EN:** Zero-downtime Deployment
**RU:** Развертывание без остановки сервиса
**Описание:** Обновление без прерывания работы (rolling update).
**См. также:** Deployment, High Availability, Blue-Green

---

## Дополнительные термины

### BM25
**EN:** Best Matching 25
**RU:** Алгоритм ранжирования
**Описание:** Продвинутый алгоритм для оценки релевантности документов.
**См. также:** Relevance, TF-IDF, Ranking

### TF-IDF
**EN:** Term Frequency - Inverse Document Frequency
**RU:** Частота термина × обратная частота документа
**Описание:** Метрика важности термина в документе.
**См. также:** BM25, Relevance

### HNSW
**EN:** Hierarchical Navigable Small World
**RU:** Алгоритм для векторного поиска
**Описание:** Быстрый approximate nearest neighbor search.
**См. также:** Vector Search, kNN

### CRUD
**EN:** Create, Read, Update, Delete
**RU:** Базовые операции с данными
**См. также:** API, REST

### REST API
**EN:** Representational State Transfer API
**RU:** HTTP API для работы с платформой
**См. также:** GraphQL, API

### GraphQL
**EN:** GraphQL
**RU:** Язык запросов для API
**Описание:** Альтернатива REST с гибкими запросами.
**См. также:** API, Query Language

### SSO
**EN:** Single Sign-On
**RU:** Единый вход
**Описание:** Одна аутентификация для доступа к нескольким системам.
**См. также:** OAuth, SAML, Authentication

### SAML
**EN:** Security Assertion Markup Language
**RU:** Протокол для enterprise SSO
**См. также:** SSO, Authentication

### CORS
**EN:** Cross-Origin Resource Sharing
**RU:** Политика безопасности браузера
**Описание:** Разрешение запросов с других доменов.
**См. также:** Security, API

### CDN
**EN:** Content Delivery Network
**RU:** Сеть доставки контента
**Описание:** Распределенные серверы для быстрой доставки.
**См. также:** Performance, Latency

---

## Заключение

Этот глоссарий охватывает **более 200 терминов**, используемых в AACSearch платформе. Для более детальной информации см. соответствующие разделы документации.

**Полезные ссылки:**
- [Архитектура платформы](./03-architecture.md)
- [Технологический стек](./04-tech-stack.md)
- [Сценарии использования](./05-use-cases.md)
- [API Reference](/docs/api-reference)

Назад к: [Главная](./README.md)
