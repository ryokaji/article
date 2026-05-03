import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content" }),
  schema: z.object({
    title: z.string().default(""),
    description: z.string().optional(),
    weight: z.number().optional().default(0),
    bookToc: z.boolean().optional().default(true),
    bookHref: z.string().optional(),
    bookIcon: z.string().optional(),
    bookCollapseSection: z.boolean().optional().default(false),
    bookFlatSection: z.boolean().optional().default(false),
    bookHidden: z.boolean().optional().default(false),
    date: z.string().optional(),
  }),
});

export const collections = { docs };
