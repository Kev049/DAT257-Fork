import { get } from 'svelte/store';
import { viewBoxStore } from '../store/mapStore';
import proj4 from 'proj4';

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

proj4.defs("ROBINSON", "+proj=robin +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");

const wgs84 = 'EPSG:4326';
const robinson = '+proj=robin +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs';  // Robinson projection string

function convertCoordinates(lat: number, lon: number, svgDimensions: SVGDimensions): SVGCoordinate {
    const { width, height } = svgDimensions;

    lon -= 2.5;

    const minY = proj4(wgs84, robinson, [0, -60])[1];
    const maxY = proj4(wgs84, robinson, [0, 85])[1];

    // Transform coordinates
    let [x, y] = proj4(wgs84, robinson, [lon, lat]);

    const minX = proj4(wgs84, robinson, [-180, 0])[0];
    const maxX = proj4(wgs84, robinson, [180, 0])[0];

    const effectiveWidth = maxX - minX;
    const effectiveHeight = maxY - minY;
    const xScale = width / effectiveWidth;
    const yScale = height / effectiveHeight;

    x = (x - minX) * xScale;
    y = height - ((y - minY) * yScale);  // Y-axis points down, have to adjust

    return { x, y };
}

function calculateIntensity(solarEnergy: number): number {
    const maxEnergy = 3000;  // Max expected solar energy
    return Math.min(solarEnergy / maxEnergy, 1);
}

export function createHeatmapPoints(data: DataPoint[], svgElement: SVGSVGElement): void {
    let svgDimensions: SVGDimensions = { width: get(viewBoxStore).width, height: get(viewBoxStore).height}
    data.forEach(point => {
        const { x, y } = convertCoordinates(point.latitude, point.longitude, svgDimensions);
        const intensity = calculateIntensity(point.solarEnergy);

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x.toString());
        circle.setAttribute("cy", y.toString());
        circle.setAttribute("r", "5");
        circle.setAttribute("fill", `rgba(255, 0, 0, ${intensity})`); // Red with variable opacity

        svgElement.appendChild(circle);
    });
}