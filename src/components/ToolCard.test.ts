import { describe, expect, it } from 'vitest';
import toolCardSource from './ToolCard.vue?raw';

describe('ToolCard external navigation', () => {
  it('allows designated ecosystem cards to open in the current window', () => {
    expect(toolCardSource).toContain('openExternalInCurrentWindow?: boolean');
    expect(toolCardSource).toContain('props.openExternalInCurrentWindow');
    expect(toolCardSource).toContain('? { href: tool.value.externalUrl }');
  });

  it('retains safe new-tab behavior for other external cards', () => {
    expect(toolCardSource).toContain("target: '_blank'");
    expect(toolCardSource).toContain("rel: 'noopener noreferrer'");
  });
});
