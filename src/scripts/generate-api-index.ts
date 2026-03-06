// src/scripts/generate-api-index.ts
import { getCollection } from 'astro:content';
import { writeFileSync } from 'fs';

async function generateIndex() {
  const [artists, releases, cards] = await Promise.all([
    getCollection('artists'),
    getCollection('releases'), 
    getCollection('music-cards')
  ]);

  const index = {
    artists: artists.map(a => ({ id: a.id, ...a.data })),
    releases: releases.map(r => ({ id: r.id, ...r.data })),
    cards: cards.map(c => ({ id: c.id, ...c.data }))
  };

  // Escribir en carpeta pública para que el VPS pueda leerlo
  writeFileSync('public/api-index.json', JSON.stringify(index, null, 2));
}

generateIndex();