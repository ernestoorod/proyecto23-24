<?php
require_once 'conexion.php';
require_once '../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class TokenGenerator{
    public static function generateToken($userId, $username){

        $secretKey = base64_encode('ERRrodriguez2002');

        $expirationTime = time() + 86400;

        $tokenPayload = [
            "id" => $userId,
            "username" => $username,
            "exp" => $expirationTime
        ];

        $token = JWT::encode($tokenPayload, $secretKey, 'HS256');

        return $token;
    }
}

$con = new Conexion();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $requiredFields = ['username', 'nombre', 'correo', 'password', 'password2', 'localidad'];
    $missingFields = [];

    if ($_POST['password'] != $_POST['password2']) {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(['success' => false, 'error' => 'Las contraseñas son diferentes']);
        exit;
    }

    foreach ($requiredFields as $field) {
        if (!isset($_POST[$field]) || empty($_POST[$field])) {
            if ($field !== 'telefono' && $field !== 'club') {
                $missingFields[] = $field;
            }
        }
    }

    if (!empty($missingFields)) {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(['success' => false, 'error' => 'Faltan los siguientes campos obligatorios: ' . implode(', ', $missingFields)]);
        exit;
    }

    $username = $_POST['username'];
    $nombre = $_POST['nombre'];
    $correo = $_POST['correo'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $localidad = $_POST['localidad'];
    $telefono = isset($_POST['telefono']) ? $_POST['telefono'] : '';
    $club = isset($_POST['club']) ? $_POST['club'] : '';

    $sql = "INSERT INTO usuarios (username, nombre, correo, password, localidad, telefono, club) VALUES ('$username', '$nombre', '$correo', '$password', '$localidad', '$telefono', '$club')";

    try {
        $con->query($sql);

        $userId = $con->insert_id;

        $token = TokenGenerator::generateToken($userId, $username);

        echo json_encode(['success' => true, 'token' => $token]);
        exit;
    } catch (mysqli_sql_exception $e) {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(['success' => false, 'error' => 'Error al registrar usuario']);
        exit;
    }
} else {
    header("HTTP/1.1 400 Bad Request");
    echo json_encode(['success' => false, 'error' => 'Método de solicitud no válido.']);
    exit;
}
?>
