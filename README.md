# Yasin's Blog

A modern, lightweight, open-source blog built with [Astro](https://astro.build), featuring a beautiful sidebar navigation, dark mode support, and optimized performance.

**Live:** https://yasin.kavakli.at

## Features

- **Lightning-fast** - Static site generation with 100/100 Lighthouse performance
- **Dark Mode** - Automatic theme switching with persistent user preferences
- **Responsive Design** - Beautiful on all devices with Tailwind CSS
- **Content Collections** - Type-safe markdown/MDX blog posts with frontmatter validation
- **RSS Feed** - Subscribe to new posts at `/rss.xml`
- **Sitemap** - SEO-friendly sitemap for search engines
- **OG Images** - Automatic Open Graph image generation for social sharing
- **Reading Time** - Automatic reading time calculation for each post
- **Theme Toggle** - Light/dark theme with visual feedback
- **Animated Icons** - Smooth animations powered by motion/react
- **Sidebar Navigation** - Intuitive navigation with dynamic state management

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

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
│   └── assets/            # Blog post assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── ui/           # Shadcn UI components
│   │   ├── app-sidebar.tsx # Main sidebar navigation
│   │   └── layout-wrapper.tsx # Layout wrapper
│   ├── content/
│   │   └── blog/         # Blog post markdown files
│   ├── layouts/
│   │   ├── BaseLayout.astro     # Base layout
│   │   └── BlogPost.astro       # Blog post layout
│   ├── pages/
│   │   ├── index.astro          # Home page
│   │   ├── blog/                # Blog pages
│   │   ├── og/                  # OG image generators
│   │   └── rss.xml.js           # RSS feed
│   ├── lib/
│   │   ├── blog-utils.ts        # Blog utilities
│   │   └── remark-reading-time.mjs # Reading time plugin
│   └── styles/                  # Global styles
├── astro.config.mjs             # Astro configuration
├── wrangler.jsonc               # Cloudflare Pages config
└── package.json
```

## Creating Blog Posts

1. Create a new markdown file in `src/content/blog/`:

```markdown
---
title: My First Post
description: A brief description of the post
pubDate: 2024-11-26
updatedDate: 2024-11-26
---

# Your content here

This supports **markdown** and *formatting*.
```

2. The post will automatically appear on `/blog` and be included in the RSS feed

## Available Commands

| Command | Action |
|---------|--------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start local dev server (`localhost:4321`) |
| `pnpm build` | Build production site to `./dist/` |
| `pnpm preview` | Preview production build locally |
| `pnpm astro add` | Add Astro integrations |

## Deployment

### Cloudflare Pages

This site is configured for [Cloudflare Pages](https://pages.cloudflare.com/) deployment.

#### Option 1: Automatic (Recommended)
1. Push code to GitHub
2. Connect repository to Cloudflare Pages
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy automatically on every push

#### Option 2: Manual with Wrangler
```bash
pnpm build
npx wrangler pages deploy ./dist
```

## Tech Stack

- **Framework**: [Astro](https://astro.build)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com)
- **Animations**: [motion/react](https://motion.dev)
- **Markdown**: [Astro's native markdown](https://docs.astro.build/en/guides/markdown-content/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)

## Customization

### Colors & Theme
Edit `tailwind.config.mjs` and `src/styles/global.css` to customize colors and styling.

### Site Metadata
Update `src/consts.ts`:
```typescript
export const SITE_TITLE = 'Your Name';
export const SITE_DESCRIPTION = 'Your description';
```

### Navigation
Edit `src/components/app-sidebar.tsx` to customize the sidebar navigation and projects.

### Avatar
Replace `public/avatar.png` with your own avatar image.

## Performance

Built-in optimizations include:
- Static site generation (no server overhead)
- Automatic image optimization
- Responsive image breakpoints (640px, 1024px, 1440px)
- Code splitting and lazy loading
- SEO-friendly with sitemap and RSS feed

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## Contact

- Website: https://yasin.kavakli.at
- Twitter: [@yasinkavakli](https://twitter.com/yasinkavakli)

## Acknowledgments

- [Astro](https://astro.build) - The amazing framework
- [Shadcn UI](https://ui.shadcn.com) - Beautiful components
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- Inspired by minimalist design principles

---

**Start your own blog** - Fork this repository and make it your own!
