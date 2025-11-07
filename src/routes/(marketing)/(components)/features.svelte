<script lang="ts">
    import { trackEvent } from '$lib/actions/analytics';
    import Icon from '$lib/components/ui/icon';
    import { cn } from '$lib/utils/cn';
    import type { HTMLAttributes } from 'svelte/elements';

    const features = [
        {
            label: 'Intelligent Search',
            description:
                'Power your search with 6 advanced types: full-text, vector, semantic, conversational, image, and geo search capabilities.',
            icon: '/images/icons/gradients/star.svg',
            href: '/docs/features/search'
        },
        {
            label: 'Multi-tenancy',
            description: 'Complete data isolation with row-level security, ensuring each tenant\'s data remains private and secure.',
            icon: '/images/icons/gradients/shield.svg',
            href: '/docs/features/multi-tenancy'
        },
        {
            label: 'Ready Integrations',
            description: 'Connect seamlessly with 10+ platforms including WordPress, Shopify, Magento, WooCommerce, and more.',
            icon: '/images/icons/gradients/database.svg',
            href: '/docs/integrations'
        },
        {
            label: 'Search Analytics',
            description: 'Track search queries, clicks, conversions, and no-hits with detailed performance metrics and A/B testing.',
            icon: '/images/icons/gradients/verified.svg',
            href: '/docs/features/analytics'
        },
        {
            label: 'Complete Billing',
            description: 'Built-in Stripe integration with subscription management, usage tracking, and automated invoicing.',
            icon: '/images/icons/gradients/soc-2.svg',
            href: '/docs/features/billing'
        },
        {
            label: 'API-First',
            description: 'RESTful API with JWT authentication, API keys, rate limiting, and comprehensive SDKs for all platforms.',
            icon: '/images/icons/gradients/lock.svg',
            href: '/docs/api'
        },
        {
            label: 'Enterprise Security',
            description: 'GDPR compliance, encryption at rest and in transit, comprehensive audit logs, and role-based access control.',
            icon: '/images/icons/gradients/hipaa.svg',
            href: '/docs/security'
        },
        {
            label: 'AI-Powered Search',
            description: 'Natural language processing, conversational search with RAG, and voice-enabled search capabilities.',
            icon: '/images/icons/gradients/ccpa.svg',
            href: '/docs/features/ai-search'
        }
    ];

    type FeaturesProps = {
        theme?: 'light' | 'dark';
    } & HTMLAttributes<HTMLDivElement>;

    const { theme = 'light', class: classes, ...restProps }: FeaturesProps = $props();
</script>

<div
    class={cn('bg-[#EDEDF0] pt-20 pb-12 md:pt-40', theme, classes, {
        'bg-greyscale-900': theme === 'dark'
    })}
    {...restProps}
>
    <div class="container mx-auto">
        <section class="flex flex-col items-start gap-x-20 md:flex-row">
            <h2
                class="text-title font-aeonik-pro text-primary max-w-[700px] leading-12 text-pretty"
            >
                Everything you need for
                <span class="whitespace-nowrap">enterprise search</span><span
                    class="text-accent">_</span
                >
            </h2>
            <p class="text-secondary text-description mt-4 max-w-xl font-medium">
                From intelligent AI-powered search to complete billing and analytics, AACSearch provides all the tools to build and scale your search experience.
            </p>
        </section>
    </div>
    <div class="mt-20 border-y border-dashed border-black/8">
        <div class="container grid grid-cols-2 overflow-hidden lg:grid-cols-4">
            {#each features as box}
                <a
                    class="text-sub-body group relative border-dashed border-black/8 px-2.5 py-8 font-medium last-of-type:border-0 nth-of-type-[4]:border-r-0 nth-of-type-[7]:border-b-0 max-lg:even:border-r-0 md:border-r md:border-b md:p-8 lg:nth-of-type-[5]:border-b-0 lg:nth-of-type-[6]:border-b-0 lg:nth-of-type-[8]:border-b-0"
                    href={box.href}
                    onclick={() => {
                        trackEvent(`feature-${box.label.toLowerCase().replace(' ', '-')}-click`);
                    }}
                >
                    <img loading="lazy" src={box.icon} width="40" height="40" alt="" />
                    <h3 class="text-primary mt-4 flex flex-wrap items-center gap-0.5">
                        {box.label}

                        <Icon
                            name="arrow-right"
                            class="transition-all group-hover:translate-x-0.25 group-hover:opacity-100 group-focus:translate-x-0.25 group-focus:-translate-y-0.25 group-focus:opacity-100 xl:opacity-0"
                        />
                    </h3>
                    <p class="text-secondary mt-1">
                        {box.description}
                    </p>
                </a>
            {/each}
        </div>
    </div>
</div>
