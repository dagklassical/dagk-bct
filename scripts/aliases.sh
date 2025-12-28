#!/bin/bash

# Aliases para crear nuevas entidades en DAG Klassical
# Uso: 
#   new-artist <id>
#   new-release <id>
#   new-music-card <id>

new-artist() {
  if [ -z "$1" ]; then
    echo "Uso: new-artist <id-del-artista>"
    return 1
  fi
  node scripts/create-from-template.mjs artist "$1"
}

new-release() {
  if [ -z "$1" ]; then
    echo "Uso: new-release <id-del-lanzamiento>"
    return 1
  fi
  node scripts/create-from-template.mjs release "$1"
}

new-music-card() {
  if [ -z "$1" ]; then
    echo "Uso: new-music-card <id-de-la-music-card>"
    return 1
  fi
  node scripts/create-from-template.mjs musiccard "$1"
}