<script setup lang="ts">
import { stringify as stringifyToml } from 'iarna-toml-esm';
import { parse as parseYaml } from 'yaml';
import { withDefaultOnError } from '../../utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

const convertYamlToToml = (value: string) => [stringifyToml(parseYaml(value))].flat().join('\n').trim();

const transformer = (value: string) => value.trim() === '' ? '' : withDefaultOnError(() => convertYamlToToml(value), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || parseYaml(v),
    message: '提供的 JSON 无效。',
  },
];
</script>

<template>
  <format-transformer
    input-label="你的 YAML"
    input-placeholder="在这里粘贴 YAML..."
    output-label="由 YAML 转换的 TOML"
    output-language="toml"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
