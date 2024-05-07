<script lang="ts">
    import { countryContentStore, countryGraphStore } from '../store/mapStore';
    import { onMount } from 'svelte'
    import { currentImage, currentTable, currentCon } from '../scripts/mapInteractions';

    onMount(() => {
        countryContent = currentTable; 
        countryGraph = currentImage;
        countryCon = currentCon;
    });

    $: countryContent = '';
    $: countryGraph = '';
    $: countryCon = '';
    let src: string;
    
    countryContentStore.subscribe(value => {
        countryContent = value;
    });

    countryGraphStore.subscribe(value => {
        countryGraph = value;
    });

    countryContentStore.subscribe(value => {
        countryCon = value;
    })
</script>

<div class="absolute top-0 right-0 bottom-0 w-1/4 flex flex-col px-6 bg-white text-gray-700 border-b border-gray-200 z-10">
    {@html countryContent}
    {@html countryGraph}
    {@html countryCon}
</div>
