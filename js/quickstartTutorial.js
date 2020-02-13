/* Javascript by Christopher Pierson, 2020 */

var mymap = L.map('mapid').setView([39.1157, -77.5636], 13);

//mapbox standard tileset
// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
//     accessToken: 'pk.eyJ1IjoicGllcnNvbiIsImEiOiJjanp6c2ZvMjIwZWdjM21waXJpNzhsYTdlIn0.WnrNdPyPhiFYUuoYKF1caw'
// }).addTo(mymap);

//mapbox custom personal tileset
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

//add point marker to map
var marker = L.marker([39.091010,-77.509829]).addTo(mymap);

//add transparent cirlce to map
var circle = L.circle([39.083181, -77.569791], {
    color: 'red',
    fillColor: '#000000',
    fillOpacity: 0.5,
    radius: 400
}).addTo(mymap);

//add polygon to map
var polygon = L.polygon([
    [39.108881, -77.554632],
    [39.114402, -77.538812],
    [39.091195, -77.526881]
]).addTo(mymap);

//when marker, circle, or polygon are clicked; enable popup message
marker.bindPopup("<b>Home</b><br>Ted's Stomping Grounds").openPopup();
circle.bindPopup("Heritage High School");
polygon.bindPopup("Hockey, Taco Bell, Movies");

//popup message that is already on when webpage loads
var popup = L.popup()
    .setLatLng([39.1157, -77.5636])
    .setContent("Leesburg, VA")
    .openOn(mymap);

//create function that gives xy coordinates on map where clicked
function onMapClick(e) {
	alert("You clicked the map at " + e.latlng);
}

//activate onMapClick function
mymap.on('click', onMapClick);
