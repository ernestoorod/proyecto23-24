document.addEventListener("DOMContentLoaded", function () {
    // Simula la información del usuario (puedes obtenerla de tu sistema de autenticación)
    let userId = 123; // ID ficticio del usuario

    // Genera la URL del perfil del usuario con el ID
    let perfilURL = "./perfil.html?usuario=" + encodeURIComponent(userId);

    // Crea el enlace al perfil del usuario y lo agrega al documento
    let profileLink = document.createElement("a");
    profileLink.href = perfilURL;
    profileLink.innerHTML = '<div class="profile-link"><img src="ruta_a_tu_imagen.jpg" alt="Foto de perfil"></div>';

    // Agrega el enlace al final del body
    document.body.appendChild(profileLink);

    // Imprime el ID en la consola
    console.log("ID del usuario:", userId);
});
