const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const svgFilePath = path.join(__dirname, 'world.svg');
const outputFile = path.join(__dirname, 'wrapped-svg-file.svg');


// Function to get the full name of a country from its path element
function getCountryFullName(pathElement) {
    // Try to get the country's full name from the 'name' attribute first
    const nameFromAttribute = pathElement.getAttribute('name');
    if (nameFromAttribute) {
        return nameFromAttribute;
    }
    
    // If there's no 'name' attribute, fall back to the class name
    const classFromElement = pathElement.getAttribute('class');
    if (classFromElement) {
        return classFromElement;
    }

    // Fallback if neither 'name' nor 'class' provides a country name
    return 'Unknown Country';
}

fs.readFile(svgFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading the SVG file:", err);
        return;
    }

    const dom = new JSDOM(data, { contentType: "image/svg+xml" });
    const document = dom.window.document;

    // Collect all paths into a map based on their class or ID
    const countryPaths = {};
    document.querySelectorAll('path').forEach(path => {
        const identifier = path.getAttribute('class') || path.getAttribute('name');
        if (identifier) {
            if (!countryPaths[identifier]) {
                countryPaths[identifier] = [];
            }
            countryPaths[identifier].push(path);
        }
    });

    Object.keys(countryPaths).forEach(identifier => {
        // Use createElementNS with the SVG namespace to create the <a> element
        const svgNamespaceURI = "http://www.w3.org/2000/svg";
        const a = document.createElementNS(svgNamespaceURI, 'a');
        a.setAttribute('href', `#${identifier}`);
        a.setAttribute('class', 'country');
        
        const countryFullName = getCountryFullName(countryPaths[identifier][0]);
        a.setAttribute('id', countryFullName);

        countryPaths[identifier].forEach(path => {
            a.appendChild(path.cloneNode(true));
            path.parentNode.removeChild(path);
        });
    
        document.querySelector('svg').appendChild(a);
    });

    fs.writeFile(outputFile, dom.serialize(), (err) => {
        if (err) {
            console.error("Error writing the modified SVG file:", err);
            return;
        }
        console.log("SVG file has been processed and saved.");
    });
});
j