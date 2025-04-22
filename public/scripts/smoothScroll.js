// Script mejorado para manejar el desplazamiento suave a las secciones
document.addEventListener('DOMContentLoaded', function() {
  console.log('SmoothScroll script loaded');

  // Ajustar el scroll-margin-top de las secciones según la altura del header
  function adjustSectionMargins() {
    const header = document.querySelector('.header');
    if (header) {
      const headerHeight = header.offsetHeight;
      const sections = document.querySelectorAll('section[id]');

      sections.forEach(section => {
        section.style.scrollMarginTop = (headerHeight + 20) + 'px';
        console.log('Adjusted section margin for:', section.id);
      });
    }
  }

  // Llamar a la función al cargar la página
  adjustSectionMargins();

  // También ajustar cuando cambie el tamaño de la ventana
  window.addEventListener('resize', adjustSectionMargins);

  // Función para manejar el desplazamiento suave
  function smoothScroll(targetId) {
    console.log('Attempting to scroll to:', targetId);

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
    console.log('Target element found:', targetElement);

    // Si el elemento existe, desplazarse hasta él
    if (targetElement) {
      // Obtener la altura del header para compensar
      const header = document.querySelector('.header');
      const headerHeight = header ? header.offsetHeight : 0;
      console.log('Header height:', headerHeight);

      // Calcular la posición de desplazamiento
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = targetPosition - headerHeight - 20; // 20px de margen adicional
      console.log('Scrolling to position:', offsetPosition);

      // Desplazarse a la posición calculada
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Actualizar la URL con el hash (opcional)
      history.pushState(null, null, targetId);
    }
  }

  // Seleccionar todos los enlaces que comienzan con # (enlaces internos)
  const links = document.querySelectorAll('a[href^="#"]');
  console.log('Found navigation links:', links.length);

  // Añadir evento de clic a cada enlace
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      // Prevenir el comportamiento predeterminado
      e.preventDefault();

      // Obtener el ID de la sección de destino
      const targetId = this.getAttribute('href');
      console.log('Link clicked with target:', targetId);

      // Usar la función de desplazamiento suave
      smoothScroll(targetId);
    });
  });

  // Manejar la navegación cuando se carga la página con un hash en la URL
  if (window.location.hash) {
    console.log('Initial hash detected:', window.location.hash);
    // Esperar un momento para que la página se cargue completamente
    setTimeout(() => {
      smoothScroll(window.location.hash);
    }, 500);
  }
});
