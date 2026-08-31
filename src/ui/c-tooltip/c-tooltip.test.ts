// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import CTooltip from './c-tooltip.vue';

describe('CTooltip', () => {
  it('shows its text when a slotted link receives keyboard focus', async () => {
    const wrapper = mount(CTooltip, {
      props: { tooltip: '链接说明' },
      slots: { default: '<a href="https://example.com">示例链接</a>' },
      attachTo: document.body,
    });

    await wrapper.get('a').trigger('focusin');

    expect(wrapper.text()).toContain('链接说明');

    wrapper.unmount();
  });
});
