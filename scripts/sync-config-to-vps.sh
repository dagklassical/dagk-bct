#!/bin/bash
# Sincroniza src/data/*.json con el VPS (excepto access.json)

set -euo pipefail

VPS_HOST="194.163.143.239"  # ← Reemplaza con tu alias o IP
VPS_USER="daguser" # ← Reemplaza con tu usuario
REMOTE_DIR="/var/www/dagklassical/config"

echo "🔄 Sincronizando archivos de configuración con el VPS..."

# Copiar archivos de datos (sin sobrescribir access.json)
rsync -avz \
  --exclude='access.json' \
  --exclude='search-index.js' \
  --chmod=644 \
  src/data/ \
  ${VPS_USER}@${VPS_HOST}:${REMOTE_DIR}/

echo "✅ Sincronización completada."
echo "⚠️  access.json NO fue modificado (se mantiene en el VPS)"