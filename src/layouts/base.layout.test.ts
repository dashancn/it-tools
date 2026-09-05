import { describe, expect, it } from 'vitest';
import layoutSource from './base.layout.vue?raw';

const ecosystemItems = [
  ['i方案', 'https://www.i41.cn?utm_source=tools&utm_medium=tool_referral&utm_campaign=ifangan&utm_content=ecosystem_nav'],
  ['图片压缩', 'https://imgzip.i41.cn'],
  ['智能抠图', 'https://imgzip.i41.cn/remove-background/'],
  ['多图拼接', 'https://imgzip.i41.cn/collage/'],
  ['PDF 工具', 'https://pdf.i41.cn'],
  ['证件水印', 'https://watermark.i41.cn'],
  ['临时剪贴板', 'https://clip.i41.cn'],
  ['证件照', 'https://idphoto.i41.cn'],
] as const;

describe('unified ecosystem navigation', () => {
  it('defines the standard menu order without the current developer-tools entry', () => {
    const positions = ecosystemItems.map(([label, href]) => {
      const entry = `{ label: '${label}', href: '${href}'`;
      expect(layoutSource).toContain(entry);
      return layoutSource.indexOf(entry);
    });

    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(layoutSource).not.toContain("{ label: '开发者工具'");
  });

  it('keeps IT-TOOLS as the left-side current-product identity', () => {
    expect(layoutSource).toContain('class="ecosystem-brand"');
    expect(layoutSource).toContain('aria-current="page"');
    expect(layoutSource).toContain('IT - TOOLS');
  });

  it('renders one ordered menu source on desktop and mobile', () => {
    expect(layoutSource).toContain('v-for="item in ecosystemNavItems"');
    expect(layoutSource).toContain('class="ecosystem-nav ecosystem-nav--desktop"');
    expect(layoutSource).toContain('class="ecosystem-nav ecosystem-nav--mobile"');
  });

  it('opens every ecosystem link in the current window', () => {
    expect(layoutSource).not.toContain(':target="item.external');
    expect(layoutSource).not.toContain(':rel="item.external');
  });

  it('gives every remaining menu item a Chinese hover and keyboard-focus tooltip', () => {
    expect(layoutSource).toContain(':data-tooltip="`前往${item.label}`"');
    expect(layoutSource).toContain(':aria-label="`前往${item.label}`"');
    expect(layoutSource).toContain('&:hover::after');
    expect(layoutSource).toContain('&:focus-visible::after');
  });

  it('keeps i方案 as a coordinated CTA with a 72px minimum width', () => {
    expect(layoutSource).toContain("{ label: 'i方案', href:");
    expect(layoutSource).toContain('cta: true');
    expect(layoutSource).toContain("'ecosystem-nav__item--cta': item.cta");
    expect(layoutSource).toContain('min-width: 72px;');
    expect(layoutSource).toContain('font-weight: 700;');
  });

  it('uses the site brand on a white 64px navigation bar', () => {
    expect(layoutSource).toContain('height: 64px;');
    expect(layoutSource).toContain('background: #fff;');
  });

  it('keeps upstream attribution, MIT license, and privacy details in a collapsed disclosure', () => {
    expect(layoutSource).toContain('<details class="footer-disclosure">');
    expect(layoutSource).toContain('<summary aria-label="关于 IT-Tools 与隐私">');
    expect(layoutSource).toContain('IT-Tools');
    expect(layoutSource).toContain('MIT License');
    expect(layoutSource).toContain('Corentin Thomasset');
    expect(layoutSource).toContain('隐私说明：常用工具在浏览器处理');
    expect(layoutSource).not.toContain('<details class="footer-disclosure" open>');
  });

  it('does not falsely claim that all images stay local', () => {
    expect(layoutSource).toContain('常用工具在浏览器处理');
    expect(layoutSource).not.toContain('图片仅在浏览器本地处理');
    expect(layoutSource).not.toContain('照片无需上传到业务服务器');
  });
});
