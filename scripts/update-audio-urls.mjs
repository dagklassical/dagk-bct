// scripts/update-audio-urls.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VPS_URL = 'http://194.163.143.239';

// === 1. Actualizar releases.json: rutas de demo (MP3) ===
function updateReleases() {
  const releasesPath = path.join(__dirname, '..', 'src', 'data', 'releases.json');
  if (!fs.existsSync(releasesPath)) return;

  const releases = JSON.parse(fs.readFileSync(releasesPath, 'utf8'));
  const updated = releases.map(release => {
    if (release.tracks) {
      release.tracks = release.tracks.map(track => {
        if (typeof track.demo === 'string' && track.demo.startsWith('/protected/demo/')) {
          const vpsPath = track.demo.replace('/protected/demo/', '');
          track.demo = `${VPS_URL}/audio/demo/${vpsPath}`;
        }
        return track;
      });
    }
    return release;
  });

  fs.writeFileSync(releasesPath, JSON.stringify(updated, null, 2));
  console.log('✅ releases.json actualizado con URLs del VPS');
}

// === 2. Actualizar music-cards.json: rutas de covers (cardImage) ===
function updateMusicCards() {
  const cardsPath = path.join(__dirname, '..', 'src', 'data', 'music-cards.json');
  if (!fs.existsSync(cardsPath)) return;

  const cards = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));
  const updated = cards.map(card => {
    if (card.cardImage && card.cardImage.startsWith('/cards/')) {
      const filename = card.cardImage.replace('/cards/', '');
      card.cardImage = `${VPS_URL}/images/music-cards/${filename}`;
    }
    return card;
  });

  fs.writeFileSync(cardsPath, JSON.stringify(updated, null, 2));
  console.log('✅ music-cards.json actualizado con URLs del VPS');
}

// === 3. Actualizar artists.json: rutas de fotos de perfil ===
function updateArtists() {
  const artistsPath = path.join(__dirname, '..', 'src', 'data', 'artists.json');
  if (!fs.existsSync(artistsPath)) return;

  const artists = JSON.parse(fs.readFileSync(artistsPath, 'utf8'));
  const updated = artists.map(artist => {
    if (artist.profileImage && artist.profileImage.startsWith('/artists/')) {
      const filename = artist.profileImage.replace('/artists/', '');
      artist.profileImage = `${VPS_URL}/images/artists/${filename}`;
    }
    return artist;
  });

  fs.writeFileSync(artistsPath, JSON.stringify(updated, null, 2));
  console.log('✅ artists.json actualizado con URLs del VPS');
}

// === Ejecutar todas las actualizaciones ===
console.log('🔄 Actualizando rutas locales a URLs del VPS...');
updateReleases();
updateMusicCards();
updateArtists();
console.log('✨ ¡Listo! Todas las rutas ahora apuntan a tu VPS.');