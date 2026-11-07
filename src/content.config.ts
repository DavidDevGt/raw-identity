import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Projects live in src/content/case-studies/<lang>/<slug>.md, with the same slug in every language so the
// language switcher keeps the page. Only `title`, `summary`, `lang` and `stack` are required: leave a field
// out rather than filling it with something that did not happen. Empty sections are not rendered.
const caseStudies = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			summary: z.string(),
			lang: z.enum(['es', 'en']),
			year: z.number().int().optional(),
			order: z.number().default(100),
			draft: z.boolean().default(false),
			stack: z.array(z.string()).min(1),
			// The live demo. Without it, the project is labeled as having no public demo.
			link: z.url().optional(),
			// Screenshots of the real product. The card shows the first one.
			shots: z.array(z.object({ src: image(), alt: z.string(), caption: z.string().optional() })).default([]),
			// Replaces the first screenshot on the card, when cropping it to 4:3 would miss the point of the image.
			cover: image().optional(),
			// What the cover shows. Needed because it is a different image from the first screenshot.
			coverAlt: z.string().optional(),
			// Stacks the screenshots at full width, for captures too wide to read in the walkthrough layout.
			wideShots: z.boolean().default(false),
			// How the system flows, step by step. Takes the place of a screenshot when there is no public screen.
			pipeline: z.array(z.string()).default([]),
			// Facts about how the system is built, shown large on the card. Not results: project pages show no metrics.
			highlights: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
			// What a visitor sees and can try in the demo.
			seen: z.string().optional(),
			challenge: z.string().optional(),
			approach: z.array(z.string()).default([]),
			tradeoffs: z.array(z.string()).default([]),
			// For a project whose design is the story: the system's layers, what it runs on, its flows and why it is built this way.
			architecture: z
				.object({
					intro: z.string(),
					layers: z.array(z.object({ name: z.string(), tech: z.string().optional(), detail: z.string() })),
					services: z.array(z.object({ name: z.string(), role: z.string() })),
					profiles: z.array(z.object({ name: z.string(), note: z.string(), steps: z.array(z.string()) })).default([]),
					decisions: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
				})
				.optional(),
		}),
});

export const collections = { caseStudies };
