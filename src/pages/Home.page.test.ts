import { describe, expect, it } from 'vitest';
import homeSource from './Home.page.vue?raw';

describe('i方案首页引导', () => {
  it('在右侧最新工具栏目按稳定路径展示全部九个 i41 工具入口', () => {
    expect(homeSource).toContain("const latestCompanyToolPaths = ['/ifangan', '/image-edit-compressor', '/heic-converter', '/background-remover', '/image-collage', '/pdf-tools', '/id-watermark', '/temporary-clipboard', '/id-photo-maker']");
    expect(homeSource).toContain('latestCompanyTools');
    expect(homeSource).toContain('<ToolCard v-for="tool in latestCompanyTools"');
  });

  it('最新 i41 工具卡在当前窗口打开', () => {
    expect(homeSource).toContain(':open-external-in-current-window="true"');
  });

  it('shows a prominent guidance banner and visit button', () => {
    expect(homeSource).toContain('<strong>i方案</strong>');
    expect(homeSource).toContain('获取内容创作、客户跟单、文生图与视频制作方案');
    expect(homeSource).toContain('https://www.i41.cn?utm_source=tools&amp;utm_medium=tool_referral&amp;utm_campaign=ifangan&amp;utm_content=promo_banner');
    expect(homeSource).toContain('了解 i方案');
    expect(homeSource).toContain('class="iplan-cta"');
  });

  it('keeps the promotion visibly pale yellow and opens its action in the current window', () => {
    expect(homeSource).toContain('background: #fff8d6;');
    expect(homeSource).toContain('aria-label="了解 i方案"');
    expect(homeSource).not.toContain('target="_blank" rel="noopener noreferrer" aria-label="了解 i方案"');
  });
});
