# 4.5 Интеграции

## Обзор

AACSearch предоставляет готовые интеграции с популярными CMS, e-commerce платформами и headless CMS для автоматической синхронизации контента.

## Поддерживаемые платформы

### CMS
- **WordPress** - Posts, Pages, Custom Post Types, ACF
- **Ghost** - Posts, Pages, Tags, Authors
- **Strapi** - Content Types, Relations, Media
- **Contentful** - Entries, Assets, Locales
- **Sanity** - Documents, GROQ queries, Real-time

### E-commerce
- **Shopify** - Products, Variants, Collections, Inventory
- **WooCommerce** - Products, Categories, Attributes
- **Magento** - Products, Categories, Configurable products
- **BigCommerce** - Products, Variants, Categories

### Website Builders
- **Webflow** - CMS Collections, Items
- **Wix** - Coming soon
- **Squarespace** - Coming soon

### Others
- **Notion** - Databases (Planned)
- **Airtable** - Tables (Planned)

## Разделы документации

### [01-wordpress.md](./01-wordpress.md) (15 страниц)
**Интеграция с WordPress**

Содержание:
- Установка плагина
- Настройка синхронизации
- Posts и Pages
- Custom Post Types
- ACF (Advanced Custom Fields)
- Taxonomies (Categories, Tags)
- Webhooks для real-time обновлений
- WP-CLI команды

Пример:
```php
// wp-config.php
define('AACSEARCH_API_KEY', 'your-api-key');
define('AACSEARCH_COLLECTION', 'wp_posts');

// Синхронизация при публикации
add_action('publish_post', function($post_id) {
    $post = get_post($post_id);
    AACSearch::indexPost($post);
});
```

### [02-shopify.md](./02-shopify.md) (18 страниц)
**Интеграция с Shopify**

Содержание:
- Установка Shopify App
- Синхронизация продуктов
- Варианты товаров
- Collections
- Inventory tracking
- Price updates
- Webhooks
- Liquid templates

Пример:
```javascript
// Shopify webhook handler
app.post('/webhooks/products/create', async (req, res) => {
  const product = req.body;

  await client.collections('shopify_products').documents().create({
    id: String(product.id),
    title: product.title,
    description: product.body_html,
    price: product.variants[0].price,
    vendor: product.vendor,
    variants: product.variants.map(v => ({
      id: v.id,
      title: v.title,
      price: v.price,
      inventory_quantity: v.inventory_quantity
    }))
  });

  res.status(200).send('OK');
});
```

### [03-woocommerce.md](./03-woocommerce.md) (15 страниц)
**Интеграция с WooCommerce**

Содержание:
- WordPress плагин + WooCommerce extension
- Синхронизация продуктов
- Вариации товаров
- Категории и атрибуты
- Stock management
- Price synchronization
- REST API webhooks

### [04-magento.md](./04-magento.md) (20 страниц)
**Интеграция с Magento**

Содержание:
- Magento 2 module
- Simple products
- Configurable products
- Grouped products
- Bundle products
- Categories tree
- Attributes
- Multi-store support
- Indexer integration

### [05-ghost.md](./05-ghost.md) (12 страниц)
**Интеграция с Ghost**

Содержание:
- Content API integration
- Posts indexing
- Pages, Authors, Tags
- Featured posts
- Custom integration
- Webhooks
- SEO data

### [06-strapi.md](./06-strapi.md) (15 страниц)
**Интеграция со Strapi**

Содержание:
- Strapi plugin
- Content Types sync
- Relations handling
- Media library
- Localization
- Webhooks
- GraphQL integration

### [07-contentful.md](./07-contentful.md) (15 страниц)
**Интеграция с Contentful**

Содержание:
- Content Delivery API
- Entries synchronization
- Assets handling
- Content Types
- Locales support
- Webhooks
- Preview mode

### [08-sanity.md](./08-sanity.md) (18 страниц)
**Интеграция с Sanity**

Содержание:
- Sanity plugin
- GROQ queries
- Real-time listeners
- Document sync
- References handling
- Asset URLs
- Portable Text

### [09-webflow.md](./09-webflow.md) (12 страниц)
**Интеграция с Webflow**

Содержание:
- Webflow CMS API
- Collections sync
- Items indexing
- Multi-reference fields
- Image fields
- Webhooks setup

### [10-other.md](./10-other.md) (10 страниц)
**Другие интеграции**

Содержание:
- Generic REST API integration
- CSV import
- Database sync (PostgreSQL, MySQL, MongoDB)
- Custom integrations guide
- Notion (Planned)
- Airtable (Planned)

## Примеры использования

### WordPress Integration

```bash
# Установка плагина
wp plugin install aacsearch --activate

# Настройка
wp aacsearch configure \
  --api-key=your-api-key \
  --collection=wp_posts

# Первичная синхронизация
wp aacsearch sync --post-type=post,page

# Continuous sync через cron
wp aacsearch setup-cron
```

### Shopify App

```javascript
// app.js - Shopify App
import { Shopify } from '@shopify/shopify-api';
import { AACSearchClient } from '@aacsearch/client';

const client = new AACSearchClient({
  apiKey: process.env.AACSEARCH_API_KEY
});

// Синхронизация всех продуктов
async function syncAllProducts(shop) {
  const products = await Shopify.rest.Product.all({
    session: shop.session
  });

  for (const product of products) {
    await client.collections('products').documents().upsert({
      id: String(product.id),
      title: product.title,
      description: product.body_html,
      vendor: product.vendor,
      product_type: product.product_type,
      tags: product.tags.split(','),
      variants: product.variants.map(v => ({
        id: String(v.id),
        title: v.title,
        price: parseFloat(v.price),
        sku: v.sku,
        inventory_quantity: v.inventory_quantity
      })),
      images: product.images.map(img => img.src),
      created_at: new Date(product.created_at).getTime()
    });
  }

  console.log(`Synced ${products.length} products`);
}

// Webhook handler
app.post('/webhooks/products/update', async (req, res) => {
  const product = req.body;

  await client.collections('products').documents().upsert({
    id: String(product.id),
    // ... маппинг полей
  });

  res.status(200).send('OK');
});
```

### Strapi Plugin

```javascript
// plugins/aacsearch/server/index.js
module.exports = {
  register({ strapi }) {
    // Регистрация lifecycle hooks
    strapi.db.lifecycles.subscribe({
      models: ['plugin::strapi.article'],

      async afterCreate(event) {
        await syncToAACSearch(event.result);
      },

      async afterUpdate(event) {
        await syncToAACSearch(event.result);
      },

      async afterDelete(event) {
        await deleteFromAACSearch(event.result.id);
      }
    });
  }
};

async function syncToAACSearch(article) {
  await client.collections('articles').documents().upsert({
    id: String(article.id),
    title: article.title,
    content: article.content,
    author: article.author?.name,
    category: article.category?.name,
    tags: article.tags?.map(t => t.name) || [],
    published_at: article.publishedAt ? new Date(article.publishedAt).getTime() : null
  });
}
```

### Contentful Webhook

```typescript
// Contentful webhook handler
import { createClient } from 'contentful';

const contentful = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
});

app.post('/webhooks/contentful', async (req, res) => {
  const { sys, fields } = req.body;

  // Обработка разных типов событий
  switch (sys.contentType.sys.id) {
    case 'blogPost':
      await client.collections('blog_posts').documents().upsert({
        id: sys.id,
        title: fields.title['en-US'],
        content: fields.content['en-US'],
        slug: fields.slug['en-US'],
        author: fields.author['en-US']?.fields.name,
        tags: fields.tags['en-US'] || [],
        published_at: new Date(fields.publishDate['en-US']).getTime()
      });
      break;

    case 'product':
      await client.collections('products').documents().upsert({
        id: sys.id,
        name: fields.name['en-US'],
        description: fields.description['en-US'],
        price: fields.price['en-US'],
        images: fields.images['en-US']?.map(img => img.fields.file.url) || []
      });
      break;
  }

  res.status(200).send('OK');
});
```

### Sanity Real-time Sync

```javascript
// sanity-sync.js
import { createClient } from '@sanity/client';
import { AACSearchClient } from '@aacsearch/client';

const sanity = createClient({
  projectId: 'your-project-id',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_TOKEN
});

const aacsearch = new AACSearchClient({
  apiKey: process.env.AACSEARCH_API_KEY
});

// Real-time listener
sanity.listen('*[_type == "post"]').subscribe(update => {
  const { result, transition } = update;

  if (transition === 'update' || transition === 'appear') {
    aacsearch.collections('posts').documents().upsert({
      id: result._id,
      title: result.title,
      slug: result.slug.current,
      content: result.body,
      author: result.author?.name,
      published_at: new Date(result.publishedAt).getTime()
    });
  } else if (transition === 'disappear') {
    aacsearch.collections('posts').documents(result._id).delete();
  }
});

console.log('Listening for Sanity updates...');
```

## Архитектура интеграций

### Общая схема

```
┌─────────────┐
│   CMS/      │
│  Platform   │
└──────┬──────┘
       │
       │ Webhook/API
       ▼
┌─────────────┐
│ Integration │
│   Layer     │ ← Transform & Map fields
└──────┬──────┘
       │
       │ REST/GraphQL
       ▼
┌─────────────┐
│  AACSearch  │
│   Server    │
└─────────────┘
```

### Компоненты интеграции

1. **Data Mapper** - маппинг полей CMS → AACSearch
2. **Webhook Handler** - обработка событий от CMS
3. **Sync Engine** - периодическая синхронизация
4. **Error Handler** - обработка ошибок и retry
5. **Monitor** - мониторинг состояния синхронизации

## CLI Utility

```bash
# Установка CLI
npm install -g @aacsearch/integrations-cli

# WordPress sync
aacsearch integrate wordpress \
  --url https://mysite.com \
  --api-key wp-key \
  --collection wp_posts

# Shopify sync
aacsearch integrate shopify \
  --shop myshop.myshopify.com \
  --api-key shopify-key \
  --collection products

# Generic webhook server
aacsearch webhooks:serve \
  --port 3000 \
  --auth-token secret

# Monitor integration status
aacsearch integrations:status
```

## Best Practices

### 1. Incremental Sync

```typescript
// Синхронизировать только измененные документы
async function incrementalSync(lastSyncTime: number) {
  const updated = await cms.getUpdatedSince(lastSyncTime);

  for (const item of updated) {
    await client.collections('items').documents().upsert(
      transformItem(item)
    );
  }

  // Сохранить timestamp последней синхронизации
  await saveLastSyncTime(Date.now());
}
```

### 2. Error Handling

```typescript
// Retry logic
async function syncWithRetry(item: any, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await client.collections('items').documents().upsert(item);
      return;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);

      if (i === maxRetries - 1) {
        // Сохранить в dead letter queue
        await saveToDeadLetterQueue(item, error);
      }

      await sleep(Math.pow(2, i) * 1000);  // Exponential backoff
    }
  }
}
```

### 3. Data Transformation

```typescript
// Централизованный трансформер
class DataTransformer {
  transformWordPressPost(post: any) {
    return {
      id: String(post.id),
      title: post.title.rendered,
      content: stripHtml(post.content.rendered),
      excerpt: stripHtml(post.excerpt.rendered),
      author: post._embedded?.author?.[0]?.name,
      categories: post._embedded?.['wp:term']?.[0]?.map(c => c.name) || [],
      tags: post._embedded?.['wp:term']?.[1]?.map(t => t.name) || [],
      published_at: new Date(post.date).getTime()
    };
  }

  transformShopifyProduct(product: any) {
    return {
      id: String(product.id),
      name: product.title,
      description: stripHtml(product.body_html),
      price: parseFloat(product.variants[0].price),
      // ...
    };
  }
}
```

## Monitoring & Alerting

```typescript
// Мониторинг интеграций
class IntegrationMonitor {
  async checkHealth(integration: string) {
    const status = await this.getStatus(integration);

    // Проверки
    if (status.lastSyncTime < Date.now() - 60 * 60 * 1000) {
      await this.alert(`${integration}: No sync for 1 hour`);
    }

    if (status.errorRate > 0.05) {
      await this.alert(`${integration}: High error rate ${status.errorRate * 100}%`);
    }

    if (status.queueSize > 1000) {
      await this.alert(`${integration}: Large queue size ${status.queueSize}`);
    }
  }

  async alert(message: string) {
    // Slack
    await slack.send({ text: `⚠️ Integration Alert: ${message}` });

    // Email
    await email.send({
      to: 'team@example.com',
      subject: 'Integration Alert',
      body: message
    });
  }
}
```

## Следующие шаги

- Настройте [WordPress интеграцию](./01-wordpress.md)
- Подключите [Shopify](./02-shopify.md)
- Интегрируйте [headless CMS](./06-strapi.md)
- Изучите [продвинутые функции](../06-advanced/README.md)

---

**Назад**: [← Аналитика](../04-analytics/README.md) | **Далее**: [WordPress интеграция →](./01-wordpress.md)
