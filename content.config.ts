import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "page",
      source: "blog/**",
      schema: z.object({
        date: z.preprocess(
          (val) => (val instanceof Date ? val.toISOString().slice(0, 10) : val),
          z.string(),
        ),
        readTime: z.string(),
        tags: z.array(z.string()),
        excerpt: z.string(),
      }),
    }),
  },
});
