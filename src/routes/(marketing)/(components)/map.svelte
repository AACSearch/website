<script lang="ts">
    import TheAACSearchNetwork from '$lib/components/aacsearch-network/map.svelte';
    import { Button } from '$lib/components/ui';
    import { cn } from '$lib/utils/cn';

    type Props = {
        theme?: 'light' | 'dark';
    };

    const { theme = 'light' }: Props = $props();
</script>

<div class={cn('border-smooth -mt-6 border-b pb-12 md:py-32', theme)}>
    <div class="mb-12 flex flex-col items-center gap-6 text-center">
        <h2 class="text-primary font-aeonik-pro text-title">
            The AACSearch Network<span class="text-accent">_</span>
        </h2>
        <p
            class="text-description text-secondary max-w-[90%] font-medium md:max-w-[75%] lg:max-w-[40%]"
        >
            Pick one of our many cloud regions or edges to meet your project's needs and reduce
            latency.
        </p>
        <Button variant="secondary" href="/the-aacsearch-network"
            >More about the AACSearch Network</Button
        >
    </div>
    <TheAACSearchNetwork {theme} />
</div>
