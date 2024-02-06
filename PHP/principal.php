<?php
require_once 'conexion.php';

header('Content-Type: application/json');

class Carrera {
    public $nombre;
    public $localizacion;
    public $fecha;
    public $distancia;

    public function __construct($nombre, $localizacion, $fecha, $distancia) {
        $this->nombre = $nombre;
        $this->localizacion = $localizacion;
        $this->fecha = $fecha;
        $this->distancia = $distancia;
    }
}

function obtenerCarreras() {
    $con = new Conexion();

    $query = "SELECT nombre, localizacion, fecha, distancia FROM carreras";
    $resultado = $con->query($query);

    $carreras = array();

    while ($fila = $resultado->fetch_assoc()) {
        $carrera = new Carrera(

            $fila['nombre'],
            $fila['localizacion'],
            $fila['fecha'],
            $fila['distancia']
        );
        $carreras[] = $carrera;
    }

    return $carreras;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $carreras = obtenerCarreras();
    echo json_encode($carreras);
}
?>
