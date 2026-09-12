import { expect, test } from '@playwright/test';

const routes = ['/token-generator', '/email-normalizer', '/xml-formatter'];

for (const route of routes) {
  test(`${route} hard refresh loads its tool and self canonical`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(`https://tools.i41.cn${route}`);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-seo-prerender]')).toHaveCount(0);
  });
}

test('unknown route receives a real 404 and noindex document', async ({ page }) => {
  const response = await page.goto('/definitely-not-a-real-tool-41', { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.locator('h1')).toHaveText('404 页面不存在');
});
