document.addEventListener('DOMContentLoaded', function () {
    let usuario = document.getElementById('username');
    let contraseña = document.getElementById('password');

    // Función para validar campo y mostrar símbolo de validación
    function validarCampo(valor, expresion, idValidacion) {
        const validacionElemento = document.getElementById(idValidacion);
        if (valor && expresion.test(valor)) {
            validacionElemento.innerHTML = '✓';
        } else {
            validacionElemento.innerHTML = '';
        }
    }

    // Nombre de usuario
    function validarNombreUsuario() {
        const valor = usuario.value.trim();
        validarCampo(valor, /^([^\s_].*[^\s_])?$/, 'usuarioValidacion');
    }

        // Contraseña
        function validarContraseña() {
            const valor = contraseña.value;
            const longitud = valor.length;
            const tieneMinuscula = /[a-z]/.test(valor);
            const tieneMayuscula = /[A-Z]/.test(valor);
            const tieneNumero = /\d/.test(valor);
            const tieneCaracterEspecial = /[./'(),;&@#*_) (+:"~]/.test(valor);
    
            if (longitud >= 10 && longitud <= 40 &&
                tieneMinuscula && tieneMayuscula && tieneNumero && tieneCaracterEspecial) {
                mostrarFortalezaContraseña('Muy Fuerte');
            } else if (longitud >= 8 && longitud < 10 &&
                (tieneMinuscula || tieneMayuscula || tieneNumero)) {
                mostrarFortalezaContraseña('Debil');
            } else if (longitud >= 8 &&
                (tieneMinuscula || tieneMayuscula || tieneNumero || tieneCaracterEspecial)) {
                mostrarFortalezaContraseña('Fuerte');
            } else {
                mostrarFortalezaContraseña('Muy Debil');
            }
            
        }
    
        // Función para mostrar la fortaleza de la contraseña
        function mostrarFortalezaContraseña(fortaleza) {
            const validacionElemento = document.getElementById('contraseñaValidacion');
            validacionElemento.innerHTML = fortaleza;
    
        function aplicarEstilos(mediaQuery) {
            if (mediaQuery.matches) {
                if (fortaleza === 'Muy Debil') {
                    validacionElemento.style.top = '-40px';
                    validacionElemento.style.left = '305px';
                } else if (fortaleza === 'Muy Fuerte') {
                    validacionElemento.style.top = '-40px';
                    validacionElemento.style.left = '295px';
                } else if (fortaleza === 'Debil') {
                    validacionElemento.style.top = '-40px';
                    validacionElemento.style.left = '340px';
                } else {
                    validacionElemento.style.top = '-40px';
                    validacionElemento.style.left = '330px';
                }
            } else {
                if (fortaleza === 'Muy Debil') {
                    validacionElemento.style.top = '-35px';
                    validacionElemento.style.left = '370px';
                } else if (fortaleza === 'Muy Fuerte') {
                    validacionElemento.style.top = '-35px';
                    validacionElemento.style.left = '360px';
                } else if (fortaleza === 'Debil') {
                    validacionElemento.style.top = '-35px';
                    validacionElemento.style.left = '405px';
                } else {
                    validacionElemento.style.top = '-35px';
                    validacionElemento.style.left = '395px';
                }
            }
        }
    
        const mediaQuery = window.matchMedia('(max-width: 500px)');
        aplicarEstilos(mediaQuery);
    
        mediaQuery.addeventListener(aplicarEstilos);
        }

// Asociar funciones de validación a los eventos de cambio en los campos correspondientes
usuario.addEventListener('input', validarNombreUsuario);
contraseña.addEventListener('input', validarContraseña);

// Llamada a las funciones de validación en la carga inicial
validarNombreUsuario();
validarContraseña();

});