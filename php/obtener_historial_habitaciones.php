<?php
require_once '../includes/conexion.php';

$habitacion = $_GET['habitacion'] ?? '';
if (empty($habitacion)) {
    echo json_encode([]);
    exit;
}

$stmt = $conn->prepare("SELECT id, fecha_servicio, nombre_personal, ruta_pdf FROM historial_habitaciones WHERE numero_habitacion = ?");
$stmt->bind_param("s", $habitacion);
$stmt->execute();

$resultado = $stmt->get_result();
$datos = [];

while ($fila = $resultado->fetch_assoc()) {
    $datos[] = $fila;
}

echo json_encode($datos);

$stmt->close();
$conn->close();
