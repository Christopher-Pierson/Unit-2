/* Javascript by Christopher Pierson, 2020 */

/* Map of GeoJSON data from MegaCities.geojson */
//declare vars globally so all functions have access
var mymap;
var minValue;
var attributes;
var dataStats = {min: 1, max: 97, lowmid: 20, highmid: 50};
//create marker options
// var options = {
//     color: "#000",
//     weight: 1,
//     opacity: 1,
//     fillOpacity: 0.8
// };


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

function createTitle(){
    var Title = L.Control.extend({
        options: {
            position: 'topright'
        },

        onAdd: function () {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'title-container');

            //add temporal legend div to container
            $(container).append('<h1><b>NHL Playoff Wins During the Crosby & Ovechkin Era</h1>');


            return container;
        }
    });

    mymap.addControl(new Title());

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

function calcStats(data){

     //create empty array to store all data values
     var allValues = [];

     //loop through each city
     for(var team of data.features){
          //loop through each year
          for(var year = 2005; year <= 2019; year+=1){
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

     //get min, max, mean stats for our array
     var minValue = Math.min(...allValues);
     dataStats.min = Math.min(...allValues);
     dataStats.max = Math.max(...allValues);

     //calculate mean
     var sum = allValues.reduce(function(a, b){return a+b;});
     dataStats.mean = sum/ allValues.length;

     //console.log(minValue)
     return minValue;
}

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
  //alternate setting of radius for values of zero so point doens't appear too small on map
  if (attValue === 0){
    return 2
  }
  else{
     //constant factor adjusts symbol sizes evenly
     var minRadius = 3;

     //Flannery Appearance Compensation formula
     var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius

    return radius;
  }
};

//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Determine which attribute to visualize with proportional symbols
    var attribute = attributes[0];

    //check
    console.log(feature);
    console.log(attribute);

    //create marker options
    var options = {
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //
    options.fillColor = "#ff1694";

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string
    var popupContent = "<p>Team: <b>" + feature.properties.Team + "</b></p>";

    //bind the popup to the circle marker
    layer.bindPopup(popupContent);

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//create new sequence controls
function createSequenceControls(attributes){
    var SequenceControl = L.Control.extend({
          options: {
              position: 'bottomleft'
          },

          onAdd: function () {
              // create the control container div with a particular class name
              var container = L.DomUtil.create('div', 'sequence-control-container');

              // create range input element (slider)
              $(container).append('<input class="range-slider" type="range">');

              // add skip buttons
              $(container).append('<button class="step" id="reverse" title="Reverse">Reverse</button>');
              $(container).append('<button class="step" id="forward" title="Forward">Forward</button>');

              //disable any mouse event listeners for the container
              L.DomEvent.disableClickPropagation(container);

              return container;
          }
      });

      mymap.addControl(new SequenceControl());

    //create range input element (slider)
    //$('#panel').append('<input class="range-slider" type="range">');


    //set slider attributes
    $('.range-slider').attr({
        max: 14,
        min: 0,
        value: 0,
        step: 1

    });

    //add step buttons
    //$('#panel').append('<button class="step" id="reverse">Reverse</button>');
    //$('#panel').append('<button class="step" id="forward">Forward</button>');
    //replace button content with images
    $('#reverse').html('<img src="img/arrow_l.svg">');
    $('#forward').html('<img src="img/arrow_r.svg">');


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
      updatePropSymbols(attributes[index]);
      updateTemporalLegend(attributes[index]);
  });

    //input listener for slider
    $('.range-slider').on('input', function(){
        //get the new index value
        var index = $(this).val();
        updatePropSymbols(attributes[index]);
        updateTemporalLegend(attributes[index]);
        //console.log(index);
    });


};


function createLegend(attribute){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },

        onAdd: function () {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');

            // var year = attribute.split("_")[1];
            //$(container).append("<b> Size of circles correspond to that team's total playoff wins since 2005. </b>");

            // start attribute legend svg string
            var svg = '<svg id="attribute-legend" width="175px" height="130px">';

            // array of circle names to base loop on
            //var circles = ["max", "mean", "min"];
            var circles = ["max", "highmid", "lowmid", "min"];

            // loop to add each circle and text to svg string
            for (var i=0; i<circles.length; i++){

              // assign the r and cy attributes
              var radius = calcPropRadius(dataStats[circles[i]]);
              var cy = 75 - radius;

              //circle string
              svg += '<circle class="legend-circle" id="' + circles[i] + '" r="' + radius + '"cy="'
              + cy + '" fill="#ff1694" fill-opacity="0.8" stroke="#000000" cx="30"/>';

              //evenly space out labels
              var textY = i * 20 + 5;

              //text string
              svg += '<text id="' + circles[i] + '-text" x="75" y="' + textY + '">' +
              Math.round(dataStats[circles[i]]*100)/100 + " wins" + '</text>';
              };

            // close svg string
            svg += "</svg>";

            // add attribute legend svg to container
            $(container).append(svg);

            return container;
        }
    });

    mymap.addControl(new LegendControl());


};

function updateTemporalLegend(attribute){
    var legend = document.getElementById("year+-");
    var year = attribute.split("_")[1];
    if (year == 2005){
      legend.innerHTML = "<b>" + year + " Lockout";
    }else {
    legend.innerHTML = "<b>" + year + " Playoffs";
  };
}

function createTemporalLegend(attribute){
    var TemporalLegendControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function () {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'temporal-legend-control-container');

            //add temporal legend div to container
            var year = attribute.split("_")[1];
            $(container).append('<h1 id="year+-" ><b>NHL Lockout ' + year + '</h1>');


            return container;
        }
    });

    mymap.addControl(new TemporalLegendControl());

};

//resize proportional symbols according to new attribute values
function updatePropSymbols(attribute){
    mymap.eachLayer(function(layer){
      if (layer.feature){

        //access feature properties
        var props = layer.feature.properties;
        console.log(props)

        //update each feature's radius based on new attribute values
        var radius = calcPropRadius(props[attribute]);
        layer.setRadius(radius);
        console.log(layer)

        var options = {}

        //add team to popup content string
        var popupContent = "<p>Team:<b> " + props.Team + "</b></p>";

        // derive popup content based on the number wins that playoff year,
        // if the number is negative explain, the circumstances for the team not participiating in the playoffs
        var year = attribute.split("_")[1];
        if (props["Wins_"+year] > -1){
          var yearwins = props["Wins_"+year]
          options.fillColor = "#ffff00";
          popupContent += "<p>Playoff Wins in " + year + ":<b> " + yearwins + "</b></p>";
          popupContent += "<p>Playoff Wins Since 2006 " + ":<b> " + props[attribute] + "</b></p>";
        } else if (props["Wins_"+year] == -1) {
          popupContent += "<p>Missed the playoffs in <b>" + year + "</b></p>";
          popupContent += "<p>Playoff Wins Since 2006 " + ":<b> " + props[attribute] + "</b></p>";
        } else if (props["Wins_"+year] == -999){
          popupContent += "<p>Did not play in the <b>" + year + "</b> season</b></p>";
        } else if (props["Wins_"+year] == -998) {
          popupContent += "<p>Moved to Winnipeg after <b>2011</b></p>";
          popupContent += "<p>Playoff Wins Since 2006 " + ":<b> " + props[attribute] + "</b></p>";
        }

        layer.setStyle(options)
        //update popup content
        popup = layer.getPopup();
        popup.setContent(popupContent).update();
     }

    });
};

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

//Import GeoJSON data
function getData(map){
    //load the data
    $.ajax("data/NHL_PlayoffWins_06-19_alt.geojson", {
        dataType: "json",
        success: function(response){

            //create an attributes array
            var attributes = processData(response);

            minValue = calcStats(response);
            //add symbols and UI elements
            createTitle();
            createPropSymbols(response, attributes);
            createSequenceControls(attributes);
            createLegend(attributes[0]);
            createTemporalLegend(attributes[0]);

        }
    });
};

$(document).ready(createMap);
