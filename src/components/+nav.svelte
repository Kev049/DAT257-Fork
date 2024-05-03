<script lang="ts">
    import { handleFormSubmit } from "../scripts/mapInteractions";
    import { countryStore } from '../store/mapStore';

    let selectedCountry : string = $countryStore;

    function updateCountry(event: Event) {
        const input = event.target as HTMLInputElement;
        countryStore.set(input.value);
    }

</script>

<nav class="w-full h-20 lg:h-24 grid grid-cols-3 bg-white border-4 border-black">
    <div class="flex justify-start pl-16 items-center m-0 font-ubuntu text-black text-4xl max-h-full gap-2">
        know your energy
    </div>
    <div class="flex justify-center items-center m-0 text-white text-4xl font-dosis">
        <form class="relative w-full flex max-h-full" on:submit="{handleFormSubmit}">
            <input type="search" bind:value={selectedCountry} on:input="{updateCountry}" class="block w-full p-4 pl-10 text-sm text-gray-900 border border-black rounded-lg bg-gray-200 outline-none font-dosis" placeholder="Search countries, continents..." required />
            <button type="submit" class="absolute border-2 right-2 top-2 text-white bg-[#323638] hover:opacity-[75%] focus:ring-4 focus:outline-none font-dosis rounded-lg text-sm px-4 py-2 ">Search</button>
        </form>
    </div>
    <div class="flex justify-end pr-16 items-center m-0 font-dosis text-white text-2xl">
        Menu
    </div>
</nav>