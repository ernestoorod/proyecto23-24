document.addEventListener('DOMContentLoaded', function () {
    let btnAbrirModal = document.getElementById('btn-abrir-modal');
    let btnCerrarModal = document.getElementById('btn-cerrar-modal');
    let btnVolverModal = document.getElementById('btn-volver-modal');
    let btnCerrarCrearCarrera = document.getElementById('btn-cerrar-crearcarrera');
    let btnVolverCrearCarrera = document.getElementById('btn-volver-crearcarrera');
    let nombreCarreraSpan = document.getElementById('nombreCarreraSpan');
    let btnSiguiente = document.getElementById('btn-siguiente');
    let token = localStorage.getItem("miToken");

    if (token !== null && !TokenExpirado(token)){
        btnAbrirModal.addEventListener("click", () => {
            modal.showModal();
        });

        btnCerrarModal.addEventListener("click", () => {
            modal.close();
        });

        btnVolverModal.addEventListener("click", () => {
            modal.close();
        });

        btnCerrarCrearCarrera.addEventListener("click", () => {
            crearcarrera.close();
        });

        btnVolverCrearCarrera.addEventListener("click", () => {
            crearcarrera.close();
            modal.showModal();
        });

        btnSiguiente.addEventListener("click", () => {
            const nombreCarrera = document.getElementById('nombrecarrera').value;
            nombreCarreraSpan.textContent = nombreCarrera;
            modal.close();
            crearcarrera.showModal();
        }); 

        let holaUsuarioElement = document.querySelector('.primero');

        let nombreUsuario = ObtenerNombreDeUsuarioDesdeToken(token);

        holaUsuarioElement.textContent = 'Hola, ' + nombreUsuario;

        console.log(decodificarJWT(token));

    }else {
        console.log('No se ha generado el token o ha expirado');
    };

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

    function ObtenerNombreDeUsuarioDesdeToken(token) {
        let tokenDecodificado = decodificarJWT(token);
        return tokenDecodificado.username;
    }

});