// Este script se ejecutará en el servidor para generar el PDF directamente
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
  // Lanzar un navegador headless
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    // Abrir una nueva página
    const page = await browser.newPage();
    
    // Configurar el tamaño de la página a A4
    await page.setViewport({
      width: 794, // Aproximadamente A4 en píxeles (210mm)
      height: 1123, // Aproximadamente A4 en píxeles (297mm)
      deviceScaleFactor: 2
    });
    
    // Cargar el HTML del CV
    const cvPath = path.join(__dirname, 'cv.html');
    await page.goto(`file://${cvPath}`, { waitUntil: 'networkidle0' });
    
    // Ocultar el botón de impresión
    await page.evaluate(() => {
      const printButton = document.querySelector('.print-button');
      if (printButton) printButton.style.display = 'none';
    });
    
    // Generar el PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    });
    
    // Guardar el PDF
    const pdfPath = path.join(__dirname, 'Ramon_Gracia_CV.pdf');
    fs.writeFileSync(pdfPath, pdfBuffer);
    
    console.log('PDF generado correctamente en:', pdfPath);
    
    return pdfPath;
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    throw error;
  } finally {
    // Cerrar el navegador
    await browser.close();
  }
}

// Ejecutar la función si este script se ejecuta directamente
if (require.main === module) {
  generatePDF()
    .then(() => console.log('Proceso completado'))
    .catch(err => console.error('Error en el proceso:', err));
}

module.exports = { generatePDF };
