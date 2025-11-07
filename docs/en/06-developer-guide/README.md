# Руководство разработчика

Добро пожаловать в руководство разработчика AACSearch Platform! Этот раздел содержит подробную техническую документацию для разработчиков, которые хотят расширить платформу, создать кастомные интеграции или внести вклад в проект.

## Содержание

### [01. Архитектура системы](./01-architecture.md)
Полный обзор архитектуры платформы, включая:
- High-level архитектура (C4 диаграммы)
- Микросервисная архитектура
- Database схемы (32 коллекции)
- Интеграция с поисковым движком Typesense
- Система кеширования (L1, L2, L3)
- Message queues и job scheduler
- Real-time синхронизация
- Стратегии масштабирования
- Архитектура безопасности
- Мониторинг и observability

### [02. Кастомные интеграции](./02-custom-integrations.md)
Создание собственных интеграций с внешними сервисами:
- Интеграционный framework (BaseConnector)
- Step-by-step руководство по созданию коннектора
- Примеры реальных интеграций
- Best practices и паттерны
- Публикация в marketplace

### [03. Расширение платформы](./03-extending.md)
Механизмы расширения функциональности:
- Plugin система
- Custom hooks
- Custom field types
- Custom search algorithms
- Custom UI components
- Event system
- Middleware development
- Примеры расширений

### [04. Структура кода](./04-code-structure.md)
Детальный обзор структуры проекта:
- Организация директорий
- Ключевые файлы и их назначение
- Паттерны кода
- Naming conventions
- Зависимости между модулями

### [05. Тестирование](./05-testing.md)
Комплексное руководство по тестированию:
- Unit тесты (Jest)
- Integration тесты
- E2E тесты (Playwright)
- Performance тесты (k6)
- Security тесты
- Test utilities и fixtures
- CI/CD integration

### [06. Контрибуция](./06-contributing.md)
Руководство для контрибьюторов:
- Development setup
- Git workflow
- Coding standards
- Code review процесс
- Документация
- Лицензия

### [07. SDK](./07-sdks.md)
Клиентские библиотеки для разных языков:
- JavaScript/TypeScript SDK
- Python SDK
- PHP SDK
- Ruby SDK
- Go SDK
- Java SDK
- .NET/C# SDK

## Для кого это руководство

### Backend разработчики
Если вы хотите:
- Создать кастомную интеграцию с CMS/E-commerce
- Расширить API платформы
- Добавить новые типы полей
- Оптимизировать производительность
- Внести вклад в core

### Frontend разработчики
Если вы хотите:
- Кастомизировать admin UI
- Создать собственные компоненты
- Интегрировать поиск в веб-приложение
- Использовать SDK для клиентской части

### DevOps инженеры
Если вы хотите:
- Развернуть платформу в production
- Настроить мониторинг
- Оптимизировать масштабирование
- Настроить CI/CD
- Обеспечить безопасность

### Архитекторы
Если вы хотите:
- Понять архитектурные решения
- Интегрировать платформу в существующую инфраструктуру
- Оценить технические риски
- Планировать масштабирование

## Технологический стек

### Core
- **Runtime**: Node.js 20+
- **Framework**: Next.js 15+ (App Router)
- **CMS**: PayloadCMS 3.x
- **Language**: TypeScript (strict mode)

### Database
- **Primary DB**: PostgreSQL 15+
- **Search Engine**: Typesense 29.0+
- **Cache**: Redis 7+

### Queue & Jobs
- **Message Queue**: Bull (Redis-based)
- **Job Scheduler**: Node-cron
- **Background Jobs**: PayloadCMS Jobs API

### Frontend
- **UI Library**: React 19+
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Redux Toolkit
- **Forms**: React Hook Form + Zod

### Testing
- **Unit Tests**: Jest
- **E2E Tests**: Playwright
- **Load Tests**: k6
- **Coverage**: 80%+ goal

### DevOps
- **Container**: Docker
- **Orchestration**: Docker Compose / Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: OpenTelemetry compatible

## Быстрый старт

### Требования
```bash
# Node.js и pnpm
node --version  # v20.x или выше
pnpm --version  # v9.x или выше

# PostgreSQL
psql --version  # 15.x или выше

# Typesense
typesense-server --version  # 29.0 или выше

# Redis
redis-server --version  # 7.x или выше
```

### Локальная разработка
```bash
# 1. Клонировать репозиторий
git clone https://github.com/your-org/aacsearch-platform.git
cd aacsearch-platform/platform

# 2. Установить зависимости
pnpm install

# 3. Настроить переменные окружения
cp .env.example .env

# 4. Запустить базы данных (Docker)
docker-compose up -d postgres typesense redis

# 5. Запустить миграции
pnpm db:migrate

# 6. Заполнить тестовыми данными
pnpm db:seed

# 7. Запустить dev сервер
pnpm dev
```

Приложение будет доступно по адресу: http://localhost:3000

### Первый коммит
```bash
# 1. Создать feature branch
git checkout -b feature/my-awesome-feature

# 2. Внести изменения
# ... ваш код ...

# 3. Запустить тесты
pnpm test

# 4. Проверить линтинг
pnpm lint

# 5. Создать коммит
git add .
git commit -m "feat: add awesome feature"

# 6. Push и создать PR
git push origin feature/my-awesome-feature
```

## Ключевые концепции

### Multi-tenancy
Платформа построена на архитектуре multi-tenancy:
- Каждый tenant изолирован (данные, индексы, настройки)
- Tenant ID прокидывается через все слои
- Row-Level Security (RLS) в PostgreSQL
- Separate search indexes для каждого tenant

### Dual-write паттерн
Данные синхронизируются между PostgreSQL и Typesense:
- **PostgreSQL** - source of truth
- **Typesense** - search и analytics
- Автоматическая синхронизация через hooks
- Fallback на Postgres при недоступности Typesense

### Type Safety
Строгая типизация на всех уровнях:
- TypeScript strict mode
- Generated types из PayloadCMS схем
- Typesense SDK с полной типизацией
- Runtime validation (Zod)

### Plugin Architecture
Расширяемая архитектура плагинов:
- PayloadCMS plugins
- Custom hooks (beforeChange, afterChange, etc.)
- Event listeners
- Middleware

## Полезные команды

### Разработка
```bash
pnpm dev                    # Dev сервер
pnpm build                  # Production build
pnpm start                  # Запуск production
pnpm lint                   # Линтинг
pnpm format                 # Форматирование (Prettier)
pnpm type-check            # Type checking
```

### База данных
```bash
pnpm db:migrate            # Запустить миграции
pnpm db:migrate:create     # Создать миграцию
pnpm db:seed               # Seed данные
pnpm db:reset              # Сбросить БД
pnpm payload:generate      # Генерация types
```

### Тестирование
```bash
pnpm test                  # Все тесты
pnpm test:unit            # Unit тесты
pnpm test:integration     # Integration тесты
pnpm test:e2e             # E2E тесты
pnpm test:coverage        # Coverage report
pnpm test:watch           # Watch mode
```

### Jobs & Scheduler
```bash
pnpm jobs:list            # Список jobs
pnpm jobs:run <name>      # Запустить job
pnpm jobs:test            # Тестировать jobs
```

## Полезные ресурсы

### Документация
- [PayloadCMS Docs](https://payloadcms.com/docs)
- [Typesense Docs](https://typesense.org/docs/)
- [Next.js Docs](https://nextjs.org/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### Внутренние ресурсы
- [API Reference](../05-api-reference/)
- [Architecture Decision Records (ADR)](../../adr/)
- [Changelog](../../CHANGELOG.md)
- [Roadmap](../../ROADMAP.md)

### Комьюнити
- [GitHub Issues](https://github.com/your-org/aacsearch/issues)
- [Discussions](https://github.com/your-org/aacsearch/discussions)
- [Discord Server](https://discord.gg/aacsearch)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/aacsearch)

## Вклад в проект

Мы приветствуем вклад сообщества! Пожалуйста, прочитайте [руководство по контрибуции](./06-contributing.md) перед началом работы.

### Типы вклада
- 🐛 **Bug fixes** - исправление багов
- ✨ **Features** - новая функциональность
- 📝 **Documentation** - улучшение документации
- 🧪 **Tests** - добавление тестов
- 🎨 **UI/UX** - улучшение интерфейса
- ⚡ **Performance** - оптимизация производительности
- 🔒 **Security** - улучшение безопасности

## Лицензия

Этот проект распространяется под лицензией MIT. См. [LICENSE](../../LICENSE) для подробностей.

## Поддержка

Нужна помощь? Вот где её можно получить:

- 📖 **Документация**: Начните с этого руководства
- 💬 **Discord**: Задайте вопрос в community
- 🐛 **GitHub Issues**: Сообщите о баге
- 💡 **Discussions**: Обсудите идею
- 📧 **Email**: support@aacsearch.com

---

**Готовы начать?** Выберите раздел из содержания выше или перейдите к [архитектуре системы](./01-architecture.md).
