<script>
    import Main from '$lib/layouts/Main.svelte';
    import { DEFAULT_HOST } from '$lib/utils/metadata';
    import { TITLE_SUFFIX } from '$routes/titles';

    import { PreFooter, FooterNav, MainFooter } from '$lib/components';

    const title = 'Integrations' + TITLE_SUFFIX;
    const description =
        'Connect 10+ platforms instantly with ready-made integrations. Seamless data synchronization with e-commerce, CMS, and custom systems with webhooks and real-time updates.';
    const ogImage = DEFAULT_HOST + '/images/open-graph/website.png';
</script>

<svelte:head>
    <!-- Titles -->
    <title>{title}</title>
    <meta property="og:title" content={title} />
    <meta name="twitter:title" content={title} />
    <!-- Description -->
    <meta name="description" content={description} />
    <meta property="og:description" content={description} />
    <meta name="twitter:description" content={description} />
    <!-- Keywords -->
    <meta name="keywords" content="integrations, data sync, e-commerce integration, CMS integration, Shopify, WordPress, webhooks, real-time sync" />
    <!-- Image -->
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:image" content={ogImage} />
    <meta name="twitter:card" content="summary_large_image" />
    <!-- Canonical -->
    <link rel="canonical" href="{DEFAULT_HOST}/products/integrations" />
</svelte:head>

<Main>
    <div class="overflow-hidden">
        <!-- HERO SECTION -->
        <section class="web-hero is-full-width">
            <div class="container">
                <div class="web-hero-content">
                    <h1 class="web-title">Integrations</h1>
                    <p class="web-description">
                        Connect AACSearch with your existing platforms instantly. Real-time data synchronization with 10+ integrations out of the box.
                    </p>
                    <div class="web-hero-buttons">
                        <a href="/docs/products/integrations" class="web-button is-primary">
                            <span class="text">Get Started</span>
                        </a>
                        <a href="/console" class="web-button is-secondary">
                            <span class="text">Try Demo</span>
                        </a>
                    </div>
                </div>
                <div class="web-hero-image">
                    <img
                        src="/images/products/integrations-hero.png"
                        alt="Integrations"
                        width="600"
                        height="400"
                    />
                </div>
            </div>
        </section>

        <!-- FEATURES SECTION -->
        <section class="web-section">
            <div class="container">
                <h2 class="web-heading text-center">Seamless Platform Connections</h2>
                <p class="text-center text-sub-body mb-12">
                    Pre-built connectors for your favorite platforms
                </p>

                <div class="grid gap-8" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))">
                    <!-- Feature 1: E-Commerce Connectors -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/shopping.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">E-Commerce Connectors</h3>
                            <p class="text-sub-body mt-3">
                                Direct integration with Shopify, WooCommerce, and Magento. Automatically sync products, variants, prices, and inventory in real-time.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Supported platforms:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Shopify</li>
                                    <li>- WooCommerce</li>
                                    <li>- Magento</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 2: CMS Connectors -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/document.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">CMS Connectors</h3>
                            <p class="text-sub-body mt-3">
                                Connect WordPress, Ghost, and Strapi. Index posts, pages, and custom content automatically whenever you publish.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">CMS platforms:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- WordPress</li>
                                    <li>- Ghost</li>
                                    <li>- Strapi</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 3: Headless CMS Integration -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/api.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Headless CMS</h3>
                            <p class="text-sub-body mt-3">
                                Contentful, Sanity, and Webflow webhooks for modern content management. Push content to search index automatically on publish.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Headless platforms:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Contentful</li>
                                    <li>- Sanity</li>
                                    <li>- Webflow</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 4: Real-Time Synchronization -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/sync.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Real-Time Sync</h3>
                            <p class="text-sub-body mt-3">
                                Instant data synchronization whenever content changes. Webhook-driven updates keep search index always in sync with source data.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Sync features:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Instant updates</li>
                                    <li>- Webhook triggers</li>
                                    <li>- Configurable frequency</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 5: Webhooks -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/hook.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Webhooks</h3>
                            <p class="text-sub-body mt-3">
                                Event-driven architecture with webhook support. Receive notifications on documents change, searches occur, or index updates complete.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Webhook events:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Document events</li>
                                    <li>- Search events</li>
                                    <li>- Index events</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 6: Custom Integrations -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/plug.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Custom Integrations</h3>
                            <p class="text-sub-body mt-3">
                                Build custom connectors for proprietary systems. REST API and SDKs make integration with any platform simple and straightforward.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Custom integration:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- REST API</li>
                                    <li>- Multiple SDKs</li>
                                    <li>- Webhook support</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 7: Data Transformation -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/transform.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Data Transformation</h3>
                            <p class="text-sub-body mt-3">
                                Flexible field mapping and data transformation. Normalize data from different sources to fit your search schema automatically.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Transformation:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Field mapping</li>
                                    <li>- Data normalization</li>
                                    <li>- Format conversion</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 8: Scheduled Import -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/schedule.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Scheduled Import</h3>
                            <p class="text-sub-body mt-3">
                                Automatic data imports on schedule. Run bulk syncs daily, weekly, or monthly alongside real-time webhooks for complete coverage.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Import options:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Cron scheduling</li>
                                    <li>- Bulk import</li>
                                    <li>- Error handling</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- USE CASES SECTION -->
        <section class="web-section bg-greyscale-50">
            <div class="container">
                <h2 class="web-heading text-center">Perfect For</h2>

                <div class="grid gap-8 mt-12" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))">
                    <!-- Use Case 1 -->
                    <div class="flex flex-col">
                        <h3 class="text-main-body mb-3">Multi-Platform E-Commerce</h3>
                        <p class="text-sub-body mb-4">
                            Sync products across Shopify, WooCommerce, and custom storefronts. Keep search index synchronized across all platforms with automatic conflict resolution and version control.
                        </p>
                        <ul class="text-caption space-y-2 ml-4">
                            <li>- Multi-store sync</li>
                            <li>- Inventory management</li>
                            <li>- Price synchronization</li>
                            <li>- Automated updates</li>
                        </ul>
                    </div>

                    <!-- Use Case 2 -->
                    <div class="flex flex-col">
                        <h3 class="text-main-body mb-3">Omnichannel Content Management</h3>
                        <p class="text-sub-body mb-4">
                            Manage content across WordPress, Ghost, Contentful, and custom systems. Publish once and automatically index across all search platforms with instant distribution.
                        </p>
                        <ul class="text-caption space-y-2 ml-4">
                            <li>- Multi-CMS support</li>
                            <li>- Unified indexing</li>
                            <li>- Publish automation</li>
                            <li>- Content versioning</li>
                        </ul>
                    </div>

                    <!-- Use Case 3 -->
                    <div class="flex flex-col">
                        <h3 class="text-main-body mb-3">Legacy System Integration</h3>
                        <p class="text-sub-body mb-4">
                            Bridge proprietary databases and legacy systems with AACSearch. Custom connectors and API-based integration enable modern search on existing data without migration.
                        </p>
                        <ul class="text-caption space-y-2 ml-4">
                            <li>- Custom connectors</li>
                            <li>- Legacy support</li>
                            <li>- Data bridging</li>
                            <li>- Zero downtime migration</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- CODE EXAMPLE SECTION -->
        <section class="web-section">
            <div class="container">
                <h2 class="web-heading text-center">Get Started in Minutes</h2>

                <div class="grid gap-12 mt-12" style="grid-template-columns: 1fr 1fr">
                    <div>
                        <h3 class="text-main-body mb-4">1. Shopify Integration Setup</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
// Configure Shopify integration
const integration = {'{'}
  provider: 'shopify',
  name: 'My Store',
  credentials: {'{'}
    shop_domain: 'mystore.myshopify.com',
    access_token: 'shpat_xxxxx'
  {'}'},
  settings: {'{'}
    syncFrequency: 15, // minutes
    collections: [
      'products',
      'collections'
    ]
  {'}'}
{'}'};
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">2. WordPress Plugin Integration</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
// WordPress hook for post updates
add_action('save_post', function(
  $post_id
) {'{'}
  $post = get_post($post_id);

  wp_remote_post(
    'https://api.aacsearch.com/sync',
    ['{'}
      'headers' => ['{'}
        'Authorization' =>
          'Bearer ' .
          AACSEARCH_API_KEY
      {'}'},
      'body' => json_encode(['{'}
        'id' => $post_id,
        'title' => $post->post_title
      {'}'}')
    {'}']
  );
{'}'});
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">3. Contentful Webhook</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
// Contentful webhook endpoint
app.post('/webhooks/contentful',
  async (req, res) => {'{'}
  const {'{'}sys, fields{'}'} = req.body;

  if (sys.type ===
    'DeletedEntry') {'{'}
    await client
      .delete('content', sys.id);
  {'}'} else {'{'}
    await client
      .upsert('content', {'{'}
        id: sys.id,
        title: fields.title['en-US']
      {'}'});
  {'}'}

  res.status(200).send('OK');
{'}'}
);
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">4. Custom REST API Sync</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
// Sync from custom API
const response = await fetch(
  'https://api.myapp.com/products',
  {'{'}
    headers: {'{'}
      'Authorization':
        'Bearer API_KEY'
    {'}'}
  {'}'}
);

const products = await
  response.json();

await client
  .import('products',
    products, {'{'}
      action: 'upsert'
    {'}'});
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">5. Webhook Handler</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
// Handle AACSearch webhooks
app.post('/webhooks/aacsearch',
  (req, res) => {'{'}
  const sig = req.headers
    ['x-webhook-signature'];

  const isValid =
    verifySignature(
      req.body,
      sig,
      secret
    );

  if (!isValid)
    return res.status(401)
      .send('Invalid');

  console.log(req.body.event);
  res.status(200).send('OK');
{'}'}
);
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">6. Scheduled Bulk Import</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
// Daily bulk sync job
const job = await payload.create(
  {'{'}
    collection: 'jobs',
    data: {'{'}
      name: 'daily-import',
      provider: 'shopify',
      schedule: '0 2 * * *', // 2 AM
      action: 'bulk_import',
      settings: {'{'}
        batchSize: 1000,
        retryCount: 3
      {'}'},
      active: true
    {'}'}
  {'}'}
);
                        </code></pre>
                    </div>
                </div>
            </div>
        </section>

        <!-- RELATED PRODUCTS SECTION -->
        <section class="web-u-sep-block-start py-40">
            <div class="container">
                <h4 class="text-label text-primary text-center">Explore Related Products</h4>
                <ul
                    class="mt-8 grid gap-8"
                    style="grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr))"
                >
                    <li class="web-u-flex-basis-378">
                        <a
                            class="web-card is-normal"
                            href="/products/search-core"
                            style="background: rgba(255, 255, 255, 0.04);"
                        >
                            <div
                                class="web-u-padding-inline-8 web-u-padding-block-end-8 flex flex-col gap-2"
                            >
                                <div class="flex items-center gap-2">
                                    <img
                                        src="/images/icons/illustrated/dark/search-core.png"
                                        alt="Search Core"
                                        width="32"
                                        height="32"
                                    />
                                    <h4 class="text-main-body text-primary">Search Core</h4>
                                    <span class="web-icon-arrow-right ml-auto" aria-hidden="true"
                                    ></span>
                                </div>
                                <p class="text-sub-body">
                                    Enterprise-grade full-text search engine.
                                </p>
                            </div>
                        </a>
                    </li>
                    <li class="web-u-flex-basis-378">
                        <a
                            class="web-card is-normal"
                            href="/products/analytics"
                            style="background: rgba(255, 255, 255, 0.04);"
                        >
                            <div
                                class="web-u-padding-inline-8 web-u-padding-block-end-8 flex flex-col gap-2"
                            >
                                <div class="flex items-center gap-2">
                                    <img
                                        src="/images/icons/illustrated/dark/analytics.png"
                                        alt="Analytics"
                                        width="32"
                                        height="32"
                                    />
                                    <h4 class="text-main-body text-primary">Analytics</h4>
                                    <span class="web-icon-arrow-right ml-auto" aria-hidden="true"
                                    ></span>
                                </div>
                                <p class="text-sub-body">
                                    Track sync performance and data quality metrics.
                                </p>
                            </div>
                        </a>
                    </li>
                    <li class="web-u-flex-basis-378">
                        <a
                            class="web-card is-normal"
                            href="/products/enterprise"
                            style="background: rgba(255, 255, 255, 0.04);"
                        >
                            <div
                                class="web-u-padding-inline-8 web-u-padding-block-end-8 flex flex-col gap-2"
                            >
                                <div class="flex items-center gap-2">
                                    <img
                                        src="/images/icons/illustrated/dark/enterprise.png"
                                        alt="Enterprise"
                                        width="32"
                                        height="32"
                                    />
                                    <h4 class="text-main-body text-primary">Enterprise</h4>
                                    <span class="web-icon-arrow-right ml-auto" aria-hidden="true"
                                    ></span>
                                </div>
                                <p class="text-sub-body">
                                    Security and compliance for enterprise integration.
                                </p>
                            </div>
                        </a>
                    </li>
                    <li class="web-u-flex-basis-378">
                        <a
                            class="web-card is-normal"
                            href="/products/ai-search"
                            style="background: rgba(255, 255, 255, 0.04);"
                        >
                            <div
                                class="web-u-padding-inline-8 web-u-padding-block-end-8 flex flex-col gap-2"
                            >
                                <div class="flex items-center gap-2">
                                    <img
                                        src="/images/icons/illustrated/dark/ai-search.png"
                                        alt="AI Search"
                                        width="32"
                                        height="32"
                                    />
                                    <h4 class="text-main-body text-primary">AI Search</h4>
                                    <span class="web-icon-arrow-right ml-auto" aria-hidden="true"
                                    ></span>
                                </div>
                                <p class="text-sub-body">
                                    AI-powered search with natural language understanding.
                                </p>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </section>

        <!-- FOOTER -->
        <div class="border-smooth relative border-t">
            <div class="container">
                <FooterNav />
                <MainFooter />
            </div>
        </div>
    </div>
</Main>

<style>
    :global(.web-section) {
        padding: 60px 0;
    }

    :global(.web-heading) {
        font-size: 2rem;
        font-weight: 600;
        margin-bottom: 20px;
    }

    :global(.web-description) {
        font-size: 1.125rem;
        color: var(--color-text-secondary);
        margin-bottom: 30px;
    }

    :global(.web-hero-buttons) {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 30px;
    }

    :global(.web-card) {
        background: rgba(255, 255, 255, 0.04);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
    }

    :global(.web-card:hover) {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
    }
</style>
