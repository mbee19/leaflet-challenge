// Add URL to json data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

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


let baseMaps = {
    "Open Street" : openStreet,
    "Topo" : topo
};


// Initialize map 
let myMap = L.map('map', {
    center : dcCoords, 
    zoom : mapZoomLevel, 
    layers: [openStreet, topo]
});

// Add basemap layer to map
L.control.layers(baseMaps, {}, {
    collapsed: false
}).addTo(myMap);


// Loop through data to create markers for each earthquake
d3.json(url).then(data => {
    let features = data.features;
    features.forEach(element => {
        // Gather coordinates from each earthquake
        let coordinates = element.geometry.coordinates;
        let properties = element.properties;
        console.log(coordinates[1], coordinates[0], coordinates[2]);

        // Change color of circle for each quake depending on depth
        let color;
        if (coordinates[2] >= -10 && coordinates[2] < 0) {
            color = 'green'
        } else if (coordinates[2] >= 0 && coordinates[2] < 10) {
            color = 'lightgreen'
        } else if (coordinates[2] >= 10 && coordinates[2] < 30) {
            color = 'yellow'
        } else if (coordinates[2] >= 30 && coordinates[2] < 50) {
            color = 'orange'
        } else if (coordinates[2] >= 50 && coordinates[2] < 70) {
            color = 'red'
        } else if (coordinates[2] >= 70 && coordinates[2] < 90) {
            color = 'darkred'
        }else {
            color = 'purple'
        }

    // Create circles for each quake at location and use Magnitude as radius
    var circle = L.circle([coordinates[1], coordinates[0]], {
        color: color, 
        weight: .1, 
        fillColor: color,
        fillOpacity: .7, 
        radius: (properties.mag) * 35000,
    });

    // Add location, magnitude, and depth to each popup
    circle.bindPopup(`Location: ${properties.place}<hr>Magnitude: ${properties.mag}<hr>Depth: ${coordinates[2]}`).addTo(myMap);
   
    });
    
     });

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
     
         return div; // Return the div to be added to the map
     };
     
     legend.addTo(myMap); // Add the legend to the map


