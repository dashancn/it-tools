import { describe, expect, it } from 'vitest';
import { tools } from './index';

describe('company tool entries', () => {
  it('exposes the ID photo maker as a new external tool', () => {
    expect(tools).toContainEqual(expect.objectContaining({
      name: '证件照制作',
      externalUrl: 'https://idphoto.i41.cn',
      isNew: true,
    }));
  });
});
