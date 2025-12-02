import { defineCollection, z } from 'astro:content';

const noticias = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    image: z.string().optional(),
    summary: z.string().optional(),
    // ✅ CORRECCIÓN: Acepta tanto array como string para tags
    tags: z.array(z.string()).optional().default([]),
    // Si prefieres mantener compatibilidad con strings:
    // tags: z.union([z.array(z.string()), z.string()]).optional().transform(val => {
    //   if (typeof val === 'string') return [val];
    //   return val || [];
    // })
  }),
});

export const collections = { noticias };