document.addEventListener('DOMContentLoaded', function () {
    let dialogo = document.getElementById('modal');
    let btnBorrarCuenta = document.getElementById('btn-borrar-cuenta');
    let btnCancelar = document.getElementById('btn-cancelar');
    let btnBorrar = document.getElementById('btn-borrar');

    btnBorrarCuenta.addEventListener('click', () => {
        dialogo.showModal();
    });

    btnCancelar.addEventListener('click', () => {
        dialogo.close();
    });

    btnBorrar.addEventListener('click', () => {
        console.log('Cuenta borrada');
        dialogo.close();
    });


    if (window.location.href.includes("index.html")) {
        localStorage.removeItem("miToken");
    }

    // Obtener el token JWT del localStorage
    let token = localStorage.getItem("miToken");

    if (token) {
        console.log("Token almacenado en el localStorage:", token); // Comprobar almacenamiento del token

        // Realizar una solicitud para obtener los datos del usuario usando el token
        fetchUserData(token);
    } else {
        // Si no hay token en el localStorage
        console.error("No hay token almacenado en localStorage");
    }
});

function fetchUserData(token) {
    // Realizar una solicitud para obtener y actualizar los datos del usuario usando el token
    fetch("./PHP/editar.php?miToken=" + token)
        .then(response => response.json())
        .then(data => {
            // Rellenar los campos de input con los datos del usuario
            if (data.error) {
                console.error("Error al obtener los datos del usuario:", data.error);
            } else {
                document.getElementById("username").value = data.username;
                document.getElementById("nombre").value = data.nombre;
                document.getElementById("correo").value = data.correo;
                document.getElementById("telefono").value = data.telefono;
                document.getElementById("localidad").value = data.localidad;
                document.getElementById("club").value = data.club;
                // Puedes agregar más campos aquí según la estructura de tu tabla de usuarios
            }
        })
        .catch(error => {
            console.error("Error al obtener los datos del usuario:", error);
        });
}

function guardarCambios() {
    console.log("guardarCambios() se está ejecutando"); // Comprobar ejecución de la función

    // Obtener el token del localStorage
    let token = localStorage.getItem("miToken");

    // Comprobar si el token está presente
    if (!token) {
        console.error("No hay token almacenado en localStorage");
        return;
    }

    // Obtener los valores de los inputs
    let username = document.getElementById("username").value;
    let nombre = document.getElementById("nombre").value;
    let correo = document.getElementById("correo").value;
    let telefono = document.getElementById("telefono").value;
    let localidad = document.getElementById("localidad").value;
    let club = document.getElementById("club").value;

    // Construir el objeto con los datos actualizados
    let userData = {
        username: username,
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        localidad: localidad,
        club: club,
    };

    // Comprobar si el token se está agregando correctamente al objeto userData
    console.log("Datos a enviar al backend:", userData);

    // Realizar una solicitud para guardar los cambios
    fetch("./PHP/editar.php?miToken=" + token, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("Cambios guardados exitosamente");
            // Puedes mostrar un mensaje de éxito o redirigir a otra página
        } else {
            console.error("Error al guardar los cambios:", data.error);
        }
    })
    .catch(error => {
        console.error("Error al guardar los cambios:", error);
    });
};
