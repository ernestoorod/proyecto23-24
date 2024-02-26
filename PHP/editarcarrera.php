<?php
require_once 'conexion.php';

header('Content-Type: application/json');

// Obtenemos los datos de la carrera del cuerpo de la solicitud
$carreraData = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($carreraData) {
        $ID = $carreraData->ID;
        $nombre = $carreraData->nombre;
        $localizacion = $carreraData->localizacion;
        $fecha = $carreraData->fecha;
        $distancia = $carreraData->distancia;

        $con = new Conexion();

        $query = "UPDATE carreras SET nombre=?, localizacion=?, fecha=?, distancia=? WHERE ID=?";
        $stmt = $con->prepare($query);
        $stmt->bind_param("sssdi", $nombre, $localizacion, $fecha, $distancia, $ID);

        if ($stmt->execute()) {
            echo json_encode(array('success' => true));
        } else {
            echo json_encode(array('error' => 'Error al actualizar la carrera'));
        }

        $stmt->close();
    } else {
        echo json_encode(array('error' => 'No se recibieron datos de la carrera'));
    }
}
?>
