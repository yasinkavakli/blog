// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';
import { remarkReadingTime } from './src/lib/remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
  // Site URL used for sitemap generation and canonical URLs
  site: 'https://yasin.kavakli.at',

  integrations: [
    // MDX support for enhanced markdown with React components
    mdx(),
    // Automatic sitemap generation for SEO
    sitemap(),
    // React integration for interactive components (used in sidebar nav)
    react(),
  ],

  // Markdown configuration for blog posts
  markdown: {
    // Custom remark plugin to calculate and inject reading time into frontmatter
    remarkPlugins: [remarkReadingTime],
    // Syntax highlighting configuration using Shiki
    shikiConfig: {
      themes: {
        // GitHub Light theme for light mode
        light: 'github-light',
        // GitHub Dark theme for dark mode
        dark: 'github-dark',
      },
    },
  },

  // Image optimization configuration
  image: {
    // Enable automatic responsive image style generation
    // This generates CSS for optimal image rendering at different screen sizes
    responsiveStyles: true,
    // Define breakpoints for responsive image optimization
    // Images will be optimized for mobile (640px), tablet (1024px), and desktop (1440px)
    breakpoints: [640, 1024, 1440],
  },

  // Vite build tool configuration
  vite: {
    // Tailwind CSS plugin for utility-first styling
    plugins: [tailwindcss()],
    resolve: {
      // Path aliases for cleaner imports throughout the codebase
      alias: {
        // @/components → src/components
        '@/components': new URL('./src/components', import.meta.url).pathname,
        // @/lib → src/lib
        '@/lib': new URL('./src/lib', import.meta.url).pathname,
      },
    },
  },
});