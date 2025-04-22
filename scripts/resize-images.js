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
const resizedDir = path.join(__dirname, '../public/images/responsive');

// Tamaños para las imágenes de proyectos
const projectSizes = [
  { width: 1200, suffix: 'large' },
  { width: 800, suffix: 'medium' },
  { width: 400, suffix: 'small' }
];

// Tamaños para la imagen de avatar
const avatarSizes = [
  { width: 300, suffix: 'large' },
  { width: 180, suffix: 'medium' },
  { width: 120, suffix: 'small' }
];

// Asegurarse de que el directorio de imágenes redimensionadas exista
if (!fs.existsSync(resizedDir)) {
  fs.mkdirSync(resizedDir, { recursive: true });
}

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

// Función principal para procesar todas las imágenes
async function processImages() {
  // Leer todos los archivos en el directorio de imágenes
  const files = fs.readdirSync(imageDir);
  
  let totalOriginalSize = 0;
  let totalResizedSize = 0;
  let results = [];
  
  for (const file of files) {
    // Ignorar directorios y archivos que no son imágenes
    const inputPath = path.join(imageDir, file);
    if (fs.statSync(inputPath).isDirectory()) continue;
    
    const ext = path.extname(file).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;
    
    const baseName = path.basename(file, ext);
    
    // Determinar qué tamaños usar según el nombre del archivo
    const sizes = baseName === 'avatar' ? avatarSizes : projectSizes;
    
    for (const size of sizes) {
      // Crear ruta de salida para el archivo redimensionado
      const outputPath = path.join(resizedDir, `${baseName}-${size.suffix}.webp`);
      
      // Redimensionar la imagen
      const result = await resizeImage(inputPath, outputPath, size.width);
      
      if (result) {
        results.push(result);
        totalOriginalSize += result.originalSize;
        totalResizedSize += result.resizedSize;
      }
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
  
  // Generar informe para actualizar referencias en el código
  console.log('\n===== REFERENCIAS A ACTUALIZAR =====');
  const imageMap = {};
  
  results.forEach(result => {
    const originalName = result.originalFile.split('.')[0];
    if (!imageMap[originalName]) {
      imageMap[originalName] = [];
    }
    imageMap[originalName].push({
      width: result.width,
      file: `responsive/${result.resizedFile}`
    });
  });
  
  // Imprimir el mapa de imágenes para usar en el componente
  console.log(JSON.stringify(imageMap, null, 2));
}

// Ejecutar el proceso
processImages().catch(console.error);
