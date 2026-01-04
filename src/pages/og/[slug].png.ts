import type { APIRoute, GetStaticPaths } from 'astro';
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

// Colors matching the site's design system (from global.css)
const colors = {
  background: '#ffffff',        // hsl(0 0% 100%)
  secondary: '#f5f5f5',         // hsl(0 0% 96.1%)
  foreground: '#0a0a0a',        // hsl(0 0% 3.9%)
  mutedForeground: '#737373',   // hsl(0 0% 45.1%)
  border: '#e5e5e5',            // hsl(0 0% 89.8%)
};

const projectPages = [
  { slug: 'default', title: 'Yasin Kavakli', description: 'Senior developer building scalable B2B ecommerce solutions', breadcrumb: 'Home' },
  { slug: 'home', title: '', description: 'Senior developer building scalable B2B ecommerce solutions', breadcrumb: 'Home' },
  { slug: 'writing', title: '', description: 'Thoughts on software, design, and everything in between.', breadcrumb: 'Blog' },
  { slug: 'ama', title: 'Ask Me Anything', description: 'Coming soon', breadcrumb: 'Projects' },
  { slug: 'links', title: 'Links', description: 'Coming soon', breadcrumb: 'Projects' },
  { slug: 'scripts', title: 'Scripts', description: 'Coming soon', breadcrumb: 'Projects' },
  { slug: 'stack', title: 'Stack', description: 'Software I use for development', breadcrumb: 'Projects' },
  { slug: 'uses', title: 'Uses', description: 'Hardware I use for work', breadcrumb: 'Projects' },
];

export const getStaticPaths: GetStaticPaths = async () => {
  return projectPages.map((page) => ({
    params: { slug: page.slug },
    props: {
      title: page.title,
      description: page.description,
      breadcrumb: page.breadcrumb,
    },
  }));
};

// Calculate optimal font size for title based on length
function calculateTitleFontSize(title: string): number {
  const length = title.length;
  if (length <= 15) return 120;
  if (length <= 25) return 100;
  if (length <= 40) return 84;
  if (length <= 60) return 72;
  return 64;
}

async function generateOG(title: string, description: string, breadcrumb: string): Promise<Buffer> {
  // Load avatar image and convert to base64
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
                // Main content area
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
                      // Title (if exists) using Khand font
                      ...(hasTitle ? [{
                        type: 'h1',
                        props: {
                          style: {
                            fontFamily: 'Khand',
                            fontSize: `${titleFontSize}px`,
                            fontWeight: 600,
                            color: colors.foreground,
                            lineHeight: 1.1,
                            margin: 0,
                            letterSpacing: '-0.01em',
                          },
                          children: title,
                        },
                      }] : []),
                      // Description
                      {
                        type: 'p',
                        props: {
                          style: {
                            fontFamily: 'General Sans',
                            fontSize: hasTitle ? '44px' : '56px',
                            fontWeight: 600,
                            color: hasTitle ? colors.mutedForeground : colors.foreground,
                            lineHeight: 1.4,
                            margin: 0,
                            marginTop: hasTitle ? '32px' : '0',
                            maxWidth: '90%',
                          },
                          children: description,
                        },
                      },
                          children: description,
                        },
                      },
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
  return pngData.asPng();
}

export const GET: APIRoute = async ({ props }) => {
  const { title, description, breadcrumb } = props;
  const pngBuffer = await generateOG(title, description, breadcrumb);

  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
