document.addEventListener('DOMContentLoaded', function () {
    let form = document.getElementById('loginForm');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        try {
            let formData = new FormData(form);

            let response = await fetch('../PHP/iniciosesion.php', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error de conexión al servidor. Estado: ' + response.status);
            }

            let rawData = await response.json();

            console.log('Respuesta del servidor:', rawData);

            if (rawData.success && rawData.token) {
                localStorage.setItem('miToken', rawData.token);

                window.location.href = rawData.redirect;
            } else {
                console.error('Error:', rawData.error);
            }

        } catch (error) {
            console.error('Error:', error.message);
        }
    });
});
