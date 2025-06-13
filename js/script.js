    // Inicializar iconos de Lucide
    lucide.createIcons();

    // Funcionalidad del menú móvil
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

    // Funcionalidad del submenú
    function toggleSubmenu(id) {
      const submenu = document.getElementById(`submenu-${id}`);
      const menuItem = document.querySelector(`[aria-controls="submenu-${id}"]`);
      
      submenu.classList.toggle('active');
      menuItem.classList.toggle('expanded');
      
      const isExpanded = submenu.classList.contains('active');
      menuItem.setAttribute('aria-expanded', isExpanded);
    }

    // Navegación con teclado
    function handleKeyDown(event, id) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleSubmenu(id);
      }
    }

    //  Navegación de elementos del menú
    document.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', function() {
        // Eliminar la clase activa de todos los elementos
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        
        // Agregar clase activa al elemento clicado (solo si no es un padre de submenú)
        if (!this.classList.contains('has-submenu')) {
          this.classList.add('active');
        }
      });

      // Soporte de teclado
      item.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.click();
        }
      });
    });

    //Funcionalidad de cierre de sesión
    function logout() {
      if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        // Add logout logic here
        console.log('Logging out...');
      }
    }

    // Cerrar el menú móvil cuando la ventana cambie a tamaño de escritorio
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    });

    // Cerrar el menú móvil al presionar la tecla Escape
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        closeMobileMenu();
      }
    });