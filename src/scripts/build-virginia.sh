#!/bin/bash
# build-virginia.sh
# Genera álbum completo de Virginia Ramírez - Capítulos

ALBUM_DIR="/var/www/dagklassical/protected/audio/virginia-ramirez-capitulos"
OUTPUT_FILE="${ALBUM_DIR}/virginia-ramirez-capitulos-complete.flac"
TEMP_WAV="${ALBUM_DIR}/temp_concat.wav"

# Lista de tracks en orden exacto (según releases.json)
TRACKS=(
  "ramirez-capitulos-preludio-para-boby.flac"
  "ramirez-capitulos-blues-con-sangueo.flac"
  "ramirez-capitulos-domingo-por-la-tarde.flac"
  "ramirez-capitulos-dias-de-julio.flac"
  "ramirez-capitulos-don-alen.flac"
  "ramirez-capitulos-dulcinea.flac"
  "ramirez-capitulos-espiral-de-fuego.flac"
  "ramirez-capitulos-guasipati.flac"
  "ramirez-capitulos-manos-y-alma.flac"
  "ramirez-capitulos-azul-y-verde.flac"
  "ramirez-capitulos-rapguinaldo.flac"
)

# Verificar que todos los archivos existan
for track in "${TRACKS[@]}"; do
  if [ ! -f "${ALBUM_DIR}/${track}" ]; then
    echo "❌ Error: ${track} no encontrado"
    exit 1
  fi
done

echo "✅ Todos los tracks de Virginia verificados."

# Crear lista para ffmpeg
INPUT_LIST="${ALBUM_DIR}/tracks.txt"
> "$INPUT_LIST"
for track in "${TRACKS[@]}"; do
  echo "file '${ALBUM_DIR}/${track}'" >> "$INPUT_LIST"
done

echo "🔄 Concatenando Virginia Ramírez..."

# Concatenar a WAV temporal
ffmpeg -f concat -safe 0 -i "$INPUT_LIST" -c:a pcm_s24le "$TEMP_WAV" -y

# Convertir a FLAC final
ffmpeg -i "$TEMP_WAV" -c:a flac -compression_level 8 "$OUTPUT_FILE" -y

# Limpiar
rm -f "$TEMP_WAV" "$INPUT_LIST"
chmod 644 "$OUTPUT_FILE"

echo "✅ Álbum de Virginia creado: $(du -h "$OUTPUT_FILE")"