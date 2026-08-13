<script setup lang="ts">
import slugify from '@sindresorhus/slugify';
import { withDefaultOnError } from '@/utils/defaults';
import { useCopy } from '@/composable/copy';

const input = ref('');
const slug = computed(() => withDefaultOnError(() => slugify(input.value), ''));
const { copy } = useCopy({ source: slug, text: 'Slug 已复制到剪贴板' });
</script>

<template>
  <div>
    <c-input-text v-model:value="input" multiline placeholder="在这里输入字符串（例如：My file path）" label="要转换为 slug 的字符串" autofocus raw-text mb-5 />

    <c-input-text :value="slug" multiline readonly placeholder="生成的 slug 会显示在这里（例如：my-file-path）" label="你的 slug" mb-5 />

    <div flex justify-center>
      <c-button :disabled="slug.length === 0" @click="copy()">
        复制 slug
      </c-button>
    </div>
  </div>
</template>
