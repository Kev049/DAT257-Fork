import { writable } from "svelte/store";

export let countryStore = writable('');
export let tooltipToggler = writable(false);
export let sidepanelToggler = writable(false);
export let countryContentStore = writable('');
export let xStore = writable(0);
export let yStore = writable(0);