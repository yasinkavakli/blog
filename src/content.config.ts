import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	// Pattern excludes files starting with underscore (e.g., _template.md for Obsidian templates)
	loader: glob({ base: './src/content/blog', pattern: '**/[^_]*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) => {
		return z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			// Draft posts are hidden in production but visible in dev
			draft: z.boolean().default(false),
			// Use proper image validation for all hero images
			heroImage: image().optional(),
			// heroImageLight and heroImageDark are simple string filenames, resolved to /assets/{slug}/ in layout
			heroImageLight: z.string().optional(),
			heroImageDark: z.string().optional(),
			// Tags for categorizing posts
			tags: z.array(z.string()).optional(),
			// Custom slug for post URL (overrides default file-based slug)
			slug: z.string().optional(),
		});
	},
});

export const collections = { blog };
