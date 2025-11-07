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
		'REST API, SDKs, webhooks, and developer utilities. Complete development toolkit for integrating AACSearch into your applications with automation and custom integrations.';
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
		content="API, SDK, webhooks, REST API, collection builder, automation, integrations, developer tools"
	/>

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
						<h3 class="text-headline-3 text-primary text-center mb-16">Code Examples</h3>
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

// Scheduled Job - Reindex Daily
const job = await payload.create({
  collection: 'scheduled_jobs',
  data: {
    name: 'daily-reindex',
    collection: 'products',
    schedule: '0 2 * * *',
    action: 'reindex',
    active: true
  }
});

// Handle Webhook Events
app.post('/webhooks/sync', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const isValid = verifyWebhookSignature(req.body, signature, secret);

  if (!isValid) return res.status(401).send('Invalid');

  const {event, data} = req.body;
  console.log('Event:', event, 'Document:', data.id);
  res.status(200).send('OK');
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
