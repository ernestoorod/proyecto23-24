document.addEventListener('DOMContentLoaded', function () {
    const token = getCookie('token');
    console.log('Token desde las cookies:', token);

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
            console.log('Respuesta de la solicitud protegida en la página principal:', data);
        })
        .catch(error => {
            console.error('Error en la solicitud protegida:', error.message);
        });
    } else {
        console.error('Token no disponible. El usuario no está autenticado.');
    }
});
