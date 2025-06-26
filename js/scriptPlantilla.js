// Inicializar Lucide icons
lucide.createIcons();

// jsPDF instancia global y utilidades
const { jsPDF } = window.jspdf;
const doc = new jsPDF();
let currentY = 10;

function loadImage(input) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = function(e) {
      resolve(e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  });
}


// Variables globales
let completedSteps = 0;
const totalSteps = 8; // Total de pasos principales

// Función para alternar secciones
function toggleSection(header) {
  const content = header.nextElementSibling;
  const toggle = header.querySelector('.section-toggle [data-lucide]');

  if (!content || !toggle) {
    console.warn("No se encontró 'content' o el ícono dentro de '.section-toggle'.");
    return;
  }

  const isActive = content.classList.contains('active');
  content.classList.toggle('active');
  toggle.style.transform = isActive ? 'rotate(0deg)' : 'rotate(180deg)';
}

// Función para alternar checklist items
function toggleChecklist(item) {
  const checkbox = item.querySelector('.checklist-checkbox');
  const hiddenInput = item.querySelector('input[type="checkbox"]');

  // Alternar clase visual
  item.classList.toggle('completed');

  checkbox.classList.toggle('checked');


  // ✅ Marcar el input como 'checked' si el div fue marcado
  if (hiddenInput) {
    hiddenInput.checked = item.classList.contains('completed');
  }

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


// ahora tus funciones auxiliares...


 // Declaración global para poder acceder a `y`

const checkPageBreak = () => {
  if (y > 270) {
    doc.addPage();
    y = 10;
  }
};

const addText = (label, value) => {
  checkPageBreak();
  doc.text(`${label}: ${value}`, 10, y);
  y += 10;
};

const addTitle = (title) => {
  checkPageBreak();
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text(title, 10, y);
  y += 10;
  doc.setFontSize(12);
  doc.setFont(undefined, "normal");
};

const addTextBlock = (label, value) => {
  checkPageBreak();
  doc.text(`${label}: ${value}`, 10, y);
  y += 10;
};

const addWrappedText = (label, value) => {
  const lines = doc.splitTextToSize(`${label}: ${value}`, 180);
  lines.forEach(line => {
    checkPageBreak();
    doc.text(line, 10, y);
    y += 10;
  });
};

const addChecklist = (doc, items) => {
  let added = false; // Para saber si se agregó al menos uno

  items.forEach(item => {
    const checkbox = document.getElementById(item.id);
    if (checkbox && checkbox.checked) {
      checkPageBreak();
      doc.text(`☑ ${item.label}`, 10, y);
      y += 8;
      added = true;
    }
  });

  if (!added) {
    checkPageBreak();
    doc.setFont(undefined, 'italic');
    doc.text("Ninguna opción seleccionada.", 10, y);
    y += 8;
    doc.setFont(undefined, 'normal');
  }
};


const addImages = async (title, ...inputIds) => {
  addTitle(title);
  for (const inputId of inputIds) {
    const fileInput = document.getElementById(inputId);
    if (fileInput && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const imgData = await toBase64(file);
      checkPageBreak();
      doc.addImage(imgData, 'JPEG', 10, y, 60, 45);
      y += 50;
    }
  }
};

const addSignature = () => {
  const canvas = document.getElementById("signature-canvas");
  if (canvas) {
    const imgData = canvas.toDataURL("image/png");
    checkPageBreak();
    doc.text("Firma del Cliente:", 10, y);
    y += 5;
    checkPageBreak();
    doc.addImage(imgData, 'PNG', 10, y, 60, 30);
    y += 40;
  }
};

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

async function generarYGuardarPDF() {
  const doc = new jsPDF();
  let posY = 10; // Posición inicial vertical

  // 🔹 Información básica
  const numeroHabitacion = document.getElementById('numero_habitacion').value;
  const nombreCliente = document.getElementById('client-name').value;
  const fechaServicio = document.getElementById('service-date').value;
  const nombreArchivo = `reporte_hab_${numeroHabitacion}_${Date.now()}.pdf`;

  // 🔹 Contenido básico en el PDF
  doc.setFontSize(16);
  doc.text("Reporte de Mantenimiento", 10, posY);
  posY += 10;

  doc.setFontSize(12);
  doc.text(`Cliente: ${nombreCliente}`, 10, posY);
  posY += 8;
  doc.text(`Habitación: ${numeroHabitacion}`, 10, posY);
  posY += 8;
  doc.text(`Fecha del Servicio: ${fechaServicio}`, 10, posY);
  posY += 10;

  doc.setFontSize(14);
  doc.text("Verificación Inicial", 10, posY);
  posY += 8;

  // 🔹 Checkboxes
  const checklist = [
    { id: 'check-encender', label: 'Se encendió correctamente' },
    { id: 'check-enfria', label: 'El aire sale frío' },
    { id: 'check-control', label: 'Todas las funciones responden' }
  ];

  checklist.forEach(item => {
    const checkbox = document.getElementById(item.id);
    if (checkbox && checkbox.checked) {
      doc.text(`☑ ${item.label}`, 10, posY);
      posY += 8;
    }
  });

  // 🔹 Observaciones
  const obs = document.getElementById('initial-notes')?.value;
  if (obs) {
    doc.setFontSize(12);
    doc.text("Observaciones:", 10, posY);
    posY += 8;
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(obs, 180), 10, posY);
  }

  // 🔹 Convertir PDF a Blob
  const pdfBlob = doc.output('blob');
  const formData = new FormData();

  formData.append('numero_habitacion', numeroHabitacion);
  formData.append('nombre_cliente', nombreCliente);
  formData.append('fecha_servicio', fechaServicio);
  formData.append('nombre_archivo', nombreArchivo);
  formData.append('archivo_pdf', pdfBlob, nombreArchivo);

  // 🔹 Enviar al servidor
  try {
    const response = await fetch('../includes/guardar_pdf.php', {
      method: 'POST',
      body: formData
    });

    const result = await response.text();
    alert(result);
  } catch (error) {
    console.error("Error al guardar PDF:", error);
    alert("Error al guardar el reporte.");
  }
}



// ⚙️ FUNCIÓN COMPLETA: generateReport()
// Incluye todas las secciones del mantenimiento, imágenes, observaciones, firma, duración total y nombre del técnico.

async function generateReport() {
  try {
    // Crear nuevo documento PDF
    const doc = new jsPDF();
    let y = 20;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);

    // Definir colores profesionales
    const colors = {
      primary: [41, 128, 185],      // Azul profesional
      secondary: [52, 73, 94],      // Gris oscuro
      success: [39, 174, 96],       // Verde
      danger: [231, 76, 60],        // Rojo
      warning: [241, 196, 15],      // Amarillo
      light: [236, 240, 241],       // Gris claro
      lighter: [250, 250, 250],     // Gris muy claro
      text: [44, 62, 80]            // Texto principal
    };

    // Funciones de utilidad para el diseño
    function setColor(colorArray) {
      doc.setTextColor(...colorArray);
    }

    function setFillColor(colorArray) {
      doc.setFillColor(...colorArray);
    }

    function drawRect(x, y, width, height, fill = false) {
      if (fill) {
        doc.rect(x, y, width, height, 'F');
      } else {
        doc.rect(x, y, width, height);
      }
    }

    function drawLine(x1, y1, x2, y2) {
      doc.line(x1, y1, x2, y2);
    }

    // Función mejorada para verificar salto de página
    const checkPageBreak = (requiredSpace = 20) => {
      if (y + requiredSpace > pageHeight - 40) {
        doc.addPage();
        y = 30;
        return true;
      }
      return false;
    };

    // Función mejorada para crear títulos de sección
    const addTitle = (title) => {
      checkPageBreak(25);
      
      // Fondo de la sección
      setFillColor(colors.lighter);
      drawRect(margin, y - 8, maxWidth, 20, true);
      
      // Título de la sección
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      setColor(colors.secondary);
      doc.text(title, margin + 5, y + 5);
      
      y += 18;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      setColor(colors.text);
    };

    // Función mejorada para agregar texto
    const addText = (label, value) => {
      checkPageBreak();
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      setColor(colors.text);
      doc.text(`${label}:`, margin + 5, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value || 'N/A', margin + 60, y);
      y += 8;
    };

    // Función mejorada para bloques de texto
    const addTextBlock = (label, value) => {
      checkPageBreak();
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      setColor(colors.text);
      doc.text(`${label}:`, margin + 5, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value || 'N/A', margin + 60, y);
      y += 8;
    };

    // Función mejorada para texto envuelto con observaciones estilizadas
    const addWrappedText = (label, value) => {
      if (value && value.trim()) {
        checkPageBreak(20);
        
        // Fondo amarillo claro para observaciones
        setFillColor([255, 252, 230]);
        const obsHeight = doc.splitTextToSize(value, maxWidth - 20).length * 6 + 16;
        drawRect(margin + 5, y - 5, maxWidth - 10, obsHeight, true);
        
        // Borde
        doc.setDrawColor(...colors.warning);
        doc.setLineWidth(1);
        drawRect(margin + 5, y - 5, maxWidth - 10, obsHeight);
        
        // Título
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        setColor(colors.secondary);
        doc.text(label + ':', margin + 10, y + 5);
        y += 12;
        
        // Contenido
        doc.setFont('helvetica', 'italic');
        setColor([120, 120, 120]);
        const lines = doc.splitTextToSize(value, maxWidth - 20);
        lines.forEach(line => {
          checkPageBreak();
          doc.text(line, margin + 10, y);
          y += 6;
        });
        y += 10;
      }
    };

    // Función mejorada para checklist estilizada
    const addChecklist = (doc, items) => {
      doc.setFont('helvetica', 'normal');
      let hasItems = false;
      
      items.forEach(item => {
        const checkbox = document.getElementById(item.id);
        if (checkbox && checkbox.checked) {
          checkPageBreak();
          
          // Checkbox estilizado
          const checkboxX = margin + 10;
          const checkboxY = y - 4;
          const checkboxSize = 4;
          
          // Dibujar cuadro
          doc.setDrawColor(100, 100, 100);
          doc.setLineWidth(0.5);
          drawRect(checkboxX, checkboxY, checkboxSize, checkboxSize);
          
          // Rellenar con verde
          setFillColor(colors.success);
          drawRect(checkboxX + 0.5, checkboxY + 0.5, checkboxSize - 1, checkboxSize - 1, true);
          
          // Marca de verificación
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          setColor([255, 255, 255]);
          doc.text('X', checkboxX + 1, checkboxY + 3);
          
          // Texto del item
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          setColor(colors.success);
          
          const textLines = doc.splitTextToSize(item.label, maxWidth - 30);
          textLines.forEach((line, index) => {
            doc.text(line, checkboxX + 8, y + (index * 6));
          });
          
          y += Math.max(6, textLines.length * 6);
          hasItems = true;
        }
      });

      if (!hasItems) {
        checkPageBreak();
        doc.setFont('helvetica', 'italic');
        setColor([120, 120, 120]);
        doc.text("Ninguna opción seleccionada.", margin + 10, y);
        y += 8;
      }
      
      y += 8;
    };

    // Función mejorada para agregar imágenes estilizadas
    const addImages = async (title, ...inputIds) => {
      let hasImages = false;
      
      for (const inputId of inputIds) {
        const fileInput = document.getElementById(inputId);
        if (fileInput && fileInput.files.length > 0) {
          if (!hasImages) {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            setColor(colors.secondary);
            doc.text(title, margin + 5, y);
            y += 10;
            hasImages = true;
          }
          
          const file = fileInput.files[0];
          const imgData = await toBase64(file);
          
          checkPageBreak(80);
          
          try {
            // Fondo para la imagen
            setFillColor(colors.lighter);
            drawRect(margin + 5, y - 5, maxWidth - 10, 75, true);
            
            // Título de la foto
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            setColor(colors.secondary);
            doc.text(`IMAGEN: ${file.name}`, margin + 10, y + 5);
            y += 12;
            
            // Insertar imagen centrada
            const imgWidth = 90;
            const imgHeight = 50;
            const imgX = (pageWidth - imgWidth) / 2;
            
            // Borde de la imagen
            doc.setDrawColor(...colors.secondary);
            doc.setLineWidth(1);
            drawRect(imgX - 2, y - 2, imgWidth + 4, imgHeight + 4);
            
            doc.addImage(imgData, 'JPEG', imgX, y, imgWidth, imgHeight);
            y += imgHeight + 15;
            
          } catch (error) {
            console.error('Error insertando imagen:', error);
            checkPageBreak();
            setColor(colors.danger);
            doc.text(`(Error al cargar imagen: ${file.name})`, margin + 10, y);
            y += 8;
          }
        }
      }
    };

    // Función mejorada para agregar firma
    const addSignature = () => {
      const canvas = document.getElementById("signature-canvas");
      if (canvas) {
        checkPageBreak(80);
        
        // Título de la sección
        addTitle('FIRMA DEL CLIENTE');
        
        try {
          const imgData = canvas.toDataURL("image/png");
          
          // Marco para la firma
          const signatureWidth = 120;
          const signatureHeight = 60;
          const signatureX = (pageWidth - signatureWidth) / 2;
          
          doc.setDrawColor(...colors.secondary);
          doc.setLineWidth(2);
          drawRect(signatureX - 5, y - 5, signatureWidth + 10, signatureHeight + 15);
          
          doc.addImage(imgData, 'PNG', signatureX, y, signatureWidth, signatureHeight);
          y += signatureHeight + 20;
          
          // Línea para fecha
          drawLine(signatureX, y, signatureX + signatureWidth, y);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          setColor(colors.text);
          const fechaText = `Fecha: ${new Date().toLocaleDateString()}`;
          const fechaWidth = doc.getTextWidth(fechaText);
          doc.text(fechaText, signatureX + (signatureWidth - fechaWidth) / 2, y + 8);
          
        } catch (error) {
          console.error('Error insertando firma:', error);
          setColor(colors.danger);
          doc.text('(Error al cargar firma)', margin, y);
        }
      }
    };

    // === ENCABEZADO PROFESIONAL ===
    // Fondo del encabezado
    setFillColor(colors.primary);
    drawRect(0, 0, pageWidth, 45, true);
    
    // Título principal
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    const title = 'REPORTE DE MANTENIMIENTO DE AIRE ACONDICIONADO';
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 25);
    
    // Línea decorativa
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(1);
    drawLine(margin, 35, pageWidth - margin, 35);
    
    y = 60;

    // 🎯 INICIO DEL REPORTE (mantiene toda la funcionalidad original)
    addTitle("INFORMACION DEL SERVICIO");
    addText("Nombre del Cliente", document.getElementById("client-name").value || "");
    addText("Dirección", document.getElementById("client-address").value || "");
    addText("Fecha del Servicio", document.getElementById("service-date").value || "");
    addText("Marca del Equipo", document.getElementById("equipment-brand").value || "");
    addText("Modelo", document.getElementById("equipment-model").value || "");
    addText("Número de Habitación", document.getElementById("numero_habitacion").value || "");


    y += 5;

    // 🔹 PASO 1
    addTitle("Verificación Inicial");
    addChecklist(doc, [
      { id: 'check-encender', label: 'Se encendió correctamente' },
      { id: 'check-enfria', label: 'El aire sale frío' },
      { id: 'check-control', label: 'Todas las funciones responden' }
    ]);
    addWrappedText("Observaciones Iniciales", document.getElementById('initial-notes').value);
    await addImages("Evidencia Fotográfica - Estado Inicial", 'photo-inicial-1', 'photo-inicial-2');

    // 🔹 PASO 2
    addTitle("Revisión del Condensador");
    addChecklist(doc, [
      { id: 'check-acceder', label: 'Accedió a la unidad exterior' },
      { id: 'check-manometro', label: 'Manómetro conectado' },
      { id: 'check-valvula', label: 'Válvula de baja presión abierta' },
      { id: 'check-presion', label: 'Presión verificada' },
    ]);
    addTextBlock("Lectura de Presión", `${document.getElementById('pressure-reading').value} PSI`);
    addTextBlock("Estado de la Presión", document.getElementById('pressure-status').value);
    addWrappedText("Observaciones de Presión", document.getElementById('pressure-notes').value);
    await addImages("Evidencia Fotográfica - Unidad Exterior", 'photo-condensador-1', 'photo-condensador-2');

    // 🔹 PASO 3
    addTitle("Paso 3 - Desarme Parcial de Unidad Interior");
    addChecklist(doc, [
      { id: 'check-step3-1', label: 'Apagar y desconectar el equipo' },
      { id: 'check-step3-2', label: 'Retirar carcasa, cubierta frontal y aleta' },
      { id: 'check-step3-3', label: 'Quitar display digital' },
      { id: 'check-step3-4', label: 'Retirar filtros' },
      { id: 'check-step3-5', label: 'Proteger componentes eléctricos' },
    ]);
    await addImages("Evidencia Fotográfica - Desarme", 'photo-desarme-1', 'photo-desarme-2');

    // 🔹 PASO 4
    addTitle("Paso 4 - Preparación para Limpieza");
    addChecklist(doc, [
      { id: 'check-step4-1', label: 'Colocó la Cubierta de Limpieza' },
      { id: 'check-step4-2', label: 'Protegió Muebles y Objetos Cercanos' },
      { id: 'check-step4-3', label: 'Verificó drenaje correcto' },
    ]);
    await addImages("Evidencia Fotográfica - Preparación", 'photo-prep-1', 'photo-prep-2');

    // 🔹 PASO 5
    addTitle("Paso 5 - Aplicación de Limpieza");
    addChecklist(doc, [
      { id: 'check-step5-1', label: 'Aplicó químico al serpentín' },
      { id: 'check-step5-2', label: 'Aplicó químico al rodillo/turbina' },
      { id: 'check-step5-3', label: 'Dejó actuar al químico' },
      { id: 'check-step5-4', label: 'Lavó con agua a presión' },
      { id: 'check-step5-5', label: 'Limpió carcasa, cubierta, aleta y filtros' }
    ]);
    addTextBlock("Tipo de Químico", document.getElementById('cleaner-type').value);
    addTextBlock("Cantidad Usada", document.getElementById('cleaner-amount').value);
    addWrappedText("Otros Materiales", document.getElementById('other-materials').value);
    await addImages("Evidencia Fotográfica - Limpieza", 'photo-limpieza-1', 'photo-limpieza-2');

    // 🔹 PASO 6
    addTitle("Paso 6 - Secado");
    addChecklist(doc, [
      { id: 'check-step6-1', label: 'Retiró exceso de agua con trapo' },
      { id: 'check-step6-2', label: 'Verificó drenaje completo' },
      { id: 'check-step6-3', label: 'Secó filtros completamente' },
      { id: 'check-step6-4', label: 'Dejó secar de 15 a 20 minutos' }
    ]);
    addWrappedText("Observaciones del Secado", document.getElementById('drying-notes').value);

    // 🔹 PASO 7
    addTitle("Paso 7 - Reensamblaje");
    addChecklist(doc, [
      { id: 'check-step7-1', label: 'Retiró protección de cables' },
      { id: 'check-step7-2', label: 'Colocó los filtros' },
      { id: 'check-step7-3', label: 'Reconectó el display digital' },
      { id: 'check-step7-4', label: 'Instaló la carcasa frontal' },
      { id: 'check-step7-5', label: 'Reconectó energía eléctrica' },
    ]);
    await addImages("Evidencia Fotográfica - Reensamblaje", 'photo-reensamble-1', 'photo-reensamble-2');

    // 🔹 PASO 8
    addTitle("Paso 8 - Prueba Final");
    addChecklist(doc, [
      { id: 'check-step8-1', label: 'Encendió el equipo' },
      { id: 'check-step8-2', label: 'Verificó enfriamiento' },
      { id: 'check-step8-3', label: 'Probó todas las funciones' },
      { id: 'check-step8-4', label: 'Verificó ausencia de ruidos anormales' },
      { id: 'check-step8-5', label: 'Comprobó el drenaje' },
    ]);
    addWrappedText("Estado General", document.getElementById('final-status').value);
    addWrappedText("Temperatura Alcanzada", document.getElementById('final-temperature').value + " °C");
    await addImages("Evidencia Fotográfica - Estado Final", 'photo-final-1', 'photo-final-2', 'photo-final-3');

    // 🔹 PASO 9
    addTitle("Registro del Servicio");
    addWrappedText("Observaciones del Técnico", document.getElementById('service-observations').value);
    addWrappedText("Recomendaciones para el Cliente", document.getElementById('recommendations').value);
    addTextBlock("Duración Total", document.getElementById('service-duration').value);
    addTextBlock("Nombre del Técnico", document.getElementById('technician-name').value);
    addTextBlock("Cliente que Firma", document.getElementById('client-signature-name').value);
    addSignature();

    // === PIE DE PÁGINA PROFESIONAL ===
    const totalPages = doc.internal.getNumberOfPages();
    const clientName = document.getElementById("client-name")?.value || 'Cliente';
    
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Línea superior del pie
      doc.setDrawColor(...colors.light);
      doc.setLineWidth(1);
      drawLine(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);
      
      // Información del pie
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      setColor([120, 120, 120]);
      
      // Fecha de generación (izquierda)
      doc.text(`Generado: ${new Date().toLocaleString()}`, margin, pageHeight - 15);
      
      // Número de página (derecha)
      const pageText = `Pagina ${i} de ${totalPages}`;
      const pageTextWidth = doc.getTextWidth(pageText);
      doc.text(pageText, pageWidth - margin - pageTextWidth, pageHeight - 15);
      
      // Información del cliente (centro)
      const clientText = clientName.toUpperCase();
      const clientTextWidth = doc.getTextWidth(clientText);
      doc.text(clientText, (pageWidth - clientTextWidth) / 2, pageHeight - 15);
    }

    // ✅ GUARDAR PDF
    const pdfBlob = doc.output('blob');
const fileName = `reporte_mantenimiento_${new Date().toISOString().slice(0, 10)}.pdf`;
const formData = new FormData();

formData.append('pdf', pdfBlob, fileName);
formData.append('numero_habitacion', document.getElementById('numero_habitacion').value || '');
formData.append('nombre_cliente', document.getElementById('client-name').value || '');
formData.append('fecha_servicio', document.getElementById('service-date').value || '');
formData.append('nombre_archivo', fileName);

// Enviar al servidor
fetch('../php/guardar_pdf_mantenimiento.php', {
  method: 'POST',
  body: formData
})
.then(response => response.text())
.then(result => {
  alert('✅ Reporte generado y guardado correctamente.');
  console.log(result);
})
.catch(error => {
  console.error('❌ Error al guardar:', error);
  alert('Error al guardar el reporte.');
});

    
  } catch (error) {
    console.error("Error al generar el reporte:", error);
    alert("Hubo un error al generar el PDF.");
  }


}
