<script setup lang="ts">
import { compareSync, hashSync } from 'bcryptjs';
import { useThemeVars } from 'naive-ui';
import { useCopy } from '@/composable/copy';

const themeVars = useThemeVars();

const input = ref('');
const saltCount = ref(10);
const hashed = computed(() => hashSync(input.value, saltCount.value));
const { copy } = useCopy({ source: hashed, text: '哈希字符串已复制到剪贴板' });

const compareString = ref('');
const compareHash = ref('');
const compareMatch = computed(() => compareSync(compareString.value, compareHash.value));
</script>

<template>
  <c-card title="哈希">
    <c-input-text
      v-model:value="input"
      placeholder="要进行 bcrypt 的字符串..."
      raw-text
      label="字符串："
      label-position="left"
      label-align="right"
      label-width="120px"
      mb-2
    />
    <n-form-item label="盐轮数：" label-placement="left" label-width="120">
      <n-input-number v-model:value="saltCount" placeholder="盐轮数..." :max="100" :min="0" w-full />
    </n-form-item>

    <c-input-text :value="hashed" readonly text-center />

    <div mt-5 flex justify-center>
      <c-button @click="copy()">
        复制哈希
      </c-button>
    </div>
  </c-card>

  <c-card title="将字符串与哈希比较">
    <n-form label-width="120">
      <n-form-item label="字符串：" label-placement="left">
        <c-input-text v-model:value="compareString" placeholder="要比较的字符串..." raw-text />
      </n-form-item>
      <n-form-item label="哈希值：" label-placement="left">
        <c-input-text v-model:value="compareHash" placeholder="要比较的哈希值..." raw-text />
      </n-form-item>
      <n-form-item label="是否匹配？" label-placement="left" :show-feedback="false">
        <div class="compare-result" :class="{ positive: compareMatch }">
          {{ compareMatch ? 'Yes' : 'No' }}
        </div>
      </n-form-item>
    </n-form>
  </c-card>
</template>

<style lang="less" scoped>
.compare-result {
  color: v-bind('themeVars.errorColor');

  &.positive {
    color: v-bind('themeVars.successColor');
  }
}
</style>
