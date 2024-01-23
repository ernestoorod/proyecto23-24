//Correo
function validarCorreo() {
    let correoInput = document.getElementById('correo');
    let correoValue = correoInput.value.trim();

    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (correoValue === '' || !regex.test(correoValue)) {
        correoInput.style.border = '3px solid red';
        return false;
    } else {
        correoInput.style.border = '3px solid green';
        document.cookie = `correo=${correoValue}; path=/`;
        return true;
    }
}

window.addEventListener('load', function () {
    let correoInput = document.getElementById('correo');
    correoInput.value = '';
    correoInput.style.border = '';

    correoInput.addEventListener('input', validarCorreo);

    let empezarButton = document.getElementById('empezarButton');
    empezarButton.addEventListener('click', function () {
        if (validarCorreo()) {
            window.location.href = "./registro.html";
        }
    });
});

