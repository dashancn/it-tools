<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { base64ToText, isValidBase64, textToBase64 } from '@/utils/base64';
import { withDefaultOnError } from '@/utils/defaults';

const encodeUrlSafe = useStorage('base64-string-converter--encode-url-safe', false);
const decodeUrlSafe = useStorage('base64-string-converter--decode-url-safe', false);

const textInput = ref('');
const base64Output = computed(() => textToBase64(textInput.value, { makeUrlSafe: encodeUrlSafe.value }));
const { copy: copyTextBase64 } = useCopy({ source: base64Output, text: 'Base64 字符串已复制到剪贴板' });

const base64Input = ref('');
const textOutput = computed(() =>
  withDefaultOnError(() => base64ToText(base64Input.value.trim(), { makeUrlSafe: decodeUrlSafe.value }), ''),
);
const { copy: copyText } = useCopy({ source: textOutput, text: '字符串已复制到剪贴板' });
const b64ValidationRules = [
  {
    message: '无效的 Base64 字符串',
    validator: (value: string) => isValidBase64(value.trim(), { makeUrlSafe: decodeUrlSafe.value }),
  },
];
const b64ValidationWatch = [decodeUrlSafe];
</script>

<template>
  <c-card title="字符串转 Base64">
    <n-form-item label="URL 安全编码" label-placement="left">
      <n-switch v-model:value="encodeUrlSafe" />
    </n-form-item>
    <c-input-text
      v-model:value="textInput"
      multiline
      placeholder="在这里输入字符串..."
      rows="5"
      label="要编码的字符串"
      raw-text
      mb-5
    />

    <c-input-text
      label="字符串的 Base64"
      :value="base64Output"
      multiline
      readonly
      placeholder="字符串的 Base64 编码会显示在这里"
      rows="5"
      mb-5
    />

    <div flex justify-center>
      <c-button @click="copyTextBase64()">
        复制 Base64
      </c-button>
    </div>
  </c-card>

  <c-card title="Base64 转字符串">
    <n-form-item label="URL 安全解码" label-placement="left">
      <n-switch v-model:value="decodeUrlSafe" />
    </n-form-item>
    <c-input-text
      v-model:value="base64Input"
      multiline
      placeholder="你的 Base64 字符串..."
      rows="5"
      :validation-rules="b64ValidationRules"
      :validation-watch="b64ValidationWatch"
      label="要解码的 Base64 字符串"
      mb-5
    />

    <c-input-text
      v-model:value="textOutput"
      label="解码后的字符串"
      placeholder="解码后的字符串会显示在这里"
      multiline
      rows="5"
      readonly
      mb-5
    />

    <div flex justify-center>
      <c-button @click="copyText()">
        复制解码后的字符串
      </c-button>
    </div>
  </c-card>
</template>
