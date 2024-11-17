// Add URL to json data
let earthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
let tecPlates = "https://raw.githubusercontent.com/fraxen/tectonicplates/refs/heads/master/GeoJSON/PB2002_boundaries.json"

// Create default coordinates and zoom level
let dcCoords = [38.9072, -77.0369]
let mapZoomLevel = 3

// Create map tile layers
let openStreet = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

let Jawg_Dark = L.tileLayer('https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 22,
	accessToken: '<your accessToken>'
});

// Initialize map 
let myMap = L.map('map', {
    center : dcCoords, 
    zoom : mapZoomLevel, 
    layers: [openStreet, topo]
});

// Define baseMaps
let baseMaps = {
    "Open Street" : openStreet,
    "Topo" : topo, 
    "Dark" : Jawg_Dark
};

// Loop through data to create markers for each earthquake
d3.json(earthquakes).then(quakes => {

    // Loop through tectonic plate data to collect coordinates
    d3.json(tecPlates).then(plates => {
        let platesFeatures = plates.features;

        // Add tectonic plates to layer group
        let tectonicPlatesLayer = L.layerGroup();

        // Add tectonic plates to the appropriate layer and add styling
        platesFeatures.forEach(platesElement => {
            let tectonicPlate = L.geoJSON(platesElement, {
                style: {
                    color: 'orange',
                    weight : 2
                }}).addTo(tectonicPlatesLayer);
            });

        // Add earthquakes to layer group
        let earthquakeLayer = L.layerGroup();
        // pick up loop from line 40
        let quakesFeatures = quakes.features;
        quakesFeatures.forEach(quakesElement => {
            // Gather coordinates from each earthquake
            let quakesCoordinates = quakesElement.geometry.coordinates;
            let properties = quakesElement.properties;
    
            // Change color of circle for each quake depending on depth
            let color;
            if (quakesCoordinates[2] >= -10 && quakesCoordinates[2] < 0) {
                color = 'green'
            } else if (quakesCoordinates[2] >= 0 && quakesCoordinates[2] < 10) {
                color = 'lightgreen'
            } else if (quakesCoordinates[2] >= 10 && quakesCoordinates[2] < 30) {
                color = 'yellow'
            } else if (quakesCoordinates[2] >= 30 && quakesCoordinates[2] < 50) {
                color = 'orange'
            } else if (quakesCoordinates[2] >= 50 && quakesCoordinates[2] < 70) {
                color = 'red'
            } else if (quakesCoordinates[2] >= 70 && quakesCoordinates[2] < 90) {
                color = 'darkred'
            }else {
                color = 'purple'
            }

            // Create circles for each quake at location and use Magnitude as radius
            var circle = L.circle([quakesCoordinates[1], quakesCoordinates[0]], {
                color: color, 
                weight: .1, 
                fillColor: color,
                fillOpacity: .7, 
                radius: (properties.mag) * 35000,
            // Add location, magnitude, and depth to each popup
            }).bindPopup(`Location: ${properties.place}<hr>Magnitude: ${properties.mag}<hr>Depth: ${quakesCoordinates[2]}`);

            // Add each circle to the earthquake layer
            earthquakeLayer.addLayer(circle);
            });
        
        // Define overlapMaps
        let overlayMaps = {
        "Tectonic Plates" : tectonicPlatesLayer,
        "Earthquakes" : earthquakeLayer
    };

        // Add basemaps and overlaymaps myMap
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap);

        // Add legend 
        let legend = L.control({ position: 'topright' });

        legend.onAdd = function() {
            let div = L.DomUtil.create('div', 'info legend'); 
            div.innerHTML = '<h4>Earthquake Depth (km)</h4>';
    
        // Define grades and colors
        const gradeRanges = [
            { label: "-10 - 0", color: "green" },
            { label: "0 - 10", color: "lightgreen" },
            { label: "10 - 30", color: "yellow" },
            { label: "30 - 50", color: "orange" },
            { label: "50 - 70", color: "red" },
            { label: "70 - 90", color: "darkred" },
            { label: "90+", color: "purple" }
        ];
 
        // Loop through the gradeRanges and create a label for each
        gradeRanges.forEach(function(range) {
            div.innerHTML += '<div style="background-color: ' + range.color + '; width: 30px; height: 22px; display: inline-block;"></div> ' + range.label + '<br>';
        });
 
        // Style the legend div
        div.style.background = 'white';
        div.style.padding = '5px';
        div.style.border = '2px solid #ccc';
        div.style.borderRadius = '5px';
        div.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
 
        return div;
    };
    // Add the legend to the map
    legend.addTo(myMap); 

    });

 });








    

   