<template>
  <div
    :style="{
      width: '100%',
      height: '100%',
      background: '#f6f8fa',
      border: '1px solid #d0d7de',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }"
  >
    <img
      v-if="node.props.src"
      :src="String(node.props.src)"
      :alt="String(node.props.alt ?? '')"
      :style="imageStyle"
    />
    <span v-else style="font-size: 12px; color: var(--pf-text-color-muted);">图片</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PageNode } from '../../../core/types'
const props = defineProps<{ node: PageNode }>()
const imageStyle = computed(() => ({
  width: '100%',
  height: '100%',
  objectFit: String(props.node.props.objectFit ?? 'cover'),
} as any))
</script>
