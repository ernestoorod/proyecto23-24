<?php
require_once 'conexion.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $nombreCarrera = isset($_GET['nombre']) ? $_GET['nombre'] : null;

    if ($nombreCarrera) {
        $carrera = obtenerCarreraPorNombre($nombreCarrera);
        echo json_encode($carrera);
    } else {
        echo json_encode(array('error' => 'Nombre de carrera no proporcionado'));
    }
}

function obtenerCarreraPorNombre($nombreCarrera) {
    $con = new Conexion();
    $query = "SELECT * FROM carreras WHERE nombre = ?";
    $stmt = $con->prepare($query);
    $stmt->bind_param("s", $nombreCarrera);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 1) {
        return $resultado->fetch_assoc();
    } else {
        return array('error' => 'Carrera no encontrada');
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombreCarrera = isset($_GET['nombre']) ? $_GET['nombre'] : null;

    if ($nombreCarrera) {
        $nuevosDatos = json_decode(file_get_contents('php://input'), true);
        $resultado = actualizarCarrera($nombreCarrera, $nuevosDatos);
        echo json_encode($resultado);
    } else {
        echo json_encode(array('error' => 'Nombre de carrera no proporcionado'));
    }
}

function actualizarCarrera($nombreCarrera, $nuevosDatos) {
    $con = new Conexion();
    $query = "UPDATE carreras SET localizacion = ?, fecha = ?, distancia = ?, desnivel = ? WHERE nombre = ?";
    $stmt = $con->prepare($query);
    $stmt->bind_param("sssss", $nuevosDatos['localizacion'], $nuevosDatos['fecha'], $nuevosDatos['distancia'], $nuevosDatos['desnivel'], $nombreCarrera);
    $resultado = $stmt->execute();

    if ($resultado) {
        return array('success' => true);
    } else {
        return array('error' => 'Error al actualizar los datos de la carrera');
    }
}
?>
