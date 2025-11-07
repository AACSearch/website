# 4.4 Аналитика поиска

## Обзор

Система аналитики AACSearch предоставляет подробные инсайты о поведении пользователей, эффективности поиска и помогает оптимизировать результаты.

## Основные метрики

### Запросы (Queries)
- Общее количество запросов
- Уникальные запросы
- Топ запросы
- No-hits queries (без результатов)
- Средняя глубина просмотра

### Клики (Clicks)
- Click-through rate (CTR)
- Позиции кликов
- Время до клика
- Bounce rate

### Конверсии (Conversions)
- Conversion rate
- Revenue per search
- Average order value
- Top converting queries

## Разделы документации

### [01-overview.md](./01-overview.md) (15 страниц)
Обзор Analytics dashboard, основные метрики

**Содержание:**
- Панель аналитики
- Ключевые метрики
- Временные фильтры
- Экспорт данных
- Интеграция с Google Analytics
- Real-time мониторинг

### [02-top-queries.md](./02-top-queries.md) (12 страниц)
Анализ популярных запросов, тренды

**Содержание:**
- Топ запросы по периодам
- Trending queries
- Сезонные тренды
- Сегментация по категориям
- Query refinement
- Автоматические инсайты

### [03-no-hits.md](./03-no-hits.md) (15 страниц)
No-hits queries, автоматическое создание синонимов

**Содержание:**
- Анализ запросов без результатов
- Частые no-hits паттерны
- Автосоздание синонимов
- Рекомендации по контенту
- Мониторинг no-hits rate

### [04-click-tracking.md](./04-click-tracking.md) (12 страниц)
Отслеживание кликов, расчет CTR

**Содержание:**
- Настройка click tracking
- События кликов
- Анализ CTR по позициям
- Heat maps кликов
- A/B тестирование CTR

### [05-ab-testing.md](./05-ab-testing.md) (18 страниц)
A/B тестирование настроек релевантности

**Содержание:**
- Создание A/B тестов
- Метрики для сравнения
- Статистическая значимость
- Победитель теста
- Применение результатов

## Примеры использования

### Настройка Analytics

```typescript
// Включение аналитики для коллекции
await client.collections('products').update({
  enable_analytics: true,
  analytics_config: {
    track_queries: true,
    track_clicks: true,
    track_conversions: true
  }
})
```

### Отправка события клика

```typescript
// Трекинг клика пользователя
await client.analytics.events().create({
  type: 'click',
  name: 'result_click',
  data: {
    q: 'iphone',
    doc_id: '123',
    position: 3,
    user_id: 'user-456'
  }
})
```

### Получение топ запросов

```typescript
// Топ 10 запросов за последние 7 дней
const topQueries = await client.analytics
  .queries()
  .retrieve({
    start_date: Date.now() - 7 * 24 * 60 * 60 * 1000,
    end_date: Date.now(),
    limit: 10,
    order_by: 'count:desc'
  })

console.log('Top queries:')
topQueries.forEach((query, index) => {
  console.log(`${index + 1}. "${query.term}" - ${query.count} searches, CTR: ${query.ctr}%`)
})
```

### Анализ no-hits запросов

```typescript
// Запросы без результатов
const noHitsQueries = await client.analytics
  .queries()
  .retrieve({
    start_date: Date.now() - 7 * 24 * 60 * 60 * 1000,
    end_date: Date.now(),
    filter: 'hits_count:=0',
    limit: 50
  })

console.log(`Found ${noHitsQueries.length} no-hits queries`)

// Автоматическое создание синонимов
for (const query of noHitsQueries) {
  // Анализируем похожие успешные запросы
  const similar = await findSimilarQueries(query.term)

  if (similar.length > 0) {
    // Создаем синоним
    await client.collections('products').synonyms().upsert({
      id: `auto-${query.term}`,
      root: similar[0],
      synonyms: [query.term]
    })

    console.log(`Created synonym: "${query.term}" → "${similar[0]}"`)
  }
}
```

### CTR по позициям

```typescript
// Анализ CTR по позициям
const ctrByPosition = await client.analytics
  .clicks()
  .aggregate({
    group_by: 'position',
    metrics: ['ctr', 'clicks', 'impressions']
  })

console.log('CTR by position:')
ctrByPosition.forEach(stat => {
  console.log(`Position ${stat.position}: ${stat.ctr}% CTR (${stat.clicks}/${stat.impressions})`)
})

// Типичные результаты:
// Position 1: 35% CTR
// Position 2: 15% CTR
// Position 3: 8% CTR
// Position 4-10: 2-5% CTR
```

### A/B тестирование

```typescript
// Создание A/B теста
const abTest = await client.analytics.experiments().create({
  name: 'Typo tolerance test',
  collection: 'products',
  variants: [
    {
      name: 'control',
      weight: 50,
      params: {
        num_typos: 1
      }
    },
    {
      name: 'treatment',
      weight: 50,
      params: {
        num_typos: 2
      }
    }
  ],
  metrics: ['ctr', 'conversion_rate', 'revenue'],
  duration_days: 14
})

// Получить результаты теста
const results = await client.analytics
  .experiments(abTest.id)
  .results()

console.log('A/B Test Results:')
results.variants.forEach(variant => {
  console.log(`${variant.name}:`)
  console.log(`  CTR: ${variant.ctr}%`)
  console.log(`  Conversion: ${variant.conversion_rate}%`)
  console.log(`  Revenue: $${variant.revenue}`)
  console.log(`  Confidence: ${variant.confidence}%`)
})

// Применить победителя
if (results.winner) {
  await client.collections('products').update({
    num_typos: results.winner.params.num_typos
  })
}
```

## Analytics Dashboard

### Главный экран

```
┌──────────────────────────────────────────────────────┐
│  Analytics Overview - Last 30 days                   │
├──────────────────────────────────────────────────────┤
│  📊 Total Searches          125,432                  │
│  🔍 Unique Queries           8,756                   │
│  👆 Total Clicks            45,234                   │
│  📈 Average CTR              36.1%                   │
│  ❌ No-hits Rate              2.3%                   │
│  💰 Revenue                $89,234                   │
└──────────────────────────────────────────────────────┘

Top Queries:
1. "iphone"         2,345 searches  38.5% CTR
2. "samsung"        1,876 searches  41.2% CTR
3. "laptop"         1,654 searches  35.8% CTR
4. "headphones"     1,432 searches  33.1% CTR
5. "smartwatch"     1,287 searches  37.9% CTR

Trending Up 📈:
- "wireless earbuds" (+156%)
- "gaming laptop" (+89%)

No-hits Queries ❌:
- "aifone" (45 searches) → Suggest synonym: "iphone"
- "samsun" (38 searches) → Suggest synonym: "samsung"
```

### Query Details

```typescript
// Детальная информация о запросе
const queryAnalytics = await client.analytics
  .queries('iphone')
  .details({
    start_date: Date.now() - 30 * 24 * 60 * 60 * 1000,
    end_date: Date.now()
  })

console.log('Query: "iphone"')
console.log('Searches:', queryAnalytics.count)
console.log('CTR:', queryAnalytics.ctr, '%')
console.log('Avg results:', queryAnalytics.avg_results)
console.log('Avg position clicked:', queryAnalytics.avg_click_position)
console.log('Conversions:', queryAnalytics.conversions)
console.log('Revenue:', queryAnalytics.revenue)

// График по времени
console.log('\nTrend (last 7 days):')
queryAnalytics.timeline.forEach(point => {
  console.log(`${point.date}: ${point.count} searches`)
})

// Топ кликнутые документы
console.log('\nTop clicked results:')
queryAnalytics.top_clicks.forEach((doc, index) => {
  console.log(`${index + 1}. ${doc.name} (${doc.clicks} clicks)`)
})
```

## Интеграции

### Google Analytics

```typescript
// Отправка событий в GA4
import { gtag } from 'gtag'

// Search event
gtag('event', 'search', {
  search_term: 'iphone',
  results_count: 42
})

// Click event
gtag('event', 'select_item', {
  item_id: '123',
  item_name: 'iPhone 14 Pro',
  item_category: 'Electronics'
})

// Conversion event
gtag('event', 'purchase', {
  transaction_id: 'T12345',
  value: 999.99,
  currency: 'USD',
  items: [{
    item_id: '123',
    item_name: 'iPhone 14 Pro',
    price: 999.99
  }]
})
```

### Custom Analytics

```typescript
// Собственная система аналитики
class SearchAnalytics {
  async track(event: AnalyticsEvent) {
    // 1. Сохранить в AACSearch
    await client.analytics.events().create(event)

    // 2. Отправить в свою БД
    await db.analytics.insert({
      timestamp: Date.now(),
      event_type: event.type,
      data: event.data,
      user_id: event.user_id
    })

    // 3. Отправить в Segment/Amplitude
    await analytics.track(event.type, event.data)

    // 4. Логировать для ML моделей
    await mlLogger.log(event)
  }
}
```

## Автоматизация

### Автоматические алерты

```typescript
// Мониторинг метрик и алерты
class AnalyticsMonitor {
  async checkMetrics() {
    const metrics = await client.analytics.metrics().current()

    // Проверка no-hits rate
    if (metrics.no_hits_rate > 5) {
      await this.sendAlert({
        type: 'high_no_hits_rate',
        message: `No-hits rate is ${metrics.no_hits_rate}%`,
        severity: 'warning'
      })
    }

    // Проверка CTR
    if (metrics.ctr < 30) {
      await this.sendAlert({
        type: 'low_ctr',
        message: `CTR dropped to ${metrics.ctr}%`,
        severity: 'warning'
      })
    }

    // Проверка конверсий
    if (metrics.conversion_rate < 2) {
      await this.sendAlert({
        type: 'low_conversion',
        message: `Conversion rate: ${metrics.conversion_rate}%`,
        severity: 'critical'
      })
    }
  }

  async sendAlert(alert: Alert) {
    // Slack notification
    await slack.send({
      channel: '#search-alerts',
      text: `⚠️ ${alert.message}`
    })

    // Email
    await email.send({
      to: 'team@example.com',
      subject: `Search Alert: ${alert.type}`,
      body: alert.message
    })
  }
}

// Запуск мониторинга каждый час
setInterval(() => {
  new AnalyticsMonitor().checkMetrics()
}, 60 * 60 * 1000)
```

### Автоматическая оптимизация

```typescript
// Автоматическое создание синонимов на основе аналитики
class AutoOptimizer {
  async optimizeSynonyms() {
    // 1. Найти no-hits запросы
    const noHits = await client.analytics
      .queries()
      .retrieve({
        filter: 'hits_count:=0',
        limit: 100
      })

    // 2. Найти похожие успешные запросы
    for (const query of noHits) {
      const similar = await this.findSimilarSuccessfulQueries(query.term)

      if (similar.length > 0 && similar[0].similarity > 0.8) {
        // 3. Создать синоним
        await client.collections('products').synonyms().upsert({
          id: `auto-${Date.now()}`,
          root: similar[0].term,
          synonyms: [query.term]
        })

        console.log(`✅ Created synonym: "${query.term}" → "${similar[0].term}"`)
      }
    }
  }

  async findSimilarSuccessfulQueries(term: string) {
    // Используем Levenshtein distance или другие алгоритмы
    const allQueries = await client.analytics.queries().retrieve({
      filter: 'hits_count:>0',
      limit: 1000
    })

    return allQueries
      .map(q => ({
        term: q.term,
        similarity: this.calculateSimilarity(term, q.term)
      }))
      .filter(q => q.similarity > 0.7)
      .sort((a, b) => b.similarity - a.similarity)
  }

  calculateSimilarity(a: string, b: string): number {
    // Levenshtein distance implementation
    // ...
  }
}

// Запуск оптимизации раз в день
setInterval(() => {
  new AutoOptimizer().optimizeSynonyms()
}, 24 * 60 * 60 * 1000)
```

## Best Practices

### 1. Privacy & GDPR

```typescript
// Анонимизация данных
{
  track_queries: true,
  anonymize_ip: true,
  user_id_hashing: 'sha256',
  retention_days: 90
}
```

### 2. Performance

```typescript
// Батчинг аналитических событий
class AnalyticsBatcher {
  private queue: Event[] = []

  async track(event: Event) {
    this.queue.push(event)

    if (this.queue.length >= 100) {
      await this.flush()
    }
  }

  async flush() {
    if (this.queue.length === 0) return

    await client.analytics.events().createBatch(this.queue)
    this.queue = []
  }
}
```

### 3. Мониторинг

```typescript
// Дашборд метрик
const dashboard = {
  searches_per_day: 10000,
  avg_results_per_query: 42,
  ctr: 36.1,
  no_hits_rate: 2.3,
  avg_search_time_ms: 15
}

// Алерты при отклонениях
if (dashboard.no_hits_rate > 5) {
  alert('High no-hits rate!')
}
```

## Следующие шаги

- Изучите [Analytics Overview](./01-overview.md)
- Анализируйте [топ запросы](./02-top-queries.md)
- Оптимизируйте [no-hits queries](./03-no-hits.md)
- Настройте [click tracking](./04-click-tracking.md)
- Проводите [A/B тесты](./05-ab-testing.md)

---

**Назад**: [← Кураторство](../03-curation/README.md) | **Далее**: [Analytics Overview →](./01-overview.md)
