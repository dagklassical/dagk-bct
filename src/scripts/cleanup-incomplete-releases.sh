#!/bin/bash
# scripts/cleanup-incomplete-releases.sh

cd ~/dev/gitlab/dagklassical/dagk-bct/src/content/releases

# Archivos que SÍ queremos mantener (ya validados)
KEEP=(
  "filip-bandzak-mahler-lieder.json"
  "jesus-bello-te-hare-pescador.json"
  "gerardo-gerulewicz-piano-aguinaldo.json"
  "orquesta-academica-de-moscu-momentos-musicales-vol-1.json"
  "orquesta-academica-de-moscu-momentos-musicales-vol-2.json"
  "orquesta-academica-de-moscu-momentos-musicales-vol-3.json"
  "orquesta-academica-de-moscu-momentos-musicales-vol-4.json"
  "virginia-ramirez-capitulos.json"
  "goulnara-galimchina-schubert-d960.json"
)

echo "🗑️  Limpiando releases incompletos..."
deleted=0

for json in *.json; do
  # Verificar si está en la lista de mantener
  keep=false
  for good in "${KEEP[@]}"; do
    if [ "$json" = "$good" ]; then
      keep=true
      break
    fi
  done
  
  if [ "$keep" = true ]; then
    echo "✅ Mantener: $json"
  else
    echo "🗑️  Borrar: $json"
    rm "$json"
    ((deleted++))
  fi
done

echo ""
echo "=== RESUMEN ==="
echo "Archivos borrados: $deleted"
echo "Archivos mantenidos: ${#KEEP[@]}"
echo "Total restante: $(ls *.json 2>/dev/null | wc -l)"