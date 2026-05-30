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
    <div class="fp-proprow" style="flex-direction: column; align-items: flex-start; gap: 4px;">
      <span class="fp-proprow__label" style="width: auto;">URL</span>
      <n-input size="small" :value="String(node.props.src ?? '')" @update:value="updateProp('src', $event)" style="width: 100%;" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NInputNumber, NInput } from 'naive-ui'
import { usePageForge } from '../../../composables/usePageForge'
import type { PageNode } from '../../../core/types'

const props = defineProps<{ node: PageNode }>()
const forge = usePageForge()

function update(key: string, value: number | null) {
  if (value === null) return
  forge.dispatch('node:update', props.node.id, { [key]: value })
}

function updateProp(key: string, value: unknown) {
  forge.dispatch('node:update', props.node.id, { props: { ...props.node.props, [key]: value } })
}
</script>
