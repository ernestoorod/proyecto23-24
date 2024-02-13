<?php
require_once 'conexion.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Obtener el token JWT del parámetro de la URL
    $token = isset($_GET['miToken']) ? $_GET['miToken'] : null;

    if ($token) {
        // Decodificar el token JWT para obtener el ID del usuario
        $tokenDecodificado = decodificarJWT($token);

        if ($tokenDecodificado) {
            $idUsuario = $tokenDecodificado['id'];

            // Obtener los datos del usuario por su ID
            $usuario = obtenerUsuarioPorId($idUsuario);

            // Devolver los datos del usuario como respuesta JSON
            echo json_encode($usuario);
        } else {
            // Si el token no se puede decodificar, devolver un mensaje de error
            echo json_encode(array('error' => 'Token inválido'));
        }
    } else {
        // Si no se proporciona un token, devolver un mensaje de error
        echo json_encode(array('error' => 'Token no proporcionado'));
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener el token JWT del parámetro de la URL
    $token = isset($_GET['miToken']) ? $_GET['miToken'] : null;

    if ($token) {
        // Decodificar el token JWT para obtener el ID del usuario
        $tokenDecodificado = decodificarJWT($token);

        if ($tokenDecodificado) {
            $idUsuario = $tokenDecodificado['id'];

            // Obtener los datos del usuario desde la solicitud POST
            $nuevosDatos = json_decode(file_get_contents('php://input'), true);

            // Actualizar los datos del usuario en la base de datos
            $resultado = actualizarUsuario($idUsuario, $nuevosDatos);

            // Devolver el resultado como respuesta JSON
            echo json_encode($resultado);
        } else {
            // Si el token no se puede decodificar, devolver un mensaje de error
            echo json_encode(array('error' => 'Token inválido'));
        }
    } else {
        // Si no se proporciona un token, devolver un mensaje de error
        echo json_encode(array('error' => 'Token no proporcionado'));
    }
}

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

// Función para obtener los datos del usuario por su ID
function obtenerUsuarioPorId($idUsuario) {
    $con = new Conexion();

    // Preparar la consulta SQL para obtener los datos del usuario por su ID
    $query = "SELECT * FROM usuarios WHERE id = ?";
    $stmt = $con->prepare($query);
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 1) {
        // Si se encuentra el usuario, devolver sus datos
        return $resultado->fetch_assoc();
    } else {
        // Si el usuario no se encuentra, devolver un mensaje de error
        return array('error' => 'Usuario no encontrado');
    }
}

// Función para actualizar los datos de un usuario
function actualizarUsuario($idUsuario, $nuevosDatos) {
    $con = new Conexion();

    // Preparar la consulta SQL para actualizar los datos del usuario
    $query = "UPDATE usuarios SET username = ?, nombre = ?, correo = ?, telefono = ?, localidad = ?, club = ? WHERE id = ?";
    $stmt = $con->prepare($query);
    $stmt->bind_param("ssssssi", $nuevosDatos['username'], $nuevosDatos['nombre'], $nuevosDatos['correo'], $nuevosDatos['telefono'], $nuevosDatos['localidad'], $nuevosDatos['club'], $idUsuario);
    $resultado = $stmt->execute();

    if ($resultado) {
        // Si la actualización fue exitosa, devolver un mensaje de éxito
        return array('success' => true);
    } else {
        // Si la actualización falló, devolver un mensaje de error
        return array('error' => 'Error al actualizar los datos del usuario');
    }
}
?>
