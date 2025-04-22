// Script para descargar el CV directamente
document.addEventListener('DOMContentLoaded', function() {
  // Buscar el botón de descarga de CV
  const downloadBtn = document.getElementById('download-cv-btn');
  
  if (downloadBtn) {
    // Añadir evento de clic
    downloadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      downloadCV();
    });
  }
  
  // Función para descargar el CV
  async function downloadCV() {
    try {
      // Cambiar el texto del botón para indicar que se está descargando
      const originalContent = downloadBtn.innerHTML;
      downloadBtn.innerHTML = '<div class="btn-content"><span class="code-syntax">downloading</span><span class="code-syntax">()</span><span class="code-string">...</span></div>';
      downloadBtn.style.pointerEvents = 'none';
      
      // Cargar las bibliotecas necesarias
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
      
      // Crear un iframe oculto para cargar el CV
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.top = '-9999px';
      iframe.style.width = '210mm'; // Ancho A4
      iframe.style.height = '297mm'; // Alto A4
      document.body.appendChild(iframe);
      
      // Cargar el HTML del CV en el iframe
      iframe.src = '/cv.html';
      
      // Esperar a que el iframe cargue
      await new Promise(resolve => {
        iframe.onload = resolve;
      });
      
      // Acceder al contenido del iframe
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      const cvContainer = iframeDocument.querySelector('.container');
      
      // Ocultar el botón de impresión en el iframe
      const printButton = iframeDocument.querySelector('.print-button');
      if (printButton) {
        printButton.style.display = 'none';
      }
      
      // Configurar jsPDF
      const { jsPDF } = window.jspdf;
      
      // Crear un nuevo documento PDF en formato A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Obtener las dimensiones del PDF
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Convertir el HTML a canvas
      const canvas = await html2canvas(cvContainer, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      // Convertir el canvas a imagen
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Calcular las dimensiones para ajustar la imagen al PDF
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      // Añadir la imagen al PDF
      pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Guardar el PDF
      pdf.save('Ramon_Gracia_CV.pdf');
      
      // Limpiar
      document.body.removeChild(iframe);
      
      // Restaurar el botón
      downloadBtn.innerHTML = originalContent;
      downloadBtn.style.pointerEvents = 'auto';
      
      // Mostrar mensaje de éxito
      showNotification('CV descargado correctamente', 'success');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      
      // Restaurar el botón
      downloadBtn.innerHTML = originalContent;
      downloadBtn.style.pointerEvents = 'auto';
      
      // Mostrar mensaje de error
      showNotification('Error al generar el PDF. Intentando descarga alternativa...', 'error');
      
      // Intentar descarga directa como fallback
      setTimeout(() => {
        window.location.href = '/cv.pdf';
      }, 1000);
    }
  }
  
  // Función para cargar scripts dinámicamente
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      // Verificar si el script ya está cargado
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  // Función para mostrar notificaciones
  function showNotification(message, type) {
    // Crear el elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Estilos para la notificación
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.color = 'white';
    notification.style.fontFamily = 'Consolas, Monaco, monospace';
    notification.style.zIndex = '9999';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    
    // Establecer el color de fondo según el tipo
    if (type === 'success') {
      notification.style.backgroundColor = '#4CAF50';
    } else {
      notification.style.backgroundColor = '#F44336';
    }
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Mostrar la notificación
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 10);
    
    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
});
