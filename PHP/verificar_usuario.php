<?php
require_once 'conexion.php';

$con = new Conexion();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['username'])) {
        $username = $_GET['username'];

        // Escapar caracteres especiales para prevenir inyección de SQL
        $username = mysqli_real_escape_string($con, $username);

        $sql = "SELECT COUNT(*) AS count FROM usuarios WHERE username = '$username'";

        try {
            $result = $con->query($sql);

            if ($result && $result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $count = $row['count'];
                echo json_encode(['available' => $count == 0]); // Devuelve true si el nombre de usuario está disponible, false si no lo está
                exit;
            } else {
                echo json_encode(['error' => 'Error al verificar el nombre de usuario']);
                exit;
            }
        } catch (mysqli_sql_exception $e) {
            echo json_encode(['error' => 'Error al verificar el nombre de usuario']);
            exit;
        }
    } else {
        echo json_encode(['error' => 'Parámetro "username" no proporcionado']);
        exit;
    }
} else {
    echo json_encode(['error' => 'Método de solicitud no válido']);
    exit;
}
?>
