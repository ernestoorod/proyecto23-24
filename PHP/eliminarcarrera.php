<?php
require_once 'conexion.php';

header('Content-Type: application/json');

function eliminarCarrera($nombreCarrera) {
    $con = new Conexion();

    // Desactivar temporalmente la restricción de clave externa
    $query1 = "SET FOREIGN_KEY_CHECKS=0";
    $stmt1 = $con->prepare($query1);
    $stmt1->execute();

    // Eliminar la carrera
    $query2 = "DELETE FROM carreras WHERE nombre = ?";
    $stmt2 = $con->prepare($query2);
    $stmt2->bind_param("s", $nombreCarrera);
    $resultadoCarrera = $stmt2->execute();

    // Volver a activar la restricción de clave externa
    $query3 = "SET FOREIGN_KEY_CHECKS=1";
    $stmt3 = $con->prepare($query3);
    $stmt3->execute();

    // Eliminar las imágenes asociadas a la carrera
    $resultadoImagen = eliminarImagen($nombreCarrera);

    if ($resultadoCarrera && $resultadoImagen['success']) {
        return array('success' => true);
    } else {
        return array('error' => 'Error al eliminar la carrera o sus archivos de imagen');
    }
}

function eliminarGPX($nombreCarrera) {
    $con = new Conexion();
    $query = "DELETE FROM gpx_archivos WHERE nombre_carrera = ?";
    $stmt = $con->prepare($query);
    $stmt->bind_param("s", $nombreCarrera);
    $resultado = $stmt->execute();

    if ($resultado) {
        return array('success' => true);
    } else {
        return array('error' => 'Error al eliminar la entrada de archivo GPX');
    }
}

function eliminarImagen($nombreCarrera) {
    $con = new Conexion();
    $query = "DELETE FROM imagen_archivos WHERE nombre_carrera = ?";
    $stmt = $con->prepare($query);
    $stmt->bind_param("s", $nombreCarrera);
    $resultado = $stmt->execute();

    if ($resultado) {
        return array('success' => true);
    } else {
        return array('error' => 'Error al eliminar la entrada de archivo de imagen');
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if(isset($_GET['ID'])) {
        $ID = $_GET['ID'];

        // Obtener el nombre de la carrera para eliminar los archivos asociados
        $query = "SELECT nombre FROM carreras WHERE ID=?";
        $stmt = $con->prepare($query);
        $stmt->bind_param("i", $ID);
        $stmt->execute();
        $stmt->bind_result($nombreCarrera);
        $stmt->fetch();
        $stmt->close();

        $resultadoCarrera = eliminarCarrera($nombreCarrera);

        if ($resultadoCarrera['success']) {
            echo json_encode(array('success' => true));
        } else {
            echo json_encode(array('error' => 'Error al eliminar la carrera'));
        }
    } else {
        echo json_encode(array('error' => 'El ID de la carrera no se proporcionó'));
    }
}
?>
