#!/usr/bin/env node

import { readFile, writeFile, mkdir } from 'fs/promises';
import { resolve } from 'path';
import { execSync } from 'child_process';

const DATA_DIR = resolve('./src/data');
const BACKUP_DIR = resolve('./backups');
const LOG_FILE = resolve('./backups/uuid-assignment-log.csv');

const files = [
  { name: 'artists.json', type: 'artist' },
  { name: 'releases.json', type: 'release' },
  { name: 'music-cards.json', type: 'music-card' }
];

// CSV header
let logEntries = ['"timestamp","type","id","uuid"\n'];

async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupPath = resolve(BACKUP_DIR, `uuid-backup-${timestamp}`);
  await mkdir(backupPath, { recursive: true });

  for (const file of files) {
    const src = resolve(DATA_DIR, file.name);
    const dest = resolve(backupPath, file.name);
    const content = await readFile(src, 'utf8');
    await writeFile(dest, content);
  }

  console.log(`📁 Backup guardado en: ${backupPath}`);
  return backupPath;
}

function generateUUID() {
  try {
    return execSync('uuidgen').toString().trim().toLowerCase();
  } catch {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

async function replacePlaceholders() {
  await createBackup();

  for (const file of files) {
    const filepath = resolve(DATA_DIR, file.name);
    const data = JSON.parse(await readFile(filepath, 'utf8'));
    let changed = false;

    // Recorrer cada entidad
    for (const item of data) {
      if (item.metadata?.uuid === 'urn:uuid:$(uuidgen)') {
        const newUUID = generateUUID();
        item.metadata.uuid = `urn:uuid:${newUUID}`;
        changed = true;

        // Registrar en el log
        const timestamp = new Date().toISOString();
        logEntries.push(`"${timestamp}","${file.type}","${item.id}","${newUUID}"\n`);
      }
    }

    if (changed) {
      await writeFile(filepath, JSON.stringify(data, null, 2));
      console.log(`✅ ${file.name}: placeholders reemplazados`);
    } else {
      console.log(`ℹ️  ${file.name}: sin cambios`);
    }
  }

  // Guardar el log
  await writeFile(LOG_FILE, logEntries.join(''));
  console.log(`📄 Log de asignación guardado en: ${LOG_FILE}`);

  console.log('\n✅ ¡UUIDs actualizados! Confirma en src/data/ y haz commit si todo está bien.');
  console.log('   Si algo falla, restaura desde la carpeta ./backups/');
}

replacePlaceholders().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});