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
            echo "Error: {$e->getMessage()}";
            exit;
        }
    }
}

// $conexion = new Conexion();

// if ($conexion->connect_error) {
//     die("Error de conexión: " . $conexion->connect_error);
// } else {
//     echo "Conexión exitosa";
// }

?>
