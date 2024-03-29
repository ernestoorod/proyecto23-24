document.addEventListener("DOMContentLoaded", function () {
    let urlParams = new URLSearchParams(window.location.search);
    let carreraNombre = urlParams.get("carrera");
    let token = localStorage.getItem("miToken");
    let btnPerfil = document.getElementById("fotoperfil");
    let iniciosesion = document.getElementById("iniciosesion");
    let iniciarsesion = document.getElementById("iniciarsesion");
    let apuntarme = document.getElementById("apuntarme");
    let detallesCarrera = document.getElementById("detallescarrera");

    // Mostrar foto de perfil o botón de inicio de sesión según la existencia del token
    if (token != null) {
        btnPerfil.style.display = "block";
        iniciosesion.style.display = "none";
        apuntarme.style.display = "block";
        iniciarsesion.style.display = "none";
    } else {
        btnPerfil.style.display = "none";
        iniciosesion.style.display = "block";
        apuntarme.style.display = "none";
        iniciarsesion.style.display = "block";
    }

    document.getElementById("nombreCarrera").innerText = carreraNombre;

    let map = L.map("map").setView([42.6, -5.57], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Obtener datos desde carrera.php y cargar el GPX correspondiente
    fetch("./PHP/carrera.php", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            // Luego de obtener los datos, mostrar los detalles de la carrera
            mostrarDetallesCarrera(responseData, carreraNombre);
        })
        .catch((error) => {
            console.error("Error al cargar datos desde la API:", error);
        });

    function mostrarDetallesCarrera(carreras, nombre) {
        detallesCarrera.innerHTML = ''; // Limpiar el contenido anterior

        var html = '';
        var carrera = carreras.find(carrera => carrera.nombre == nombre);
        if (carrera) {
            html += '<div class="detalle-carrera">';
            // Cargar la imagen desde la API de imágenes
            fetch("../PHP/archivosimagenes.php?nombre_carrera=" + encodeURIComponent(carrera.nombre))
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.gpxData.length > 0) {
                        let imageFileName = data.gpxData[0].imageFileName; // Suponiendo que solo obtienes un archivo de imagen por carrera
                        let imageUrl = `../IMAGENES_CARRERAS/${imageFileName}`; // Construir la URL de la imagen
                        html += `<img src="${imageUrl}" class="detalle-carrera-img"></img>`;
                    } else {
                        html += '<img src="./IMAGENES/defecto.jpg" class="detalle-carrera-img"></img>'; // Si no hay imagen, muestra una por defecto
                    }
                    html += '<div class="detalle-carrera-info">';
                    html += '<ul>';
                    html += '<li>';
                    html += '<strong>Nombre:</strong> <span class="detalle-carrera-nombre">' + carrera.nombre + '</span><br>';
                    html += '<strong>Localización:</strong> <span class="detalle-carrera-localizacion">' + carrera.localizacion + '</span><br>';
                    html += '<strong>Fecha:</strong> <span class="detalle-carrera-fecha">' + carrera.fecha + '</span><br>';
                    html += '<strong>Distancia:</strong> <span class="detalle-carrera-distancia">' + carrera.distancia + 'km</span><br>';
                    html += '<strong>Desnivel:</strong> <span class="detalle-carrera-desnivel">' + carrera.desnivel + '</span><br>';
                    html += '</li>';
                    html += '</ul>';
                    html += '</div>';
                    html += '</div>';
                    detallesCarrera.innerHTML = html;
                })
                .catch(error => {
                    console.error('Error al obtener datos de la imagen de la carrera:', error);
                    // Si hay un error al obtener la imagen, muestra una por defecto
                    html += '<img src="./IMAGENES/defecto.jpg" class="detalle-carrera-img"></img>';
                    html += '<div class="detalle-carrera-info">';
                    html += '<ul>';
                    html += '<li>';
                    html += '<strong>Nombre:</strong> <span class="detalle-carrera-nombre">' + carrera.nombre + '</span><br>';
                    html += '<strong>Localización:</strong> <span class="detalle-carrera-localizacion">' + carrera.localizacion + '</span><br>';
                    html += '<strong>Fecha:</strong> <span class="detalle-carrera-fecha">' + carrera.fecha + '</span><br>';
                    html += '<strong>Distancia:</strong> <span class="detalle-carrera-distancia">' + carrera.distancia + 'km</span><br>';
                    html += '<strong>Desnivel:</strong> <span class="detalle-carrera-desnivel">' + carrera.desnivel + '</span><br>';
                    html += '</li>';
                    html += '</ul>';
                    html += '</div>';
                    html += '</div>';
                    detallesCarrera.innerHTML = html;
                });



            // Obtener el nombre del archivo GPX y cargarlo en el mapa
            fetch(`../PHP/archivosgpx.php?nombre_carrera=${nombre}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const gpxFileName = data.gpxData[0].gpxFileName;
                        const gpxFilePath = `../GPX/${gpxFileName}`;

                        new L.GPX(gpxFilePath, {
                            async: true,
                            polyline_options: {
                                color: 'red',
                                opacity: 0.75,
                                weight: 3
                            }
                        }).on('loaded', function (e) {
                            map.fitBounds(e.target.getBounds());
                        }).addTo(map);
                    } else {
                        throw new Error('No se pudo obtener el nombre del archivo GPX');
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            html = '<p>No se encontró la carrera con nombre ' + nombre + '</p>';
        }
        detallesCarrera.innerHTML = html;
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

    // Función para obtener el ID de usuario desde el token
    function obtenerIDUsuarioDesdeToken(token) {
        let tokenDecodificado = decodificarJWT(token);
        return tokenDecodificado.id;
    }

    // Evento click en el botón "Apuntarme"
    apuntarme.addEventListener('click', function () {
        // Verificar si el token existe
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

    // Evento click en el botón "Aceptar" del modal
    document.getElementById('aceptar').addEventListener('click', function () {
        document.getElementById('modal').style.display = 'none'; // Ocultar el modal
    });

    // Evento click en el botón "Cerrar" del modal
    document.getElementById('close').addEventListener('click', function () {
        document.getElementById('modal').style.display = 'none'; // Ocultar el modal
    });

    // Evento click en el botón de perfil
    btnPerfil.addEventListener("click", () => {
        window.location.href = "../perfil.html"; // Redirigir a la página de perfil
    });

    // Eliminar token si index.html está en la URL
    if (window.location.href.includes("index.html")) {
        localStorage.removeItem("miToken");
    }
});
