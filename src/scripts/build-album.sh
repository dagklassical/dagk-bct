#!/bin/bash
# build-album.sh
# Genera el archivo completo del álbum en orden correcto

ALBUM_DIR="/var/www/dagklassical/protected/audio/gerulewicz-piano-aguinaldo"
OUTPUT_FILE="${ALBUM_DIR}/gerulewicz-piano-aguinaldo-complete.flac"

# Lista de tracks en orden exacto (según releases.json)
TRACKS=(
  "corre-caballito.flac"
  "din-din-din.flac"
  "nino-lindo.flac"
  "pascua-florida.flac"
  "venid-pastorcillos.flac"
  "precioso-querube.flac"
  "casta-paloma.flac"
  "sublime-ideal.flac"
  "de-contento.flac"
  "salve-salve.flac"
  "aguinaldo-caraqueno.flac"
  "a-ti-te-cantamos.flac"
  "la-cabra-mocha.flac"
  "aguinaldo-margariteno.flac"
  "cantemos.flac"
  "himno-de-venezuela-cancion-de-cuna.flac"
)

# Verificar que todos los archivos existan
for track in "${TRACKS[@]}"; do
  if [ ! -f "${ALBUM_DIR}/${track}" ]; then
    echo "❌ Error: ${track} no encontrado"
    exit 1
  fi
done

echo "✅ Todos los tracks verificados. Creando lista temporal..."

# Crear lista de entrada para ffmpeg
INPUT_LIST="${ALBUM_DIR}/tracks.txt"
> "$INPUT_LIST"  # Limpiar archivo
for track in "${TRACKS[@]}"; do
  echo "file '${ALBUM_DIR}/${track}'" >> "$INPUT_LIST"
done

echo "🔄 Concatenando tracks..."

# Concatenar con ffmpeg (sin re-encode = rápido y sin pérdida)
ffmpeg -f concat -safe 0 -i "$INPUT_LIST" -c copy "$OUTPUT_FILE"

# Verificar resultado
if [ -f "$OUTPUT_FILE" ]; then
  echo "✅ Álbum completo creado: $(du -h "$OUTPUT_FILE")"
  # Limpiar lista temporal
  rm "$INPUT_LIST"
  # Asegurar permisos
  chmod 644 "$OUTPUT_FILE"
else
  echo "❌ Error: No se creó el archivo de salida"
  exit 1
fi