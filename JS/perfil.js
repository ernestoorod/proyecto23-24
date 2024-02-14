document.addEventListener('DOMContentLoaded', function () {
    let token = localStorage.getItem("miToken");
    let holaUsuarioElemento = document.querySelector('.primero');
    let nombreUsuario = ObtenerNombreDeUsuarioDesdeToken(token);
    let logoutButton = document.getElementById("logout");
    let misCarrerasButton = document.getElementById("btn-mis-carreras");
    let crearCarreraButton = document.getElementById("btn-abrir-modal");
    
    if (token !== null) {
        fetchUserData(token);
    } else {
        console.log('No se ha generado el token');
    }

    function fetchUserData(token) {
        fetch('../PHP/organizador.php?miToken=' + token)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error de conexión al servidor. Estado: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Datos del usuario:', data);

                if (data.telefono && data.club) {
                    // El usuario tiene información de teléfono y club, no hacemos nada
                } else {
                    // Ocultar botones si el usuario no tiene información de teléfono y club
                    if (misCarrerasButton) {
                        misCarrerasButton.style.display = 'none';
                    }
                    if (crearCarreraButton) {
                        crearCarreraButton.style.display = 'none';
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error.message);
            });
    }

    if (token !== null && !TokenExpirado(token)){     

        holaUsuarioElemento.textContent = 'Hola, ' + nombreUsuario;

        console.log(decodificarJWT(token));

    } else {
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

    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            localStorage.removeItem('miToken');
            window.location.href = './index.html';
        });
    }

    if (window.location.href.includes("index.html")) {
        localStorage.removeItem("miToken");
    }
});
