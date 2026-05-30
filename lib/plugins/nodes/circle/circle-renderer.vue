<template>
  <div
    :style="{
      width: '100%',
      height: '100%',
      background: String(node.props.fill ?? '#f0f0f0'),
      border: `1px solid ${String(node.props.stroke ?? '#d0d7de')}`,
      borderRadius: '50%',
      overflow: 'hidden',
    }"
  />
</template>

<script setup lang="ts">
import type { PageNode } from '../../../core/types'
defineProps<{ node: PageNode }>()
</script>
