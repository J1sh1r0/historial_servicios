// Inicializar Lucide icons
lucide.createIcons();

// Variables globales
let completedSteps = 0;
const totalSteps = 8; // Total de pasos principales

// Función para alternar secciones
function toggleSection(header) {
  const content = header.nextElementSibling;
  const toggle = header.querySelector('.section-toggle i');
  
  if (content.classList.contains('active')) {
    content.classList.remove('active');
    toggle.style.transform = 'rotate(0deg)';
  } else {
    content.classList.add('active');
    toggle.style.transform = 'rotate(180deg)';
  }
}

// Función para alternar checklist items
function toggleChecklist(item) {
  const checkbox = item.querySelector('.checklist-checkbox');
  
  // Alternar la clase completed en el item
  item.classList.toggle('completed');
  
  // Alternar la clase checked en el checkbox
  checkbox.classList.toggle('checked');
  
  updateProgress();
}

// Función para actualizar progreso
function updateProgress() {
  const allChecklistItems = document.querySelectorAll('.checklist-item');
  const completedItems = document.querySelectorAll('.checklist-item.completed');
  const progress = (completedItems.length / allChecklistItems.length) * 100;
  
  document.querySelector('.progress-bar').style.width = progress + '%';
  document.getElementById('progress-percentage').textContent = Math.round(progress) + '%';
}

// Función para preview de imágenes
function previewImage(input, container) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      container.querySelector('.photo-upload-content').innerHTML = `
        <img src="${e.target.result}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
        <div style="position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.7); color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px;">
          ✓
        </div>
      `;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// Funciones para la firma
let isDrawing = false;
const canvas = document.getElementById('signature-canvas');
const ctx = canvas.getContext('2d');

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('touchmove', handleTouch);
canvas.addEventListener('touchend', stopDrawing);

function startDrawing(e) {
  isDrawing = true;
  draw(e);
}

function draw(e) {
  if (!isDrawing) return;
  
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#333';
  
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function stopDrawing() {
  if (!isDrawing) return;
  isDrawing = false;
  ctx.beginPath();
}

function handleTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                  e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}

function clearSignature() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Funciones de navegación del menú
function toggleSubmenu(id) {
  const submenu = document.getElementById('submenu-' + id);
  const menuItem = submenu.previousElementSibling;
  
  if (submenu.style.display === 'block') {
    submenu.style.display = 'none';
    menuItem.setAttribute('aria-expanded', 'false');
  } else {
    submenu.style.display = 'block';
    menuItem.setAttribute('aria-expanded', 'true');
  }
}

function toggleMobileMenu() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.mobile-overlay');
  
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
}

function closeMobileMenu() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.mobile-overlay');
  
  sidebar.classList.remove('active');
  overlay.classList.remove('active');
}

// Funciones de acciones principales
function saveAsDraft() {
  alert('Borrador guardado exitosamente');
}

function generateReport() {
  // Aquí implementarías la lógica para generar el reporte
  alert('Generando reporte...');
}

function completeService() {
  if (confirm('¿Estás seguro de que deseas completar este servicio?')) {
    alert('Servicio completado exitosamente');
  }
}

function logout() {
  if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    window.location.href = '/';
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
  // Establecer fecha actual
  const serviceDateElement = document.getElementById('service-date');
  if (serviceDateElement) {
    serviceDateElement.valueAsDate = new Date();
  }
  
  // Establecer hora actual
  const now = new Date();
  const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                    now.getMinutes().toString().padStart(2, '0');
  const serviceTimeElement = document.getElementById('service-time');
  if (serviceTimeElement) {
    serviceTimeElement.value = timeString;
  }
  
  // Calcular duración cuando se cambie la hora final
  const endTimeElement = document.getElementById('end-time');
  if (endTimeElement) {
    endTimeElement.addEventListener('change', function() {
      const startTimeElement = document.getElementById('service-time');
      const startTime = startTimeElement ? startTimeElement.value : '';
      const endTime = this.value;
      
      if (startTime && endTime) {
        const start = new Date('1970-01-01T' + startTime + 'Z');
        const end = new Date('1970-01-01T' + endTime + 'Z');
        const diffMs = end - start;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        const serviceDurationElement = document.getElementById('service-duration');
        if (serviceDurationElement) {
          serviceDurationElement.value = diffHours + ' horas ' + diffMinutes + ' minutos';
        }
      }
    });
  }
  
  // Preparar canvas para firma
  if (canvas && ctx) {
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#333';
  }
  
  // INICIALIZAR ESTADO DE CHECKBOXES
  // Asegurar que todos los checkboxes inicien sin la clase checked
  const allCheckboxes = document.querySelectorAll('.checklist-checkbox');
  allCheckboxes.forEach(checkbox => {
    checkbox.classList.remove('checked');
  });
  
  // Asegurar que todos los items inicien sin completed
  const allChecklistItems = document.querySelectorAll('.checklist-item');
  allChecklistItems.forEach(item => {
    item.classList.remove('completed');
  });
  
  // Reinicializar iconos de Lucide después de manipular el DOM
  lucide.createIcons();
  
  // Actualizar progreso inicial
  updateProgress();
});