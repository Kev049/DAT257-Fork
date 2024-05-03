import { select, scaleSequential, interpolatePlasma, axisRight, scaleLinear  } from 'd3';
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

export async function fetchCSVData(): Promise<[DataPoint[], number]> {
    const url: string = "/irr.csv"
    
    try {
        const data: DataPoint[] = await csv(url, (d: any) => ({
            latitude: +d.lat,
            longitude: +d.long,
            radiation: +d.irr_data
        }));

        const maxRadiation = data.reduce((max, p) => p.radiation > max ? p.radiation : max, data[0].radiation);
        return [data, maxRadiation];
    } catch (error) {
        console.error('Error fetching or parsing CSV data:', error);
        return [[], 0];
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

// I use the D3 library to render the circles according to the radiation level.
export async function renderHeatmap(svgElement: SVGSVGElement, data: DataPoint[], maxRadiation: number): Promise<void> {
    const svgDimensions: SVGDimensions = { width: svgElement.viewBox.baseVal.width, height: svgElement.viewBox.baseVal.height };

    const colorScale = scaleSequential(interpolatePlasma).domain([0, maxRadiation]);

    const defs = select(svgElement).append('defs');
    const filter = defs.append('filter').attr('id', 'blur');
    filter.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', 1);

    select(svgElement).selectAll('circle')
        .data(data)
        .enter().append('circle')
        .attr('cx', d => convertCoordinates(d.latitude, d.longitude, svgDimensions).x)
        .attr('cy', d => convertCoordinates(d.latitude, d.longitude, svgDimensions).y)
        .attr('r', d => 3 + (10 * (d.radiation / maxRadiation)))
        .style('fill', d => colorScale(d.radiation))
        .style('opacity', 0.6) 
        .attr('filter', 'url(#blur)') 
        .attr('pointer-events', 'none');

    // Color bar setup
    const colorBarWidth = 30;
    const colorBarHeight = 120;
    const margin = { top: 30, right: 30, bottom: window.innerHeight - 200, left: window.innerWidth };
    const colorBarX = svgDimensions.width - margin.left - colorBarWidth;
    const colorBarY = margin.bottom;

    // Gradient definition
    const gradient = defs.append('linearGradient')
        .attr('id', 'gradient')
        .attr('x1', '0%')
        .attr('x2', '0%')
        .attr('y1', '100%')
        .attr('y2', '0%');
    
    // Manual ticks for color stops
    const ticks = [0, 0.25, 0.5, 0.75, 1].map(t => t * maxRadiation);
    ticks.forEach((t, i, a) => {
        gradient.append('stop')
            .attr('offset', `${100 * i / (a.length - 1)}%`)
            .attr('stop-color', colorScale(t));
    });

    // Draw the color bar
    select(svgElement).append('rect')
        .attr('x', colorBarX)
        .attr('y', colorBarY)
        .attr('width', colorBarWidth)
        .attr('height', colorBarHeight)
        .style('fill', 'url(#gradient)');

    // Add color bar labels
    const barScale = scaleLinear()
        .range([colorBarHeight, 0])
        .domain([0, maxRadiation]);

    const axis = axisRight(barScale).ticks(5);
    select(svgElement)
        .append('g')
        .attr('transform', `translate(${colorBarX + colorBarWidth}, ${colorBarY})`)
        .call(axis);
}

