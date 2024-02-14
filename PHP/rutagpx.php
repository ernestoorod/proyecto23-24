<?php
require_once 'conexion.php';

$con = new Conexion();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if ($_FILES['gpx']['error'] === UPLOAD_ERR_OK) {
        $gpxFileName = $_FILES['gpx']['name'];
        $nombre_carrera = $_POST['nombre_carrera']; // Cambio aquí para obtener el nombre de la carrera

        $uploadDirectory = '../GPX/';
        move_uploaded_file($_FILES['gpx']['tmp_name'], $uploadDirectory . $gpxFileName);

        $sql = "INSERT INTO gpx_archivos (nombre_carrera, gpxFileName) 
                VALUES ('$nombre_carrera', '$gpxFileName')"; // Cambio aquí para utilizar el nombre de la carrera en lugar del ID

        try {
            $con->query($sql);
            echo json_encode(['success' => true, 'gpxFileName' => $gpxFileName]);
            exit;
        } catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(['success' => false, 'error' => 'Error al insertar archivo GPX: ' . $e->getMessage()]);
            exit;
        }
    } else {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(['success' => false, 'error' => 'No se ha proporcionado ningún archivo GPX.']);
        exit;
    }
} else {
    header("HTTP/1.1 400 Bad Request");
    echo json_encode(['success' => false, 'error' => 'Método de solicitud no válido.']);
    exit;
}
?>
