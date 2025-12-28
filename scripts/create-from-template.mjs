#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

const [,, entityType, newId] = process.arv || process.argv;

const ENTITY_CONFIG = {
  artist: {
    template: 'artists-template.json',
    target: 'artists.json',
    idField: 'id'
  },
  release: {
    template: 'release-template.json',
    target: 'releases.json',
    idField: 'id'
  },
  musiccard: {
    template: 'music-cards-template.json',
    target: 'music-cards.json',
    idField: 'id'
  }
};

if (!entityType || !newId) {
  console.error('Uso: node create-from-template.mjs <artist|release|musiccard> <nuevo-id>');
  console.error('Ej: node create-from-template.mjs release gerulewicz-piano-aguinaldo');
  process.exit(1);
}

const config = ENTITY_CONFIG[entityType];
if (!config) {
  console.error('Tipo de entidad no soportado. Usa: artist, release o musiccard');
  process.exit(1);
}

// === FUNCIÓN DE LIMPIEZA (igual a la de tus scripts anteriores) ===
function cleanEntity(entity, type) {
  const cleaned = { ...entity };

  // Limpieza de redes sociales
  if (cleaned.social && typeof cleaned.social === 'object') {
    const cleanSocial = {};
    for (const [platform, url] of Object.entries(cleaned.social)) {
      if (url && typeof url === 'string' && url.trim()) {
        cleanSocial[platform] = url.trim();
      }
    }
    cleaned.social = Object.keys(cleanSocial).length > 0 ? cleanSocial : {};
  }

  // Asegurar que genre sea array
  if (cleaned.genre && typeof cleaned.genre === 'string') {
    cleaned.genre = [cleaned.genre];
  } else if (!Array.isArray(cleaned.genre)) {
    cleaned.genre = [];
  }

  // Asegurar arrays en campos clave
  const arrayFields = ['artistIds', 'releases', 'musicCards', 'performers', 'benefits'];
  for (const field of arrayFields) {
    if (cleaned[field] != null && !Array.isArray(cleaned[field])) {
      cleaned[field] = [cleaned[field]];
    }
    if (cleaned[field] == null) {
      cleaned[field] = [];
    }
  }

  // Limpieza de socialLinks (music cards)
  if (type === 'musiccard' && cleaned.socialLinks) {
    cleaned.socialLinks = cleaned.socialLinks
      .map(link => ({
        ...link,
        url: link.url ? link.url.trim() : ''
      }))
      .filter(link => link.url);
  }

  return cleaned;
}

// === FUNCIÓN PRINCIPAL ===
async function createFromTemplate() {
  const templatePath = resolve(__dirname, `../snippets/${config.template}`);
  const targetPath = resolve(__dirname, `../src/data/${config.target}`);

  const template = JSON.parse(await readFile(templatePath, 'utf8'));
  const target = JSON.parse(await readFile(targetPath, 'utf8'));

  // Copiar y personalizar
  const newItem = { ...template };
  newItem[config.idField] = newId;

  // Ajustar rutas de imagen
  if (newItem.avatar) newItem.avatar = newItem.avatar.replace(/profile-[^.]+/, `profile-${newId}`);
  if (newItem.coverImage) newItem.coverImage = newItem.coverImage.replace(/cover-[^.]+/, `cover-${newId}`);
  if (newItem.cardImage) newItem.cardImage = newItem.cardImage.replace(/mc-[^.]+/, `mc-${newId}`);

  // Generar UUID y timestamp
  let uuid, timestamp;
  try {
    uuid = execSync('uuidgen').toString().trim().toLowerCase();
    timestamp = new Date().toISOString();
  } catch (e) {
    uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    timestamp = new Date().toISOString();
  }

  if (newItem.metadata) {
    newItem.metadata.uuid = `urn:uuid:${uuid}`;
    newItem.metadata.timestamp = timestamp;
  }

  // 👇 APLICAR LIMPIEZA INMEDIATA 👇
  const cleanedItem = cleanEntity(newItem, entityType);

  // Insertar al inicio
  target.unshift(cleanedItem);
  
  // Guardar
  await writeFile(targetPath, JSON.stringify(target, null, 2));

  console.log(`✅ ${entityType} "${newId}" creado y limpiado en ${config.target}`);
  console.log(`   UUID: ${cleanedItem.metadata?.uuid || 'no metadata'}`);
}

createFromTemplate().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});