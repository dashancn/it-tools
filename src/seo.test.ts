import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

const siteUrl = 'https://tools.i41.cn/';
const description = '为开发者和 IT 从业者准备的免费开源在线工具合集，提供好用的转换、编码、加密、网络、文本和数据处理工具。';

describe('technical SEO', () => {
  it('uses the production domain for canonical and social metadata', () => {
    const html = read('index.html');

    expect(html).toContain(`<link rel="canonical" href="${siteUrl}" />`);
    expect(html).toContain(`<meta property="og:url" content="${siteUrl}" />`);
    expect(html).toContain('<meta property="og:site_name" content="IT Tools" />');
    expect(html).toContain('<meta property="og:locale" content="zh_CN" />');
    expect(html).toContain('<meta property="og:image" content="https://tools.i41.cn/banner.png" />');
    expect(html).toContain('<meta name="twitter:url" content="https://tools.i41.cn/" />');
    expect(html).toContain('<meta name="twitter:image" content="https://tools.i41.cn/banner.png" />');
    expect(html).not.toContain('it-tools.tech');
  });

  it('publishes valid WebApplication structured data', () => {
    const html = read('index.html');
    const match = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
    expect(match).not.toBeNull();

    const data = JSON.parse(match![1]);
    expect(data).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'IT Tools',
      'url': siteUrl,
      'description': description,
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'Any',
      'isAccessibleForFree': true,
      'image': 'https://tools.i41.cn/banner.png',
      'license': 'https://www.gnu.org/licenses/gpl-3.0.html',
    });
  });

  it('allows crawling and advertises the canonical sitemap', () => {
    expect(read('public/robots.txt')).toBe(`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`);
  });

  it('lists the homepage and every actual internal tool route in the sitemap', async () => {
    const { getSitemapRoutes, renderSitemap } = await import('../scripts/generate-sitemap.mjs');
    const routes = getSitemapRoutes(root);
    const xml = read('public/sitemap.xml');

    expect(routes[0]).toBe('/');
    expect(routes).toContain('/token-generator');
    expect(routes).not.toContain('/ifangan');
    expect(xml).toBe(renderSitemap(routes));
    for (const route of routes) {
      expect(xml).toContain(`<loc>${new URL(route.replace(/^\//, ''), siteUrl).href}</loc>`);
    }
  });

  it('copies crawler files unchanged into the production build', () => {
    expect(read('dist/robots.txt')).toBe(read('public/robots.txt'));
    expect(read('dist/sitemap.xml')).toBe(read('public/sitemap.xml'));
  });
});
