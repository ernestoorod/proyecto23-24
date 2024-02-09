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

function obtenerCarrerasPorUsuario($userId) {
    $con = new Conexion();

    $query = "SELECT nombre, localizacion, fecha, distancia FROM carreras WHERE IDusuario = ?";
    $stmt = $con->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $resultado = $stmt->get_result();

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
    if(isset($_GET['userId'])) {
        $userId = $_GET['userId'];
        $carreras = obtenerCarrerasPorUsuario($userId);
        echo json_encode($carreras);
    } else {
        echo json_encode(array('error' => 'El ID del usuario no se proporcionó'));
    }
}
?>
