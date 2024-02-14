<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'conexion.php';

// Función para decodificar el token JWT
function decodificarJWT($token) {
    $partes = explode('.', $token);
    if (count($partes) === 3) {
        $payloadBase64 = $partes[1];
        $payload = base64_decode($payloadBase64);
        return json_decode($payload, true);
    } else {
        return null;
    }
}

// Función para obtener usuario por ID
function obtenerUsuarioPorId($idUsuario) {
    $con = new Conexion();

    $query = "SELECT * FROM usuarios WHERE id = ?";
    $stmt = $con->prepare($query);
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 1) {
        return $resultado->fetch_assoc();
    } else {
        return null;
    }
}

// Manejar la solicitud GET para obtener datos de usuario
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $token = isset($_GET['miToken']) ? $_GET['miToken'] : null;

    if ($token) {
        $tokenDecodificado = decodificarJWT($token);

        if ($tokenDecodificado) {
            $idUsuario = $tokenDecodificado['id'];

            $usuario = obtenerUsuarioPorId($idUsuario);

            if ($usuario) {
                echo json_encode($usuario);
            } else {
                echo json_encode(array('error' => 'Usuario no encontrado'));
            }
        } else {
            echo json_encode(array('error' => 'Token inválido'));
        }
    } else {
        echo json_encode(array('error' => 'Token no proporcionado'));
    }
}
?>
