import { defineCollection, z } from 'astro:content';

const noticias = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(), // Usa coerce para convertir strings a Date
    image: z.string().optional(),
    summary: z.string().optional(),
    tags: z.array(z.string()).optional(),
    // ¡NO incluyas body aquí! Se maneja automáticamente
  }),
});

export const collections = { noticias };