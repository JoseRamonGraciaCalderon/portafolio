<?php
// Script para descargar el CV directamente

// Ruta al archivo PDF
$pdfPath = __DIR__ . '/Ramon_Gracia_CV.pdf';

// Verificar si el archivo existe
if (file_exists($pdfPath)) {
    // Configurar las cabeceras para la descarga
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="Ramon_Gracia_CV.pdf"');
    header('Content-Length: ' . filesize($pdfPath));
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    
    // Leer y enviar el archivo
    readfile($pdfPath);
    exit;
} else {
    // Si el archivo no existe, redirigir a la página del CV
    header('Location: /cv.html?download=true');
    exit;
}
?>
