# AGENTS.md

This file documents development practices and guidelines for working on this blog project.

## Project Overview

This is an open-source blog built with Astro, featuring a modern sidebar navigation, dark mode support, and optimized performance. The project is designed to be forked and customized by other developers.

## Development Standards

### Code Style

- Use 2 spaces for indentation (not tabs)
- Follow the existing code structure and patterns
- Use TypeScript for component type safety
- Prefer functional components and hooks for React components

### File Organization

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # Shadcn UI components
│   ├── components/  # Feature components with icons
│   └── app-sidebar.tsx
├── content/         # Content collections (blog posts)
├── layouts/         # Page layouts
├── pages/          # Route pages
└── lib/            # Utilities and helpers
```

### Naming Conventions

- Use kebab-case for file names: `app-sidebar.tsx`, `blog-utils.ts`
- Use PascalCase for component names: `AppSidebar`, `NavItem`
- Use camelCase for functions and variables: `hasBlogPosts()`, `isActive`

### React Components

- Always import React explicitly when using hooks
- Use forward refs where appropriate (e.g., icon components)
- Implement proper TypeScript interfaces for props
- Use motion/react for animations, not CSS

Example:
```typescript
import React from 'react';

interface MyComponentProps {
  title: string;
  isActive?: boolean;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, isActive }) => {
  const [state, setState] = React.useState(false);
  return <div>{title}</div>;
};
```

### Blog Posts

Blog posts are stored in `src/content/blog/` as Markdown files with required frontmatter:

```markdown
---
title: Post Title
description: Brief description for RSS and metadata
pubDate: 2024-11-26
updatedDate: 2024-11-26  # Optional
---

# Your content
```

Reading time is automatically calculated and injected by the `remark-reading-time` plugin.

### Assets and Images

- Store blog post assets in `public/assets/`
- Use descriptive alt text for all images
- Optimize images before committing (use WebP format where possible)
- Reference images relative to the public directory

### Performance Guidelines

- Keep bundle size minimal - only import what you need
- Use React code splitting with `client:idle` or `client:only` where appropriate
- Optimize images with Astro's built-in image optimization
- Lazy load heavy components when possible

## Git Workflow

### Commit Messages

Follow conventional commits format:

- `feat: Add new feature`
- `fix: Bug fix`
- `docs: Documentation changes`
- `style: Code style changes (no logic)`
- `refactor: Code refactoring`
- `perf: Performance improvements`
- `test: Add/update tests`

Example:
```
feat: Add reading time to blog posts

- Calculate reading time from markdown content
- Display in blog post layout
- Automatically inject into frontmatter via remark plugin
```

### Branch Naming

Use descriptive branch names:
- `feature/sidebar-navigation`
- `fix/rss-feed-encoding`
- `docs/deployment-guide`

### Pull Requests

Before submitting a PR:
1. Ensure build passes: `pnpm build`
2. Run dev server and test locally: `pnpm dev`
3. Verify no lint errors (if linting is configured)
4. Update README if adding features
5. Add descriptive PR title and description

## Configuration

### Environment Setup

No environment variables are required for development. All configuration is in:
- `astro.config.mjs` - Astro build configuration
- `wrangler.jsonc` - Cloudflare Pages deployment
- `src/consts.ts` - Site metadata and constants
- `tailwind.config.js` - Tailwind CSS configuration

### Adding Dependencies

When adding new packages:
1. Use `pnpm add` for production dependencies
2. Use `pnpm add -D` for dev dependencies
3. Update README if it's a significant dependency
4. Test build and dev server before committing

## Deployment

### Local Testing

Before deploying, test the build locally:

```bash
pnpm build
npx wrangler pages dev ./dist
```

### Cloudflare Pages

The project is configured for [Cloudflare Pages](https://pages.cloudflare.com/):

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploys automatically on every push to main

## Feature Development

### Adding a New Page

1. Create file in `src/pages/`
2. Use `BaseLayout.astro` for consistent styling
3. Update navigation in `src/components/app-sidebar.tsx` if needed
4. Test locally with `pnpm dev`

### Adding Blog Posts

1. Create markdown file in `src/content/blog/`
2. Include required frontmatter (title, description, pubDate)
3. Write content in Markdown
4. Save and restart dev server
5. Verify post appears on `/blog`

### Customizing Styling

1. Global styles: `src/styles/global.css`
2. Tailwind config: `tailwind.config.js`
3. Component styles: Inline with Tailwind classes
4. Theme colors: `src/styles/global.css` CSS variables

## Testing

While there are no automated tests currently configured, follow these manual testing guidelines:

- Test on different screen sizes (mobile, tablet, desktop)
- Verify dark/light mode switching works
- Test RSS feed generation
- Check OG images generate correctly
- Verify blog post rendering and formatting
- Test navigation between pages

## Troubleshooting

### Dev Server Issues

```bash
# Clean cache and restart
rm -rf .astro node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### Build Errors

```bash
# Clear dist folder and rebuild
rm -rf dist
pnpm build
```

### Dark Mode Not Working

- Check localStorage is enabled
- Verify `<html class="dark">` is applied
- Test theme toggle in sidebar

## Resources

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS](https://tailwindcss.com)
- [React Documentation](https://react.dev)
- [Motion/React](https://motion.dev)
- [Shadcn UI](https://ui.shadcn.com)

## Contributing

This is an open-source project. Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push and open a pull request

## Questions?

If you have questions about the codebase or development process, feel free to:
- Open an issue on GitHub
- Check existing issues and discussions
- Review the code comments and commit history
