#!/usr/bin/env node
// migrate-releases-urls-to-filenames.js
import fs from 'fs';
import path from 'path';

// ✅ Ruta correcta desde la raíz del proyecto
const RELEASES_PATH = './src/data/releases.json';

// Leer el archivo
const rawData = fs.readFileSync(RELEASES_PATH, 'utf8');
const releases = JSON.parse(rawData);

// Función para extraer nombre de archivo de URL (mejorada)
function extractFilenameFromUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  // Eliminar dominio y parámetros
  const cleanUrl = trimmed
    .replace('https://audio.dagklassical.com', '')
    .replace(/\?.*$/, '')
    .replace(/#.*/, '');
  // Extraer nombre de archivo
  const filename = path.basename(cleanUrl);
  return filename.endsWith('.mp3') || filename.endsWith('.flac') ? filename : '';
}

// Migrar cada release
const migratedReleases = releases.map(release => {
  if (!release.tracks || !Array.isArray(release.tracks)) return release;

  const newTracks = release.tracks.map(track => {
    // Procesar campo "protected" (archivos completos)
    let protectedFile = '';
    if (track.protected) {
      protectedFile = extractFilenameFromUrl(track.protected);
    } else if (track.full) {
      protectedFile = extractFilenameFromUrl(track.full);
    }

    // Procesar campo "demo" (audios de muestra)
    const demoFile = extractFilenameFromUrl(track.demo);

    // Crear nueva versión del track (eliminar campos antiguos)
    const { full, demo, ...rest } = track;
    return {
      ...rest,
      protected: protectedFile || rest.protected || '',
      demoFile: demoFile || rest.demoFile || ''
    };
  });

  return {
    ...release,
    tracks: newTracks
  };
});

// Guardar con respaldo (en la misma carpeta de datos)
const backupPath = './src/data/releases.backup-migration.json';
fs.writeFileSync(backupPath, rawData, 'utf8');
fs.writeFileSync(RELEASES_PATH, JSON.stringify(migratedReleases, null, 2), 'utf8');

console.log('\n✅ Migración completada exitosamente.');
console.log(`📁 Respaldo guardado en: ${backupPath}`);
console.log(`📄 Archivo actualizado: ${RELEASES_PATH}`);
console.log('\n✨ Campos actualizados:');
console.log('   - "full" → eliminado, reemplazado por "protected"');
console.log('   - "demo" → eliminado, reemplazado por "demoFile"');
console.log('   - Se eliminaron espacios al final y parámetros de las URLs');

// Verificación rápida
console.log('\n🔍 Verificación rápida de los primeros tracks:');
migratedReleases.slice(0, 2).forEach(release => {
  console.log(`\n ${release.title}:`);
  release.tracks.slice(0, 2).forEach((track, i) => {
    console.log(`   Track ${i + 1}: "${track.title}"`);
    console.log(`     protected: "${track.protected}"`);
    console.log(`     demoFile: "${track.demoFile}"`);
  });
});