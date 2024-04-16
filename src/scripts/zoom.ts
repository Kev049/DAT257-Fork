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
    const dragFactor = 0.1;
    
    const dx = (startX - event.pageX) * (viewBox.width / svgElement.clientWidth) * dragFactor;
    const dy = (startY - event.pageY) * (viewBox.height / svgElement.clientHeight) * dragFactor;

    viewBox.x += dx;
    viewBox.y += dy;

    return viewBox;
}

export function zoom(event: WheelEvent, svgElement: SVGSVGElement, viewBox: ViewBox): ViewBox {
    event.preventDefault();

    // Define maximum and minimum dimensions
    const maxDimensions = { width: 3000, height: 1000 };
    const minDimensions = { width: 150, height: 50 };

    // Calculate the scale factor based on the wheel direction
    const scaleFactor = event.deltaY < 0 ? 1.1 : 0.9;

    // Proposed new dimensions
    const newWidth = viewBox.width * scaleFactor;
    const newHeight = viewBox.height * scaleFactor;

    // Ensure the new dimensions do not exceed maximum or minimum bounds
    if (newWidth > maxDimensions.width || newHeight > maxDimensions.height) {
        return viewBox; // Return current viewBox if proposed dimensions are too large
    }
    if (newWidth < minDimensions.width || newHeight < minDimensions.height) {
        return viewBox; // Return current viewBox if proposed dimensions are too small
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