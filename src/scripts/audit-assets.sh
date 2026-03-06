#!/bin/bash
# scripts/audit-assets.sh

echo "=== AUDITORÍA DE ASSETS ==="

# 1. Listar assets en Vercel (local)
echo -e "\n📦 En Vercel (public/):"
find public/{covers,cards,hero,artists} -type f \( -name "*.webp" -o -name "*.png" -o -name "*.jpg" \) -printf "%f\n" | sort | uniq > /tmp/vercel-assets.txt
wc -l /tmp/vercel-assets.txt

# 2. Listar assets en VPS (remoto)
echo -e "\n🖥️  En VPS (/var/www/dagklassical/images/):"
ssh daguser@194.163.143.239 "find /var/www/dagklassical/images -type f \( -name '*.webp' -o -name '*.png' -o -name '*.jpg' \) -printf '%f\n' | sort | uniq" > /tmp/vps-assets.txt
wc -l /tmp/vps-assets.txt

# 3. Comparar por colección
echo -e "\n🔍 Por colección:"
echo "covers:"
comm -12 <(grep "^cover-" /tmp/vercel-assets.txt | sort) <(grep "^cover-" /tmp/vps-assets.txt | sort) | wc -l
echo "cards:"
comm -12 <(grep "^mc-" /tmp/vercel-assets.txt | sort) <(grep "^mc-" /tmp/vps-assets.txt | sort) | wc -l
echo "heros:"
comm -12 <(grep "^hero-" /tmp/vercel-assets.txt | sort) <(grep "^hero-" /tmp/vps-assets.txt | sort) | wc -l

# 4. Assets SOLO en Vercel (candidatos a migrar)
echo -e "\n📤 Solo en Vercel (migrar):"
comm -23 /tmp/vercel-assets.txt /tmp/vps-assets.txt | head -20