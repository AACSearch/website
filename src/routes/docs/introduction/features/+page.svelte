<script lang="ts">
	import { TITLE_SUFFIX } from '$routes/titles';
	import { DEFAULT_HOST } from '$lib/utils/metadata';
	import { DocsArticle } from '$lib/layouts';
	import MainFooter from '$lib/components/MainFooter.svelte';

	const title = 'Key Features' + TITLE_SUFFIX;
	const description = 'Explore AACSearch features: 6 search types, integrations, analytics, merchandising, and enterprise capabilities for intelligent search at scale.';
	const ogImage = DEFAULT_HOST + '/images/open-graph/docs.png';
	const readtime = '12';
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

<DocsArticle title="Key Features" back="/docs/introduction">
	<svelte:fragment slot="metadata">
		<li>{readtime} min</li>
		<li>Updated Nov 2, 2025</li>
	</svelte:fragment>

	<div class="prose max-w-none dark:prose-invert">
		<p class="lead">
			AACSearch provides a comprehensive suite of features for building powerful search experiences,
			from basic full-text search to advanced AI-powered conversational search.
		</p>

		<h2>6 Types of Intelligent Search</h2>

		<h3>1. Full-Text Search</h3>
		<p>
			Classic keyword matching with intelligent enhancements:
		</p>
		<ul>
			<li><strong>Typo Tolerance:</strong> Auto-correct user typos</li>
			<li><strong>Stemming:</strong> Match word variations (run, running, runs)</li>
			<li><strong>Synonyms:</strong> "sneakers" matches "shoes" and "kicks"</li>
			<li><strong>Prefix Search:</strong> "lapt" finds "laptop"</li>
			<li><strong>Faceted Navigation:</strong> Filter by category, price, etc.</li>
		</ul>

		<h3>2. Vector & Semantic Search</h3>
		<p>
			Understand meaning, not just keywords:
		</p>
		<ul>
			<li><strong>Semantic Understanding:</strong> "comfortable footwear" finds running shoes</li>
			<li><strong>Multilingual:</strong> Search in one language, find results in another</li>
			<li><strong>Image Search:</strong> Find similar products by image</li>
			<li><strong>Hybrid Search:</strong> Combine full-text and vector for best results</li>
		</ul>

		<div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-6 my-6">
			<p class="my-0">
				<strong>Use case:</strong> E-commerce customer searches "lightweight laptop" and finds exactly
				what they need, even if the product description uses different words.
			</p>
		</div>

		<h3>3. Natural Language Search (NL Search)</h3>
		<p>
			Query in natural language instead of keywords:
		</p>
		<ul>
			<li><strong>Plain English:</strong> "Show me red shoes under $100"</li>
			<li><strong>Auto Filter Extraction:</strong> Extracts color, price, category from query</li>
			<li><strong>Intent Recognition:</strong> Understands what user really wants</li>
			<li><strong>Question Answering:</strong> "Which laptop is best for video editing?"</li>
		</ul>

		<h3>4. Conversational Search (RAG)</h3>
		<p>
			Chat-like interface with search context:
		</p>
		<ul>
			<li><strong>Multi-turn Conversations:</strong> Remember context across questions</li>
			<li><strong>Source Attribution:</strong> See which documents the answers come from</li>
			<li><strong>Streaming Responses:</strong> Get answers in real-time as they're generated</li>
			<li><strong>Custom Prompts:</strong> Tailor responses for your use case</li>
		</ul>

		<div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6 my-6">
			<p class="my-0">
				<strong>Use case:</strong> Customer support chatbot that finds relevant docs and provides
				accurate answers with source links.
			</p>
		</div>

		<h3>5. Image Search</h3>
		<p>
			Find products by visual similarity:
		</p>
		<ul>
			<li><strong>Image-to-Text:</strong> Upload photo, search by description</li>
			<li><strong>Image-to-Image:</strong> Find similar products by photo</li>
			<li><strong>Visual Similarity:</strong> Match based on visual characteristics</li>
			<li><strong>CLIP Technology:</strong> Advanced vision-language models</li>
		</ul>

		<h3>6. Geo Search</h3>
		<p>
			Location-based search and filtering:
		</p>
		<ul>
			<li><strong>Radius Search:</strong> "Find stores within 5km"</li>
			<li><strong>Distance Sorting:</strong> Nearest stores first</li>
			<li><strong>Polygon Search:</strong> Search within custom boundaries</li>
			<li><strong>Map Integration:</strong> Visual search results on maps</li>
		</ul>

		<h2>Ready-Made Integrations</h2>

		<h3>E-commerce Platforms</h3>

		<div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
			{#each [
				{ name: 'Shopify', icon: '🛒' },
				{ name: 'WooCommerce', icon: '📦' },
				{ name: 'Magento', icon: '⚙️' },
				{ name: 'BigCommerce', icon: '🌐' }
			] as platform}
				<div class="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
					<div class="text-3xl mb-2">{platform.icon}</div>
					<p class="text-sm font-medium text-primary">{platform.name}</p>
				</div>
			{/each}
		</div>

		<h3>CMS & Content Platforms</h3>

		<div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
			{#each [
				{ name: 'WordPress', icon: '📝' },
				{ name: 'Ghost', icon: '👻' },
				{ name: 'Strapi', icon: '🚀' },
				{ name: 'Contentful', icon: '📄' }
			] as platform}
				<div class="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
					<div class="text-3xl mb-2">{platform.icon}</div>
					<p class="text-sm font-medium text-primary">{platform.name}</p>
				</div>
			{/each}
		</div>

		<h3>Headless CMS</h3>

		<div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
			{#each [
				{ name: 'Sanity', icon: '🎨' },
				{ name: 'Webflow', icon: '🌈' },
				{ name: 'Notion', icon: '📑' },
				{ name: 'Airtable', icon: '📊' }
			] as platform}
				<div class="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
					<div class="text-3xl mb-2">{platform.icon}</div>
					<p class="text-sm font-medium text-primary">{platform.name}</p>
				</div>
			{/each}
		</div>

		<h2>Advanced Merchandising</h2>

		<p>Control search results exactly how you want them:</p>

		<h3>Synonyms</h3>
		<p>
			Make related terms searchable together. "Sneakers" matches "shoes", "trainers", "kicks", and
			"footwear".
		</p>

		<h3>Overrides (Pinning & Exclusions)</h3>
		<p>
			Manually control which results show for specific queries:
		</p>
		<ul>
			<li>Pin promoted products to top of results</li>
			<li>Exclude out-of-stock items</li>
			<li>Customize sorting for specific queries</li>
			<li>Dynamic rules based on inventory or promotions</li>
		</ul>

		<h3>Stop Words</h3>
		<p>
			Ignore common words that don't add meaning (a, the, and, etc.)
		</p>

		<h2>Comprehensive Analytics</h2>

		<h3>Search Analytics</h3>
		<ul>
			<li><strong>Top Queries:</strong> What are users searching for?</li>
			<li><strong>No-Hit Queries:</strong> What searches return no results?</li>
			<li><strong>Query Trends:</strong> See search patterns over time</li>
			<li><strong>Performance Metrics:</strong> Response times, success rates</li>
		</ul>

		<h3>User Behavior</h3>
		<ul>
			<li><strong>Click Tracking:</strong> Which results do users click on?</li>
			<li><strong>Conversion Tracking:</strong> Link searches to purchases or actions</li>
			<li><strong>Session Analysis:</strong> Understand user journeys</li>
		</ul>

		<h3>A/B Testing</h3>
		<p>
			Test different search configurations to find what works best:
		</p>
		<ul>
			<li>Try different ranking algorithms</li>
			<li>Test new synonyms or overrides</li>
			<li>Measure impact on click-through rate and conversions</li>
		</ul>

		<h2>Complete Billing System</h2>

		<p>Integrated Stripe billing for monetization:</p>

		<ul>
			<li><strong>Subscription Management:</strong> Create, update, cancel subscriptions</li>
			<li><strong>Invoicing:</strong> Automatic invoice generation and delivery</li>
			<li><strong>Customer Portal:</strong> Let customers manage their subscriptions</li>
			<li><strong>Usage-Based Billing:</strong> Charge based on actual usage</li>
			<li><strong>Tax Calculation:</strong> Automatic tax handling</li>
		</ul>

		<h2>Enterprise Features</h2>

		<h3>Security</h3>
		<ul>
			<li>TLS 1.3 encryption for all connections</li>
			<li>Encrypted data at rest with AES-256</li>
			<li>Row-level security (RLS) for data isolation</li>
			<li>IP whitelisting and firewall rules</li>
		</ul>

		<h3>Compliance</h3>
		<ul>
			<li><strong>GDPR:</strong> Right to be forgotten, data portability</li>
			<li><strong>SOC 2 Type II:</strong> Security audit certified</li>
			<li><strong>ISO 27001:</strong> Information security standards</li>
			<li><strong>CCPA:</strong> California privacy compliance</li>
		</ul>

		<h3>Administration</h3>
		<ul>
			<li><strong>Role-Based Access:</strong> Admin, Editor, Viewer, Developer roles</li>
			<li><strong>Audit Logs:</strong> Track all user actions</li>
			<li><strong>API Key Management:</strong> Create, rotate, revoke keys</li>
			<li><strong>Custom Webhooks:</strong> React to platform events</li>
		</ul>

		<h2>Performance & Reliability</h2>

		<ul>
			<li>Sub-50ms query latency (p95) at scale</li>
			<li>99.99% uptime SLA for enterprise</li>
			<li>Automatic failover and redundancy</li>
			<li>Real-time metrics and monitoring</li>
			<li>Automatic backups and disaster recovery</li>
		</ul>

		<h2>Developer-Friendly APIs</h2>

		<h3>REST API</h3>
		<p>
			Standard HTTP API with comprehensive endpoints for search, collections, analytics, billing, and
			more.
		</p>

		<h3>SDKs</h3>
		<p>
			Available for JavaScript/TypeScript, Python, PHP, Ruby, Go, Java, and more.
		</p>

		<h3>Webhooks</h3>
		<p>
			Subscribe to events: search completed, document created/updated/deleted, subscription changed,
			payment failed, etc.
		</p>

		<h2>White-Label & Customization</h2>

		<ul>
			<li>Custom domain (search.yourcompany.com)</li>
			<li>Custom branding and colors</li>
			<li>Custom CSS and styling</li>
			<li>Embedded search widget</li>
			<li>Custom analytics dashboard</li>
		</ul>

		<h2>Summary Table</h2>

		<table class="w-full my-8">
			<thead>
				<tr class="border-b border-slate-200 dark:border-slate-700">
					<th class="text-left py-3 px-4 font-semibold">Feature</th>
					<th class="text-center py-3 px-4 font-semibold">Free</th>
					<th class="text-center py-3 px-4 font-semibold">Starter</th>
					<th class="text-center py-3 px-4 font-semibold">Pro</th>
					<th class="text-center py-3 px-4 font-semibold">Enterprise</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border-b border-slate-100 dark:border-slate-800">
					<td class="py-3 px-4">Full-Text Search</td>
					<td class="text-center">✓</td>
					<td class="text-center">✓</td>
					<td class="text-center">✓</td>
					<td class="text-center">✓</td>
				</tr>
				<tr class="border-b border-slate-100 dark:border-slate-800">
					<td class="py-3 px-4">Vector Search</td>
					<td class="text-center">-</td>
					<td class="text-center">-</td>
					<td class="text-center">✓</td>
					<td class="text-center">✓</td>
				</tr>
				<tr class="border-b border-slate-100 dark:border-slate-800">
					<td class="py-3 px-4">NL Search & RAG</td>
					<td class="text-center">-</td>
					<td class="text-center">-</td>
					<td class="text-center">✓</td>
					<td class="text-center">✓</td>
				</tr>
				<tr class="border-b border-slate-100 dark:border-slate-800">
					<td class="py-3 px-4">Integrations</td>
					<td class="text-center">Basic</td>
					<td class="text-center">✓</td>
					<td class="text-center">✓</td>
					<td class="text-center">✓</td>
				</tr>
				<tr class="border-b border-slate-100 dark:border-slate-800">
					<td class="py-3 px-4">Analytics</td>
					<td class="text-center">Basic</td>
					<td class="text-center">✓</td>
					<td class="text-center">✓</td>
					<td class="text-center">✓</td>
				</tr>
				<tr class="border-b border-slate-100 dark:border-slate-800">
					<td class="py-3 px-4">A/B Testing</td>
					<td class="text-center">-</td>
					<td class="text-center">-</td>
					<td class="text-center">✓</td>
					<td class="text-center">✓</td>
				</tr>
				<tr>
					<td class="py-3 px-4">Custom SLA & Support</td>
					<td class="text-center">-</td>
					<td class="text-center">-</td>
					<td class="text-center">-</td>
					<td class="text-center">✓</td>
				</tr>
			</tbody>
		</table>

		<h2>Next Steps</h2>

		<ul>
			<li>
				<a href="/docs/introduction/architecture">Learn about Architecture</a> - understand how it all
				works
			</li>
			<li>
				<a href="/docs/quickstart/getting-started">Start your free trial</a> - experience these features
				firsthand
			</li>
		</ul>
	</div>

	<MainFooter variant="docs" />
</DocsArticle>
