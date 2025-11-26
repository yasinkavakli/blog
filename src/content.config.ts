import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) => {
		return z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			// Use proper image validation for all hero images
			heroImage: image().optional(),
			// heroImageLight and heroImageDark are simple string filenames, resolved to /assets/{slug}/ in layout
			heroImageLight: z.string().optional(),
			heroImageDark: z.string().optional(),
		});
	},
});

export const collections = { blog };
