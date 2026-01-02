#!/usr/bin/env node

import { execSync } from 'child_process';
import { readdirSync, existsSync } from 'fs';
import { resolve } from 'path';

// === CONFIGURACIÓN ===
const FLAC_DIR = './flac/virginia-ramirez';      // Carpeta con los .flac
const DEMO_BASE = '/audio/demo/virginia-ramirez';
const TRACKS_INFO = [
  { title: 'Preludio para Boby' },
  { title: 'Blues con Sangueo' },
  { title: 'Domingo por la Tarde' },
  { title: 'Días de Julio' },
  { title: 'Don Alen' },
  { title: 'Dulcinea' },
  { title: 'Espiral de Fuego' },
  { title: 'Guasipati' },
  { title: 'Manos y Alma' },
  { title: 'Azul y Verde' },
  { title: 'Rapguinaldo' }
];

// Mapeo de títulos a nombres de archivo esperados (normalizados)
function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Extraer duración en formato m:ss
function getDuration(filePath) {
  try {
    const output = execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${filePath}"`, { encoding: 'utf8' });
    const seconds = Math.floor(parseFloat(output.trim()));
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  } catch (e) {
    console.warn(`⚠️  No se pudo leer la duración de: ${filePath}`);
    return "0:00";
  }
}

// === EJECUCIÓN ===
if (!existsSync(FLAC_DIR)) {
  console.error(`❌ La carpeta ${FLAC_DIR} no existe.`);
  process.exit(1);
}

const files = readdirSync(FLAC_DIR).filter(f => f.endsWith('.flac'));
const fileMap = {};
files.forEach(f => {
  const key = normalizeTitle(f.replace(/\.flac$/, ''));
  fileMap[key] = resolve(FLAC_DIR, f);
});

console.log('\n✅ Duraciones extraídas:\n');

const tracks = TRACKS_INFO.map(track => {
  const normalized = normalizeTitle(track.title);
  const filePath = fileMap[normalized];
  const duration = filePath ? getDuration(filePath) : "0:00";
  
  // Inferir nombre del demo
  const demoName = `ramirez-capitulos-${normalized}-demo.mp3`;
  const demoPath = `${DEMO_BASE}/${demoName}`;

  console.log(`${track.title}: ${duration}`);

  return {
    title: track.title,
    composer: "Virginia Ramírez",
    workCatalogue: "",
    duration: duration,
    demo: demoPath
  };
});

// Calcular duración total
const totalSecs = tracks.reduce((sum, t) => {
  const [m, s] = t.duration.split(':').map(Number);
  return sum + (m * 60 + s);
}, 0);
const totalMins = Math.floor(totalSecs / 60);
const totalSecsRemain = totalSecs % 60;
const totalDuration = `${totalMins}:${totalSecsRemain.toString().padStart(2, '0')}`;

console.log(`\n⏱️  Duración total del álbum: ${totalDuration}\n`);

// Generar JSON
console.log('📄 Copia este bloque en releases.json:\n');
console.log('"tracks": [');
tracks.forEach((t, i) => {
  console.log(`  {
    "title": "${t.title}",
    "composer": "${t.composer}",
    "workCatalogue": "${t.workCatalogue}",
    "duration": "${t.duration}",
    "demo": "${t.demo}"
  }${i < tracks.length - 1 ? ',' : ''}`);
});
console.log('],');
console.log(`"duration": "${totalDuration}"`);