// src/content/config.ts - VERSIÓN COMPLETA Y CORREGIDA
import { defineCollection, z } from 'astro:content';

const metadataSchema = z.object({
  uuid: z.string().startsWith('urn:uuid:'),
  timestamp: z.string().datetime(),
  operator: z.string().email()
});

// ============ ARTISTS ============
const artistsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
    country: z.string(),
    city: z.union([z.string(), z.null()]).optional().transform(val => val === null ? undefined : val),
    genre: z.array(z.string()),
    bio: z.string(),
    bioLong: z.string(),
    avatar: z.string(),
    website: z.union([z.string().url(), z.literal(''), z.null()]).optional().transform(val => val === '' || val === null ? undefined : val),
    social: z.object({
      instagram: z.union([z.string().url(), z.literal(''), z.null()]).optional().transform(val => val === '' || val === null ? undefined : val),
      youtube: z.union([z.string().url(), z.literal(''), z.null()]).optional().transform(val => val === '' || val === null ? undefined : val),
      facebook: z.union([z.string().url(), z.literal(''), z.null()]).optional().transform(val => val === '' || val === null ? undefined : val)
    }).optional(),
    releases: z.array(z.string()),
    musicCards: z.array(z.string()),
    metadata: metadataSchema,
    tagline: z.union([z.string(), z.null()]).optional().transform(val => val === null ? undefined : val)
  })
});

// ============ RELEASES - CON CAMPOS FALTANTES ============
const releasesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    workTitle: z.string(),
    composer: z.string(),
    performers: z.array(z.string()),
    title: z.string(),
    artistIds: z.array(z.string()),
    genre: z.union([z.string(), z.array(z.string())]).optional(),
    releaseDate: z.string(),
    type: z.enum(['álbum', 'ep', 'single', 'compilation']),
    status: z.enum(['lanzado', 'anunciado', 'proximamente']),
    description: z.string(),
    descriptionLong: z.string(),
    coverImage: z.string(),
    // ✅ NUEVO: demoBasePath que faltaba
    demoBasePath: z.string().optional(),
    demoAvailable: z.boolean().default(false),
    fullAlbumAvailable: z.boolean().default(false),
    sheetMusicAvailable: z.boolean().default(false),
    platforms: z.object({
      spotify: z.union([z.string().url(), z.null()]).optional(),
      apple: z.union([z.string().url(), z.null()]).optional(),
      youtube: z.union([z.string().url(), z.null()]).optional(),
      tidal: z.union([z.string().url(), z.null()]).optional(),
      deezer: z.union([z.string().url(), z.null()]).optional()
    }),
    tracks: z.array(
      z.object({
        title: z.string(),
        duration: z.string(),
        demoFile: z.string().optional().nullable(),
        protected: z.string().optional().nullable(),
        composer: z.string().optional().nullable(),
        workCatalogue: z.string().optional().nullable()
      })
    ),
    duration: z.string(),
    commentary: z.string().nullable().optional(),
    commentaryAuthor: z.string().nullable().optional(),
    musicCards: z.array(z.string()),
    metadata: metadataSchema,
    bioExtended: z.string().nullable().optional()
  })
});

// ============ MUSIC-CARDS ============
const musicCardsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    workTitle: z.string(),
    composer: z.string(),
    artist: z.string(),
    performers: z.array(z.string()),
    edition: z.enum(['Estándar', 'Limitada', 'Única', 'Founder']),
    associatedRelease: z.string(),
    totalSupply: z.number().int(),
    available: z.number().int(),
    blockchain: z.literal('Polygon'),
    tokenId: z.string(),
    price: z.string(),
    status: z.enum(['disponible', 'agotado', 'proximamente', 'próximo', 'vendida']),
    workType: z.string(),
    benefits: z.array(z.string()),
    cardImage: z.string(),
    socialLinks: z.array(
      z.object({
        platform: z.string(),
        url: z.union([z.string().url(), z.literal('')])
      })
    ),
    metadata: metadataSchema
  })
});

// ============ ACCESS TOKENS ============
const accessTokensCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    type: z.enum(['album', 'single', 'ep']),
    status: z.enum(['active', 'expired', 'revoked']).default('active'),
    associatedRelease: z.string(),
    associatedArtists: z.array(z.string()),
    content: z.object({
      audio: z.object({
        baseUrl: z.string().url(),
        format: z.enum(['flac', 'mp3', 'both']).default('flac'),
        quality: z.string().default('24/192')
      }),
      score: z.object({
        url: z.string().url(),
        format: z.enum(['pdf', 'interactive']).default('pdf'),
        signed: z.boolean().default(true)
      }).optional()
    }),
    access: z.object({
      method: z.enum(['token_url', 'wallet_verification', 'password']),
      expiresAt: z.string().datetime().optional(),
      maxUses: z.number().int().optional()
    }),
    theme: z.object({
      heroImage: z.string().url(),
      fallbackHero: z.string(),
      primaryColor: z.string().default('#800020')
    }),
    metadata: metadataSchema
  })
});

// ============ NOTICIAS ============
const noticiasCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    image: z.string(),
    summary: z.string(),
    tags: z.array(z.string())
  })
});

// ============ EXPORTS ============
export const collections = {
  artists: artistsCollection,
  releases: releasesCollection,
  'music-cards': musicCardsCollection,
  accessTokens: accessTokensCollection,
  noticias: noticiasCollection
};