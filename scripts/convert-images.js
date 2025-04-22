import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorio de imágenes
const imageDir = path.join(__dirname, '../public/images');
// Directorio para las imágenes WebP
const webpDir = path.join(__dirname, '../public/images/webp');

// Asegurarse de que el directorio WebP exista
if (!fs.existsSync(webpDir)) {
  fs.mkdirSync(webpDir, { recursive: true });
}

// Función para convertir una imagen a WebP
async function convertToWebP(inputPath, outputPath, quality = 80) {
  try {
    await sharp(inputPath)
      .webp({ quality: quality })
      .toFile(outputPath);

    console.log(`Convertida: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);

    // Obtener tamaños de archivo para comparación
    const originalSize = fs.statSync(inputPath).size;
    const webpSize = fs.statSync(outputPath).size;
    const savings = originalSize - webpSize;
    const savingsPercent = (savings / originalSize) * 100;

    console.log(`  Tamaño original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`  Tamaño WebP: ${(webpSize / 1024).toFixed(2)} KB`);
    console.log(`  Ahorro: ${(savings / 1024).toFixed(2)} KB (${savingsPercent.toFixed(2)}%)`);

    return {
      originalFile: path.basename(inputPath),
      webpFile: path.basename(outputPath),
      originalSize,
      webpSize,
      savings,
      savingsPercent
    };
  } catch (error) {
    console.error(`Error al convertir ${inputPath}:`, error);
    return null;
  }
}

// Función principal para procesar todas las imágenes
async function processImages() {
  // Leer todos los archivos en el directorio de imágenes
  const files = fs.readdirSync(imageDir);

  let totalOriginalSize = 0;
  let totalWebpSize = 0;
  let results = [];

  for (const file of files) {
    // Ignorar directorios y archivos que no son imágenes
    const inputPath = path.join(imageDir, file);
    if (fs.statSync(inputPath).isDirectory()) continue;

    const ext = path.extname(file).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

    // Crear ruta de salida para el archivo WebP
    const outputPath = path.join(webpDir, `${path.basename(file, ext)}.webp`);

    // Convertir la imagen
    const result = await convertToWebP(inputPath, outputPath);

    if (result) {
      results.push(result);
      totalOriginalSize += result.originalSize;
      totalWebpSize += result.webpSize;
    }
  }

  // Mostrar resumen
  const totalSavings = totalOriginalSize - totalWebpSize;
  const totalSavingsPercent = (totalSavings / totalOriginalSize) * 100;

  console.log('\n===== RESUMEN =====');
  console.log(`Total de imágenes convertidas: ${results.length}`);
  console.log(`Tamaño total original: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Tamaño total WebP: ${(totalWebpSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Ahorro total: ${(totalSavings / 1024 / 1024).toFixed(2)} MB (${totalSavingsPercent.toFixed(2)}%)`);

  // Generar informe para actualizar referencias en el código
  console.log('\n===== REFERENCIAS A ACTUALIZAR =====');
  results.forEach(result => {
    console.log(`${result.originalFile} -> webp/${result.webpFile}`);
  });
}

// Ejecutar el proceso
processImages().catch(console.error);
