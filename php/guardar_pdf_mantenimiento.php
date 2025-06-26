<?php
require_once '../includes/conexion.php';

$rutaCarpeta = '../Historial Habitaciones/';
if (!is_dir($rutaCarpeta)) {
    mkdir($rutaCarpeta, 0777, true);
}

if (isset($_FILES['pdf']) && $_FILES['pdf']['error'] === UPLOAD_ERR_OK) {
    $nombreArchivo = basename($_FILES['pdf']['name']);
    $rutaDestino = $rutaCarpeta . $nombreArchivo;

    if (move_uploaded_file($_FILES['pdf']['tmp_name'], $rutaDestino)) {
        $numeroHabitacion = $_POST['numero_habitacion'] ?? '';
        $nombreCliente = $_POST['nombre_cliente'] ?? '';
        $fechaServicio = $_POST['fecha_servicio'] ?? '';
        $nombreArchivo = $_POST['nombre_archivo'] ?? '';
        $rutaPDF = 'Historial Habitaciones/' . $nombreArchivo;

        $stmt = $conn->prepare("INSERT INTO historial (numero_habitacion, nombre_cliente, fecha_servicio, archivo_pdf, nombre_archivo)
                                VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $numeroHabitacion, $nombreCliente, $fechaServicio, $rutaPDF, $nombreArchivo);

        if ($stmt->execute()) {
            echo "✅ Registro guardado correctamente.";
        } else {
            echo "❌ Error al guardar en la base de datos: " . $stmt->error;
        }

        $stmt->close();
        $conn->close();
    } else {
        echo "❌ Error al mover el archivo al servidor.";
    }
} else {
    echo "❌ No se recibió el archivo PDF.";
}
