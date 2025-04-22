// Script principal para la página
document.addEventListener('DOMContentLoaded', function() {
  // Buscar el botón de descarga de CV
  const downloadBtn = document.getElementById('download-cv-btn');
  
  if (downloadBtn) {
    // Añadir evento de clic
    downloadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Cambiar el texto del botón para indicar que se está descargando
      const originalContent = downloadBtn.innerHTML;
      downloadBtn.innerHTML = '<div class="btn-content"><span class="code-syntax">downloading</span><span class="code-syntax">()</span><span class="code-string">...</span></div>';
      downloadBtn.style.pointerEvents = 'none';
      
      // Crear un iframe oculto
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = '/cv.html';
      document.body.appendChild(iframe);
      
      // Esperar a que el iframe cargue
      iframe.onload = function() {
        setTimeout(function() {
          try {
            // Intentar generar el PDF usando la función expuesta por el iframe
            if (iframe.contentWindow && iframe.contentWindow.generatePDF) {
              iframe.contentWindow.generatePDF();
              
              // Restaurar el botón después de un tiempo
              setTimeout(function() {
                downloadBtn.innerHTML = originalContent;
                downloadBtn.style.pointerEvents = 'auto';
                
                // Mostrar mensaje de éxito
                showNotification('CV descargado correctamente', 'success');
              }, 2000);
            } else {
              // Si no podemos acceder a la función, redirigir al usuario
              window.location.href = '/cv.html';
            }
          } catch (error) {
            console.error('Error al generar el PDF:', error);
            
            // Restaurar el botón
            downloadBtn.innerHTML = originalContent;
            downloadBtn.style.pointerEvents = 'auto';
            
            // Redirigir al usuario a la página del CV
            window.location.href = '/cv.html';
          }
        }, 1000);
      };
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
