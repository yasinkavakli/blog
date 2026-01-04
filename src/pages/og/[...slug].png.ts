import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

async function loadFont(filename: string): Promise<ArrayBuffer> {
  const fontPath = path.resolve(`./public/fonts/general-sans/${filename}`);
  return fs.readFileSync(fontPath);
}

const [generalSansLight, generalSansRegular, generalSansMedium, generalSansSemibold, generalSansBold] = await Promise.all([
  loadFont('GeneralSans-Light.otf'),
  loadFont('GeneralSans-Regular.otf'),
  loadFont('GeneralSans-Medium.otf'),
  loadFont('GeneralSans-Semibold.otf'),
  loadFont('GeneralSans-Bold.otf'),
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
      description: post.data.description,
      breadcrumb: 'Writing',
    },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title, description, breadcrumb } = props;

  // Load avatar image and convert to base64
  const avatarPath = path.resolve('./public/assets/avatar.png');
  const avatarBuffer = fs.readFileSync(avatarPath);
  const avatarBase64 = `data:image/png;base64,${avatarBuffer.toString('base64')}`;

  // Colors from your light mode theme (converted from oklch)
  const colors = {
    background: '#ffffff',        // oklch(1 0 0)
    sidebar: '#fafafa',           // oklch(0.985 0 0)
    foreground: '#171717',        // oklch(0.145 0 0)
    mutedForeground: '#737373',   // oklch(0.556 0 0)
    border: '#e5e5e5',            // oklch(0.922 0 0)
  };

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
          // White content card - fills almost entire space
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
                      padding: '32px',
                      gap: '24px',
                      justifyContent: 'center',
                    },
                    children: [
                      {
                        type: 'h1',
                        props: {
                          style: {
                            fontSize: title.length < 20 ? '180px' : title.length < 40 ? '140px' : title.length < 60 ? '100px' : '80px',
                            fontWeight: 900,
                            color: '#171717',
                            lineHeight: 1.0,
                            margin: 0,
                            letterSpacing: '-0.03em',
                          },
                          children: title,
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
          data: generalSansLight,
          weight: 300,
          style: 'normal',
        },
        {
          name: 'General Sans',
          data: generalSansRegular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'General Sans',
          data: generalSansMedium,
          weight: 500,
          style: 'normal',
        },
        {
          name: 'General Sans',
          data: generalSansSemibold,
          weight: 600,
          style: 'normal',
        },
        {
          name: 'General Sans',
          data: generalSansBold,
          weight: 700,
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
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
