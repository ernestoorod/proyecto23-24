document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('btn-atras').addEventListener('click', function() {
        goBack();
    });

    // Función para ir atrás en la historia del navegador
    function goBack() {
        window.history.back();
    }

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
            console.log(carreras);
            let carrerasContainer = document.querySelector(".carreras-container");
            carrerasContainer.innerHTML = "";
        
            if (!carreras || carreras.length === 0) {
                console.error("No se recibieron datos de carreras desde la API");
                return;
            }
        
            carreras.forEach((carrera) => {
                let carreraDiv = document.createElement("div");
                carreraDiv.classList.add("carrera");
        
                // Obtener la imagen de la carrera desde la API
                fetch("../PHP/archivosimagenes.php?nombre_carrera=" + encodeURIComponent(carrera.nombre))
                    .then(response => response.json())
                    .then(data => {
                        if (data.success && data.gpxData.length > 0) {
                            let imageFileName = data.gpxData[0].imageFileName; // Suponiendo que solo obtienes un archivo de imagen por carrera
                            let imageUrl = `../IMAGENES_CARRERAS/${imageFileName}`; // Construir la URL de la imagen
                            carreraDiv.innerHTML = `
                                <img src="${imageUrl}">
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
                        } else {
                            // Si no se encuentra ninguna imagen, usar una imagen por defecto
                            let imageUrl = "../IMAGENES_CARRERAS/default.jpg"; // URL de la imagen por defecto
                            carreraDiv.innerHTML = `
                                <img src="${imageUrl}">
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
                        }
                    })
                    .catch(error => {
                        console.error('Error al obtener datos de la imagen de la carrera:', error);
                        // Si hay un error, mostrar una imagen por defecto
                        let imageUrl = "../IMAGENES_CARRERAS/default.jpg"; // URL de la imagen por defecto
                        carreraDiv.innerHTML = `
                            <img src="${imageUrl}">
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
                    });
        
                // Agregar evento de clic para redireccionar a editarCarrera.html
                carreraDiv.addEventListener("click", function () {
                    window.location.href = "editarcarrera.html?ID=" + carrera.ID;
                });
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
