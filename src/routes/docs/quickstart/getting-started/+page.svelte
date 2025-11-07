<script lang="ts">
	import { TITLE_SUFFIX } from '$routes/titles';
	import { DEFAULT_HOST } from '$lib/utils/metadata';
	import { DocsArticle } from '$lib/layouts';
	import MainFooter from '$lib/components/MainFooter.svelte';

	const title = 'Getting Started - Register & Setup' + TITLE_SUFFIX;
	const description = 'Learn how to register an AACSearch account, create an organization, choose a billing plan, and set up your first users.';
	const ogImage = DEFAULT_HOST + '/images/open-graph/docs.png';
	const readtime = '10';
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

<DocsArticle title="Getting Started - Register & Setup" back="/docs/quickstart">
	<svelte:fragment slot="metadata">
		<li>{readtime} min</li>
		<li>Beginner friendly</li>
	</svelte:fragment>

	<div class="prose max-w-none dark:prose-invert">
		<p class="lead">
			In this section, you'll register an AACSearch account, create your first organization (tenant),
			choose a billing plan, and set up team members.
		</p>

		<h2>Step 1: Register Your Account</h2>

		<p>
			Go to <a href="https://app.aacsearch.com/register" target="_blank" rel="noopener noreferrer">app.aacsearch.com/register</a>
		</p>

		<p>Fill in the registration form:</p>

		<ul>
			<li><strong>Email:</strong> Your work email address</li>
			<li><strong>First Name:</strong> Your first name</li>
			<li><strong>Last Name:</strong> Your last name</li>
			<li><strong>Password:</strong> At least 8 characters (include uppercase, number, special character)</li>
		</ul>

		<p>Click "Register" and you'll see a confirmation message:</p>

		<div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6 my-6">
			<p class="my-0">
				"Check your email to verify your account. We've sent a verification link to your email
				address. This link expires in 24 hours."
			</p>
		</div>

		<h3>Verify Your Email</h3>

		<p>
			Check your email (including spam folder) for a verification email from <code>noreply@aacsearch.com</code>
		</p>

		<p>Click the "Verify Email" button in the email, or copy the link into your browser.</p>

		<p>After verification, you'll be redirected back to AACSearch and can log in with your credentials.</p>

		<h2>Step 2: Create Your First Organization</h2>

		<p>
			After logging in, you'll see the dashboard. Click "Create Organization" or "Create New Tenant"
		</p>

		<h3>2a. Basic Information</h3>

		<p>Fill in the organization details:</p>

		<ul>
			<li>
				<strong>Organization Name:</strong> e.g., "My Company", "Acme Corp", "Product Search"
			</li>
			<li>
				<strong>Slug:</strong> URL-friendly identifier (auto-generated, can be edited). Example: "my-company"
				<ul>
					<li>Must be 3-63 characters</li>
					<li>Letters, numbers, hyphens only</li>
					<li>Cannot change after creation</li>
				</ul>
			</li>
			<li><strong>Description (optional):</strong> What this organization is for</li>
		</ul>

		<h3>2b. Choose Region</h3>

		<p>Select where your data will be stored:</p>

		<table class="w-full my-6">
			<thead>
				<tr class="border-b border-slate-200 dark:border-slate-700">
					<th class="text-left py-3 px-4 font-semibold">Region</th>
					<th class="text-left py-3 px-4 font-semibold">Best For</th>
					<th class="text-left py-3 px-4 font-semibold">Latency</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border-b border-slate-100 dark:border-slate-800">
					<td class="py-3 px-4">EU (Frankfurt)</td>
					<td class="py-3 px-4">Europe, GDPR required</td>
					<td class="py-3 px-4">&lt; 50ms</td>
				</tr>
				<tr class="border-b border-slate-100 dark:border-slate-800">
					<td class="py-3 px-4">US East (Virginia)</td>
					<td class="py-3 px-4">Americas</td>
					<td class="py-3 px-4">&lt; 50ms</td>
				</tr>
				<tr>
					<td class="py-3 px-4">Asia Pacific (Singapore)</td>
					<td class="py-3 px-4">Asia, coming soon</td>
					<td class="py-3 px-4">TBD</td>
				</tr>
			</tbody>
		</table>

		<p class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 my-6">
			<strong>Important:</strong> Region cannot be changed after creation. Choose carefully based on
			where your users are located and data residency requirements.
		</p>

		<h3>2c. Configure Settings</h3>

		<p>Set defaults for this organization:</p>

		<ul>
			<li><strong>Timezone:</strong> For scheduling and reporting</li>
			<li><strong>Default Language:</strong> UI language for team members</li>
			<li><strong>Currency:</strong> For displaying prices in your region</li>
			<li><strong>2FA (optional):</strong> Require two-factor authentication for all users</li>
		</ul>

		<p>Click "Create Organization" to proceed.</p>

		<h2>Step 3: Choose a Billing Plan</h2>

		<p>You'll see a plan selection screen with these options:</p>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
			<div class="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
				<h3 class="text-lg font-semibold text-primary mt-0">Free</h3>
				<p class="text-sm">$0 / month</p>
				<ul class="text-sm space-y-1 mt-3">
					<li>✓ 1,000 documents</li>
					<li>✓ 1,000 queries/day</li>
					<li>✓ 3 collections</li>
					<li>✓ All features</li>
				</ul>
			</div>

			<div class="p-4 border border-blue-400 dark:border-blue-600 rounded-lg bg-blue-50 dark:bg-blue-900/20">
				<h3 class="text-lg font-semibold text-primary mt-0">Starter</h3>
				<p class="text-sm">$29 / month</p>
				<ul class="text-sm space-y-1 mt-3">
					<li>✓ 10,000 documents</li>
					<li>✓ 10,000 queries/day</li>
					<li>✓ 10 collections</li>
					<li>✓ Email support</li>
				</ul>
				<p class="text-xs text-slate-600 dark:text-slate-400 mt-3">Most popular</p>
			</div>

			<div class="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
				<h3 class="text-lg font-semibold text-primary mt-0">Pro</h3>
				<p class="text-sm">$99 / month</p>
				<ul class="text-sm space-y-1 mt-3">
					<li>✓ 100,000 documents</li>
					<li>✓ 100,000 queries/day</li>
					<li>✓ 50 collections</li>
					<li>✓ Priority support</li>
				</ul>
			</div>
		</div>

		<p>
			For this guide, select the <strong>Free plan</strong> (no credit card required, no time limits).
		</p>

		<h2>Step 4: Set Up Your Profile (Optional)</h2>

		<p>Complete your user profile:</p>

		<ul>
			<li><strong>Avatar:</strong> Upload a profile picture</li>
			<li><strong>Email Notifications:</strong> Choose which emails you want to receive</li>
			<li><strong>API Token:</strong> Generate personal API tokens for scripts</li>
		</ul>

		<h2>Step 5: Invite Team Members (Optional)</h2>

		<p>
			Go to <strong>Settings</strong> → <strong>Members</strong> → <strong>Invite Member</strong>
		</p>

		<ul>
			<li><strong>Email:</strong> Team member's email address</li>
			<li>
				<strong>Role:</strong>
				<ul>
					<li><strong>Owner:</strong> Full control (usually just the creator)</li>
					<li><strong>Admin:</strong> Manage everything</li>
					<li><strong>Editor:</strong> Create and manage content</li>
					<li><strong>Viewer:</strong> Read-only access</li>
				</ul>
			</li>
		</ul>

		<p>
			They'll receive an email invitation. They can click the link to accept and join your organization.
		</p>

		<h2>Step 6: Get Your API Keys (Optional for Now)</h2>

		<p>
			Go to <strong>Settings</strong> → <strong>API Keys</strong> → <strong>Create Key</strong>
		</p>

		<p>You'll need this later for integrating search with your website, but you can skip this now.</p>

		<h2>Congratulations!</h2>

		<div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6 my-6">
			<h3 class="text-primary font-semibold mt-0">You're all set!</h3>
			<p class="my-2">Your AACSearch account and organization are ready to go.</p>
			<p class="my-0">Next step: Create your first search collection and import some data.</p>
		</div>

		<h2>Next: Create Your First Collection</h2>

		<p>
			Now that you have an organization set up, let's create your first search collection and import
			some data.
		</p>

		<a
			href="/docs/quickstart/first-collection"
			class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors mt-4"
		>
			Next: Create First Collection <span>→</span>
		</a>
	</div>

	<MainFooter variant="docs" />
</DocsArticle>
