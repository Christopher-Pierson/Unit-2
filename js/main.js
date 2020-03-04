/* Javascript by Christopher Pierson, 2020 */

/* Map of GeoJSON data from MegaCities.geojson */
//declare vars globally so all functions have access
var mymap;
var minValue;


//function to instantiate the Leaflet map
function createMap(){
    //create the map
    mymap = L.map('mapid', {
        center: [41, -95],
        zoom: 4.25
    });

    //add OSM base tilelayer
    L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
    	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: 'abcd',
    	minZoom: 0,
    	maxZoom: 20,
    	ext: 'png'
    }).addTo(mymap);

    //call getData function
    getData();
};


//added at Example 2.3 line 20...function to attach popups to each mapped feature
function onEachFeature(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
};

function calcMinValue(data){

     //create empty array to store all data values
     var allValues = [];

     //loop through each city
     for(var team of data.features){
          //loop through each year
          for(var year = 2006; year <= 2019; year+=1){
                //get population for current year
               var value = team.properties["Total_"+ String(year)];
               //add value to array
              if (value > 0){
                allValues.push(value)

              }
           }
     }

     //get minimum value of our array
     var minValue = Math.min(...allValues)

     return minValue;
}

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {

     //constant factor adjusts symbol sizes evenly
     var minRadius = 3;

     //Flannery Appearance Compensation formula
     var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius

    console.log(radius)
    return radius;
};

//function to convert markers to circle markers
function pointToLayer(feature, latlng){
    //Determine which attribute to visualize with proportional symbols
    var attribute = "Total_2019";

    //create marker options
    var options = {
        fillColor: "#ff1694",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string
    var popupContent = "<p>Team: <b>" + feature.properties.Team + "</b></p><p>Playoff Wins Since 2006: <b>" + feature.properties[attribute] + "</p>";

    //bind the popup to the circle marker
    layer.bindPopup(popupContent);

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

// function createPropSymbols(data){
//     //determine the attribute for scaling the proportional symbols
//     var attribute = "Total_2019";
//     //create marker options
//     var geojsonMarkerOptions = {
//         radius: 8,
//         fillColor: "#ff1694",
//         color: "#000",
//         weight: 1,
//         opacity: 1,
//         fillOpacity: 0.8
//     };
//
//     //create a Leaflet GeoJSON layer and add it to the map
//     L.geoJson(data, {
//         pointToLayer: function (feature, latlng) {
//             //for each feature, determine its value for the selected attribute
//             var attValue = Number(feature.properties[attribute]);
//
//             //give each feature's circle marker a radius based on its attribute value
//             geojsonMarkerOptions.radius = calcPropRadius(attValue);
//
//             //examine the attribute value to check that it is correct
//             //console.log(feature.properties, attValue);
//
//             //create circle markers
//             return L.circleMarker(latlng, geojsonMarkerOptions);
//         }
//     }).addTo(mymap);
// };

//Add circle markers for point features to the map
function createPropSymbols(data, map){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: pointToLayer
    }).addTo(mymap);
};

//function to retrieve the data and place it on the map
function getData(map){
    //load the data
    $.getJSON("data/NHL_PlayoffWins_06-19_alt.geojson", function(response){

      //calculate minimum data value
      minValue = calcMinValue(response);

      //call function to create proportional symbols
      createPropSymbols(response);

    });
};

$(document).ready(createMap);
