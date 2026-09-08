import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';

const fullTooltip = 'i方案是一套面向本地实体商家、内容运营人员和营销服务团队的智能内容工作平台。平台围绕行业、平台、品类、风格和使用场景，提供文案生成、文案诊断、客户跟单话术、文生图、视频包制作和精品模板等能力，帮助用户从内容构思、表单草稿、生成优化到后续复用形成完整工作链路。';

for (const viewport of [
  { name: 'desktop', width: 1280, height: 800, selector: '.ecosystem-nav--desktop' },
  { name: 'mobile', width: 375, height: 812, selector: '.ecosystem-nav--mobile' },
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

test('desktop tooltip wraps and stays inside the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const link = page.locator('.ecosystem-nav--desktop a').first();
  await link.hover();

  const tooltip = await tooltipMetrics(link);
  expect(tooltip.whiteSpace).toBe('normal');
  expect(tooltip.width).toBeLessThanOrEqual(420);
  expect(tooltip.left).toBeGreaterThanOrEqual(0);
  expect(tooltip.right).toBeLessThanOrEqual(1280);
  expect(tooltip.height).toBeGreaterThan(36);
});

test('mobile navigation is right aligned, wraps without horizontal scrolling, and stays sticky', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  const header = page.locator('.ecosystem-header');
  const nav = page.locator('.ecosystem-nav--mobile');
  const initial = await navigationMetrics(header, nav);
  const initialHeaderY = (await header.boundingBox())?.y;
  expect(initial.headerPosition).toBe('sticky');
  expect(initial.navFlexWrap).toBe('wrap');
  expect(initial.navJustifyContent).toBe('flex-end');
  expect(initial.documentScrollWidth).toBeLessThanOrEqual(375);
  expect(initial.navScrollWidth).toBeLessThanOrEqual(initial.navClientWidth);
  expect(initial.navRight).toBeCloseTo(initial.headerRight, 0);

  const mobileItemStyle = await nav.locator('a').nth(1).evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      padding: `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`,
      borderRadius: style.borderRadius,
    };
  });
  expect(mobileItemStyle.fontFamily).toContain('Inter');
  expect(mobileItemStyle.fontFamily).toContain('PingFang SC');
  expect(mobileItemStyle.fontFamily).toContain('Microsoft YaHei');
  expect(mobileItemStyle.fontSize).toBe('12px');
  expect(mobileItemStyle.fontWeight).toBe('650');
  expect(mobileItemStyle.padding).toBe('7px 8px 7px 8px');
  expect(mobileItemStyle.borderRadius).toBe('8px');

  await page.evaluate(() => document.querySelector('.n-layout-scroll-container')?.scrollTo(0, document.body.scrollHeight));
  await expect.poll(async () => (await header.boundingBox())?.y).toBe(initialHeaderY);

  const link = nav.locator('a').first();
  await link.focus();
  const tooltip = await tooltipMetrics(link);
  expect(tooltip.left).toBeGreaterThanOrEqual(0);
  expect(tooltip.right).toBeLessThanOrEqual(375);
});

test('desktop navigation matches watermark typography and dimensions at 1280px', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const nav = page.locator('.ecosystem-nav--desktop');
  const itemStyle = await nav.locator('a').nth(1).evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      padding: `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`,
      borderRadius: style.borderRadius,
    };
  });
  expect(itemStyle.fontFamily).toContain('Inter');
  expect(itemStyle.fontFamily).toContain('PingFang SC');
  expect(itemStyle.fontFamily).toContain('Microsoft YaHei');
  expect(itemStyle.fontSize).toBe('13px');
  expect(itemStyle.fontWeight).toBe('650');
  expect(itemStyle.padding).toBe('7px 8px 7px 8px');
  expect(itemStyle.borderRadius).toBe('8px');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1280);
});

async function tooltipStyle(link: Locator) {
  return link.evaluate((element) => {
    const style = getComputedStyle(element, '::after');
    return { content: style.content, opacity: style.opacity };
  });
}

async function tooltipMetrics(link: Locator) {
  return link.evaluate((element) => {
    const style = getComputedStyle(element, '::after');
    const width = Number.parseFloat(style.width);
    const height = Number.parseFloat(style.height) + Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom);
    const left = Number.parseFloat(style.left);
    return {
      whiteSpace: style.whiteSpace,
      width,
      height,
      left,
      right: left + width,
    };
  });
}

async function navigationMetrics(header: Locator, nav: Locator) {
  const headerHandle = await header.elementHandle();
  if (!headerHandle) {
    throw new Error('Missing ecosystem header');
  }
  return nav.evaluate((element, headerElement) => ({
    headerPosition: getComputedStyle(headerElement).position,
    navFlexWrap: getComputedStyle(element).flexWrap,
    navJustifyContent: getComputedStyle(element).justifyContent,
    documentScrollWidth: document.documentElement.scrollWidth,
    navScrollWidth: element.scrollWidth,
    navClientWidth: element.clientWidth,
    navRight: element.getBoundingClientRect().right,
    headerRight: headerElement.getBoundingClientRect().right - Number.parseFloat(getComputedStyle(headerElement).paddingRight),
  }), headerHandle);
}
