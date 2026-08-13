<script setup lang="ts">
import JSON5 from 'json5';
import { convertArrayToCsv } from './json-to-csv.service';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

function transformer(value: string) {
  return withDefaultOnError(() => {
    if (value === '') {
      return '';
    }
    return convertArrayToCsv({ array: JSON5.parse(value) });
  }, '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: '提供的 JSON 无效。',
  },
];
</script>

<template>
  <format-transformer
    input-label="原始 JSON"
    input-placeholder="在这里粘贴原始 JSON..."
    output-label="JSON 的 CSV 版本"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
