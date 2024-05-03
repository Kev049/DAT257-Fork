<script lang="ts">
    import { countryContentStore, countryGraphStore } from '../store/mapStore';
    import { onMount } from 'svelte'
    import { currentImage, currentTable } from '../scripts/mapInteractions';

    onMount(() => {
        countryContent = currentTable; 
        countryGraph = currentImage;
    });

    $: countryContent = 'Hej';
    $: countryGraph = 'Da';
    let src: string;
    
    countryContentStore.subscribe(value => {
        countryContent = value;
    });

    countryGraphStore.subscribe(value => {
        countryGraph = value;
    });
</script>


<div class ="flex">
    <aside id="slide-panel" class="flex max-h-full fixed h-full items-center max w-1/5 right-0 top-0 justify-between px-6 bg-white text-gray-700 border-b border-gray-200 z-10">
      {@html countryContent}
    </aside>
    {@html countryGraph}
</div>