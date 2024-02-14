document.addEventListener("DOMContentLoaded", function () {
    let dialogo = document.getElementById('modal');
    let btnBorrarCarrera = document.getElementById('btn-borrar-carrera');
    let btnCancelar = document.getElementById('btn-cancelar');
    let btnBorrar = document.getElementById('btn-borrar');
    let urlParams = new URLSearchParams(window.location.search);
    let nombreCarrera = urlParams.get('nombre');

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
});