<script setup lang="ts">
import convert from 'xml-js';
import JSON5 from 'json5';
import { withDefaultOnError } from '@/utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

const defaultValue = '{"a":{"_attributes":{"x":"1.234","y":"It\'s"}}}';
function transformer(value: string) {
  return withDefaultOnError(() => {
    return convert.js2xml(JSON5.parse(value), { compact: true });
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
    input-label="JSON 内容"
    :input-default="defaultValue"
    input-placeholder="在这里粘贴 JSON 内容..."
    output-label="转换后的 XML"
    output-language="xml"
    :transformer="transformer"
    :input-validation-rules="rules"
  />
</template>
