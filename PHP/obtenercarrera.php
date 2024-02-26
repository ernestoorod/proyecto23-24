<?php
require_once 'conexion.php';

header('Content-Type: application/json');

class Carrera {
    public $ID;
    public $nombre;
    public $localizacion;
    public $fecha;
    public $distancia;

    public function __construct($ID, $nombre, $localizacion, $fecha, $distancia) {
        $this->ID = $ID;
        $this->nombre = $nombre;
        $this->localizacion = $localizacion;
        $this->fecha = $fecha;
        $this->distancia = $distancia;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if(isset($_GET['ID'])) {
        $ID = $_GET['ID'];

        $con = new Conexion();

        $query = "SELECT nombre, localizacion, fecha, distancia FROM carreras WHERE ID = ?";
        $stmt = $con->prepare($query);
        $stmt->bind_param("i", $ID);
        $stmt->execute();
        $stmt->bind_result($nombre, $localizacion, $fecha, $distancia);
        $stmt->fetch();
        $stmt->close();

        $carrera = new Carrera($ID, $nombre, $localizacion, $fecha, $distancia);
        echo json_encode($carrera);
    } else {
        echo json_encode(array('error' => 'El ID de la carrera no se proporcionó'));
    }
}
?>
