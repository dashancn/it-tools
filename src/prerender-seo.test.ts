import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '..');
const siteUrl = 'https://tools.i41.cn/';
function htmlDecode(value: string) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', '\'')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function attribute(html: string, selector: RegExp) {
  const value = html.match(selector)?.[1];
  expect(value).toBeTruthy();
  return htmlDecode(value!);
}

describe('production SEO prerender', () => {
  it('emits exact route-specific metadata and useful initial content for every sitemap URL', async () => {
    const { getSeoPages } = await import('../scripts/prerender-seo.mjs');
    const pages = getSeoPages(root);
    expect(pages).toHaveLength(87);

    for (const page of pages) {
      const output = page.path === '/' ? 'dist/index.html' : `dist${page.path}/index.html`;
      const html = readFileSync(resolve(root, output), 'utf8');
      const canonical = new URL(page.path.replace(/^\//, ''), siteUrl).href;

      expect(attribute(html, /<title>([^<]+)<\/title>/)).toBe(page.title);
      expect(attribute(html, /<meta name="description" content="([^"]+)"/)).toBe(page.description);
      expect(attribute(html, /<link rel="canonical" href="([^"]+)"/)).toBe(canonical);
      expect(attribute(html, /<meta property="og:url" content="([^"]+)"/)).toBe(canonical);
      expect(attribute(html, /<meta property="og:title" content="([^"]+)"/)).toBe(page.title);
      expect(attribute(html, /<meta property="og:description" content="([^"]+)"/)).toBe(page.description);
      expect(attribute(html, /<meta name="twitter:url" content="([^"]+)"/)).toBe(canonical);
      expect(attribute(html, /<meta name="twitter:title" content="([^"]+)"/)).toBe(page.title);
      expect(attribute(html, /<meta name="twitter:description" content="([^"]+)"/)).toBe(page.description);
      expect(attribute(html, /<h1[^>]*>([\s\S]*?)<\/h1>/)).toBe(page.heading);
      expect(attribute(html, /<main data-seo-prerender>[\s\S]*?<p>([\s\S]*?)<\/p>/)).toBe(page.description);

      const jsonLd = JSON.parse(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)![1]);
      expect(jsonLd.url).toBe(canonical);
      expect(jsonLd.name).toBe(page.heading);
      expect(jsonLd.description).toBe(page.description);
      expect(html).toContain('<div id="app">');
      expect(html).toMatch(/<script type="module" crossorigin src="\/assets\/[^"']+\.js"><\/script>/);
      expect(html).toContain('src="https://stats.i41.cn/analytics.js"');
    }
  });

  it('ships a noindex 404 document and no catch-all static rewrite', () => {
    const html = readFileSync(resolve(root, 'dist/404.html'), 'utf8');
    expect(html).toContain('<meta name="robots" content="noindex, nofollow"');
    expect(html).toContain('<title>404 页面不存在 - IT Tools</title>');
    expect(html).not.toContain('rel="canonical"');
    expect(readFileSync(resolve(root, 'netlify.toml'), 'utf8')).not.toMatch(/status\s*=\s*200/);
    expect(readFileSync(resolve(root, 'vercel.json'), 'utf8')).not.toContain('"dest": "/index.html"');
  });
});
