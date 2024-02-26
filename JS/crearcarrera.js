document.addEventListener('DOMContentLoaded', function() {
    let token = localStorage.getItem('miToken');
    let userId = IDusuario(token);
    console.log(userId);

    document.getElementById('btn-atras').addEventListener('click', function() {
        goBack();
    });

    // Función para ir atrás en la historia del navegador
    function goBack() {
        window.history.back();
    }

    document.getElementById('btn-crear').addEventListener('click', function() {
        let nombre = document.getElementById('nombrecarrera').value;
        let localizacion = document.getElementById('localizacion').value;
        let distancia = document.getElementById('distancia').value;
        let fecha = document.getElementById('fecha').value;
        let desnivel = document.getElementById('desnivel').value;

        // Validar los campos antes de enviar el formulario
        if (!validarNombre(nombre)) {
            mostrarMensajeError(document.getElementById('nombrecarrera'), 'El nombre de la carrera es inválido');
            return;
        }
        if (!validarLocalizacion(localizacion)) {
            mostrarMensajeError(document.getElementById('localizacion'), 'La localización es inválida');
            return;
        }
        if (!validarDistancia(distancia)) {
            mostrarMensajeError(document.getElementById('distancia'), 'La distancia es inválida');
            return;
        }
        if (!validarFecha(fecha)) {
            mostrarMensajeError(document.getElementById('fecha'), 'La fecha es inválida');
            return;
        }
        if (!validarDesnivel(desnivel)) {
            mostrarMensajeError(document.getElementById('desnivel'), 'El desnivel es inválido');
            return;
        }

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
                window.location.href = "../principal.html";
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
                mostrarError('Error al crear carrera: ' + data.error);
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

    // Función para validar el nombre de la carrera
    function validarNombre(nombre) {
        return nombre.trim() !== '' && !nombre.startsWith('_') && !nombre.startsWith('-');
    }

    // Función para validar la localización
    function validarLocalizacion(localizacion) {
        return localizacion.trim() !== '';
    }

    // Función para validar la distancia
    function validarDistancia(distancia) {
        return !isNaN(distancia) && distancia.trim() !== '';
    }

    // Función para validar la fecha
    function validarFecha(fecha) {
        const fechaActual = new Date();
        const regexFecha = /^\d{2}\/\d{2}\/\d{4}$/;
    
        if (!regexFecha.test(fecha.trim())) {
            return false;
        }
    
        const [dia, mes, año] = fecha.split('/').map(Number);
    
        if (dia < 1 || dia > 31 || mes < 1 || mes > 12) {
            return false;
        }
    
        const fechaIngresada = new Date(`${mes}/${dia}/${año}`);
        if (fechaIngresada < fechaActual) {
            return false;
        }
    
        return true;
    }
    

    // Función para validar el desnivel
    function validarDesnivel(desnivel) {
        return !isNaN(desnivel) && desnivel.trim() !== '' && !desnivel.startsWith('_') && !desnivel.startsWith('-');
    }

    function mostrarMensajeError(inputElement, mensaje) {
        // Crear un nuevo elemento <div> para mostrar el mensaje de error
        const errorElemento = document.createElement('div');
        errorElemento.className = 'error';
        errorElemento.textContent = mensaje;
    
        // Insertar el mensaje de error debajo del campo de entrada
        inputElement.parentNode.insertBefore(errorElemento, inputElement.nextSibling);
    }

    function mostrarError(mensaje) {
        const errorContainer = document.getElementById('error-messages');
        errorContainer.textContent = mensaje;
    }
});
