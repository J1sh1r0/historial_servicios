<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
session_start();

require_once 'includes/conexion.php';
require 'includes/PHPMailer/src/PHPMailer.php';
require 'includes/PHPMailer/src/SMTP.php';
require 'includes/PHPMailer/src/Exception.php';

$mensaje = "";

// Enviar código al correo
if (isset($_POST["recuperar_codigo"])) {
    $nombreUsuario = $_POST["usuario_recuperar"];

    $stmt = $conn->prepare("SELECT * FROM login WHERE nombre_completo = ?");
    $stmt->bind_param("s", $nombreUsuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 1) {
        $usuario = $resultado->fetch_assoc();
        $correoDestino = $usuario["correo"];

        $codigo = substr(str_shuffle("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 5);
        $_SESSION["codigo_recuperacion"] = $codigo;
        $_SESSION["usuario_codigo"] = $nombreUsuario;
        $_SESSION["codigo_expira"] = time() + 60;

        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'pruebasistema14@gmail.com';
            $mail->Password = 'tfxp kgky ryns ujkr';
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;

            $mail->setFrom('pruebasistema14@gmail.com', 'Sistema de Control');
            $mail->addAddress($correoDestino);
            $mail->Subject = "Recuperación de contraseña";
            $mail->Body = "Tu código de recuperación es: $codigo\nEste código expirará en 60 segundos.";

            $mail->send();
            echo "<script>alert('Código enviado al correo: $correoDestino'); setTimeout(() => { showVerifyModal(); }, 500);</script>";
        } catch (Exception $e) {
            echo "<script>alert('Error al enviar correo: {$mail->ErrorInfo}');</script>";
        }
    } else {
        echo "<script>alert('Nombre de usuario no encontrado');</script>";
    }
}
// Verificar código ingresado
if (isset($_POST["verificar_codigo"])) {
    $codigoIngresado = strtoupper(trim($_POST["codigo_ingresado"]));
    $codigoGuardado = $_SESSION["codigo_recuperacion"] ?? '';
    $expira = $_SESSION["codigo_expira"] ?? 0;

    if (time() > $expira) {
        echo "<script>alert('El código ha expirado. Intenta nuevamente.');</script>";
        unset($_SESSION["codigo_recuperacion"], $_SESSION["codigo_expira"]);
    } elseif ($codigoIngresado === $codigoGuardado) {
    $_SESSION["mostrar_modal_cambio"] = true;
    echo "<script>alert('Código correcto. Ahora puedes cambiar tu contraseña.');</script>";
}
 else {
        echo "<script>alert('Código incorrecto.');</script>";
    }
}

if (isset($_POST["cambiar_contrasena_confirmado"])) {
    $nueva = $_POST["nueva_contrasena"];
    $confirmar = $_POST["confirmar_contrasena"];
    $usuario = $_SESSION["usuario_codigo"] ?? null;

    if ($nueva !== $confirmar) {
        echo "<script>alert('Las contraseñas no coinciden.'); openModal('cambiarModal');</script>";
    } elseif ($usuario) {
        $hash = password_hash($nueva, PASSWORD_DEFAULT);

        $stmt = $conn->prepare("UPDATE login SET contrasena = ? WHERE nombre_completo = ?");
        $stmt->bind_param("ss", $hash, $usuario);
        $stmt->execute();

        unset($_SESSION["codigo_recuperacion"], $_SESSION["codigo_expira"], $_SESSION["usuario_codigo"]);
        echo "<script>alert('Contraseña actualizada exitosamente.'); closeModal('cambiarModal');</script>";
    } else {
        echo "<script>alert('Error al actualizar la contraseña.');</script>";
    }
}

// Inicio de sesión usando password_verify
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["usuario"])) {
    $nombre = $_POST["usuario"];
    $contrasena = $_POST["password"];

    $stmt = $conn->prepare("SELECT * FROM login WHERE nombre_completo = ?");
    $stmt->bind_param("s", $nombre);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 1) {
        $usuario = $resultado->fetch_assoc();

        if (password_verify($contrasena, $usuario["contrasena"])) {
            $_SESSION["usuario"] = $usuario["nombre_completo"];

            $correoDestino = $usuario["correo"];
            $asunto = "Inicio de sesión en el sistema";
            $mensajeCorreo = "Hola " . $usuario["nombre_completo"] . ", has iniciado sesión correctamente en el sistema.";

            $mail = new PHPMailer(true);
            try {
                $mail->isSMTP();
                $mail->Host = 'smtp.gmail.com';
                $mail->SMTPAuth = true;
                $mail->Username = 'pruebasistema14@gmail.com';
                $mail->Password = 'tfxp kgky ryns ujkr';
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
                $mensaje = "Inicio exitoso pero no se pudo enviar el correo: {$mail->ErrorInfo}";
            }
        } else {
            $mensaje = "Contraseña incorrecta.";
        }
    } else {
        $mensaje = "Usuario no encontrado.";
    }
}

?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login - Sistema Mantenimiento</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://unpkg.com/lucide@latest/dist/umd/lucide.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css" />
  <style>
    .modal {
      position: fixed; top: 0; left: 0;
      width: 100%; height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      display: flex; justify-content: center; align-items: center;
      z-index: 1000;
    }
    .modal-content {
      background-color: white;
      padding: 20px;
      border-radius: 10px;
      width: 300px;
    }
    .close {
      float: right; font-size: 20px; cursor: pointer;
    }
  </style>
</head>
<body class="login-page">
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="login-logo">⚙️</div>
        <h1 class="login-title">Bienvenido</h1>
        <p class="login-subtitle">Inicia sesión en tu cuenta</p>
      </div>

      <?php if (!empty($mensaje)) : ?>
      <div class="error-message" id="errorMessage">
        <i data-lucide="alert-circle" style="width: 16px; height: 16px;"></i>
        <span id="errorText"><?= $mensaje ?></span>
      </div>
      <?php endif; ?>

      <form class="login-form" method="POST">
        <div class="form-group">
          <label for="usuario" class="form-label">Nombre de usuario</label>
          <div class="form-input-container">
            <input 
              type="text" 
              id="usuario" 
              name="usuario" 
              class="form-input" 
              placeholder="Ingresa tu nombre"
              required
              autocomplete="username"
            >
            <i data-lucide="user" class="form-input-icon"></i>
          </div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Contraseña</label>
          <div class="form-input-container">
            <input 
              type="password" 
              id="password" 
              name="password" 
              class="form-input" 
              placeholder="••••••••"
              required
              autocomplete="current-password"
            >
            <i data-lucide="lock" class="form-input-icon"></i>
            <button type="button" class="password-toggle" onclick="togglePassword()" aria-label="Mostrar/ocultar contraseña">
              <i data-lucide="eye" id="passwordToggleIcon"></i>
            </button>
          </div>
        </div>

        <div class="remember-forgot">
          <div class="remember-me">
            <input type="checkbox" id="remember" name="remember" class="remember-checkbox">
            <label for="remember" class="remember-label">Recordarme</label>
          </div>
          <a href="#" class="forgot-link" onclick="openModal('forgotModal')">¿Olvidaste tu contraseña?</a>
        </div>

        <button type="submit" class="login-button">
          <span>Iniciar sesión</span>
        </button>
      </form>

      <div class="login-footer">
        <p class="signup-link">
          ¿No tienes una cuenta? <a href="#">Regístrate aquí</a>
        </p>
      </div>
    </div>
  </div>

  <!-- MODAL 1: ingresar nombre de usuario -->
  <div id="forgotModal" class="modal" style="display:none;">
    <div class="modal-content">
      <span class="close" onclick="closeModal('forgotModal')">&times;</span>
      <h2>Recuperar contraseña</h2>
      <form method="POST">
        <label for="usuario_recuperar">Nombre de usuario:</label>
        <input type="text" name="usuario_recuperar" required>
        <button type="submit" name="recuperar_codigo">Enviar código</button>
      </form>
    </div>
  </div>

  <!-- MODAL 2: ingresar código y cambiar contraseña -->
  <div id="verifyModal" class="modal" style="display:none;">
    <div class="modal-content">
      <span class="close" onclick="closeModal('verifyModal')">&times;</span>

      <!-- Sección 1: código -->
      <div id="codigoSection">
        <h2>Verifica tu código</h2>
        <form method="POST">
          <label for="codigo_ingresado">Código:</label>
          <input type="text" name="codigo_ingresado" required>
          <button type="submit" name="verificar_codigo">Validar</button>
        </form>
      </div>

      <!-- Sección 2: nueva contraseña 
      <div id="nuevaContrasenaSection" style="display:none;">
        <h2>Cambiar contraseña</h2>
        <form method="POST">
          <label for="nueva_contrasena">Nueva contraseña:</label>
          <input type="password" name="nueva_contrasena" required>
          <button type="submit" name="cambiar_contrasena">Actualizar</button>
        </form>
      </div>
    </div>
  </div>-->

  <!-- MODAL 3: Cambio de contraseña con confirmación -->
  <div id="cambiarModal" class="modal" style="display: none;">
    <div class="modal-content">
      <span class="close" onclick="closeModal('cambiarModal')">&times;</span>
      <h2>Cambiar contraseña</h2>
    <form method="POST">
      <label for="nueva_contrasena">Nueva contraseña:</label>
  <input type="password" name="nueva_contrasena" id="nueva_contrasena" required>

  <label for="confirmar_contrasena">Confirmar contraseña:</label>
  <input type="password" name="confirmar_contrasena" id="confirmar_contrasena" required>

      <button type="submit" name="cambiar_contrasena_confirmado">Confirmar cambio</button>
    </form>
  </div>
</div>

  <!-- SCRIPTS -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <script>
    lucide.createIcons();

    function togglePassword() {
      const passwordInput = document.getElementById("password");
      const icon = document.getElementById("passwordToggleIcon");
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.setAttribute("data-lucide", "eye-off");
      } else {
        passwordInput.type = "password";
        icon.setAttribute("data-lucide", "eye");
      }
      lucide.createIcons();
    }

    function openModal(id) {
      document.getElementById(id).style.display = "flex";
    }

    function closeModal(id) {
      document.getElementById(id).style.display = "none";
    }

    function showVerifyModal() {
      openModal('verifyModal');
    }
  </script>
  <?php
if (isset($_SESSION["mostrar_modal_cambio"])) {
    echo "<script>openModal('cambiarModal');</script>";
    unset($_SESSION["mostrar_modal_cambio"]);
}
?>

</body>
</html>
