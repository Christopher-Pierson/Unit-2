/* Javascript by Christopher Pierson, 2020 */

var mymap = L.map('mapid').setView([40.442025, -80.012955], 13);

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
