let urlParams = new URLSearchParams(window.location.search);
let carreraNombre = urlParams.get('carrera');

document.getElementById('nombreCarrera').innerText = carreraNombre;