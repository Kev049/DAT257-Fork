import { select, scaleSequential, interpolatePlasma, axisRight, scaleLinear, contourDensity, geoPath, line } from 'd3';
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
    const url: string = "src/python/heat.csv"
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

    const contours = contourDensity<DataPoint>()
        .x(d => convertCoordinates(d.latitude, d.longitude, svgDimensions).x)
        .y(d => convertCoordinates(d.latitude, d.longitude, svgDimensions).y)
        .size([svgDimensions.width, svgDimensions.height])
        .bandwidth(20)  // Adjust this parameter to change smoothness
        (data);

    const paths = select(svgElement).selectAll('path')
        .data(contours)
        .enter().append('path')
        .attr('d', geoPath())
        .attr('fill', d => colorScale(d.value))
        .style('opacity', 0.8);

    // If you want to keep the blur effect, you can define a filter in defs and apply it to paths
}

// export async function renderHeatmap(svgElement: SVGSVGElement, data: DataPoint[], maxRadiation: number): Promise<void> {
//     const svgDimensions: SVGDimensions = { width: svgElement.viewBox.baseVal.width, height: svgElement.viewBox.baseVal.height };

//     const colorScale = scaleSequential(interpolatePlasma).domain([0, maxRadiation]);

//     const defs = select(svgElement).append('defs');
//     const filter = defs.append('filter').attr('id', 'blur');
//     filter.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', 1);

//     select(svgElement).selectAll('circle')
//         .data(data)
//         .enter().append('circle')
//         .attr('cx', d => convertCoordinates(d.latitude, d.longitude, svgDimensions).x)
//         .attr('cy', d => convertCoordinates(d.latitude, d.longitude, svgDimensions).y)
//         .attr('r', d => 12)
//         .style('fill', d => colorScale(d.radiation))
//         .style('opacity', 0.2) 
//         .attr('filter', 'url(#blur)') 
//         .attr('pointer-events', 'none');
// }

