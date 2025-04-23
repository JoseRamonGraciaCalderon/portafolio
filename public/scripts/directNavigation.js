// Script para navegación directa a secciones
document.addEventListener('DOMContentLoaded', function() {
  console.log('Direct navigation script loaded');
  
  // Obtener todos los enlaces de navegación
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  // Añadir evento de clic a cada enlace
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Prevenir el comportamiento predeterminado
      e.preventDefault();
      
      // Obtener el href original (con la expresión JavaScript)
      const originalHref = this.getAttribute('href');
      console.log('Original href:', originalHref);
      
      // Extraer el ID de la sección de destino
      let targetId;
      
      // Si el href contiene código JavaScript, extraer el ID manualmente
      if (originalHref.includes('?')) {
        // Determinar el idioma actual
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
        
        // Intentar determinar la sección por el texto del enlace o atributos de datos
        let section = '';
        
        // Verificar si hay un atributo data-section
        if (this.hasAttribute('data-section')) {
          section = this.getAttribute('data-section');
        } 
        // Intentar determinar por el texto del enlace
        else {
          const linkText = this.textContent.toLowerCase();
          if (linkText.includes('sobre') || linkText.includes('about')) section = 'about';
          else if (linkText.includes('exper')) section = 'experience';
          else if (linkText.includes('proyec') || linkText.includes('project')) section = 'projects';
          else if (linkText.includes('habil') || linkText.includes('skill')) section = 'skills';
          else if (linkText.includes('contact')) section = 'contact';
        }
        
        // Si se encontró una sección, usar el ID correspondiente
        if (section && sectionMap[section]) {
          targetId = '#' + sectionMap[section];
          console.log('Determined section:', section, 'Target ID:', targetId);
        } else {
          // Si no se pudo determinar, usar el primer ID después del #
          const match = originalHref.match(/#([^'"}]+)/);
          targetId = match ? '#' + match[1] : '#';
          console.log('Using fallback target ID:', targetId);
        }
      } else {
        // Si el href es un ID normal, usarlo directamente
        targetId = originalHref;
        console.log('Using direct target ID:', targetId);
      }
      
      // Buscar el elemento de destino
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
        console.log('Target element not found for ID:', targetId);
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
});
