# Performance & PageSpeed Guidelines

## Goal: 100 score across all metrics (Performance, Accessibility, Best Practices, SEO)

### Performance Optimizations

#### 1. Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
  - Fonts preloaded and prefetched
  - Critical CSS inlined to prevent render-blocking
  - Images optimized and properly sized

- **FID/INP (Interaction to Next Paint)**: < 100ms
  - Minimal JavaScript on main thread
  - React components use `client:idle` directive
  - No layout thrashing

- **CLS (Cumulative Layout Shift)**: < 0.1
  - Critical colors inlined in `<style>` tag
  - All images have explicit width/height
  - No content shift on font load

#### 2. CSS & Styling
- Use Tailwind utility classes (pre-optimized)
- Remove unused styles with `@layer` directives
- Respect `prefers-reduced-motion` for accessibility
- Use CSS variables for theming (avoids extra paint)

#### 3. Images
- Always provide `width` and `height` attributes
- Use WebP format with fallbacks
- Lazy load images below the fold with `loading="lazy"`
- Optimize PNG/JPG with imagemin before committing
- Use Astro's `<Image>` component for responsive images

#### 4. Fonts
- Use `font-display: swap` for web fonts
- Preconnect to font CDNs
- Limit font weights (currently using 400, 500, 600)
- Load fonts with `layer(base)` in CSS

#### 5. JavaScript
- Keep JS minimal; prefer CSS solutions
- Use Astro's code splitting automatically
- Lazy load React components with `client:idle` or `client:only`
- Avoid third-party scripts where possible

#### 6. HTML Structure
- Use semantic HTML (`<article>`, `<nav>`, `<section>`)
- Proper heading hierarchy (h1 > h2 > h3)
- Descriptive alt text for all images
- Proper meta tags for OpenGraph and Twitter

### Accessibility Checklist

- [ ] All images have descriptive alt text
- [ ] Color contrast > 4.5:1 for text
- [ ] Interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Form labels are associated with inputs
- [ ] ARIA attributes used appropriately
- [ ] Screen reader tested on home and blog pages

### Best Practices

- [ ] No console errors
- [ ] No deprecated APIs
- [ ] HTTPS enabled
- [ ] No unsecured third-party content
- [ ] Proper HTTP headers set
- [ ] No mixed content warnings

### SEO Checklist

- [ ] Title tag is descriptive (30-60 chars)
- [ ] Meta description present (120-160 chars)
- [ ] h1 tag per page
- [ ] Proper canonical URLs
- [ ] Robots.txt and sitemap.xml configured
- [ ] Structured data (JSON-LD) for blog posts
- [ ] Mobile-friendly (responsive design)
- [ ] Page load time optimized

### Build-Time Optimizations

```bash
# Measure performance
pnpm build

# Check bundle size
npm run analyze  # if available

# Test locally
npx wrangler pages dev ./dist
```

### Deployment Considerations

- Enable gzip/brotli compression on server
- Set proper cache headers:
  - Static assets: 1 year
  - HTML pages: no-cache
  - Images: 30 days
- Enable HTTP/2
- Use a CDN for static files

### Monitoring

Regular checks via:
- [Google PageSpeed Insights](https://pagespeed.web.dev)
- [Lighthouse CI](https://github.com/GoogleChromeLabs/lighthouse-ci)
- [WebPageTest](https://www.webpagetest.org)

### Common Issues & Fixes

**Issue**: CLS from theme flash
**Fix**: Inline critical CSS with colors + `color-scheme` meta tag

**Issue**: LCP too high
**Fix**: Preload fonts, optimize images, inline critical styles

**Issue**: Unused JavaScript
**Fix**: Remove unused dependencies, lazy load React components

**Issue**: Layout shift on image load
**Fix**: Always provide width/height attributes, use responsive images

---

## Recent Changes (Nov 28, 2024)

- Added font preload and DNS prefetch
- Inlined critical CSS for theme
- Optimized animations with `prefers-reduced-motion`
- Set `font-display: swap` for better UX
- Added `color-scheme` meta tag
