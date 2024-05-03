import { select, scaleSequential, contourDensity, geoPath, interpolateInferno, selectAll } from 'd3';
import proj4 from 'proj4';
import { csv } from 'd3-fetch';

export interface DataPoint {
    latitude: number;
    longitude: number;
    radiation: number;
}

interface SVGDimensions {
    width: number;
    height: number;
}

interface SVGCoordinate {
    x: number;
    y: number;
}

export async function fetchCSVData(): Promise<DataPoint[]> {
    const url: string = "src/python/heat.csv"
    try {
        const data: DataPoint[] = await csv(url, (d: any) => ({
            latitude: +d.lat,
            longitude: +d.long,
            radiation: +d.irr_data
        }));
        return data;
    } catch (error) {
        console.error('Error fetching or parsing CSV data:', error);
        return [];
    }
}
// Using proj4js to project geographical coordinates using Robinson projection. 
// There's a lot of hard coding as the SVG we use does not include Antarctica and is a variation of a normal Robinson projection. 

const wgs84 = 'EPSG:4326'; // Output
const robinson = '+proj=robin +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs';  // Robinson projection string

function convertCoordinates(lat: number, lon: number, svgDimensions: SVGDimensions): SVGCoordinate {
    const { width, height } = svgDimensions;

    // I have adjusted the degrees below to fit our map, normal maps have longitude(-180, 180) and latitude(-90, 90) for reference
    const minY = proj4(wgs84, robinson, [0, -56.5])[1];
    const maxY = proj4(wgs84, robinson, [0, 85])[1];
    const minX = proj4(wgs84, robinson, [-173, 0])[0];
    const maxX = proj4(wgs84, robinson, [178, 0])[0];

    // Transform coordinates
    let [x, y] = proj4(wgs84, robinson, [lon, lat]);

    // Adapting to the SVG
    const effectiveWidth = maxX - minX;
    const effectiveHeight = maxY - minY;
    const xScale = width / effectiveWidth;
    const yScale = height / effectiveHeight;

    x = (x - minX) * xScale;
    y = height - ((y - minY) * yScale);  // Y-axis points down, have to adjust

    return { x, y };
}

// I use the D3 library to render a contour density map according to the radiation level.
export async function renderHeatmap(svgElement: SVGSVGElement, data: DataPoint[]): Promise<void> {
    const svgDimensions: SVGDimensions = { width: svgElement.viewBox.baseVal.width, height: svgElement.viewBox.baseVal.height };

     // Define a clip path using all country outlines
     const defs = select(svgElement).append('defs');
     const clipPath = defs.append('clipPath')
         .attr('id', 'heatmap-clip');
 
     selectAll('g.country').each(function() {
         const paths = select(this).selectAll('path');
         paths.each(function() {
             const currentPath = select(this);
             clipPath.append(() => currentPath.node().cloneNode(true));
         });
     });

    const contours = contourDensity<DataPoint>()
        .x(d => convertCoordinates(d.latitude, d.longitude, svgDimensions).x)
        .y(d => convertCoordinates(d.latitude, d.longitude, svgDimensions).y)
        .weight(d => d.radiation)
        .size([svgDimensions.width, svgDimensions.height])
        .bandwidth(15)
        .thresholds(22)
        (data);

    const maxContourValue: number = Math.max(...contours.map(c => c.value));
    const colorScale = scaleSequential(interpolateInferno).domain([0, maxContourValue]);

    // Render the heatmap with the clip path applied
    const heatmapGroup = select(svgElement).append('g')
        .attr('id', 'heatmapGroup')
        .attr('clip-path', 'url(#heatmap-clip)');

    heatmapGroup.selectAll('path')
        .data(contours)
        .enter().append('path')
        .attr('d', geoPath())
        .attr('fill', d => colorScale(d.value))
        .attr('pointer-events', 'none')
        .style('opacity', 0.15);
}
