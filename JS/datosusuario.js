document.addEventListener('DOMContentLoaded', function () {
    const dialogo = document.getElementById('modal');
    const btnBorrarCuenta = document.getElementById('btn-borrar-cuenta');
    const btnCancelar = document.getElementById('btn-cancelar');
    const btnBorrar = document.getElementById('btn-borrar');

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
});