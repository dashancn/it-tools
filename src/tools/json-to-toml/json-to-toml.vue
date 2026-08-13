<script setup lang="ts">
import { stringify as stringifyToml } from 'iarna-toml-esm';
import JSON5 from 'json5';
import { withDefaultOnError } from '../../utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

const convertJsonToToml = (value: string) => [stringifyToml(JSON5.parse(value))].flat().join('\n').trim();

const transformer = (value: string) => value.trim() === '' ? '' : withDefaultOnError(() => convertJsonToToml(value), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: '提供的 JSON 无效。',
  },
];
</script>

<template>
  <format-transformer
    input-label="你的 JSON"
    input-placeholder="在这里粘贴 JSON..."
    output-label="由 JSON 转换的 TOML"
    output-language="toml"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
