<?php
// 🔧 Mostrar errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../includes/PHPMailer/src/PHPMailer.php';
require '../includes/PHPMailer/src/SMTP.php';
require '../includes/PHPMailer/src/Exception.php';

header('Content-Type: application/json');

// Verifica si llegan los datos
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $correoDestino = $_POST['correo'];
    $archivos = json_decode($_POST['archivos'], true);

    if (!$correoDestino || empty($archivos)) {
        echo json_encode(['success' => false, 'message' => 'Faltan datos.']);
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // ✅ Configuración SMTP basada en tu index.php funcional (con Gmail)
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'pruebasistema14@gmail.com';
        $mail->Password   = 'tfxp kgky ryns ujkr';  // Contraseña de app de Gmail
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        // Remitente y destinatario
        $mail->setFrom('pruebasistema14@gmail.com', 'Sistema de Reportes');
        $mail->addAddress($correoDestino);

        // Asunto y cuerpo
        $mail->Subject = '📋 Reportes de servicio adjuntos';
        $mail->Body    = 'Se adjuntan los reportes PDF solicitados.';

        // Adjuntar los archivos
        foreach ($archivos as $ruta) {
            $rutaAbsoluta = '../' . $ruta;
            if (file_exists($rutaAbsoluta)) {
                $mail->addAttachment($rutaAbsoluta);
            }
        }

        // Enviar el correo
        $mail->send();
        echo json_encode(['success' => true, 'message' => 'Correo enviado correctamente.']);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => "Error al enviar: {$mail->ErrorInfo}",
            'trace' => $e->getMessage()
        ]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
