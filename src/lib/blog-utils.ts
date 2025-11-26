import { getCollection } from 'astro:content';

/**
 * Check if there are any blog posts in the collection
 * This function should only be called in Astro server contexts
 */
export async function hasBlogPosts(): Promise<boolean> {
  try {
    const posts = await getCollection('blog');
    return posts.length > 0;
  } catch (error) {
    console.error('Error checking blog posts:', error);
    return false;
  }
}
