# leaflet-challenge
Module 15 Challenge for Morgan Bee


In this challenge, I used all the class activities from the module. For both Part 1 and Part 2, I used "All Earthquakes" from the past 7 days, collected on 11/16/24. Source: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php 

In leaflet-part-1, I got the Washington DC coordinates for the center of the map from Google. in order to create the legend in both JavaScript and HTML, I used the Xpert Learning Assistant to help me through this block of code: 

```legend.onAdd = function() {
         let div = L.DomUtil.create('div', 'info legend'); 
         div.innerHTML = '<h4>Earthquake Depth (km)</h4>';
         // Loop through the gradeRanges and create a label for each
         gradeRanges.forEach(function(range) {
             div.innerHTML += '<div style="background-color: ' + range.color + '; width: 30px; height: 22px; display: inline-block;"></div> ' + range.label + '<br>';
         });
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
         // Style the legend div
         div.style.background = 'white';
         div.style.padding = '5px';
         div.style.border = '2px solid #ccc';
         div.style.borderRadius = '5px';
         div.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
     
         return div; // Return the div to be added to the map
     }; 
```
For the optional leaflet-part-2, I used all the same code from Part 1, and added in the tectonic plate data from this github page: https://github.com/fraxen/tectonicplates/tree/master/GeoJSON, specifically the PB2002_boundaries.json file. ChatGPT helped me troubleshoot the order/flow of my code and also explained how to organize the overlay layers so that everything runs correctly. I also used the Jawg_Dark tile layer for one of the map options, from this github page: https://leaflet-extras.github.io/leaflet-providers/preview/. 

You can view code for both Part 1 and Part 2 in this repository, and the 