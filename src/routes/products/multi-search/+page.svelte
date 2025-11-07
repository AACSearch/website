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
		'Federated search across multiple collections and data sources. Query products, content, and reviews simultaneously with unified ranking and intelligent result merging.';
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
		content="multi-collection search, federated search, cross-collection search, unified ranking, multi-source search"
	/>

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
