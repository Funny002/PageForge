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
      <span class="fp-proprow__label">W</span>
      <n-input-number size="small" :value="node.width" :min="1" @update:value="update('width', $event)" />
    </div>
    <div class="fp-proprow" style="flex-direction: column; align-items: flex-start; gap: 4px;">
      <span class="fp-proprow__label" style="width: auto;">文本</span>
      <n-input type="textarea" size="small" :value="String(node.props.text ?? '')" :rows="2" @update:value="updateProp('text', $event)" style="width: 100%;" />
    </div>
    <div class="fp-proprow">
      <span class="fp-proprow__label">字号</span>
      <n-input-number size="small" :value="Number(node.props.fontSize ?? 16)" :min="1" @update:value="updateProp('fontSize', $event)" />
    </div>
    <div class="fp-proprow">
      <span class="fp-proprow__label">颜色</span>
      <n-color-picker size="small" :value="String(node.props.color ?? '#1f2328')" @update:value="updateProp('color', $event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NInputNumber, NColorPicker, NInput } from 'naive-ui'
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
