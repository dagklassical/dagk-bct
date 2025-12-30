#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const RELEASES_PATH = resolve(__dirname, '../src/data/releases.json');

async function cleanReleases() {
  console.log('🧹 Limpiando releases.json...\n');

  // Leer archivo
  const content = await readFile(RELEASES_PATH, 'utf8');
  const releases = JSON.parse(content);

  const cleanedReleases = releases.map(release => {
    const cleaned = { ...release };

    // 1. Asegurar que genre sea un array
    if (typeof cleaned.genre === 'string') {
      cleaned.genre = [cleaned.genre];
    } else if (!Array.isArray(cleaned.genre)) {
      cleaned.genre = [];
    }

    // 2. Corregir comentario erróneo en "tema-con-variazioni"
    if (cleaned.id === 'dipolo-riera-tema-con-variazioni-dm') {
      cleaned.commentary = "Una joya del barroco francés reinterpretada con sensibilidad venezolana. La elegancia de Marais se funde con el alma latinoamericana de Di Polo y Riera.";
      cleaned.commentaryAuthor = "DAG Klassical";
      
      // 2b. Añadir pista única si tracks está vacío pero hay duración
      if (cleaned.tracks.length === 0 && cleaned.duration) {
        cleaned.tracks = [{
          title: "Tema con Variazioni in Dm",
          composer: "Marin Marais",
          duration: cleaned.duration,
          demo: null
        }];
      }
    }

    // 3. Añadir workTitle y composer para obras clásicas (ej: Schubert, Marais)
    const classicalComposers = ['Schubert', 'Marin Marais', 'Borodin', 'Rimski-Kórsakov', 'Músorgski', 'Händel'];
    const title = cleaned.title || '';
    
    for (const composer of classicalComposers) {
      if (title.includes(composer)) {
        // Extraer workTitle (eliminar el nombre del compositor del título)
        const workTitle = title.replace(new RegExp(`\\s*[:–-]?\\s*${composer}.*$`, 'i'), '').trim();
        if (workTitle && workTitle !== title) {
          cleaned.workTitle = workTitle;
          cleaned.composer = composer;
        }
        break;
      }
    }

    // 4. Derivar demoAvailable de tracks (opcional)
    if (cleaned.tracks.some(t => t.demo)) {
      cleaned.demoAvailable = true;
    } else {
      delete cleaned.demoAvailable; // Opcional: eliminar si no es necesario
    }

    return cleaned;
  });

  // Escribir archivo limpio
  await writeFile(RELEASES_PATH, JSON.stringify(cleanedReleases, null, 2));
  console.log('✅ releases.json limpio y estandarizado.\n');
  console.log('⚠️  Recuerda:');
  console.log('   - Reemplazar UUIDs con valores reales');
  console.log('   - Verificar manualmente obras con "composer" (Schubert, Marais, etc.)');
}

cleanReleases().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});