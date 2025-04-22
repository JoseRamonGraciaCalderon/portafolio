// Función para generar y descargar el PDF
async function generateAndDownloadPDF() {
  try {
    // Mostrar un indicador de carga
    const downloadBtn = document.getElementById('download-cv-btn');
    const originalContent = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<div class="btn-content"><span class="code-syntax">downloading</span><span class="code-syntax">()</span><span class="code-string">...</span></div>';
    downloadBtn.style.pointerEvents = 'none';
    downloadBtn.style.opacity = '0.7';

    // Cargar las bibliotecas necesarias dinámicamente
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');

    // Crear un iframe oculto para cargar el CV HTML
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
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
    
    // Generar el PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Usar html2canvas para convertir el contenido a una imagen
    const canvas = await html2canvas(cvContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 210 * 3.78, // Aproximadamente 210mm en píxeles
      windowHeight: 297 * 3.78 // Aproximadamente 297mm en píxeles
    });

    // Añadir la imagen al PDF
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

    // Descargar el PDF
    pdf.save('Ramon_Gracia_CV.pdf');

    // Limpiar
    document.body.removeChild(iframe);
    
    // Restaurar el botón
    downloadBtn.innerHTML = originalContent;
    downloadBtn.style.pointerEvents = 'auto';
    downloadBtn.style.opacity = '1';
    
    // Mostrar mensaje de éxito
    showToast('CV descargado correctamente');
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    
    // Restaurar el botón en caso de error
    const downloadBtn = document.getElementById('download-cv-btn');
    downloadBtn.innerHTML = '<div class="btn-content"><span class="code-syntax">download</span><span class="code-syntax">(</span><span class="code-string">"CV.pdf"</span><span class="code-syntax">)</span><span class="btn-tooltip">// Descargar mi CV</span></div>';
    downloadBtn.style.pointerEvents = 'auto';
    downloadBtn.style.opacity = '1';
    
    // Mostrar mensaje de error
    showToast('Error al generar el PDF. Intentando descarga alternativa...', 'error');
    
    // Intentar descarga directa como fallback
    setTimeout(() => {
      window.location.href = '/cv.pdf';
    }, 2000);
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

// Función para mostrar un toast de notificación
function showToast(message, type = 'success') {
  // Crear el elemento toast si no existe
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    document.body.appendChild(toast);
    
    // Estilos para el toast
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '4px';
    toast.style.fontFamily = 'Consolas, Monaco, monospace';
    toast.style.fontSize = '14px';
    toast.style.zIndex = '10000';
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }
  
  // Configurar el estilo según el tipo
  if (type === 'success') {
    toast.style.backgroundColor = '#4CAF50';
    toast.style.color = 'white';
  } else {
    toast.style.backgroundColor = '#F44336';
    toast.style.color = 'white';
  }
  
  // Establecer el mensaje
  toast.textContent = message;
  
  // Mostrar el toast
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 100);
  
  // Ocultar el toast después de 3 segundos
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 3000);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  const downloadBtn = document.getElementById('download-cv-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      generateAndDownloadPDF();
    });
  }
});
