<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $usuario = $_POST["usuario"];
    $contrasena = $_POST["contrasena"];

    if ($usuario === "admin" && $contrasena === "1234") {
        header("Location: Administrador.html");
        exit();
    } else {
        $error = "Usuario o contraseña incorrectos";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Login - Sistema de Mantenimiento</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="https://unpkg.com/lucide@latest/dist/umd/lucide.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <style>
        body {
    background-color: #0f172a; /* azul oscuro */
    font-family: 'Inter', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    margin: 0;
}

.login-container {
    background: white;
    padding: 2rem 3rem;
    border-radius: 16px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 400px;
}

.login-container h2 {
    margin-bottom: 1rem;
    font-weight: 700;
    font-size: 1.5rem;
    color: #0f172a; /* Texto oscuro */
}

.form-group {
    margin-bottom: 1rem;
}

label {
    font-weight: 600;
    display: block;
    margin-bottom: 0.5rem;
    color: #1e293b; /* Texto visible */
}

input[type="text"],
input[type="password"] {
    width: 100%;
    padding: 0.6rem;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    background-color: #f8fafc;
}

button {
    width: 100%;
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 0.8rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
}

button:hover {
    background-color: #2563eb;
}

.error {
    color: red;
    margin-bottom: 1rem;
}

    </style>
</head>
<body>
    <div class="login-container">
        <h2>Iniciar Sesión</h2>
        <?php if (!empty($error)) echo "<p class='error'>$error</p>"; ?>
        <form method="POST" action="">
            <div class="form-group">
                <label for="usuario">Usuario:</label>
                <input type="text" name="usuario" id="usuario" required>
            </div>
            <div class="form-group">
                <label for="contrasena">Contraseña:</label>
                <input type="password" name="contrasena" id="contrasena" required>
            </div>
            <button type="submit">Ingresar</button>
        </form>
    </div>
</body>
</html>
