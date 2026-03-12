// src/lib/asset-resolver.ts

export const ASSET_DOMAIN = 'https://audio.dagklassical.com';

export function resolveCover(filename: string): string {
  if (filename.startsWith('http')) {
    return filename;
  }
  
  const cleanName = filename
    .replace(/^\/covers\//, '')
    .replace(/^\/images\/covers\//, '');
  
  return `${ASSET_DOMAIN}/images/covers/${cleanName}`;
}

export function resolveCard(filename: string): string {
  if (filename.startsWith('http')) {
    return filename;
  }
  
  const cleanName = filename
    .replace(/^\/cards\//, '')
    .replace(/^\/images\/cards\//, '');
  
  return `${ASSET_DOMAIN}/images/cards/${cleanName}`;
}

export function resolveAvatar(filename: string): string {
  if (filename.startsWith('http')) {
    return filename;
  }
  
  const cleanName = filename
    .replace(/^\/artists\//, '')
    .replace(/^\/images\/artists\//, '');
  
  return `/artists/${cleanName}`;
}

export function resolveAsset(filename: string, type: 'cover' | 'card' | 'avatar'): string {
  switch (type) {
    case 'cover':
      return resolveCover(filename);
    case 'card':
      return resolveCard(filename);
    case 'avatar':
      return resolveAvatar(filename);
    default:
      return filename;
  }
}