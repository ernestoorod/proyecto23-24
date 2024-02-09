document.addEventListener("DOMContentLoaded", function () {
    let urlParams = new URLSearchParams(window.location.search);
    let carreraNombre = urlParams.get("carrera");
    let token = localStorage.getItem("miToken");

    document.getElementById("nombreCarrera").innerText = carreraNombre;

    let map = L.map("map").setView([42.6, -5.57], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Obtener datos desde carrera.php
    fetch("./PHP/carrera.php", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            data = responseData;
            console.log(data);
            mostrarDetallesCarrera(data, carreraNombre);
        })
        .catch((error) => {
            console.error("Error al cargar datos desde la API:", error);
        });

    // Función para mostrar los detalles de la carrera correspondiente al nombre proporcionado
    function mostrarDetallesCarrera(carreras, nombre) {
        var detallescarrera = document.getElementById('detallescarrera');
        detallescarrera.innerHTML = ''; // Limpiar el contenido anterior

        var html = '';
        var carrera = carreras.find(carrera => carrera.nombre === nombre);
        if (carrera) {
            html += '<ul>';
            html += '<li>';
            html += '<strong>Nombre:</strong> ' + carrera.nombre + '<br>';
            html += '<strong>Localización:</strong> ' + carrera.localizacion + '<br>';
            html += '<strong>Fecha:</strong> ' + carrera.fecha + '<br>';
            html += '<strong>Distancia:</strong> ' + carrera.distancia + '<br>';
            html += '<strong>Desnivel:</strong> ' + carrera.desnivel + '<br>';
            html += '</li>';
            html += '</ul>';
        } else {
            html = '<p>No se encontró la carrera con nombre ' + nombre + '</p>';
        }
        detallescarrera.innerHTML = html;
    }

    // Función para verificar si el token ha expirado
    function TokenExpirado(token) {
        let tiempoExpiracion = obtenerTiempoExpiracionDesdeToken(token);
        let tiempoActual = new Date().getTime() / 1000;

        return tiempoExpiracion < tiempoActual;
    }

    // Función para obtener el tiempo de expiración desde el token
    function obtenerTiempoExpiracionDesdeToken(token) {
        let tokenDecodificado = decodificarJWT(token);
        return tokenDecodificado.exp;
    }

    // Función para decodificar el token JWT
    function decodificarJWT(token) {
        let base64Url = token.split(".")[1];
        let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        let cargaPayloadJson = decodeURIComponent(
            atob(base64)
                .split("")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
        );

        return JSON.parse(cargaPayloadJson);
    }

    function obtenerIDUsuarioDesdeToken(token) {
        let tokenDecodificado = decodificarJWT(token);
        return tokenDecodificado.id; 
    }

    document.getElementById("login-container").style.display = "none";

if (token !== null && !TokenExpirado(token)) {
    document.getElementById('apuntarme').addEventListener('click', function() {
        // Obtener el nombre de la carrera desde la URL
        let urlParams = new URLSearchParams(window.location.search);
        let carreraNombre = urlParams.get("carrera");

        if (!token) {
            window.location.href = '../iniciarsesion.html';
        } else {
            const idUsuario = obtenerIDUsuarioDesdeToken(token);
            const yaRegistrado = localStorage.getItem(`yaRegistrado_${idUsuario}_${carreraNombre}`);

            if (yaRegistrado) {
                alert('Ya te has inscrito previamente en esta carrera.');
            } else {
                localStorage.setItem(`yaRegistrado_${idUsuario}_${carreraNombre}`, 'true');

                let modal = document.getElementById('modal');

                document.getElementById('carrera').innerText = carreraNombre;
                document.getElementById('mensaje').innerText = `Inscripción completada. Número: ${Math.floor(Math.random() * 1000) + 1}`;
                modal.style.display = 'block';
            }
        }
    }); 
    
    document.getElementById('aceptar').addEventListener('click', function() {
        document.getElementById('modal').style.display = 'none';
    });

    document.getElementById('close').addEventListener('click', function() {
        document.getElementById('modal').style.display = 'none';
    });

} else {
    document.getElementById('apuntarme').style.display = 'none';
    document.getElementById('modal').style.display = 'none';
    document.getElementById("login-container").style.display = "block";
}

    
    

});
