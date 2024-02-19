<?php
require_once 'conexion.php';

// Establecer encabezado JSON
header('Content-Type: application/json');

// Obtener token del GET
$token = isset($_GET['miToken']) ? $_GET['miToken'] : null;

// Verificar que se proporcionó un token
if (!$token) {
    echo json_encode(array('error' => 'Token no proporcionado'));
    exit;
}

// Decodificar el token para obtener el ID de usuario
$tokenDecodificado = decodificarJWT($token);
if (!$tokenDecodificado) {
    echo json_encode(array('error' => 'Token inválido'));
    exit;
}
$idUsuario = $tokenDecodificado['id'];

// Obtener la nueva contraseña del cuerpo de la solicitud JSON
$datos = json_decode(file_get_contents('php://input'), true);
$passwordNew = isset($datos['passwordNew']) ? $datos['passwordNew'] : null;

// Verificar que se proporcionó la nueva contraseña
if (!$passwordNew) {
    echo json_encode(array('error' => 'Datos incompletos'));
    exit;
}

// Hash de la nueva contraseña
$hashPasswordNew = password_hash($passwordNew, PASSWORD_DEFAULT);

// Actualizar la contraseña en la base de datos
if (!actualizarContraseña($idUsuario, $hashPasswordNew)) {
    echo json_encode(array('error' => 'Error al actualizar la contraseña'));
    exit;
}

echo json_encode(array('success' => true));

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

// Función para actualizar la contraseña en la base de datos
function actualizarContraseña($idUsuario, $nuevaContraseña) {
    $con = new Conexion();

    $query = "UPDATE usuarios SET password = ? WHERE id = ?";
    $stmt = $con->prepare($query);
    $stmt->bind_param("si", $nuevaContraseña, $idUsuario);
    $resultado = $stmt->execute();

    return $resultado;
}
?>
