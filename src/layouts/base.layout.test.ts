import { describe, expect, it } from 'vitest';
import layoutSource from './base.layout.vue?raw';

const ecosystemItems = [
  ['i方案', 'https://www.i41.cn?utm_source=tools&utm_medium=tool_referral&utm_campaign=ifangan&utm_content=ecosystem_nav'],
  ['开发者工具', '/'],
  ['图片压缩', 'https://imgzip.i41.cn'],
  ['智能抠图', 'https://imgzip.i41.cn/remove-background/'],
  ['多图拼接', 'https://imgzip.i41.cn/collage/'],
  ['PDF 工具', 'https://pdf.i41.cn'],
  ['证件水印', 'https://watermark.i41.cn'],
  ['临时剪贴板', 'https://clip.i41.cn'],
  ['证件照', 'https://idphoto.i41.cn'],
] as const;

describe('unified ecosystem navigation', () => {
  it('defines every menu item in the required order with exact URLs', () => {
    const positions = ecosystemItems.map(([label, href]) => {
      const entry = `{ label: '${label}', href: '${href}'`;
      expect(layoutSource).toContain(entry);
      return layoutSource.indexOf(entry);
    });

    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('renders one ordered menu source on desktop and mobile', () => {
    expect(layoutSource).toContain('v-for="item in ecosystemNavItems"');
    expect(layoutSource).toContain('class="ecosystem-nav ecosystem-nav--desktop"');
    expect(layoutSource).toContain('class="ecosystem-nav ecosystem-nav--mobile"');
  });

  it('marks developer tools as the current item and secures external links', () => {
    expect(layoutSource).toContain("{ label: '开发者工具', href: '/', current: true }");
    expect(layoutSource).toContain(':aria-current="item.current ? \'page\' : undefined"');
    expect(layoutSource).toContain(':target="item.external ? \'_blank\' : undefined"');
    expect(layoutSource).toContain(':rel="item.external ? \'noopener noreferrer\' : undefined"');
  });

  it('keeps i方案 as the dominant blue CTA and uses a quieter current-page state', () => {
    expect(layoutSource).toContain("{ label: 'i方案', href:");
    expect(layoutSource).toContain('cta: true');
    expect(layoutSource).toContain("'ecosystem-nav__item--cta': item.cta");
    expect(layoutSource).toContain('font-weight: 700;');
    expect(layoutSource).toContain('background: #eff6ff;');
    expect(layoutSource).toContain('color: #1d4ed8;');
  });

  it('uses the site brand on a white 64px navigation bar', () => {
    expect(layoutSource).toContain('class="ecosystem-brand"');
    expect(layoutSource).toContain('IT - TOOLS');
    expect(layoutSource).toContain('height: 64px;');
    expect(layoutSource).toContain('background: #fff;');
  });

  it('does not falsely claim that all images stay local', () => {
    expect(layoutSource).toContain('常用工具在浏览器处理');
    expect(layoutSource).not.toContain('图片仅在浏览器本地处理');
    expect(layoutSource).not.toContain('照片无需上传到业务服务器');
  });
});
