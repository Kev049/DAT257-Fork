<script lang="ts">
    import { countryContentStore } from '../store/mapStore';

    let countryContent: string = '';

    countryContentStore.subscribe(value => {
        countryContent = value;
    });
    //console.log(countryContent);
</script>


<div class ="flex">
    <aside id="slide-panel" class="flex max-h-full fixed h-full items-center max w-1/5 right-0 top-0 justify-between px-6 bg-white text-gray-700 border-b border-gray-200 z-10">
      {@html countryContent}
    </aside>
    <img src="/country_graph.png" alt="Country" width="500" height="400">
</div>