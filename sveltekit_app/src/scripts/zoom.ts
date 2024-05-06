import { onDestroy } from "svelte";
import { viewBoxStore } from "../store/mapStore";

const maxDimensions = { width: 3000, height: 3000 };
const minDimensions = { width: 2, height: 2 };

export interface ViewBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function startDrag(event: MouseEvent): { startX: number; startY: number } {
    // Store the starting position of the mouse
    return {
        startX: event.pageX,
        startY: event.pageY
    };
}

export function onDrag(event: MouseEvent, startX: number, startY: number, viewBox: ViewBox, svgElement: SVGSVGElement): ViewBox {
    const dragFactor: number = 0.1;
    const maxSpeed: number = 20;
    
    let dx: number = (startX - event.pageX) * (viewBox.width / svgElement.clientWidth) * dragFactor;
    let dy: number = (startY - event.pageY) * (viewBox.height / svgElement.clientHeight) * dragFactor;

    if(Math.abs(dx) > maxSpeed){ 
        dx = maxSpeed * Math.sign(dx);
    }

    if(Math.abs(dy) > maxSpeed){ 
        dy = maxSpeed * Math.sign(dy);
    }

    viewBox.x += dx;
    viewBox.y += dy;
    return viewBox;
}

export function zoom(event: WheelEvent, svgElement: SVGSVGElement, viewBox: ViewBox): ViewBox {
    event.preventDefault();

    const scaleFactor = event.deltaY > 0 ? 1.1 : 0.9;

    const newWidth = viewBox.width * scaleFactor;
    const newHeight = viewBox.height * scaleFactor;

    // Dimension constraints
    if (newWidth > maxDimensions.width || newHeight > maxDimensions.height) {
        return viewBox; 
    }
    if (newWidth < minDimensions.width || newHeight < minDimensions.height) {
        return viewBox;
    }

    // Calculate the new viewBox origin
    const rect = svgElement.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) / rect.width * viewBox.width + viewBox.x;
    const mouseY = (event.clientY - rect.top) / rect.height * viewBox.height + viewBox.y;

    viewBox.x = mouseX - (event.clientX - rect.left) / rect.width * newWidth;
    viewBox.y = mouseY - (event.clientY - rect.top) / rect.height * newHeight;
    viewBox.width = newWidth;
    viewBox.height = newHeight;

    return viewBox;
}

export function zoomToCountry(svgElement: SVGSVGElement, viewBox: ViewBox, countryId: string): void {
    countryId = countryId.replace(/ /g, "\\ ");
    const country = svgElement.querySelector(`#${countryId}`) as SVGGraphicsElement | null;
    
    if (!country) return;
    const bbox: DOMRect = country.getBBox();
    let padding: number = Math.max(2, (bbox.width + bbox.height) / 2);

    const targetViewBox: ViewBox = {
        x: bbox.x - (bbox.width / 1.5),
        y: bbox.y,
        width: bbox.width + 2 * padding,
        height: bbox.height + 2 * padding
    };

    const duration: number = 500;
    const startTime: number = Date.now();

    function animate(): void {
        const currentTime: number = Date.now();
        const elapsedTime: number = currentTime - startTime;
        const progress: number = Math.min(elapsedTime / duration, 1); 

        viewBox.x = viewBox.x + (targetViewBox.x - viewBox.x) * progress;
        viewBox.y = viewBox.y + (targetViewBox.y - viewBox.y) * progress;
        viewBox.width = viewBox.width + (targetViewBox.width - viewBox.width) * progress;
        viewBox.height = viewBox.height + (targetViewBox.height - viewBox.height) * progress;

        svgElement.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            viewBoxStore.set(viewBox);
        }
    }
    requestAnimationFrame(animate);
}