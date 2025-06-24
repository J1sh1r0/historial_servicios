<?php
require_once 'conexion.php';

header('Content-Type: application/json');

$habitacion = $_GET['habitacion'] ?? '';

if (!$habitacion) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT nombre_cliente, fecha_servicio, nombre_archivo FROM historial WHERE numero_habitacion = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $habitacion);
$stmt->execute();
$result = $stmt->get_result();

$reportes = [];

while ($row = $result->fetch_assoc()) {
    $reportes[] = $row;
}

echo json_encode($reportes);
?>
