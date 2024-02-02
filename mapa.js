let map = L.map('map').setView([42.60, -5.57], 13);

let marker = L.marker([42.60, -5.57]).addTo(map);

let circle = L.circle([42.60, -5.57], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 1000
}).addTo(map);

let polygon = L.polyline([
    [42.60, -5.57],
    [42.80, -5.67],
    [42.96, -5.59]
]).addTo(map);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

