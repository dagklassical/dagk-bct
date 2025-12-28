#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, '../src/data');

// === VOCABULARIO CONTROLADO ===
// Ajusta esta lista según tus necesidades
const GENRE_VOCABULARY = [
  'música-navideña',
  'piano-clásico',
  'piano-contemporáneo',
  'piano-ruso',
  'música-venezolana',
  'barroco',
  'romanticismo',
  'música-de-cámara',
  'música-solista',
  'música-religiosa',
  'música-sacra',
  'ópera',
  'música-orquestal',
  'música-de-cámara-histórica',
  'composición-contemporánea',
  'música-latinoamericana',
  'música-europea'
].map(g => g.toLowerCase());

// Normaliza un género para comparación
function normalizeGenre(genre) {
  return genre
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9áéíóúñ]/g, '-'); // "Navideño!" → "navideño"
}

// Encuentra el mejor match en el vocabulario
function findBestMatch(input) {
  const normInput = normalizeGenre(input);
  
  // Coincidencia exacta
  if (GENRE_VOCABULARY.includes(normInput)) {
    return normInput;
  }

  // Coincidencia parcial (ej: "navideño" → "música-navideña")
  for (const vocab of GENRE_VOCABULARY) {
    if (vocab.includes(normInput) || normInput.includes(vocab)) {
      return vocab;
    }
  }

  return null;
}

// Analiza un release y devuelve su diagnóstico
function analyzeRelease(release) {
  const genres = Array.isArray(release.genre) ? release.genre : (release.genre ? [release.genre] : []);
  
  const diagnostics = [];
  const suggestedGenres = [];

  for (const g of genres) {
    const bestMatch = findBestMatch(g);
    if (bestMatch) {
      suggestedGenres.push(bestMatch);
    } else {
      diagnostics.push(`Género desconocido: "${g}"`);
      suggestedGenres.push(`[CORREGIR] ${g}`);
    }
  }

  return { diagnostics, suggestedGenres, originalGenres: genres };
}

async function main() {
  console.log('🔍 Analizando géneros en releases.json...\n');

  // Leer releases.json
  const releasesPath = resolve(DATA_DIR, 'releases.json');
  const releasesContent = await readFile(releasesPath, 'utf8');
  const releases = JSON.parse(releasesContent);

  let hasIssues = false;
  const report = [];

  // Procesar cada release
  const updatedReleases = releases.map(release => {
    const { diagnostics, suggestedGenres, originalGenres } = analyzeRelease(release);
    
    if (diagnostics.length > 0) {
      hasIssues = true;
      report.push({
        id: release.id,
        title: release.workTitle || release.title,
        original: originalGenres,
        issues: diagnostics,
        suggested: suggestedGenres
      });
    }

    // Si hay sugerencias válidas, las aplicamos (opcional: desactivar para solo informe)
    const cleanSuggestions = suggestedGenres.filter(g => !g.startsWith('[CORREGIR]'));
    if (cleanSuggestions.length > 0 && cleanSuggestions.length === suggestedGenres.length) {
      return { ...release, genre: cleanSuggestions };
    }

    return release;
  });

  // Mostrar informe
  if (!hasIssues) {
    console.log('✅ Todos los géneros están en el vocabulario controlado.\n');
    return;
  }

  console.log(`⚠️  Se encontraron ${report.length} releases con géneros fuera del vocabulario:\n`);

  for (const item of report) {
    console.log(`📄 ${item.id} – ${item.title}`);
    console.log(`   Original: [${item.original.map(g => `"${g}"`).join(', ')}]`);
    console.log(`   Problemas: ${item.issues.join('; ')}`);
    console.log(`   Sugerido: [${item.suggested.map(g => `"${g}"`).join(', ')}]`);
    console.log('');
  }

  // Preguntar si desea corregir
  const shouldFix = process.argv.includes('--fix');
  if (shouldFix) {
    console.log('🔧 Aplicando correcciones...');
    await writeFile(releasesPath, JSON.stringify(updatedReleases, null, 2));
    console.log('✅ releases.json actualizado.\n');
  } else {
    console.log('💡 Para aplicar correcciones, ejecuta:');
    console.log('   node scripts/audit-genres.mjs --fix');
    console.log('\n📁 El vocabulario controlado está en el script (línea 10-27).');
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});