<script setup lang="ts">
import { getPasswordCrackTimeEstimation } from './password-strength-analyser.service';

const password = ref('');
const crackTimeEstimation = computed(() => getPasswordCrackTimeEstimation({ password: password.value }));

const details = computed(() => [
  {
    label: 'Password length:',
    value: crackTimeEstimation.value.passwordLength,
  },
  {
    label: 'Entropy:',
    value: Math.round(crackTimeEstimation.value.entropy * 100) / 100,
  },
  {
    label: 'Character set size:',
    value: crackTimeEstimation.value.charsetLength,
  },
  {
    label: 'Score:',
    value: `${Math.round(crackTimeEstimation.value.score * 100)} / 100`,
  },
]);
</script>

<template>
  <div flex flex-col gap-3>
    <c-input-text
      v-model:value="password"
      type="password"
      placeholder="输入密码..."
      clearable
      autofocus
      raw-text
      test-id="password-input"
    />

    <c-card text-center>
      <div op-60>
        使用暴力破解该密码所需时间
      </div>
      <div text-2xl data-test-id="crack-duration">
        {{ crackTimeEstimation.crackDurationFormatted }}
      </div>
    </c-card>
    <c-card>
      <div v-for="({ label, value }) of details" :key="label" flex gap-3>
        <div flex-1 text-right op-60>
          {{ label }}
        </div>
        <div flex-1 text-left>
          {{ value }}
        </div>
      </div>
    </c-card>
    <div op-70>
      <span font-bold>说明： </span>
      强度估算基于暴力破解所需时间，不考虑字典攻击的可能性。
    </div>
  </div>
</template>
