<script lang="ts">
	import { TITLE_SUFFIX } from '$routes/titles';
	import { DEFAULT_HOST } from '$lib/utils/metadata';
	import { DocsArticle } from '$lib/layouts';
	import MainFooter from '$lib/components/MainFooter.svelte';

	const title = 'Quick Start Guide' + TITLE_SUFFIX;
	const description = 'Get started with AACSearch in 30 minutes. Register, create a collection, set up search, and integrate with your site.';
	const ogImage = DEFAULT_HOST + '/images/open-graph/docs.png';

	const articles = [
		{
			number: '1',
			title: 'Getting Started',
			description: 'Register account, create organization, set up billing',
			time: '10 min',
			href: '/docs/quickstart/getting-started'
		},
		{
			number: '2',
			title: 'First Collection',
			description: 'Create collection, define schema, import data',
			time: '5 min',
			href: '/docs/quickstart/first-collection'
		},
		{
			number: '3',
			title: 'First Search Query',
			description: 'Test search, configure filters, optimize relevance',
			time: '5 min',
			href: '/docs/quickstart/first-search'
		}
	];
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta name="twitter:title" content={title} />
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<meta name="twitter:description" content={description} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<DocsArticle title="Quick Start Guide" back="/docs">
	<svelte:fragment slot="metadata">
		<li>3 articles</li>
		<li>30 minutes total</li>
	</svelte:fragment>

	<div class="prose max-w-none dark:prose-invert">
		<p class="lead">
			Get up and running with AACSearch in just 30 minutes. This guide walks you through account
			setup, creating your first search collection, and testing it out.
		</p>

		<h2>What You'll Learn</h2>

		<p>By the end of this guide, you'll be able to:</p>

		<ul>
			<li>Create an AACSearch account and organization</li>
			<li>Choose and configure a billing plan</li>
			<li>Create your first search collection</li>
			<li>Define data schema and import documents</li>
			<li>Execute search queries and configure filters</li>
			<li>Get API keys for integration</li>
			<li>Integrate search into a web application</li>
		</ul>

		<h2>30-Minute Quick Start Path</h2>

		<div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 my-8">
			<h3 class="mt-0 text-primary">Fastest Path to Working Search</h3>
			<p>
				If you're short on time, follow this minimal path to get a working search in 30 minutes:
			</p>
			<ol class="space-y-2">
				<li><strong>Minute 0-3:</strong> Register account at app.aacsearch.com</li>
				<li><strong>Minute 3-5:</strong> Create organization (tenant)</li>
				<li><strong>Minute 5-8:</strong> Choose Free plan (no credit card needed)</li>
				<li><strong>Minute 8-13:</strong> Create collection with sample data</li>
				<li><strong>Minute 13-18:</strong> Test search in the UI</li>
				<li><strong>Minute 18-20:</strong> Get API key from settings</li>
				<li><strong>Minute 20-30:</strong> Integrate search on your site</li>
			</ol>
		</div>

		<h2>Step-by-Step Sections</h2>

		<div class="space-y-4 my-8">
			{#each articles as article (article.number)}
				<a
					href={article.href}
					class="block p-6 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600 transition-all group hover:bg-slate-50 dark:hover:bg-slate-900/50"
					data-search-keyword="quickstart"
				>
					<div class="flex items-start gap-4">
						<div
							class="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold"
						>
							{article.number}
						</div>
						<div class="flex-1">
							<h3
								class="font-semibold text-primary group-hover:text-blue-600 transition-colors mt-0 mb-1"
							>
								{article.title}
							</h3>
							<p class="text-sm text-slate-600 dark:text-slate-400 mb-2">
								{article.description}
							</p>
							<div class="flex items-center gap-4">
								<span class="text-xs font-medium text-slate-500 dark:text-slate-400">
									{article.time}
								</span>
								<span
									class="text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors"
								>
									Read more →
								</span>
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>

		<h2>What You Need</h2>

		<p>To follow this guide, you'll need:</p>

		<ul>
			<li>A web browser (Chrome, Firefox, Safari, or Edge)</li>
			<li>An email address for registration</li>
			<li>A valid credit card (for paid plans, optional)</li>
		</ul>

		<h2>Free Plan Includes</h2>

		<p>
			The Free plan is perfect for testing AACSearch. No credit card required, no time limits.
		</p>

		<ul>
			<li>1,000 documents per collection</li>
			<li>1,000 search queries per day</li>
			<li>Up to 3 collections</li>
			<li>Full search features (no feature limitations)</li>
			<li>Community support</li>
		</ul>

		<h2>Sample Data to Use</h2>

		<p>
			For this guide, we'll use a sample e-commerce product dataset. You can use the JSON below or
			bring your own data:
		</p>

		<pre><code class="language-json">{`[
  {
    "id": "prod-1",
    "title": "Wireless Headphones",
    "description": "Premium noise-cancelling wireless headphones",
    "price": 199.99,
    "category": "Electronics",
    "stock": 45
  },
  {
    "id": "prod-2",
    "title": "USB-C Cable",
    "description": "High-quality 2-meter USB-C charging cable",
    "price": 12.99,
    "category": "Accessories",
    "stock": 250
  },
  {
    "id": "prod-3",
    "title": "Laptop Stand",
    "description": "Adjustable aluminum laptop stand for desk",
    "price": 49.99,
    "category": "Office",
    "stock": 120
  }
]`}</code></pre>

		<h2>Estimated Timeline</h2>

		<p>Here's how the 30 minutes breaks down:</p>

		<table class="w-full my-8">
			<thead>
				<tr class="border-b border-slate-200 dark:border-slate-700">
					<th class="text-left py-3 px-4 font-semibold">Activity</th>
					<th class="text-right py-3 px-4 font-semibold">Time</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border-b border-slate-100 dark:border-slate-800">
					<td class="py-3 px-4">Account registration & email verification</td>
					<td class="text-right py-3 px-4">5 min</td>
				</tr>
				<tr class="border-b border-slate-100 dark:border-slate-800">
					<td class="py-3 px-4">Create organization & choose plan</td>
					<td class="text-right py-3 px-4">5 min</td>
				</tr>
				<tr class="border-b border-slate-100 dark:border-slate-800">
					<td class="py-3 px-4">Create collection & define schema</td>
					<td class="text-right py-3 px-4">5 min</td>
				</tr>
				<tr class="border-b border-slate-100 dark:border-slate-800">
					<td class="py-3 px-4">Import sample data</td>
					<td class="text-right py-3 px-4">3 min</td>
				</tr>
				<tr class="border-b border-slate-100 dark:border-slate-800">
					<td class="py-3 px-4">Test search & configure settings</td>
					<td class="text-right py-3 px-4">4 min</td>
				</tr>
				<tr class="border-b border-slate-100 dark:border-slate-800">
					<td class="py-3 px-4">Get API key & basic integration</td>
					<td class="text-right py-3 px-4">3 min</td>
				</tr>
				<tr>
					<td class="py-3 px-4 font-semibold">Total</td>
					<td class="text-right py-3 px-4 font-semibold">25 min</td>
				</tr>
			</tbody>
		</table>

		<p class="text-sm text-slate-600 dark:text-slate-400">
			This leaves 5 minutes of buffer for unexpected delays or trying different features.
		</p>

		<h2>Next Step: Getting Started</h2>

		<p>
			Ready to begin? Start with the first article in this guide to set up your account and
			organization.
		</p>

		<a
			href="/docs/quickstart/getting-started"
			class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors mt-4"
		>
			Start Getting Started <span>→</span>
		</a>
	</div>

	<MainFooter variant="docs" />
</DocsArticle>
