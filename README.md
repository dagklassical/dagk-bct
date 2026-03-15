# 🎵 DAG Klassical

> Tokenización de obras clásicas y multimedia con regalías automáticas vía blockchain.

**Sitio principal**: [https://www.dagklassical.com](https://www.dagklassical.com)  
**Stack**: Astro + Web3 + IPFS + Polygon  
**Licencia**: Software Libre / Open Source

---

## 🔄 Nota importante: Redirect de sitio antiguo

> ⚠️ El sitio anterior en `https://dag-www.vercel.app` fue redirigido permanentemente (HTTP 308) a [https://www.dagklassical.com](https://www.dagklassical.com) el **15-Mar-2026**.  
> Cualquier enlace antiguo debería actualizar su bookmark.  
> Estado: ✅ Activo | 🗓️ Próxima revisión: 22-Mar-2026 (desindexación Google)

---

## 🚀 Estructura del proyecto

```text
/
├── public/          # Assets estáticos (imágenes, favicon, audio previews)
├── src/
│   ├── components/  # Componentes Astro/React reutilizables
│   ├── layouts/     # Layouts base (Head, Header, Footer)
│   ├── pages/       # Páginas .astro (rutas automáticas por nombre de archivo)
│   └── lib/         # Utilidades: web3, metadata, IPFS helpers
├── vercel.json      # Configuración de deploy y redirects
└── package.json
```

---

## 🧞 Comandos útiles

| Comando | Acción |
| --------- | -------- |
| `npm install` | Instala dependencias |
| `npm run dev` | Inicia servidor local en `localhost:4321` |
| `npm run build` | Build de producción → `./dist/` |
| `npm run preview` | Preview local del build |
| `npm run astro add <integration>` | Añade integraciones oficiales |
| `vercel --prod` | Deploy manual a Vercel (si no usas Git auto-deploy) |

---

## 🔐 Configuración de entorno

Variables requeridas (crear `.env.local`):

```bash
# Vercel Analytics (se inyecta automáticamente en prod)
VERCEL_ANALYTICS_ID=

# Web3 / Blockchain
PUBLIC_POLYGON_RPC_URL=
PUBLIC_CONTRACT_ADDRESS=

# IPFS / Storage
PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

> 📌 Tip: Usa `vercel env pull` para sincronizar variables desde el dashboard.

---

## 🎵 Music Cards & Metadata

- Formato: JSON estructurado para créditos perpetuos (artista, productor, diseñador, dev, tenedor)
- Estándares: ERC-721 / ERC-1155 para NFTs musicales
- Streaming: API para monetizar cada "play" en tokens

📄 Ver documentación completa en: `docs/music-cards.md` *(por crear)*

---

## 🤝 Contribuir

1. Fork del repo
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'feat: descripción clara'`
4. Push y abre un Pull Request

---

## 📜 Licencia

Este proyecto es **Software Libre**. Consulta `LICENSE` para detalles.
