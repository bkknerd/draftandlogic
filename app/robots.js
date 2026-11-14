import { SITE_URL } from '@/lib/content';

export const dynamic = 'force-static';

// Same rules as before: everyone allowed, AI crawlers named so they're clearly welcome.
const AI = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended'];

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }, ...AI.map((userAgent) => ({ userAgent, allow: '/' }))],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
