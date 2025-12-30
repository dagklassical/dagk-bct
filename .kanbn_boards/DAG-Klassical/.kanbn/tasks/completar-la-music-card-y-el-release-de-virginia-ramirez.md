---
created: 2025-12-30T04:28:36.080Z
updated: 2025-12-30T10:44:35.722Z
assigned: apradoc
progress: 0
tags:
  - music-card
  - virginia-ramirez
  - flac
  - mp3
  - vps
  - vercel
started: 2025-12-28T00:00:00.000Z
completed: 2025-12-28T00:00:00.000Z
---

# Completar la Music Card y el release de "Virginia Ramirez"

Descargar desde WeTransfer Montar en el servidor y generar demos de 32 seg fadeout 2 seg

## Sub-tasks

- [x] Descargar de WeTransfer
- [ ] mp3 320 subir a Vercel
- [ ] Subir Flacs a VPS
- [x] Convertir de wav a flac ya mp3

## Comments

- author: apradoc
  date: 2025-12-30T04:44:59.724Z
  no se pudo descargar via curl. Por navegador faltan 3 horas. Como a las 3:45
- author: apradoc
  date: 2025-12-30T04:45:52.386Z
  ```bash convertir_v2_normalizado.sh
  #!/bin/bash
  
  # Comprobación de seguridad: verificar que ffmpeg está instalado
  if ! command -v ffmpeg &> /dev/null; then
      echo "Error: FFmpeg no está instalado."
      exit 1
  fi
  
  # Crear carpetas
  mkdir -p "FLAC_24_192"
  mkdir -p "MP3_DEMO_320"
  
  echo "=== Iniciando conversión por lotes ==="
  
  for archivo in *.wav; do
      # Si no hay archivos wav, salir del bucle
      [ -e "$archivo" ] || continue
  
      nombre_base=$(basename "$archivo" .wav)
      
      echo "Procesando: $nombre_base"
  
      # 1. FLAC 24-bit / 192kHz (Sin cambios, calidad pura)
      ffmpeg -y -i "$archivo" \
      -c:a flac -sample_fmt s32 -ar 192000 \
      "FLAC_24_192/${nombre_base}.flac" -loglevel error
      
      echo "  [OK] FLAC Hi-Res generado."
  
      # 2. MP3 Demo 320kbps + Normalizado + Fade Out
      # Explicación de los filtros (-af):
      # loudnorm=I=-14:TP=-1 : Normaliza el volumen percibido a -14 LUFS (estándar streaming) y evita picos (-1dB).
      # afade=t=out:st=30:d=2 : Aplica el desvanecido al final.
      
      ffmpeg -y -i "$archivo" -t 32 \
      -c:a libmp3lame -b:a 320k \
      -af "loudnorm=I=-14:TP=-1,afade=t=out:st=30:d=2" \
      "MP3_DEMO_320/${nombre_base}_demo.mp3" -loglevel error
  
      echo "  [OK] MP3 Normalizado generado."
      echo "-------------------------------------"
  done
  
  echo "¡Trabajo terminado! Archivos organizados en sus carpetas."
  
  ```
