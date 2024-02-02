document.addEventListener('DOMContentLoaded', function () {
    let token = localStorage.getItem("miToken");
    let btnPerfil = document.getElementById("botonperfil");

    if (token !== null && !TokenExpirado(token)) {
        btnPerfil.addEventListener("click", () => {
            window.location.href = "../perfil.html";
        });

        console.log(decodificarJWT(token));
    } else {
        console.log('No se ha generado el token o ha expirado');
    }
});

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

