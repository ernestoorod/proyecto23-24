<?php
require_once 'conexion.php';

$con = new Conexion();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $expected_params = array('IDusuario', 'nombre', 'localizacion', 'distancia', 'fecha', 'desnivel');
    $missing_params = array_diff($expected_params, array_keys($_POST));

    if (!empty($missing_params)) {
        header("HTTP/1.1 433 Bad Request");
        echo json_encode(['success' => false, 'error' => 'Faltan parámetros']);
        exit;
    }

    $IDusuario = $_POST['IDusuario'];
    $nombre = $_POST['nombre'];
    $localizacion = $_POST['localizacion'];
    $distancia = $_POST['distancia'];
    $fecha = $_POST['fecha'];
    $desnivel = $_POST['desnivel'];

    $sql = "INSERT INTO carreras (IDusuario, nombre, localizacion, distancia, fecha, desnivel) 
            VALUES ('$IDusuario', '$nombre', '$localizacion', '$distancia', '$fecha', '$desnivel')";

    try {
        $con->query($sql);
        $carreraId = $con->insert_id;

        echo json_encode(['success' => true, 'carreraId' => $carreraId]);
        exit;
    } catch (mysqli_sql_exception $e) {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(['success' => false, 'error' => 'Error al crear carrera: ' . $e->getMessage()]);
        exit;
    }
} else {
    header("HTTP/1.1 400 Bad Request");
    echo json_encode(['success' => false, 'error' => 'Método de solicitud no válido.']);
    exit;
}
?>