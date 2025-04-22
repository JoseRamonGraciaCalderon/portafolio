// Este archivo se ejecutará en el servidor para manejar la descarga del CV
const fs = require('fs');
const path = require('path');
const http = require('http');

// Crear un servidor HTTP
const server = http.createServer((req, res) => {
  // Verificar si la ruta es para descargar el CV
  if (req.url === '/download-cv') {
    // Ruta al archivo PDF
    const pdfPath = path.join(__dirname, 'Ramon_Gracia_CV.pdf');
    
    // Verificar si el archivo existe
    fs.access(pdfPath, fs.constants.F_OK, (err) => {
      if (err) {
        // Si el archivo no existe, redirigir a la página del CV
        res.writeHead(302, { 'Location': '/cv.html?download=true' });
        res.end();
        return;
      }
      
      // Leer el archivo
      fs.readFile(pdfPath, (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Error al leer el archivo');
          return;
        }
        
        // Configurar las cabeceras para la descarga
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="Ramon_Gracia_CV.pdf"',
          'Content-Length': data.length
        });
        
        // Enviar el archivo
        res.end(data);
      });
    });
  } else {
    // Para cualquier otra ruta, redirigir a la página principal
    res.writeHead(302, { 'Location': '/' });
    res.end();
  }
});

// Iniciar el servidor en el puerto 3000
server.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});
