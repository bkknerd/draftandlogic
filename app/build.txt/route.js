import { getSite } from '@/lib/content';

export const dynamic = 'force-static';

// Open /build.txt on the live site to see which commit Netlify built.
export function GET() {
  const { hero } = getSite();
  const body = [
    `commit: ${process.env.COMMIT_REF || 'local build'}`,
    `branch: ${process.env.BRANCH || 'n/a'}`,
    `built: ${new Date().toISOString()}`,
    `hero: ${hero?.intro || 'n/a'}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
