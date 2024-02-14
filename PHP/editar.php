<?php
require_once 'conexion.php';

// Establecer encabezado JSON
header('Content-Type: application/json');

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

// Manejar la solicitud POST para actualizar datos de usuario
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = isset($_GET['miToken']) ? $_GET['miToken'] : null;

    if ($token) {
        $tokenDecodificado = decodificarJWT($token);

        if ($tokenDecodificado) {
            $idUsuario = $tokenDecodificado['id'];

            // Obtener los nuevos datos del cuerpo de la solicitud
            $nuevosDatos = json_decode(file_get_contents('php://input'), true);

            if ($nuevosDatos) {
                $resultado = actualizarUsuario($idUsuario, $nuevosDatos);

                if ($resultado['success']) {
                    echo json_encode(array('success' => true));
                } else {
                    echo json_encode(array('error' => 'Error al actualizar los datos del usuario'));
                }
            } else {
                echo json_encode(array('error' => 'Datos no proporcionados'));
            }
        } else {
            echo json_encode(array('error' => 'Token inválido'));
        }
    } else {
        echo json_encode(array('error' => 'Token no proporcionado'));
    }
}

// Manejar la solicitud DELETE para eliminar cuenta de usuario
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $token = isset($_GET['miToken']) ? $_GET['miToken'] : null;

    if ($token) {
        $tokenDecodificado = decodificarJWT($token);

        if ($tokenDecodificado) {
            $idUsuario = $tokenDecodificado['id'];

            // Eliminar todas las carreras relacionadas a este usuario
            $carrerasEliminadas = eliminarCarrerasPorUsuario($idUsuario);

            if ($carrerasEliminadas['success']) {
                // Si se eliminaron todas las carreras, proceder a eliminar el usuario
                $usuarioEliminado = eliminarUsuario($idUsuario);

                if ($usuarioEliminado['success']) {
                    echo json_encode(array('success' => true));
                } else {
                    echo json_encode(array('error' => 'Error al eliminar la cuenta de usuario'));
                }
            } else {
                echo json_encode(array('error' => 'Error al eliminar las carreras relacionadas'));
            }
        } else {
            echo json_encode(array('error' => 'Token inválido'));
        }
    } else {
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

// Función para actualizar usuario
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

// Función para eliminar todas las carreras relacionadas a un usuario
function eliminarCarrerasPorUsuario($idUsuario) {
    $con = new Conexion();

    $query = "DELETE FROM carreras WHERE idUsuario = ?";
    $stmt = $con->prepare($query);
    $stmt->bind_param("i", $idUsuario);
    $resultado = $stmt->execute();

    if ($resultado) {
        return array('success' => true);
    } else {
        return array('error' => 'Error al eliminar las carreras relacionadas');
    }
}

// Función para eliminar usuario
function eliminarUsuario($idUsuario) {
    $con = new Conexion();

    $query = "DELETE FROM usuarios WHERE id = ?";
    $stmt = $con->prepare($query);
    $stmt->bind_param("i", $idUsuario);
    $resultado = $stmt->execute();

    if ($resultado) {
        return array('success' => true);
    } else {
        return array('error' => 'Error al eliminar la cuenta de usuario');
    }
}
?>