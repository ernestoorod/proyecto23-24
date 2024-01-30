document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        try {
            const formData = new FormData(form);

            const response = await fetch('./PHP/iniciosesion.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error de conexión al servidor. Estado: ' + response.status);
            }

            const rawData = await response.text();

            console.log('Respuesta del servidor:', rawData);

            const trimmedData = rawData.trim();

            let jsonData;
            try {
                jsonData = JSON.parse(trimmedData);
            } catch (jsonError) {
                console.error('Error al analizar JSON:', jsonError.message);
                return;
            }

            if (jsonData.success) {
                window.location.href = jsonData.redirect;
            } else {
                console.error('Error:', jsonData.error);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    });
});
