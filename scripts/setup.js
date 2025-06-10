const fs = require('fs');
const path = require('path');

// Crear directorio public/images si no existe
const imagesDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('✅ Directorio public/images creado');
}

console.log('✅ Configuración completada');