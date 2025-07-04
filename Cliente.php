<?php
session_start();
$plantillas = isset($_SESSION["plantillas"]) ? explode(",", strtolower($_SESSION["plantillas"])) : [];
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Cliente</title>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="stylesheet" href="css/style.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>

<body>
  <!-- Mobile Menu Toggle -->
  <button class="mobile-menu-toggle" onclick="toggleMobileMenu()">
    <i data-lucide="menu"></i>
  </button>

  <!-- Mobile Overlay -->
  <div class="mobile-overlay" onclick="closeMobileMenu()"></div>

  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">Panel Cliente</h2>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section">
        <div class="nav-section-title">Usuario</div>
        <div class="menu-item" style="background: var(--primary-100); color: var(--primary-700); cursor: default;">
          <i data-lucide="user"></i>
          <?php echo $_SESSION["usuario"]; ?>
        </div>
      </div>

      <div class="nav-section">
        <div class="nav-section-title">Servicios</div>
        
        <?php if (in_array("minisplit", $plantillas)): ?>
          <a href="view/MantenimientoGeneralMinisplit.html" class="menu-item">
            <i data-lucide="air-vent"></i>
            Minisplit
          </a>
        <?php endif; ?>

        <?php if (in_array("habitaciones", $plantillas)): ?>
          <a href="view/habitaciones.html" class="menu-item">
            <i data-lucide="bed"></i>
            Habitaciones
          </a>
        <?php endif; ?>

        <?php if (in_array("camara", $plantillas)): ?>
          <a href="view/camara.html" class="menu-item">
            <i data-lucide="camera"></i>
            Cámaras
          </a>
        <?php endif; ?>

        <?php if (in_array("electricidad", $plantillas)): ?>
          <a href="view/electricidad.html" class="menu-item">
            <i data-lucide="zap"></i>
            Electricidad
          </a>
        <?php endif; ?>

        <?php if (in_array("plomeria", $plantillas)): ?>
          <a href="view/plomeria.html" class="menu-item">
            <i data-lucide="droplets"></i>
            Plomería
          </a>
        <?php endif; ?>

        <?php if (in_array("fumigacion", $plantillas)): ?>
          <a href="view/fumigacion.html" class="menu-item">
            <i data-lucide="bug"></i>
            Fumigación
          </a>
        <?php endif; ?>

        <?php if (in_array("jardineria", $plantillas)): ?>
          <a href="view/jardineria.html" class="menu-item">
            <i data-lucide="flower"></i>
            Jardinería
          </a>
        <?php endif; ?>

        <?php if (in_array("otros", $plantillas)): ?>
          <a href="view/otros.html" class="menu-item">
            <i data-lucide="more-horizontal"></i>
            Otros
          </a>
        <?php endif; ?>
      </div>

      <?php if (in_array("historial", $plantillas)): ?>
      <div class="nav-section">
        <div class="nav-section-title">Historial</div>
        <div class="menu-item has-submenu" onclick="toggleSubmenu('historial')">
          <i data-lucide="history"></i>
          Historial
        </div>
        <div id="submenu-historial" class="submenu">
          <div class="menu-item" onclick="abrirPlantilla('200')">
            <i data-lucide="door-open"></i>
            Habitación 200
          </div>
          <div class="menu-item" onclick="abrirPlantilla('201')">
            <i data-lucide="door-open"></i>
            Habitación 201
          </div>
          <div class="menu-item" onclick="abrirPlantilla('202')">
            <i data-lucide="door-open"></i>
            Habitación 202
          </div>
          <div class="menu-item" onclick="abrirPlantilla('203')">
            <i data-lucide="door-open"></i>
            Habitación 203
          </div>
          <div class="menu-item" onclick="abrirPlantilla('204')">
            <i data-lucide="door-open"></i>
            Habitación 204
          </div>
          <div class="menu-item" onclick="abrirPlantilla('205')">
            <i data-lucide="door-open"></i>
            Habitación 205
          </div>
        </div>
      </div>
      <?php endif; ?>

      <?php if (in_array("historial_habitaciones", $plantillas)): ?>
  <div class="nav-section">
    <div class="nav-section-title">Historial Habitaciones</div>
    <div class="menu-item has-submenu" onclick="toggleSubmenu('historialHabitaciones')">
      <i data-lucide="bed-double"></i>
      Historial
    </div>

    <div id="submenu-historialHabitaciones" class="submenu">
      <div class="menu-item" onclick="abrirHistorialHabitacion('200')">
        <i data-lucide="file-text"></i>
        Habitación 200
      </div>
      <div class="menu-item" onclick="abrirHistorialHabitacion('201')">
        <i data-lucide="file-text"></i>
        Habitación 201
      </div>
      <div class="menu-item" onclick="abrirHistorialHabitacion('202')">
        <i data-lucide="file-text"></i>
        Habitación 202
      </div>
      <div class="menu-item" onclick="abrirHistorialHabitacion('203')">
        <i data-lucide="file-text"></i>
        Habitación 203
      </div>
      <div class="menu-item" onclick="abrirHistorialHabitacion('204')">
        <i data-lucide="file-text"></i>
        Habitación 204
      </div>
      <div class="menu-item" onclick="abrirHistorialHabitacion('205')">
        <i data-lucide="file-text"></i>
        Habitación 205
      </div>
    </div>
  </div>
<?php endif; ?>

      </nav>

    <div class="sidebar-footer">
      <button class="logout-btn" onclick="window.location.href='logout.php'">
        <i data-lucide="log-out"></i>
        Cerrar sesión
      </button>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="main">
    <header class="main-header">
      <div>
        <h1 class="main-title">Dashboard Cliente</h1>
        <p class="main-subtitle">Gestiona tus servicios y consulta el historial de mantenimiento</p>
      </div>
    </header>

    <div class="main-content">
      <!-- Welcome Card -->
      <div class="welcome-card">
        <h2>Bienvenido, <?php echo $_SESSION["usuario"]; ?></h2>
        <p>Accede a las secciones disponibles según tus permisos. Utiliza el menú lateral para navegar entre los diferentes servicios de mantenimiento.</p>
      </div>

      <!-- Services Overview -->
      <div class="stats-grid">
        <?php if (in_array("minisplit", $plantillas)): ?>
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon primary">
              <i data-lucide="air-vent"></i>
            </div>
          </div>
          <div class="stat-number">Minisplit</div>
          <div class="stat-label">Mantenimiento disponible</div>
        </div>
        <?php endif; ?>

        <?php if (in_array("habitaciones", $plantillas)): ?>
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon success">
              <i data-lucide="bed"></i>
            </div>
          </div>
          <div class="stat-number">Habitaciones</div>
          <div class="stat-label">Gestión disponible</div>
        </div>
        <?php endif; ?>

        <?php if (in_array("camara", $plantillas)): ?>
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon warning">
              <i data-lucide="camera"></i>
            </div>
          </div>
          <div class="stat-number">Cámaras</div>
          <div class="stat-label">Sistema disponible</div>
        </div>
        <?php endif; ?>

        <?php if (in_array("electricidad", $plantillas)): ?>
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon primary">
              <i data-lucide="zap"></i>
            </div>
          </div>
          <div class="stat-number">Electricidad</div>
          <div class="stat-label">Servicio disponible</div>
        </div>
        <?php endif; ?>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <?php if (in_array("minisplit", $plantillas)): ?>
        <a href="view/MantenimientoGeneralMinisplit.html" class="action-btn">
          <i data-lucide="air-vent"></i>
          Ir a Minisplit
        </a>
        <?php endif; ?>

        <?php if (in_array("habitaciones", $plantillas)): ?>
        <a href="view/habitaciones.html" class="action-btn">
          <i data-lucide="bed"></i>
          Gestionar Habitaciones
        </a>
        <?php endif; ?>

        <?php if (in_array("historial", $plantillas)): ?>
        <a href="#" class="action-btn" onclick="toggleSubmenu('historial')">
          <i data-lucide="history"></i>
          Ver Historial
        </a>
        <?php endif; ?>

        <?php if (in_array("plomeria", $plantillas)): ?>
        <a href="view/plomeria.html" class="action-btn">
          <i data-lucide="droplets"></i>
          Servicio Plomería
        </a>
        <?php endif; ?>
      </div>
    </div>
  </main>

  <script>
    // Initialize Lucide icons
    lucide.createIcons();

    function toggleSubmenu(id) {
      const submenu = document.getElementById(`submenu-${id}`);
      const parent = submenu?.parentElement;

      if (submenu && parent) {
        submenu.classList.toggle("active");
        parent.classList.toggle("expanded");
      }
    }

    function abrirPlantilla(numeroHabitacion) {
      window.location.href = `view/historial_habitaciones.html?habitacion=${numeroHabitacion}`;
    }

    function toggleMobileMenu() {
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.querySelector('.mobile-overlay');
      
      sidebar.classList.toggle('mobile-open');
      overlay.classList.toggle('active');
    }

    function closeMobileMenu() {
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.querySelector('.mobile-overlay');
      
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('active');
    }

    // Close mobile menu when clicking on menu items
    document.querySelectorAll('.sidebar .menu-item').forEach(item => {
      if (!item.classList.contains('has-submenu')) {
        item.addEventListener('click', closeMobileMenu);
      }
    });
  </script>
  <script>
  function abrirHistorialHabitacion(numero) {
  window.location.href = `view/historial_habitaciones.html?habitacion=${numero}`;
}
</script>

</body>
</html>
