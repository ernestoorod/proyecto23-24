document.addEventListener("DOMContentLoaded", function () {
    let token = localStorage.getItem("miToken");
    let btnPerfil = document.getElementById("fotoperfil");
    let logoutButton = document.getElementById("logout");
  
    if (token !== null && !TokenExpirado(token)) {
      btnPerfil.addEventListener("click", () => {
        window.location.href = "./perfil.html";
      });
  
      console.log(decodificarJWT(token));
    } else {
      console.log("No se ha generado el token o ha expirado");
    }
  
    function TokenExpirado(token) {
      let tiempoExpiracion = obtenerTiempoExpiracionDesdeToken(token);
      let tiempoActual = new Date().getTime() / 1000;
  
      return tiempoExpiracion < tiempoActual;
    }
  
    function obtenerTiempoExpiracionDesdeToken(token) {
      let tokenDecodificado = decodificarJWT(token);
      return tokenDecodificado.exp;
    }
  
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
  
    if (logoutButton) {
      logoutButton.addEventListener("click", function () {
        localStorage.removeItem("miToken");
        window.location.href = "./index.html";
      });
    }
  
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
  
    if (window.location.href.includes("index.html")) {
      localStorage.removeItem("miToken");
    }
  });
  