document.addEventListener('DOMContentLoaded', function () {
    let dialogo = document.getElementById('modal');
    let btnBorrarCuenta = document.getElementById('btn-borrar-cuenta');
    let btnCancelar = document.getElementById('btn-cancelar');
    let btnBorrar = document.getElementById('btn-borrar');

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

    let token = localStorage.getItem('miToken');

    if (token) {

        fetch('../PHP/editar.php', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            }
        })
        
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const userData = data.userData;
        
                // Actualiza los valores de los campos de entrada con la información del usuario
                document.getElementById('usuario').value = userData.username;
                document.getElementById('nombre').value = userData.nombre;
                document.getElementById('localidad').value = userData.localidad;
                document.getElementById('correo').value = userData.correo;
                document.getElementById('telefono').value = userData.telefono;
                document.getElementById('contraseña').value = userData.password;
                document.getElementById('club').value = userData.club || '';
            } else {
                console.error(data.error);
            }
        })
        .catch(error => console.error('Error al obtener los datos del usuario:', error));
        
    } else {
        console.error('Token no encontrado en el Local Storage');
    }
});
