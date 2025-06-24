<?php
session_start();

// Evita que el navegador guarde en caché esta página
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

if (!isset($_SESSION["usuario"])) {
    header("Location: index.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard Mantenimiento Minisplit</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://unpkg.com/lucide@latest/dist/umd/lucide.min.css" rel="stylesheet">
     <link rel="stylesheet" href="css/style.css?v=1.0.0" />
</head>
<body>
  <!-- Mobile Menu Toggle -->
  <button class="mobile-menu-toggle" onclick="toggleMobileMenu()" aria-label="Abrir menú de navegación">
    <i data-lucide="menu"></i>
  </button>

  <!-- Mobile Overlay -->
  <div class="mobile-overlay" onclick="closeMobileMenu()"></div>

  <!-- Barra Lateral -->
  <nav class="sidebar" role="navigation" aria-label="Navegación principal">
    <header class="sidebar-header">
      <h1 class="sidebar-title">Sistema Mantenimiento</h1>
    </header>

    <div class="sidebar-nav">
      <section class="nav-section">
  <h2 class="nav-section-title">Plantillas</h2>

  <div class="menu-item has-submenu" role="button" tabindex="0"
       onclick="toggleSubmenu('minisplit')" 
       onkeydown="handleKeyDown(event, 'minisplit')"
       aria-expanded="false"
       aria-controls="submenu-minisplit">
    <i data-lucide="wind"></i>
    Minisplit
  </div>
  <div id="submenu-minisplit" class="submenu" role="group" aria-labelledby="minisplit-label">
  <a href="view/MantenimientoGeneralMinisplit.html">
    <div class="menu-item" role="button" tabindex="0">Mantenimiento general</div>
  </a>
  <div class="menu-item" role="button" tabindex="0">Mantenimiento profundo</div>
  <div class="menu-item" role="button" tabindex="0">Instalación de minisplit</div>
  <div class="menu-item" role="button" tabindex="0">Reubicación de unidad</div>
  <div class="menu-item" role="button" tabindex="0">Reparación de minisplit</div>
</div>


  <div class="menu-item has-submenu" role="button" tabindex="0"
       onclick="toggleSubmenu('servicios')" 
       onkeydown="handleKeyDown(event, 'servicios')"
       aria-expanded="false"
       aria-controls="submenu-servicios">
    <i data-lucide="wrench"></i>
    Otros servicios
  </div>
  <div id="submenu-servicios" class="submenu" role="group" aria-labelledby="servicios-label">
    <div class="menu-item" role="button" tabindex="0">Electrico</div>
    <div class="menu-item" role="button" tabindex="0">Plomería</div>
    <div class="menu-item" role="button" tabindex="0">Daños en muros</div>
    <div class="menu-item" role="button" tabindex="0">Limpieza y sanitización</div>
  </div>
  <div class="menu-item has-submenu" role="button" tabindex="0"
       onclick="toggleSubmenu('habitaciones')" 
       onkeydown="handleKeyDown(event, 'habitaciones')"
       aria-expanded="false"
       aria-controls="submenu-habitaciones">
    <i data-lucide="bed"></i>
    Habitaciones
  </div>
  <div id="submenu-habitaciones" class="submenu" role="group" aria-labelledby="habitaciones-label">
    <div class="menu-item" role="button" tabindex="0">Recámara</div>
  </div>

 <div class="menu-item has-submenu" role="button" tabindex="0"
     onclick="toggleSubmenu('historial')" 
     onkeydown="handleKeyDown(event, 'historial')"
     aria-expanded="false"
     aria-controls="submenu-historial">
  <i data-lucide="history"></i>
  Historial
<div id="submenu-historial" class="submenu" role="group" aria-labelledby="historial-label">
  <div class="menu-item" role="button" tabindex="0" onclick="abrirPlantilla('200')">Habitacion 200</div>
  <div class="menu-item" role="button" tabindex="0" onclick="abrirPlantilla('201')">Habitacion 201</div>
  <div class="menu-item" role="button" tabindex="0" onclick="abrirPlantilla('202')">Habitacion 202</div>
  <div class="menu-item" role="button" tabindex="0" onclick="abrirPlantilla('203')">Habitacion 203</div>
  <div class="menu-item" role="button" tabindex="0" onclick="abrirPlantilla('204')">Habitacion 204</div>
  <div class="menu-item" role="button" tabindex="0" onclick="abrirPlantilla('205')">Habitacion 205</div>
</div>

</section>

      <section class="nav-section">
        <h2 class="nav-section-title">Gestión</h2>
        
        <div class="menu-item" role="button" tabindex="0">
          <i data-lucide="file-text"></i>
          Reportes
        </div>
        
        <div class="menu-item" role="button" tabindex="0">
          <i data-lucide="users"></i>
          Usuarios
        </div>
        
        <div class="menu-item" role="button" tabindex="0">
          <i data-lucide="settings"></i>
          Configuración
        </div>
      </section>
    </div>

    <footer class="sidebar-footer">
      <form action="logout.php" method="post" style="margin: 0;">
  <button type="submit" class="logout-btn" aria-label="Cerrar sesión">
    <i data-lucide="log-out"></i> Cerrar sesión
  </button>
</form>
    </footer>
  </nav>

  <!-- Contenido principal -->
  <main class="main" role="main">
    <header class="main-header">
      <h1 class="main-title">Dashboard</h1>
      <p class="main-subtitle">Sistema de gestión de mantenimiento</p>
    </header>

    <div class="main-content">
      <!-- Tarjeta de bienbenida -->
      <div class="welcome-card">
        <h2>Bienvenido al Sistema</h2>
        <p>Selecciona una opción del menú para comenzar. Aquí podrás registrar mantenimientos, ver reportes, asignar plantillas por cliente y más.</p>
      </div>
    </div>
  </main>

  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="js/script.js"></script>
  <script>
  // Previene navegación con flechas atrás/adelante si no hay sesión válida
  if (performance.navigation.type === 2) {
    location.reload(true); // fuerza recarga desde el servidor, no desde caché
  }
</script>
<script>
  window.addEventListener("pageshow", function (event) {
    // Si la página viene del caché (navegación hacia atrás)
    if (event.persisted) {
      // Hacemos logout automático
      fetch('auto_logout.php', {
        method: 'POST'
      }).then(() => {
        // Luego redirigimos al login
        window.location.href = 'index.php';
      });
    }
  });
</script>
<script>
  function abrirPlantilla(numeroHabitacion) {
    // Redirige al archivo historial.html en la carpeta 'view', con el número de habitación como parámetro GET
    window.location.href = `view/historial.html?habitacion=${numeroHabitacion}`;
  }
</script>


</body>
</html>