<?php
require_once 'conexion.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Obtener detalles de la carrera por nombre
    $nombreCarrera = isset($_GET['nombre']) ? $_GET['nombre'] : null;

    if ($nombreCarrera) {
        $carrera = obtenerCarreraPorNombre($nombreCarrera);
        echo json_encode($carrera);
    } else {
        echo json_encode(array('error' => 'Nombre de carrera no proporcionado'));
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Actualizar detalles de la carrera
    $nombreCarrera = isset($_GET['nombre']) ? $_GET['nombre'] : null;

    if ($nombreCarrera) {
        $nuevosDatos = json_decode(file_get_contents('php://input'), true);
        $resultado = actualizarCarrera($nombreCarrera, $nuevosDatos);
        echo json_encode($resultado);
    } else {
        echo json_encode(array('error' => 'Nombre de carrera no proporcionado'));
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Eliminar la carrera y su archivo GPX asociado
    $nombreCarrera = isset($_GET['nombre']) ? $_GET['nombre'] : null;

    if ($nombreCarrera) {
        $resultadoCarrera = eliminarCarrera($nombreCarrera);
        if ($resultadoCarrera['success']) {
            $resultadoGPX = eliminarGPX($nombreCarrera);
            if ($resultadoGPX['success']) {
                echo json_encode(array('success' => true));
            } else {
                echo json_encode(array('error' => 'Error al eliminar el archivo GPX'));
            }
        } else {
            echo json_encode(array('error' => 'Error al eliminar la carrera'));
        }
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

?>
