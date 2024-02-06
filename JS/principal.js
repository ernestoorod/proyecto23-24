document.addEventListener("DOMContentLoaded", function () {
  // Obtener el token de localStorage
  let token = localStorage.getItem("miToken");
  let btnPerfil = document.getElementById("fotoperfil");
  let logoutButton = document.getElementById("logout");
  let ordenarNombreBtn = document.getElementById("ordenar-nombre");
  let ordenarDistanciaBtn = document.getElementById("ordenar-distancia");
  let ordenarFechaBtn = document.getElementById("ordenar-fecha");
  let ordenNombreAscendente = true;
  let ordenDistanciaAscendente = true;
  let ordenFechaAscendente = true;

  // Obtener datos desde principal.php
  fetch("./PHP/principal.php", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",  
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      mostrarCarreras(data);
    })
    .catch((error) => {
      console.error("Error al cargar datos desde la API:", error);
    });

    let mostrarCarreras = (carreras) => {
      if (!carreras || carreras.length === 0) {
        console.error("No se recibieron datos de carreras desde la API");
        return;
      }
    
      let carrerasContainer = document.querySelector(".carreras-container");
      carreras.forEach((carrera) => {
        let carreraDiv = document.createElement("div");
        carreraDiv.classList.add("carrera");
        carreraDiv.innerHTML = `
            <img src="${carrera.imagen}">
            <hr>
            <p>${carrera.nombre}</p>
            <p>
              <i class="fa-solid fa-location-dot"></i>
              <span class="carrera-localizacion">${carrera.localizacion}</span>
              
              &nbsp;
              
              <i class="fa-solid fa-calendar"></i>
              <span class="carrera-fecha">${carrera.fecha}</span>
              
              &nbsp;
              
              <i class="fa-solid fa-person-running"></i>
              <span class="carrera-distancia">${carrera.distancia}km</span>
            </p>
        `;
        carreraDiv.addEventListener("click", () => {
          window.location.href = `carrera.html?carrera=${encodeURIComponent(carrera.nombre)}`;
        });
        carrerasContainer.appendChild(carreraDiv);
      });
    };
    
  // Obtener datos desde ccaa.json
  fetch("./ccaa.json")
    .then((response) => response.json())
    .then((data) => {
      let datalist = document.getElementById("comunidades");

      data.forEach((comunidades) => {
        let option = document.createElement("option");
        option.value = comunidades.label;
        datalist.appendChild(option);
      });
    })
    .catch((error) =>
      console.error("Error al cargar las comunidades autonomas:", error)
    );

  // Verificar si el token existe y no ha expirado
  if (token !== null && !TokenExpirado(token)) {
    btnPerfil.addEventListener("click", () => {
      window.location.href = "./perfil.html";
    });
  } else {
    console.log("No se ha generado el token o ha expirado");
  }

  // Función para verificar si el token ha expirado
  function TokenExpirado(token) {
    let tiempoExpiracion = obtenerTiempoExpiracionDesdeToken(token);
    let tiempoActual = new Date().getTime() / 1000;

    return tiempoExpiracion < tiempoActual;
  }

  // Función para obtener el tiempo de expiración desde el token
  function obtenerTiempoExpiracionDesdeToken(token) {
    let tokenDecodificado = decodificarJWT(token);
    return tokenDecodificado.exp;
  }

  // Función para decodificar el token JWT
  function decodificarJWT(token) {
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    let cargaPayloadJson = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(cargaPayloadJson);
  }

  // Evento para el botón de logout
  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      localStorage.removeItem("miToken");
      window.location.href = "./index.html";
    });
  }

  // Mostrar elementos basados en la existencia del token
  if (token) {
    document.getElementById("fotoperfil").style.display = "block";
    document.getElementById("logout").style.display = "block";
    document.getElementById("login-container").style.display = "none";
    document.getElementById("registro-container").style.display = "none";
  } else {
    document.getElementById("fotoperfil").style.display = "none";
    document.getElementById("logout").style.display = "none";
    document.getElementById("login-container").style.display = "block";
    document.getElementById("registro-container").style.display = "block";
  }

  // Eliminar token si index.html está en la URL
  if (window.location.href.includes("index.html")) {
    localStorage.removeItem("miToken");
  }

  // Eventos para los botones de ordenar
  ordenarNombreBtn.addEventListener("click", function () {
    ordenarCarrerasPorNombre();
  });

  ordenarDistanciaBtn.addEventListener("click", function () {
    ordenarCarrerasPorDistancia();
  });

  ordenarFechaBtn.addEventListener("click", function () {
    ordenarCarrerasPorFecha();
  });

  // Función para ordenar las carreras por nombre
  function ordenarCarrerasPorNombre() {
    let carreras = Array.from(document.querySelectorAll(".carrera"));
    carreras.sort((a, b) => {
      let nombreA = a.querySelector("p:nth-child(3)").innerText.toLowerCase();
      let nombreB = b.querySelector("p:nth-child(3)").innerText.toLowerCase();
      if (ordenNombreAscendente) {
        return nombreA.localeCompare(nombreB);
      } else {
        return nombreB.localeCompare(nombreA);
      }
    });
    carreras.forEach((carrera) =>
      document.querySelector(".carreras-container").appendChild(carrera)
    );
    ordenNombreAscendente = !ordenNombreAscendente;
  }

  // Función para ordenar las carreras por distancia
  function ordenarCarrerasPorDistancia() {
    let carreras = Array.from(document.querySelectorAll(".carrera"));
    carreras.sort((a, b) => {
      let distanciaA = parseInt(
        a.querySelector(".carrera-distancia").innerText.replace(/\D/g, "")
      );
      let distanciaB = parseInt(
        b.querySelector(".carrera-distancia").innerText.replace(/\D/g, "")
      );
      if (ordenDistanciaAscendente) {
        return distanciaA - distanciaB;
      } else {
        return distanciaB - distanciaA;
      }
    });
    let carrerasContainer = document.querySelector(".carreras-container");
    carrerasContainer.innerHTML = "";
    carreras.forEach((carrera) => carrerasContainer.appendChild(carrera));
    ordenDistanciaAscendente = !ordenDistanciaAscendente;
  }

  // Función para ordenar las carreras por fecha
  function ordenarCarrerasPorFecha() {
    let carreras = Array.from(document.querySelectorAll(".carrera"));
    carreras.sort((a, b) => {
      let fechaA = parseFecha(a.querySelector(".carrera-fecha").innerText);
      let fechaB = parseFecha(b.querySelector(".carrera-fecha").innerText);
      if (ordenFechaAscendente) {
        return fechaA - fechaB;
      } else {
        return fechaB - fechaA;
      }
    });
    carreras.forEach((carrera) =>
      document.querySelector(".carreras-container").appendChild(carrera)
    );
    ordenFechaAscendente = !ordenFechaAscendente;
  }

  // Función para analizar la fecha
  function parseFecha(fechaString) {
    let partesFecha = fechaString.split("/");
    return new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
  }
});
