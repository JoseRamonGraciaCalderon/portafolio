// Script para verificar y corregir los IDs de las secciones
document.addEventListener('DOMContentLoaded', function() {
  console.log('SectionIDs script loaded');
  
  // Obtener el idioma actual de la página
  const htmlLang = document.documentElement.lang || 'es';
  console.log('Current language:', htmlLang);
  
  // Mapeo de IDs de secciones según el idioma
  const sectionIdMap = {
    'es': {
      'sobre-mi': 'sobre-mi',
      'experiencia': 'experiencia',
      'proyectos': 'proyectos',
      'habilidades': 'habilidades',
      'contacto': 'contacto'
    },
    'en': {
      'sobre-mi': 'about-me',
      'experiencia': 'experience',
      'proyectos': 'projects',
      'habilidades': 'skills',
      'contacto': 'contact'
    }
  };
  
  // Verificar y corregir los IDs de las secciones
  const sections = document.querySelectorAll('section');
  console.log('Found sections:', sections.length);
  
  sections.forEach(section => {
    const currentId = section.id;
    console.log('Section with ID:', currentId);
    
    // Si la sección tiene un ID que está en nuestro mapeo, asegurarse de que sea correcto para el idioma actual
    for (const [esId, enId] of Object.entries(sectionIdMap.es).map((entry, i) => [entry[0], Object.values(sectionIdMap.en)[i]])) {
      if (currentId === esId || currentId === enId) {
        const correctId = htmlLang === 'es' ? esId : enId;
        if (currentId !== correctId) {
          console.log(`Correcting section ID from ${currentId} to ${correctId}`);
          section.id = correctId;
        }
      }
    }
  });
  
  // Verificar y corregir los enlaces de navegación
  const navLinks = document.querySelectorAll('a[href^="#"]');
  console.log('Found navigation links:', navLinks.length);
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href').substring(1); // Quitar el #
    console.log('Link with href:', href);
    
    // Si el enlace apunta a un ID que está en nuestro mapeo, asegurarse de que sea correcto para el idioma actual
    for (const [esId, enId] of Object.entries(sectionIdMap.es).map((entry, i) => [entry[0], Object.values(sectionIdMap.en)[i]])) {
      if (href === esId || href === enId) {
        const correctId = htmlLang === 'es' ? esId : enId;
        if (href !== correctId) {
          console.log(`Correcting link href from #${href} to #${correctId}`);
          link.setAttribute('href', `#${correctId}`);
        }
      }
    }
  });
  
  // Imprimir información de depuración sobre las secciones y enlaces
  console.log('Section IDs after correction:');
  document.querySelectorAll('section[id]').forEach(section => {
    console.log(`- ${section.id}`);
  });
  
  console.log('Navigation links after correction:');
  navLinks.forEach(link => {
    console.log(`- ${link.getAttribute('href')}`);
  });
});
