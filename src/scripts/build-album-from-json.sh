#!/bin/bash
# build-album-from-json.sh
# Genera álbum completo usando el orden de releases.json

set -e  # Salir si hay errores

if [ $# -ne 2 ]; then
  echo "Uso: $0 <ruta/releases.json> <release_id>"
  echo "Ej: $0 ./src/data/releases.json virginia-ramirez-capitulos"
  exit 1
fi

RELEASES_JSON="$1"
RELEASE_ID="$2"

# Verificar que jq esté instalado
if ! command -v jq &> /dev/null; then
  echo "❌ Error: 'jq' no está instalado. Instálalo con: sudo apt install jq"
  exit 1
fi

# Verificar que el archivo JSON exista
if [ ! -f "$RELEASES_JSON" ]; then
  echo "❌ Error: Archivo JSON no encontrado: $RELEASES_JSON"
  exit 1
fi

# Extraer tracks en orden (solo los que tienen "protected" no vacío)
TRACKS=()
while IFS= read -r track; do
  if [[ -n "$track" && "$track" != "null" ]]; then
    TRACKS+=("$track")
  fi
done < <(jq -r --arg id "$RELEASE_ID" '.[] | select(.id == $id) | .tracks[] | select(.protected != null and .protected != "") | .protected' "$RELEASES_JSON")

if [ ${#TRACKS[@]} -eq 0 ]; then
  echo "❌ Error: No se encontraron tracks con 'protected' para el release '$RELEASE_ID'"
  exit 1
fi

# Derivar rutas
ALBUM_DIR="/var/www/dagklassical/protected/audio/$RELEASE_ID"
OUTPUT_FILE="${ALBUM_DIR}/${RELEASE_ID}-complete.flac"
TEMP_WAV="${ALBUM_DIR}/temp_concat.wav"

# Verificar que el directorio del álbum exista
if [ ! -d "$ALBUM_DIR" ]; then
  echo "❌ Error: Directorio no encontrado: $ALBUM_DIR"
  exit 1
fi

# Verificar que todos los archivos existan
for track in "${TRACKS[@]}"; do
  if [ ! -f "${ALBUM_DIR}/${track}" ]; then
    echo "❌ Error: ${track} no encontrado en ${ALBUM_DIR}"
    exit 1
  fi
done

echo "✅ Tracks verificados para $RELEASE_ID (${#TRACKS[@]} tracks)"

# Crear lista para ffmpeg
INPUT_LIST="${ALBUM_DIR}/tracks.txt"
> "$INPUT_LIST"
for track in "${TRACKS[@]}"; do
  echo "file '${ALBUM_DIR}/${track}'" >> "$INPUT_LIST"
done

echo "🔄 Concatenando tracks..."

# Concatenar a WAV temporal
ffmpeg -f concat -safe 0 -i "$INPUT_LIST" -c:a pcm_s24le "$TEMP_WAV" -y

# Convertir a FLAC final
ffmpeg -i "$TEMP_WAV" -c:a flac -compression_level 8 "$OUTPUT_FILE" -y

# Limpiar
rm -f "$TEMP_WAV" "$INPUT_LIST"
chmod 644 "$OUTPUT_FILE"

echo "✅ Álbum completo creado: $(du -h "$OUTPUT_FILE")"
echo "🎧 Listo para usar en la Music Card Premium."