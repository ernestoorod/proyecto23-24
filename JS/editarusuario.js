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
        borrarCuenta();
        
    });


    if (window.location.href.includes("index.html")) {
        localStorage.removeItem("miToken");
    }

    let token = localStorage.getItem("miToken");

    if (token) {
        console.log("Token almacenado en el localStorage:", token);
        fetchUserData(token);
    } else {
        console.error("No hay token almacenado en localStorage");
    }
});

function fetchUserData(token) {
    fetch("./PHP/editar.php?miToken=" + token)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error al obtener los datos del usuario:", data.error);
            } else {
                document.getElementById("username").value = data.username;
                document.getElementById("nombre").value = data.nombre;
                document.getElementById("correo").value = data.correo;
                document.getElementById("telefono").value = data.telefono;
                document.getElementById("localidad").value = data.localidad;
                document.getElementById("club").value = data.club;
            }
        })
        .catch(error => {
            console.error("Error al obtener los datos del usuario:", error);
        });
}

function guardarCambios() {
    let token = localStorage.getItem("miToken");
    if (!token) {
        console.error("No hay token almacenado en localStorage");
        return;
    }

    let username = document.getElementById("username").value;
    let nombre = document.getElementById("nombre").value;
    let correo = document.getElementById("correo").value;
    let telefono = document.getElementById("telefono").value;
    let localidad = document.getElementById("localidad").value;
    let club = document.getElementById("club").value;

    let userData = {
        username: username,
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        localidad: localidad,
        club: club,
    };

    console.log("Datos a enviar al backend:", userData);

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
        } else {
            console.error("Error al guardar los cambios:", data.error);
        }
    })
    .catch(error => {
        console.error("Error al guardar los cambios:", error);
    });
};

function borrarCuenta() {
    let token = localStorage.getItem("miToken");
    if (!token) {
        console.error("No hay token almacenado en localStorage");
        return;
    }

    fetch("./PHP/editar.php?miToken=" + token, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("Cuenta eliminada exitosamente");
            localStorage.removeItem("miToken");
            window.location.href = "../index.html";
            // Redireccionar a la página de inicio o mostrar un mensaje de éxito
        } else {
            console.error("Error al eliminar la cuenta:", data.error);
            // Mostrar un mensaje de error al usuario
        }
    })
    .catch(error => {
        console.error("Error al eliminar la cuenta:", error);
        // Mostrar un mensaje de error al usuario
    });
};
