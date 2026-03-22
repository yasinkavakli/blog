# Yasin's Blog

A modern, lightweight blog built with [Astro](https://astro.build), featuring dark mode support, dynamic OG images, and optimized performance.

**Live:** https://yasin.kavakli.at

## Features

- **Lightning-fast** - Static site generation with 100/100 Lighthouse performance
- **Dark Mode** - Automatic theme switching with persistent user preferences
- **Responsive Design** - Mobile-first layout with Tailwind CSS v4
- **Content Collections** - Type-safe MDX blog posts with frontmatter validation
- **RSS Feed** - Subscribe to new posts at `/rss.xml`
- **Sitemap** - SEO-friendly sitemap for search engines
- **OG Images** - Automatic Open Graph image generation with Satori
- **Reading Time** - Automatic reading time calculation for each post
- **Multiple Post Layouts** - Default, overlay, split, wide, full, ToC, and more
- **Tag System** - Filter posts by tags with dedicated tag pages

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/yasinkavakli/blog.git
cd blog

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The site will be available at `http://localhost:4321`

## Project Structure

```
├── public/                 # Static assets
│   ├── avatar.png         # Avatar image
│   └── fonts/             # Self-hosted fonts
├── src/
│   ├── components/        # Reusable Astro components
│   │   ├── BaseHead.astro # SEO metadata & theme script
│   │   ├── Header.astro   # Navigation
│   │   ├── Footer.astro   # Footer with social links
│   │   └── ThemeToggle.astro # Light/dark/system toggle
│   ├── content/
│   │   └── blog/         # Blog post MDX files
│   ├── layouts/
│   │   ├── BlogLayout.astro   # Base page layout
│   │   └── BlogPost.astro     # Blog post layout (multiple variants)
│   ├── pages/
│   │   ├── index.astro        # Home page
│   │   ├── about.astro        # About page
│   │   ├── uses.astro         # Uses/tools page
│   │   ├── 404.astro          # Not found page
│   │   ├── blog/              # Blog pages
│   │   └── rss.xml.js         # RSS feed
│   ├── lib/
│   │   ├── blog-utils.ts      # Blog utilities
│   │   ├── slug.ts            # Slug generation
│   │   └── remark-reading-time.mjs # Reading time plugin
│   └── styles/
│       └── global.css         # Tailwind config & design tokens
├── astro.config.mjs           # Astro configuration
├── wrangler.toml              # Cloudflare Pages config
└── package.json
```

## Creating Blog Posts

1. Create a new MDX file in `src/content/blog/`:

```markdown
---
title: My First Post
description: A brief description of the post
pubDate: 2025-01-01
tags:
    - example
---

Your content here. Supports **markdown** and *formatting*.
```

2. The post will automatically appear on `/blog` and be included in the RSS feed.

## Available Commands

| Command | Action |
|---------|--------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start local dev server (`localhost:4321`) |
| `pnpm build` | Build production site to `./dist/` |
| `pnpm preview` | Preview production build locally |

## Deployment

### Cloudflare Pages

This site is configured for [Cloudflare Pages](https://pages.cloudflare.com/) deployment.

#### Option 1: Automatic (Recommended)
1. Push code to GitHub
2. Connect repository to Cloudflare Pages
3. Set build command: `pnpm build`
4. Set output directory: `dist`
5. Deploy automatically on every push

#### Option 2: Manual with Wrangler
```bash
pnpm build
npx wrangler pages deploy ./dist
```

## Tech Stack

- **Framework**: [Astro](https://astro.build)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Typography**: [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography)
- **OG Images**: [Satori](https://github.com/vercel/satori) + [resvg](https://github.com/nicolo-ribaudo/resvg-js)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)

## Customization

### Colors & Theme
Edit `src/styles/global.css` to customize the OKLCH-based design tokens.

### Site Metadata
Update `src/consts.ts`:
```typescript
export const SITE_TITLE = 'Your Name';
export const SITE_DESCRIPTION = 'Your description';
```

### Fonts
Self-hosted Instrument Sans (body), Instrument Serif (headings), and JetBrains Mono (code).

### Avatar
Replace `public/avatar.png` with your own avatar image.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- [Astro](https://astro.build)
- [Tailwind CSS](https://tailwindcss.com)
- [Brian Lovin](https://brianlovin.com) - Design inspiration

---

**Start your own blog** - Fork this repository and make it your own!
