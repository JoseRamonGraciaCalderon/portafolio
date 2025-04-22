// Script para descargar directamente el CV sin mostrar el HTML
document.addEventListener('DOMContentLoaded', function() {
  // Buscar el botón de descarga de CV
  const downloadBtn = document.getElementById('download-cv-btn');

  if (downloadBtn) {
    // Reemplazar el enlace original
    downloadBtn.href = 'javascript:void(0)';

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
      document.body.appendChild(iframe);

      // Función para mostrar notificaciones
      function showNotification(message, type) {
        // Crear el elemento de notificación
        const notification = document.createElement('div');
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

      // Método 1: Intentar descargar directamente el PDF estático
      const link = document.createElement('a');
      link.href = '/CV_Ramon_Gracia_Desarrollador_Web.pdf';
      link.download = 'CV_Ramon_Gracia_Desarrollador_Web.pdf';
      link.style.display = 'none';
      document.body.appendChild(link);

      // Intentar descargar
      link.click();

      // Restaurar el botón después de un tiempo
      setTimeout(function() {
        downloadBtn.innerHTML = originalContent;
        downloadBtn.style.pointerEvents = 'auto';
        document.body.removeChild(link);

        // Mostrar mensaje de éxito
        showNotification('CV descargado correctamente', 'success');
      }, 2000);
    });
  }
});
