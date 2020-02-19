/* Javascript by Christopher Pierson, 2020 */

var mymap = L.map('mapid').setView([40.442025, -80.012955], 13);

//mapbox standard tileset
// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
//     accessToken: 'pk.eyJ1IjoicGllcnNvbiIsImEiOiJjanp6c2ZvMjIwZWdjM21waXJpNzhsYTdlIn0.WnrNdPyPhiFYUuoYKF1caw'
// }).addTo(mymap);

//mapbox custom personal tileset - check Nick's email to format correctly
// L.tileLayer('https://api.mapbox.com/styles/pierson/ck6jwtl3u07pm1ipbg8r5etcb?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     //id: 'mapbox/streets-v11',
//     accessToken: 'pk.eyJ1IjoicGllcnNvbiIsImEiOiJjanp6c2ZvMjIwZWdjM21waXJpNzhsYTdlIn0.WnrNdPyPhiFYUuoYKF1caw'
// }).addTo(mymap);

//mapbox://styles/pierson/ck6jwtl3u07pm1ipbg8r5etcb

//non-mapbox option, no accessToken necessary
L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
}).addTo(mymap);

// var ppgPaints = {
//     "type": "Feature",
//     "properties": {
//         "name": "PPG Paints Arena",
//         "amenity": "NHL Arena",
//         "popupContent": "This is where the Penguins play!"
//     },
//     "geometry": {
//         "type": "Point",
//         "coordinates": [-79.989571, 40.439570]
//     }
// };

var heinzField = {
    "type": "Feature",
    "properties": {
        "name": "Heinx Field",
        "amenity": "NFL Stadium",
        "popupContent": "This is where the Steelers play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-80.015773, 40.446790]
    }
};

// L.geoJSON(ppgPaints).addTo(mymap);

var myLines = [{
    "type": "LineString",
    "coordinates": [[-80.037554,40.454473], [-80.025677,40.445648], [-79.996688, 40.432950]]
}, {
    "type": "LineString",
    "coordinates": [[-80.019392, 40.443443], [-80.011124, 40.443689], [-79.996735, 40.447744]]
}];

var myStyle = {
    "color": "#ffff00",
    "weight": 5,
    "opacity": 0.65
};

L.geoJSON(myLines, {
	style: myStyle
}).addTo(mymap);

var shapes = [{
    "type": "Feature",
    "properties": {"type": "square"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-80.008017, 40.453570],
            [-80.004230, 40.454248],
						[-80.003032, 40.450735],
						[-80.006916, 40.450017]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"type": "triangle"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-80.010941, 40.441682],
            [-79.994707, 40.445638],
            [-79.996161, 40.436191]
        ]]
    }
}];

L.geoJSON(shapes, {
    style: function(feature) {
        switch (feature.properties.type) {
            case 'square': return {color: "#ff7800"};
            case 'triangle':   return {color: "#0000ff"};
        }
    }
}).addTo(mymap);

var geojsonMarkerOptions = {
    radius: 15,
    fillColor: "#ffff00",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

L.geoJSON(heinzField, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(mymap);


function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

var ppgPaints = {
    "type": "Feature",
    "properties": {
			"name": "PPG Paints Arena",
			"amenity": "NHL Arena",
			"popupContent": "This is where the Penguins play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-79.989571, 40.439570]
    }
};

L.geoJSON(ppgPaints, {
    onEachFeature: onEachFeature
}).addTo(mymap);


var someFeatures = [{
    "type": "Feature",
    "properties": {
        "name": "Andy Warhol Museum",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-80.002447, 40.448395]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Rivers Casino",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-80.022376, 40.447422]
    }
}];

L.geoJSON(someFeatures, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(mymap);
