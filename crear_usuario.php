<?php
require_once 'includes/conexion.php'; // Asegúrate de que este archivo establece $conn (mysqli)

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Capturar datos del formulario
    $nombre = trim($_POST["nombre"]);
    $correo = trim($_POST["correo"]);
    $telefono = trim($_POST["telefono"]);
    $password = $_POST["password"];
    $rol = trim($_POST["rol"]);
    $plantillas = isset($_POST["plantillas"]) ? implode(",", $_POST["plantillas"]) : null;

    // 2. Validaciones mínimas
    if (empty($nombre) || empty($correo) || empty($password) || empty($rol)) {
        die("Faltan campos obligatorios.");
    }

    // 3. Hashear contraseña
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // 4. Preparar e insertar
    $stmt = $conn->prepare("INSERT INTO login (nombre_completo, correo, telefono, contrasena, rol, creado_en, plantillas)
                            VALUES (?, ?, ?, ?, ?, NOW(), ?)");
    $stmt->bind_param("ssssss", $nombre, $correo, $telefono, $passwordHash, $rol, $plantillas);

    if ($stmt->execute()) {
        echo "Usuario creado correctamente.";
    } else {
        echo "Error al crear usuario: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
} else {
    echo "Método inválido.";
}
?>
