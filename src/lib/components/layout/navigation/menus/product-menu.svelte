<script lang="ts">
    import { NavigationMenu } from 'bits-ui';
    import MenuWrapper from './menu-wrapper.svelte';
    import { cn } from '$lib/utils/cn';

    const products: { name: string; href: string; description: string }[] = [
        {
            name: 'Search Core',
            href: '/products/search-core',
            description: 'Fast and powerful search engine core.'
        },
        {
            name: 'AI Search',
            href: '/products/ai-search',
            description: 'Intelligent search powered by machine learning.'
        },
        {
            name: 'Integrations',
            href: '/products/integrations',
            description: 'Connect with your favorite tools and platforms.'
        },
        {
            name: 'Widgets',
            href: '/products/widgets',
            description: 'Customizable search widgets for any website.'
        },
        {
            name: 'Analytics',
            href: '/products/analytics',
            description: 'Track and analyze search behavior and insights.'
        },
        {
            name: 'Merchandising',
            href: '/products/merchandising',
            description: 'Optimize product discovery and conversions.'
        },
        {
            name: 'Multi-Search',
            href: '/products/multi-search',
            description: 'Search across multiple data sources seamlessly.'
        },
        {
            name: 'Advanced Search',
            href: '/products/advanced-search',
            description: 'Complex queries with advanced filtering options.'
        },
        {
            name: 'Developer Tools',
            href: '/products/developer-tools',
            description: 'SDKs, APIs, and tools for developers.'
        },
        {
            name: 'Enterprise',
            href: '/products/enterprise',
            description: 'Enterprise-grade search with premium support.'
        }
    ];
</script>

<MenuWrapper>
    <div class="grid gap-3 p-3 sm:w-[400px] sm:p-6 md:w-[600px] md:grid-cols-2 lg:w-[800px]">
        {#each products as product}
            <NavigationMenu.Link
                class="hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none"
                href={product.href}
            >
                <div class="text-sm leading-none font-medium">{product.name}</div>
                <p class="text-muted-foreground line-clamp-2 text-sm leading-snug">
                    {product.description}
                </p>
            </NavigationMenu.Link>
        {/each}
    </div>
</MenuWrapper>
