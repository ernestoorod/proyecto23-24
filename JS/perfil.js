document.addEventListener('DOMContentLoaded', function () {
    const btnAbrirModal = document.getElementById('btn-abrir-modal');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const btnVolverModal = document.getElementById('btn-volver-modal');
    const btnCerrarCrearCarrera = document.getElementById('btn-cerrar-crearcarrera');
    const btnVolverCrearCarrera = document.getElementById('btn-volver-crearcarrera');
    const nombreCarreraSpan = document.getElementById('nombreCarreraSpan');

    btnAbrirModal.addEventListener("click", () => {
        modal.showModal();
    });

    btnCerrarModal.addEventListener("click", () => {
        modal.close();
    });

    btnVolverModal.addEventListener("click", () => {
        modal.close();
    });

    btnCerrarCrearCarrera.addEventListener("click", () => {
        crearcarrera.close();
    });

    btnVolverCrearCarrera.addEventListener("click", () => {
        crearcarrera.close();
        modal.showModal();
    });

    const btnSiguiente = document.getElementById('btn-siguiente');

    btnSiguiente.addEventListener("click", () => {
        const nombreCarrera = document.getElementById('nombrecarrera').value;
        nombreCarreraSpan.textContent = nombreCarrera;
        modal.close();
        crearcarrera.showModal();
    });
});