# AACSearch Website Migration - Task Sprints

Полная миграция официального маркетингового сайта с Appwrite на AACSearch с поддержкой 3 языков (EN, RU, DE).

## Цель проекта

Создать профессиональный маркетинговый сайт для платформы AACSearch, включающий:
- Главную страницу с презентацией платформы
- Страницы всех 10 продуктов AACSearch
- Полную документацию на 3 языках
- Pricing страницы с тарифными планами
- Blog и Community разделы
- Enterprise и Partnership программы

## Технологический стек

- **Framework**: SvelteKit
- **Styling**: Tailwind CSS + Pink Design System
- **i18n**: Параметризованные роуты для языков
- **Deployment**: Vercel/Docker
- **Analytics**: собственная аналитика AACSearch

## Структура спринтов

### [Sprint 1: Foundation & Setup](./sprint-1/README.md) (1 неделя)
Базовая настройка проекта, брендинг, константы, дизайн-система

**Ключевые задачи:**
- Обновление констант и конфигурации
- Создание компонентов брендинга
- Настройка дизайн-системы
- Базовая структура роутинга

### [Sprint 2: Content Migration](./sprint-2/README.md) (2 недели)
Миграция всей документации и контента из docs/en/

**Ключевые задачи:**
- Интеграция документации из docs/en/
- Создание системы навигации по документации
- Миграция партиалов и примеров кода
- SEO метаданные

### [Sprint 3: Products & Features Pages](./sprint-3/README.md) (2 недели)
Создание страниц для всех 10 продуктов AACSearch

**Ключевые задачи:**
- 10 страниц продуктов с уникальным дизайном
- Comparison страницы
- Use Cases страницы
- Interactive demos и виджеты

### [Sprint 4: Internationalization](./sprint-4/README.md) (1.5 недели)
Полная поддержка 3 языков (EN, RU, DE)

**Ключевые задачи:**
- i18n routing для языков
- Перевод всего контента
- Языковой переключатель
- SEO для мультиязычности

### [Sprint 5: Marketing & Landing](./sprint-5/README.md) (1.5 недели)
Маркетинговые страницы, pricing, enterprise

**Ключевые задачи:**
- Pricing страница с тарифами
- Enterprise landing
- Partnerships программы
- Blog и Community разделы

### [Sprint 6: Final Polish & Launch](./sprint-6/README.md) (1 неделя)
Финальная полировка, тестирование, деплой

**Ключевые задачи:**
- Performance оптимизация
- Accessibility аудит
- Финальное тестирование
- Production deployment

## Общая информация

### Временные рамки
- **Всего**: 9 недель (2.25 месяца)
- **Старт**: По готовности команды
- **Финиш**: Production launch

### Команда
- **Frontend**: 2 разработчика
- **Content**: 1 копирайтер + переводчики
- **Design**: 1 дизайнер
- **PM**: 1 проект-менеджер

### Метрики успеха

✅ Все страницы продуктов созданы и функциональны
✅ Документация доступна на 3 языках
✅ Lighthouse score > 90 по всем метрикам
✅ 100% покрытие переводами
✅ 0 критических багов на продакшене
✅ SEO оптимизация для топ-10 поисковых запросов

## Навигация по спринтам

1. [Sprint 1: Foundation & Setup](./sprint-1/README.md)
2. [Sprint 2: Content Migration](./sprint-2/README.md)
3. [Sprint 3: Products & Features Pages](./sprint-3/README.md)
4. [Sprint 4: Internationalization](./sprint-4/README.md)
5. [Sprint 5: Marketing & Landing](./sprint-5/README.md)
6. [Sprint 6: Final Polish & Launch](./sprint-6/README.md)

## Приоритеты

### Must Have (P0)
- Все 10 страниц продуктов
- Документация на EN
- Pricing страница
- Главная страница

### Should Have (P1)
- Переводы на RU и DE
- Blog раздел
- Community страницы
- Enterprise landing

### Nice to Have (P2)
- Interactive demos
- Video контент
- Advanced animations
- AI-чат поддержка

---

**Last Updated**: 2025-11-07
**Project Status**: Planning
**Version**: 1.0
