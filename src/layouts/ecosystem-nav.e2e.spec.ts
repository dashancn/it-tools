import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';

const fullTooltip = 'i方案是一套面向本地实体商家、内容运营人员和营销服务团队的智能内容工作平台。平台围绕行业、平台、品类、风格和使用场景，提供文案生成、文案诊断、客户跟单话术、文生图、视频包制作和精品模板等能力，帮助用户从内容构思、表单草稿、生成优化到后续复用形成完整工作链路。';

for (const viewport of [
  { name: 'desktop', width: 1280, height: 800, selector: '.ecosystem-nav--desktop' },
  { name: 'mobile', width: 390, height: 844, selector: '.ecosystem-nav--mobile' },
]) {
  test(`${viewport.name} ecosystem tooltip is visible on hover and focus`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const link = page.locator(`${viewport.selector} a`).first();
    await expect(link).toHaveAttribute('data-tooltip', fullTooltip);
    await link.hover();
    await expect.poll(() => tooltipStyle(link)).toMatchObject({ opacity: '1' });
    await link.focus();
    await expect(link).toBeFocused();
    await expect.poll(() => tooltipStyle(link)).toMatchObject({ opacity: '1' });
  });
}

async function tooltipStyle(link: Locator) {
  return link.evaluate((element) => {
    const style = getComputedStyle(element, '::after');
    return { content: style.content, opacity: style.opacity };
  });
}
