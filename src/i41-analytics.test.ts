import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import layoutSource from './layouts/base.layout.vue?raw';

const indexHtml = readFileSync(fileURLToPath(new URL('../index.html', import.meta.url)), 'utf8');

const privacyNotice = '隐私说明：常用工具在浏览器处理。我们会发送匿名访问、UTM 参数和跨站点击事件；不发送输入内容、文件名或永久标识。';

describe('i41 anonymous analytics', () => {
  it('loads the independent analytics module for the tools site', () => {
    expect(indexHtml).toContain('<html lang="zh-CN" data-i41-site="tools">');
    expect(indexHtml).toContain('<script type="module" src="https://stats.i41.cn/analytics.js"></script>');
  });

  it('discloses exactly what analytics does and does not collect', () => {
    expect(layoutSource).toContain(privacyNotice);
  });
});
