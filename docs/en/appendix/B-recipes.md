# B. Рецепты и лучшие практики

Практические рецепты для решения типичных задач при работе с AACSearch/Typesense.

## Содержание

1. [Оптимизация релевантности](#оптимизация-релевантности)
2. [Производительность поиска](#производительность-поиска)
3. [E-commerce поиск](#e-commerce-поиск)
4. [Multi-language search](#multi-language-search)
5. [Security best practices](#security-best-practices)
6. [Monitoring и alerting](#monitoring-и-alerting)
7. [Scaling strategies](#scaling-strategies)
8. [Migration from Algolia](#migration-from-algolia)
9. [Custom analytics](#custom-analytics)
10. [Developer productivity](#developer-productivity)

---

## 1. Оптимизация релевантности

### Проблема
Пользователи жалуются, что поиск возвращает нерелевантные результаты или не находит нужные документы.

### Решение: Пошаговый процесс

#### Шаг 1: Анализ no-hits queries

Собирайте запросы, не возвращающие результатов:

```typescript
// analytics/no-hits-tracker.ts
import { searchClient } from '@/lib/search';

interface NoHitQuery {
  query: string;
  timestamp: number;
  userId?: string;
  filters?: Record<string, any>;
  count: number;
}

class NoHitsTracker {
  private queries: Map<string, NoHitQuery> = new Map();

  async trackSearch(query: string, resultCount: number, metadata: any) {
    if (resultCount === 0) {
      const key = query.toLowerCase().trim();
      const existing = this.queries.get(key);

      if (existing) {
        existing.count++;
        existing.timestamp = Date.now();
      } else {
        this.queries.set(key, {
          query: key,
          timestamp: Date.now(),
          userId: metadata.userId,
          filters: metadata.filters,
          count: 1,
        });
      }
    }
  }

  getTopNoHits(limit: number = 100): NoHitQuery[] {
    return Array.from(this.queries.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  async exportToCSV(): Promise<string> {
    const queries = this.getTopNoHits(1000);
    const header = 'Query,Count,Last Seen,Filters\n';
    const rows = queries.map(q =>
      `"${q.query}",${q.count},${new Date(q.timestamp).toISOString()},"${JSON.stringify(q.filters)}"`
    ).join('\n');

    return header + rows;
  }
}

export const noHitsTracker = new NoHitsTracker();
```

Интегрируйте в поисковый endpoint:

```typescript
// app/api/search/route.ts
import { noHitsTracker } from '@/analytics/no-hits-tracker';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  const results = await searchClient.search({
    query,
    collection: 'products',
    // ... other params
  });

  // Track no-hits
  await noHitsTracker.trackSearch(query, results.found, {
    userId: request.headers.get('user-id'),
    filters: Object.fromEntries(searchParams.entries()),
  });

  return Response.json(results);
}
```

#### Шаг 2: Создание синонимов

Автоматизация создания синонимов на основе no-hits анализа:

```typescript
// scripts/generate-synonyms.ts
import { noHitsTracker } from '@/analytics/no-hits-tracker';
import { searchClient } from '@/lib/search';
import natural from 'natural';

interface SynonymRule {
  id: string;
  synonyms: string[];
}

class SynonymGenerator {
  private wordnet = new natural.WordNet();
  private spell = new natural.Spellcheck(dictionary);

  async generateFromNoHits(): Promise<SynonymRule[]> {
    const noHits = noHitsTracker.getTopNoHits(100);
    const synonyms: SynonymRule[] = [];

    for (const noHit of noHits) {
      // 1. Проверка опечаток
      const corrected = await this.correctSpelling(noHit.query);
      if (corrected !== noHit.query) {
        synonyms.push({
          id: `typo_${Date.now()}_${Math.random()}`,
          synonyms: [noHit.query, corrected],
        });
        continue;
      }

      // 2. Поиск синонимов через WordNet
      const wordnetSynonyms = await this.findWordNetSynonyms(noHit.query);
      if (wordnetSynonyms.length > 1) {
        synonyms.push({
          id: `wordnet_${Date.now()}_${Math.random()}`,
          synonyms: wordnetSynonyms,
        });
        continue;
      }

      // 3. Поиск похожих успешных запросов
      const similar = await this.findSimilarSuccessfulQueries(noHit.query);
      if (similar) {
        synonyms.push({
          id: `similar_${Date.now()}_${Math.random()}`,
          synonyms: [noHit.query, similar],
        });
      }
    }

    return synonyms;
  }

  private async correctSpelling(query: string): Promise<string> {
    const words = query.split(' ');
    const corrected = await Promise.all(
      words.map(word => {
        const suggestions = this.spell.getCorrections(word, 1);
        return suggestions.length > 0 ? suggestions[0] : word;
      })
    );
    return corrected.join(' ');
  }

  private async findWordNetSynonyms(query: string): Promise<string[]> {
    return new Promise((resolve) => {
      this.wordnet.lookup(query, (results) => {
        const synonyms = new Set([query]);

        results.forEach(result => {
          result.synonyms.forEach(syn => synonyms.add(syn));
        });

        resolve(Array.from(synonyms));
      });
    });
  }

  private async findSimilarSuccessfulQueries(query: string): Promise<string | null> {
    // Используйте Levenshtein distance для поиска похожих запросов
    const allQueries = await this.getSuccessfulQueries();
    const distances = allQueries.map(q => ({
      query: q,
      distance: natural.LevenshteinDistance(query, q),
    }));

    distances.sort((a, b) => a.distance - b.distance);

    // Если расстояние меньше 3, считаем похожим
    if (distances.length > 0 && distances[0].distance < 3) {
      return distances[0].query;
    }

    return null;
  }

  private async getSuccessfulQueries(): Promise<string[]> {
    // Получите из аналитики запросы с результатами
    return [];
  }

  async uploadSynonyms(synonyms: SynonymRule[]): Promise<void> {
    for (const synonym of synonyms) {
      await searchClient.client
        .collections('products')
        .synonyms()
        .upsert(synonym.id, {
          synonyms: synonym.synonyms,
        });
    }
  }
}

// Использование
async function main() {
  const generator = new SynonymGenerator();
  const synonyms = await generator.generateFromNoHits();

  console.log(`Generated ${synonyms.length} synonym rules`);
  console.log('Sample:', synonyms.slice(0, 5));

  // Предварительный просмотр перед загрузкой
  const confirm = await promptUser('Upload synonyms? (y/n)');

  if (confirm === 'y') {
    await generator.uploadSynonyms(synonyms);
    console.log('Synonyms uploaded successfully');
  }
}

main();
```

#### Шаг 3: Настройка весов полей

Определите, какие поля важнее для релевантности:

```typescript
// config/search-weights.ts
export const fieldWeights = {
  // Базовые веса
  title: 10,
  description: 5,
  tags: 3,
  category: 2,
  brand: 1,

  // Для разных типов контента
  byContentType: {
    product: {
      title: 15,
      brand: 10,
      description: 5,
      tags: 3,
    },
    article: {
      title: 20,
      content: 10,
      excerpt: 5,
      tags: 2,
    },
  },
};

function getQueryBy(contentType?: string): string {
  if (contentType && fieldWeights.byContentType[contentType]) {
    const weights = fieldWeights.byContentType[contentType];
    return Object.entries(weights)
      .map(([field, weight]) => `${field}:${weight}`)
      .join(',');
  }

  return Object.entries(fieldWeights)
    .filter(([key]) => !key.startsWith('by'))
    .map(([field, weight]) => `${field}:${weight}`)
    .join(',');
}

// Использование
const results = await searchClient.search({
  query: 'laptop',
  collection: 'products',
  queryBy: getQueryBy('product'), // "title:15,brand:10,description:5,tags:3"
});
```

#### Шаг 4: A/B testing релевантности

Сравните разные конфигурации поиска:

```typescript
// lib/ab-test-search.ts
interface SearchConfig {
  id: string;
  name: string;
  queryBy: string;
  sortBy?: string;
  numTypos?: number;
  typoTokensThreshold?: number;
}

const searchConfigs: SearchConfig[] = [
  {
    id: 'baseline',
    name: 'Baseline',
    queryBy: 'title:10,description:5',
    sortBy: '_text_match:desc',
    numTypos: 2,
  },
  {
    id: 'brand-boost',
    name: 'Brand Boost',
    queryBy: 'title:10,brand:15,description:5',
    sortBy: '_text_match:desc,popularity:desc',
    numTypos: 2,
  },
  {
    id: 'strict-matching',
    name: 'Strict Matching',
    queryBy: 'title:20,description:5',
    sortBy: '_text_match:desc',
    numTypos: 1,
    typoTokensThreshold: 1,
  },
];

class ABTestSearch {
  private variantAssignments = new Map<string, string>();

  getVariant(userId: string): SearchConfig {
    if (!this.variantAssignments.has(userId)) {
      // Случайное распределение
      const randomIndex = Math.floor(Math.random() * searchConfigs.length);
      this.variantAssignments.set(userId, searchConfigs[randomIndex].id);
    }

    const variantId = this.variantAssignments.get(userId)!;
    return searchConfigs.find(c => c.id === variantId)!;
  }

  async search(userId: string, query: string): Promise<any> {
    const variant = this.getVariant(userId);

    const results = await searchClient.search({
      query,
      collection: 'products',
      queryBy: variant.queryBy,
      sortBy: variant.sortBy,
      numTypos: variant.numTypos,
      typoTokensThreshold: variant.typoTokensThreshold,
    });

    // Логируем для анализа
    await this.logSearchMetrics(userId, query, variant.id, results);

    return results;
  }

  private async logSearchMetrics(
    userId: string,
    query: string,
    variantId: string,
    results: any
  ) {
    // Сохраните метрики для последующего анализа
    await analytics.track({
      userId,
      event: 'search_performed',
      properties: {
        query,
        variant: variantId,
        resultCount: results.found,
        topResultIds: results.hits.slice(0, 3).map((h: any) => h.document.id),
        timestamp: Date.now(),
      },
    });
  }

  async analyzeResults(): Promise<any> {
    // Анализ метрик по вариантам
    const metrics = await analytics.query({
      event: 'search_performed',
      groupBy: 'variant',
      aggregate: {
        avgResultCount: 'avg(resultCount)',
        clickThroughRate: 'count(click) / count(*)',
        conversionRate: 'count(purchase) / count(*)',
      },
    });

    return metrics;
  }
}

export const abTestSearch = new ABTestSearch();
```

#### Шаг 5: Мониторинг релевантности

Отслеживайте метрики релевантности в реальном времени:

```typescript
// monitoring/relevance-metrics.ts
interface RelevanceMetrics {
  date: string;
  avgResultCount: number;
  noHitsRate: number;
  clickThroughRate: number;
  avgPosition: number;
  bounceRate: number;
}

class RelevanceMonitor {
  async collectMetrics(period: string = '24h'): Promise<RelevanceMetrics> {
    const searches = await this.getSearches(period);
    const clicks = await this.getClicks(period);
    const bounces = await this.getBounces(period);

    const totalSearches = searches.length;
    const noHits = searches.filter(s => s.resultCount === 0).length;
    const avgResults = searches.reduce((sum, s) => sum + s.resultCount, 0) / totalSearches;

    const clickedSearches = new Set(clicks.map(c => c.searchId));
    const ctr = clickedSearches.size / totalSearches;

    const avgPosition = clicks.reduce((sum, c) => sum + c.position, 0) / clicks.length;

    const bounceRate = bounces.length / totalSearches;

    return {
      date: new Date().toISOString(),
      avgResultCount: avgResults,
      noHitsRate: noHits / totalSearches,
      clickThroughRate: ctr,
      avgPosition,
      bounceRate,
    };
  }

  async alertOnAnomalies(current: RelevanceMetrics, baseline: RelevanceMetrics) {
    const alerts = [];

    if (current.noHitsRate > baseline.noHitsRate * 1.5) {
      alerts.push({
        severity: 'high',
        metric: 'noHitsRate',
        message: `No-hits rate increased by ${((current.noHitsRate / baseline.noHitsRate - 1) * 100).toFixed(1)}%`,
      });
    }

    if (current.clickThroughRate < baseline.clickThroughRate * 0.8) {
      alerts.push({
        severity: 'medium',
        metric: 'clickThroughRate',
        message: `CTR decreased by ${((1 - current.clickThroughRate / baseline.clickThroughRate) * 100).toFixed(1)}%`,
      });
    }

    if (alerts.length > 0) {
      await this.sendAlerts(alerts);
    }
  }

  private async sendAlerts(alerts: any[]) {
    // Отправка в Slack, email, PagerDuty и т.д.
    console.log('Relevance alerts:', alerts);
  }

  private async getSearches(period: string): Promise<any[]> {
    // Получение из аналитики
    return [];
  }

  private async getClicks(period: string): Promise<any[]> {
    return [];
  }

  private async getBounces(period: string): Promise<any[]> {
    return [];
  }
}

export const relevanceMonitor = new RelevanceMonitor();
```

---

## 2. Производительность поиска

### Проблема
Поиск работает медленно, особенно при высокой нагрузке.

### Решение: Комплексная оптимизация

#### Шаг 1: Index Optimization

```typescript
// scripts/optimize-index.ts
interface IndexOptimization {
  collection: string;
  before: IndexStats;
  after: IndexStats;
  improvements: string[];
}

interface IndexStats {
  numDocuments: number;
  memoryUsed: number;
  avgSearchTime: number;
  p95SearchTime: number;
}

class IndexOptimizer {
  async optimize(collectionName: string): Promise<IndexOptimization> {
    const beforeStats = await this.getStats(collectionName);
    const improvements: string[] = [];

    // 1. Удаление неиспользуемых полей
    const schema = await this.getSchema(collectionName);
    const unusedFields = await this.findUnusedFields(collectionName);

    if (unusedFields.length > 0) {
      console.log(`Removing ${unusedFields.length} unused fields:`, unusedFields);
      await this.removeFields(collectionName, unusedFields);
      improvements.push(`Removed ${unusedFields.length} unused fields`);
    }

    // 2. Оптимизация типов полей
    const fieldTypeOptimizations = await this.optimizeFieldTypes(collectionName);
    if (fieldTypeOptimizations.length > 0) {
      improvements.push(...fieldTypeOptimizations);
    }

    // 3. Настройка фасетов
    const facetOptimizations = await this.optimizeFacets(collectionName);
    if (facetOptimizations.length > 0) {
      improvements.push(...facetOptimizations);
    }

    // 4. Компактификация индекса
    await this.compactIndex(collectionName);
    improvements.push('Index compacted');

    const afterStats = await this.getStats(collectionName);

    return {
      collection: collectionName,
      before: beforeStats,
      after: afterStats,
      improvements,
    };
  }

  private async findUnusedFields(collectionName: string): Promise<string[]> {
    // Анализ логов поиска за последние 30 дней
    const searchLogs = await this.getSearchLogs(collectionName, 30);
    const usedFields = new Set<string>();

    searchLogs.forEach(log => {
      // Поля в query_by
      log.queryBy?.split(',').forEach(field => {
        usedFields.add(field.split(':')[0]);
      });

      // Поля в filter_by
      log.filterBy?.split('&&').forEach(filter => {
        const field = filter.trim().split(':')[0];
        usedFields.add(field);
      });

      // Поля в sort_by
      log.sortBy?.split(',').forEach(field => {
        usedFields.add(field.split(':')[0]);
      });

      // Поля в facet_by
      log.facetBy?.split(',').forEach(field => {
        usedFields.add(field.trim());
      });
    });

    const schema = await this.getSchema(collectionName);
    const allFields = schema.fields.map(f => f.name);

    return allFields.filter(field => !usedFields.has(field));
  }

  private async optimizeFieldTypes(collectionName: string): Promise<string[]> {
    const improvements: string[] = [];
    const schema = await this.getSchema(collectionName);

    for (const field of schema.fields) {
      // Проверка, можно ли изменить тип для лучшей производительности
      if (field.type === 'string' && !field.facet) {
        const isCategorical = await this.isCategoricalField(collectionName, field.name);

        if (isCategorical) {
          // Предложение сделать поле facet для быстрой фильтрации
          improvements.push(
            `Field '${field.name}' is categorical, consider adding facet:true`
          );
        }
      }

      if (field.type === 'string[]' && field.facet) {
        const avgArrayLength = await this.getAvgArrayLength(collectionName, field.name);

        if (avgArrayLength > 100) {
          improvements.push(
            `Field '${field.name}' has large arrays (avg: ${avgArrayLength}), consider denormalization`
          );
        }
      }
    }

    return improvements;
  }

  private async optimizeFacets(collectionName: string): Promise<string[]> {
    const improvements: string[] = [];
    const searchLogs = await this.getSearchLogs(collectionName, 30);

    // Анализ использования фасетов
    const facetUsage = new Map<string, number>();

    searchLogs.forEach(log => {
      log.facetBy?.split(',').forEach(field => {
        const count = facetUsage.get(field) || 0;
        facetUsage.set(field, count + 1);
      });
    });

    const schema = await this.getSchema(collectionName);

    // Поля с facet:true, но не используемые
    schema.fields
      .filter(f => f.facet)
      .forEach(field => {
        const usage = facetUsage.get(field.name) || 0;
        const usagePercent = (usage / searchLogs.length) * 100;

        if (usagePercent < 1) {
          improvements.push(
            `Field '${field.name}' has facet:true but used in <1% of searches`
          );
        }
      });

    return improvements;
  }

  private async compactIndex(collectionName: string): Promise<void> {
    // Typesense автоматически компактифицирует,
    // но можно принудительно через export/import
    console.log(`Compacting index for ${collectionName}...`);

    const documents = await this.exportAllDocuments(collectionName);
    await this.reimportDocuments(collectionName, documents);
  }

  private async getStats(collectionName: string): Promise<IndexStats> {
    // Получение статистики из Typesense
    return {
      numDocuments: 0,
      memoryUsed: 0,
      avgSearchTime: 0,
      p95SearchTime: 0,
    };
  }

  private async getSchema(collectionName: string): Promise<any> {
    return {};
  }

  private async getSearchLogs(collectionName: string, days: number): Promise<any[]> {
    return [];
  }

  private async removeFields(collectionName: string, fields: string[]): Promise<void> {
    // Удаление полей через пересоздание коллекции
  }

  private async isCategoricalField(collectionName: string, fieldName: string): Promise<boolean> {
    // Проверка, категориальное ли поле (мало уникальных значений)
    return false;
  }

  private async getAvgArrayLength(collectionName: string, fieldName: string): Promise<number> {
    return 0;
  }

  private async exportAllDocuments(collectionName: string): Promise<any[]> {
    return [];
  }

  private async reimportDocuments(collectionName: string, documents: any[]): Promise<void> {
    // Reimport
  }
}
```

#### Шаг 2: Query Optimization

```typescript
// lib/query-optimizer.ts
interface QueryAnalysis {
  query: string;
  executionTime: number;
  resultCount: number;
  suggestions: string[];
}

class QueryOptimizer {
  async analyzeQuery(
    query: string,
    params: Record<string, any>
  ): Promise<QueryAnalysis> {
    const startTime = Date.now();
    const suggestions: string[] = [];

    // 1. Анализ сложности запроса
    const complexity = this.calculateComplexity(query, params);

    if (complexity > 100) {
      suggestions.push('Query is too complex, consider simplifying filters');
    }

    // 2. Проверка использования wildcard
    if (query.includes('*')) {
      suggestions.push('Wildcard searches are slow, use prefix matching instead');
    }

    // 3. Проверка фильтров
    if (params.filterBy) {
      const filterSuggestions = this.analyzeFilters(params.filterBy);
      suggestions.push(...filterSuggestions);
    }

    // 4. Проверка сортировки
    if (params.sortBy) {
      const sortSuggestions = this.analyzeSorting(params.sortBy);
      suggestions.push(...sortSuggestions);
    }

    // 5. Проверка pagination
    if (params.page > 100) {
      suggestions.push('Deep pagination is slow, use cursor-based pagination instead');
    }

    // Выполнение запроса
    const results = await searchClient.search({
      query,
      collection: params.collection,
      ...params,
    });

    const executionTime = Date.now() - startTime;

    return {
      query,
      executionTime,
      resultCount: results.found,
      suggestions,
    };
  }

  private calculateComplexity(query: string, params: Record<string, any>): number {
    let complexity = 0;

    // Сложность запроса
    complexity += query.split(' ').length * 10;

    // Сложность фильтров
    if (params.filterBy) {
      complexity += params.filterBy.split('&&').length * 20;
    }

    // Сложность фасетов
    if (params.facetBy) {
      complexity += params.facetBy.split(',').length * 15;
    }

    // Сложность сортировки
    if (params.sortBy && params.sortBy !== '_text_match:desc') {
      complexity += 25;
    }

    return complexity;
  }

  private analyzeFilters(filterBy: string): string[] {
    const suggestions: string[] = [];
    const filters = filterBy.split('&&');

    // Проверка на дублирующиеся фильтры
    const filterFields = filters.map(f => f.trim().split(':')[0]);
    const duplicates = filterFields.filter(
      (field, index) => filterFields.indexOf(field) !== index
    );

    if (duplicates.length > 0) {
      suggestions.push(`Duplicate filters detected: ${duplicates.join(', ')}`);
    }

    // Проверка на сложные операторы
    filters.forEach(filter => {
      if (filter.includes('!=') || filter.includes('!:')) {
        suggestions.push('NOT filters are slower than positive filters');
      }
    });

    return suggestions;
  }

  private analyzeSorting(sortBy: string): string[] {
    const suggestions: string[] = [];
    const sorts = sortBy.split(',');

    if (sorts.length > 2) {
      suggestions.push('Multiple sort fields can impact performance');
    }

    // Проверка на сортировку по нечисловым полям
    sorts.forEach(sort => {
      const [field] = sort.split(':');
      if (!this.isNumericField(field)) {
        suggestions.push(`Sorting by non-numeric field '${field}' can be slow`);
      }
    });

    return suggestions;
  }

  private isNumericField(field: string): boolean {
    return ['popularity', 'price', 'rating', 'created_at', 'updated_at'].includes(field);
  }
}

export const queryOptimizer = new QueryOptimizer();
```

#### Шаг 3: Caching Strategies

```typescript
// lib/search-cache.ts
import { LRUCache } from 'lru-cache';
import { createHash } from 'crypto';

interface CacheConfig {
  maxSize: number;
  ttl: number;
  updateInterval?: number;
}

class SearchCache {
  private cache: LRUCache<string, any>;
  private hotQueries = new Map<string, number>();

  constructor(config: CacheConfig) {
    this.cache = new LRUCache({
      max: config.maxSize,
      ttl: config.ttl,
      updateAgeOnGet: true,
    });

    // Периодическое обновление популярных запросов
    if (config.updateInterval) {
      setInterval(() => this.updateHotQueries(), config.updateInterval);
    }
  }

  async get(
    key: string,
    fetcher: () => Promise<any>
  ): Promise<{ data: any; cached: boolean }> {
    const cacheKey = this.generateKey(key);

    // Проверка кэша
    const cached = this.cache.get(cacheKey);
    if (cached) {
      this.trackQuery(key);
      return { data: cached, cached: true };
    }

    // Получение данных
    const data = await fetcher();

    // Сохранение в кэш
    this.cache.set(cacheKey, data);
    this.trackQuery(key);

    return { data, cached: false };
  }

  private generateKey(query: string): string {
    return createHash('md5').update(query).digest('hex');
  }

  private trackQuery(query: string): void {
    const count = this.hotQueries.get(query) || 0;
    this.hotQueries.set(query, count + 1);
  }

  private async updateHotQueries(): Promise<void> {
    // Получение топ-100 популярных запросов
    const top = Array.from(this.hotQueries.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 100)
      .map(([query]) => query);

    // Предварительный прогрев кэша
    console.log(`Warming cache for ${top.length} hot queries`);

    for (const query of top) {
      const cacheKey = this.generateKey(query);

      if (!this.cache.has(cacheKey)) {
        try {
          const params = JSON.parse(query);
          const results = await searchClient.search(params);
          this.cache.set(cacheKey, results);
        } catch (error) {
          console.error(`Failed to warm cache for query:`, error);
        }
      }
    }

    // Сброс счетчиков
    this.hotQueries.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.cache.max,
      hitRate: this.calculateHitRate(),
      hotQueries: Array.from(this.hotQueries.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
    };
  }

  private calculateHitRate(): number {
    // Расчет hit rate на основе статистики
    return 0;
  }
}

export const searchCache = new SearchCache({
  maxSize: 10000,
  ttl: 5 * 60 * 1000, // 5 минут
  updateInterval: 60 * 1000, // 1 минута
});
```

Интеграция кэша:

```typescript
// app/api/search/route.ts
import { searchCache } from '@/lib/search-cache';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const cacheKey = JSON.stringify({
    query: searchParams.get('q'),
    collection: 'products',
    filters: Object.fromEntries(searchParams.entries()),
  });

  const { data, cached } = await searchCache.get(cacheKey, async () => {
    return await searchClient.search({
      query: searchParams.get('q') || '',
      collection: 'products',
      // ... other params
    });
  });

  return Response.json(data, {
    headers: {
      'X-Cache': cached ? 'HIT' : 'MISS',
    },
  });
}
```

#### Шаг 4: CDN Usage

```typescript
// config/cdn.ts
interface CDNConfig {
  enabled: boolean;
  provider: 'cloudflare' | 'fastly' | 'cloudfront';
  cacheRules: CacheRule[];
}

interface CacheRule {
  path: string;
  ttl: number;
  varyBy?: string[];
}

const cdnConfig: CDNConfig = {
  enabled: true,
  provider: 'cloudflare',
  cacheRules: [
    {
      path: '/api/search',
      ttl: 300, // 5 минут
      varyBy: ['query', 'filters', 'page'],
    },
    {
      path: '/api/suggestions',
      ttl: 600, // 10 минут
      varyBy: ['query'],
    },
    {
      path: '/api/facets',
      ttl: 3600, // 1 час
      varyBy: ['collection'],
    },
  ],
};

// Middleware для установки cache headers
export function withCDNCache(handler: Function) {
  return async (request: Request) => {
    const url = new URL(request.url);
    const rule = cdnConfig.cacheRules.find(r => url.pathname.startsWith(r.path));

    const response = await handler(request);

    if (rule && cdnConfig.enabled) {
      // Установка cache headers
      response.headers.set('Cache-Control', `public, max-age=${rule.ttl}`);

      if (rule.varyBy) {
        response.headers.set('Vary', rule.varyBy.join(', '));
      }

      // Cloudflare-specific headers
      if (cdnConfig.provider === 'cloudflare') {
        response.headers.set('CDN-Cache-Control', `max-age=${rule.ttl}`);
      }
    }

    return response;
  };
}
```

---

## 3. E-commerce поиск

### Полная реализация поиска для интернет-магазина

#### Product Catalog Structure

```typescript
// types/product.ts
export interface Product {
  id: string;
  title: string;
  description: string;
  brand: string;
  category: string;
  subcategory?: string;

  // Pricing
  price: number;
  originalPrice?: number;
  currency: string;
  discount?: number;

  // Inventory
  sku: string;
  stock: number;
  availability: 'in_stock' | 'out_of_stock' | 'preorder' | 'discontinued';

  // Variants
  variants?: ProductVariant[];
  hasVariants: boolean;

  // Attributes
  color?: string;
  size?: string;
  material?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  // Media
  images: string[];
  primaryImage: string;
  video?: string;

  // Ratings & Reviews
  rating: number;
  reviewCount: number;

  // SEO
  slug: string;
  metaTitle?: string;
  metaDescription?: string;

  // Merchandising
  popularity: number;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  onSale: boolean;

  // Taxonomies
  tags: string[];
  collections: string[];

  // Timestamps
  createdAt: number;
  updatedAt: number;
  publishedAt?: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  title: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
  image?: string;
}
```

#### Variant Handling

```typescript
// lib/variant-indexing.ts
interface IndexableProduct {
  id: string;
  title: string;
  // ... base product fields

  // Variant aggregations
  minPrice: number;
  maxPrice: number;
  availableColors: string[];
  availableSizes: string[];
  variantSkus: string[];
}

class VariantIndexer {
  transformProduct(product: Product): IndexableProduct {
    if (!product.hasVariants || !product.variants) {
      return {
        ...product,
        minPrice: product.price,
        maxPrice: product.price,
        availableColors: product.color ? [product.color] : [],
        availableSizes: product.size ? [product.size] : [],
        variantSkus: [product.sku],
      };
    }

    // Агрегация данных вариантов
    const prices = product.variants.map(v => v.price);
    const colors = new Set<string>();
    const sizes = new Set<string>();
    const skus = product.variants.map(v => v.sku);

    product.variants.forEach(variant => {
      if (variant.attributes.color) colors.add(variant.attributes.color);
      if (variant.attributes.size) sizes.add(variant.attributes.size);
    });

    return {
      ...product,
      minPrice: Math.min(...prices, product.price),
      maxPrice: Math.max(...prices, product.price),
      availableColors: Array.from(colors),
      availableSizes: Array.from(sizes),
      variantSkus: skus,
    };
  }

  // Альтернативный подход: индексировать каждый вариант отдельно
  explodeVariants(product: Product): IndexableProduct[] {
    if (!product.hasVariants || !product.variants) {
      return [this.transformProduct(product)];
    }

    return product.variants.map(variant => ({
      ...product,
      id: variant.id,
      sku: variant.sku,
      price: variant.price,
      stock: variant.stock,
      primaryImage: variant.image || product.primaryImage,

      // Variant-specific attributes
      ...variant.attributes,

      // Помечаем как вариант
      isVariant: true,
      parentId: product.id,
      variantTitle: variant.title,
    }));
  }
}

export const variantIndexer = new VariantIndexer();
```

#### Price Range Facets

```typescript
// lib/price-facets.ts
interface PriceRange {
  min: number;
  max: number;
  label: string;
  count?: number;
}

class PriceFacetBuilder {
  // Динамическое построение ценовых диапазонов
  async buildDynamicRanges(
    collection: string,
    numRanges: number = 5
  ): Promise<PriceRange[]> {
    // 1. Получаем min/max цены
    const priceStats = await this.getPriceStats(collection);

    // 2. Создаем равномерные диапазоны
    const step = (priceStats.max - priceStats.min) / numRanges;
    const ranges: PriceRange[] = [];

    for (let i = 0; i < numRanges; i++) {
      const min = Math.floor(priceStats.min + step * i);
      const max = Math.floor(priceStats.min + step * (i + 1));

      ranges.push({
        min,
        max,
        label: this.formatPriceRange(min, max),
      });
    }

    // 3. Получаем количество товаров в каждом диапазоне
    await this.populateCounts(collection, ranges);

    return ranges;
  }

  // Предопределенные диапазоны
  getFixedRanges(): PriceRange[] {
    return [
      { min: 0, max: 25, label: 'Under $25' },
      { min: 25, max: 50, label: '$25 - $50' },
      { min: 50, max: 100, label: '$50 - $100' },
      { min: 100, max: 250, label: '$100 - $250' },
      { min: 250, max: Infinity, label: '$250+' },
    ];
  }

  private async getPriceStats(collection: string): Promise<{ min: number; max: number }> {
    const results = await searchClient.search({
      query: '*',
      collection,
      sortBy: 'price:asc',
      perPage: 1,
    });

    const minPrice = results.hits[0]?.document.price || 0;

    const maxResults = await searchClient.search({
      query: '*',
      collection,
      sortBy: 'price:desc',
      perPage: 1,
    });

    const maxPrice = maxResults.hits[0]?.document.price || 1000;

    return { min: minPrice, max: maxPrice };
  }

  private async populateCounts(collection: string, ranges: PriceRange[]): Promise<void> {
    for (const range of ranges) {
      const filterBy = `price:>=${range.min} && price:<${range.max}`;

      const results = await searchClient.search({
        query: '*',
        collection,
        filterBy,
        perPage: 0, // Только count
      });

      range.count = results.found;
    }
  }

  private formatPriceRange(min: number, max: number): string {
    if (max === Infinity) {
      return `$${min}+`;
    }
    return `$${min} - $${max}`;
  }

  // Построение фильтра из выбранного диапазона
  buildFilter(range: PriceRange): string {
    if (range.max === Infinity) {
      return `price:>=${range.min}`;
    }
    return `price:>=${range.min} && price:<${range.max}`;
  }
}

export const priceFacetBuilder = new PriceFacetBuilder();
```

#### Personalization

```typescript
// lib/personalized-search.ts
interface UserProfile {
  userId: string;
  preferences: {
    brands: string[];
    categories: string[];
    priceRange: { min: number; max: number };
  };
  history: {
    searches: string[];
    clicks: string[];
    purchases: string[];
  };
}

class PersonalizedSearch {
  async search(userId: string, query: string, baseParams: any): Promise<any> {
    const profile = await this.getUserProfile(userId);

    // 1. Персонализированные веса
    const personalizedQueryBy = this.buildPersonalizedQueryBy(profile);

    // 2. Бустинг на основе истории
    const boostRules = this.buildBoostRules(profile);

    // 3. Персонализированная сортировка
    const personalizedSortBy = this.buildPersonalizedSortBy(profile, baseParams.sortBy);

    const results = await searchClient.search({
      ...baseParams,
      query,
      queryBy: personalizedQueryBy,
      sortBy: personalizedSortBy,
      // Hidden filters для бустинга
      filterBy: this.combineFilters(baseParams.filterBy, boostRules),
    });

    // 4. Ре-ранжирование на основе предпочтений
    const reranked = this.rerank(results.hits, profile);

    return {
      ...results,
      hits: reranked,
      personalized: true,
    };
  }

  private async getUserProfile(userId: string): Promise<UserProfile> {
    // Получение профиля из БД/кэша
    return {
      userId,
      preferences: {
        brands: [],
        categories: [],
        priceRange: { min: 0, max: Infinity },
      },
      history: {
        searches: [],
        clicks: [],
        purchases: [],
      },
    };
  }

  private buildPersonalizedQueryBy(profile: UserProfile): string {
    const baseWeights = {
      title: 10,
      description: 5,
      brand: 3,
      category: 2,
    };

    // Увеличиваем вес брендов из предпочтений
    if (profile.preferences.brands.length > 0) {
      baseWeights.brand *= 2;
    }

    return Object.entries(baseWeights)
      .map(([field, weight]) => `${field}:${weight}`)
      .join(',');
  }

  private buildBoostRules(profile: UserProfile): string {
    const rules: string[] = [];

    // Бустинг купленных товаров
    if (profile.history.purchases.length > 0) {
      const purchasedIds = profile.history.purchases.slice(-10);
      // Добавляем бустинг для похожих товаров
    }

    // Бустинг предпочитаемых брендов
    if (profile.preferences.brands.length > 0) {
      profile.preferences.brands.forEach(brand => {
        rules.push(`brand:=${brand}`);
      });
    }

    return rules.join(' || ');
  }

  private buildPersonalizedSortBy(profile: UserProfile, baseSortBy: string): string {
    // Комбинируем базовую сортировку с персонализацией
    return `_text_match:desc,popularity:desc,${baseSortBy}`;
  }

  private combineFilters(baseFilter: string = '', boostRules: string = ''): string {
    if (!boostRules) return baseFilter;
    if (!baseFilter) return boostRules;
    return `${baseFilter} && (${boostRules})`;
  }

  private rerank(hits: any[], profile: UserProfile): any[] {
    return hits.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // +10 баллов за предпочитаемый бренд
      if (profile.preferences.brands.includes(a.document.brand)) scoreA += 10;
      if (profile.preferences.brands.includes(b.document.brand)) scoreB += 10;

      // +5 баллов за предпочитаемую категорию
      if (profile.preferences.categories.includes(a.document.category)) scoreA += 5;
      if (profile.preferences.categories.includes(b.document.category)) scoreB += 5;

      // +3 балла за ранее кликнутый товар
      if (profile.history.clicks.includes(a.document.id)) scoreA += 3;
      if (profile.history.clicks.includes(b.document.id)) scoreB += 3;

      return scoreB - scoreA;
    });
  }
}

export const personalizedSearch = new PersonalizedSearch();
```

#### Full Implementation

```typescript
// app/api/products/search/route.ts
import { variantIndexer } from '@/lib/variant-indexing';
import { priceFacetBuilder } from '@/lib/price-facets';
import { personalizedSearch } from '@/lib/personalized-search';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category');
  const brand = searchParams.get('brand');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const color = searchParams.get('color');
  const size = searchParams.get('size');
  const availability = searchParams.get('availability');
  const sortBy = searchParams.get('sortBy') || '_text_match:desc,popularity:desc';
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('perPage') || '24');
  const userId = request.headers.get('user-id');

  // Построение фильтров
  const filters: string[] = ['availability:in_stock'];

  if (category) filters.push(`category:=${category}`);
  if (brand) filters.push(`brand:=${brand}`);
  if (minPrice) filters.push(`price:>=${minPrice}`);
  if (maxPrice) filters.push(`price:<=${maxPrice}`);
  if (color) filters.push(`availableColors:=${color}`);
  if (size) filters.push(`availableSizes:=${size}`);
  if (availability) filters.push(`availability:=${availability}`);

  const filterBy = filters.join(' && ');

  // Базовые параметры поиска
  const baseParams = {
    collection: 'products',
    query,
    queryBy: 'title:10,description:5,brand:8,tags:3,sku:2',
    filterBy,
    sortBy,
    facetBy: 'brand,category,availableColors,availableSizes,availability',
    maxFacetValues: 50,
    page,
    perPage,
    highlightFullFields: 'title,description',
    numTypos: 2,
  };

  // Персонализированный поиск
  const results = userId
    ? await personalizedSearch.search(userId, query, baseParams)
    : await searchClient.search(baseParams);

  // Построение ценовых фасетов
  const priceRanges = await priceFacetBuilder.buildDynamicRanges('products');

  return Response.json({
    hits: results.hits,
    found: results.found,
    facets: results.facet_counts,
    priceRanges,
    page: results.page,
    searchTimeMs: results.search_time_ms,
    personalized: results.personalized || false,
  });
}
```

---

(Продолжение следует с разделами 4-10...)
