document.addEventListener('DOMContentLoaded', function () {
    let dialogo = document.getElementById('modal');
    let btnBorrarCuenta = document.getElementById('btn-borrar-cuenta');
    let btnCancelar = document.getElementById('btn-cancelar');
    let btnBorrar = document.getElementById('btn-borrar');
    let token = localStorage.getItem('miToken');

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
});
