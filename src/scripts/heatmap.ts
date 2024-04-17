import { get } from 'svelte/store';
import { viewBoxStore } from '../store/mapStore';

export interface DataPoint {
    latitude: number;
    longitude: number;
    solarEnergy: number;
}

interface SVGDimensions {
    width: number;
    height: number;
}

interface SVGCoordinate {
    x: number;
    y: number;
}

const boundingBox = {
    north: 80,
    south: -90,
    east: 180,
    west: -180
};

function convertCoords(lat: number, lon: number, svgDimensions: SVGDimensions): SVGCoordinate {
    const { north, south, east, west } = boundingBox;
    const { width, height } = svgDimensions;

    let x = ((lon - west) / (east - west)) * width;
    let y = ((north - lat) / (north - south)) * height;

    return { x, y };
}

function calculateIntensity(solarEnergy: number): number {
    // Example normalization: Adjust as needed based on data range
    const maxEnergy = 3000;  // Max expected solar energy
    return Math.min(solarEnergy / maxEnergy, 1);
}

export function createHeatmapPoints(data: DataPoint[], svgElement: SVGSVGElement): void {
    let svgDimensions: SVGDimensions = { width: get(viewBoxStore).width, height: get(viewBoxStore).height}
    data.forEach(point => {
        const { x, y } = convertCoords(point.latitude, point.longitude, svgDimensions);
        const intensity = calculateIntensity(point.solarEnergy);

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x.toString());
        circle.setAttribute("cy", y.toString());
        circle.setAttribute("r", "5"); // Radius can be adjusted based on preference
        circle.setAttribute("fill", `rgba(255, 0, 0, ${intensity})`); // Red with variable opacity

        svgElement.appendChild(circle);
    });
}