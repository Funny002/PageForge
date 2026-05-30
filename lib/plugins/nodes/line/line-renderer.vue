<template>
  <div
    :style="{
      width: '100%',
      height: String((node.props.strokeWidth as number) ?? 2) + 'px',
      background: String(node.props.stroke ?? '#d0d7de'),
      marginTop: (node.height / 2 - (Number(node.props.strokeWidth) ?? 2) / 2) + 'px',
    }"
  />
</template>

<script setup lang="ts">
import type { PageNode } from '../../../core/types'
defineProps<{ node: PageNode }>()
</script>
