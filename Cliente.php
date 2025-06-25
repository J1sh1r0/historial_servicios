<?php
session_start();
$plantillas = isset($_SESSION["plantillas"]) ? explode(",", strtolower($_SESSION["plantillas"])) : [];
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Dashboard Cliente</title>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="stylesheet" href="css/style.css">

  <style>
    .menu {
      list-style: none;
      padding: 0;
    }

    .menu li {
      padding: 8px;
      cursor: pointer;
      color: #fff;
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
    <h2>Bienvenido, <?php echo $_SESSION["usuario"]; ?></h2>

    <ul class="menu">
      <?php if (in_array("minisplit", $plantillas)): ?>
        <li><a href="view/MantenimientoGeneralMinisplit.html">Minisplit</a></li>
      <?php endif; ?>

      <?php if (in_array("habitaciones", $plantillas)): ?>
        <li><a href="view/habitaciones.html">Habitaciones</a></li>
      <?php endif; ?>

      <?php if (in_array("camara", $plantillas)): ?>
        <li><a href="view/camara.html">Cámaras</a></li>
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

      <?php if (in_array("historial", $plantillas)): ?>
  <li class="has-submenu" onclick="toggleSubmenu('historial')">
    <span>
      <i data-lucide="history"></i> Historial
    </span>
    <ul id="submenu-historial" class="submenu">
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
  function toggleSubmenu(id) {
    const submenu = document.getElementById(`submenu-${id}`);
    const parent = submenu?.parentElement;

    if (submenu && parent) {
      submenu.classList.toggle("open");
      parent.classList.toggle("open");
    }
  }

  function abrirPlantilla(numeroHabitacion) {
    window.location.href = `view/historial.html?habitacion=${numeroHabitacion}`;
  }
</script>

</body>
</html>
