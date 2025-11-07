<script lang="ts">
	import { TITLE_SUFFIX } from '$routes/titles';
	import { DEFAULT_HOST } from '$lib/utils/metadata';
	import { DocsArticle } from '$lib/layouts';
	import MainFooter from '$lib/components/MainFooter.svelte';

	const title = 'About AACSearch' + TITLE_SUFFIX;
	const description = 'Learn about AACSearch - a modern SaaS platform for enterprise search management with multi-tenancy, security, and complete billing integration.';
	const ogImage = DEFAULT_HOST + '/images/open-graph/docs.png';
	const readtime = '8';
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

<DocsArticle title="About AACSearch" back="/docs/introduction">
	<svelte:fragment slot="metadata">
		<li>{readtime} min</li>
		<li>Updated Nov 2, 2025</li>
	</svelte:fragment>

	<div class="prose max-w-none dark:prose-invert">
		<p class="lead">
			AACSearch is a modern, cloud-native SaaS platform designed for creating, managing, and scaling
			intelligent search solutions at the enterprise level.
		</p>

		<h2>What is AACSearch?</h2>

		<p>
			Unlike traditional search solutions that require extensive setup and maintenance, AACSearch
			provides everything out-of-the-box:
		</p>

		<ul>
			<li>
				<strong>Multi-tenant SaaS Architecture:</strong> Complete data isolation with individual settings
				and billing
			</li>
			<li>
				<strong>Intelligent Search Engine:</strong> 6 types of search including full-text, vector,
				semantic, NL, RAG, and geo-search
			</li>
			<li>
				<strong>Ready-made Integrations:</strong> 10+ connectors for WordPress, Shopify, Magento, Ghost,
				and more
			</li>
			<li>
				<strong>Complete Billing System:</strong> Built-in Stripe integration with subscriptions and
				invoicing
			</li>
			<li>
				<strong>Enterprise Features:</strong> GDPR compliance, audit logs, RBAC, and security
				certifications
			</li>
			<li>
				<strong>Advanced Analytics:</strong> Detailed search analytics, click tracking, and A/B testing
			</li>
		</ul>

		<h2>Core Philosophy</h2>

		<h3>Simplicity First</h3>
		<p>
			No need to be a search engineer. Visual wizards and smart defaults let non-technical users
			set up powerful search in minutes.
		</p>

		<h3>Performance at Scale</h3>
		<p>
			Search queries complete in under 50ms (p95). Automatically scales from thousands to millions
			of documents without manual intervention.
		</p>

		<h3>Security by Default</h3>
		<p>
			All data encrypted in transit and at rest. GDPR, SOC 2, and ISO 27001 compliant. Complete
			audit trail of all operations.
		</p>

		<h3>Flexibility & Control</h3>
		<p>
			API-first architecture means everything is programmable. White-label mode for full rebranding.
			Custom integrations through webhooks and SDKs.
		</p>

		<h2>Multi-tenancy Model</h2>

		<p>
			AACSearch uses strict multi-tenancy isolation at the database level:
		</p>

		<pre>
┌─────────────────────────────────────────┐
│      AACSearch Platform                 │
├─────────────┬──────────────────────────┤
│ Tenant A    │    Tenant B              │
│ ├─ Users    │    ├─ Users              │
│ ├─ Colls    │    ├─ Colls              │
│ ├─ API Keys │    ├─ API Keys           │
│ └─ Billing  │    └─ Billing            │
└─────────────┴──────────────────────────┘
		</pre>

		<p>
			This means each organization (tenant) is completely isolated from others, with:
		</p>

		<ul>
			<li>Own database schema and data</li>
			<li>Separate user management and roles</li>
			<li>Individual API keys and rate limits</li>
			<li>Independent billing and subscriptions</li>
			<li>Custom settings and branding</li>
		</ul>

		<h2>Key Advantages</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
			<div class="p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
				<h3 class="text-primary font-semibold mt-0">No Infrastructure Required</h3>
				<p>
					Fully managed cloud platform. No servers to maintain, no databases to manage, no deployments
					to coordinate.
				</p>
			</div>

			<div class="p-6 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700">
				<h3 class="text-primary font-semibold mt-0">Lower Costs</h3>
				<p>
					Pay only for what you use. No setup fees, no minimum commitments. Start free and scale as your
					needs grow.
				</p>
			</div>

			<div class="p-6 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
				<h3 class="text-primary font-semibold mt-0">Faster Time to Market</h3>
				<p>
					Pre-built integrations and templates let you launch search in hours instead of weeks or months.
				</p>
			</div>

			<div class="p-6 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700">
				<h3 class="text-primary font-semibold mt-0">Enterprise Grade</h3>
				<p>
					GDPR, SOC 2, and ISO 27001 certified. 99.99% uptime SLA. Dedicated support for enterprise
					customers.
				</p>
			</div>

			<div class="p-6 rounded-lg bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-700">
				<h3 class="text-primary font-semibold mt-0">Comprehensive Platform</h3>
				<p>
					Everything integrated: search engine, billing, analytics, integrations, and admin tools in one
					place.
				</p>
			</div>

			<div class="p-6 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700">
				<h3 class="text-primary font-semibold mt-0">API-First Design</h3>
				<p>
					Everything is accessible via REST API. Build custom solutions, automate workflows, and
					integrate seamlessly.
				</p>
			</div>
		</div>

		<h2>Use Cases</h2>

		<h3>E-commerce</h3>
		<p>
			Boost conversion with intelligent product search, autocomplete, faceted navigation, and merchandising.
			Support multiple stores with separate tenants.
		</p>

		<h3>Content & Publishing</h3>
		<p>
			Index articles, documents, and media. Offer semantic and conversational search. Direct integrations
			with WordPress, Ghost, and Contentful.
		</p>

		<h3>SaaS Platforms</h3>
		<p>
			Embed search for your customers. White-label mode hides AACSearch branding. Multi-tenant architecture
			keeps customer data isolated.
		</p>

		<h3>Enterprise Organizations</h3>
		<p>
			Corporate search for documents, knowledge bases, and internal data. On-premise or self-hosted deployment
			options. Compliance certifications included.
		</p>

		<h2>Technology Stack</h2>

		<p>Built on modern, proven technologies:</p>

		<ul>
			<li><strong>Backend:</strong> Node.js + TypeScript (strict mode)</li>
			<li><strong>Frontend:</strong> React 19 + Server Components</li>
			<li><strong>Database:</strong> PostgreSQL 15+ with replication</li>
			<li><strong>Search Engine:</strong> Open-source high-performance engine</li>
			<li><strong>Cache:</strong> Redis 7+ (cluster)</li>
			<li><strong>Queue:</strong> Bull (Redis-based)</li>
			<li><strong>Payments:</strong> Stripe API</li>
			<li><strong>Deployment:</strong> Docker + Kubernetes</li>
		</ul>

		<h2>Deployment Options</h2>

		<h3>Cloud (SaaS) - Recommended</h3>
		<p>
			Use AACSearch's managed infrastructure. Automatic updates, 99.9% uptime SLA, global CDN, 24/7
			monitoring.
		</p>

		<h3>Self-hosted</h3>
		<p>
			Deploy on your infrastructure using Docker or Kubernetes. Full control over data residency,
			backups, and configuration.
		</p>

		<h3>Hybrid</h3>
		<p>
			Keep data on-premise while using AACSearch's cloud for search indexing and UI. Best of both worlds.
		</p>

		<h2>Next Steps</h2>

		<ul>
			<li>
				<a href="/docs/introduction/features">Explore Key Features</a> - learn about search types,
				integrations, and capabilities
			</li>
			<li>
				<a href="/docs/introduction/architecture">Understand Architecture</a> - dive into technical
				design
			</li>
			<li>
				<a href="/docs/quickstart/getting-started">Get Started in 30 Minutes</a> - register and create
				your first search
			</li>
		</ul>
	</div>

	<MainFooter variant="docs" />
</DocsArticle>
