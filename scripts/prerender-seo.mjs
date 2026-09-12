import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { getSitemapRoutes } from './generate-sitemap.mjs';

export const siteUrl = 'https://tools.i41.cn/';
const home = {
  path: '/',
  heading: 'IT Tools - 面向开发者的在线工具箱',
  title: 'IT Tools - 面向开发者的在线工具箱',
  description: '为开发者和 IT 从业者准备的免费开源在线工具合集，提供好用的转换、编码、加密、网络、文本和数据处理工具。',
};

const escapeHtml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

function nestedValue(object, path) {
  return path.split('.').reduce((value, key) => value?.[key], object);
}

function literalOrTranslation(source, property, messages) {
  const expression = source.match(new RegExp(`\\b${property}\\s*:\\s*([^,\\n]+)`))?.[1]?.trim();
  if (!expression)
    throw new Error(`Missing ${property}`);

  const translationKey = expression.match(/^translate\(['"]([^'"]+)['"]\)$/)?.[1];
  if (translationKey) {
    const translated = nestedValue(messages, translationKey);
    if (typeof translated !== 'string')
      throw new Error(`Missing Chinese translation: ${translationKey}`);
    return translated;
  }

  const literal = expression.match(/^(['"])([\s\S]*)\1$/)?.[2];
  if (!literal)
    throw new Error(`Unsupported ${property} expression: ${expression}`);
  return literal;
}

export function getSeoPages(rootDirectory) {
  const messages = parse(readFileSync(join(rootDirectory, 'locales/zh.yml'), 'utf8'));
  const toolsDirectory = join(rootDirectory, 'src/tools');
  const routeSources = new Map();

  for (const entry of readdirSync(toolsDirectory, { withFileTypes: true })) {
    if (!entry.isDirectory())
      continue;
    const indexPath = join(toolsDirectory, entry.name, 'index.ts');
    try {
      const source = readFileSync(indexPath, 'utf8');
      if (!/\bcomponent\s*:/.test(source))
        continue;
      const path = source.match(/\bpath\s*:\s*['"](\/[^'"]+)['"]/)?.[1];
      if (path)
        routeSources.set(path, source);
    }
    catch {}
  }

  return getSitemapRoutes(rootDirectory).map((path) => {
    if (path === '/')
      return home;
    const source = routeSources.get(path);
    if (!source)
      throw new Error(`No tool source for ${path}`);
    const heading = literalOrTranslation(source, 'name', messages);
    const description = literalOrTranslation(source, 'description', messages);
    return { path, heading, title: `${heading} - IT Tools`, description };
  });
}

function setTag(html, pattern, replacement) {
  if (!pattern.test(html))
    throw new Error(`Expected HTML tag not found: ${pattern}`);
  return html.replace(pattern, replacement);
}

function renderPage(template, page) {
  const canonical = new URL(page.path.replace(/^\//, ''), siteUrl).href;
  const title = escapeHtml(page.title);
  const heading = escapeHtml(page.heading);
  const description = escapeHtml(page.description);
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: page.heading,
    url: canonical,
    description: page.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript and a modern web browser',
    isAccessibleForFree: true,
    image: `${siteUrl}banner.png`,
    license: 'https://www.gnu.org/licenses/gpl-3.0.html',
    author: { '@type': 'Person', name: 'Corentin Th', url: 'https://corentin.tech' },
    sourceOrganization: { '@type': 'Organization', name: 'IT Tools upstream project', url: 'https://github.com/CorentinTh/it-tools' },
  }, null, 2).replaceAll('<', '\\u003c');

  let html = template;
  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = setTag(html, /<meta itemprop="name" content="[^"]*"\s*\/?>/, `<meta itemprop="name" content="${title}" />`);
  html = setTag(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="${description}" />`);
  html = setTag(html, /<meta\s+itemprop="description"\s+content="[^"]*"\s*\/?>/, `<meta itemprop="description" content="${description}" />`);
  html = setTag(html, /<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${canonical}" />`);
  html = setTag(html, /<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${canonical}" />`);
  html = setTag(html, /<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${title}" />`);
  html = setTag(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${description}" />`);
  html = setTag(html, /<meta name="twitter:url" content="[^"]*"\s*\/?>/, `<meta name="twitter:url" content="${canonical}" />`);
  html = setTag(html, /<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${title}" />`);
  html = setTag(html, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${description}" />`);
  html = setTag(html, /<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">\n${jsonLd}\n    </script>`);
  html = setTag(html, /<div id="app"><\/div>/, `<div id="app"><main data-seo-prerender><h1>${heading}</h1><p>${description}</p><p><a href="/">浏览全部 IT Tools</a></p></main></div>`);
  return html;
}

export function prerender(rootDirectory) {
  const distDirectory = join(rootDirectory, 'dist');
  const template = readFileSync(join(distDirectory, 'index.html'), 'utf8');
  for (const page of getSeoPages(rootDirectory)) {
    const output = page.path === '/' ? join(distDirectory, 'index.html') : join(distDirectory, page.path.slice(1), 'index.html');
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, renderPage(template, page));
  }

  const notFound = `<!DOCTYPE html>\n<html lang="zh-CN"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta name="robots" content="noindex, nofollow" /><title>404 页面不存在 - IT Tools</title></head><body><main><h1>404 页面不存在</h1><p>抱歉，该页面似乎不存在。</p><p><a href="/">返回 IT Tools 首页</a></p></main><script type="module" src="https://stats.i41.cn/analytics.js"></script></body></html>\n`;
  writeFileSync(join(distDirectory, '404.html'), notFound);
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === currentFile)
  prerender(resolve(dirname(currentFile), '..'));
