// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const noticias = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    image: z.string().optional(),
    summary: z.string().optional(),
    body: z.string(), // Contenido del MD
  }),
});

export const collections = { noticias };