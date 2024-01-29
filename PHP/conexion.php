<?php
class Conexion extends mysqli {
    private $host = "localhost";
    private $db = "proyecto23-24";
    private $user = "proyecto23-24";
    private $pass = "proyecto23-24";

    public function __construct()
    {
        try {
            parent::__construct($this->host, $this->user, $this->pass, $this->db);
        } catch (mysqli_sql_exception $e) {
            echo json_encode(['success' => false, 'error' => 'Error de conexión: ' . $e->getMessage()]);
            exit;
        }
    }
}

// Crear una instancia de la conexión (puedes omitir la creación si no la usas directamente aquí)
//$conexion = new Conexion();
//
//if ($conexion->connect_error) {
//    echo json_encode(['success' => false, 'error' => 'Error de conexión: ' . $conexion->connect_error]);
//    exit;
//}
?>
