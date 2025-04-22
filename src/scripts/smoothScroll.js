// Script para manejar el desplazamiento suave a las secciones
document.addEventListener('DOMContentLoaded', function() {
  // Seleccionar todos los enlaces que comienzan con # (enlaces internos)
  const links = document.querySelectorAll('a[href^="#"]');
  
  // Añadir evento de clic a cada enlace
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      // Prevenir el comportamiento predeterminado
      e.preventDefault();
      
      // Obtener el ID de la sección de destino
      const targetId = this.getAttribute('href');
      
      // Si el ID es solo #, ir al inicio de la página
      if (targetId === '#') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }
      
      // Obtener el elemento de destino
      const targetElement = document.querySelector(targetId);
      
      // Si el elemento existe, desplazarse hasta él
      if (targetElement) {
        // Obtener la altura del header para compensar
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;
        
        // Calcular la posición de desplazamiento
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerHeight - 20; // 20px de margen adicional
        
        // Desplazarse a la posición calculada
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Actualizar la URL con el hash (opcional)
        history.pushState(null, null, targetId);
      }
    });
  });
  
  // Manejar la navegación cuando se carga la página con un hash en la URL
  if (window.location.hash) {
    // Esperar un momento para que la página se cargue completamente
    setTimeout(() => {
      const targetId = window.location.hash;
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;
        
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerHeight - 20;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 300);
  }
});
