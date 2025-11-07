<script lang="ts">
    import { cn } from '$lib/utils/cn';
    import GradientText from '$lib/components/fancy/gradient-text.svelte';
    import { trackEvent } from '$lib/actions/analytics';

    interface Platform {
        name: string;
        category: 'ecommerce' | 'cms' | 'language' | 'framework';
        href: string;
        logo?: string;
    }

    interface PlatformsProps {
        class?: string;
        padded?: boolean;
    }

    const { class: className, padded = true }: PlatformsProps = $props();

    const platforms: Platform[] = [
        // E-commerce
        {
            name: 'Shopify',
            category: 'ecommerce',
            href: '/integrations/shopify'
        },
        {
            name: 'WooCommerce',
            category: 'ecommerce',
            href: '/integrations/woocommerce'
        },
        {
            name: 'Magento',
            category: 'ecommerce',
            href: '/integrations/magento'
        },
        {
            name: 'PrestaShop',
            category: 'ecommerce',
            href: '/integrations/prestashop'
        },
        {
            name: 'BigCommerce',
            category: 'ecommerce',
            href: '/integrations/bigcommerce'
        },

        // CMS
        {
            name: 'WordPress',
            category: 'cms',
            href: '/integrations/wordpress'
        },
        {
            name: 'Ghost',
            category: 'cms',
            href: '/integrations/ghost'
        },
        {
            name: 'Strapi',
            category: 'cms',
            href: '/integrations/strapi'
        },
        {
            name: 'Contentful',
            category: 'cms',
            href: '/integrations/contentful'
        },
        {
            name: 'Sanity',
            category: 'cms',
            href: '/integrations/sanity'
        },
        {
            name: 'Webflow',
            category: 'cms',
            href: '/integrations/webflow'
        },

        // Languages
        {
            name: 'JavaScript',
            category: 'language',
            href: '/docs/sdk/javascript'
        },
        {
            name: 'Python',
            category: 'language',
            href: '/docs/sdk/python'
        },
        {
            name: 'PHP',
            category: 'language',
            href: '/docs/sdk/php'
        },
        {
            name: 'Ruby',
            category: 'language',
            href: '/docs/sdk/ruby'
        },
        {
            name: 'Go',
            category: 'language',
            href: '/docs/sdk/go'
        },

        // Frameworks
        {
            name: 'Next.js',
            category: 'framework',
            href: '/docs/frameworks/nextjs'
        },
        {
            name: 'React',
            category: 'framework',
            href: '/docs/frameworks/react'
        },
        {
            name: 'Vue',
            category: 'framework',
            href: '/docs/frameworks/vue'
        },
        {
            name: 'Svelte',
            category: 'framework',
            href: '/docs/frameworks/svelte'
        },
        {
            name: 'Angular',
            category: 'framework',
            href: '/docs/frameworks/angular'
        }
    ];

    const categories = [
        {
            id: 'ecommerce',
            label: 'E-commerce',
            description: 'Connect your online store to AACSearch'
        },
        {
            id: 'cms',
            label: 'CMS',
            description: 'Sync content from your CMS platform'
        },
        {
            id: 'language',
            label: 'Languages',
            description: 'Build with your preferred programming language'
        },
        {
            id: 'framework',
            label: 'Frameworks',
            description: 'Integrate with modern web frameworks'
        }
    ];

    function getPlatformsByCategory(category: string) {
        return platforms.filter(p => p.category === category);
    }
</script>

<div class={cn('py-16', className)}>
    <div class="container">
        <div class="mx-auto mb-12 flex max-w-3xl flex-col gap-4">
            <h2 class="text-primary font-aeonik-pro text-title">
                <GradientText>Integrations & Platforms</GradientText>
            </h2>
            <p class="text-secondary text-sub-body max-w-2xl">
                AACSearch seamlessly integrates with leading e-commerce platforms, CMS solutions, and development frameworks. Connect instantly and start syncing your data in minutes.
            </p>
        </div>

        <div class="space-y-12">
            {#each categories as category}
                {@const categoryPlatforms = getPlatformsByCategory(category.id)}
                <div class="space-y-4">
                    <div>
                        <h3 class="text-primary font-aeonik-pro text-label mb-1">
                            {category.label}
                        </h3>
                        <p class="text-secondary text-caption">
                            {category.description}
                        </p>
                    </div>

                    <div class="border-smooth border-dashed border rounded-xl p-6 bg-white/2">
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {#each categoryPlatforms as platform}
                                <a
                                    href={platform.href}
                                    class={cn(
                                        'border-smooth border-dashed border rounded-lg p-4',
                                        'flex items-center justify-center text-center',
                                        'transition-all duration-300',
                                        'hover:bg-white/5 hover:shadow-[0px_0px_0px_2px_var(--color-offset)]',
                                        'focus:shadow-[0px_0px_0px_2px_var(--color-offset)]'
                                    )}
                                    onclick={() =>
                                        trackEvent(
                                            `integration-${platform.name.replace(/\s+/g, '-').toLowerCase()}-click`
                                        )}
                                >
                                    <span class="text-primary font-medium text-sm">
                                        {platform.name}
                                    </span>
                                </a>
                            {/each}
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <div class="mt-12 border-t border-white/10 pt-8">
            <div class="text-center">
                <p class="text-secondary text-sub-body mb-4">
                    Don't see your platform? We support custom integrations through webhooks and REST APIs.
                </p>
                <a
                    href="/docs/integrations/custom"
                    class="text-primary font-medium text-eyebrow hover:underline inline-flex items-center gap-2"
                    onclick={() => trackEvent('custom-integration-docs-click')}
                >
                    Build Custom Integration
                    <span class="text-secondary">→</span>
                </a>
            </div>
        </div>
    </div>
</div>
