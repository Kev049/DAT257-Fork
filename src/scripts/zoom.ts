export interface ViewBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function zoom(event: WheelEvent, svgElement: SVGSVGElement, viewBox: ViewBox): ViewBox {
    event.preventDefault();

    // Calculate the scale factor based on the wheel direction
    const scaleFactor = event.deltaY < 0 ? 1.1 : 0.9;

    // Get the dimensions of the SVG element
    const svgRect = svgElement.getBoundingClientRect();

    // Compute the mouse position relative to the SVG content
    const mouseX = (event.clientX - svgRect.left) / svgRect.width * viewBox.width + viewBox.x;
    const mouseY = (event.clientY - svgRect.top) / svgRect.height * viewBox.height + viewBox.y;

    // Calculate the new viewBox dimensions
    const newWidth = viewBox.width * scaleFactor;
    const newHeight = viewBox.height * scaleFactor;

    // Calculate the new viewBox origin
    viewBox.x = mouseX - (event.clientX - svgRect.left) / svgRect.width * newWidth;
    viewBox.y = mouseY - (event.clientY - svgRect.top) / svgRect.height * newHeight;

    viewBox.width = newWidth;
    viewBox.height = newHeight;

    return viewBox;
}