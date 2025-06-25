// Función para guardar como borrador
async function saveAsDraft() {
  const data = {
    personal: {
      nombre: document.getElementById('staff-name')?.value || '',
      hotel: document.getElementById('property-name')?.value || '',
      habitacion: document.getElementById('room-number')?.value || '',
      fecha: document.getElementById('service-date')?.value || '',
      hora_inicio: document.getElementById('service-time')?.value || ''
    },
    pasos: []
  };

  const secciones = document.querySelectorAll('.process-section');
  
  for (let sectionIndex = 0; sectionIndex < secciones.length; sectionIndex++) {
    const section = secciones[sectionIndex];
    const titulo = section.querySelector('.section-title')?.innerText.trim() || `Paso ${sectionIndex + 1}`;
    
    // Recopilar checklist
    const checklist = [];
    section.querySelectorAll('.checklist-item').forEach(item => {
      const texto = item.querySelector('.checklist-text')?.innerText || '';
      const completado = item.classList.contains('completed');
      checklist.push({ texto, completado });
    });

    // Recopilar observaciones
    const observacion = section.querySelector('textarea')?.value || '';

    // Procesar imágenes y convertirlas a base64
    const fotos = [];
    const fileInputs = section.querySelectorAll('input[type="file"]');
    
    for (let i = 0; i < fileInputs.length; i++) {
      const input = fileInputs[i];
      if (input.files && input.files.length > 0) {
        try {
          const imageData = await getImageDataURL(input);
          if (imageData) {
            fotos.push({
              nombre: input.files[0].name,
              data: imageData,
              inputId: input.id || `file-${sectionIndex}-${i}`
            });
          }
        } catch (error) {
          console.error('Error procesando imagen:', error);
        }
      }
    }

    // Recopilar datos específicos de cada sección
    const datosEspecificos = {};
    
    // Para sección de amenidades (índice 6)
    if (sectionIndex === 6) {
      const towelInput = section.querySelector('#towel-count') || section.querySelector('input[id*="towel"]');
      const waterInput = section.querySelector('#water-bottles') || section.querySelector('input[id*="water"]');
      const otherInput = section.querySelector('#other-amenities') || section.querySelector('textarea[id*="other"]');
      
      datosEspecificos.amenidades = {
        toallas: towelInput?.value || '',
        agua: waterInput?.value || '',
        otras: otherInput?.value || ''
      };
    }
    
    // Para sección de inspección final (índice 7)
    if (sectionIndex === 7) {
      const statusInput = section.querySelector('#final-status') || section.querySelector('select[id*="status"]');
      const readyInput = section.querySelector('#room-ready') || section.querySelector('select[id*="ready"]');
      
      datosEspecificos.inspeccionFinal = {
        estado: statusInput?.value || '',
        estadoTexto: statusInput?.options?.[statusInput.selectedIndex]?.text || '',
        listo: readyInput?.value || '',
        listoTexto: readyInput?.options?.[readyInput.selectedIndex]?.text || ''
      };
    }
    
    // Para sección de registro final (índice 8)
    if (sectionIndex === 8) {
      const endTimeInput = section.querySelector('#end-time') || section.querySelector('input[id*="end"]');
      const durationInput = section.querySelector('#service-duration') || section.querySelector('input[id*="duration"]');
      const techNameInput = section.querySelector('#technician-name') || section.querySelector('input[id*="technician"]');
      
      datosEspecificos.registroFinal = {
        horaFin: endTimeInput?.value || '',
        duracion: durationInput?.value || '',
        nombreTecnico: techNameInput?.value || ''
      };
    }

    data.pasos.push({
      titulo,
      checklist,
      observaciones: observacion,
      fotos,
      datosEspecificos
    });
  }

  // Guardar firma como base64
  const canvas = document.getElementById('signature-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasSignature = imageData.data.some(channel => channel !== 0);
    
    if (hasSignature) {
      data.firma = canvas.toDataURL('image/png');
    }
  }

  // Guardar en localStorage
  try {
    const jsonString = JSON.stringify(data);
    localStorage.setItem('borradorHabitaciones', jsonString);
    alert('Borrador guardado correctamente.');
  } catch (error) {
    console.error('Error guardando borrador:', error);
    alert('Error al guardar el borrador. Los datos pueden ser demasiado grandes.');
  }
}

// Función mejorada para convertir archivo a base64
function getImageDataURL(input) {
  return new Promise((resolve, reject) => {
    if (!input || !input.files || input.files.length === 0) {
      return resolve(null);
    }

    const file = input.files[0];
    
    // Verificar que es una imagen
    if (!file.type.startsWith('image/')) {
      console.warn('El archivo no es una imagen:', file.name);
      return resolve(null);
    }

    const reader = new FileReader();
    
    reader.onload = function(e) {
      // Crear una imagen para redimensionar si es necesario
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calcular dimensiones manteniendo aspect ratio
        let { width, height } = img;
        const maxWidth = 800;
        const maxHeight = 600;
        
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (width > height) {
            width = maxWidth;
            height = maxWidth / aspectRatio;
          } else {
            height = maxHeight;
            width = maxHeight * aspectRatio;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a base64 con calidad reducida
        const compressedDataURL = canvas.toDataURL('image/jpeg', 0.8);
        resolve(compressedDataURL);
      };
      
      img.onerror = () => {
        console.error('Error cargando imagen');
        resolve(null);
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      console.error('Error leyendo archivo');
      reject(new Error('Error leyendo archivo'));
    };
    
    reader.readAsDataURL(file);
  });
}

// Función para generar el reporte PDF con estilo profesional mejorado
async function generateReport() {
  const borrador = localStorage.getItem('borradorHabitaciones');
  if (!borrador) {
    alert('No hay borrador guardado.');
    return;
  }

  let data;
  try {
    data = JSON.parse(borrador);
  } catch (error) {
    console.error('Error parseando datos:', error);
    alert('Error al leer los datos guardados.');
    return;
  }

  // Crear documento PDF
  const doc = new jspdf.jsPDF();
  let y = 20;
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);

  // Definir colores
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

  // Función para agregar nueva página si es necesario
  function checkPageBreak(requiredSpace = 20) {
    if (y + requiredSpace > pageHeight - 40) {
      doc.addPage();
      y = 30;
      return true;
    }
    return false;
  }

  // Función para dividir texto largo con mejor formato
  function addWrappedText(text, x, yPos, maxWidth, fontSize = 10, fontStyle = 'normal') {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    const lines = doc.splitTextToSize(text, maxWidth);
    
    for (let i = 0; i < lines.length; i++) {
      checkPageBreak();
      doc.text(lines[i], x, yPos);
      yPos += fontSize * 0.7;
    }
    return yPos;
  }

  // Función para crear sección con fondo
  function createSection(title, yPos, backgroundColor = colors.lighter) {
    checkPageBreak(25);
    
    // Fondo de la sección
    setFillColor(backgroundColor);
    drawRect(margin, yPos - 8, maxWidth, 20, true);
    
    // Título de la sección
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    setColor(colors.secondary);
    doc.text(title, margin + 5, yPos + 5);
    
    return yPos + 18;
  }

  // === ENCABEZADO PROFESIONAL ===
  // Fondo del encabezado
  setFillColor(colors.primary);
  drawRect(0, 0, pageWidth, 45, true);
  
  // Título principal
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  const title = 'REPORTE DE LIMPIEZA DE HABITACION';
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleWidth) / 2, 25);
  
  // Línea decorativa
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(1);
  drawLine(margin, 35, pageWidth - margin, 35);
  
  y = 60;

  // === INFORMACIÓN PERSONAL ===
  y = createSection('INFORMACION DEL SERVICIO', y, colors.light);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  setColor(colors.text);
  
  const personalInfo = [
    { label: 'Personal:', value: data.personal.nombre || 'N/A' },
    { label: 'Hotel:', value: data.personal.hotel || 'N/A' },
    { label: 'Habitacion:', value: data.personal.habitacion || 'N/A' },
    { label: 'Fecha:', value: data.personal.fecha || 'N/A' },
    { label: 'Hora de inicio:', value: data.personal.hora_inicio || 'N/A' }
  ];

  personalInfo.forEach(info => {
    checkPageBreak();
    doc.setFont('helvetica', 'bold');
    doc.text(info.label, margin + 5, y);
    doc.setFont('helvetica', 'normal');
    doc.text(info.value, margin + 45, y);
    y += 8;
  });

  y += 15;

  // === PROCESAR CADA PASO ===
  for (let i = 0; i < data.pasos.length; i++) {
    const paso = data.pasos[i];
    
    checkPageBreak(40);
    
    // Título del paso con numeración
    y = createSection(`${i + 1}. ${paso.titulo.toUpperCase()}`, y, colors.light);

    // === CHECKLIST ===
    if (paso.checklist && paso.checklist.length > 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      setColor(colors.secondary);
      doc.text('Lista de Verificacion:', margin + 5, y);
      y += 10;
      
      doc.setFont('helvetica', 'normal');
      
      paso.checklist.forEach(item => {
        checkPageBreak();
        
        // Checkbox estilizado
        const checkboxX = margin + 10;
        const checkboxY = y - 4;
        const checkboxSize = 4;
        
        // Dibujar cuadro
        doc.setDrawColor(100, 100, 100);
        doc.setLineWidth(0.5);
        drawRect(checkboxX, checkboxY, checkboxSize, checkboxSize);
        
        // Rellenar si está completado
        if (item.completado) {
          setFillColor(colors.success);
          drawRect(checkboxX + 0.5, checkboxY + 0.5, checkboxSize - 1, checkboxSize - 1, true);
          
          // Marca de verificación
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          setColor([255, 255, 255]);
          doc.text('X', checkboxX + 1, checkboxY + 3);
        }
        
        // Texto del item
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        setColor(item.completado ? colors.success : colors.danger);
        
        const textLines = doc.splitTextToSize(item.texto, maxWidth - 30);
        textLines.forEach((line, index) => {
          doc.text(line, checkboxX + 8, y + (index * 6));
        });
        
        y += Math.max(6, textLines.length * 6);
      });
      y += 8;
    }

    // === OBSERVACIONES ===
    if (paso.observaciones && paso.observaciones.trim()) {
      checkPageBreak(20);
      
      // Fondo amarillo claro para observaciones
      setFillColor([255, 252, 230]);
      const obsHeight = doc.splitTextToSize(paso.observaciones, maxWidth - 20).length * 6 + 16;
      drawRect(margin + 5, y - 5, maxWidth - 10, obsHeight, true);
      
      // Borde
      doc.setDrawColor(...colors.warning);
      doc.setLineWidth(1);
      drawRect(margin + 5, y - 5, maxWidth - 10, obsHeight);
      
      // Título
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      setColor(colors.secondary);
      doc.text('OBSERVACIONES:', margin + 10, y + 5);
      y += 12;
      
      // Contenido
      doc.setFont('helvetica', 'italic');
      setColor([120, 120, 120]);
      y = addWrappedText(paso.observaciones, margin + 10, y, maxWidth - 20, 10, 'italic');
      y += 10;
    }

    // === FOTOS ===
    if (paso.fotos && paso.fotos.length > 0) {
      for (let j = 0; j < paso.fotos.length; j++) {
        const foto = paso.fotos[j];
        
        if (foto.data) {
          checkPageBreak(80);
          
          try {
            // Fondo para la imagen
            setFillColor(colors.lighter);
            drawRect(margin + 5, y - 5, maxWidth - 10, 90, true);
            
            // Título de la foto
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            setColor(colors.secondary);
            doc.text(`IMAGEN: ${foto.nombre}`, margin + 10, y + 5);
            y += 12;
            
            // Insertar imagen centrada
            const imgWidth = 90;
            const imgHeight = 68;
            const imgX = (pageWidth - imgWidth) / 2;
            
            // Borde de la imagen
            doc.setDrawColor(...colors.secondary);
            doc.setLineWidth(1);
            drawRect(imgX - 2, y - 2, imgWidth + 4, imgHeight + 4);
            
            doc.addImage(foto.data, 'JPEG', imgX, y, imgWidth, imgHeight);
            y += imgHeight + 15;
            
          } catch (error) {
            console.error('Error insertando imagen:', error);
            checkPageBreak();
            setColor(colors.danger);
            doc.text(`(Error al cargar imagen: ${foto.nombre})`, margin + 10, y);
            y += 8;
          }
        }
      }
    }

    // === INFORMACIÓN ESPECÍFICA POR SECCIÓN (USANDO DATOS GUARDADOS) ===
    
    // Paso 7: Reabastecimiento de Amenidades (índice 6)
    if (i === 6 && paso.datosEspecificos?.amenidades) {
      const amenidades = paso.datosEspecificos.amenidades;
      
      // Solo mostrar si hay datos
      if (amenidades.toallas || amenidades.agua || amenidades.otras) {
        y = createSection('INVENTARIO DE AMENIDADES', y, [230, 245, 255]);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        setColor(colors.text);
        
        const amenidadesInfo = [
          { label: 'Numero de Toallas:', value: amenidades.toallas || 'N/A' },
          { label: 'Botellas de Agua:', value: amenidades.agua || 'N/A' },
          { label: 'Otras Amenidades:', value: amenidades.otras || 'N/A' }
        ];
        
        amenidadesInfo.forEach(item => {
          checkPageBreak();
          doc.setFont('helvetica', 'bold');
          doc.text(item.label, margin + 10, y);
          doc.setFont('helvetica', 'normal');
          doc.text(item.value, margin + 70, y);
          y += 8;
        });
        y += 10;
      }
    }

    // Paso 8: Inspección Final (índice 7)
    if (i === 7 && paso.datosEspecificos?.inspeccionFinal) {
      const inspeccion = paso.datosEspecificos.inspeccionFinal;
      
      // Solo mostrar si hay datos
      if (inspeccion.estado || inspeccion.listo) {
        y = createSection('ESTADO FINAL DE LA HABITACION', y, [240, 255, 240]);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        setColor(colors.text);
        
        const estadoFinal = [
          { label: 'Estado General:', value: inspeccion.estadoTexto || inspeccion.estado || 'N/A' },
          { label: 'Habitacion Lista:', value: inspeccion.listoTexto || inspeccion.listo || 'N/A' }
        ];
        
        estadoFinal.forEach(item => {
          checkPageBreak();
          doc.setFont('helvetica', 'bold');
          doc.text(item.label, margin + 10, y);
          doc.setFont('helvetica', 'normal');
          doc.text(item.value, margin + 70, y);
          y += 8;
        });
        y += 10;
      }
    }

    // Paso 9: Registro del Servicio (índice 8)
    if (i === 8 && paso.datosEspecificos?.registroFinal) {
      const registro = paso.datosEspecificos.registroFinal;
      
      // Solo mostrar si hay datos
      if (registro.horaFin || registro.duracion || registro.nombreTecnico) {
        y = createSection('INFORMACION DE FINALIZACION', y, [255, 245, 235]);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        setColor(colors.text);
        
        const infoFinal = [
          { label: 'Hora de Finalizacion:', value: registro.horaFin || 'N/A' },
          { label: 'Duracion Total:', value: registro.duracion || 'N/A' },
          { label: 'Nombre del Personal:', value: registro.nombreTecnico || data.personal.nombre || 'N/A' }
        ];
        
        infoFinal.forEach(item => {
          checkPageBreak();
          doc.setFont('helvetica', 'bold');
          doc.text(item.label, margin + 10, y);
          doc.setFont('helvetica', 'normal');
          doc.text(item.value, margin + 80, y);
          y += 8;
        });
        y += 10;
      }
    }

    // Evitar agregar espacio extra si estamos en el paso 8 (registro final)
if (i !== 8) {
  y += 15;
}

  }

  // === FIRMA ===
  if (data.firma) {
    checkPageBreak(80);
    
    y = createSection('FIRMA DEL CLIENTE', y, colors.light);
    
    try {
      // Marco para la firma
      const signatureWidth = 120;
      const signatureHeight = 60;
      const signatureX = (pageWidth - signatureWidth) / 2;
      
      doc.setDrawColor(...colors.secondary);
      doc.setLineWidth(2);
      drawRect(signatureX - 5, y - 5, signatureWidth + 10, signatureHeight + 15);
      
      doc.addImage(data.firma, 'PNG', signatureX, y, signatureWidth, signatureHeight);
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

  // === PIE DE PÁGINA PROFESIONAL ===
  const totalPages = doc.internal.getNumberOfPages();
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
    
    // Información del hotel (centro)
    if (data.personal.hotel) {
      const hotelText = data.personal.hotel.toUpperCase();
      const hotelTextWidth = doc.getTextWidth(hotelText);
      doc.text(hotelText, (pageWidth - hotelTextWidth) / 2, pageHeight - 15);
    }
  }

  // Guardar el PDF
  const fileName = `reporte-habitacion-${data.personal.habitacion || 'sin-numero'}-${new Date().toISOString().slice(0, 10)}.pdf`;
  // Convertir el PDF a blob
const pdfBlob = doc.output('blob');

// Crear FormData con PDF y datos
const formData = new FormData();
formData.append('pdf', pdfBlob, fileName);
formData.append('nombre_personal', data.personal.nombre || '');
formData.append('nombre_hotel', data.personal.hotel || '');
formData.append('numero_habitacion', data.personal.habitacion || '');
formData.append('fecha_servicio', data.personal.fecha || '');
formData.append('hora_inicio', data.personal.hora_inicio || '');
formData.append('nombre_archivo', fileName);

// Enviar al servidor
fetch('../php/guardar_pdf_habitaciones.php', {
  method: 'POST',
  body: formData
})
.then(response => response.text())
.then(result => {
  alert('✅ PDF generado y datos guardados en la base de datos.');
  console.log(result);
})
.catch(error => {
  console.error('❌ Error al guardar:', error);
  alert('Error al guardar el PDF.');
});

}