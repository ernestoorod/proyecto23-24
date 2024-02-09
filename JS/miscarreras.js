document.addEventListener("DOMContentLoaded", function () {
    let token = localStorage.getItem("miToken");

    if (token !== null && !TokenExpirado(token)) {
        let userId = IDusuario(token);

        fetch("../PHP/miscarreras.php?userId=" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })
        .then((response) => response.json())
        .then((carreras) => {
            mostrarCarreras(carreras);
        })
        .catch((error) => {
            console.error("Error al cargar datos desde la API:", error);
        });

        let mostrarCarreras = (carreras) => {
            let carrerasContainer = document.querySelector(".carreras-container");
            carrerasContainer.innerHTML = "";

            if (!carreras || carreras.length === 0) {
                console.error("No se recibieron datos de carreras desde la API");
                return;
            }

            carreras.forEach((carrera) => {
                let carreraDiv = document.createElement("div");
                carreraDiv.classList.add("carrera");
                carreraDiv.innerHTML = `
                    <img src="../IMAGENES/defecto.jpg">
                    <hr>
                    <p>${carrera.nombre}</p>
                    <p>
                        <i class="fa-solid fa-location-dot"></i>
                        <span class="carrera-localizacion">${carrera.localizacion}</span>
                        
                        &nbsp;
                        
                        <i class="fa-solid fa-calendar"></i>
                        <span class="carrera-fecha">${carrera.fecha}</span>
                        
                        &nbsp;
                        
                        <i class="fa-solid fa-person-running"></i>
                        <span class="carrera-distancia">${carrera.distancia}km</span>
                    </p>
                `;
                carrerasContainer.appendChild(carreraDiv);
            });
        };
    } else {
        console.log("No se ha generado el token o ha expirado");
    }

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

    function IDusuario(token) {
        let tokenDecodificado = decodificarJWT(token);
        return tokenDecodificado.id;
    }
});
