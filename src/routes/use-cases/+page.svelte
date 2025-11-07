<script lang="ts">
    import { Main } from '$lib/layouts';
    import MainFooter from '$lib/components/MainFooter.svelte';
    import FooterNav from '$lib/components/FooterNav.svelte';
    import { TITLE_SUFFIX } from '$routes/titles';
    import { DEFAULT_DESCRIPTION, DEFAULT_HOST } from '$lib/utils/metadata';
    import { Button } from '$lib/components/ui';

    const title = 'Use Cases' + TITLE_SUFFIX;
    const description =
        'AACSearch is built for diverse industries and applications. Explore how e-commerce, content platforms, SaaS, and enterprise organizations leverage AACSearch for intelligent search solutions.';
    const ogImage = DEFAULT_HOST + '/images/open-graph/website.png';

    const useCases = [
        {
            id: 'ecommerce',
            title: 'E-commerce Search',
            subtitle: 'Faceted Navigation & Merchandising',
            description: 'Power your online store with intelligent product search that drives conversions and improves customer satisfaction.',
            benefits: [
                'Faceted navigation across multiple dimensions',
                'Real-time inventory sync from Shopify, WooCommerce, Magento',
                'Merchandising and product pinning for promotions',
                'Typo tolerance for better search results',
                'Personalized product recommendations',
                'Advanced analytics on search behavior'
            ],
            examples: 'Shopify, WooCommerce, Magento stores',
            expectedResults: [
                '+25-40% conversion rate increase',
                '+15-30% average order value increase',
                '-20-35% time to purchase reduction',
                '+40-60% search usage increase'
            ],
            cta: 'Explore E-commerce Solution'
        },
        {
            id: 'content',
            title: 'Content Platforms & Blogs',
            subtitle: 'Semantic Search & Multi-language',
            description: 'Help readers discover your content with semantic search that understands meaning, not just keywords.',
            benefits: [
                'Full-text search across articles and posts',
                'Semantic search for better relevance',
                'Multi-language support with automatic detection',
                'Related articles based on content similarity',
                'Category and tag-based filtering',
                'Author and publish date filtering',
                'Content analytics and trending topics'
            ],
            examples: 'WordPress, Ghost, Sanity, content-driven websites',
            expectedResults: [
                '+35-50% content discovery increase',
                '+20-30% average session duration increase',
                '+25-40% click-through rate improvement',
                '-60-80% bounce rate reduction'
            ],
            cta: 'Explore Content Solution'
        },
        {
            id: 'saas',
            title: 'SaaS Platforms',
            subtitle: 'Multi-tenant & White-label',
            description: 'Build powerful search features into your SaaS application with built-in multi-tenancy and white-labeling.',
            benefits: [
                'Native multi-tenant architecture',
                'White-label customization with your branding',
                'Embedded search widgets for your users',
                'Usage-based billing integration',
                'API-first design for custom integrations',
                'Scoped API keys for security',
                'Real-time search performance monitoring'
            ],
            examples: 'Project management tools, document platforms, productivity apps',
            expectedResults: [
                '+30-45% user engagement increase',
                '+40-60% feature adoption rate',
                '+35-50% customer satisfaction improvement',
                'Reduced support tickets by 20-30%'
            ],
            cta: 'Explore SaaS Solution'
        },
        {
            id: 'enterprise',
            title: 'Enterprise Document Search',
            subtitle: 'Permissions & Compliance',
            description: 'Implement enterprise-grade search with row-level security, compliance, and comprehensive audit trails.',
            benefits: [
                'Row-level security with permission-based filtering',
                'GDPR, SOC 2, ISO 27001 compliance',
                'Comprehensive audit logs for all searches',
                'Support for multiple file types (PDF, DOCX, XLSX)',
                'On-premise deployment option',
                'Data residency compliance',
                'Encryption at rest and in transit'
            ],
            examples: 'Financial services, healthcare, government organizations',
            expectedResults: [
                '+50-70% document discovery improvement',
                '-40-60% time to find critical information',
                '+30-50% compliance audit readiness',
                'Zero data breach incidents'
            ],
            cta: 'Explore Enterprise Solution'
        }
    ];
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
    <!-- Image -->
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:image" content={ogImage} />
    <meta name="twitter:card" content="summary_large_image" />
    <!-- Canonical -->
    <link rel="canonical" href="{DEFAULT_HOST}/use-cases" />
    <!-- Keywords -->
    <meta name="keywords" content="AACSearch use cases, e-commerce search, content search, SaaS search, enterprise search" />
</svelte:head>

<Main>
    <div class="web-big-padding-section relative">
        <!-- Hero Section -->
        <div class="relative py-10">
            <div class="web-big-padding-section-level-2" style:margin-block="8rem">
                <section class="web-u-padding-block-end-0 container">
                    <div
                        class="web-hero"
                        style="--hero-max-inline-size:62.125rem; --hero-gap:1.125rem;"
                    >
                        <h1 class="text-headline font-aeonik-pro text-primary">
                            AACSearch for Every Industry
                        </h1>
                        <div>
                            <p class="text-description">
                                AACSearch is built for diverse industries and applications. Whether you're running an e-commerce store, content platform, SaaS application, or enterprise organization, AACSearch provides intelligent search solutions that drive results.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>

        <!-- Use Cases Grid -->
        <div class="relative py-10">
            <div class="web-big-padding-section-level-2">
                <section class="container">
                    <div class="space-y-12">
                        {#each useCases as useCase (useCase.id)}
                            <div class="web-grid-1-1" style="--grid-1-1-gap:3rem; --grid-1-1-gap-desktop:4rem;">
                                <!-- Left: Content -->
                                <div class="flex flex-col gap-6">
                                    <div>
                                        <h2 class="text-display font-aeonik-pro text-primary mb-2">
                                            {useCase.title}
                                        </h2>
                                        <p class="text-title text-primary opacity-75">
                                            {useCase.subtitle}
                                        </p>
                                    </div>

                                    <p class="text-description">
                                        {useCase.description}
                                    </p>

                                    <div class="space-y-6">
                                        <!-- Key Benefits -->
                                        <div>
                                            <h3 class="text-title font-aeonik-pro text-primary mb-3">
                                                Key Benefits
                                            </h3>
                                            <ul class="space-y-2">
                                                {#each useCase.benefits as benefit}
                                                    <li class="flex gap-3 text-main-body">
                                                        <span class="text-primary font-bold">+</span>
                                                        <span>{benefit}</span>
                                                    </li>
                                                {/each}
                                            </ul>
                                        </div>

                                        <!-- Expected Results -->
                                        <div>
                                            <h3 class="text-title font-aeonik-pro text-primary mb-3">
                                                Expected Results
                                            </h3>
                                            <ul class="space-y-2">
                                                {#each useCase.expectedResults as result}
                                                    <li class="flex gap-3 text-main-body">
                                                        <span class="text-primary font-bold">✓</span>
                                                        <span>{result}</span>
                                                    </li>
                                                {/each}
                                            </ul>
                                        </div>

                                        <!-- Example Companies -->
                                        <div>
                                            <h3 class="text-title font-aeonik-pro text-primary mb-3">
                                                For
                                            </h3>
                                            <p class="text-main-body text-primary opacity-75">
                                                {useCase.examples}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        event="use-cases-{useCase.id}-cta"
                                        href="/products/search-core"
                                        class="self-start"
                                    >
                                        <span>{useCase.cta}</span>
                                    </Button>
                                </div>

                                <!-- Right: Visual Placeholder -->
                                <div class="flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-8 h-96">
                                    <div class="text-center">
                                        <div class="text-6xl mb-4">
                                            {#if useCase.id === 'ecommerce'}
                                                🛍️
                                            {:else if useCase.id === 'content'}
                                                📰
                                            {:else if useCase.id === 'saas'}
                                                🚀
                                            {:else}
                                                🏢
                                            {/if}
                                        </div>
                                        <p class="text-main-body text-primary opacity-50">
                                            {useCase.title} Visualization
                                        </p>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </section>
            </div>
        </div>

        <!-- Comparison Section -->
        <div class="web-white-section light py-10">
            <div class="web-big-padding-section-level-2">
                <div class="container">
                    <div class="web-hero web-u-max-width-800 is-center">
                        <h2 class="text-display font-aeonik-pro text-primary">
                            Why Choose AACSearch
                        </h2>
                        <p class="text-description web-u-max-width-480 mx-auto">
                            Unlike traditional search solutions, AACSearch is purpose-built for modern applications with native support for multi-tenancy, real-time updates, and comprehensive analytics.
                        </p>
                    </div>
                    <div class="web-grid-2c-4c mt-12">
                        <div class="flex flex-col gap-3">
                            <h3 class="text-title font-aeonik-pro text-primary">Simple Setup</h3>
                            <p class="text-main-body text-primary opacity-75">
                                Get search running in minutes, not months
                            </p>
                        </div>
                        <div class="flex flex-col gap-3">
                            <h3 class="text-title font-aeonik-pro text-primary">Developer-Friendly</h3>
                            <p class="text-main-body text-primary opacity-75">
                                Intuitive APIs and comprehensive documentation
                            </p>
                        </div>
                        <div class="flex flex-col gap-3">
                            <h3 class="text-title font-aeonik-pro text-primary">Cost-Effective</h3>
                            <p class="text-main-body text-primary opacity-75">
                                Pay for what you use with transparent pricing
                            </p>
                        </div>
                        <div class="flex flex-col gap-3">
                            <h3 class="text-title font-aeonik-pro text-primary">Enterprise-Ready</h3>
                            <p class="text-main-body text-primary opacity-75">
                                Security, compliance, and 99.99% uptime SLA
                            </p>
                        </div>
                        <div class="flex flex-col gap-3">
                            <h3 class="text-title font-aeonik-pro text-primary">Multi-Tenant</h3>
                            <p class="text-main-body text-primary opacity-75">
                                Built-in support for multiple users and workspaces
                            </p>
                        </div>
                        <div class="flex flex-col gap-3">
                            <h3 class="text-title font-aeonik-pro text-primary">Real-Time Analytics</h3>
                            <p class="text-main-body text-primary opacity-75">
                                Understand user behavior with detailed insights
                            </p>
                        </div>
                        <div class="flex flex-col gap-3">
                            <h3 class="text-title font-aeonik-pro text-primary">Intelligent Features</h3>
                            <p class="text-main-body text-primary opacity-75">
                                Typo tolerance, semantic search, and more
                            </p>
                        </div>
                        <div class="flex flex-col gap-3">
                            <h3 class="text-title font-aeonik-pro text-primary">Global Scale</h3>
                            <p class="text-main-body text-primary opacity-75">
                                Handle millions of documents and queries
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- CTA Section -->
        <div class="overflow-hidden p-0 pt-10">
            <div class="web-big-padding-section-level-2 is-margin-replace-padding relative">
                <img
                    src="/images/bgs/pre-footer.png"
                    alt=""
                    class="web-pre-footer-bg"
                    style="z-index:-1"
                />
                <div class="container">
                    <div class="web-hero web-u-max-width-380">
                        <h2 class="text-display font-aeonik-pro text-primary">Ready to get started?</h2>
                        <p class="text-primary web-u-opacity-64">
                            Join thousands of companies using AACSearch to power their search experiences.
                        </p>
                        <Button
                            event="use-cases-cta-start"
                            href="https://aacsearch.app/signup"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="mt-4 self-center"
                        >
                            <span>Start Free Trial</span>
                        </Button>
                    </div>
                    <FooterNav />
                    <MainFooter />
                </div>
            </div>
        </div>
    </div>
</Main>

<style lang="scss">
    .web-pre-footer-bg {
        position: absolute;
        top: clamp(300px, 50vw, 50%);
        left: clamp(300px, 50vw, 50%);
        transform: translate(-50%, -70%);
        width: clamp(1200px, 200vw, 3000px);
        height: auto;
        max-inline-size: unset;
        max-block-size: unset;
    }

    .web-big-padding-section-level-2.is-margin-replace-padding {
        padding-bottom: 0;
    }
</style>
