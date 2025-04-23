import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorio de imágenes
const imageDir = path.join(__dirname, '../public/images');
// Directorio para las imágenes redimensionadas
const responsiveDir = path.join(__dirname, '../public/images/responsive');

// Asegurarse de que el directorio de imágenes redimensionadas exista
if (!fs.existsSync(responsiveDir)) {
  fs.mkdirSync(responsiveDir, { recursive: true });
}

// Tamaños para la imagen de avatar con mayor resolución
const avatarSizes = [
  { width: 400, suffix: 'large-2x' },   // Para pantallas de alta densidad
  { width: 240, suffix: 'medium-2x' },  // Para tablets de alta densidad
  { width: 180, suffix: 'small-2x' }    // Para móviles de alta densidad
];

// Función para redimensionar una imagen
async function resizeImage(inputPath, outputPath, width, quality = 80) {
  try {
    await sharp(inputPath)
      .resize(width)
      .webp({ quality: quality })
      .toFile(outputPath);
    
    console.log(`Redimensionada: ${path.basename(inputPath)} -> ${path.basename(outputPath)} (${width}px)`);
    
    // Obtener tamaños de archivo para comparación
    const originalSize = fs.statSync(inputPath).size;
    const resizedSize = fs.statSync(outputPath).size;
    const savings = originalSize - resizedSize;
    const savingsPercent = (savings / originalSize) * 100;
    
    console.log(`  Tamaño original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`  Tamaño redimensionado: ${(resizedSize / 1024).toFixed(2)} KB`);
    console.log(`  Ahorro: ${(savings / 1024).toFixed(2)} KB (${savingsPercent.toFixed(2)}%)`);
    
    return {
      originalFile: path.basename(inputPath),
      resizedFile: path.basename(outputPath),
      width,
      originalSize,
      resizedSize,
      savings,
      savingsPercent
    };
  } catch (error) {
    console.error(`Error al redimensionar ${inputPath}:`, error);
    return null;
  }
}

// Función principal para procesar la imagen de avatar
async function processAvatar() {
  const avatarPath = path.join(imageDir, 'avatar.jpg');
  
  if (!fs.existsSync(avatarPath)) {
    console.error('No se encontró la imagen de avatar');
    return;
  }
  
  let totalOriginalSize = 0;
  let totalResizedSize = 0;
  let results = [];
  
  for (const size of avatarSizes) {
    // Crear ruta de salida para el archivo redimensionado
    const outputPath = path.join(responsiveDir, `avatar-${size.suffix}.webp`);
    
    // Redimensionar la imagen
    const result = await resizeImage(avatarPath, outputPath, size.width);
    
    if (result) {
      results.push(result);
      totalOriginalSize += result.originalSize;
      totalResizedSize += result.resizedSize;
    }
  }
  
  // Mostrar resumen
  const totalSavings = totalOriginalSize - totalResizedSize;
  const totalSavingsPercent = (totalSavings / totalOriginalSize) * 100;
  
  console.log('\n===== RESUMEN =====');
  console.log(`Total de imágenes redimensionadas: ${results.length}`);
  console.log(`Tamaño total original: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Tamaño total redimensionado: ${(totalResizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Ahorro total: ${(totalSavings / 1024 / 1024).toFixed(2)} MB (${totalSavingsPercent.toFixed(2)}%)`);
}

// Ejecutar el proceso
processAvatar().catch(console.error);
