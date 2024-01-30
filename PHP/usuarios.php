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
    if (
        isset($_POST['username']) &&
        isset($_POST['nombre']) &&
        isset($_POST['correo']) &&
        isset($_POST['password']) &&
        isset($_POST['localidad']) &&
        isset($_POST['telefono']) &&
        isset($_POST['club'])
    ) {
        $username = $_POST['username'];
        $nombre = $_POST['nombre'];
        $correo = $_POST['correo'];
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
        $localidad = $_POST['localidad'];
        $telefono = $_POST['telefono'];
        $club = $_POST['club'];
    }

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
