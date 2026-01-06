import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';


// Using system fonts for OG images - Inter is loaded via Google Fonts on the main site

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
  if (length <= 25) return 110;
  if (length <= 40) return 92;
  if (length <= 60) return 80;
  if (length <= 80) return 72;
  if (length <= 100) return 64;
  return 56; // Very long titles
}

// Calculate line height based on font size
function calculateLineHeight(fontSize: number): number {
  if (fontSize >= 80) return 1.3;
  if (fontSize >= 64) return 1.4;
  if (fontSize >= 48) return 1.45;
  return 1.5;
}

export const GET: APIRoute = async ({ props }) => {
  // Temporarily return a simple placeholder image
  // TODO: Re-enable proper OG image generation
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#f5f5f5"/>
    <text x="600" y="315" text-anchor="middle" font-family="Inter, sans-serif" font-size="64" font-weight="600" fill="#0a0a0a">${props.title || 'Blog'}</text>
  </svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
