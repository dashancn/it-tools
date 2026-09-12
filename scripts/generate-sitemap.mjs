import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteUrl = 'https://tools.i41.cn/';

export function getSitemapRoutes(rootDirectory) {
  const toolsDirectory = join(rootDirectory, 'src/tools');
  const routes = readdirSync(toolsDirectory, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => join(toolsDirectory, entry.name, 'index.ts'))
    .flatMap((indexPath) => {
      try {
        const source = readFileSync(indexPath, 'utf8');
        if (!/\bcomponent\s*:/.test(source))
          return [];

        const path = source.match(/\bpath\s*:\s*['"](\/[^'"]+)['"]/)?.[1];
        return path ? [path] : [];
      }
      catch {
        return [];
      }
    })
    .sort((left, right) => left.localeCompare(right));

  return ['/', ...routes];
}

export function renderSitemap(routes) {
  const urls = routes
    .map(route => `  <url>\n    <loc>${new URL(route.replace(/^\//, ''), siteUrl).href}</loc>\n  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === currentFile) {
  const rootDirectory = resolve(dirname(currentFile), '..');
  writeFileSync(join(rootDirectory, 'public/sitemap.xml'), renderSitemap(getSitemapRoutes(rootDirectory)));
}
