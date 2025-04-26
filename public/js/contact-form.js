// Script para manejar el envío del formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
  // Verificar si EmailJS está disponible
  const checkEmailJS = function() {
    if (typeof emailjs === 'undefined') {
      console.warn('EmailJS aún no está disponible, reintentando en 500ms...');
      setTimeout(checkEmailJS, 500);
      return false;
    }
    return true;
  };

  const contactForm = document.getElementById('contact-form');
  const submitButton = document.getElementById('submit-button');
  const formStatus = document.getElementById('form-status');

  if (!contactForm || !submitButton || !formStatus) {
    console.warn('Elementos del formulario no encontrados');
    return;
  }

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Verificar si EmailJS está disponible
    if (!checkEmailJS()) {
      console.error('EmailJS no está disponible');
      formStatus.textContent = 'Error: El servicio de correo no está disponible';
      formStatus.classList.add('visible', 'error');
      return;
    }

    // Cambiar el estado del botón
    submitButton.disabled = true;
    submitButton.classList.add('sending');

    // Obtener los datos del formulario
    const formData = new FormData(contactForm);
    const formDataObj = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });

    try {
      // Mostrar mensaje de carga
      formStatus.textContent = formStatus.getAttribute('data-sending');
      formStatus.classList.add('visible', 'info');

      console.log('Enviando correo con los datos:', formDataObj);

      // Enviar los datos usando EmailJS
      await emailjs.send(
        'service_contact', // Reemplazar con tu Service ID
        'template_contact', // Reemplazar con tu Template ID
        {
          name: formDataObj.name,
          email: formDataObj.email,
          subject: formDataObj.subject,
          message: formDataObj.message
        }
      );

      console.log('Correo enviado con éxito');

      // Mostrar mensaje de éxito
      formStatus.textContent = formStatus.getAttribute('data-success');
      formStatus.classList.remove('info');
      formStatus.classList.add('success');

      // Limpiar el formulario
      contactForm.reset();

      // Ocultar el mensaje después de 5 segundos
      setTimeout(() => {
        formStatus.classList.remove('visible');
      }, 5000);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);

      // Mostrar mensaje de error
      formStatus.textContent = formStatus.getAttribute('data-error');
      formStatus.classList.remove('info');
      formStatus.classList.add('error');

      // Ocultar el mensaje después de 5 segundos
      setTimeout(() => {
        formStatus.classList.remove('visible');
      }, 5000);
    } finally {
      // Restaurar el estado del botón
      submitButton.disabled = false;
      submitButton.classList.remove('sending');
    }
  });
});
