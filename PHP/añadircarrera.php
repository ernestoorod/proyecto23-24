<?php
require_once 'conexion.php';

$con = new Conexion();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $json_data = file_get_contents("php://input");

    $data = json_decode($json_data, true);

    if (
        isset($data['IDusuario']) &&
        isset($data['nombre']) &&
        isset($data['localizacion']) &&
        isset($data['distancia']) &&
        isset($data['fecha']) &&
        isset($data['desnivel'])
    ) {
        $IDusuario = $data['IDusuario'];
        $nombre = $data['nombre'];
        $localizacion = $data['localizacion'];
        $distancia = $data['distancia'];
        $fecha = $data['fecha'];
        $desnivel = $data['desnivel'];
    } else {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(['success' => false, 'error' => 'Faltan parámetros']);
        exit;
    }

    $sql = "INSERT INTO carreras (IDusuario, nombre, localizacion, distancia, fecha, desnivel) 
            VALUES ('$IDusuario', '$nombre', '$localizacion', '$distancia', '$fecha', '$desnivel')";

    try {
        $con->query($sql);
        $carreraId = $con->insert_id;

        echo json_encode(['success' => true, 'carreraId' => $carreraId]);
        exit;
    } catch (mysqli_sql_exception $e) {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(['success' => false, 'error' => 'Error al crear carrera']);
        exit;
    }
} else {
    header("HTTP/1.1 400 Bad Request");
    echo json_encode(['success' => false, 'error' => 'Método de solicitud no válido.']);
    exit;
}
?>
