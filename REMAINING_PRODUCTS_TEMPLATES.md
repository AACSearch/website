# Templates for Remaining 3 Products

This document provides complete copy-paste templates for the remaining products (Multi-Search, Advanced-Search, Developer-Tools).

---

## Product 3: Multi-Search

### File: `/tmp/website/src/routes/products/multi-search/+page.svelte`

```svelte
<script>
    import Main from '$lib/layouts/Main.svelte';
    import { DEFAULT_HOST } from '$lib/utils/metadata';
    import { TITLE_SUFFIX } from '$routes/titles';

    import { PreFooter, FooterNav, MainFooter } from '$lib/components';
    import Hero from './(components)/Hero.svelte';
    import Testimonials from '$lib/components/product-pages/testimonials.svelte';
    import Features from './(components)/features/Features.svelte';
    import UseCases from './(components)/UseCases.svelte';
    import Pricing from '$routes/(marketing)/(components)/pricing.svelte';

    const title = 'Multi-Search' + TITLE_SUFFIX;
    const description =
        'Federated search across multiple collections. Query products, content, and reviews simultaneously with unified ranking and relevance.';
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
    <meta name="keywords" content="multi-collection search, federated search, cross-collection search, unified ranking" />

    <!-- Image -->
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:image" content={ogImage} />
    <meta name="twitter:card" content="summary_large_image" />

    <!-- Canonical -->
    <link rel="canonical" href="{DEFAULT_HOST}/products/multi-search" />
</svelte:head>

<Main>
    <div class="overflow-hidden">
        <Hero />
        <div>
            <Features />
            <div class="bg-greyscale-50">
                <UseCases />
                <section class="web-u-sep-block-start py-20">
                    <div class="container">
                        <h3 class="text-headline-3 text-primary text-center mb-16">Code Example</h3>
                        <div class="max-w-4xl mx-auto bg-greyscale-900 rounded-lg p-8 overflow-x-auto">
                            <pre class="text-label text-greyscale-300"><code>{`// Search across multiple collections
const results = await client
  .collections(['products', 'reviews', 'articles'])
  .documents()
  .search({
    q: 'wireless headphones',
    query_by: 'title,content',
    collection_weights: {
      'products': 2.0,      // Boost products
      'reviews': 1.5,       // Medium weight
      'articles': 1.0       // Lower weight
    },
    limit: 20
  });

// Results: [{
//   collection: 'products',
//   hits: [...],
//   found: 145
// }, {
//   collection: 'reviews',
//   hits: [...],
//   found: 89
// }, {
//   collection: 'articles',
//   hits: [...],
//   found: 234
// }]

// Unified ranking across collections
const unified = await client
  .collections(['products', 'reviews'])
  .documents()
  .search({
    q: 'gaming laptop',
    group_by: '_collection',
    group_limit: 5,  // 5 results per collection
    sort_by: '_text_match:desc'
  });`}</code></pre>
                        </div>
                    </div>
                </section>
                <Testimonials />
            </div>
        </div>
        <section class="web-u-sep-block-start -mt-8 py-40">
            <div class="container">
                <h4 class="text-label text-primary text-center">Related Products</h4>
                <ul
                    class="mt-8 grid gap-8"
                    style="grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr))"
                >
                    <li class="web-u-flex-basis-378">
                        <a
                            class="web-card is-normal"
                            href="/products/merchandising"
                            style="background: rgba(255, 255, 255, 0.04);"
                        >
                            <div
                                class="web-u-padding-inline-8 web-u-padding-block-end-8 flex flex-col gap-2"
                            >
                                <div class="flex items-center gap-2">
                                    <span class="text-2xl">🎯</span>
                                    <h4 class="text-main-body text-primary">Merchandising</h4>
                                    <span class="web-icon-arrow-right ml-auto" aria-hidden="true"></span>
                                </div>
                                <p class="text-sub-body">
                                    Control search results with synonyms, overrides, and curation.
                                </p>
                            </div>
                        </a>
                    </li>
                    <li class="web-u-flex-basis-378">
                        <a
                            class="web-card is-normal"
                            href="/products/advanced-search"
                            style="background: rgba(255, 255, 255, 0.04);"
                        >
                            <div
                                class="web-u-padding-inline-8 web-u-padding-block-end-8 flex flex-col gap-2"
                            >
                                <div class="flex items-center gap-2">
                                    <span class="text-2xl">🗺️</span>
                                    <h4 class="text-main-body text-primary">Advanced Search</h4>
                                    <span class="web-icon-arrow-right ml-auto" aria-hidden="true"></span>
                                </div>
                                <p class="text-sub-body">
                                    Geo, image, and vector search capabilities.
                                </p>
                            </div>
                        </a>
                    </li>
                    <li class="web-u-flex-basis-378">
                        <a
                            class="web-card is-normal"
                            href="/products/developer-tools"
                            style="background: rgba(255, 255, 255, 0.04);"
                        >
                            <div
                                class="web-u-padding-inline-8 web-u-padding-block-end-8 flex flex-col gap-2"
                            >
                                <div class="flex items-center gap-2">
                                    <span class="text-2xl">⚙️</span>
                                    <h4 class="text-main-body text-primary">Developer Tools</h4>
                                    <span class="web-icon-arrow-right ml-auto" aria-hidden="true"></span>
                                </div>
                                <p class="text-sub-body">
                                    APIs, SDKs, webhooks, and collection builder.
                                </p>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </section>
        <div class="border-smooth relative border-t">
            <Pricing class="mt-0" />
            <div class="container">
                <FooterNav />
                <MainFooter />
            </div>
        </div>
    </div>
</Main>
```

### File: `/tmp/website/src/routes/products/multi-search/(components)/Hero.svelte`

```svelte
<div class="py-40 web-u-sep-block-end">
    <div class="container">
        <div class="text-center">
            <h1 class="text-headline-1 text-primary mb-8">Search Everything at Once</h1>
            <p class="text-main-body text-secondary max-w-3xl mx-auto mb-16">
                Query multiple collections simultaneously with unified ranking. Search products, content, and
                reviews in a single request with intelligent result merging and relevance scoring.
            </p>
            <div class="flex gap-4 justify-center flex-wrap">
                <a href="#features" class="web-button is-primary">Explore Features</a>
                <a href="/docs/products/multi-search" class="web-button is-secondary">Read Docs</a>
            </div>
        </div>
        <div class="mt-16 rounded-lg overflow-hidden border border-greyscale-700">
            <img
                src="/images/products/multi-search-hero.png"
                alt="Multi-Search dashboard"
                class="w-full h-auto"
                loading="lazy"
            />
        </div>
    </div>
</div>
```

### File: `/tmp/website/src/routes/products/multi-search/(components)/features/Features.svelte`

```svelte
<section id="features" class="web-u-sep-block py-20">
    <div class="container">
        <h2 class="text-headline-2 text-primary text-center mb-20">Unified Search Capabilities</h2>

        <div class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <!-- Feature 1: Federated Search -->
            <div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-3xl">🔍</span>
                    <h3 class="text-main-body text-primary font-semibold">Federated Search</h3>
                </div>
                <p class="text-sub-body text-secondary">
                    Query multiple collections in a single request. Execute searches in parallel for lightning-fast
                    results.
                </p>
            </div>

            <!-- Feature 2: Collection Weighting -->
            <div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-3xl">⚖️</span>
                    <h3 class="text-main-body text-primary font-semibold">Collection Weighting</h3>
                </div>
                <p class="text-sub-body text-secondary">
                    Control the distribution of results between collections. Boost products over reviews or vice versa
                    based on your needs.
                </p>
            </div>

            <!-- Feature 3: Unified Ranking -->
            <div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-3xl">🏅</span>
                    <h3 class="text-main-body text-primary font-semibold">Unified Ranking</h3>
                </div>
                <p class="text-sub-body text-secondary">
                    Single relevance score across all collections. Intelligently merge and rank results from different
                    sources.
                </p>
            </div>

            <!-- Feature 4: Grouped Results -->
            <div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-3xl">📦</span>
                    <h3 class="text-main-body text-primary font-semibold">Grouped Results</h3>
                </div>
                <p class="text-sub-body text-secondary">
                    Get separate result groups per collection with configurable limits. Control how many results from
                    each source.
                </p>
            </div>

            <!-- Feature 5: Cross-Collection Filters -->
            <div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-3xl">🎯</span>
                    <h3 class="text-main-body text-primary font-semibold">Cross-Collection Filters</h3>
                </div>
                <p class="text-sub-body text-secondary">
                    Apply unified filters across all collections. Exclude fields, apply date ranges, and filter by
                    status globally.
                </p>
            </div>

            <!-- Feature 6: Performance Optimization -->
            <div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-3xl">⚡</span>
                    <h3 class="text-main-body text-primary font-semibold">Performance Optimization</h3>
                </div>
                <p class="text-sub-body text-secondary">
                    Parallel execution and intelligent caching. Results cached across requests for maximum speed.
                </p>
            </div>
        </div>
    </div>
</section>
```

### File: `/tmp/website/src/routes/products/multi-search/(components)/UseCases.svelte`

```svelte
<section class="web-u-sep-block py-20">
    <div class="container">
        <h2 class="text-headline-2 text-primary text-center mb-20">Perfect for Multi-Source Platforms</h2>

        <div class="grid gap-8 grid-cols-1 md:grid-cols-3">
            <!-- Use Case 1: E-commerce -->
            <div class="bg-greyscale-100 rounded-lg p-8">
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-3xl">🛍️</span>
                    <h3 class="text-main-body text-primary font-semibold">Multi-Catalog Commerce</h3>
                </div>
                <p class="text-sub-body text-secondary mb-6">
                    Search products, reviews, and related content in one query. Give customers a unified shopping
                    experience.
                </p>
                <ul class="text-label text-secondary space-y-2">
                    <li>✓ Search products + reviews + FAQs</li>
                    <li>✓ Reviews boost product relevance</li>
                    <li>✓ Related articles for products</li>
                    <li>✓ Unified faceting across sources</li>
                </ul>
            </div>

            <!-- Use Case 2: Knowledge Management -->
            <div class="bg-greyscale-100 rounded-lg p-8">
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-3xl">📚</span>
                    <h3 class="text-main-body text-primary font-semibold">Knowledge Management</h3>
                </div>
                <p class="text-sub-body text-secondary mb-6">
                    Search documentation, knowledge base, community forums, and internal wikis simultaneously.
                </p>
                <ul class="text-label text-secondary space-y-2">
                    <li>✓ Docs + KB + Forums in one search</li>
                    <li>✓ Official docs prioritized</li>
                    <li>✓ Community answers secondary</li>
                    <li>✓ Unified search across teams</li>
                </ul>
            </div>

            <!-- Use Case 3: Digital Asset Management -->
            <div class="bg-greyscale-100 rounded-lg p-8">
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-3xl">📸</span>
                    <h3 class="text-main-body text-primary font-semibold">Digital Asset Management</h3>
                </div>
                <p class="text-sub-body text-secondary mb-6">
                    Search images, videos, documents, and metadata all in one unified interface.
                </p>
                <ul class="text-label text-secondary space-y-2">
                    <li>✓ Images + Videos + Documents</li>
                    <li>✓ Filter by asset type</li>
                    <li>✓ Metadata-based ranking</li>
                    <li>✓ Collection-specific sorting</li>
                </ul>
            </div>
        </div>
    </div>
</section>
```

---

## Product 4: Advanced-Search

### File: `/tmp/website/src/routes/products/advanced-search/+page.svelte`

```svelte
<script>
    import Main from '$lib/layouts/Main.svelte';
    import { DEFAULT_HOST } from '$lib/utils/metadata';
    import { TITLE_SUFFIX } from '$routes/titles';

    import { PreFooter, FooterNav, MainFooter } from '$lib/components';
    import Hero from './(components)/Hero.svelte';
    import Testimonials from '$lib/components/product-pages/testimonials.svelte';
    import Features from './(components)/features/Features.svelte';
    import UseCases from './(components)/UseCases.svelte';
    import Pricing from '$routes/(marketing)/(components)/pricing.svelte';

    const title = 'Advanced Search' + TITLE_SUFFIX;
    const description =
        'Geo, image, and vector search capabilities. Natural language processing, conversational AI, and semantic search for next-generation search experiences.';
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
    <meta name="keywords" content="vector search, semantic search, image search, geo search, NLP, AI search, conversational search" />

    <!-- Image -->
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:image" content={ogImage} />
    <meta name="twitter:card" content="summary_large_image" />

    <!-- Canonical -->
    <link rel="canonical" href="{DEFAULT_HOST}/products/advanced-search" />
</svelte:head>

<Main>
    <div class="overflow-hidden">
        <Hero />
        <div>
            <Features />
            <div class="bg-greyscale-50">
                <UseCases />
                <section class="web-u-sep-block-start py-20">
                    <div class="container">
                        <h3 class="text-headline-3 text-primary text-center mb-16">Code Example</h3>
                        <div class="max-w-4xl mx-auto bg-greyscale-900 rounded-lg p-8 overflow-x-auto">
                            <pre class="text-label text-greyscale-300"><code>{`// Vector Search - Semantic Similarity
const results = await client.collections('products').documents().search({
  q: 'wireless headphones with noise cancellation',
  query_by: 'embedding',
  vector_query: 'embedding:([], k:100)',
  exclude_fields: 'embedding'
});

// Geo Search - Find nearby stores
const nearbyStores = await client.collections('stores').documents().search({
  q: 'coffee shop',
  query_by: 'name',
  filter_by: 'location:(37.7749, -122.4194, 5 km)',
  sort_by: 'location(37.7749, -122.4194):asc'
});

// Image Search - Find by description
const imageResults = await client.collections('products').documents().search({
  q: 'red leather sofa',
  query_by: 'image_embedding',
  vector_query: 'image_embedding:([], k:50)'
});

// Natural Language Search - Parse complex queries
const nlResults = await fetch('/api/search/nl', {
  method: 'POST',
  body: JSON.stringify({
    q: 'Show me red sneakers under $100 from Nike',
    collection: 'products',
    nl_model_id: 'openai/gpt-4'
  })
});

// Conversational Search - RAG with context
const conversational = await fetch('/api/search/conversational', {
  method: 'POST',
  body: JSON.stringify({
    q: 'What are the best laptops for video editing?',
    collection: 'products',
    conversation_id: 'user-123-session-456',
    conversation_stream: false
  })
});`}</code></pre>
                        </div>
                    </div>
                </section>
                <Testimonials />
            </div>
        </div>
        <section class="web-u-sep-block-start -mt-8 py-40">
            <div class="container">
                <h4 class="text-label text-primary text-center">Related Products</h4>
                <ul
                    class="mt-8 grid gap-8"
                    style="grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr))"
                >
                    <li class="web-u-flex-basis-378">
                        <a
                            class="web-card is-normal"
                            href="/products/multi-search"
                            style="background: rgba(255, 255, 255, 0.04);"
                        >
                            <div
                                class="web-u-padding-inline-8 web-u-padding-block-end-8 flex flex-col gap-2"
                            >
                                <div class="flex items-center gap-2">
                                    <span class="text-2xl">🔍</span>
                                    <h4 class="text-main-body text-primary">Multi-Search</h4>
                                    <span class="web-icon-arrow-right ml-auto" aria-hidden="true"></span>
                                </div>
                                <p class="text-sub-body">
                                    Federated search across multiple collections.
                                </p>
                            </div>
                        </a>
                    </li>
                    <li class="web-u-flex-basis-378">
                        <a
                            class="web-card is-normal"
                            href="/products/merchandising"
                            style="background: rgba(255, 255, 255, 0.04);"
                        >
                            <div
                                class="web-u-padding-inline-8 web-u-padding-block-end-8 flex flex-col gap-2"
                            >
                                <div class="flex items-center gap-2">
                                    <span class="text-2xl">🎯</span>
                                    <h4 class="text-main-body text-primary">Merchandising</h4>
                                    <span class="web-icon-arrow-right ml-auto" aria-hidden="true"></span>
                                </div>
                                <p class="text-sub-body">
                                    Control search results with synonyms and overrides.
                                </p>
                            </div>
                        </a>
                    </li>
                    <li class="web-u-flex-basis-378">
                        <a
                            class="web-card is-normal"
                            href="/products/developer-tools"
                            style="background: rgba(255, 255, 255, 0.04);"
                        >
                            <div
                                class="web-u-padding-inline-8 web-u-padding-block-end-8 flex flex-col gap-2"
                            >
                                <div class="flex items-center gap-2">
                                    <span class="text-2xl">⚙️</span>
                                    <h4 class="text-main-body text-primary">Developer Tools</h4>
                                    <span class="web-icon-arrow-right ml-auto" aria-hidden="true"></span>
                                </div>
                                <p class="text-sub-body">
                                    APIs, SDKs, webhooks, and collection builder.
                                </p>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </section>
        <div class="border-smooth relative border-t">
            <Pricing class="mt-0" />
            <div class="container">
                <FooterNav />
                <MainFooter />
            </div>
        </div>
    </div>
</Main>
```

### File: `/tmp/website/src/routes/products/advanced-search/(components)/Hero.svelte`

```svelte
<div class="py-40 web-u-sep-block-end">
    <div class="container">
        <div class="text-center">
            <h1 class="text-headline-1 text-primary mb-8">Next-Generation Search</h1>
            <p class="text-main-body text-secondary max-w-3xl mx-auto mb-16">
                Go beyond text with semantic search, image recognition, and location-based discovery. Natural language
                processing and conversational AI for intuitive search experiences.
            </p>
            <div class="flex gap-4 justify-center flex-wrap">
                <a href="#features" class="web-button is-primary">Explore Features</a>
                <a href="/docs/products/advanced-search" class="web-button is-secondary">Read Docs</a>
            </div>
        </div>
        <div class="mt-16 rounded-lg overflow-hidden border border-greyscale-700">
            <img
                src="/images/products/advanced-search-hero.png"
                alt="Advanced Search dashboard"
                class="w-full h-auto"
                loading="lazy"
            />
        </div>
    </div>
</div>
```

### File: `/tmp/website/src/routes/products/advanced-search/(components)/features/Features.svelte`

```svelte
<section id="features" class="web-u-sep-block py-20">
    <div class="container">
        <h2 class="text-headline-2 text-primary text-center mb-20">AI-Powered Search Features</h2>

        <div class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <!-- Feature 1: Vector Search -->
            <div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-3xl">📊</span>
                    <h3 class="text-main-body text-primary font-semibold">Vector Search</h3>
                </div>
                <p class="text-sub-body text-secondary">
                    Semantic similarity search using embeddings. Find results based on meaning, not just keywords.
                </p>
            </div>

            <!-- Feature 2: Image Search -->
            <div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-3xl">🖼️</span>
                    <h3 class="text-main-body text-primary font-semibold">Image Search (CLIP)</h3>
                </div>
                <p class="text-sub-body text-secondary">
                    Search by text description or find similar images. Computer vision for product discovery.
                </p>
            </div>

            <!-- Feature 3: Geo Search -->
            <div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-3xl">🗺️</span>
                    <h3 class="text-main-body text-primary font-semibold">Geo Search</h3>
                </div>
                <p class="text-sub-body text-secondary">
                    Find results near a location. Radius, polygon, and bounding box queries with distance sorting.
                </p>
            </div>

            <!-- Feature 4: Natural Language Processing -->
            <div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-3xl">💬</span>
                    <h3 class="text-main-body text-primary font-semibold">Natural Language Search</h3>
                </div>
                <p class="text-sub-body text-secondary">
                    Parse complex queries in natural language. Extract filters, ranges, and intent automatically.
                </p>
            </div>

            <!-- Feature 5: Conversational AI -->
            <div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-3xl">🤖</span>
                    <h3 class="text-main-body text-primary font-semibold">Conversational Search (RAG)</h3>
                </div>
                <p class="text-sub-body text-secondary">
                    Multi-turn dialogue with context preservation. Retrieve facts from documents and generate answers.
                </p>
            </div>

            <!-- Feature 6: Hybrid Search -->
            <div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-3xl">⚙️</span>
                    <h3 class="text-main-body text-primary font-semibold">Hybrid Search</h3>
                </div>
                <p class="text-sub-body text-secondary">
                    Combine text and vector search. Configurable weighting between traditional and semantic search.
                </p>
            </div>

            <!-- Feature 7: Multiple Embedding Models -->
            <div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-3xl">🧠</span>
                    <h3 class="text-main-body text-primary font-semibold">Embedding Models</h3>
                </div>
                <p class="text-sub-body text-secondary">
                    Support for OpenAI, Sentence Transformers, E5, BGE, and custom ONNX models.
                </p>
            </div>

            <!-- Feature 8: Streaming Responses -->
            <div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-3xl">📡</span>
                    <h3 class="text-main-body text-primary font-semibold">Streaming Responses</h3>
                </div>
                <p class="text-sub-body text-secondary">
                    Real-time conversational responses. Stream text generation for better UX.
                </p>
            </div>
        </div>
    </div>
</section>
```

### File: `/tmp/website/src/routes/products/advanced-search/(components)/UseCases.svelte`

```svelte
<section class="web-u-sep-block py-20">
    <div class="container">
        <h2 class="text-headline-2 text-primary text-center mb-20">AI Search in Action</h2>

        <div class="grid gap-8 grid-cols-1 md:grid-cols-3">
            <!-- Use Case 1: Visual Commerce -->
            <div class="bg-greyscale-100 rounded-lg p-8">
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-3xl">👗</span>
                    <h3 class="text-main-body text-primary font-semibold">Visual Commerce</h3>
                </div>
                <p class="text-sub-body text-secondary mb-6">
                    Let customers find products by uploading photos or describing what they see.
                </p>
                <ul class="text-label text-secondary space-y-2">
                    <li>✓ Text-to-image search</li>
                    <li>✓ Image-to-image matching</li>
                    <li>✓ Visual similarity ranking</li>
                    <li>✓ Style-based discovery</li>
                </ul>
            </div>

            <!-- Use Case 2: Location Services -->
            <div class="bg-greyscale-100 rounded-lg p-8">
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-3xl">📍</span>
                    <h3 class="text-main-body text-primary font-semibold">Location Services</h3>
                </div>
                <p class="text-sub-body text-secondary mb-6">
                    "Find nearby" features with accurate distance calculations and proximity sorting.
                </p>
                <ul class="text-label text-secondary space-y-2">
                    <li>✓ Nearby stores/restaurants</li>
                    <li>✓ Distance-based ranking</li>
                    <li>✓ Service area coverage</li>
                    <li>✓ Regional filtering</li>
                </ul>
            </div>

            <!-- Use Case 3: AI Assistant -->
            <div class="bg-greyscale-100 rounded-lg p-8">
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-3xl">✨</span>
                    <h3 class="text-main-body text-primary font-semibold">AI Assistant</h3>
                </div>
                <p class="text-sub-body text-secondary mb-6">
                    Conversational product recommendations with contextual understanding.
                </p>
                <ul class="text-label text-secondary space-y-2">
                    <li>✓ Multi-turn conversations</li>
                    <li>✓ Context preservation</li>
                    <li>✓ Natural language understanding</li>
                    <li>✓ Fact-based answers</li>
                </ul>
            </div>
        </div>
    </div>
</section>
```

---

## Product 5: Developer-Tools

### File: `/tmp/website/src/routes/products/developer-tools/+page.svelte`

```svelte
<script>
    import Main from '$lib/layouts/Main.svelte';
    import { DEFAULT_HOST } from '$lib/utils/metadata';
    import { TITLE_SUFFIX } from '$routes/titles';

    import { PreFooter, FooterNav, MainFooter } from '$lib/components';
    import Hero from './(components)/Hero.svelte';
    import Testimonials from '$lib/components/product-pages/testimonials.svelte';
    import Features from './(components)/features/Features.svelte';
    import UseCases from './(components)/UseCases.svelte';
    import Pricing from '$routes/(marketing)/(components)/pricing.svelte';

    const title = 'Developer Tools' + TITLE_SUFFIX;
    const description =
        'APIs, SDKs, webhooks, and collection builder. Complete development toolkit for integrating AACSearch into your applications with automation and custom integrations.';
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
    <meta name="keywords" content="API, SDK, webhooks, REST API, collection builder, automation, integrations" />

    <!-- Image -->
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:image" content={ogImage} />
    <meta name="twitter:card" content="summary_large_image" />

    <!-- Canonical -->
    <link rel="canonical" href="{DEFAULT_HOST}/products/developer-tools" />
</svelte:head>

<Main>
    <div class="overflow-hidden">
        <Hero />
        <div>
            <Features />
            <div class="bg-greyscale-50">
                <UseCases />
                <section class="web-u-sep-block-start py-20">
                    <div class="container">
                        <h3 class="text-headline-3 text-primary text-center mb-16">Code Example</h3>
                        <div class="max-w-4xl mx-auto bg-greyscale-900 rounded-lg p-8 overflow-x-auto">
                            <pre class="text-label text-greyscale-300"><code>{`// Create API Key with Scoped Access
const apiKey = await payload.create({
  collection: 'api_keys',
  data: {
    tenant: 'tenant-123',
    label: 'Production Search Key',
    keyHash: hashApiKey(generatedKey),
    scopes: {
      collections: ['products', 'articles'],
      permissions: ['search', 'read']
    },
    expiresAt: new Date('2025-12-31'),
    isActive: true
  }
});

// Configure Webhook for Sync
const webhook = await payload.create({
  collection: 'webhooks',
  data: {
    url: 'https://myapp.com/webhooks/sync',
    events: [
      'document.created',
      'document.updated',
      'document.deleted'
    ],
    secret: generateWebhookSecret(),
    active: true
  }
});

// Handle Webhook
app.post('/webhooks/sync', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const isValid = verifyWebhookSignature(req.body, signature, secret);

  if (!isValid) return res.status(401).send('Invalid');

  const {event, data} = req.body;

  switch(event) {
    case 'document.created':
      console.log('New doc:', data.id);
      break;
    case 'document.updated':
      console.log('Updated doc:', data.id);
      break;
  }

  res.status(200).send('OK');
});

// Scheduled Job - Reindex Daily
const job = await payload.create({
  collection: 'scheduled_jobs',
  data: {
    name: 'daily-reindex',
    collection: 'products',
    schedule: '0 2 * * *',  // 2 AM daily
    action: 'reindex',
    active: true
  }
});`}</code></pre>
                        </div>
                    </div>
                </section>
                <Testimonials />
            </div>
        </div>
        <section class="web-u-sep-block-start -mt-8 py-40">
            <div class="container">
                <h4 class="text-label text-primary text-center">Related Products</h4>
                <ul
                    class="mt-8 grid gap-8"
                    style="grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr))"
                >
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
                                    <span class="text-2xl">🔐</span>
                                    <h4 class="text-main-body text-primary">Enterprise</h4>
                                    <span class="web-icon-arrow-right ml-auto" aria-hidden="true"></span>
                                </div>
                                <p class="text-sub-body">
                                    Security, compliance, and enterprise-grade features.
                                </p>
                            </div>
                        </a>
                    </li>
                    <li class="web-u-flex-basis-378">
                        <a
                            class="web-card is-normal"
                            href="/products/multi-search"
                            style="background: rgba(255, 255, 255, 0.04);"
                        >
                            <div
                                class="web-u-padding-inline-8 web-u-padding-block-end-8 flex flex-col gap-2"
                            >
                                <div class="flex items-center gap-2">
                                    <span class="text-2xl">🔍</span>
                                    <h4 class="text-main-body text-primary">Multi-Search</h4>
                                    <span class="web-icon-arrow-right ml-auto" aria-hidden="true"></span>
                                </div>
                                <p class="text-sub-body">
                                    Federated search across multiple collections.
                                </p>
                            </div>
                        </a>
                    </li>
                    <li class="web-u-flex-basis-378">
                        <a
                            class="web-card is-normal"
                            href="/products/advanced-search"
                            style="background: rgba(255, 255, 255, 0.04);"
                        >
                            <div
                                class="web-u-padding-inline-8 web-u-padding-block-end-8 flex flex-col gap-2"
                            >
                                <div class="flex items-center gap-2">
                                    <span class="text-2xl">🗺️</span>
                                    <h4 class="text-main-body text-primary">Advanced Search</h4>
                                    <span class="web-icon-arrow-right ml-auto" aria-hidden="true"></span>
                                </div>
                                <p class="text-sub-body">
                                    Geo, image, and vector search capabilities.
                                </p>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </section>
        <div class="border-smooth relative border-t">
            <Pricing class="mt-0" />
            <div class="container">
                <FooterNav />
                <MainFooter />
            </div>
        </div>
    </div>
</Main>
```

### File: `/tmp/website/src/routes/products/developer-tools/(components)/Hero.svelte`

```svelte
<div class="py-40 web-u-sep-block-end">
    <div class="container">
        <div class="text-center">
            <h1 class="text-headline-1 text-primary mb-8">Developer-Friendly Search</h1>
            <p class="text-main-body text-secondary max-w-3xl mx-auto mb-16">
                Powerful APIs, SDKs, and webhooks for seamless integration. Automate data syncing, manage collections
                with code, and build custom search experiences.
            </p>
            <div class="flex gap-4 justify-center flex-wrap">
                <a href="#features" class="web-button is-primary">Explore Features</a>
                <a href="/docs/products/developer-tools" class="web-button is-secondary">Read Docs</a>
            </div>
        </div>
        <div class="mt-16 rounded-lg overflow-hidden border border-greyscale-700">
            <img
                src="/images/products/developer-tools-hero.png"
                alt="Developer Tools dashboard"
                class="w-full h-auto"
                loading="lazy"
            />
        </div>
    </div>
</div>
```

### File: `/tmp/website/src/routes/products/developer-tools/(components)/features/Features.svelte`

```svelte
<section id="features" class="web-u-sep-block py-20">
    <div class="container">
        <h2 class="text-headline-2 text-primary text-center mb-20">Complete Developer Toolkit</h2>

        <div class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <!-- Feature 1: REST API -->
            <div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-3xl">🔌</span>
                    <h3 class="text-main-body text-primary font-semibold">REST API</h3>
                </div>
                <p class="text-sub-body text-secondary">
                    Complete REST API for search, CRUD operations, and management. JSON-based, well-documented, with
                    examples.
                </p>
            </div>

            <!-- Feature 2: SDKs -->
            <div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-3xl">📦</span>
                    <h3 class="text-main-body text-primary font-semibold">Multi-Language SDKs</h3>
                </div>
                <p class="text-sub-body text-secondary">
                    Official SDKs for JavaScript, Python, PHP, Go, Ruby, and more. Easy-to-use client libraries.
                </p>
            </div>

            <!-- Feature 3: Webhooks -->
            <div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-3xl">🪝</span>
                    <h3 class="text-main-body text-primary font-semibold">Webhooks</h3>
                </div>
                <p class="text-sub-body text-secondary">
                    Event-driven integrations. Get notified when documents change, searches happen, or errors occur.
                </p>
            </div>

            <!-- Feature 4: Collection Builder -->
            <div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-3xl">🏗️</span>
                    <h3 class="text-main-body text-primary font-semibold">Collection Builder</h3>
                </div>
                <p class="text-sub-body text-secondary">
                    Visual editor or code-first approach. Define schemas, field types, and indexing rules easily.
                </p>
            </div>

            <!-- Feature 5: API Keys & Scoping -->
            <div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-3xl">🔑</span>
                    <h3 class="text-main-body text-primary font-semibold">API Keys & Scoping</h3>
                </div>
                <p class="text-sub-body text-secondary">
                    Granular access control. Scope keys to specific collections, actions, and expiration dates.
                </p>
            </div>

            <!-- Feature 6: Rate Limiting -->
            <div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-3xl">⏱️</span>
                    <h3 class="text-main-body text-primary font-semibold">Rate Limiting</h3>
                </div>
                <p class="text-sub-body text-secondary">
                    Protect your API with configurable rate limits. Per-second, per-minute, per-hour, and daily
                    limits.
                </p>
            </div>

            <!-- Feature 7: Scheduled Jobs -->
            <div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-3xl">📅</span>
                    <h3 class="text-main-body text-primary font-semibold">Scheduled Jobs</h3>
                </div>
                <p class="text-sub-body text-secondary">
                    10 built-in automation tasks. Reindexing, analytics aggregation, data cleanup, and more.
                </p>
            </div>

            <!-- Feature 8: Integration Templates -->
            <div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-3xl">🎨</span>
                    <h3 class="text-main-body text-primary font-semibold">Integration Templates</h3>
                </div>
                <p class="text-sub-body text-secondary">
                    Pre-built connectors for Shopify, WooCommerce, Magento, WordPress, Contentful, and more.
                </p>
            </div>
        </div>
    </div>
</section>
```

### File: `/tmp/website/src/routes/products/developer-tools/(components)/UseCases.svelte`

```svelte
<section class="web-u-sep-block py-20">
    <div class="container">
        <h2 class="text-headline-2 text-primary text-center mb-20">Development Use Cases</h2>

        <div class="grid gap-8 grid-cols-1 md:grid-cols-3">
            <!-- Use Case 1: Custom Integration -->
            <div class="bg-greyscale-100 rounded-lg p-8">
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-3xl">🔗</span>
                    <h3 class="text-main-body text-primary font-semibold">Custom Integrations</h3>
                </div>
                <p class="text-sub-body text-secondary mb-6">
                    Connect proprietary systems and custom data sources with webhook handlers and API calls.
                </p>
                <ul class="text-label text-secondary space-y-2">
                    <li>✓ Custom API clients</li>
                    <li>✓ Data pipeline development</li>
                    <li>✓ Legacy system bridges</li>
                    <li>✓ Event-driven syncing</li>
                </ul>
            </div>

            <!-- Use Case 2: Real-time Sync -->
            <div class="bg-greyscale-100 rounded-lg p-8">
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-3xl">⚡</span>
                    <h3 class="text-main-body text-primary font-semibold">Real-time Synchronization</h3>
                </div>
                <p class="text-sub-body text-secondary mb-6">
                    Keep search index synchronized with your databases using webhooks and event streaming.
                </p>
                <ul class="text-label text-secondary space-y-2">
                    <li>✓ Database triggers</li>
                    <li>✓ Change data capture</li>
                    <li>✓ Event streaming</li>
                    <li>✓ Instant updates</li>
                </ul>
            </div>

            <!-- Use Case 3: Automation -->
            <div class="bg-greyscale-100 rounded-lg p-8">
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-3xl">🤖</span>
                    <h3 class="text-main-body text-primary font-semibold">Automation & Tasks</h3>
                </div>
                <p class="text-sub-body text-secondary mb-6">
                    Schedule recurring maintenance, data cleanup, indexing, and analytics aggregation.
                </p>
                <ul class="text-label text-secondary space-y-2">
                    <li>✓ Nightly reindexing</li>
                    <li>✓ Scheduled cleanup</li>
                    <li>✓ Analytics reporting</li>
                    <li>✓ Data retention policies</li>
                </ul>
            </div>
        </div>
    </div>
</section>
```

---

## Summary

All three remaining products follow the same structure as the completed examples:

1. **Directory Structure:**
   - `/src/routes/products/[product-name]/+page.svelte` (main page)
   - `/src/routes/products/[product-name]/(components)/Hero.svelte`
   - `/src/routes/products/[product-name]/(components)/features/Features.svelte`
   - `/src/routes/products/[product-name]/(components)/UseCases.svelte`

2. **Each has:** Hero section, 6-8 feature cards, 3 use case scenarios, code example, related products, and SEO metadata

3. **Total Files to Create:** 12 additional component files (3 products x 4 files each)

