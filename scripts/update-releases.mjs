#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';

async function main() {
  const filePath = './src/data/releases.json';
  console.log(`🔍 Leyendo ${filePath}...`);

  let releases;
  try {
    const content = await readFile(filePath, 'utf8');
    releases = JSON.parse(content);
  } catch (err) {
    console.error('❌ Error al leer el archivo:', err.message);
    return;
  }

  const updatedReleases = releases.map(release => {
    // Si ya tiene workTitle, no lo modifica
    if (release.workTitle) {
      return release;
    }

    // Extraer compositor del título (si sigue el patrón "Título - Compositor")
    const titleParts = release.title.split(' - ');
    let workTitle = release.title;
    let composer = '';
    let performers = [];

    if (titleParts.length > 1) {
      // Asumimos que el último fragmento es el compositor
      composer = titleParts.pop().trim();
      workTitle = titleParts.join(' - ').trim();
    }

    // Usar artistIds para obtener nombres completos de intérpretes
    if (release.artistIds && Array.isArray(release.artistIds)) {
      performers = release.artistIds.map(id => {
        // Aquí necesitarías tener acceso a artists.json para mapear id → nombre
        // Para este script, asumiremos que el ID es el apellido (como "gerulewicz")
        // En producción, deberías cargar artists.json y hacer una búsqueda
        return id; // Temporal: usar ID como nombre
      });
    }

    return {
      ...release,
      workTitle,
      composer,
      performers
    };
  });

  // Escribir el archivo actualizado
  const outputPath = './src/data/releases.json.updated';
  await writeFile(outputPath, JSON.stringify(updatedReleases, null, 2));
  console.log(`✅ Archivo actualizado guardado en: ${outputPath}`);
}

main().catch(console.error);