document.addEventListener('DOMContentLoaded', function () {
    let dialogo = document.getElementById('modal');
    let btnBorrarCuenta = document.getElementById('btn-borrar-cuenta');
    let btnCancelar = document.getElementById('btn-cancelar');
    let btnBorrar = document.getElementById('btn-borrar');

    document.getElementById('btn-atras').addEventListener('click', function() {
        goBack();
    });

    // Función para ir atrás en la historia del navegador
    function goBack() {
        window.history.back();
    }

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
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener los datos del usuario. Estado HTTP: " + response.status);
            }
            return response.json();
        })
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

                // Comprobar si hay texto en los campos de club y teléfono
                if (!data.club) {
                    document.getElementById("lclub").style.display = "none";
                    document.getElementById("club").style.display = "none";
                } else {
                    document.getElementById("lclub").style.display = "block";
                    document.getElementById("club").style.display = "block";
                }

                if (!data.telefono) {
                    document.getElementById("ltelefono").style.display = "none";
                    document.getElementById("telefono").style.display = "none";
                } else {
                    document.getElementById("ltelefono").style.display = "block";
                    document.getElementById("telefono").style.display = "block";
                }
            }
        })
        .catch(error => {
            console.error("Error al obtener los datos del usuario:", error);
            mostrarError("Error al obtener los datos del usuario. Por favor, inténtalo de nuevo más tarde.");
        });
}


function guardarCambios() {
    let token = localStorage.getItem("miToken");
    if (!token) {
        console.error("No hay token almacenado en localStorage");
        mostrarError("No hay token almacenado en localStorage. Por favor, vuelve a iniciar sesión.");
        return;
    }

    let username = document.getElementById("username").value.trim();
    let nombre = document.getElementById("nombre").value.trim();
    let correo = document.getElementById("correo").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let localidad = document.getElementById("localidad").value.trim();
    let club = document.getElementById("club").value.trim();

    // Validar que no haya campos vacíos
    if (!username || !nombre || !correo || !localidad) {
        console.error("Por favor, complete todos los campos.");
        mostrarError("Por favor, complete todos los campos.");
        return;
    }

    let userData = {
        username: username,
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        localidad: localidad,
        club: club,
    };

    console.log("Datos a enviar al backend:", userData);

    // Llama a la función para guardar la contraseña
    guardarContraseña();

    // Continúa con el proceso de guardar los cambios de usuario
    fetch("./PHP/editar.php?miToken=" + token, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al guardar los cambios. Estado HTTP: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log("Cambios guardados exitosamente");
            window.location.href = "../principal.html";
        } else {
            console.error("Error al guardar los cambios:", data.error);
            mostrarError("Error al guardar los cambios. Por favor, inténtalo de nuevo más tarde.");
        }
    })
    .catch(error => {
        console.error("Error al guardar los cambios:", error);
        mostrarError("Error al guardar los cambios. Por favor, inténtalo de nuevo más tarde.");
    });
}



function borrarCuenta() {
    let token = localStorage.getItem("miToken");
    if (!token) {
        console.error("No hay token almacenado en localStorage");
        mostrarError("No hay token almacenado en localStorage. Por favor, vuelve a iniciar sesión.");
        return;
    }

    fetch("./PHP/editar.php?miToken=" + token, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al eliminar la cuenta. Estado HTTP: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log("Cuenta eliminada exitosamente");
            // Ahora, eliminar las imágenes asociadas a las carreras del usuario
            eliminarImagenes()
                .then(() => {
                    localStorage.removeItem("miToken");
                    window.location.href = "../index.html";
                })
                .catch(error => {
                    console.error("Error al eliminar las imágenes:", error);
                    // Mostrar un mensaje de error al usuario
                    mostrarError("Error al eliminar las imágenes asociadas a las carreras. Por favor, inténtalo de nuevo más tarde.");
                });
        } else {
            console.error("Error al eliminar la cuenta:", data.error);
            // Mostrar un mensaje de error al usuario
            mostrarError("Error al eliminar la cuenta. Por favor, inténtalo de nuevo más tarde.");
        }
    })
    .catch(error => {
        console.error("Error al eliminar la cuenta:", error);
        // Mostrar un mensaje de error al usuario
        mostrarError("Error al eliminar la cuenta. Por favor, inténtalo de nuevo más tarde.");
    });
}

function eliminarImagenes() {
    return new Promise((resolve, reject) => {
        let token = localStorage.getItem("miToken");
        if (!token) {
            reject("No hay token almacenado en localStorage");
            return;
        }

        fetch("./PHP/editar.php?miToken=" + token + "&borrarImagenes=true", {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("Imágenes eliminadas exitosamente");
                resolve();
            } else {
                reject("Error al eliminar las imágenes: " + data.error);
            }
        })
        .catch(error => {
            reject("Error al eliminar las imágenes: " + error);
        });
    });
}

function mostrarError(errorMsg) {
    let errorDiv = document.getElementById("errorDiv");
    errorDiv.textContent = errorMsg;
}

function guardarContraseña() {
    let token = localStorage.getItem("miToken");
    if (!token) {
        console.error("No hay token almacenado en localStorage");
        return;
    }

    let passwordNew = document.getElementById("password-new").value.trim();
    let passwordRepeat = document.getElementById("password-repeat").value.trim();

    // Validar que las contraseñas no estén vacías
    if (!passwordNew || !passwordRepeat) {
        console.error("Por favor, complete todos los campos.");
        mostrarError("Por favor, complete todos los campos.");
        return;
    }

    // Validar que las contraseñas coincidan
    if (passwordNew !== passwordRepeat) {
        console.error("Las contraseñas nuevas no coinciden");
        mostrarError("Las contraseñas nuevas no coinciden.");
        return;
    }

    let passwordData = {
        passwordNew: passwordNew
    };

    console.log("Datos de contraseña a enviar al backend:", passwordData);

    fetch("../PHP/editar-contrasena.php?miToken=" + token, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(passwordData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("Contraseña cambiada exitosamente");
            window.location.href = "../index.html"; // Redireccionar a index.html si la contraseña se cambió con éxito
        } else {
            console.error("Error al cambiar la contraseña:", data.error);
            // Mostrar un mensaje de error al usuario
            mostrarError("Error al cambiar la contraseña, vuelva a intentarlo.");
        }
    })
    .catch(error => {
        console.error("Error al cambiar la contraseña:", error);
        // Mostrar un mensaje de error al usuario
        mostrarError("Error al cambiar la contraseña, vuelva a intentarlo.");
    });
}





