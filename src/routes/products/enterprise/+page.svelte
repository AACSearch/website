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

    const title = 'Enterprise' + TITLE_SUFFIX;
    const description =
        'Enterprise-grade security, compliance, and advanced features. GDPR compliance, role-based access control, audit logging, and custom integrations for large-scale deployments.';
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
    <meta name="keywords" content="enterprise search, GDPR compliance, security, audit logging, multi-tenancy, role-based access control, SSO" />

    <!-- Image -->
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:image" content={ogImage} />
    <meta name="twitter:card" content="summary_large_image" />

    <!-- Canonical -->
    <link rel="canonical" href="{DEFAULT_HOST}/products/enterprise" />
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
                            <pre class="text-label text-greyscale-300"><code>{`// GDPR Data Deletion Request
async function processGDPRDeletion(userId) {
  // Delete user data
  await payload.delete({
    collection: 'users',
    where: {id: {equals: userId}}
  });

  // Anonymize analytics
  await payload.update({
    collection: 'search_analytics',
    where: {user: {equals: userId}},
    data: {user: null, anonymized: true}
  });

  // Delete sessions
  await redis.del(\`session:\${userId}:*\`);

  // Audit log
  await payload.create({
    collection: 'audit_log',
    data: {
      action: 'gdpr_deletion',
      userId: userId,
      timestamp: new Date(),
      status: 'completed'
    }
  });
}

// Role-based Access Control (RBAC)
const roles = {
  'admin': {
    permissions: [
      'manage:collections',
      'manage:users',
      'view:analytics',
      'manage:api_keys'
    ]
  },
  'editor': {
    permissions: [
      'edit:documents',
      'view:analytics'
    ]
  },
  'viewer': {
    permissions: ['view:documents', 'search']
  }
};`}</code></pre>
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
                                    Federated search across multiple collections simultaneously.
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
