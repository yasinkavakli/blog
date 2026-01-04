import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

// Load fonts
async function loadGeneralSansFont(filename: string): Promise<ArrayBuffer> {
  const fontPath = path.resolve(`./public/fonts/general-sans/${filename}`);
  return fs.readFileSync(fontPath);
}

async function loadKhandFont(filename: string): Promise<ArrayBuffer> {
  const fontPath = path.resolve(`./public/fonts/khand/${filename}`);
  return fs.readFileSync(fontPath);
}

const [
  generalSansRegular,
  generalSansMedium,
  generalSansSemibold,
  khandRegular,
  khandSemibold
] = await Promise.all([
  loadGeneralSansFont('GeneralSans-Regular.otf'),
  loadGeneralSansFont('GeneralSans-Medium.otf'),
  loadGeneralSansFont('GeneralSans-Semibold.otf'),
  loadKhandFont('Khand-Regular.ttf'),
  loadKhandFont('Khand-SemiBold.ttf'),
]);

export const getStaticPaths: GetStaticPaths = async () => {
  // Filter out drafts in production, show all in dev
  const posts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  return posts.map((post) => ({
    params: { slug: post.id },
    props: {
      title: post.data.title,
      description: post.data.description || '',
      breadcrumb: 'Writing',
    },
  }));
};

// Calculate optimal font size for title based on length and character count
function calculateTitleFontSize(title: string): number {
  const length = title.length;
  // More granular sizing for better readability at all lengths
  if (length <= 25) return 100;
  if (length <= 40) return 84;
  if (length <= 60) return 72;
  if (length <= 80) return 64;
  if (length <= 100) return 56;
  return 48; // Very long titles
}

// Calculate line height based on font size
function calculateLineHeight(fontSize: number): number {
  if (fontSize >= 80) return 1.2;
  if (fontSize >= 64) return 1.25;
  if (fontSize >= 48) return 1.3;
  return 1.35;
}

export const GET: APIRoute = async ({ props }) => {
  const { title, description, breadcrumb } = props;

  // Load avatar image and convert to base64
  const avatarPath = path.resolve('./public/assets/avatar.png');
  const avatarBuffer = fs.readFileSync(avatarPath);
  const avatarBase64 = `data:image/png;base64,${avatarBuffer.toString('base64')}`;

  // Colors matching the site's design system (from global.css)
  const colors = {
    background: '#ffffff',        // hsl(0 0% 100%)
    secondary: '#f5f5f5',         // hsl(0 0% 96.1%)
    foreground: '#0a0a0a',        // hsl(0 0% 3.9%)
    mutedForeground: '#737373',   // hsl(0 0% 45.1%)
    border: '#e5e5e5',            // hsl(0 0% 89.8%)
  };

  const titleFontSize = calculateTitleFontSize(title);
  const titleLineHeight = calculateLineHeight(titleFontSize);
  const titleLength = title.length;

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
          // Main card container
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
                // Header bar with branding
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
                      // Left side: Avatar + Name
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
                                style: {
                                  borderRadius: '50%',
                                },
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontFamily: 'General Sans',
                                  fontSize: '32px',
                                  fontWeight: 600,
                                  color: colors.foreground,
                                },
                                children: 'Yasin Kavakli',
                              },
                            },
                          ],
                        },
                      },
                      // Right side: Breadcrumb badge
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
                                  fontFamily: 'General Sans',
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
                // Main content area with title
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      margin: '56px 48px',
                      justifyContent: 'center',
                    },
                    children: [
                      // Title using Khand font
                      {
                        type: 'h1',
                        props: {
                          style: {
                            fontFamily: 'Khand',
                            fontSize: `${titleFontSize}px`,
                            fontWeight: 600,
                            color: colors.foreground,
                            lineHeight: titleLineHeight,
                            margin: 0,
                            letterSpacing: '-0.01em',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            // Restrict to 3 lines max to leave room for description
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                          },
                          children: title,
                        },
                      },
                      // Optional: Description if short enough
                      ...(description && description.length <= 120 ? [{
                        type: 'p',
                        props: {
                          style: {
                            fontFamily: 'General Sans',
                            fontSize: '40px',
                            fontWeight: 600,
                            color: colors.mutedForeground,
                            lineHeight: 1.5,
                            margin: 0,
                            marginTop: '32px',
                            maxWidth: '90%',
                          },
                          children: description,
                        },
                      }] : []),
                    ],
                  },
                },
                // Footer bar with website URL
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
                            fontFamily: 'General Sans',
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
          name: 'General Sans',
          data: generalSansRegular,
          weight: 400,
          style: 'normal' as const,
        },
        {
          name: 'General Sans',
          data: generalSansMedium,
          weight: 500,
          style: 'normal' as const,
        },
        {
          name: 'General Sans',
          data: generalSansSemibold,
          weight: 600,
          style: 'normal' as const,
        },
        {
          name: 'Khand',
          data: khandRegular,
          weight: 400,
          style: 'normal' as const,
        },
        {
          name: 'Khand',
          data: khandSemibold,
          weight: 600,
          style: 'normal' as const,
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
