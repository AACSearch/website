<script lang="ts" module>
    // Logo imports - placeholder paths (replace with actual assets)
    import CaseStudyCard from './case-study-card.svelte';

    interface Testimonial {
        id: string;
        company: string;
        industry: string;
        logo: string;
        quote: string;
        metric: string;
        metricValue: string;
        name: string;
        title: string;
        avatar: string;
        url: string;
    }

    const studies: Testimonial[] = [
        {
            id: 'ecommerce-1',
            company: 'StyleHub',
            industry: 'E-commerce',
            logo: '/images/logos/stylehub.png',
            quote: 'AACSearch transformed our product discovery experience. Within 3 months, we saw customers finding exactly what they wanted with fewer clicks. The search-to-purchase conversion skyrocketed.',
            metric: 'Conversion Rate',
            metricValue: '+47% increase',
            name: 'Sarah Chen',
            title: 'VP of Product at StyleHub',
            avatar: '/images/testimonials/sarah-chen.png',
            url: '/blog/post/customer-story-stylehub'
        },
        {
            id: 'content-2',
            company: 'MediaFlow',
            industry: 'Content Platform',
            logo: '/images/logos/mediaflow.png',
            quote: 'Our editorial team spends less time managing content and more time creating it. AACSearch\'s AI-powered search keeps our readers engaged longer with personalized discovery.',
            metric: 'User Engagement',
            metricValue: '+63% session duration',
            name: 'Marcus Johnson',
            title: 'Content Director at MediaFlow',
            avatar: '/images/testimonials/marcus-johnson.png',
            url: '/blog/post/customer-story-mediaflow'
        },
        {
            id: 'saas-3',
            company: 'CloudConnectX',
            industry: 'SaaS Application',
            logo: '/images/logos/cloudconnectx.png',
            quote: 'Integration was seamless. Our API response times improved by 40% while handling 3x more queries. The search felt native to our platform from day one.',
            metric: 'Integration Speed',
            metricValue: '2 hours implementation',
            name: 'Alex Rodriguez',
            title: 'Engineering Lead at CloudConnectX',
            avatar: '/images/testimonials/alex-rodriguez.png',
            url: '/blog/post/customer-story-cloudconnectx'
        },
        {
            id: 'enterprise-4',
            company: 'SecureVault Corp',
            industry: 'Enterprise',
            logo: '/images/logos/securevault.png',
            quote: 'Enterprise security was non-negotiable. AACSearch delivered SOC 2 compliance, encryption, and audit logs out of the box. Our security team approved it in record time.',
            metric: 'Security & Compliance',
            metricValue: 'SOC 2 Type II certified',
            name: 'Dr. Patricia Williams',
            title: 'Chief Information Officer at SecureVault',
            avatar: '/images/testimonials/patricia-williams.png',
            url: '/blog/post/customer-story-securevault'
        },
        {
            id: 'startup-5',
            company: 'FastLaunch',
            industry: 'Startup',
            logo: '/images/logos/fastlaunch.png',
            quote: 'We needed to ship fast without sacrificing quality. AACSearch\'s free tier let us launch with sophisticated search features. We scaled to paying tier within weeks as our user base grew.',
            metric: 'Time-to-Market',
            metricValue: '-75% faster launch',
            name: 'Jamie Liu',
            title: 'Founder at FastLaunch',
            avatar: '/images/testimonials/jamie-liu.png',
            url: '/blog/post/customer-story-fastlaunch'
        },
        {
            id: 'marketplace-6',
            company: 'TradersHub',
            industry: 'Marketplace',
            logo: '/images/logos/tradershub.png',
            quote: 'Running a multi-tenant marketplace required bulletproof data isolation and performance. AACSearch\'s architecture scaled beautifully as we onboarded hundreds of sellers and thousands of buyers.',
            metric: 'Multi-Tenant Capability',
            metricValue: '500+ isolated tenants',
            name: 'Kevin Park',
            title: 'CTO at TradersHub',
            avatar: '/images/testimonials/kevin-park.png',
            url: '/blog/post/customer-story-tradershub'
        }
    ];

    export type CaseStudy = (typeof studies)[number];
</script>

<script lang="ts">
    import { cn } from '$lib/utils/cn';
    import { ToggleGroup } from 'bits-ui';

    let value = $state<string>('0');

    const getValue = () => {
        return value;
    };

    const setValue = (newValue: string) => {
        if (!newValue.length) return;
        value = newValue;
    };

    const selectedStudy = $derived.by(() => {
        const index = parseInt(value);
        return studies[index];
    });
</script>

<div
    class={cn(
        'border-smooth relative mb-0 flex items-center justify-center overflow-hidden border-t py-20 md:pt-30 md:pb-40',
        'from-0% before:absolute before:inset-0 before:top-0 before:left-0 before:-z-10 before:block before:h-full before:bg-radial-[circle_at_120%_-50%] before:from-purple-500/30 before:to-transparent before:to-40% before:blur-2xl',
        'after:from-accent/20 after:absolute after:inset-0 after:top-0 after:right-0 after:-z-10 after:mt-auto after:mb-0 after:block after:h-full after:bg-radial-[circle_at_-15%_125%] after:from-0% after:to-transparent after:to-40% after:blur-2xl'
    )}
>
    <div class="container">
        <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Trusted by companies across industries
        </h2>

        <div class="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Testimonial Cards */}
            <div class="flex flex-col gap-4 lg:h-full">
                <ToggleGroup.Root
                    bind:value={getValue, setValue}
                    type="single"
                    class="flex flex-col gap-4 h-full"
                >
                    {#each studies as study, index}
                        <button
                            onclick={() => setValue(index.toString())}
                            class={cn(
                                'text-left p-6 rounded-lg border transition-all duration-300 cursor-pointer hover:border-accent/50',
                                value === index.toString()
                                    ? 'border-accent bg-accent/10 ring-2 ring-accent/30'
                                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                            )}
                        >
                            <div class="flex items-start justify-between mb-3">
                                <div class="flex-1">
                                    <div class="text-sm font-semibold text-accent uppercase tracking-wide">
                                        {study.industry}
                                    </div>
                                    <h4 class="text-lg font-bold text-white mt-1">{study.company}</h4>
                                </div>
                                <div class="ml-4 px-3 py-1 rounded bg-white/10 text-xs font-semibold text-white whitespace-nowrap">
                                    {study.metricValue}
                                </div>
                            </div>

                            <p class="text-sm text-secondary line-clamp-2 mb-3">
                                {study.quote}
                            </p>

                            <div class="flex items-center gap-3">
                                <img
                                    src={study.avatar}
                                    alt={study.name}
                                    class="w-10 h-10 rounded-full bg-white/10 object-cover"
                                />
                                <div class="text-xs">
                                    <div class="font-semibold text-white">{study.name}</div>
                                    <div class="text-secondary">{study.title}</div>
                                </div>
                            </div>
                        </button>
                    {/each}
                </ToggleGroup.Root>
            </div>

            {/* Expanded Testimonial */}
            {#if selectedStudy}
                <div class="relative h-full flex items-center">
                    <div class="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-2xl blur-3xl opacity-50"></div>
                    <div class="relative border border-accent/30 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 md:p-10">
                        <div class="flex items-center gap-3 mb-6">
                            <img
                                src={selectedStudy.avatar}
                                alt={selectedStudy.name}
                                class="w-16 h-16 rounded-full object-cover border-2 border-accent"
                            />
                            <div>
                                <h4 class="text-lg font-bold text-white">{selectedStudy.name}</h4>
                                <p class="text-sm text-secondary">{selectedStudy.title}</p>
                                <p class="text-xs text-accent font-semibold mt-1">{selectedStudy.industry}</p>
                            </div>
                        </div>

                        <blockquote class="text-lg md:text-xl text-white font-medium leading-relaxed mb-8 border-l-4 border-accent pl-4">
                            {selectedStudy.quote}
                        </blockquote>

                        <div class="grid grid-cols-2 gap-4 mb-8 p-6 bg-white/5 rounded-lg border border-white/10">
                            <div>
                                <div class="text-xs uppercase font-semibold text-accent tracking-wide">
                                    {selectedStudy.metric}
                                </div>
                                <div class="text-2xl font-bold text-white mt-2">
                                    {selectedStudy.metricValue}
                                </div>
                            </div>
                            <div>
                                <div class="text-xs uppercase font-semibold text-accent tracking-wide">
                                    Company
                                </div>
                                <div class="text-2xl font-bold text-white mt-2">
                                    {selectedStudy.company}
                                </div>
                            </div>
                        </div>

                        <a
                            href={selectedStudy.url}
                            class="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-semibold text-sm transition-colors"
                        >
                            Read full case study
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>
