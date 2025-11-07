<script lang="ts">
    import { trackEvent } from '$lib/actions/analytics';
    import { Button } from '$lib/components/ui';
    import { cn } from '$lib/utils/cn';
    import { getAACSearchDashboardUrl } from '$lib/utils/dashboard';
    import { SHOW_SCALE_PLAN } from '$lib/constants/feature-flags';

    interface PricingTier {
        id: string;
        name: string;
        price: string;
        priceNumber: number;
        billing: string;
        tagline: string;
        description: string;
        badge?: string;
        badgeVariant?: 'popular' | 'enterprise';
        highlights: string[];
        highlightFeature: string;
        cta: string;
        ctaVariant?: 'primary' | 'secondary';
        features: Array<{
            label: string;
            included: boolean;
        }>;
        event: string;
        isPopular?: boolean;
    }

    const plans: PricingTier[] = [
        {
            id: 'free',
            name: 'Free',
            price: '$0',
            priceNumber: 0,
            billing: 'Forever free',
            tagline: 'Start your search journey',
            description: 'Perfect for individuals and small projects exploring intelligent search capabilities.',
            highlights: [
                '10K monthly searches',
                '1 collection',
                'Basic full-text search',
                'Email support'
            ],
            highlightFeature: 'No credit card required',
            cta: 'Start Free',
            ctaVariant: 'secondary',
            features: [
                { label: 'Up to 10K monthly searches', included: true },
                { label: 'Single collection', included: true },
                { label: 'Full-text search only', included: true },
                { label: 'Community support', included: true },
                { label: 'API access', included: false },
                { label: 'Advanced analytics', included: false },
                { label: 'Integrations', included: false },
                { label: 'SLA guarantee', included: false }
            ],
            event: 'pricing-free-click'
        },
        {
            id: 'starter',
            name: 'Starter',
            price: '$29',
            priceNumber: 29,
            billing: '/month',
            tagline: 'Launch production searches',
            description: 'Built for growing applications that need reliable search with essential integrations.',
            highlights: [
                '100K monthly searches',
                '10 collections',
                '2 integrations included',
                'API access'
            ],
            highlightFeature: 'Perfect for growing teams',
            cta: 'Start Building',
            ctaVariant: 'secondary',
            features: [
                { label: 'Up to 100K monthly searches', included: true },
                { label: 'Up to 10 collections', included: true },
                { label: 'Full-text + vector search', included: true },
                { label: '2 integrations included', included: true },
                { label: 'REST API access', included: true },
                { label: 'Basic analytics', included: true },
                { label: 'Email support', included: true },
                { label: 'SLA guarantee', included: false }
            ],
            event: 'pricing-starter-click'
        },
        {
            id: 'professional',
            name: 'Professional',
            price: '$99',
            priceNumber: 99,
            billing: '/month',
            tagline: 'Unlimited search at scale',
            description: 'The most popular choice. Built for teams deploying search across their entire platform.',
            badge: 'MOST POPULAR',
            badgeVariant: 'popular',
            isPopular: true,
            highlights: [
                '500K monthly searches',
                'Unlimited collections',
                'Full AI capabilities',
                'Advanced analytics',
                'Priority support'
            ],
            highlightFeature: 'Unlimited collections & integrations',
            cta: 'Get Started',
            ctaVariant: 'primary',
            features: [
                { label: 'Up to 500K monthly searches', included: true },
                { label: 'Unlimited collections', included: true },
                { label: 'Unlimited integrations', included: true },
                { label: 'Full-text, vector, semantic search', included: true },
                { label: 'Natural language search (NLS)', included: true },
                { label: 'Advanced analytics & A/B testing', included: true },
                { label: 'Priority email support', included: true },
                { label: '99.9% uptime SLA', included: true }
            ],
            event: 'pricing-professional-click'
        },
        {
            id: 'business',
            name: 'Business',
            price: '$299',
            priceNumber: 299,
            billing: '/month',
            tagline: 'Enterprise-grade at scale',
            description: 'For large organizations processing millions of searches with mission-critical requirements.',
            highlights: [
                '2M monthly searches',
                'Unlimited everything',
                'Full AI suite',
                '99.9% SLA'
            ],
            highlightFeature: 'Advanced security & compliance',
            cta: 'Contact Sales',
            ctaVariant: 'secondary',
            features: [
                { label: 'Up to 2M monthly searches', included: true },
                { label: 'Unlimited collections & integrations', included: true },
                { label: 'All search capabilities', included: true },
                { label: 'Custom webhooks & callbacks', included: true },
                { label: 'Dedicated API rate limits', included: true },
                { label: 'Advanced security features', included: true },
                { label: 'Phone + email support (24/5)', included: true },
                { label: '99.9% uptime SLA', included: true }
            ],
            event: 'pricing-business-click'
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 'Custom',
            priceNumber: 9999,
            billing: 'Contact for pricing',
            tagline: 'Fully customized solution',
            description: 'Unlimited search, custom features, dedicated support, and 99.99% SLA for your business.',
            badge: 'ENTERPRISE',
            badgeVariant: 'enterprise',
            highlights: [
                'Unlimited searches',
                'Unlimited resources',
                'Custom AI models',
                '99.99% SLA'
            ],
            highlightFeature: 'White-label & dedicated infrastructure',
            cta: 'Contact Sales',
            ctaVariant: 'secondary',
            features: [
                { label: 'Unlimited searches & collections', included: true },
                { label: 'Unlimited integrations', included: true },
                { label: 'Custom AI models & training', included: true },
                { label: 'White-label capabilities', included: true },
                { label: 'Dedicated infrastructure option', included: true },
                { label: 'Custom compliance & security', included: true },
                { label: 'Dedicated account manager', included: true },
                { label: '99.99% uptime SLA', included: true }
            ],
            event: 'pricing-enterprise-click'
        }
    ];

    type PricingProps = {
        class?: string;
    };

    const { class: className }: PricingProps = $props();

    const visiblePlans = plans;
    const gridCols = 'lg:grid-cols-5';
</script>

<div
    class={cn(
        'relative -mt-6 -mb-12 flex min-h-[750px] max-w-screen items-center justify-center overflow-hidden pt-40 md:mb-0 md:pb-10',
        className
    )}
>
    <div class="container flex w-full flex-col items-center justify-center gap-10">
        <div
            class={cn(
                'animate-lighting absolute top-0 left-0 -z-10 h-screen w-[200vw] -translate-x-[25%] translate-y-8 rotate-25 overflow-hidden blur-3xl md:w-full',
                'bg-[image:radial-gradient(ellipse_390px_50px_at_10%_30%,_rgba(254,_149,_103,_0.2)_0%,_rgba(254,_149,_103,_0)_70%),_radial-gradient(ellipse_1100px_170px_at_15%_40%,rgba(253,_54,_110,_0.08)_0%,_rgba(253,_54,_110,_0)_70%),_radial-gradient(ellipse_1200px_180px_at_30%_30%,_rgba(253,_54,_110,_0.08)_0%,_rgba(253,_54,_110,_0)_70%)]',
                'bg-position-[0%_0%]'
            )}
        ></div>

        <div
            class="animate-fade-in relative flex w-full flex-col justify-between gap-8 [animation-delay:150ms] [animation-duration:1000ms] md:flex-row md:items-center"
        >
            <h2 class="text-title text-primary font-aeonik-pro max-w-xl text-pretty">
                Choose the perfect plan for your search<span class="text-accent">_</span>
            </h2>

            <div class="mt-4 flex flex-col gap-2 lg:flex-row">
                <Button
                    href={getAACSearchDashboardUrl()}
                    class="w-full! lg:w-fit!"
                    onclick={() => {
                        trackEvent(`pricing-get-started-click`);
                    }}>Start building for free</Button
                >
                <Button
                    onclick={() => {
                        trackEvent(`pricing-comparison-click`);
                    }}
                    href="#compare-plans"
                    class="w-full! lg:w-fit!"
                    variant="secondary">Compare all plans</Button
                >
            </div>
        </div>

        <div
            class="border-smooth divide-smooth w-full space-y-6 overflow-x-auto rounded-3xl border bg-white/2 backdrop-blur-lg md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-5"
        >
            {#each visiblePlans as plan}
                {@const isEnterprise = plan.name === 'Enterprise'}
                {@const isPopular = plan.isPopular}
                <div
                    class={cn(
                        'relative flex h-full w-full flex-col gap-4 border rounded-2xl p-6 transition-all duration-300',
                        isPopular
                            ? 'border-accent/60 bg-gradient-to-br from-accent/10 to-accent/5 ring-2 ring-accent/30 md:col-span-2 lg:col-span-1 lg:-mt-4 lg:mb-4'
                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    )}
                >
                    {#if plan.badge}
                        <div
                            class={cn(
                                'absolute -top-3 left-6 inline-block px-3 py-1 rounded-full text-xs font-semibold',
                                plan.badgeVariant === 'popular'
                                    ? 'bg-accent text-white'
                                    : 'bg-purple-500/80 text-white'
                            )}
                        >
                            {plan.badge}
                        </div>
                    {/if}

                    <div class="mt-2">
                        <h3 class="text-lg font-semibold text-white">{plan.name}</h3>
                        <p class="text-xs text-secondary mt-1">{plan.tagline}</p>
                    </div>

                    <div class="flex items-baseline gap-1">
                        <span class="text-4xl font-bold text-primary font-aeonik-pro">
                            {plan.price}
                        </span>
                        <span class="text-sm text-secondary">{plan.billing}</span>
                    </div>

                    <p class="text-sm text-secondary leading-relaxed">
                        {plan.description}
                    </p>

                    <div class="py-3 border-t border-white/10 border-b">
                        <p class="text-xs font-semibold text-accent uppercase tracking-wide">
                            {plan.highlightFeature}
                        </p>
                    </div>

                    <ul class="flex-1 space-y-2.5">
                        {#each plan.highlights as highlight}
                            <li class="flex items-start gap-2 text-xs text-secondary">
                                <span class="text-accent mt-1">+</span>
                                <span>{highlight}</span>
                            </li>
                        {/each}
                    </ul>

                    <Button
                        class="mt-2 mb-0 w-full!"
                        variant={isPopular ? 'primary' : 'secondary'}
                        href={isEnterprise ? '/contact-us/enterprise' : getAACSearchDashboardUrl()}
                        onclick={() => {
                            trackEvent(plan.event);
                        }}
                    >
                        {plan.cta}
                    </Button>
                </div>
            {/each}
        </div>

        <div id="compare-plans" class="w-full mt-20">
            <h3 class="text-2xl font-bold text-white mb-8 text-center">Detailed Feature Comparison</h3>
            <div class="overflow-x-auto border border-white/10 rounded-xl">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-white/10 bg-white/5">
                            <th class="px-6 py-4 text-left font-semibold text-white">Feature</th>
                            {#each visiblePlans as plan}
                                <th class="px-4 py-4 text-center font-semibold text-white">
                                    {plan.name}
                                </th>
                            {/each}
                        </tr>
                    </thead>
                    <tbody>
                        {#each plans[2].features as feature, idx}
                            <tr class={idx % 2 === 0 ? 'bg-white/2' : 'bg-transparent'}>
                                <td class="px-6 py-4 font-medium text-secondary">{feature.label}</td>
                                {#each visiblePlans as plan}
                                    <td class="px-4 py-4 text-center">
                                        {#if plan.features[idx]?.included}
                                            <span class="inline-block w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                                </svg>
                                            </span>
                                        {:else}
                                            <span class="text-white/30">-</span>
                                        {/if}
                                    </td>
                                {/each}
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
