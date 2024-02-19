document.addEventListener('DOMContentLoaded', function () {
    let usuario = document.getElementById('username');
    let nombre = document.getElementById('nombre');
    let correo = document.getElementById('correo');
    let contraseña = document.getElementById('password');
    let repetircontraseña = document.getElementById('password2');
    let telefono = document.getElementById('telefono');
    let form = document.getElementById('registroForm');
    let mensajeUsuarioEnUso = document.getElementById('mensajeDisponibilidad');
    let submitButton = document.getElementById('submitButton');

    usuario.addEventListener('input', function () {
        const valor = usuario.value.trim();
        if (valor !== '') {
            fetch('../PHP/verificar_usuario.php?username=' + encodeURIComponent(valor))
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error de conexión al servidor. Estado: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                if (!data.error) {
                    if (data.available) {
                        mensajeUsuarioEnUso.textContent = 'Nombre de usuario disponible';
                        mensajeUsuarioEnUso.style.color = 'green';
                        submitButton.disabled = false; // Habilitar el botón de enviar si el nombre de usuario está disponible
                    } else {
                        mensajeUsuarioEnUso.textContent = 'El nombre de usuario ya está en uso';
                        mensajeUsuarioEnUso.style.color = 'red';
                        submitButton.disabled = true; // Deshabilitar el botón de enviar si el nombre de usuario está en uso
                    }
                } else {
                    console.log('Error al verificar el nombre de usuario:', data.error);
                }
            })
            .catch(error => {
                console.log('Error:', error.message);
            });
        } else {
            mensajeUsuarioEnUso.textContent = '';
        }
    });
    
    // Localidades
    fetch('./poblaciones.json')
    .then(response => response.json())
    .then(data => {
        const datalist = document.getElementById('localidades');

        data.forEach(localidad => {
        const option = document.createElement('option');
        option.value = localidad.label;
        datalist.appendChild(option);
        });
    })
    .catch(error => console.error('Error al cargar las localidades:', error));

    // Email del landing page
    const cookies = document.cookie.split(';');
    let correoStorage = '';
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'correo') {
            correoStorage = value;
            break;
        }
    }

    if (correoStorage) {
        correo.value = decodeURIComponent(correoStorage);
    }

    // Guardar el token en el localStorage
    function guardarTokenEnLocalStorage(token) {
        localStorage.setItem('miToken', token);
    }
  
    // API
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        let datosFormulario = new FormData(form);

        fetch('../PHP/usuarios.php', {
            method: 'POST',
            body: datosFormulario
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error de conexión al servidor. Estado: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);

            if (data.success && data.token) {
                guardarTokenEnLocalStorage(data.token);
                window.location.href = './principal.html';
            } else {
                console.log('Error al registrar usuario:', data.error);
            }
        })
        .catch(error => {
            console.log('Error:', error.message);
        });
    });

    // Función para validar campo y mostrar símbolo de validación
    function validarCampo(valor, expresion, idValidacion) {
        const validacionElemento = document.getElementById(idValidacion);
        if (validacionElemento) {
            if (valor && expresion.test(valor)) {
                validacionElemento.innerHTML = '✓';
            } else {
                validacionElemento.innerHTML = '';
            }
        }
    }

    // Nombre de usuario
    function validarNombreUsuario() {
        const valor = usuario.value.trim();
        validarCampo(valor, /^([^\s_].*[^\s_])?$/, 'usuarioValidacion');
    }

    // Nombre
    function validarNombre() {
        const valor = nombre.value.trim();
        validarCampo(valor, /^.+$/, 'nombreValidacion');
    }

    // Correo electrónico
    function validarCorreo() {
        const valor = correo.value.trim();
        validarCampo(valor, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'correoValidacion');
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
    


    // Repetir Contraseña
    function validarRepetirContraseña() {
        const valor1 = contraseña.value;
        const valor2 = repetircontraseña.value;

        if (valor1 === valor2 && valor1 !== '') {
            mostrarCoincidenciaContraseña(true);
        } else {
            mostrarCoincidenciaContraseña(false);
        }
    }

    // Función para mostrar la coincidencia de las contraseñas
    function mostrarCoincidenciaContraseña(coinciden) {
        const validacionElemento = document.getElementById('repetirContraseñaValidacion');
        validacionElemento.innerHTML = coinciden ? '✓' : '';
    }


    // Teléfono
    function validarTelefono() {
        const valor = telefono.value.trim();
        validarCampo(valor, /^\d{9}$/, 'telefonoValidacion');
    }

    if (window.location.href.includes("index.html")) {
        localStorage.removeItem("miToken");
    }

    // Asociar funciones de validación a los eventos de cambio en los campos correspondientes
    usuario.addEventListener('input', validarNombreUsuario);
    nombre.addEventListener('input', validarNombre);
    correo.addEventListener('input', validarCorreo);
    contraseña.addEventListener('input', validarContraseña);
    repetircontraseña.addEventListener('input', validarRepetirContraseña);
    telefono.addEventListener('input', validarTelefono);

    // Llamada a las funciones de validación en la carga inicial
    validarNombreUsuario();
    validarNombre();
    validarCorreo();
    validarContraseña();
    validarRepetirContraseña();
    validarTelefono();
    guardarTokenEnLocalStorage(data.token);
});