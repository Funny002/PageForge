<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <div class="fp-proprow">
      <span class="fp-proprow__label">X</span>
      <n-input-number size="small" :value="node.x" @update:value="update('x', $event)" />
    </div>
    <div class="fp-proprow">
      <span class="fp-proprow__label">Y</span>
      <n-input-number size="small" :value="node.y" @update:value="update('y', $event)" />
    </div>
    <div class="fp-proprow">
      <span class="fp-proprow__label">宽</span>
      <n-input-number size="small" :value="node.width" :min="1" @update:value="update('width', $event)" />
    </div>
    <div class="fp-proprow">
      <span class="fp-proprow__label">高</span>
      <n-input-number size="small" :value="node.height" :min="1" @update:value="update('height', $event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NInputNumber } from 'naive-ui'
import { usePageForge } from '../../../composables/usePageForge'
import type { PageNode } from '../../../core/types'

const props = defineProps<{ node: PageNode }>()
const forge = usePageForge()

function update(key: string, value: number | null) {
  if (value === null) return
  forge.dispatch('node:update', props.node.id, { [key]: value })
}
</script>
