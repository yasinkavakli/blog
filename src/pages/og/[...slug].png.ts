import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

// Colors matching the site's design system
const colors = {
  background: '#ffffff',
  secondary: '#f5f5f5',
  foreground: '#0a0a0a',
  mutedForeground: '#737373',
  border: '#e5e5e5',
};

// Static/project pages with their OG metadata
const staticPages = [
  { slug: 'default', title: 'Yasin Kavakli', description: 'Senior developer building scalable B2B ecommerce solutions', breadcrumb: 'Home', showDescription: true },
  { slug: 'home', title: '', description: 'Senior developer building scalable B2B ecommerce solutions', breadcrumb: 'Home', showDescription: true },
  { slug: 'writing', title: '', description: 'Thoughts on software, design, and everything in between.', breadcrumb: 'Blog', showDescription: true },
  { slug: 'ama', title: 'Ask Me Anything', description: 'Coming soon', breadcrumb: 'Projects', showDescription: true },
  { slug: 'links', title: 'Links', description: 'Coming soon', breadcrumb: 'Projects', showDescription: true },
  { slug: 'scripts', title: 'Scripts', description: 'Coming soon', breadcrumb: 'Projects', showDescription: true },
  { slug: 'stack', title: 'Stack', description: 'Software I use for development', breadcrumb: 'Projects', showDescription: true },
  { slug: 'uses', title: 'Uses', description: 'Hardware I use for work', breadcrumb: 'Projects', showDescription: true },
];

export const getStaticPaths: GetStaticPaths = async () => {
  // Get blog posts
  const posts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  const blogPaths = posts.map((post) => ({
    params: { slug: post.id },
    props: {
      title: post.data.title,
      description: post.data.description || '',
      breadcrumb: 'Writing',
      showDescription: false,
    },
  }));

  // Get static pages
  const staticPaths = staticPages.map((page) => ({
    params: { slug: page.slug },
    props: {
      title: page.title,
      description: page.description,
      breadcrumb: page.breadcrumb,
      showDescription: page.showDescription,
    },
  }));

  return [...staticPaths, ...blogPaths];
};

function calculateTitleFontSize(title: string): number {
  const length = title.length;
  if (length <= 25) return 110;
  if (length <= 40) return 92;
  if (length <= 60) return 80;
  if (length <= 80) return 72;
  if (length <= 100) return 64;
  return 56;
}

async function generateOG(title: string, description: string, breadcrumb: string, showDescription: boolean): Promise<Buffer> {
  const avatarPath = path.resolve('./public/assets/avatar.png');
  const avatarBuffer = fs.readFileSync(avatarPath);
  const avatarBase64 = `data:image/png;base64,${avatarBuffer.toString('base64')}`;

  const titleFontSize = calculateTitleFontSize(title);
  const hasTitle = title.length > 0;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: colors.secondary,
          padding: '32px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                backgroundColor: colors.background,
                borderRadius: '20px',
                overflow: 'hidden',
              },
              children: [
                // Header
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '28px 40px',
                      borderBottom: `1px solid ${colors.border}`,
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                          },
                          children: [
                            {
                              type: 'img',
                              props: {
                                src: avatarBase64,
                                width: 48,
                                height: 48,
                                style: { borderRadius: '50%' },
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontFamily: 'Instrument Sans',
                                  fontSize: '32px',
                                  fontWeight: 500,
                                  color: colors.foreground,
                                },
                                children: 'Yasin Kavakli',
                              },
                            },
                          ],
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px 20px',
                            backgroundColor: colors.secondary,
                            borderRadius: '100px',
                          },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontFamily: 'Instrument Sans',
                                  fontSize: '22px',
                                  fontWeight: 500,
                                  color: colors.mutedForeground,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em',
                                },
                                children: breadcrumb,
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                // Content
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      padding: '48px',
                      justifyContent: 'center',
                    },
                    children: [
                      // Title (if exists)
                      ...(hasTitle ? [{
                        type: 'h1',
                        props: {
                          style: {
                            fontFamily: 'Instrument Sans',
                            fontSize: `${titleFontSize}px`,
                            fontWeight: 500,
                            color: colors.foreground,
                            lineHeight: 1.1,
                            margin: 0,
                            letterSpacing: '-0.01em',
                          },
                          children: title,
                        },
                      }] : []),
                      // Description (for static pages only)
                      ...(showDescription && description ? [{
                        type: 'p',
                        props: {
                          style: {
                            fontFamily: 'Instrument Sans',
                            fontSize: hasTitle ? '44px' : '56px',
                            fontWeight: 500,
                            color: hasTitle ? colors.mutedForeground : colors.foreground,
                            lineHeight: 1.4,
                            margin: 0,
                            marginTop: hasTitle ? '32px' : '0',
                            maxWidth: '90%',
                          },
                          children: description,
                        },
                      }] : []),
                    ],
                  },
                },
                // Footer
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      padding: '20px 40px',
                      borderTop: `1px solid ${colors.border}`,
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontFamily: 'Instrument Sans',
                            fontSize: '24px',
                            fontWeight: 500,
                            color: colors.mutedForeground,
                          },
                          children: 'yasin.kavakli.at',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Instrument Sans',
          data: await fetch('https://fonts.gstatic.com/s/instrumentsans/v4/pximypc9vsFDm051Uf6KVwgkfoSxQ0GsQv8ToedPibnr-yp2JGEJOH9npST3-Qf1.ttf').then(r => r.arrayBuffer()),
          weight: 500,
          style: 'normal' as const,
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });

  const pngData = resvg.render();
  return pngData.asPng();
}

export const GET: APIRoute = async ({ props }) => {
  const png = await generateOG(props.title, props.description, props.breadcrumb, props.showDescription);

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
