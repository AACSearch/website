# 2. Руководство быстрого старта

Добро пожаловать в руководство быстрого старта AACSearch! Это пошаговое руководство поможет вам за 30 минут запустить полнофункциональный интеллектуальный поиск для вашего проекта.

## Что вы узнаете

В этом разделе мы пройдем полный путь от регистрации до интеграции поиска на вашем сайте:

### 📝 [2.1 Регистрация и создание аккаунта](./01-getting-started.md)
Первые шаги с платформой:
- Регистрация нового аккаунта
- Создание первой организации (tenant)
- Выбор тарифного плана
- Настройка биллинга через Stripe
- Создание пользователей и управление ролями
- Получение API ключей

**Время**: 10 минут

### 📦 [2.2 Первая коллекция за 5 минут](./02-first-collection.md)
Создание и настройка коллекции документов:
- Wizard создания коллекции
- Определение схемы полей
- Типы полей (string, int, float, bool, geopoint)
- Настройка параметров индексации
- Загрузка первых документов
- Массовый импорт из CSV/JSON

**Время**: 5 минут

### 🔍 [2.3 Первый поисковый запрос](./03-first-search.md)
Поиск и настройка релевантности:
- Базовый поиск через UI
- Использование фильтров и сортировки
- Настройка фасетов
- Тонкая настройка релевантности
- Тестирование запросов
- Просмотр и анализ результатов

**Время**: 5 минут

### 🌐 [2.4 Интеграция с сайтом](./04-website-integration.md)
Подключение поиска к вашему проекту:
- Получение и настройка API ключа
- JavaScript/TypeScript SDK
- React компоненты
- Vue.js интеграция
- Vanilla JS примеры
- WordPress plugin
- Shopify app

**Время**: 10 минут

### 💻 [2.5 Примеры кода](./05-code-examples.md)
Готовые примеры на разных языках:
- JavaScript/TypeScript (fetch, axios, SDK)
- Python (requests, SDK)
- PHP (curl, SDK)
- Ruby (SDK)
- Go (SDK)
- Java (SDK)

**Время**: справочный материал

---

## Быстрый старт за 30 минут

Если у вас мало времени, следуйте этому минимальному пути:

### Шаг 1: Регистрация (3 минуты)
1. Откройте https://app.aacsearch.com/register
2. Заполните форму регистрации
3. Подтвердите email
4. Войдите в систему

### Шаг 2: Создание организации (2 минуты)
1. Нажмите "Создать организацию"
2. Укажите название (например, "My Company")
3. Выберите регион (EU/US)
4. Нажмите "Создать"

### Шаг 3: Выбор плана (2 минуты)
1. Выберите тарифный план (начните с Free)
2. Для платных планов добавьте платежный метод
3. Подтвердите выбор

### Шаг 4: Создание коллекции (3 минуты)
1. Перейдите в "Коллекции" → "Создать коллекцию"
2. Используйте wizard для быстрой настройки
3. Выберите шаблон "E-commerce" или создайте свою схему:
   ```json
   {
     "name": "products",
     "fields": [
       {"name": "title", "type": "string"},
       {"name": "description", "type": "string"},
       {"name": "price", "type": "float"},
       {"name": "category", "type": "string", "facet": true}
     ]
   }
   ```
4. Нажмите "Создать"

### Шаг 5: Импорт данных (5 минут)
1. Подготовьте JSON файл с вашими данными:
   ```json
   [
     {
       "title": "Ноутбук HP ProBook",
       "description": "Профессиональный ноутбук для бизнеса",
       "price": 899.99,
       "category": "Электроника"
     },
     {
       "title": "Клавиатура механическая",
       "description": "RGB подсветка, Cherry MX switches",
       "price": 129.99,
       "category": "Аксессуары"
     }
   ]
   ```
2. Перейдите в коллекцию → "Импорт"
3. Загрузите JSON файл
4. Нажмите "Импортировать"

### Шаг 6: Тестирование поиска (2 минуты)
1. Перейдите в "Поиск" → "Тестирование"
2. Введите запрос: "ноутбук"
3. Проверьте результаты
4. Попробуйте фильтры и сортировку

### Шаг 7: Получение API ключа (1 минута)
1. Перейдите в "Настройки" → "API ключи"
2. Нажмите "Создать ключ"
3. Выберите права доступа:
   - Search Only (рекомендуется для фронтенда)
   - Admin Key (для бэкенда)
4. Скопируйте ключ (он больше не будет показан!)

### Шаг 8: Интеграция на сайт (10 минут)

**Вариант A: JavaScript SDK**
```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.aacsearch.com/sdk/v1/aacsearch.min.js"></script>
</head>
<body>
  <input type="text" id="search-input" placeholder="Поиск...">
  <div id="results"></div>

  <script>
    const client = new AACSearch({
      apiKey: 'YOUR_API_KEY',
      tenantId: 'YOUR_TENANT_ID'
    });

    document.getElementById('search-input').addEventListener('input', async (e) => {
      const query = e.target.value;
      if (query.length < 2) return;

      const results = await client.search({
        collection: 'products',
        q: query,
        per_page: 10
      });

      document.getElementById('results').innerHTML = results.hits.map(hit => `
        <div class="result">
          <h3>${hit.document.title}</h3>
          <p>${hit.document.description}</p>
          <strong>$${hit.document.price}</strong>
        </div>
      `).join('');
    });
  </script>
</body>
</html>
```

**Вариант B: React компонент**
```jsx
import { useSearch } from '@aacsearch/react';

function SearchBox() {
  const { query, setQuery, results, loading } = useSearch({
    apiKey: 'YOUR_API_KEY',
    tenantId: 'YOUR_TENANT_ID',
    collection: 'products'
  });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск..."
      />

      {loading && <div>Загрузка...</div>}

      <div>
        {results.map(hit => (
          <div key={hit.id}>
            <h3>{hit.document.title}</h3>
            <p>{hit.document.description}</p>
            <strong>${hit.document.price}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Вариант C: cURL (для бэкенда)**
```bash
curl -X GET \
  'https://api.aacsearch.com/v1/collections/products/search' \
  -H 'X-API-Key: YOUR_API_KEY' \
  -H 'X-Tenant-ID: YOUR_TENANT_ID' \
  -H 'Content-Type: application/json' \
  -d '{
    "q": "ноутбук",
    "filter_by": "price:>500",
    "sort_by": "price:asc"
  }'
```

---

## Что дальше?

После завершения быстрого старта, рекомендуем изучить:

### Для пользователей
- [Управление коллекциями](../04-user-guide/01-collections/README.md) — продвинутые настройки
- [Настройка поиска](../04-user-guide/02-search/README.md) — тонкая настройка релевантности
- [Синонимы и merchandising](../04-user-guide/03-curation/README.md) — кураторство результатов
- [Аналитика](../04-user-guide/04-analytics/README.md) — анализ поисковых запросов

### Для разработчиков
- [API Reference](../05-api-reference/README.md) — полная документация API
- [Архитектура](../06-developer-guide/01-architecture.md) — как устроена платформа
- [Создание интеграций](../06-developer-guide/02-custom-integrations.md) — кастомные коннекторы
- [SDK документация](../06-developer-guide/07-sdks.md) — работа с SDK

### Для администраторов
- [Управление организацией](../03-admin-guide/01-tenant-management.md) — настройка tenant
- [Пользователи и роли](../03-admin-guide/02-users-and-roles.md) — управление доступом
- [Биллинг](../03-admin-guide/03-billing.md) — подписки и платежи
- [Безопасность](../03-admin-guide/05-security.md) — best practices

---

## Получение помощи

Если возникли вопросы:

### 📚 Документация
- [Полная документация](../README.md)
- [FAQ](../appendix/E-faq.md)
- [Troubleshooting](../appendix/C-troubleshooting.md)

### 💬 Сообщество
- [GitHub Discussions](https://github.com/aacsearch/platform/discussions)
- [Discord сервер](https://discord.gg/aacsearch)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/aacsearch)

### 🎓 Обучение
- [Видео уроки на YouTube](https://youtube.com/aacsearch)
- [Вебинары](https://aacsearch.com/webinars)
- [Блог с примерами](https://blog.aacsearch.com)

### 🆘 Поддержка
- Email: support@aacsearch.com
- Live chat (доступен в панели управления)
- Enterprise support для платных планов

---

## Типичные вопросы при старте

### Сколько стоит платформа?
- **Free план** — бесплатно до 1,000 документов
- **Starter** — $29/мес (10,000 документов)
- **Pro** — $99/мес (100,000 документов)
- **Enterprise** — индивидуальная цена

Подробнее: [Тарифные планы](../03-admin-guide/03-billing.md)

### Могу ли я протестировать платформу?
Да! Free план не требует кредитной карты. Вы можете:
- Создать до 3 коллекций
- Загрузить до 1,000 документов
- Выполнять до 1,000 поисковых запросов в день
- Использовать все функции без ограничений по времени

### Как перенести существующие данные?
Используйте:
- **Готовые интеграции** — для WordPress, Shopify и др.
- **Bulk Import API** — для CSV/JSON файлов
- **SDK** — для программного импорта
- **Migration Service** (Enterprise) — мы сделаем миграцию за вас

### Какие языки поддерживаются?
Платформа поддерживает 100+ языков из коробки, включая:
- Русский
- Английский
- Немецкий, Французский, Испанский
- Китайский, Японский, Корейский
- Арабский, Иврит
- И многие другие

### Можно ли использовать свой домен?
Да! В настройках tenant вы можете:
- Добавить custom domain (например, search.yoursite.com)
- Настроить SSL сертификат
- White-label режим (убрать упоминание AACSearch)

### Где хранятся данные?
Вы выбираете регион при создании организации:
- **EU** — Франкфурт, Германия (GDPR compliant)
- **US** — Вирджиния, США
- **Asia** — Сингапур (скоро)

Все данные шифруются и реплицируются для отказоустойчивости.

---

## Чеклист быстрого старта

Используйте этот чеклист, чтобы не пропустить важные шаги:

- [ ] Зарегистрировал аккаунт
- [ ] Подтвердил email
- [ ] Создал организацию (tenant)
- [ ] Выбрал тарифный план
- [ ] Настроил биллинг (для платных планов)
- [ ] Создал первого пользователя
- [ ] Создал коллекцию
- [ ] Определил схему полей
- [ ] Импортировал тестовые данные
- [ ] Протестировал поиск в UI
- [ ] Получил API ключ
- [ ] Интегрировал поиск на сайт
- [ ] Настроил фильтры и фасеты
- [ ] Протестировал релевантность
- [ ] Настроил аналитику
- [ ] Прочитал документацию по безопасности

---

## Следующий шаг

Готовы начать? Переходите к первому разделу:

➡️ **[2.1 Регистрация и создание аккаунта](./01-getting-started.md)**

---

**Обновлено**: 02.11.2025
**Версия**: 1.0.0
