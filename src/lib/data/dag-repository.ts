// src/lib/data/dag-repository.ts - CREAR ESTE ARCHIVO
import { getCollection, getEntry } from 'astro:content';

// ============ ARTISTS ============
export async function getAllArtists() {
  return await getCollection('artists');
}

export async function getArtistBySlug(slug: string) {
  return await getEntry('artists', slug);
}

// ============ RELEASES ============
export async function getAllReleases() {
  return await getCollection('releases');
}

export async function getReleaseBySlug(slug: string) {
  return await getEntry('releases', slug);
}

// ============ MUSIC CARDS ============
export async function getAllMusicCards() {
  return await getCollection('music-cards');
}

export async function getMusicCardBySlug(slug: string) {
  return await getEntry('music-cards', slug);
}

// ============ ACCESS TOKENS ============
export async function getAllAccessTokens() {
  return await getCollection('accessTokens');
}

export async function getAccessTokenById(id: string) {
  return await getEntry('accessTokens', id);
}