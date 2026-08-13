<script setup lang="ts">
import convert from 'xml-js';
import { isValidXML } from '../xml-formatter/xml-formatter.service';
import { withDefaultOnError } from '@/utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

const defaultValue = '<a x="1.234" y="It\'s"/>';
function transformer(value: string) {
  return withDefaultOnError(() => {
    return JSON.stringify(convert.xml2js(value, { compact: true }), null, 2);
  }, '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: isValidXML,
    message: '提供的 XML 无效。',
  },
];
</script>

<template>
  <format-transformer
    input-label="XML 内容"
    :input-default="defaultValue"
    input-placeholder="在这里粘贴 XML 内容..."
    output-label="转换后的 JSON"
    output-language="json"
    :transformer="transformer"
    :input-validation-rules="rules"
  />
</template>
