<?php
    require_once 'conexion.php';
    $con = new Conexion();
    
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        if (
            isset($_POST['username']) &&
            isset($_POST['nombre']) &&
            isset($_POST['correo']) &&
            isset($_POST['password']) &&
            isset($_POST['localidad']) &&
            isset($_POST['telefono']) &&
            isset($_POST['club'])
        ) {
            $username = $_POST['username'];
            $nombre = $_POST['nombre'];
            $correo = $_POST['correo'];
            $password = $_POST['password'];
            $localidad = $_POST['localidad'];
            $telefono = $_POST['telefono'];
            $club = $_POST['club'];
        }
        
        $sql = "INSERT INTO usuarios (username, nombre, correo, password, localidad, telefono, club) VALUES ('$username', '$nombre', '$correo', '$password', '$localidad', '$telefono', '$club')";
    
        try {
            $con->query($sql);
            header("HTTP/1.1 201 Created");
            echo json_encode($con->insert_id);
        } catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 400 Bad Request");
        }
    }else{
        header("HTTP/1.1 400 Bad Request");
    }
    exit;
?>