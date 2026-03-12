#!/bin/bash
# scripts/generate-releases-full-schema.sh

cd ~/dev/gitlab/dagklassical/dagk-bct

# Obtener lista de covers del VPS
ssh daguser@194.163.143.239 "ls /var/www/dagklassical/images/covers/cover-*.webp /var/www/dagklassical/images/covers/cover-*.png 2>/dev/null | xargs -n1 basename | sort" > /tmp/vps-covers.txt

echo "📦 Procesando $(wc -l < /tmp/vps-covers.txt) covers..."

for cover in $(cat /tmp/vps-covers.txt); do
  # Extraer slug: cover-artist-obra.ext → artist-obra
  slug=$(echo "$cover" | sed 's/^cover-//' | sed 's/\.[^.]*$//')
  json_file="src/content/releases/${slug}.json"
  
  # Saltar si ya existe
  if [ -f "$json_file" ]; then
    echo "⏭️  Existe: $json_file"
    continue
  fi
  
  # Parsear artista y título (heurística: primeras 2-3 palabras = artista)
  parts=($(echo "$slug" | tr '-' ' '))
  if [ ${#parts[@]} -ge 4 ]; then
    artist_slug="${parts[0]}-${parts[1]}"
    artist_name="${parts[0]^} ${parts[1]^}"
    work_title="${parts[@]:2}"
  else
    artist_slug="${parts[0]}"
    artist_name="${parts[0]^}"
    work_title="${parts[@]:1}"
  fi
  
  # Extraer año si existe
  year=$(echo "$cover" | grep -oP '\d{4}' | head -1)
  [ -z "$year" ] && year="2025"
  
  # Generar UUID simple (para placeholder)
  uuid=$(cat /proc/sys/kernel/random/uuid 2>/dev/null || echo "00000000-0000-0000-0000-000000000000")
  timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  
  # Crear JSON con schema COMPLETO
  cat > "$json_file" << EOF
{
  "id": "${slug}",
  "workTitle": "${work_title//-/ }",
  "composer": "Pendiente",
  "performers": ["${artist_name}"],
  "title": "${work_title//-/ }",
  "artistIds": ["${artist_slug}"],
  "genre": "Classical",
  "releaseDate": "${year}-01-01",
  "type": "álbum",
  "status": "proximamente",
  "description": "Descripción breve pendiente de completar.",
  "descriptionLong": "Descripción extendida pendiente. Este release forma parte del catálogo de DAG Klassical, con tokenización off-chain y disponibilidad en múltiples plataformas.",
  "coverImage": "/covers/${cover}",
  "demoAvailable": false,
  "fullAlbumAvailable": false,
  "sheetMusicAvailable": false,
  "platforms": {
    "spotify": null,
    "apple": null,
    "youtube": null,
    "tidal": null,
    "deezer": null
  },
  "tracks": [],
  "duration": "00:00:00",
  "commentary": "",
  "commentaryAuthor": "",
  "musicCards": [],
  "metadata": {
    "uuid": "urn:uuid:${uuid}",
    "timestamp": "${timestamp}",
    "operator": "cto@dagklassical.com"
  },
  "bioExtended": "",
  "demoBasePath": "${artist_slug}/${slug}"
}
EOF
  
  echo "✅ Creado: ${slug}.json"
done

echo ""
echo "=== RESUMEN ==="
echo "Releases en src/content/releases/: $(ls src/content/releases/*.json 2>/dev/null | wc -l)"
echo "Archivos con status:proximamente: $(grep -l '"status": "proximamente"' src/content/releases/*.json 2>/dev/null | wc -l)"