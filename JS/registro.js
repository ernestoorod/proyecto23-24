document.addEventListener('DOMContentLoaded', function () {
    let usuario = document.getElementById('username');
    let nombre = document.getElementById('nombre');
    let correo = document.getElementById('correo');
    let contraseña = document.getElementById('password');
    let repetircontraseña = document.getElementById('password2');
    let telefono = document.getElementById('telefono');
    let form = document.getElementById('registroForm');
    let tokenForm = document.getElementById('loginForm');

    fetch('poblaciones.json')
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
  
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        let datosFormulario = new FormData(form);

        fetch('./PHP/usuarios.php', {
            method: 'POST',
            body: datosFormulario
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error de conexión al servidor. Estado: ' + response.status);
            }
            return response.text();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);
            window.location.href = './principal.html';
        })
        .catch(error => {
            console.log('Error:', error.message);
        });
    });

    function validarCampo(valor, expresion, idValidacion) {
        const validacionElemento = document.getElementById(idValidacion);
        if (valor && expresion.test(valor)) {
            validacionElemento.innerHTML = '✓';
        } else {
            validacionElemento.innerHTML = '';
        }
    }

    function validarNombreUsuario() {
        const valor = usuario.value.trim();
        validarCampo(valor, /^([^\s_].*[^\s_])?$/, 'usuarioValidacion');
    }

    function validarNombre() {
        const valor = nombre.value.trim();
        validarCampo(valor, /^.+$/, 'nombreValidacion');
    }

    function validarCorreo() {
        const valor = correo.value.trim();
        validarCampo(valor, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'correoValidacion');
    }

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

        mediaQuery.addEventListener('change', aplicarEstilos);
    }

    function validarRepetirContraseña() {
        const valor1 = contraseña.value;
        const valor2 = repetircontraseña.value;

        if (valor1 === valor2 && valor1 !== '') {
            mostrarCoincidenciaContraseña(true);
        } else {
            mostrarCoincidenciaContraseña(false);
        }
    }

    function mostrarCoincidenciaContraseña(coinciden) {
        const validacionElemento = document.getElementById('repetirContraseñaValidacion');
        validacionElemento.innerHTML = coinciden ? '✓' : '';
    }

    function validarTelefono() {
        const valor = telefono.value.trim();
        validarCampo(valor, /^\d{9}$/, 'telefonoValidacion');
    }

    function realizarSolicitudProtegida() {
        const token = localStorage.getItem('token');

        if (token) {
            fetch('../PHP/usuarios.php', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud protegida. Estado: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Respuesta de la solicitud protegida:', data);
            })
            .catch(error => {
                console.error('Error en la solicitud protegida:', error.message);
            });
        } else {
            console.error('Token no disponible. El usuario no está autenticado.');
        }
    }

    


    usuario.addEventListener('input', validarNombreUsuario);
    nombre.addEventListener('input', validarNombre);
    correo.addEventListener('input', validarCorreo);
    contraseña.addEventListener('input', validarContraseña);
    repetircontraseña.addEventListener('input', validarRepetirContraseña);
    telefono.addEventListener('input', validarTelefono);
    
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
                document.cookie = `token=${data.token}; expires=${new Date(data.expires)}`;

                console.log('Token almacenado en cookie:', document.cookie);

                window.location.href = '../principal.html';
            } else {
                console.error('Error al registrar usuario:', data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
    });



    validarNombreUsuario();
    validarNombre();
    validarCorreo();
    validarContraseña();
    validarRepetirContraseña();
    validarTelefono();

    realizarSolicitudProtegida();
});
