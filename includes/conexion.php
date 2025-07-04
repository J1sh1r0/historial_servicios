<?php
$host = "localhost";
$usuario = "root";
$clave = "";
$bd = "Sistema_De_Control";
$puerto = 3306;

$conn = new mysqli($host, $usuario, $clave, $bd, $puerto);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
?>
