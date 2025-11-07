<script lang="ts">
    import { cn } from '$lib/utils/cn';
    import { trackEvent } from '$lib/actions/analytics';

    interface ProductCard {
        id: string;
        title: string;
        tagline: string;
        description: string;
        features: string[];
        icon: string;
        href: string;
    }

    const products: ProductCard[] = [
        {
            id: 'search-core',
            title: 'Search Core',
            tagline: 'Fast & Powerful',
            description: 'Enterprise full-text search engine with typo tolerance and advanced ranking.',
            features: [
                'Full-text search with typo tolerance',
                'Multi-language support (30+ languages)',
                'Faceted search and filtering'
            ],
            icon: '/images/icons/illustrated/dark/search-core.png',
            href: '/products/search-core'
        },
        {
            id: 'ai-search',
            title: 'AI Search',
            tagline: 'Intelligent Results',
            description: 'Natural language and conversational search powered by vector embeddings and LLMs.',
            features: [
                'Natural language processing',
                'Conversational RAG search',
                'AI-powered understanding'
            ],
            icon: '/images/icons/illustrated/dark/ai-search.png',
            href: '/products/ai-search'
        },
        {
            id: 'integrations',
            title: 'Integrations',
            tagline: 'Connect & Sync',
            description: 'Connect 10+ platforms instantly with automatic data synchronization.',
            features: [
                'E-commerce (Shopify, WooCommerce, Magento)',
                'CMS (WordPress, Ghost, Strapi, Contentful)',
                'Real-time webhooks and sync'
            ],
            icon: '/images/icons/illustrated/dark/integrations.png',
            href: '/products/integrations'
        },
        {
            id: 'analytics',
            title: 'Analytics',
            tagline: 'Insights & Metrics',
            description: 'Search insights, performance metrics, and no-hit query tracking for optimization.',
            features: [
                'Real-time search analytics',
                'No-hits detection and reporting',
                'Click tracking and A/B testing'
            ],
            icon: '/images/icons/illustrated/dark/analytics.png',
            href: '/products/analytics'
        },
        {
            id: 'widgets',
            title: 'Widgets',
            tagline: 'Embed & Deploy',
            description: 'Embeddable search and chat widgets for instant integration into any site.',
            features: [
                'Pre-built search widget',
                'AI chat widget (RAG)',
                'Customizable UI and branding'
            ],
            icon: '/images/icons/illustrated/dark/widgets.png',
            href: '/products/widgets'
        },
        {
            id: 'merchandising',
            title: 'Merchandising',
            tagline: 'Control Results',
            description: 'Control search results and rankings with synonyms, overrides, and rules.',
            features: [
                'Synonyms (multi-way and one-way)',
                'Result pinning and exclusions',
                'Dynamic merchandising rules'
            ],
            icon: '/images/icons/illustrated/dark/merchandising.png',
            href: '/products/merchandising'
        }
    ];
</script>

<div class="container py-20">
    <div class="mx-auto mb-16 flex max-w-5xl flex-col gap-8">
        <h2 class="text-primary font-aeonik-pro text-title mx-auto max-w-lg text-center">
            Complete Search Platform
        </h2>
        <p class="text-secondary text-center mx-auto max-w-2xl">
            Enterprise-grade search solution with AI, integrations, and advanced merchandising
        </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each products as product}
            <a
                href={product.href}
                class={cn(
                    'border-smooth group relative flex flex-col rounded-2xl border bg-white/2 p-6',
                    'transition-all duration-300 hover:shadow-[0px_0px_0px_4px_var(--color-offset)]',
                    'focus:shadow-[0px_0px_0px_4px_var(--color-offset)]'
                )}
                onclick={() => trackEvent(`product-card-${product.id}-click`)}
            >
                <div class="space-y-4 flex-1">
                    <div class="flex items-center gap-3">
                        <img
                            loading="lazy"
                            src={product.icon}
                            alt="{product.title} icon"
                            class="size-8"
                        />
                        <div>
                            <h3 class="font-aeonik-pro text-label text-primary">
                                {product.title}
                            </h3>
                            <p class="text-eyebrow text-secondary font-medium">
                                {product.tagline}
                            </p>
                        </div>
                    </div>

                    <p class="text-sub-body text-primary max-w-lg font-medium line-clamp-2">
                        <span class="text-secondary">{product.description}</span>
                    </p>

                    <ul class="space-y-2 pt-2">
                        {#each product.features as feature}
                            <li class="text-caption text-secondary flex items-start gap-2">
                                <span class="text-primary/60 mt-1">•</span>
                                <span>{feature}</span>
                            </li>
                        {/each}
                    </ul>
                </div>

                <div class="mt-6 pt-4 border-t border-white/10">
                    <span class="text-eyebrow text-primary font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                        Learn more
                        <span class="text-secondary group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                </div>
            </a>
        {/each}
    </div>
</div>
