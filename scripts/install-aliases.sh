#!/bin/bash

# install-aliases.sh
# Instala alias para DAG Klassical en tu shell (bash/zsh)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ALIAS_FILE="$SCRIPT_DIR/aliases.sh"

# Detectar shell
if [[ "$SHELL" == *"zsh"* ]]; then
  SHELL_CONFIG="$HOME/.zshrc"
elif [[ "$SHELL" == *"bash"* ]]; then
  SHELL_CONFIG="$HOME/.bashrc"
else
  echo "⚠️  Shell no reconocido. Añade manualmente a tu archivo de configuración:"
  echo "   source $ALIAS_FILE"
  exit 1
fi

# Añadir source si no existe
if ! grep -q "aliases.sh" "$SHELL_CONFIG"; then
  echo "" >> "$SHELL_CONFIG"
  echo "# DAG Klassical aliases" >> "$SHELL_CONFIG"
  echo "source $ALIAS_FILE" >> "$SHELL_CONFIG"
  echo "✅ Alias instalados en $SHELL_CONFIG"
  echo "📌 Ejecuta: source $SHELL_CONFIG   (o reinicia tu terminal)"
else
  echo "ℹ️  Los alias ya están instalados."
fi