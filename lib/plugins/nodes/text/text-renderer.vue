<template>
  <div
    :style="{
      width: '100%',
      height: '100%',
      fontSize: String((node.props.fontSize as number) ?? 16) + 'px',
      color: String(node.props.color ?? '#1f2328'),
      fontFamily: String(node.props.fontFamily ?? 'Arial, sans-serif'),
      padding: '4px',
      overflow: 'hidden',
      wordBreak: 'break-word',
      lineHeight: 1.4,
    }"
  >
    {{ node.props.text ?? '双击编辑文本' }}
  </div>
</template>

<script setup lang="ts">
import type { PageNode } from '../../../core/types'
defineProps<{ node: PageNode }>()
</script>
