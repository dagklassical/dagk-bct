#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ARTISTS_PATH = resolve(__dirname, '../src/data/artists.json');

// Campos obligatorios (se mantienen siempre)
const REQUIRED_FIELDS = ['id', 'name', 'role', 'bio', 'avatar', 'releases'];

// Campos opcionales (solo si tienen valor no nulo)
const OPTIONAL_FIELDS = ['country', 'city', 'genre', 'website', 'social', 'musicCards', 'metadata'];

async function cleanArtists() {
  console.log('🧹 Limpiando artists.json...\n');

  // Leer archivo
  const content = await readFile(ARTISTS_PATH, 'utf8');
  const artists = JSON.parse(content);

  const cleanedArtists = artists.map(artist => {
    const cleaned = {};

    // 1. Asegurar campos obligatorios
    for (const field of REQUIRED_FIELDS) {
      if (artist[field] === undefined || artist[field] === null) {
        console.warn(`⚠️  Artista "${artist.name}" le falta el campo obligatorio: ${field}`);
        // Puedes decidir qué hacer: saltar, usar valor por defecto, o detener
      }
      cleaned[field] = artist[field];
    }

    // 2. Añadir campos opcionales solo si son válidos
    for (const field of OPTIONAL_FIELDS) {
      if (artist[field] != null) {
        if (field === 'genre') {
          // Asegurar que genre sea array
          cleaned.genre = Array.isArray(artist.genre) ? artist.genre : [artist.genre];
        } else if (field === 'social') {
          // Limpiar redes sociales: eliminar claves con null/undefined y trim en URLs
          const cleanSocial = {};
          for (const [platform, url] of Object.entries(artist.social || {})) {
            if (url && typeof url === 'string' && url.trim()) {
              cleanSocial[platform] = url.trim();
            }
          }
          if (Object.keys(cleanSocial).length > 0) {
            cleaned.social = cleanSocial;
          }
        } else if (field === 'releases' || field === 'musicCards') {
          // Asegurar que sean arrays
          cleaned[field] = Array.isArray(artist[field]) ? artist[field] : [];
        } else {
          cleaned[field] = artist[field];
        }
      }
    }

    return cleaned;
  });

  // Escribir archivo limpio
  await writeFile(ARTISTS_PATH, JSON.stringify(cleanedArtists, null, 2));
  console.log('✅ artists.json limpio y estandarizado.\n');
  console.log('💡 Recomendación: revisa manualmente artistas sin `genre` o `country`.');
}

cleanArtists().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});