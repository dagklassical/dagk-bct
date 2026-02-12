# verificar-modo.sh
echo "=== ANÁLISIS DE PÁGINAS ==="
echo ""
echo "📁 src/pages/musica/discografia/[id].astro:"
echo "----------------------------------------"
if grep -q "getStaticPaths" src/pages/musica/discografia/\[id\].astro 2>/dev/null; then
    echo "✅ MODO: SSG (getStaticPaths detectado)"
    grep -n "getStaticPaths" src/pages/musica/discografia/\[id\].astro | head -1
elif grep -q "prerender = false" src/pages/musica/discografia/\[id\].astro 2>/dev/null; then
    echo "⚡ MODO: SSR (prerender = false)"
else
    echo "❓ MODO: Indeterminado (revisar manualmente)"
fi

echo ""
echo "📁 src/pages/blockchain/music-cards/[id].astro:"
echo "----------------------------------------"
if grep -q "getStaticPaths" src/pages/blockchain/music-cards/\[id\].astro 2>/dev/null; then
    echo "✅ MODO: SSG (getStaticPaths detectado)"
elif grep -q "prerender = false" src/pages/blockchain/music-cards/\[id\].astro 2>/dev/null; then
    echo "⚡ MODO: SSR (prerender = false)"
else
    echo "❓ MODO: Indeterminado"
fi

echo ""
echo "=== PRIMERAS LÍNEAS DE CADA ARCHIVO ==="
echo ""
echo "🎵 Discografía:"
head -15 src/pages/musica/discografia/\[id\].astro 2>/dev/null || echo "Archivo no encontrado"

echo ""
echo "💳 Music Cards:"
head -15 src/pages/blockchain/music-cards/\[id\].astro 2>/dev/null || echo "Archivo no encontrado"