<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
session_start();

require_once 'includes/conexion.php';
require 'includes/PHPMailer/src/PHPMailer.php';
require 'includes/PHPMailer/src/SMTP.php';
require 'includes/PHPMailer/src/Exception.php';

$mensaje = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST["nombre"];
    $contrasena = md5($_POST["contrasena"]); // Asumiendo que las contraseñas se almacenan con MD5

    $stmt = $conn->prepare("SELECT * FROM login WHERE nombre_completo = ? AND contrasena = ?");
    $stmt->bind_param("ss", $nombre, $contrasena);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 1) {
        $usuario = $resultado->fetch_assoc();
        $_SESSION["nombre"] = $usuario["nombre_completo"];

        // Datos del correo
        $correoDestino = $usuario["correo"];
        $asunto = "Inicio de sesión en el sistema";
        $mensajeCorreo = "Hola " . $usuario["nombre_completo"] . ", has iniciado sesión correctamente en el sistema.";

        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'pruebasistema14@gmail.com';
            $mail->Password = 'tfxp kgky ryns ujkr'; // Pega aquí la contraseña de aplicación generada
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;

            $mail->setFrom('pruebasistema14@gmail.com', 'Sistema de Control');
            $mail->addAddress($correoDestino);

            $mail->Subject = $asunto;
            $mail->Body = $mensajeCorreo;

            $mail->send();
            header("Location: Administrador.html");
            exit;
        } catch (Exception $e) {
            $mensaje = "Inicio exitoso pero no se pudo enviar el correo: " . $mail->ErrorInfo;
        }
    } else {
        $mensaje = "Nombre o contraseña incorrectos.";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Inicio de Sesión</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="login-container">
        <h2>Iniciar Sesión</h2>
        <?php if (!empty($mensaje)) echo "<p class='error'>$mensaje</p>"; ?>
        <form method="POST">
            <label for="nombre">Nombre:</label>
            <input type="text" name="nombre" required>
            <label for="contrasena">Contraseña:</label>
            <input type="password" name="contrasena" required>
            <button type="submit">Entrar</button>
        </form>
    </div>
</body>
</html>
