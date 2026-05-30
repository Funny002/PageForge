<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <div class="fp-proprow">
      <span class="fp-proprow__label">X</span>
      <n-input-number
        class="fp-proprow__input"
        size="small"
        :value="node.x"
        @update:value="update('x', $event)"
      />
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
    <div class="fp-proprow">
      <span class="fp-proprow__label">填充</span>
      <n-color-picker size="small" :value="String(node.props.fill ?? '#f0f0f0')" @update:value="updateProp('fill', $event)" />
    </div>
    <div class="fp-proprow">
      <span class="fp-proprow__label">边框</span>
      <n-color-picker size="small" :value="String(node.props.stroke ?? '#d0d7de')" @update:value="updateProp('stroke', $event)" />
    </div>
    <div class="fp-proprow">
      <span class="fp-proprow__label">圆角</span>
      <n-input-number size="small" :value="Number(node.props.cornerRadius ?? 0)" :min="0" @update:value="updateProp('cornerRadius', $event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NInputNumber, NColorPicker } from 'naive-ui'
import { usePageForge } from '../../../composables/usePageForge'
import type { PageNode } from '../../../core/types'

const props = defineProps<{ node: PageNode }>()
const forge = usePageForge()

function update(key: string, value: number | null) {
  if (value === null) return
  forge.dispatch('node:update', props.node.id, { [key]: value })
}

function updateProp(key: string, value: unknown) {
  forge.dispatch('node:update', props.node.id, {
    props: { ...props.node.props, [key]: value },
  })
}
</script>
