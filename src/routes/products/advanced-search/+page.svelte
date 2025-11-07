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
		'Geo, image, and vector search for specialized use cases. Natural language processing, conversational AI, and semantic search for next-generation search experiences.';
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
	<meta
		name="keywords"
		content="vector search, semantic search, image search, geo search, NLP, AI search, conversational search, CLIP"
	/>

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
						<h3 class="text-headline-3 text-primary text-center mb-16">Code Examples</h3>
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
