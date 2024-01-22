function validarCorreo() {
    let correoInput = document.getElementById('correo');
    let correoValue = correoInput.value.trim();

    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (correoValue === '' || !regex.test(correoValue)) {
        correoInput.style.border = '3px solid red';
    } else {
        correoInput.style.border = '3px solid green';
    }
}

window.addEventListener('load', function () {
    let correoInput = document.getElementById('correo');
    correoInput.value = '';
    correoInput.style.border = '';

    correoInput.addEventListener('input', validarCorreo);
});

function redirigirARegistro() {
    validarCorreo();
    let correoInput = document.getElementById('correo');
    if (correoInput.style.border === '3px solid green') {
        window.location.href = "./registro.html";
    }
}