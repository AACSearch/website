<script>
    import Main from '$lib/layouts/Main.svelte';
    import { DEFAULT_HOST } from '$lib/utils/metadata';
    import { TITLE_SUFFIX } from '$routes/titles';

    import { PreFooter, FooterNav, MainFooter } from '$lib/components';

    const title = 'Widgets' + TITLE_SUFFIX;
    const description =
        'Embeddable search and chat widgets with full customization. White-label widgets for instant search integration with multiple embedding options and zero configuration.';
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
    <meta name="keywords" content="search widgets, chat widgets, embeddable widgets, white-label, search UI, customizable widgets" />
    <!-- Image -->
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:image" content={ogImage} />
    <meta name="twitter:card" content="summary_large_image" />
    <!-- Canonical -->
    <link rel="canonical" href="{DEFAULT_HOST}/products/widgets" />
</svelte:head>

<Main>
    <div class="overflow-hidden">
        <!-- HERO SECTION -->
        <section class="web-hero is-full-width">
            <div class="container">
                <div class="web-hero-content">
                    <h1 class="web-title">Widgets</h1>
                    <p class="web-description">
                        Embeddable search and chat widgets. Drop a single line of code and get a full-featured search experience in seconds.
                    </p>
                    <div class="web-hero-buttons">
                        <a href="/docs/products/widgets" class="web-button is-primary">
                            <span class="text">Get Started</span>
                        </a>
                        <a href="/console" class="web-button is-secondary">
                            <span class="text">Try Demo</span>
                        </a>
                    </div>
                </div>
                <div class="web-hero-image">
                    <img
                        src="/images/products/widgets-hero.png"
                        alt="Widgets"
                        width="600"
                        height="400"
                    />
                </div>
            </div>
        </section>

        <!-- FEATURES SECTION -->
        <section class="web-section">
            <div class="container">
                <h2 class="web-heading text-center">Ready-Made Search Components</h2>
                <p class="text-center text-sub-body mb-12">
                    Beautiful, functional widgets that work out of the box
                </p>

                <div class="grid gap-8" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))">
                    <!-- Feature 1: Search Widget -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/search-widget.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Search Widget</h3>
                            <p class="text-sub-body mt-3">
                                Full-featured search interface with autocomplete, facets, and filters. Fully responsive and works across all devices and browsers.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Features:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Auto-complete</li>
                                    <li>- Faceted navigation</li>
                                    <li>- Instant results</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 2: Chat Widget -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/chat-widget.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Chat Widget</h3>
                            <p class="text-sub-body mt-3">
                                Conversational search interface with message history and context retention. AI-powered responses that reference your data with streaming.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Chat features:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Multi-turn conversation</li>
                                    <li>- Streaming answers</li>
                                    <li>- Message history</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 3: White-Label -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/branding.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">White-Label</h3>
                            <p class="text-sub-body mt-3">
                                Complete branding control. Match your brand colors, fonts, and styling. Remove AACSearch branding for seamless integration.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Customization:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Color schemes</li>
                                    <li>- Custom fonts</li>
                                    <li>- Logo placement</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 4: Customizable UI -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/design.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Customizable UI</h3>
                            <p class="text-sub-body mt-3">
                                Configure every aspect of the widget interface. Choose layouts, themes, components, and behavior through configuration.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">UI customization:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Layout options</li>
                                    <li>- Component controls</li>
                                    <li>- Behavior settings</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 5: Multiple Embedding -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/embed.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Multiple Embedding Options</h3>
                            <p class="text-sub-body mt-3">
                                Embed as web component, React component, or iframe. Use in any framework or static HTML. Works with Vue, Angular, Svelte, and more.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Embedding:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Web components</li>
                                    <li>- React/Vue/Svelte</li>
                                    <li>- iFrame support</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 6: Responsive Design -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/responsive.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Responsive Design</h3>
                            <p class="text-sub-body mt-3">
                                Mobile-first design that adapts to any screen size. Optimized for touch and keyboard navigation on all devices.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Responsive features:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Mobile-optimized</li>
                                    <li>- Touch support</li>
                                    <li>- Adaptive layout</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 7: Analytics Integration -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/analytics.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Analytics Integration</h3>
                            <p class="text-sub-body mt-3">
                                Track widget usage automatically. See search queries, click patterns, and user behavior to optimize search performance.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Analytics:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Query tracking</li>
                                    <li>- Click tracking</li>
                                    <li>- User behavior</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 8: Easy Integration -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/plug.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Easy Integration</h3>
                            <p class="text-sub-body mt-3">
                                Single line of code to get started. No build process required. Configure via attributes or config objects.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Integration:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Zero config option</li>
                                    <li>- Attribute-based</li>
                                    <li>- Quick setup</li>
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
                        <h3 class="text-main-body mb-3">E-Commerce Platforms</h3>
                        <p class="text-sub-body mb-4">
                            Add powerful search to your online store instantly. Widget automatically indexes products and supports faceted search, filters, and instant results.
                        </p>
                        <ul class="text-caption space-y-2 ml-4">
                            <li>- Product search</li>
                            <li>- Autocomplete</li>
                            <li>- Faceted search</li>
                            <li>- Mobile-friendly</li>
                        </ul>
                    </div>

                    <!-- Use Case 2 -->
                    <div class="flex flex-col">
                        <h3 class="text-main-body mb-3">Help Centers & Support</h3>
                        <p class="text-sub-body mb-4">
                            Embed conversational search in your support site. Help customers find answers faster with natural language questions and AI-powered responses.
                        </p>
                        <ul class="text-caption space-y-2 ml-4">
                            <li>- Document search</li>
                            <li>- FAQ matching</li>
                            <li>- Conversational help</li>
                            <li>- Search analytics</li>
                        </ul>
                    </div>

                    <!-- Use Case 3 -->
                    <div class="flex flex-col">
                        <h3 class="text-main-body mb-3">Content Platforms</h3>
                        <p class="text-sub-body mb-4">
                            Help users discover content across your platform. Blog search, documentation finder, knowledge base explorer with beautiful, customizable interfaces.
                        </p>
                        <ul class="text-caption space-y-2 ml-4">
                            <li>- Blog search</li>
                            <li>- Content discovery</li>
                            <li>- Multi-collection</li>
                            <li>- White-label</li>
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
                        <h3 class="text-main-body mb-4">1. HTML Snippet</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
&lt;!-- Add to your HTML --&gt;
&lt;aacsearch-widget
  api-key="your-api-key"
  collection="products"
  theme="light"
  placeholder="Search products..."
&gt;&lt;/aacsearch-widget&gt;

&lt;script src=
  "https://cdn.aacsearch.com/widget.js"
&gt;&lt;/script&gt;
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">2. React Component</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
import {'{'}
  AACSearchWidget
{'}'} from '@aacsearch/react';

export default function App() {'{'}
  return (
    &lt;AACSearchWidget
      apiKey="your-api-key"
      collection="products"
      theme="dark"
      onSearch={(q) =&gt;
        console.log(q)
      }
    /&gt;
  );
{'}'}
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">3. Chat Widget</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
&lt;!-- Conversational search --&gt;
&lt;aacsearch-chat-widget
  api-key="your-api-key"
  collection="docs"
  model="openai/gpt-4"
  placeholder="Ask anything..."
  stream-responses="true"
&gt;&lt;/aacsearch-chat-widget&gt;

&lt;script src=
  "https://cdn.aacsearch.com/chat-widget.js"
&gt;&lt;/script&gt;
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">4. Customization Config</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
const config = {'{'}
  apiKey: 'your-api-key',
  collection: 'products',
  theme: {'{'}
    primary: '#007bff',
    background: '#ffffff'
  {'}'},
  ui: {'{'}
    showFacets: true,
    facetLimit: 5,
    resultsPerPage: 10
  {'}'},
  analytics: {'{'}
    enabled: true,
    trackClicks: true
  {'}'}
{'}'};

window.AACSearch.init(config);
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">5. White-Label</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
// Complete brand customization
const branding = {'{'}
  logo: 'https://my.com/logo.png',
  colors: {'{'}
    primary: '#ff5722',
    secondary: '#03a9f4'
  {'}'},
  fonts: {'{'}
    heading: 'Open Sans',
    body: 'Roboto'
  {'}'},
  hideBranding: true,
  customCSS: `
    .search-input {'{'}
      border-radius: 20px;
    {'}'}
  `
{'}'};
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">6. Analytics Events</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
// Listen to widget events
const widget = document
  .querySelector('aacsearch-widget');

widget.addEventListener(
  'search',
  (event) =&gt; {'{'}
    console.log(
      'Query:',
      event.detail.query
    );
  {'}'}
);

widget.addEventListener(
  'click',
  (event) =&gt; {'{'}
    console.log(
      'Clicked:',
      event.detail.result
    );
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
                                    Enterprise-grade search engine backing the widgets.
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
                                    Power widgets with natural language understanding.
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
                                    Track widget usage and search behavior.
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
                                    Connect widgets with your data sources.
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
