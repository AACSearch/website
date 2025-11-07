<script lang="ts">
    import { trackEvent } from '$lib/actions/analytics';
    import { Button } from '$lib/components/ui';
    import { cn } from '$lib/utils/cn';
    import { getAACSearchDashboardUrl } from '$lib/utils/dashboard';

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
        features: string[];
    }> = [
        {
            id: 'free',
            name: 'Free',
            price: '$0',
            description: 'Perfect for getting started with AACSearch and small projects.',
            subtitle: '/month',
            event: 'home-pricing-cards-free-click',
            features: [
                '10K searches per month',
                '1 collection',
                'Basic search features',
                'Community support'
            ]
        },
        {
            name: 'Starter',
            price: '$29',
            description: 'Great for growing teams and production applications.',
            subtitle: '/month',
            event: 'home-pricing-cards-starter-click',
            features: [
                '100K searches per month',
                '10 collections',
                '2 integrations',
                'Email support'
            ]
        },
        {
            name: 'Professional',
            price: '$99',
            tag: 'Most Popular',
            description: 'For teams that need advanced features and scalability.',
            subtitle: '/month',
            event: 'home-pricing-cards-professional-click',
            features: [
                '500K searches per month',
                'Unlimited collections',
                'AI-powered search (limited)',
                '5 integrations',
                'Priority support'
            ]
        },
        {
            name: 'Business',
            price: '$299',
            description: 'For businesses requiring enterprise-grade features and reliability.',
            subtitle: '/month',
            event: 'home-pricing-cards-business-click',
            features: [
                '2M searches per month',
                'Full AI capabilities',
                'Unlimited integrations',
                '99.9% SLA guarantee',
                'Dedicated support'
            ]
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 'Custom',
            description: 'For organizations with custom requirements and maximum control.',
            event: 'home-pricing-cards-enterprise-click',
            features: [
                'Unlimited searches',
                'On-premise deployment',
                '99.99% SLA guarantee',
                'Dedicated account manager',
                '24/7 premium support'
            ]
        }
    ];

    type PricingProps = {
        class?: string;
    };

    const { class: className }: PricingProps = $props();

    const gridCols = `lg:grid-cols-${plans.length}`;
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
            {#each plans as { name, price, tag: label, subtitle, description, event }}
                {@const isEnterprise = name === 'Enterprise'}
                <div class="flex h-full w-full grow flex-col gap-1 px-5 py-5 md:py-0">
                    <div class="flex items-center gap-2.5">
                        <span class="text-description text-secondary font-medium">{name}</span>
                        {#if label}
                            <span
                                class="bg-accent-200 text-caption rounded-lg px-1.5 py-0.5 font-medium text-white"
                                >{label}</span
                            >
                        {/if}
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
                        class="mt-8 mb-0 w-full!"
                        variant={name === 'Professional' ? 'primary' : 'secondary'}
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
