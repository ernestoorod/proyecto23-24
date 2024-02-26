document.addEventListener("DOMContentLoaded", function () {
    const editCarreraForm = document.getElementById('editCarreraForm');

    // Obtenemos el ID de la carrera de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const carreraID = urlParams.get('ID');

    // Asignamos el ID de la carrera al campo oculto del formulario
    document.getElementById('carreraID').value = carreraID;

    //Boton ir pagina de atras
    document.getElementById('btn-atras').addEventListener('click', function() {
        goBack();
    });

    // Función para ir atrás en la historia del navegador
    function goBack() {
        window.history.back();
    }

    // Rellenamos los campos del formulario con los datos de la carrera
    fetch("../PHP/obtenercarrera.php?ID=" + carreraID)
        .then(response => response.json())
        .then(carrera => {
            document.getElementById('nombre').value = carrera.nombre;
            document.getElementById('localizacion').value = carrera.localizacion;
            document.getElementById('fecha').value = carrera.fecha;
            document.getElementById('distancia').value = carrera.distancia;
        })
        .catch(error => {
            console.error('Error al obtener los datos de la carrera:', error);
        });

    // Agregamos un listener al evento submit del formulario para manejar la actualización de la carrera
    editCarreraForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe automáticamente

        // Obtenemos los valores de los campos del formulario
        const nombre = document.getElementById('nombre').value;
        const localizacion = document.getElementById('localizacion').value;
        const fecha = document.getElementById('fecha').value;
        const distancia = document.getElementById('distancia').value;

        // Creamos un objeto con los datos de la carrera
        const carreraData = {
            ID: carreraID,
            nombre: nombre,
            localizacion: localizacion,
            fecha: fecha,
            distancia: distancia
        };

        // Enviamos la solicitud de actualización al servidor
        fetch("../PHP/editarcarrera.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(carreraData)
        })
        .then(response => response.json())
        .then(data => {
            // Aquí puedes manejar la respuesta del servidor, como mostrar un mensaje de éxito o redireccionar a otra página
            console.log('Carrera actualizada:', data);
            window.location.href = '../principal.html'
        })
        .catch(error => {
            console.error('Error al actualizar la carrera:', error);
        });
    });
});
1