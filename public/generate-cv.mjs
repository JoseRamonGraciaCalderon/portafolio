// Script para generar los PDFs del CV en español e inglés
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Obtener __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para generar un PDF a partir de un archivo HTML
async function generatePDFFromHTML(htmlPath, pdfPath, browser) {
  try {
    // Verificar que el archivo HTML existe
    if (!fs.existsSync(htmlPath)) {
      console.error(`El archivo HTML no existe en la ruta: ${htmlPath}`);
      return false;
    }

    const page = await browser.newPage();

    // Cargar el archivo HTML
    console.log(`Cargando archivo HTML: ${htmlPath}`);
    await page.goto(`file:${htmlPath}`, { waitUntil: 'networkidle0' });

    // Esperar a que el contenido esté completamente cargado
    await page.waitForSelector('.container', { visible: true });

    // Configurar el PDF
    console.log(`Generando PDF: ${pdfPath}`);
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    });

    await page.close();

    console.log(`PDF generado exitosamente en: ${pdfPath}`);
    return true;
  } catch (error) {
    console.error(`Error al generar el PDF ${pdfPath}:`, error);
    return false;
  }
}

// Función principal para generar ambos PDFs
async function generatePDFs() {
  console.log('Iniciando generación de PDFs...');

  // Configuración para la versión en español
  const htmlPathES = path.join(__dirname, 'cv.html');
  const pdfPathES = path.join(__dirname, 'cv-es.pdf');

  // Configuración para la versión en inglés
  const htmlPathEN = path.join(__dirname, 'cv-en.html');
  const pdfPathEN = path.join(__dirname, 'cv-en.pdf');

  try {
    console.log('Lanzando navegador...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Generar PDF en español
    const esSuccess = await generatePDFFromHTML(htmlPathES, pdfPathES, browser);

    // Generar PDF en inglés
    const enSuccess = await generatePDFFromHTML(htmlPathEN, pdfPathEN, browser);

    await browser.close();

    if (esSuccess && enSuccess) {
      console.log('Ambos PDFs generados exitosamente.');
    } else {
      console.error('Hubo problemas al generar uno o ambos PDFs.');
    }
  } catch (error) {
    console.error('Error general al generar los PDFs:', error);
  }
}

// Ejecutar la función
generatePDFs();
