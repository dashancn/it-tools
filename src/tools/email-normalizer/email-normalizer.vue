<script setup lang="ts">
import { normalizeEmail } from 'email-normalizer';
import { withDefaultOnError } from '@/utils/defaults';
import { useCopy } from '@/composable/copy';

const emails = ref('');
const normalizedEmails = computed(() => {
  if (!emails.value) {
    return '';
  }

  return emails.value
    .split('\n')
    .map((email) => {
      return withDefaultOnError(() => normalizeEmail({ email }), `Unable to parse email: ${email}`);
    })
    .join('\n');
});

const { copy } = useCopy({ source: normalizedEmails, text: '规范化邮箱已复制到剪贴板', createToast: true });
</script>

<template>
  <div>
    <div class="mb-2">
      待规范化的原始邮箱：
    </div>
    <c-input-text
      v-model:value="emails"
      placeholder="在这里输入邮箱（每行一个）..."
      rows="3"
      multiline
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      autofocus
      monospace
    />

    <div class="mb-2 mt-4">
      规范化后的邮箱：
    </div>
    <c-input-text
      :value="normalizedEmails"
      placeholder="规范化后的邮箱会显示在这里..."
      rows="3"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      multiline
      readonly
      monospace
    />
    <div class="mt-4 flex justify-center gap-2">
      <c-button @click="emails = ''">
        清空邮箱
      </c-button>
      <c-button :disabled="!normalizedEmails" @click="copy()">
        复制规范化邮箱
      </c-button>
    </div>
  </div>
</template>
