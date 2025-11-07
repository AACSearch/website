<script lang="ts">
	import { TITLE_SUFFIX } from '$routes/titles';
	import { DEFAULT_HOST } from '$lib/utils/metadata';
	import { DocsArticle } from '$lib/layouts';
	import MainFooter from '$lib/components/MainFooter.svelte';

	const title = 'Introduction' + TITLE_SUFFIX;
	const description = 'Get to know AACSearch platform - an enterprise SaaS for intelligent search with multi-tenancy, integrations, and complete billing.';
	const ogImage = DEFAULT_HOST + '/images/open-graph/docs.png';

	const sections = [
		{ id: 'about', title: 'About AACSearch', href: '/docs/introduction/about' },
		{ id: 'features', title: 'Key Features', href: '/docs/introduction/features' },
		{ id: 'architecture', title: 'Architecture', href: '/docs/introduction/architecture' }
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

<DocsArticle {title} back="/docs">
	<svelte:fragment slot="metadata">
		<li>6 articles</li>
	</svelte:fragment>

	<div class="prose max-w-none dark:prose-invert">
		<p class="lead">
			Welcome to the AACSearch documentation. This section covers the fundamentals of the platform,
			its key features, and technical architecture.
		</p>

		<h2>Introduction Section</h2>

		<p>
			AACSearch is a professional SaaS platform designed for enterprise-level search management.
			Whether you're building search for an e-commerce platform, content management system, or any
			data-driven application, AACSearch provides everything you need.
		</p>

		<h3>What You'll Learn</h3>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
			{#each sections as section (section.id)}
				<a
					href={section.href}
					class="block p-6 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600 transition-all group"
					data-search-keyword="introduction"
				>
					<h4 class="font-semibold text-primary group-hover:text-blue-600 transition-colors mb-2">
						{section.title}
					</h4>
					<p class="text-sm text-slate-600 dark:text-slate-400">
						{#if section.id === 'about'}
							Learn about the platform philosophy, advantages, and deployment options
						{:else if section.id === 'features'}
							Explore intelligent search types, integrations, and advanced capabilities
						{:else if section.id === 'architecture'}
							Understand the technical architecture and technology stack
						{/if}
					</p>
				</a>
			{/each}
		</div>

		<h3>Key Highlights</h3>

		<ul>
			<li>
				<strong>Multi-tenant SaaS Architecture:</strong> Complete data isolation between organizations
				with individual billing and settings
			</li>
			<li>
				<strong>Intelligent Search:</strong> 6 types of search including full-text, vector, natural
				language, and conversational (RAG)
			</li>
			<li>
				<strong>10+ Ready Integrations:</strong> Direct connectors for WordPress, Shopify, Magento,
				Ghost, Strapi, Contentful, Sanity, Webflow, and more
			</li>
			<li>
				<strong>Complete Billing:</strong> Built-in Stripe integration with subscription management,
				invoicing, and customer portal
			</li>
			<li>
				<strong>Advanced Merchandising:</strong> Synonyms, overrides, pinning, and dynamic rules
				for complete control over search results
			</li>
			<li>
				<strong>Enterprise Features:</strong> GDPR compliance, audit logs, role-based access control,
				and security certifications
			</li>
		</ul>

		<h2>For Different Users</h2>

		<div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 my-8">
			<h3 class="mt-0">E-commerce Managers</h3>
			<p>
				Set up intelligent product search with autocomplete, faceted navigation, and merchandising
				in minutes without coding.
			</p>
		</div>

		<div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-6 my-8">
			<h3 class="mt-0">Content Platforms</h3>
			<p>
				Build semantic and conversational search across articles, documents, and media with automatic
				indexing from WordPress, Ghost, or Contentful.
			</p>
		</div>

		<div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6 my-8">
			<h3 class="mt-0">Developers</h3>
			<p>
				Access a comprehensive REST API, SDKs for major languages, and detailed documentation to
				build custom search solutions.
			</p>
		</div>

		<div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-6 my-8">
			<h3 class="mt-0">Administrators</h3>
			<p>
				Manage organizations, users, billing, security, and compliance with enterprise-grade tools
				and audit logging.
			</p>
		</div>

		<h2>Next Steps</h2>

		<p>
			Ready to get started? Here's where to go next:
		</p>

		<ul>
			<li>
				<a href="/docs/introduction/about">Learn about AACSearch</a> - understand the platform
				philosophy and key advantages
			</li>
			<li>
				<a href="/docs/introduction/features">Explore Features</a> - discover all search types,
				integrations, and capabilities
			</li>
			<li>
				<a href="/docs/quickstart/getting-started">Get Started in 30 minutes</a> - register an
				account and create your first search
			</li>
		</ul>
	</div>

	<MainFooter variant="docs" />
</DocsArticle>
