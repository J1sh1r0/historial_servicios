<?php
session_start();
$nombreUsuario = $_SESSION['usuario']; // nombre_completo del login

include 'includes/conexion.php';

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Consulta usando nombre_completo
$sql = "SELECT plantillas FROM login WHERE nombre_completo = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $nombreUsuario);
$stmt->execute();
$resultado = $stmt->get_result();

$plantillas = [];
if ($fila = $resultado->fetch_assoc()) {
    $plantillas = explode(",", strtolower($fila["plantillas"]));
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Dashboard Cliente</title>
  <script src="https://unpkg.com/lucide@latest"></script>


  <style>
    body {
      display: flex;
      margin: 0;
      font-family: sans-serif;
      background-color: #1e1e2f;
      color: #fff;
    }

    aside.sidebar {
      width: 250px;
      background-color: #111;
      padding: 20px;
      height: 100vh;
    }

    main {
      flex: 1;
      padding: 40px;
    }

    .menu {
      list-style: none;
      padding: 0;
    }

    .menu li {
      padding: 8px;
      cursor: pointer;
      color: #9f82ff;
    }

    .menu li:hover {
      background-color: #444;
    }

    .has-submenu > span {
      display: inline-block;
      cursor: pointer;
      font-weight: bold;
    }

    .has-submenu.open > span::after {
      content: " ▾";
    }

    .has-submenu:not(.open) > span::after {
      content: " ▸";
    }

    .submenu {
      display: none;
      margin-left: 15px;
      list-style-type: none;
      padding-left: 10px;
      border-left: 2px solid #555;
    }

    .submenu.open {
      display: block;
    }

    .has-submenu.open .submenu {
      display: block !important;
    }
  </style>
</head>

<body>

<aside class="sidebar">
  <h2>Bienvenido, <?php echo htmlspecialchars($nombreUsuario); ?></h2>
  <ul class="menu">
    <?php if (in_array("minisplit", $plantillas)): ?>
      <li><a href="view/MantenimientoGeneralMinisplit.html">Minisplit</a></li>
    <?php endif; ?>

    <?php if (in_array("habitaciones", $plantillas)): ?>
      <li><a href="view/habitaciones.html">Habitaciones</a></li>
    <?php endif; ?>

    <?php if (in_array("camaras", $plantillas)): ?>
      <li><a href="view/camaras.html">Camaras</a></li>
    <?php endif; ?>

    <?php if (in_array("electricidad", $plantillas)): ?>
      <li><a href="view/electricidad.html">Electricidad</a></li>
    <?php endif; ?>

    <?php if (in_array("plomeria", $plantillas)): ?>
      <li><a href="view/plomeria.html">Plomería</a></li>
    <?php endif; ?>

    <?php if (in_array("fumigacion", $plantillas)): ?>
      <li><a href="view/fumigacion.html">Fumigación</a></li>
    <?php endif; ?>

    <?php if (in_array("jardineria", $plantillas)): ?>
      <li><a href="view/jardineria.html">Jardinería</a></li>
    <?php endif; ?>

    <?php if (in_array("otros", $plantillas)): ?>
      <li><a href="view/otros.html">Otros</a></li>
    <?php endif; ?>

<!-- Menú desplegable: Historial (solo visual) -->
<?php if (in_array("historial", $plantillas)): ?>
  <li class="has-submenu">
    <span onclick="toggleSubmenu(this)">
      <i data-lucide="history"></i> Historial
    </span>
    <ul class="submenu">
      <li onclick="abrirPlantilla('200')">Habitación 200</li>
      <li onclick="abrirPlantilla('201')">Habitación 201</li>
      <li onclick="abrirPlantilla('202')">Habitación 202</li>
      <li onclick="abrirPlantilla('203')">Habitación 203</li>
      <li onclick="abrirPlantilla('204')">Habitación 204</li>
      <li onclick="abrirPlantilla('205')">Habitación 205</li>
    </ul>
  </li>
<?php endif; ?>

    <li><a href="logout.php">Cerrar sesión</a></li>
  </ul>
</aside>

<main>
  <h1>Dashboard Cliente</h1>
  <p>Solo verás las secciones que tengas activadas.</p>
</main>

<script>
  lucide.createIcons();
</script>
<script>
  function toggleSubmenu(element) {
    const parentLi = element.parentElement;
    parentLi.classList.toggle("open");
  }

  lucide.createIcons();
</script>
<script>
  function toggleSubmenu(element) {
    const parentLi = element.parentElement;
    parentLi.classList.toggle("open");
  }

  function abrirPlantilla(numeroHabitacion) {
    // Redirige al archivo historial.html con número de habitación por GET
    window.location.href = `view/historial.html?habitacion=${numeroHabitacion}`;
  }

  lucide.createIcons();
</script>

</body>
</html>
