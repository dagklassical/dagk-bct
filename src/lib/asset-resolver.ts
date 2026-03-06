// src/lib/asset-resolver.ts
export const ASSET_DOMAIN = 'https://audio.dagklassical.com';

export function resolveAsset(path: string, type: 'cover' | 'card' | 'hero' | 'avatar'): string {
  // Avatares de artistas se quedan en Vercel (CDN)
  if (type === 'avatar') {
    return path.startsWith('/') ? path : `/${path}`;
  }
  
  // Todo lo demás va al subdominio de audio
  const cleanPath = path.replace(/^\/?(covers|cards|hero|images)\//, '');
  const folder = type === 'cover' ? 'covers' : type === 'card' ? 'cards' : 'heros';
  
  return `${ASSET_DOMAIN}/images/${folder}/${cleanPath}`;
}