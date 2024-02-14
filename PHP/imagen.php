<?php
require_once 'conexion.php';

$con = new Conexion();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if ($_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
        $imageFileName  = $_FILES['imagen']['name'];
        $nombre_carrera = $_POST['nombre_carrera'];

        $uploadDirectory = '../IMAGENES_CARRERAS/';
        move_uploaded_file($_FILES['imagen']['tmp_name'], $uploadDirectory . $imageFileName );

        $sql = "INSERT INTO imagen_archivos (nombre_carrera, imageFileName)  
                VALUES ('$nombre_carrera', '$imageFileName')";

        try {
            $con->query($sql);
            echo json_encode(['success' => true, 'imageFileName' => $imageFileName]);
            exit;
        } catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(['success' => false, 'error' => 'Error al insertar la imagen: ' . $e->getMessage()]);
            exit;
        }
    } else {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(['success' => false, 'error' => 'No se ha proporcionado ninguna imagen.']);
        exit;
    }
} else {
    header("HTTP/1.1 400 Bad Request");
    echo json_encode(['success' => false, 'error' => 'Método de solicitud no válido.']);
    exit;
}
?>
