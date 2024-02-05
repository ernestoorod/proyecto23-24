let token = localStorage.getItem('miToken');
let userId = IDusuario(token);

function TokenExpirado(token) {
    let tiempoExpiracion = obtenerTiempoExpiracionDesdeToken(token);
    let tiempoActual = new Date().getTime() / 1000;

    return tiempoExpiracion < tiempoActual;
}

function obtenerTiempoExpiracionDesdeToken(token) {
    let tokenDecodificado = decodificarJWT(token);
    return tokenDecodificado.exp;
}

function decodificarJWT(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let cargaPayloadJson = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(cargaPayloadJson);
}

function IDusuario(token) {
    let tokenDecodificado = decodificarJWT(token);
    return tokenDecodificado.id;
}


console.log(userId);


document.getElementById('btn-crear').addEventListener('click', function() {

    let nombre = document.getElementById('nombrecarrera').value;
    let localizacion = document.getElementById('localizacion').value;
    let distancia = document.getElementById('distancia').value;
    let fecha = document.getElementById('fecha').value;
    let desnivel = document.getElementById('desnivel').value;

    let data = {
        IDusuario: userId,
        nombre: nombre,
        localizacion: localizacion,
        distancia: distancia,
        fecha: fecha,
        desnivel: desnivel
    };
    
    fetch('./PHP/añadircarrera.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Carrera creada con éxito. ID de carrera: ' + data.carreraId);
        } else {
            console.log('Error al crear carrera: ' + data.error);
        }
    })
    .catch((error) => {
        console.log('Error:', error);
    });
});

if (window.location.href.includes("index.html")) {
    localStorage.removeItem("miToken");
}