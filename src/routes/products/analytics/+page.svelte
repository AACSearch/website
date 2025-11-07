<script>
    import Main from '$lib/layouts/Main.svelte';
    import { DEFAULT_HOST } from '$lib/utils/metadata';
    import { TITLE_SUFFIX } from '$routes/titles';

    import { PreFooter, FooterNav, MainFooter } from '$lib/components';

    const title = 'Analytics' + TITLE_SUFFIX;
    const description =
        'Track search queries, clicks, conversions, and performance metrics. Real-time analytics dashboard with A/B testing and actionable insights for search optimization.';
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
    <meta name="keywords" content="search analytics, query analytics, click tracking, conversion tracking, A/B testing, performance metrics, search insights" />
    <!-- Image -->
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:image" content={ogImage} />
    <meta name="twitter:card" content="summary_large_image" />
    <!-- Canonical -->
    <link rel="canonical" href="{DEFAULT_HOST}/products/analytics" />
</svelte:head>

<Main>
    <div class="overflow-hidden">
        <!-- HERO SECTION -->
        <section class="web-hero is-full-width">
            <div class="container">
                <div class="web-hero-content">
                    <h1 class="web-title">Analytics</h1>
                    <p class="web-description">
                        Deep insights into search performance. Track queries, clicks, conversions, and optimize with real-time analytics and A/B testing.
                    </p>
                    <div class="web-hero-buttons">
                        <a href="/docs/products/analytics" class="web-button is-primary">
                            <span class="text">Get Started</span>
                        </a>
                        <a href="/console" class="web-button is-secondary">
                            <span class="text">Try Demo</span>
                        </a>
                    </div>
                </div>
                <div class="web-hero-image">
                    <img
                        src="/images/products/analytics-hero.png"
                        alt="Analytics"
                        width="600"
                        height="400"
                    />
                </div>
            </div>
        </section>

        <!-- FEATURES SECTION -->
        <section class="web-section">
            <div class="container">
                <h2 class="web-heading text-center">Comprehensive Search Insights</h2>
                <p class="text-center text-sub-body mb-12">
                    Real-time metrics and actionable analytics for search optimization
                </p>

                <div class="grid gap-8" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))">
                    <!-- Feature 1: Real-Time Analytics -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/realtime.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Real-Time Analytics</h3>
                            <p class="text-sub-body mt-3">
                                Live dashboard showing search volume, top queries, and performance metrics updated in real-time. Monitor your search engine performance 24/7.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Real-time metrics:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Live query volume</li>
                                    <li>- Top searches</li>
                                    <li>- Search latency</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 2: Query Tracking -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/track-queries.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Query Tracking</h3>
                            <p class="text-sub-body mt-3">
                                Track all search queries with detailed metrics. Identify popular searches, trending queries, and detect typos and misspellings.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Query insights:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Top queries</li>
                                    <li>- Zero-result queries</li>
                                    <li>- Query trends</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 3: Click Tracking -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/clicks.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Click Tracking</h3>
                            <p class="text-sub-body mt-3">
                                Understand which results get clicked and at what position. Track Click-Through Rate (CTR) and user interaction patterns for relevance optimization.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Click metrics:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Click-through rate</li>
                                    <li>- Position metrics</li>
                                    <li>- User interactions</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 4: Conversion Tracking -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/conversion.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Conversion Tracking</h3>
                            <p class="text-sub-body mt-3">
                                Track conversions resulting from searches. Monitor purchase value, leads, and other business metrics tied to search queries and results.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Conversion metrics:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Conversion rate</li>
                                    <li>- Revenue attributed</li>
                                    <li>- ROI per query</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 5: A/B Testing -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/ab-test.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">A/B Testing</h3>
                            <p class="text-sub-body mt-3">
                                Test different ranking algorithms, filters, and UI configurations. Compare metrics and automatically detect winning variants with statistical significance.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">A/B testing:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Multi-variant tests</li>
                                    <li>- Statistical analysis</li>
                                    <li>- Winner detection</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 6: Performance Metrics -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/performance.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Performance Metrics</h3>
                            <p class="text-sub-body mt-3">
                                Monitor search latency, throughput, and availability. Track P50, P95, P99 latencies and identify performance bottlenecks.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Performance:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Latency percentiles</li>
                                    <li>- Query throughput</li>
                                    <li>- Availability metrics</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 7: No-Hit Analysis -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/no-hits.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">No-Hit Analysis</h3>
                            <p class="text-sub-body mt-3">
                                Identify queries returning zero results. Discover typos, missing synonyms, and gaps in your data. Get automatic suggestions for improvements.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">No-hit insights:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Zero-result queries</li>
                                    <li>- Trend analysis</li>
                                    <li>- Fix suggestions</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 8: Custom Reports -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/reports.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Custom Reports</h3>
                            <p class="text-sub-body mt-3">
                                Create custom reports and dashboards. Export data, schedule automated reports, and share insights with your team.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Reporting:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Custom dashboards</li>
                                    <li>- Scheduled reports</li>
                                    <li>- Data export</li>
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
                        <h3 class="text-main-body mb-3">E-Commerce Search Optimization</h3>
                        <p class="text-sub-body mb-4">
                            Track product search performance and click-through rates. Understand customer search behavior, identify top-performing products, and optimize rankings for conversion.
                        </p>
                        <ul class="text-caption space-y-2 ml-4">
                            <li>- Query volume tracking</li>
                            <li>- Click-through rates</li>
                            <li>- Conversion metrics</li>
                            <li>- A/B ranking tests</li>
                        </ul>
                    </div>

                    <!-- Use Case 2 -->
                    <div class="flex flex-col">
                        <h3 class="text-main-body mb-3">Content Discovery Analytics</h3>
                        <p class="text-sub-body mb-4">
                            Monitor user search behavior across documentation and blog content. Identify gaps in content, trending topics, and popular search queries to guide content creation.
                        </p>
                        <ul class="text-caption space-y-2 ml-4">
                            <li>- Search trends</li>
                            <li>- Popular queries</li>
                            <li>- Zero-result gaps</li>
                            <li>- User behavior</li>
                        </ul>
                    </div>

                    <!-- Use Case 3 -->
                    <div class="flex flex-col">
                        <h3 class="text-main-body mb-3">Search Quality Management</h3>
                        <p class="text-sub-body mb-4">
                            Ensure search quality through comprehensive monitoring and testing. Track performance metrics, run controlled A/B tests on ranking algorithms, and measure improvements.
                        </p>
                        <ul class="text-caption space-y-2 ml-4">
                            <li>- Latency monitoring</li>
                            <li>- A/B testing</li>
                            <li>- Quality metrics</li>
                            <li>- Statistical analysis</li>
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
                        <h3 class="text-main-body mb-4">1. Track Search Queries</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
// Automatic query tracking
const results = await client
  .collections('products')
  .documents()
  .search({'{'}
    q: 'laptop',
    query_by: 'title'
  {'}'}
);

// Automatically tracked:
// - Query text
// - Results count
// - Query latency
// - Timestamp
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">2. Track Clicks</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
// Log user clicks
await fetch('/api/analytics/click',
  {'{'}
    method: 'POST',
    body: JSON.stringify({'{'}
      query: 'laptop',
      document_id: 'prod-123',
      position: 3,
      collection: 'products',
      session_id: 'sess-456'
    {'}'}),
  {'}'}
);

// Analytics dashboard shows:
// - CTR per query
// - Position metrics
// - User interactions
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">3. Track Conversions</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
// Log conversion events
await fetch(
  '/api/analytics/conversion',
  {'{'}
    method: 'POST',
    body: JSON.stringify({'{'}
      query: 'laptop',
      document_id: 'prod-123',
      revenue: 1299.99,
      conversion_type:
        'purchase',
      session_id: 'sess-456'
    {'}'}),
  {'}'}
);

// Track ROI per search query
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">4. Create A/B Test</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
// Setup A/B test
const test = await payload.create({'{'}
  collection: 'ab_tests',
  data: {'{'}
    name: 'Ranking Test',
    variants: [{'{'}
      name: 'control',
      weight: 50,
      config: {'{'}
        sort_by: '_text_match:desc'
      {'}'}
    {'}'}, {'{'}
      name: 'variant',
      weight: 50,
      config: {'{'}
        sort_by:
          '_text_match:desc,sales:desc'
      {'}'}
    {'}'}],
    duration_days: 14
  {'}'}
{'}'});
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">5. Get Query Analytics</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
// Fetch query analytics
const analytics = await payload
  .find({'{'}
    collection: 'analytics',
    where: {'{'}
      metric: {'{'}
        equals: 'top_queries'
      {'}'}
    {'}'},
    limit: 10
  {'}'}
);

// Response:
// [
//   {'{'}
//     query: 'laptop',
//     count: 1245,
//     ctr: 0.35,
//     conversion_rate: 0.08
//   {'}'},
//   ...
// ]
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">6. Export Report</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
// Schedule report export
const report = await payload.create(
  {'{'}
    collection: 'reports',
    data: {'{'}
      name: 'Monthly Search Report',
      metrics: [
        'top_queries',
        'ctr',
        'latency',
        'conversion_rate'
      ],
      frequency: 'monthly',
      recipients: [
        'team@company.com'
      ],
      format: 'pdf',
      active: true
    {'}'}
  {'}'}
);

// Email sent every month
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
                                    Enterprise search engine that powers analytics.
                                </p>
                            </div>
                        </a>
                    </li>
                    <li class="web-u-flex-basis-378">
                        <a
                            class="web-card is-normal"
                            href="/products/widgets"
                            style="background: rgba(255, 255, 255, 0.04);"
                        >
                            <div
                                class="web-u-padding-inline-8 web-u-padding-block-end-8 flex flex-col gap-2"
                            >
                                <div class="flex items-center gap-2">
                                    <img
                                        src="/images/icons/illustrated/dark/widgets.png"
                                        alt="Widgets"
                                        width="32"
                                        height="32"
                                    />
                                    <h4 class="text-main-body text-primary">Widgets</h4>
                                    <span class="web-icon-arrow-right ml-auto" aria-hidden="true"
                                    ></span>
                                </div>
                                <p class="text-sub-body">
                                    Collect analytics from embeddable widgets.
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
                                    Track AI-powered search performance and metrics.
                                </p>
                            </div>
                        </a>
                    </li>
                    <li class="web-u-flex-basis-378">
                        <a
                            class="web-card is-normal"
                            href="/products/integrations"
                            style="background: rgba(255, 255, 255, 0.04);"
                        >
                            <div
                                class="web-u-padding-inline-8 web-u-padding-block-end-8 flex flex-col gap-2"
                            >
                                <div class="flex items-center gap-2">
                                    <img
                                        src="/images/icons/illustrated/dark/integrations.png"
                                        alt="Integrations"
                                        width="32"
                                        height="32"
                                    />
                                    <h4 class="text-main-body text-primary">Integrations</h4>
                                    <span class="web-icon-arrow-right ml-auto" aria-hidden="true"
                                    ></span>
                                </div>
                                <p class="text-sub-body">
                                    Integrate analytics with external platforms.
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
