import { describe, expect, it } from 'vitest';
import homeSource from './Home.page.vue?raw';

describe('i方案首页引导', () => {
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
