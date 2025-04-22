// Script simple para navegación a secciones
document.addEventListener('DOMContentLoaded', function() {
  console.log('Simple navigation script loaded');

  // Mapeo de IDs según la sección y el idioma
  const sectionMap = {
    'es': {
      'about': 'sobre-mi',
      'experience': 'experiencia',
      'projects': 'proyectos',
      'skills': 'habilidades',
      'contact': 'contacto'
    },
    'en': {
      'about': 'about-me',
      'experience': 'experience',
      'projects': 'projects',
      'skills': 'skills',
      'contact': 'contact'
    }
  };

  // Función para detectar el idioma actual
  function getCurrentLanguage() {
    // Intentar obtener el idioma del atributo lang del HTML
    let htmlLang = document.documentElement.lang || '';

    // Si no está definido, intentar detectarlo por la URL
    if (!htmlLang) {
      const path = window.location.pathname;
      if (path.includes('/en/')) {
        htmlLang = 'en';
      } else {
        htmlLang = 'es'; // Idioma por defecto
      }
    }

    // Normalizar el idioma (solo queremos 'es' o 'en')
    htmlLang = htmlLang.startsWith('es') ? 'es' : 'en';

    console.log('Detected language:', htmlLang);
    return htmlLang;
  }

  // Función para obtener el ID de sección según el idioma actual
  function getSectionId(sectionName) {
    const htmlLang = getCurrentLanguage();
    return sectionMap[htmlLang][sectionName] || sectionName;
  }

  // Función para manejar el desplazamiento suave
  function smoothScroll(sectionName) {
    if (!sectionName) return;

    // Obtener el ID correcto según el idioma
    const sectionId = getSectionId(sectionName);
    console.log('Scrolling to section:', sectionName, 'with ID:', sectionId);

    // Intentar diferentes estrategias para encontrar el elemento
    let targetElement = null;

    // 1. Buscar por ID
    targetElement = document.getElementById(sectionId);

    // 2. Si no se encuentra, buscar por selector de sección
    if (!targetElement) {
      targetElement = document.querySelector(`section[id="${sectionId}"]`);
    }

    // 3. Intentar con ambos idiomas
    if (!targetElement) {
      const alternativeId = getCurrentLanguage() === 'es' ?
        sectionMap['en'][sectionName] : sectionMap['es'][sectionName];
      targetElement = document.getElementById(alternativeId);

      if (!targetElement) {
        targetElement = document.querySelector(`section[id="${alternativeId}"]`);
      }
    }

    // 4. Buscar por atributo data-section
    if (!targetElement) {
      targetElement = document.querySelector(`section[data-section="${sectionName}"]`);
    }

    // 5. Último recurso: buscar por clase
    if (!targetElement) {
      const classMap = {
        'about': '.about',
        'experience': '.experience',
        'projects': '.projects',
        'skills': '.skills',
        'contact': '.contact'
      };

      if (classMap[sectionName]) {
        targetElement = document.querySelector(classMap[sectionName]);
      }
    }

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
      console.log('Target element not found for section:', sectionName);

      // Intentar buscar cualquier sección como último recurso
      const sections = document.querySelectorAll('section');
      console.log('Available sections:', sections.length);
      sections.forEach(section => {
        console.log('Section ID:', section.id, 'Class:', section.className);
      });

      return false;
    }
  }

  // Ajustar los enlaces de navegación
  const navLinks = document.querySelectorAll('.nav-link');
  console.log('Found navigation links:', navLinks.length);

  navLinks.forEach(link => {
    // Obtener el atributo data-section
    const sectionName = link.getAttribute('data-section');

    if (sectionName) {
      // Reemplazar el href con un # simple
      link.setAttribute('href', '#');

      // Añadir evento de clic
      link.addEventListener('click', function(e) {
        e.preventDefault();
        smoothScroll(sectionName);
      });

      console.log('Updated link for section:', sectionName);
    }
  });

  // Ajustar los botones en el Hero
  const heroButtons = document.querySelectorAll('.hero-buttons a');
  console.log('Found hero buttons:', heroButtons.length);

  heroButtons.forEach(button => {
    // Obtener el atributo data-section
    const sectionName = button.getAttribute('data-section');

    if (sectionName) {
      // Reemplazar el href con un # simple
      button.setAttribute('href', '#');

      // Añadir evento de clic
      button.addEventListener('click', function(e) {
        e.preventDefault();
        smoothScroll(sectionName);
      });

      console.log('Updated hero button for section:', sectionName);
    }
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
