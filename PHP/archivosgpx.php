<?php
require_once 'conexion.php';

$con = new Conexion();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['id_carrera'])) {
        $idCarrera = $_GET['id_carrera'];
        
        // Consulta SQL para seleccionar los datos de los archivos GPX asociados a la carrera específica
        $sql = "SELECT id, id_carrera, gpxFileName FROM gpx_archivos WHERE id_carrera = '$idCarrera'";
        
        try {
            $result = $con->query($sql);
            $gpxData = array();
            while ($row = $result->fetch_assoc()) {
                $gpxData[] = $row;
            }
            echo json_encode(['success' => true, 'gpxData' => $gpxData]);
            exit;
        } catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(['success' => false, 'error' => 'Error al obtener archivos GPX: ' . $e->getMessage()]);
            exit;
        }
    } else {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(['success' => false, 'error' => 'No se proporcionó el ID de la carrera.']);
        exit;
    }
} else {
    header("HTTP/1.1 400 Bad Request");
    echo json_encode(['success' => false, 'error' => 'Método de solicitud no válido.']);
    exit;
}
?>
