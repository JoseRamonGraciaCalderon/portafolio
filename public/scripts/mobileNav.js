// Script para mejorar la navegación en dispositivos móviles
document.addEventListener('DOMContentLoaded', function() {
  console.log('MobileNav script loaded');

  // Obtener el menú móvil y el botón de menú
  const mobileMenu = document.querySelector('.nav-links');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const closeMenuBtn = document.querySelector('.close-menu-btn');

  console.log('Mobile menu elements:', { mobileMenu, mobileMenuBtn, closeMenuBtn });

  // Función para cerrar el menú móvil
  function closeMenu() {
    if (mobileMenu && mobileMenuBtn) {
      mobileMenu.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
      document.body.classList.remove('menu-open');
      console.log('Mobile menu closed');
    }
  }

  // Función para abrir/cerrar el menú móvil
  function toggleMenu() {
    if (mobileMenu && mobileMenuBtn) {
      mobileMenu.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
      document.body.classList.toggle('menu-open');
      console.log('Mobile menu toggled:', mobileMenu.classList.contains('active'));
    }
  }

  // Añadir evento de clic al botón del menú móvil
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // Evitar que el clic se propague
      toggleMenu();
    });
  }

  // Añadir evento de clic al botón de cierre
  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // Evitar que el clic se propague
      closeMenu();
    });
  }

  // Obtener todos los enlaces de navegación
  const navLinks = document.querySelectorAll('.nav-links a');
  console.log('Navigation links found:', navLinks.length);

  // Añadir evento de clic a cada enlace de navegación
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Cerrar el menú móvil después de hacer clic en un enlace
      closeMenu();
      console.log('Nav link clicked, menu closed');
    });
  });

  // Cerrar menú al hacer clic fuera del menú
  document.addEventListener('click', function(e) {
    const target = e.target;
    if (mobileMenu && mobileMenu.classList.contains('active') &&
        !mobileMenu.contains(target) &&
        !mobileMenuBtn.contains(target)) {
      closeMenu();
      console.log('Clicked outside menu, menu closed');
    }
  });

  // Cerrar menú al presionar la tecla Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
      closeMenu();
      console.log('Escape key pressed, menu closed');
    }
  });
});
