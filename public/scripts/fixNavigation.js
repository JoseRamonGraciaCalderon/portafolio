// Script para arreglar la navegación a las secciones
document.addEventListener('DOMContentLoaded', function() {
  console.log('Navigation fix script loaded');
  
  // Función para manejar el desplazamiento suave
  function smoothScroll(targetId) {
    console.log('Scrolling to:', targetId);
    
    // Obtener el elemento de destino
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      console.log('Target element found:', targetElement);
      
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
    } else {
      console.log('Target element not found:', targetId);
    }
  }
  
  // Manejar clics en enlaces de navegación
  const navLinks = document.querySelectorAll('a[href^="#"]');
  console.log('Found navigation links:', navLinks.length);
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      console.log('Link clicked with target:', targetId);
      smoothScroll(targetId);
    });
  });
  
  // Ajustar el scroll-margin-top de las secciones
  const sections = document.querySelectorAll('section[id]');
  const header = document.querySelector('.header');
  const headerHeight = header ? header.offsetHeight : 0;
  
  sections.forEach(section => {
    section.style.scrollMarginTop = (headerHeight + 20) + 'px';
    console.log('Set scroll-margin-top for section:', section.id);
  });
  
  // Manejar la navegación cuando se carga la página con un hash en la URL
  if (window.location.hash) {
    console.log('Initial hash detected:', window.location.hash);
    setTimeout(() => {
      smoothScroll(window.location.hash);
    }, 500);
  }
});
