<script setup lang="ts">
import { useTimestamp } from '@vueuse/core';
import { useThemeVars } from 'naive-ui';
import { useQRCode } from '../qr-code-generator/useQRCode';
import { base32toHex, buildKeyUri, generateSecret, generateTOTP, getCounterFromTime } from './otp.service';
import TokenDisplay from './token-display.vue';
import { useStyleStore } from '@/stores/style.store';
import InputCopyable from '@/components/InputCopyable.vue';
import { computedRefreshable } from '@/composable/computedRefreshable';

const now = useTimestamp();
const interval = computed(() => (now.value / 1000) % 30);
const theme = useThemeVars();
const styleStore = useStyleStore();

const secret = ref(generateSecret());

function refreshSecret() {
  secret.value = generateSecret();
}

const [tokens] = computedRefreshable(
  () => ({
    previous: generateTOTP({ key: secret.value, now: now.value - 30000 }),
    current: generateTOTP({ key: secret.value, now: now.value }),
    next: generateTOTP({ key: secret.value, now: now.value + 30000 }),
  }),
  { throttle: 500 },
);

const keyUri = computed(() => buildKeyUri({ secret: secret.value }));

const { qrcode } = useQRCode({
  text: keyUri,
  color: {
    background: computed(() => (styleStore.isDarkTheme ? '#ffffff' : '#00000000')),
    foreground: '#000000',
  },
  options: { width: 210 },
});

const secretValidationRules = [
  {
    message: '密钥应为 base32 字符串',
    validator: (value: string) => value.toUpperCase().match(/^[A-Z234567]+$/),
  },
  {
    message: '请设置密钥',
    validator: (value: string) => value !== '',
  },
];
</script>

<template>
  <div style="max-width: 350px">
    <c-input-text
      v-model:value="secret"
      label="密钥"
      placeholder="粘贴你的 TOTP 密钥..."
      mb-5
      :validation-rules="secretValidationRules"
    >
      <template #suffix>
        <c-tooltip tooltip="Generate a new random secret">
          <c-button circle variant="text" size="small" @click="refreshSecret">
            <icon-mdi-refresh />
          </c-button>
        </c-tooltip>
      </template>
    </c-input-text>

    <div>
      <TokenDisplay :tokens="tokens" />

      <n-progress :percentage="(100 * interval) / 30" :color="theme.primaryColor" :show-indicator="false" />
      <div style="text-align: center">
        下一个 in {{ String(Math.floor(30 - interval)).padStart(2, '0') }}s
      </div>
    </div>
    <div mt-4 flex flex-col items-center justify-center gap-3>
      <n-image :src="qrcode" />
      <c-button :href="keyUri" target="_blank">
        在新标签页打开 Key URI
      </c-button>
    </div>
  </div>
  <div style="max-width: 350px">
    <InputCopyable
      label="十六进制密钥"
      :value="base32toHex(secret)"
      readonly
      placeholder="十六进制密钥会显示在这里"
      mb-5
    />

    <InputCopyable
      label="纪元时间"
      :value="Math.floor(now / 1000).toString()"
      readonly
      mb-5
      placeholder="秒级纪元时间会显示在这里"
    />

    <p>迭代</p>

    <InputCopyable
      :value="String(getCounterFromTime({ now, timeStep: 30 }))"
      readonly
      label="计数："
      label-position="left"
      label-width="90px"
      label-align="right"
      placeholder="迭代计数会显示在这里"
    />

    <InputCopyable
      :value="getCounterFromTime({ now, timeStep: 30 }).toString(16).padStart(16, '0')"
      readonly
      placeholder="十六进制迭代计数会显示在这里"
      label-position="left"
      label-width="90px"
      label-align="right"
      label="补齐后的十六进制："
    />
  </div>
</template>

<style lang="less" scoped>
.n-progress {
  margin-top: 10px;
  ::v-deep(.n-progress-graph-line-fill) {
    transition-duration: 0.05s !important;
  }
}

.token {
  text-align: center;
  &.token-current {
    font-size: 20px;
  }
}
</style>
