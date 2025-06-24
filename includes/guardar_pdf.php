<?php
// Conexión a la base de datos
include 'conexion.php';
$dummy = null;
ini_set('max_execution_time', 300);
ini_set('memory_limit', '256M');

try {
    // Validar que todos los datos hayan llegado correctamente
    if (
        isset($_POST['numero_habitacion']) &&
        isset($_POST['nombre_cliente']) &&
        isset($_POST['fecha_servicio']) &&
        isset($_POST['nombre_archivo']) &&
        isset($_FILES['archivo_pdf'])
    ) {
        $numeroHabitacion = $_POST['numero_habitacion'];
        $nombreCliente = $_POST['nombre_cliente'];
        $fechaServicio = $_POST['fecha_servicio'];
        $nombreArchivo = $_POST['nombre_archivo'];

        // Leer el contenido del archivo PDF subido
        $archivoTmp = $_FILES['archivo_pdf']['tmp_name'];
        $contenidoPDF = file_get_contents($archivoTmp);

        // Insertar en la base de datos
        $stmt = $conn->prepare("INSERT INTO historial 
            (numero_habitacion, nombre_cliente, fecha_servicio, archivo_pdf, nombre_archivo) 
            VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $numeroHabitacion, $nombreCliente, $fechaServicio, $dummy, $nombreArchivo);
        $stmt->send_long_data(3, $contenidoPDF);


        if ($stmt->execute()) {
            echo "PDF guardado correctamente en la base de datos.";
        } else {
            http_response_code(500);
            echo "Error al guardar el PDF: " . $stmt->error;
        }

        $stmt->close();
        $conn->close();
    } else {
        http_response_code(400);
        echo "Faltan datos obligatorios.";
    }
} catch (Exception $e) {
    http_response_code(500);
    echo "Error del servidor: " . $e->getMessage();
}
?>
