// src/utils/breadcrumbs.ts

// ✅ Diccionario opcional: mapea segmentos de URL → nombres humanos
const BREADCRUMB_LABELS: Record<string, string> = {
  // Rutas funcionales
  'blockchain': 'Blockchain',
  'music-cards': 'Music Cards',
  'acceso': 'Acceso Privado',
  'artistas': 'Artistas',
  'discografia': 'Discografía',
  'noticias': 'Noticias',
  'nosotros': 'Nosotros',
  'musica': 'Música',

  // Abreviaturas o códigos
  'bct': 'DAG Klassical BCT',
  'mcard': 'Music Card',

  // Si usas IDs técnicos que NO quieres mostrar
  // 'xyz123': null, // ← ver más abajo cómo excluir
};

// ✅ Opción: lista de segmentos a EXCLUIR del breadcrumb
// Útil para tokens, hashes, IDs aleatorios que no aportan contexto
const EXCLUDED_SEGMENTS = new Set([
  // Ejemplo: si sabes que ciertos patrones son tokens
  // Puedes usar regex más adelante, pero esto es simple y seguro
]);

/**
 * Convierte un slug en un título legible (ej. "mi-noticia" → "Mi Noticia")
 */
function slugToTitle(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Genera breadcrumbs a partir de Astro.url.pathname,
 * con soporte para labels personalizados y exclusión de segmentos.
 */
export function generateBreadcrumbs(pathname: string): { label: string; href: string }[] {
  // Caso raíz
  if (pathname === '/') {
    return [{ label: 'Inicio', href: '/' }];
  }

  const segments = pathname
    .split('/')
    .filter(Boolean)
    .map(decodeURIComponent);

  const breadcrumbs = [{ label: 'Inicio', href: '/' }];
  let currentPath = '';

  for (const segment of segments) {
    currentPath += `/${segment}`;
    const href = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;

    // 🔹 ¿Queremos excluir este segmento?
    if (EXCLUDED_SEGMENTS.has(segment)) {
      // Aún construimos la URL (para que el enlace funcione),
      // pero NO añadimos un nuevo breadcrumb
      continue;
    }

    // 🔹 ¿Tenemos un label personalizado?
    let label = BREADCRUMB_LABELS[segment];

    if (label === undefined) {
      // No hay override → usar conversión automática
      label = slugToTitle(segment);
    } else if (label === null) {
      // Si el label es `null`, lo excluimos (opcional avanzado)
      continue;
    }

    breadcrumbs.push({ label, href });
  }

  return breadcrumbs;
}