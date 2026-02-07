import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    excerpt: z.string().optional(),
    cover: z.string().optional(),
    author: z.string().default("quirkybird"),
    summary_text: z.string().optional(),
  }),
});

export const collections = { blog };
