<script>
    import Main from '$lib/layouts/Main.svelte';
    import { DEFAULT_HOST } from '$lib/utils/metadata';
    import { TITLE_SUFFIX } from '$routes/titles';

    import { PreFooter, FooterNav, MainFooter } from '$lib/components';

    const title = 'AI Search' + TITLE_SUFFIX;
    const description =
        'Natural language, conversational, voice, and image search powered by AI. Advanced search capabilities including semantic understanding, auto-embedding, and intelligent query parsing.';
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
    <meta name="keywords" content="AI search, natural language search, conversational search, voice search, image search, semantic search, NLP" />
    <!-- Image -->
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:image" content={ogImage} />
    <meta name="twitter:card" content="summary_large_image" />
    <!-- Canonical -->
    <link rel="canonical" href="{DEFAULT_HOST}/products/ai-search" />
</svelte:head>

<Main>
    <div class="overflow-hidden">
        <!-- HERO SECTION -->
        <section class="web-hero is-full-width">
            <div class="container">
                <div class="web-hero-content">
                    <h1 class="web-title">AI Search</h1>
                    <p class="web-description">
                        Natural language, conversational, voice, and image search powered by AI. Let your users search the way they think.
                    </p>
                    <div class="web-hero-buttons">
                        <a href="/docs/products/ai-search" class="web-button is-primary">
                            <span class="text">Get Started</span>
                        </a>
                        <a href="/console" class="web-button is-secondary">
                            <span class="text">Try Demo</span>
                        </a>
                    </div>
                </div>
                <div class="web-hero-image">
                    <img
                        src="/images/products/ai-search-hero.png"
                        alt="AI Search"
                        width="600"
                        height="400"
                    />
                </div>
            </div>
        </section>

        <!-- FEATURES SECTION -->
        <section class="web-section">
            <div class="container">
                <h2 class="web-heading text-center">AI-Powered Search Capabilities</h2>
                <p class="text-center text-sub-body mb-12">
                    Advanced AI features for next-generation search experiences
                </p>

                <div class="grid gap-8" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))">
                    <!-- Feature 1: Natural Language Search -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/language.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Natural Language Search</h3>
                            <p class="text-sub-body mt-3">
                                Parse complex queries in everyday language. Automatically extract filters, interpret intent, and understand context without complex syntax.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Smart parsing:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Filter extraction</li>
                                    <li>- Intent detection</li>
                                    <li>- Range parsing</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 2: Conversational RAG -->
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
                                Multi-turn dialogue with context retention. RAG-powered responses that reference your actual data with streaming support for real-time answers.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">RAG Features:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Context memory</li>
                                    <li>- Streaming answers</li>
                                    <li>- Fact-based responses</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 3: Voice Search -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/microphone.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Voice Search</h3>
                            <p class="text-sub-body mt-3">
                                Enable voice-based queries with automatic speech-to-text and natural language understanding. Perfect for mobile and hands-free interfaces.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Audio processing:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Speech-to-text</li>
                                    <li>- Multi-language support</li>
                                    <li>- Noise cancellation</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 4: Image Search -->
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
                                CLIP-based visual search for finding products by image. Text-to-image and image-to-image matching for visual discovery experiences.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Vision capabilities:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Visual similarity</li>
                                    <li>- Reverse image search</li>
                                    <li>- Style-based matching</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 5: Auto-Embedding -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/vector.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Auto-Embedding</h3>
                            <p class="text-sub-body mt-3">
                                Automatic vector generation from text and images. Support for multiple embedding models including OpenAI, Sentence Transformers, and custom models.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Model support:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- OpenAI Ada</li>
                                    <li>- Custom ONNX models</li>
                                    <li>- Automatic sync</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 6: Semantic Understanding -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/brain.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Semantic Understanding</h3>
                            <p class="text-sub-body mt-3">
                                Deep contextual understanding of queries and documents. Find results based on meaning and intent, not just keyword matching.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Understanding features:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Synonym expansion</li>
                                    <li>- Intent classification</li>
                                    <li>- Context awareness</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 7: Multi-Modal Search -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/multimodal.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Multi-Modal Search</h3>
                            <p class="text-sub-body mt-3">
                                Combine text, voice, and image inputs in a single search interface. Provide multiple ways for users to express their intent.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Input modalities:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Text queries</li>
                                    <li>- Voice input</li>
                                    <li>- Image upload</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Feature 8: Query Refinement -->
                    <div class="web-card">
                        <div class="web-u-padding-inline-8 web-u-padding-block-end-8">
                            <img
                                src="/images/icons/refine.png"
                                alt=""
                                width="32"
                                height="32"
                                class="mb-4"
                            />
                            <h3 class="text-main-body">Query Refinement</h3>
                            <p class="text-sub-body mt-3">
                                Intelligent query suggestions and refinements. Help users reformulate queries for better results with contextual recommendations.
                            </p>
                            <div class="mt-4 space-y-2">
                                <p class="text-caption">Refinement options:</p>
                                <ul class="text-caption space-y-1 ml-4">
                                    <li>- Auto-suggestions</li>
                                    <li>- Query rewrites</li>
                                    <li>- Clarification requests</li>
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
                        <h3 class="text-main-body mb-3">E-Commerce Discovery</h3>
                        <p class="text-sub-body mb-4">
                            Enable customers to search products naturally. "Show me red leather jackets under $200 from Nike" works instantly with intelligent filter extraction and semantic matching.
                        </p>
                        <ul class="text-caption space-y-2 ml-4">
                            <li>- Natural product queries</li>
                            <li>- Voice-enabled search</li>
                            <li>- Image-based discovery</li>
                            <li>- Conversational recommendations</li>
                        </ul>
                    </div>

                    <!-- Use Case 2 -->
                    <div class="flex flex-col">
                        <h3 class="text-main-body mb-3">Customer Support & Help Centers</h3>
                        <p class="text-sub-body mb-4">
                            Build intelligent support chatbots that understand customer questions and retrieve relevant documentation. Multi-turn conversations preserve context for better answers.
                        </p>
                        <ul class="text-caption space-y-2 ml-4">
                            <li>- Natural language questions</li>
                            <li>- FAQ matching</li>
                            <li>- Conversational support</li>
                            <li>- Context-aware answers</li>
                        </ul>
                    </div>

                    <!-- Use Case 3 -->
                    <div class="flex flex-col">
                        <h3 class="text-main-body mb-3">Content & Knowledge Discovery</h3>
                        <p class="text-sub-body mb-4">
                            Help users find answers in documentation, blogs, and knowledge bases. Ask questions naturally and get AI-powered responses based on your actual content.
                        </p>
                        <ul class="text-caption space-y-2 ml-4">
                            <li>- Conversational queries</li>
                            <li>- Knowledge synthesis</li>
                            <li>- Multi-document search</li>
                            <li>- Context preservation</li>
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
                        <h3 class="text-main-body mb-4">1. Natural Language Search</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
// Natural language parsing
const response = await fetch(
  '/api/search/nl', {'{'}
    method: 'POST',
    body: JSON.stringify({'{'}
      q: 'red sneakers under $100',
      collection: 'products',
      nl_model_id: 'openai/gpt-4'
    {'}'}),
  {'}'}
);

// Automatically extracts:
// color: 'red', price_max: 100
// Refined query: 'sneakers'
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">2. Conversational Search (RAG)</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
// Multi-turn conversation
const response = await fetch(
  '/api/search/conversational', {'{'}
    method: 'POST',
    body: JSON.stringify({'{'}
      q: 'Best laptops?',
      collection: 'products',
      conversation_id: 'user-123',
      conversation_stream: true
    {'}'}),
  {'}'}
);

// Streams AI answers with
// facts from your database
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">3. Voice Search</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
// Record and search by voice
const mediaRecorder =
  new MediaRecorder(stream);

const audioBlob = await
  recordAudio(5000); // 5 seconds

const results = await fetch(
  '/api/search/voice', {'{'}
    method: 'POST',
    body: audioBlob,
    headers: {'{'}
      'Content-Type': 'audio/wav'
    {'}'}
  {'}'}
);
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">4. Image Search</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
// Search by image
const imageFile = document
  .getElementById('imageInput')
  .files[0];

const results = await client
  .collections('products')
  .documents()
  .search_by_image({'{'}
    file: imageFile,
    query_by: 'image_embedding',
    limit: 20
  {'}'}
);
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">5. Auto-Embedding</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
// Automatic embedding
const collection = {'{'}
  name: 'products',
  fields: [{'{'}
    name: 'embedding',
    type: 'float[]',
    embed: {'{'}
      from: ['title', 'desc'],
      model_config: {'{'}
        model_name:
          'ts/all-MiniLM-L12'
      {'}'}
    {'}'}
  {'}'}]
{'}'};
                        </code></pre>
                    </div>

                    <div>
                        <h3 class="text-main-body mb-4">6. Multi-Modal Search</h3>
                        <pre class="bg-greyscale-950 p-4 rounded overflow-x-auto"><code class="text-caption">
// Combine multiple inputs
const results = await client
  .search_multi_modal({'{'}
    text_query: 'shoes',
    image_query: imageFile,
    voice_query: audioBlob,
    collection: 'products',
    // All inputs combined for
    // comprehensive search
    limit: 20
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
                                    Enterprise-grade full-text search with advanced capabilities.
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
                                    Embeddable search and chat widgets with AI capabilities.
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
                                    Track search queries and AI-powered conversation metrics.
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
                                    Connect with 10+ platforms for seamless data sync.
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
