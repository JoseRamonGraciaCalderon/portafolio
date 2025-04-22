// Script para navegación robusta a secciones
document.addEventListener('DOMContentLoaded', function() {
  console.log('Robust navigation script loaded');
  
  // Función para obtener el ID de sección según el idioma
  function getSectionId(section) {
    const htmlLang = document.documentElement.lang || 'es';
    console.log('Current language:', htmlLang);
    
    // Mapeo de IDs según la sección y el idioma
    const sectionMap = {
      'about': htmlLang === 'es' ? 'sobre-mi' : 'about-me',
      'experience': htmlLang === 'es' ? 'experiencia' : 'experience',
      'projects': htmlLang === 'es' ? 'proyectos' : 'projects',
      'skills': htmlLang === 'es' ? 'habilidades' : 'skills',
      'contact': htmlLang === 'es' ? 'contacto' : 'contact'
    };
    
    return sectionMap[section] || section;
  }
  
  // Función para manejar el desplazamiento suave
  function smoothScroll(targetId, sectionName) {
    console.log('Attempting to scroll to:', targetId, 'Section name:', sectionName);
    
    // Si tenemos un nombre de sección, intentar encontrar la sección por su ID según el idioma
    let targetElement = null;
    
    if (sectionName) {
      const sectionId = getSectionId(sectionName);
      targetElement = document.getElementById(sectionId);
      console.log('Looking for section by ID:', sectionId, 'Found:', targetElement);
    }
    
    // Si no se encontró por sección, intentar con el targetId directamente
    if (!targetElement && targetId && targetId !== '#') {
      // Limpiar el targetId (quitar el #)
      const cleanId = targetId.startsWith('#') ? targetId.substring(1) : targetId;
      targetElement = document.getElementById(cleanId);
      console.log('Looking for element by ID:', cleanId, 'Found:', targetElement);
      
      // Si aún no se encuentra, intentar con querySelector
      if (!targetElement) {
        targetElement = document.querySelector(targetId);
        console.log('Looking for element by selector:', targetId, 'Found:', targetElement);
      }
    }
    
    // Si se encontró un elemento, desplazarse hasta él
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
      
      return true;
    } else {
      console.log('Target element not found');
      return false;
    }
  }
  
  // Obtener todos los enlaces de navegación
  const navLinks = document.querySelectorAll('a[href^="#"]');
  console.log('Found navigation links:', navLinks.length);
  
  // Añadir evento de clic a cada enlace
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Prevenir el comportamiento predeterminado
      e.preventDefault();
      
      // Obtener el href original
      const originalHref = this.getAttribute('href');
      console.log('Link clicked with href:', originalHref);
      
      // Obtener el atributo data-section si existe
      const sectionName = this.hasAttribute('data-section') ? this.getAttribute('data-section') : null;
      
      // Intentar navegar a la sección
      const success = smoothScroll(originalHref, sectionName);
      
      // Si no se pudo navegar y el href contiene código JavaScript, intentar evaluarlo
      if (!success && originalHref.includes('?')) {
        try {
          // Extraer el código JavaScript del href
          const jsCode = originalHref.match(/#{(.+)}/)[1];
          console.log('Extracted JS code:', jsCode);
          
          // Evaluar el código JavaScript para obtener el ID
          const evaluatedId = '#' + eval(jsCode);
          console.log('Evaluated ID:', evaluatedId);
          
          // Intentar navegar con el ID evaluado
          smoothScroll(evaluatedId, sectionName);
        } catch (error) {
          console.error('Error evaluating href:', error);
        }
      }
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
      smoothScroll(window.location.hash, null);
    }, 500);
  }
});
