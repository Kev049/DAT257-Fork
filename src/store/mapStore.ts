import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import type { ViewBox } from "../scripts/zoom";

export let countryStore = writable('');
export let tooltipToggler = writable(false);
export let sidepanelToggler = writable(false);
export let countryContentStore = writable('');
export let countryGraphStore = writable('');
export let xStore = writable(0);
export let yStore = writable(0);
export let viewBoxStore: Writable<ViewBox> = writable({
    x: 0,
    y: 0,
    width: 2000,
    height: 857
});
export let imageStore = writable("/country_graph.png");