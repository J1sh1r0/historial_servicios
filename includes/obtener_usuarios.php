<?php
include '../includes/conexion.php';

header('Content-Type: application/json');

try {
    $query = "SELECT id, nombre_completo, correo, telefono, rol, creado_en FROM login";
    $result = $conn->query($query);

    $usuarios = [];

    while ($row = $result->fetch_assoc()) {
        $usuarios[] = $row;
    }

    echo json_encode($usuarios);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
