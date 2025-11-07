<script>
    import Main from '$lib/layouts/Main.svelte';
    import { DEFAULT_HOST } from '$lib/utils/metadata';
    import { TITLE_SUFFIX } from '$routes/titles';

    import { PreFooter, FooterNav, MainFooter } from '$lib/components';

    const title = 'Search Core' + TITLE_SUFFIX;
    const description =
        'Enterprise-grade full-text search engine. Advanced search capabilities including typo tolerance, stemming, semantic search, NL queries, and conversational RAG.';
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
    <!-- Image -->
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:image" content={ogImage} />
    <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<Main>
    <div class="overflow-hidden">
        <!-- HERO SECTION -->
        <section class="web-hero is-full-width">
            <div class="container">
                <div class="web-hero-content">
                    <h1 class="web-title">Search Core</h1>
                    <p class="web-description">
                        Enterprise-grade full-text search engine with advanced capabilities for sophisticated search experiences
                    </p>
                    <div class="web-hero-buttons">
                        <a href="/docs/products/search" class="web-button is-primary">
                            <span class="text">Get Started</span>
                        </a>
                        <a href="/console" class="web-button is-secondary">
                            <span class="text">Try Demo</span>
                        </a>
                    </div>
                </div>
                <div class="web-hero-image">
                    <img
                        src="/images/products/search-core-hero.png"
                        alt="Search Core"
                        width="600"
                        height="400"
                    />
                </div>
            </div>
        </section>

        <!-- FEATURES SECTION -->
        <section class="web-section">
            <div class="container">
                <h2 class="web-heading text-center">Powerful Search Features</h2>
                <p class="text-center text-sub-body mb-12">
                    Advanced search capabilities for enterprise-level requirements
                </p>

                <div class="grid gap-8" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))">
                    <!-- Feature 1: Full-Text Search -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/search.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Full-Text Search</h3>
                            <p class="text-sub-body mt-3">
                                Comprehensive text indexing and retrieval with support for multiple languages. Find exactly what you're looking for across all your data.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Key features:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Typo tolerance</li>
                                    <li>- Prefix matching</li>
                                    <li>- 30+ language support</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 2: Typo Tolerance -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/auto-correct.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Typo Tolerance</h3>
                            <p class="text-sub-body mt-3">
                                Automatic spelling correction with configurable sensitivity levels. Search "ipone" and find "iPhone" results.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Capabilities:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- 0-2 typo allowance</li>
                                    <li>- Smart correction</li>
                                    <li>- Language-aware</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 3: Semantic & Vector Search -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/vector.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Semantic Search</h3>
                            <p class="text-sub-body mt-3">
                                Vector embeddings and semantic understanding. Search by meaning, not just keywords. Supports hybrid search combining text and vectors.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Integration:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- OpenAI Ada-002</li>
                                    <li>- Sentence Transformers</li>
                                    <li>- Custom ONNX models</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 4: Natural Language Search -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/language.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">NL Search</h3>
                            <p class="text-sub-body mt-3">
                                Natural language queries with automatic filter extraction. "Show me red sneakers under $100 from Nike" works out of the box.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Intelligent parsing:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Auto filter extraction</li>
                                    <li>- Intent detection</li>
                                    <li>- Multi-language</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 5: Conversational RAG -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/chat.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Conversational Search</h3>
                            <p class="text-sub-body mt-3">
                                RAG-powered dialogue with context retention. Ask follow-up questions and get intelligent answers based on your data with streaming support.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">LLM Support:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- GPT-4, Claude, Llama</li>
                                    <li>- Stream responses</li>
                                    <li>- Conversation memory</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 6: Image Search -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/image.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Image Search</h3>
                            <p class="text-sub-body mt-3">
                                CLIP-based visual search. Find products by photo or text description. Image-to-image and text-to-image similarity matching.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Capabilities:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Visual similarity</li>
                                    <li>- Reverse image search</li>
                                    <li>- Content moderation</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 7: Geo Search -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/location.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Geo Search</h3>
                            <p class="text-sub-body mt-3">
                                Location-based filtering and sorting. Find nearby stores, restaurants, or services with radius, polygon, and bounding box searches.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Query types:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Radius search</li>
                                    <li>- Polygon search</li>
                                    <li>- Distance sorting</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 8: Advanced Relevance -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/ranking.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Advanced Ranking</h3>
                            <p class="text-sub-body mt-3">
                                Customizable ranking algorithms with field-level weights. Sort by relevance, popularity, freshness, and custom metrics simultaneously.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Ranking control:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Field weighting</li>
                                    <li>- Multi-sort support</li>
                                    <li>- Custom scoring</li>
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
                        <h3 class="text-main-body mb-3">E-commerce Platforms</h3>
                        <p class="text-sub-body mb-4">
                            Power product discovery with typo tolerance, faceted search, and semantic understanding. Handle complex queries like "red leather jackets on sale under $200" with ease.
                        </p>
                        <ul class="text-caption space-y-2 ml-4">
                            <li>- Product recommendation</li>
                            <li>- Fast auto-complete</li>
                            <li>- Price range filters</li>
                            <li>- Smart sorting</li>
                        </ul>
                    </div>

                    <!-- Use Case 2 -->
                    <div class="flex flex-col">
                        <h3 class="text-main-body mb-3">Knowledge Bases & Documentation</h3>
                        <p class="text-sub-body mb-4">
                            Help users find answers quickly across documentation, FAQs, and support articles. Conversational search lets users ask questions naturally and get detailed answers.
                        </p>
                        <ul class="text-caption space-y-2 ml-4">
                            <li>- Full-text indexing</li>
                            <li>- NL queries</li>
                            <li>- RAG-powered answers</li>
                            <li>- Multi-language docs</li>
                        </ul>
                    </div>

                    <!-- Use Case 3 -->
                    <div class="flex flex-col">
                        <h3 class="text-main-body mb-3">Location-Based Services</h3>
                        <p class="text-sub-body mb-4">
                            Build location-aware applications with radius and polygon search. Find nearby stores, restaurants, hotels, or services sorted by distance and relevance.
                        </p>
                        <ul class="text-caption space-y-2 ml-4">
                            <li>- Proximity search</li>
                            <li>- Distance ranking</li>
                            <li>- Multi-location filtering</li>
                            <li>- Real-time updates</li>
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
                        <h3 class="text-main-body mb-4">1. Basic Full-Text Search</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
// JavaScript SDK
const results = await client
  .collections('products')
  .documents()
  .search({'{'}
    q: 'wireless headphones',
    query_by: 'title,description',
    limit: 10
  {'}'});
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">2. Search with Typo Tolerance</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
const results = await client
  .collections('products')
  .documents()
  .search({'{'}
    q: 'labtop',  // typo
    query_by: 'title',
    typo_tolerance: 'enabled',
    num_typos: 2
  {'}'});
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">3. Semantic Vector Search</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
const results = await client
  .collections('products')
  .documents()
  .search({'{'}
    q: 'gaming laptop',
    query_by: 'embedding',
    vector_query:
      'embedding:([], k:50)',
    limit: 10
  {'}'});
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">4. Natural Language Query</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
const response =
  await fetch('/api/search/nl', {'{'}
    method: 'POST',
    body: JSON.stringify({'{'}
      q: 'red sneakers under $100',
      collection: 'products'
    {'}'}),
  {'}'});
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">5. Conversational Search</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
const response =
  await fetch('/api/search/conversational', {'{'}
    method: 'POST',
    body: JSON.stringify({'{'}
      q: 'Best laptops for video editing?',
      conversation_stream: true
    {'}'}),
  {'}'});
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">6. Geo-Location Search</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
const results = await client
  .collections('stores')
  .documents()
  .search({'{'}
    q: 'coffee shop',
    filter_by:
      'location:(37.77, -122.41, 5 km)',
    sort_by:
      'location(37.77, -122.41):asc'
  {'}'});
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
                                    Natural language, conversational, voice, and image search powered by AI.
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
                                    Connect with 10+ platforms including Shopify, WordPress, and Contentful.
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
                                    Search insights, metrics, and performance tracking.
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
                                    Embeddable search and chat widgets for seamless integration.
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
