// Script para generar el PDF del CV
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Obtener __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF() {
  console.log('Iniciando generación de PDF...');
  
  try {
    // Ruta al archivo HTML del CV
    const htmlPath = path.join(__dirname, 'cv.html');
    // Ruta donde se guardará el PDF
    const pdfPath = path.join(__dirname, 'CV_Ramon_Gracia_Desarrollador_Web.pdf');
    
    // Verificar que el archivo HTML existe
    if (!fs.existsSync(htmlPath)) {
      console.error('El archivo HTML del CV no existe en la ruta:', htmlPath);
      return;
    }
    
    console.log('Lanzando navegador...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Cargar el archivo HTML
    console.log('Cargando archivo HTML...');
    await page.goto(`file:${htmlPath}`, { waitUntil: 'networkidle0' });
    
    // Esperar a que el contenido esté completamente cargado
    await page.waitForSelector('.container', { visible: true });
    
    // Configurar el PDF
    console.log('Generando PDF...');
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
    
    await browser.close();
    
    console.log('PDF generado exitosamente en:', pdfPath);
  } catch (error) {
    console.error('Error al generar el PDF:', error);
  }
}

// Ejecutar la función
generatePDF();
