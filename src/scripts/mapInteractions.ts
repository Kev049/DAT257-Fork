import { get } from 'svelte/store';
import { countryStore, tooltipToggler, sidepanelToggler, countryContentStore, xStore, yStore} from '../store/mapStore';

export let tooltipContent: string = '';

export function handleFormSubmit(event: Event) {
    event.preventDefault();
    updateHighlights();
}

function updateHighlights() {
    const groups = document.querySelectorAll('svg g');
    groups.forEach(g => {
        g.querySelectorAll('path').forEach(path => {
            path.classList.remove('highlight');
        });
    });

    groups.forEach(g => {
        const paths = g.querySelectorAll('path');
        if (g.id.toLowerCase() === get(countryStore).toLowerCase()) {
            paths.forEach(path => {
                path.classList.add('highlight');
            });
        }
    });
}

export function setupMapInteractions(svgElement : SVGSVGElement) {
    svgElement.addEventListener('mouseover', handleMouseOver);
    svgElement.addEventListener('mousemove', handleMouseMove);
    svgElement.addEventListener('mouseout', handleMouseOut);
    svgElement.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleEscapeDown);
    document.addEventListener('click', handleClickOnSite);

    function handleMouseOver(event: MouseEvent) {
        if (event.target) {
            const target = event.target as Element;
            const closestGroup = target.closest('g');
            if (closestGroup) {
                tooltipToggler.set(true);
                tooltipContent = closestGroup.id;
            }
        }
    }

    function handleMouseMove(event: MouseEvent) {
        if (tooltipToggler) {
            let tooltipX = event.pageX < window.innerWidth - 100 ? event.pageX + 10 : event.pageX - 35;
            let tooltipY = event.pageY - 25;
            xStore.set(tooltipX);
            yStore.set(tooltipY);
        }
    }

    function handleMouseOut() {
        tooltipToggler.set(false);
    }

    function handleClick(event: MouseEvent) {
        if (event.target) {
            const target = event.target as Element;
            const closestGroup = target.closest('g');
            if (closestGroup) {
                tooltipToggler.set(!get(tooltipToggler));
                toggleSidePanel(closestGroup.id);
            }
        }
    }

    function toggleSidePanel(content: string): void {
        if (!get(sidepanelToggler) || content !== get(countryStore)) {
            sidepanelToggler.set(true);
            countryContentStore.set(content);
        }
        else {
            sidepanelToggler.set(false);
        }
    }

    function handleEscapeDown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            sidepanelToggler.set(false);
        }
    }

    function handleClickOnSite(event: MouseEvent) {
        const target = event.target as Element | null;
        if (!target?.closest('g')) {
            if (get(sidepanelToggler)) {
                sidepanelToggler.set(false);
            }
        }
    }

    return () => {
        svgElement.removeEventListener('mouseover', handleMouseOver);
        svgElement.removeEventListener('mousemove', handleMouseMove);
        svgElement.removeEventListener('mouseout', handleMouseOut);
        svgElement.removeEventListener('click', handleClick);
        document.removeEventListener('keydown', handleEscapeDown);
        document.removeEventListener('click', handleClickOnSite);
    };
}