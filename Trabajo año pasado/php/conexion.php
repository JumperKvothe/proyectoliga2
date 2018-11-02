<?php
$servername = "192.168.0.57";
$username = "ligaelite";
$password = "ligaelite";
$dbname = "formulario";

//Creamos conexión
$conexion = mysqli_connect($servername, $username, $password, $dbname);
if (!$conexion) {
    die("Connection failed: " . mysqli_connect_error());
}

//Utilizar utf8 antes de hacer consultas
$tildes = $conexion->query("SET NAMES 'utf8'");
?>