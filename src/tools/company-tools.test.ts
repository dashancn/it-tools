import { describe, expect, it } from 'vitest';
import { tools } from './index';

const externalTools = [
  ['i方案', 'https://www.i41.cn?utm_source=tools&utm_medium=tool_referral&utm_campaign=ifangan&utm_content=ecosystem_nav'],
  ['证件照制作', 'https://idphoto.i41.cn'],
  ['证件水印', 'https://watermark.i41.cn'],
  ['临时剪贴板', 'https://clip.i41.cn'],
] as const;

describe('company tool entries', () => {
  it.each(externalTools)('exposes %s as a new external tool', (name, externalUrl) => {
    expect(tools).toContainEqual(expect.objectContaining({ name, externalUrl, isNew: true }));
  });
});
