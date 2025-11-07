<script lang="ts">
    import { Main } from '$lib/layouts';
    import MainFooter from '$lib/components/MainFooter.svelte';
    import FooterNav from '$lib/components/FooterNav.svelte';
    import { TITLE_SUFFIX } from '$routes/titles';
    import { DEFAULT_DESCRIPTION, DEFAULT_HOST } from '$lib/utils/metadata';
    import { Button } from '$lib/components/ui';

    const title = 'AACSearch vs Competitors' + TITLE_SUFFIX;
    const description =
        'Compare AACSearch with Algolia, Elasticsearch, Typesense, and other search platforms. See why AACSearch offers the best balance of features, price, and ease of use for your search needs.';
    const ogImage = DEFAULT_HOST + '/images/open-graph/website.png';

    const competitors = [
        {
            id: 'algolia',
            name: 'Algolia',
            tagline: 'Fast but Expensive',
            pricing: '$299/mo',
            priceContext: 'for 1M searches',
            strengths: [
                'Extremely fast search (< 20ms)',
                'Global CDN with edge locations',
                'Mature product with large community',
                'Advanced analytics'
            ],
            weaknesses: [
                'High pricing for medium/large scale',
                'No native multi-tenancy',
                'Vector search is premium add-on',
                'Cloud-only deployment'
            ],
            bestFor: 'Companies with unlimited budgets and speed as top priority',
            ranking: '⭐⭐⭐⭐'
        },
        {
            id: 'elasticsearch',
            name: 'Elasticsearch',
            tagline: 'Powerful but Complex',
            pricing: '$0-1000+/mo',
            priceContext: 'depending on deployment',
            strengths: [
                'Highly flexible and customizable',
                'Excellent for log analytics',
                'Large ecosystem and plugins',
                'Self-hosted option for compliance'
            ],
            weaknesses: [
                'High operational complexity',
                'Requires DevOps expertise',
                'Poor out-of-the-box UX',
                'Expensive at scale without tuning'
            ],
            bestFor: 'Large enterprises with dedicated DevOps teams',
            ranking: '⭐⭐⭐⭐'
        },
        {
            id: 'typesense',
            name: 'Typesense',
            tagline: 'Open-Source Alternative',
            pricing: '$49-299/mo',
            priceContext: 'or self-hosted (free)',
            strengths: [
                'Open-source and transparent',
                'Good developer experience',
                'Typo tolerance built-in',
                'Lower pricing than Algolia'
            ],
            weaknesses: [
                'Smaller community than competitors',
                'Limited analytics features',
                'No native multi-tenancy',
                'Self-hosted requires maintenance'
            ],
            bestFor: 'Developers who want open-source with decent search',
            ranking: '⭐⭐⭐⭐'
        }
    ];

    const featureComparison = [
        { feature: 'Setup Time', aacsearch: '5 minutes', algolia: '15 minutes', elasticsearch: '1-2 hours', typesense: '30 minutes' },
        { feature: 'Search Speed', aacsearch: '<50ms', algolia: '<20ms', elasticsearch: '<100ms', typesense: '<50ms' },
        { feature: 'Typo Tolerance', aacsearch: 'Built-in', algolia: 'Built-in', elasticsearch: 'Manual', typesense: 'Built-in' },
        { feature: 'Multi-Tenancy', aacsearch: 'Native', algolia: 'Manual', elasticsearch: 'Manual', typesense: 'Manual' },
        { feature: 'Vector Search', aacsearch: 'Included', algolia: '$$$', elasticsearch: 'Plugin', typesense: 'Available' },
        { feature: 'Analytics', aacsearch: 'Full', algolia: 'Paid', elasticsearch: 'Limited', typesense: 'No' },
        { feature: 'Max Documents', aacsearch: 'Unlimited', algolia: 'Unlimited', elasticsearch: 'Unlimited', typesense: 'Unlimited' },
        { feature: 'Deployment', aacsearch: 'SaaS + Self', algolia: 'SaaS Only', elasticsearch: 'Self + Cloud', typesense: 'Self + Cloud' },
    ];

    const pricingScenarios = [
        {
            scenario: 'Small App (100K docs, 100K searches/mo)',
            aacsearch: '$49/mo',
            algolia: '$99/mo',
            elasticsearch: '$50-150/mo',
            typesense: '$0-30/mo'
        },
        {
            scenario: 'Medium App (1M docs, 1M searches/mo)',
            aacsearch: '$199/mo',
            algolia: '$499/mo',
            elasticsearch: '$200-400/mo',
            typesense: '$30-100/mo'
        },
        {
            scenario: 'Large App (10M+ docs, 10M+ searches/mo)',
            aacsearch: '$499-999/mo',
            algolia: '$1500+/mo',
            elasticsearch: '$1000+/mo',
            typesense: '$200+/mo'
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
    <link rel="canonical" href="{DEFAULT_HOST}/comparison" />
    <!-- Keywords -->
    <meta name="keywords" content="AACSearch vs Algolia, search comparison, Elasticsearch vs AACSearch, Typesense comparison" />
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
                            Why Choose AACSearch
                        </h1>
                        <div>
                            <p class="text-description">
                                Compare AACSearch with leading search platforms. See why AACSearch offers the best balance of features, price, and ease of use for modern applications.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>

        <!-- Competitor Comparison Cards -->
        <div class="relative py-10">
            <div class="web-big-padding-section-level-2">
                <section class="container">
                    <h2 class="text-display font-aeonik-pro text-primary mb-12">How AACSearch Compares</h2>
                    <div class="space-y-8">
                        {#each competitors as competitor (competitor.id)}
                            <div class="web-card border border-primary/20 p-8">
                                <div class="mb-6">
                                    <h3 class="text-title font-aeonik-pro text-primary">{competitor.name}</h3>
                                    <p class="text-main-body text-primary opacity-75 mt-2">{competitor.tagline}</p>
                                </div>

                                <div class="web-grid-2c-4c mb-6 gap-6">
                                    <div>
                                        <h4 class="text-label uppercase text-primary opacity-50 mb-2">Pricing</h4>
                                        <p class="text-title font-aeonik-pro text-primary">{competitor.pricing}</p>
                                        <p class="text-sub-body text-primary opacity-75">{competitor.priceContext}</p>
                                    </div>
                                    <div>
                                        <h4 class="text-label uppercase text-primary opacity-50 mb-2">Rating</h4>
                                        <p class="text-title">{competitor.ranking}</p>
                                    </div>
                                </div>

                                <div class="web-grid-1-1" style="--grid-1-1-gap:2rem; --grid-1-1-gap-desktop:3rem;">
                                    <div>
                                        <h4 class="text-title font-aeonik-pro text-primary mb-3">Strengths</h4>
                                        <ul class="space-y-2">
                                            {#each competitor.strengths as strength}
                                                <li class="flex gap-2 text-main-body">
                                                    <span class="text-primary font-bold">✓</span>
                                                    <span>{strength}</span>
                                                </li>
                                            {/each}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 class="text-title font-aeonik-pro text-primary mb-3">Weaknesses</h4>
                                        <ul class="space-y-2">
                                            {#each competitor.weaknesses as weakness}
                                                <li class="flex gap-2 text-main-body">
                                                    <span class="text-primary font-bold">✗</span>
                                                    <span>{weakness}</span>
                                                </li>
                                            {/each}
                                        </ul>
                                    </div>
                                </div>

                                <div class="mt-6 pt-6 border-t border-primary/10">
                                    <h4 class="text-label uppercase text-primary opacity-50 mb-2">Best For</h4>
                                    <p class="text-main-body text-primary opacity-75">{competitor.bestFor}</p>
                                </div>
                            </div>
                        {/each}
                    </div>
                </section>
            </div>
        </div>

        <!-- Feature Comparison Table -->
        <div class="relative py-10">
            <div class="web-big-padding-section-level-2">
                <section class="container">
                    <h2 class="text-display font-aeonik-pro text-primary mb-8">Feature Comparison</h2>
                    <div class="overflow-x-auto">
                        <table class="w-full border-collapse">
                            <thead>
                                <tr class="border-b border-primary/20">
                                    <th class="text-left text-title font-aeonik-pro text-primary p-4 bg-primary/5">Feature</th>
                                    <th class="text-left text-title font-aeonik-pro text-primary p-4 bg-primary/5">AACSearch</th>
                                    <th class="text-left text-title font-aeonik-pro text-primary p-4 bg-primary/5">Algolia</th>
                                    <th class="text-left text-title font-aeonik-pro text-primary p-4 bg-primary/5">Elasticsearch</th>
                                    <th class="text-left text-title font-aeonik-pro text-primary p-4 bg-primary/5">Typesense</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each featureComparison as row}
                                    <tr class="border-b border-primary/10 hover:bg-primary/2 transition-colors">
                                        <td class="text-main-body font-medium text-primary p-4">{row.feature}</td>
                                        <td class="text-main-body text-primary p-4 bg-primary/5"><strong>{row.aacsearch}</strong></td>
                                        <td class="text-main-body text-primary p-4">{row.algolia}</td>
                                        <td class="text-main-body text-primary p-4">{row.elasticsearch}</td>
                                        <td class="text-main-body text-primary p-4">{row.typesense}</td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>

        <!-- Pricing Scenarios -->
        <div class="web-white-section light py-10">
            <div class="web-big-padding-section-level-2">
                <div class="container">
                    <h2 class="text-display font-aeonik-pro text-primary mb-8">Total Cost of Ownership</h2>
                    <p class="text-description mb-8">Real-world pricing scenarios comparing AACSearch with competitors.</p>

                    <div class="space-y-6">
                        {#each pricingScenarios as scenario}
                            <div class="web-card p-8 border border-primary/20">
                                <h3 class="text-title font-aeonik-pro text-primary mb-4">{scenario.scenario}</h3>
                                <div class="web-grid-2c-4c gap-6">
                                    <div>
                                        <p class="text-label uppercase text-primary opacity-50 mb-1">AACSearch</p>
                                        <p class="text-display font-aeonik-pro text-primary">{scenario.aacsearch}</p>
                                        <p class="text-sub-body text-green-600 mt-2">Best value</p>
                                    </div>
                                    <div>
                                        <p class="text-label uppercase text-primary opacity-50 mb-1">Algolia</p>
                                        <p class="text-display font-aeonik-pro text-primary">{scenario.algolia}</p>
                                    </div>
                                    <div>
                                        <p class="text-label uppercase text-primary opacity-50 mb-1">Elasticsearch</p>
                                        <p class="text-display font-aeonik-pro text-primary">{scenario.elasticsearch}</p>
                                    </div>
                                    <div>
                                        <p class="text-label uppercase text-primary opacity-50 mb-1">Typesense</p>
                                        <p class="text-display font-aeonik-pro text-primary">{scenario.typesense}</p>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>

        <!-- Why AACSearch Wins -->
        <div class="relative py-10">
            <div class="web-big-padding-section-level-2">
                <section class="container">
                    <div class="web-hero web-u-max-width-800 is-center">
                        <h2 class="text-display font-aeonik-pro text-primary">Why Choose AACSearch</h2>
                        <p class="text-description web-u-max-width-480 mx-auto">
                            AACSearch combines the best features of competitors while maintaining simple pricing and ease of use.
                        </p>
                    </div>

                    <div class="web-grid-2c-4c mt-12 gap-6">
                        <div class="flex flex-col gap-3">
                            <h3 class="text-title font-aeonik-pro text-primary">Better Value</h3>
                            <p class="text-main-body text-primary opacity-75">
                                Up to 70% cheaper than Algolia at scale
                            </p>
                        </div>
                        <div class="flex flex-col gap-3">
                            <h3 class="text-title font-aeonik-pro text-primary">Easier to Use</h3>
                            <p class="text-main-body text-primary opacity-75">
                                5-minute setup vs hours for competitors
                            </p>
                        </div>
                        <div class="flex flex-col gap-3">
                            <h3 class="text-title font-aeonik-pro text-primary">Multi-Tenant</h3>
                            <p class="text-main-body text-primary opacity-75">
                                Built-in multi-tenancy for SaaS apps
                            </p>
                        </div>
                        <div class="flex flex-col gap-3">
                            <h3 class="text-title font-aeonik-pro text-primary">All Features Included</h3>
                            <p class="text-main-body text-primary opacity-75">
                                Vector search, analytics, and more included
                            </p>
                        </div>
                        <div class="flex flex-col gap-3">
                            <h3 class="text-title font-aeonik-pro text-primary">Flexible Deployment</h3>
                            <p class="text-main-body text-primary opacity-75">
                                Cloud, self-hosted, or hybrid options
                            </p>
                        </div>
                        <div class="flex flex-col gap-3">
                            <h3 class="text-title font-aeonik-pro text-primary">24/7 Support</h3>
                            <p class="text-main-body text-primary opacity-75">
                                Enterprise support on all plans
                            </p>
                        </div>
                        <div class="flex flex-col gap-3">
                            <h3 class="text-title font-aeonik-pro text-primary">Transparent Pricing</h3>
                            <p class="text-main-body text-primary opacity-75">
                                Simple usage-based billing, no surprises
                            </p>
                        </div>
                        <div class="flex flex-col gap-3">
                            <h3 class="text-title font-aeonik-pro text-primary">Global Scale</h3>
                            <p class="text-main-body text-primary opacity-75">
                                Handle millions of documents easily
                            </p>
                        </div>
                    </div>
                </section>
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
                        <h2 class="text-display font-aeonik-pro text-primary">Try AACSearch Free</h2>
                        <p class="text-primary web-u-opacity-64">
                            See the difference for yourself. No credit card required.
                        </p>
                        <Button
                            event="comparison-cta-start"
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
