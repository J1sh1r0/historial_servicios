<?php
$host = "localhost";
$usuario = "root";
$clave = "miclave123";
$bd = "Sistema_De_Control";
$puerto = 3307;

$conn = new mysqli($host, $usuario, $clave, $bd, $puerto);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
?>
