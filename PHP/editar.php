<?php
require_once 'conexion.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $token = isset($_GET['miToken']) ? $_GET['miToken'] : null;

    if ($token) {
        $tokenDecodificado = decodificarJWT($token);

        if ($tokenDecodificado) {
            $idUsuario = $tokenDecodificado['id'];

            $usuario = obtenerUsuarioPorId($idUsuario);

            echo json_encode($usuario);
        } else {
            echo json_encode(array('error' => 'Token inválido'));
        }
    } else {
        echo json_encode(array('error' => 'Token no proporcionado'));
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = isset($_GET['miToken']) ? $_GET['miToken'] : null;

    if ($token) {
        $tokenDecodificado = decodificarJWT($token);

        if ($tokenDecodificado) {
            $idUsuario = $tokenDecodificado['id'];

            $nuevosDatos = json_decode(file_get_contents('php://input'), true);

            $resultado = actualizarUsuario($idUsuario, $nuevosDatos);

            echo json_encode($resultado);
        } else {
            echo json_encode(array('error' => 'Token inválido'));
        }
    } else {
        echo json_encode(array('error' => 'Token no proporcionado'));
    }
}

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
        return array('error' => 'Usuario no encontrado');
    }
}

function actualizarUsuario($idUsuario, $nuevosDatos) {
    $con = new Conexion();

    $query = "UPDATE usuarios SET username = ?, nombre = ?, correo = ?, telefono = ?, localidad = ?, club = ? WHERE id = ?";
    $stmt = $con->prepare($query);
    $stmt->bind_param("ssssssi", $nuevosDatos['username'], $nuevosDatos['nombre'], $nuevosDatos['correo'], $nuevosDatos['telefono'], $nuevosDatos['localidad'], $nuevosDatos['club'], $idUsuario);
    $resultado = $stmt->execute();

    if ($resultado) {
        return array('success' => true);
    } else {
        return array('error' => 'Error al actualizar los datos del usuario');
    }
}
?>
