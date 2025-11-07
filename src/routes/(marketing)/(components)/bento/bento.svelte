<script lang="ts">
    import { cn } from '$lib/utils/cn';

    const products = [
        {
            label: 'Search Core',
            description: 'Enterprise full-text search with typo tolerance, stemming, and faceted filtering',
            icon: '/images/icons/illustrated/dark/search.png',
            href: '/products/search-core'
        },
        {
            label: 'AI Search',
            description: 'Natural language queries, conversational AI, and voice-powered search experiences',
            icon: '/images/icons/illustrated/dark/ai.png',
            href: '/products/ai-search'
        },
        {
            label: 'Integrations',
            description: 'Connect seamlessly with Shopify, WordPress, Magento, and 10+ platforms',
            icon: '/images/icons/illustrated/dark/integrations.png',
            href: '/products/integrations'
        },
        {
            label: 'Analytics',
            description: 'Track search queries, click-through rates, conversions, and user behavior',
            icon: '/images/icons/illustrated/dark/analytics.png',
            href: '/products/analytics'
        },
        {
            label: 'Widgets',
            description: 'Embeddable search bars, autocomplete, and chat widgets for any website',
            icon: '/images/icons/illustrated/dark/widgets.png',
            href: '/products/widgets'
        },
        {
            label: 'Merchandising',
            description: 'Control search results with synonyms, overrides, and dynamic ranking rules',
            icon: '/images/icons/illustrated/dark/merchandising.png',
            href: '/products/merchandising'
        }
    ];
</script>

<div class="container py-20">
    <div class="mx-auto mb-16 flex max-w-5xl flex-col gap-8">
        <h2 class="text-primary font-aeonik-pro text-title mx-auto max-w-lg text-center">
            Powerful search features, unified platform
        </h2>

        <div class="hidden justify-center gap-8 lg:flex">
            <div
                class={cn(
                    'bg-card border-smooth text-primary flex h-10 items-center gap-4 rounded-full border border-dashed p-1 text-sm'
                )}
            >
                <span class="text-eyebrow text-secondary font-aeonik-fono ml-3 uppercase"
                    >Products</span
                >
                <div class="flex h-full w-full justify-between gap-2">
                    {#each products as product}
                        <a
                            href={product.href}
                            class="bg-greyscale-800 hover:bg-greyscale-750/50 flex h-full w-fit items-center justify-center gap-2 rounded-full px-3 backdrop-blur-lg transition-opacity"
                        >
                            <span
                                class="text-primary text-caption flex items-center justify-center gap-1 font-medium"
                            >
                                <img
                                    loading="lazy"
                                    src={product.icon}
                                    alt={product.label}
                                    class="size-6"
                                />
                                {product.label}</span
                            >
                        </a>
                    {/each}
                </div>
            </div>
        </div>
    </div>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each products as product}
            <a
                href={product.href}
                class="bg-card border-smooth hover:border-primary group relative flex flex-col gap-4 rounded-2xl border p-6 transition-all hover:shadow-lg"
            >
                <div class="flex items-start gap-4">
                    <div class="bg-greyscale-800 flex size-12 shrink-0 items-center justify-center rounded-xl">
                        <img
                            loading="lazy"
                            src={product.icon}
                            alt={product.label}
                            class="size-8"
                        />
                    </div>
                    <div class="flex flex-col gap-2">
                        <h3 class="text-primary text-body font-medium">
                            {product.label}
                        </h3>
                    </div>
                </div>
                <p class="text-secondary text-caption">
                    {product.description}
                </p>
                <div class="mt-auto flex items-center gap-2 text-caption font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Learn more
                    <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </div>
            </a>
        {/each}
    </div>
</div>
