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
               // console.log(value + " value")
               // console.log(typeof value)
              if (value > 0){
                allValues.push(value)
                // console.log("I'm working")
                // console.log(value)

              }
           }
     }

     //get minimum value of our array
     var minValue = Math.min(...allValues)

     console.log(minValue)
     return minValue;
}

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {

     //constant factor adjusts symbol sizes evenly
     var minRadius = 3;

     //Flannery Appearance Compensation formula
     var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius

    // console.log(0/1)
    // console.log(radius + " radius")
    // console.log(attValue + " attvalue")
    // console.log(typeof attValue)
    // console.log(minValue + " minvalue")
    // console.log(minRadius + " minRadius")
    return radius;
};

//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Determine which attribute to visualize with proportional symbols
    var attribute = attributes[0];

    //check
    console.log(attribute)

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
    var popupContent = "<p>Team: <b>" + feature.properties.Team + "</b></p><p>Playoff Wins: <b>" + feature.properties[attribute] + "</p>";

    //bind the popup to the circle marker
    layer.bindPopup(popupContent);

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//create new sequence controls
function createSequenceControls(){
    //create range input element (slider)
    $('#panel').append('<input class="range-slider" type="range">');

    //set slider attributes
    $('.range-slider').attr({
        max: 2019,
        min: 2006,
        value: 0,
        step: 1

    });

    //add step buttons
    $('#panel').append('<button class="step" id="reverse">Reverse</button>');
    $('#panel').append('<button class="step" id="forward">Forward</button>');

    //click listener for buttons
    $('.step').click(function(){
      //get the old index value
      var index = $('.range-slider').val();

      //increment or decrement depending on button clicked
      if ($(this).attr('id') == 'forward'){
          index++;
          //if past the last attribute, wrap around to first attribute
          index = index > 14 ? 0 : index;
      } else if ($(this).attr('id') == 'reverse'){
          index--;
          //if past the first attribute, wrap around to last attribute
          index = index < 0 ? 14 : index;
      };

      //update slider
      $('.range-slider').val(index);
  });

    //input listener for slider
    $('.range-slider').on('input', function(){
        //get the new index value
        var index = $(this).val();
        console.log(index);
    });


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
function createPropSymbols(data, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature,latlng){
          return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(mymap);
};

//build an attributes array from the data
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("Total_") > -1){
            attributes.push(attribute);
        };
    };

    //check result
    console.log(attributes);

    return attributes;
};

// //function to retrieve the data and place it on the map
// function getData(map){
//     //load the data
//     $.getJSON("data/NHL_PlayoffWins_06-19_alt.geojson", function(response){
//
//       //calculate minimum data value
//       minValue = calcMinValue(response);
//
//       //call function to create proportional symbols
//       createPropSymbols(response);
//
//     });
// };

//Import GeoJSON data
function getData(map){
    //load the data
    $.ajax("data/NHL_PlayoffWins_06-19_alt.geojson", {
        dataType: "json",
        success: function(response){

            //create an attributes array
            var attributes = processData(response);

            minValue = calcMinValue(response);
            //add symbols and UI elements
            createPropSymbols(response, attributes);
            createSequenceControls(attributes);

        }
    });
};

$(document).ready(createMap);
