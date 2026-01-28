#!/bin/bash
# build-album-safe.sh
# Método seguro para concatenar FLAC

ALBUM_DIR="/var/www/dagklassical/protected/audio/gerulewicz-piano-aguinaldo"
OUTPUT_FILE="${ALBUM_DIR}/gerulewicz-piano-aguinaldo-complete.flac"
TEMP_WAV="${ALBUM_DIR}/temp_concat.wav"

# Lista de tracks en orden exacto
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

echo "✅ Todos los tracks verificados."

# Crear lista de entrada para ffmpeg
INPUT_LIST="${ALBUM_DIR}/tracks.txt"
> "$INPUT_LIST"
for track in "${TRACKS[@]}"; do
  echo "file '${ALBUM_DIR}/${track}'" >> "$INPUT_LIST"
done

echo "🔄 Convirtiendo y concatenando (esto tomará unos minutos)..."

# Método seguro: convertir a WAV temporal, luego a FLAC
ffmpeg -f concat -safe 0 -i "$INPUT_LIST" -c:a pcm_s24le "$TEMP_WAV"

if [ ! -f "$TEMP_WAV" ]; then
  echo "❌ Error: No se creó el archivo WAV temporal"
  rm -f "$INPUT_LIST"
  exit 1
fi

# Convertir WAV a FLAC final
ffmpeg -i "$TEMP_WAV" -c:a flac -compression_level 8 "$OUTPUT_FILE"

# Limpiar
rm -f "$TEMP_WAV" "$INPUT_LIST"

# Verificar resultado
if [ -f "$OUTPUT_FILE" ]; then
  echo "✅ Álbum completo creado: $(du -h "$OUTPUT_FILE")"
  chmod 644 "$OUTPUT_FILE"
else
  echo "❌ Error: No se creó el archivo FLAC final"
  exit 1
fi