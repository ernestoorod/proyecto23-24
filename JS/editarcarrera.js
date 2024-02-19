document.addEventListener("DOMContentLoaded", function () {
    let dialogo = document.getElementById('modal');
    let btnBorrarCarrera = document.getElementById('btn-borrar-carrera');
    let btnCancelar = document.getElementById('btn-cancelar');
    let btnBorrar = document.getElementById('btn-borrar');
    let urlParams = new URLSearchParams(window.location.search);
    let nombreCarrera = urlParams.get('nombre');

    document.getElementById('btn-atras').addEventListener('click', function() {
        goBack();
    });

    // Función para ir atrás en la historia del navegador
    function goBack() {
        window.history.back();
    }

    btnBorrarCarrera.addEventListener('click', () => {
        dialogo.showModal();
    });

    btnCancelar.addEventListener('click', () => {
        dialogo.close();
    });

    btnBorrar.addEventListener('click', () => {
        console.log('Borrando carrera...');
        fetch("../PHP/editarcarrera.php?nombre=" + nombreCarrera, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("Carrera borrada exitosamente");
                window.location.href = "../principal.html";
            } else {
                console.error("Error al borrar la carrera:", data.error);
            }
        })
        .catch(error => {
            console.error("Error al borrar la carrera:", error);
        });
        dialogo.close();
    });

    if (window.location.href.includes("index.html")) {
        localStorage.removeItem("miToken");
    }

    document.getElementById("nombre").value = nombreCarrera;

    fetch("../PHP/editarcarrera.php?nombre=" + nombreCarrera)
    .then(response => response.json())
    .then(data => {
        document.getElementById("localizacion").value = data.localizacion;
        document.getElementById("fecha").value = data.fecha;
        document.getElementById("distancia").value = data.distancia;
        document.getElementById("desnivel").value = data.desnivel;
    })
    .catch(error => console.error("Error al obtener los datos de la carrera:", error));

    document.getElementById("editCarreraForm").addEventListener("submit", function(event) {
        event.preventDefault();

        let nombre = document.getElementById("nombre").value;
        let localizacion = document.getElementById("localizacion").value;
        let fecha = document.getElementById("fecha").value;
        let distancia = document.getElementById("distancia").value;
        let desnivel = document.getElementById("desnivel").value;

        if (!validarNombre(nombre)) {
            mostrarMensajeError(document.getElementById("nombre"), "Nombre de carrera inválido.");
            return;
        }

        if (!validarLocalizacion(localizacion)) {
            mostrarMensajeError(document.getElementById("localizacion"), "Localización inválida.");
            return;
        }

        if (!validarFecha(fecha)) {
            mostrarMensajeError(document.getElementById("fecha"), "Fecha inválida.");
            return;
        }

        if (!validarDistancia(distancia)) {
            mostrarMensajeError(document.getElementById("distancia"), "Distancia inválida.");
            return;
        }

        if (!validarDesnivel(desnivel)) {
            mostrarMensajeError(document.getElementById("desnivel"), "Desnivel inválido.");
            return;
        }

        enviarDatosEditados(nombre, localizacion, fecha, distancia, desnivel);
    });

    function enviarDatosEditados(nombre, localizacion, fecha, distancia, desnivel) {
        fetch("../PHP/editarcarrera.php?nombre=" + nombre, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                localizacion: localizacion,
                fecha: fecha,
                distancia: distancia,
                desnivel: desnivel
            })
        })

        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("Datos de la carrera editados exitosamente");
                window.location.href = "../principal.html";
            } else {
                console.error("Error al editar los datos de la carrera:", data.error);
            }
        })
        .catch(error => {
            console.error("Error al editar los datos de la carrera:", error);
        });
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
    
        // Insertar el mensaje de error dentro del div con id="errorDiv"
        const errorDiv = document.getElementById('errorDiv');
        errorDiv.innerHTML = ''; // Limpiar errores anteriores
        errorDiv.appendChild(errorElemento);
    }
    
    function mostrarError(mensaje) {
        const errorDiv = document.getElementById('errorDiv');
        errorDiv.textContent = mensaje;
    }
    
});
