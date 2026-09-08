import { describe, expect, it } from 'vitest';
import layoutSource from './base.layout.vue?raw';

const ecosystemItems = [
  ['i方案', 'https://www.i41.cn?utm_source=tools&utm_medium=tool_referral&utm_campaign=ifangan&utm_content=ecosystem_nav'],
  ['图片压缩', 'https://imgzip.i41.cn'],
  ['HEIC 转换', 'https://imgzip.i41.cn/heic-converter/'],
  ['智能抠图', 'https://imgzip.i41.cn/remove-background/'],
  ['多图拼接', 'https://imgzip.i41.cn/collage/'],
  ['PDF 工具', 'https://pdf.i41.cn'],
  ['证件水印', 'https://watermark.i41.cn'],
  ['临时剪贴板', 'https://clip.i41.cn'],
  ['证件照', 'https://idphoto.i41.cn'],
] as const;

const canonicalTooltips = [
  ['i方案', 'i方案是一套面向本地实体商家、内容运营人员和营销服务团队的智能内容工作平台。平台围绕行业、平台、品类、风格和使用场景，提供文案生成、文案诊断、客户跟单话术、文生图、视频包制作和精品模板等能力，帮助用户从内容构思、表单草稿、生成优化到后续复用形成完整工作链路。'],
  ['图片压缩', '图片修改压缩是一款浏览器端在线图片处理工具，支持压缩、调整尺寸和格式转换，图片尽量在本地处理，适合日常上传、分享和网页优化。'],
  ['HEIC 转换', 'HEIC 转换工具可在浏览器本地将 HEIC、HEIF 和 WebP 转为 JPG 或 PNG。'],
  ['智能抠图', '智能抠图在浏览器中自动移除图片背景，适合人像和商品图快速换背景。'],
  ['多图拼接', '多图拼接支持在浏览器中组合多张图片并调整布局。'],
  ['PDF 工具', 'PDF 工具箱提供合并、拆分、压缩、转换、编辑、OCR 和发票拼版等浏览器端 PDF 处理能力。'],
  ['证件水印', '证件水印工具支持为身份证、营业执照和合同截图添加用途水印，图片仅在浏览器本地处理。'],
  ['临时剪贴板', '临时剪贴板支持客户端加密、自动过期、读取次数限制和阅后即焚，适合跨设备传递临时文本。'],
  ['证件照', '证件照工作室是一款浏览器端证件照制作工具，支持本地智能抠图、背景换色、常用证件尺寸和 300DPI 多图拼版，照片无需上传到业务服务器。'],
] as const;

describe('unified ecosystem navigation', () => {
  it('defines the standard menu order without the current developer-tools entry', () => {
    const positions = ecosystemItems.map(([label, href]) => {
      const entry = `{ label: '${label}', href: '${href}'`;
      expect(layoutSource).toContain(entry);
      return layoutSource.indexOf(entry);
    });

    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(layoutSource).not.toContain('{ label: \'开发者工具\'');
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

  it('uses passport-photo-studio full descriptions for every remaining tooltip', () => {
    for (const [label, tooltip] of canonicalTooltips) {
      expect(layoutSource).toContain(`{ label: '${label}',`);
      expect(layoutSource).toContain(`tooltip: '${tooltip}'`);
    }
    expect(canonicalTooltips).toHaveLength(ecosystemItems.length);
    expect(layoutSource).toContain(':data-tooltip="item.tooltip"');
    expect(layoutSource).toContain(':aria-label="item.tooltip"');
    expect(layoutSource).toContain('&:hover::after');
    expect(layoutSource).toContain('&:focus-visible::after');
  });

  it('keeps i方案 aligned with the watermark CTA dimensions', () => {
    expect(layoutSource).toContain('{ label: \'i方案\', href:');
    expect(layoutSource).toContain('cta: true');
    expect(layoutSource).toContain('\'ecosystem-nav__item--cta\': item.cta');
    expect(layoutSource).toContain('min-width: 76px;');
    expect(layoutSource).toContain('font-weight: 800;');
  });

  it('uses the site brand on a white 64px navigation bar', () => {
    expect(layoutSource).toContain('min-height: 64px;');
    expect(layoutSource).toContain('background: #fff;');
  });

  it('matches the watermark navigation typography and spacing', () => {
    expect(layoutSource).toContain('font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;');
    expect(layoutSource).toContain('gap: 2px;');
    expect(layoutSource).toContain('padding: 7px 8px;');
    expect(layoutSource).toContain('font-size: 13px;');
    expect(layoutSource).toContain('font-weight: 650;');
    expect(layoutSource).toContain('border-radius: 8px;');
    expect(layoutSource).toContain('font-size: 12px;');
  });

  it('keeps the complete mobile navigation inside the sticky header', () => {
    const headerStart = layoutSource.indexOf('<header class="ecosystem-header">');
    const headerEnd = layoutSource.indexOf('</header>', headerStart);
    const mobileNav = layoutSource.indexOf('class="ecosystem-nav ecosystem-nav--mobile"');

    expect(mobileNav).toBeGreaterThan(headerStart);
    expect(mobileNav).toBeLessThan(headerEnd);
    expect(layoutSource).toContain('position: sticky;');
    expect(layoutSource).toContain('flex-wrap: wrap;');
    expect(layoutSource).toContain('justify-content: flex-end;');
    expect(layoutSource).toContain('overflow-x: clip;');
    expect(layoutSource).not.toContain('overflow-x: auto;');
  });

  it('allows every tooltip to wrap within the viewport', () => {
    expect(layoutSource).toContain('position: fixed;');
    expect(layoutSource).toContain('width: min(420px, calc(100vw - 24px));');
    expect(layoutSource).toContain('white-space: normal;');
    expect(layoutSource).toContain('overflow-wrap: anywhere;');
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

  it('does not make an unqualified site-wide claim that all images stay local', () => {
    expect(layoutSource).toContain('class="privacy-notice">隐私说明：常用工具在浏览器处理。');
    expect(layoutSource).not.toContain('class="privacy-notice">图片仅在浏览器本地处理');
    expect(layoutSource).not.toContain('class="privacy-notice">照片无需上传到业务服务器');
  });
});
