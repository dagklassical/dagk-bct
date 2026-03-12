// src/scripts/generate-api-index.mjs
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const CONTENT_BASE = 'src/content';

function loadCollection(collectionName) {
  const dir = join(CONTENT_BASE, collectionName);
  return readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const content = readFileSync(join(dir, f), 'utf-8');
      const data = JSON.parse(content);
      return { id: f.replace('.json', ''), ...data };
    });
}

function generateIndex() {
  const [artists, releases, cards] = [
    loadCollection('artists'),
    loadCollection('releases'),
    loadCollection('music-cards')
  ];

  const index = { artists, releases, cards };
  writeFileSync('public/api-index.json', JSON.stringify(index, null, 2));
  console.log(`✅ api-index.json generado: ${cards.length} cards, ${artists.length} artists`);
}

generateIndex();