document.addEventListener('DOMContentLoaded', function() {
    let token = localStorage.getItem('miToken');
    let userId = IDusuario(token);
    console.log(userId);

    document.getElementById('btn-crear').addEventListener('click', function() {
        let nombre = document.getElementById('nombrecarrera').value;
        let localizacion = document.getElementById('localizacion').value;
        let distancia = document.getElementById('distancia').value;
        let fecha = document.getElementById('fecha').value;
        let desnivel = document.getElementById('desnivel').value;

        // Objeto FormData para enviar los datos del formulario excluyendo el archivo
        let formDataCarrera = new FormData();
        formDataCarrera.append('nombre', nombre);
        formDataCarrera.append('localizacion', localizacion);
        formDataCarrera.append('distancia', distancia);
        formDataCarrera.append('fecha', fecha);
        formDataCarrera.append('desnivel', desnivel);
        formDataCarrera.append('IDusuario', userId);

        fetch('../PHP/añadircarrera.php', {
            method: 'POST',
            body: formDataCarrera,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                let carreraNombre = nombre; // Obtener el nombre de la carrera
                console.log('Carrera creada con éxito. Nombre de carrera: ' + carreraNombre);

                // Obtener el archivo GPX seleccionado por el usuario
                let gpxFile = document.getElementById('gpx').files[0];
                let imagenFile = document.getElementById('imagen').files[0];

                // Objeto FormData para enviar el archivo GPX
                let formDataGPX = new FormData();
                formDataGPX.append('gpx', gpxFile);
                formDataGPX.append('nombre_carrera', carreraNombre); // Pasar el nombre de la carrera

                // Objeto FormData para enviar la imagen
                let formDataImagen = new FormData();
                formDataImagen.append('imagen', imagenFile);
                formDataImagen.append('nombre_carrera', carreraNombre); // Pasar el nombre de la carrera

                // Solicitud POST para enviar el archivo GPX
                fetch('../PHP/rutagpx.php', {
                    method: 'POST',
                    body: formDataGPX,
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Archivo GPX enviado con éxito.');
                        // Después de enviar el archivo GPX, enviar la imagen
                        fetch('../PHP/imagen.php', {
                            method: 'POST',
                            body: formDataImagen,
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                console.log('Imagen enviada con éxito.');
                                window.location.href = "../principal.html";
                            } else {
                                console.log('Error al enviar la imagen: ' + data.error);
                            }
                        })
                        .catch(error => console.error('Error al enviar la imagen:', error));
                    } else {
                        console.log('Error al enviar archivo GPX: ' + data.error);
                    }
                })
                .catch(error => console.error('Error al enviar archivo GPX:', error));

            } else {
                console.log('Error al crear carrera: ' + data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    });

    function IDusuario(token) {
        let tokenDecodificado = decodificarJWT(token);
        return tokenDecodificado.id;
    }

    function decodificarJWT(token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let cargaPayloadJson = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(cargaPayloadJson);
    }
});
