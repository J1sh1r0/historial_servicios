<?php
require_once 'conexion.php';

$nombreArchivo = $_GET['archivo'] ?? '';

if (!$nombreArchivo) {
    echo "Archivo no especificado.";
    exit;
}

// Buscar la ruta del archivo en la base de datos
$sql = "SELECT archivo_pdf FROM historial WHERE nombre_archivo = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $nombreArchivo);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $rutaCompleta = '../' . $row['archivo_pdf']; // Ruta relativa desde este archivo PHP

    if (file_exists($rutaCompleta)) {
        header('Content-Type: application/pdf');
        header("Content-Disposition: inline; filename=\"$nombreArchivo\"");
        readfile($rutaCompleta);
    } else {
        echo "Archivo no encontrado en el servidor.";
    }
} else {
    echo "Archivo no encontrado en la base de datos.";
}
?>
