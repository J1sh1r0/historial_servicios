<?php
$host = "localhost"; // Hostinger usa localhost
$usuario = "u767975160_SistemaControl";
$clave = "m4x40NmL$";
$bd = "u767975160_SistemaControl";

// Nota: no necesitas puerto en Hostinger, así que lo quitamos
$conn = new mysqli($host, $usuario, $clave, $bd);

if ($conn->connect_error) {
    die("❌ Error de conexión: " . $conn->connect_error);
}

// Asegura que el conjunto de caracteres sea UTF-8
$conn->set_charset("utf8");
?>
