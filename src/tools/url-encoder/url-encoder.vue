<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const encodeInput = ref('Hello world :)');
const encodeOutput = computed(() => withDefaultOnError(() => encodeURIComponent(encodeInput.value), ''));

const encodedValidation = useValidation({
  source: encodeInput,
  rules: [
    {
      validator: value => isNotThrowing(() => encodeURIComponent(value)),
      message: '无法解析这个字符串',
    },
  ],
});

const { copy: copyEncoded } = useCopy({ source: encodeOutput, text: '已复制编码后的字符串' });

const decodeInput = ref('Hello%20world%20%3A)');
const decodeOutput = computed(() => withDefaultOnError(() => decodeURIComponent(decodeInput.value), ''));

const decodeValidation = useValidation({
  source: decodeInput,
  rules: [
    {
      validator: value => isNotThrowing(() => decodeURIComponent(value)),
      message: '无法解析这个字符串',
    },
  ],
});

const { copy: copyDecoded } = useCopy({ source: decodeOutput, text: '已复制解码后的字符串' });
</script>

<template>
  <c-card title="编码">
    <c-input-text
      v-model:value="encodeInput"
      label="要编码的字符串："
      :validation="encodedValidation"
      multiline
      autosize
      placeholder="请输入要编码的字符串"
      rows="2"
      mb-3
    />

    <c-input-text
      label="编码后的字符串："
      :value="encodeOutput"
      multiline
      autosize
      readonly
      placeholder="编码后的字符串"
      rows="2"
      mb-3
    />

    <div flex justify-center>
      <c-button @click="copyEncoded()">
        复制
      </c-button>
    </div>
  </c-card>
  <c-card title="解码">
    <c-input-text
      v-model:value="decodeInput"
      label="要解码的字符串："
      :validation="decodeValidation"
      multiline
      autosize
      placeholder="请输入要解码的字符串"
      rows="2"
      mb-3
    />

    <c-input-text
      label="解码后的字符串："
      :value="decodeOutput"
      multiline
      autosize
      readonly
      placeholder="解码后的字符串"
      rows="2"
      mb-3
    />

    <div flex justify-center>
      <c-button @click="copyDecoded()">
        复制
      </c-button>
    </div>
  </c-card>
</template>
