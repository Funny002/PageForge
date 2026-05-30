<template>
  <div
    :style="{
      width: '100%',
      height: '100%',
      border: '1px dashed var(--pf-border-muted)',
      borderRadius: '2px',
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }"
  >
    <span style="font-size: 11px; color: var(--pf-text-color-muted);">组</span>
  </div>
</template>

<script setup lang="ts">
import type { PageNode } from '../../../core/types'
defineProps<{ node: PageNode }>()
</script>
