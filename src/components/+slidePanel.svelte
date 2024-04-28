<script lang="ts">
    import { countryContentStore } from '../store/mapStore';

    let countryContent: string = '';

    countryContentStore.subscribe(value => {
        countryContent = value;
    });
    //console.log(countryContent);
</script>

<div class="absolute top-0 right-0 bottom-0 w-1/5 flex flex-col justify-between px-6 bg-white text-gray-700 border-b border-gray-200 z-10">
    {@html countryContent}
</div>
