import { describe, expect, it } from 'vitest';
import homeSource from './Home.page.vue?raw';

describe('i方案首页引导', () => {
  it('shows a prominent guidance banner and visit button', () => {
    expect(homeSource).toContain('关注 i方案');
    expect(homeSource).toContain('获取内容创作、客户跟单、文生图与视频制作方案');
    expect(homeSource).toContain('https://www.i41.cn');
    expect(homeSource).toContain('访问 i方案');
    expect(homeSource).toContain('class="iplan-cta"');
  });
});
