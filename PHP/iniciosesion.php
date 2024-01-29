<?php
require_once 'conexion.php';

$con = new Conexion();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['username']) && isset($_POST['password'])) {
        $username = $_POST['username'];
        $password = $_POST['password'];

        $stmt = $con->prepare("SELECT id, password FROM usuarios WHERE username=?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->bind_result($userId, $hashedPassword);
        $stmt->fetch();

        if (password_verify($password, $hashedPassword)) {
            session_start();
            $_SESSION['user_id'] = $userId;
            $_SESSION['username'] = $username;

            echo json_encode(['success' => true, 'redirect' => './principal.html']);
            exit;
        } else {
            echo json_encode(['success' => false, 'error' => 'Nombre de usuario o contraseña incorrectos.']);
            exit;
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Campos de nombre de usuario y contraseña requeridos.']);
        exit;
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Método de solicitud no válido.']);
    exit;
}
?>
