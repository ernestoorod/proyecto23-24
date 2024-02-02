<?php
require_once 'conexion.php';

class Usuario {
    public static function getUserData($userId) {
        $con = new Conexion();

        $stmt = $con->prepare("SELECT * FROM usuarios WHERE id=?");
        $stmt->bind_param("s", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
    $userData = $result->fetch_assoc();
    echo json_encode(['success' => true, 'userData' => $userData]);
} else {
    echo json_encode(['success' => false, 'error' => 'Usuario no encontrado.']);
}
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    session_start();

    if (isset($_SESSION['user_id'])) {
        $userId = $_SESSION['user_id'];

        Usuario::getUserData($userId);
    } else {
        echo json_encode(['success' => false, 'error' => 'ID de usuario no encontrada en la sesión.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Método de solicitud no válido.']);
}
    
?>

