<?php
require_once 'conexion.php';

$nombreArchivo = $_GET['archivo'] ?? '';

if (!$nombreArchivo) {
    echo "Archivo no especificado.";
    exit;
}

$sql = "SELECT archivo_pdf FROM historial WHERE nombre_archivo = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $nombreArchivo);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    header('Content-Type: application/pdf');
    header("Content-Disposition: inline; filename=\"$nombreArchivo\"");
    echo $row['archivo_pdf'];
} else {
    echo "Archivo no encontrado.";
}
?>
