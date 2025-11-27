import type { APIRoute, GetStaticPaths } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

// Fetch Inter fonts - each weight needs its own file
async function fetchFont(weight: number): Promise<ArrayBuffer> {
  const response = await fetch(
    `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&display=swap`,
    { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' } }
  );
  const css = await response.text();
  const fontUrl = css.match(/src: url\(([^)]+)\)/)?.[1];
  if (!fontUrl) throw new Error(`Could not find font URL for weight ${weight}`);
  const fontResponse = await fetch(fontUrl);
  return fontResponse.arrayBuffer();
}

const [interRegular, interMedium, interSemiBold, interBold, interBlack] = await Promise.all([
  fetchFont(400),
  fetchFont(500),
  fetchFont(600),
  fetchFont(700),
  fetchFont(900),
]);

const colors = {
  background: '#ffffff',
  sidebar: '#fafafa',
  foreground: '#171717',
  mutedForeground: '#737373',
  border: '#e5e5e5',
};

const projectPages = [
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

async function generateOG(title: string, description: string, breadcrumb: string): Promise<Buffer> {
  // Load avatar image and convert to base64
  const avatarPath = path.resolve('./public/assets/avatar.png');
  const avatarBuffer = fs.readFileSync(avatarPath);
  const avatarBase64 = `data:image/png;base64,${avatarBuffer.toString('base64')}`;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: colors.sidebar,
          padding: '40px',
          flexDirection: 'column',
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
                borderRadius: '24px',
                border: `1px solid ${colors.border}`,
                overflow: 'hidden',
              },
              children: [
                // Header with avatar + breadcrumbs
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      height: '120px',
                      borderBottom: `1px solid ${colors.border}`,
                      padding: '0 48px',
                      gap: '24px',
                    },
                    children: [
                      // Avatar
                      {
                        type: 'img',
                        props: {
                          src: avatarBase64,
                          width: 64,
                          height: 64,
                          style: {
                            borderRadius: '50%',
                          },
                        },
                      },
                      // Name
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '36px',
                            fontWeight: 600,
                            color: colors.mutedForeground,
                          },
                          children: 'Yasin Kavakli',
                        },
                      },
                      // Separator
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '36px',
                            color: colors.border,
                            margin: '0 8px',
                          },
                          children: '/',
                        },
                      },
                      // Breadcrumb
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '36px',
                            color: colors.mutedForeground,
                          },
                          children: breadcrumb,
                        },
                      },
                    ],
                  },
                },
                // Main content with title and description
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      padding: '48px',
                      gap: '24px',
                      justifyContent: 'center',
                    },
                    children: [
                      {
                        type: 'h1',
                        props: {
                          style: {
                            fontSize: title.length < 20 ? '140px' : title.length < 40 ? '100px' : title.length < 60 ? '80px' : '60px',
                            fontWeight: 900,
                            color: colors.foreground,
                            lineHeight: 1.0,
                            margin: 0,
                            letterSpacing: '-0.03em',
                          },
                          children: title,
                        },
                      },
                      {
                        type: 'p',
                        props: {
                          style: {
                            fontSize: '64px',
                            fontWeight: 900,
                            color: '#171717',
                            lineHeight: 1.2,
                            margin: 0,
                          },
                          children: description,
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
          name: 'Inter',
          data: interRegular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: interMedium,
          weight: 500,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: interSemiBold,
          weight: 600,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: interBold,
          weight: 700,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: interBlack,
          weight: 900,
          style: 'normal',
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
