<template>
  <div style="padding: 8px; height: 100%; overflow-y: auto;">
    <div style="font-size: 11px; color: var(--pf-text-color-muted); margin-bottom: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
      组件库
    </div>
    <div v-for="category in categories" :key="category.name" style="margin-bottom: 12px;">
      <div style="font-size: 11px; color: var(--pf-text-color-muted); margin-bottom: 4px; font-weight: 500;">
        {{ category.label }}
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px;">
        <div
          v-for="item in category.items"
          :key="item.id"
          style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px 4px; border-radius: 6px; cursor: pointer; background: var(--pf-card-bg); border: 1px solid var(--pf-border-muted); gap: 4px; transition: border-color 0.15s;"
          @click="onAddComponent(item)"
        >
          <component :is="item.icon" style="font-size: 22px; color: var(--pf-accent-color);" />
          <span style="font-size: 10px; color: var(--pf-text-color);">{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePageForge } from '../../composables/usePageForge'
import type { ComponentLibraryItem } from '../../core/types'

const forge = usePageForge()

const libraryItems = computed(() => forge.content.componentLibrary.getItems().value)

const categoryLabels: Record<string, string> = {
  basic: '基础',
  media: '媒体',
  container: '容器',
}

const categories = computed(() => {
  const map = new Map<string, { name: string; label: string; items: ComponentLibraryItem[] }>()
  for (const item of libraryItems.value) {
    const cat = item.category
    if (!map.has(cat)) {
      map.set(cat, { name: cat, label: categoryLabels[cat] ?? cat, items: [] })
    }
    map.get(cat)!.items.push(item)
  }
  return [...map.values()]
})

function onAddComponent(item: ComponentLibraryItem) {
  const pageWidth = (forge.getState('page.width') as number) ?? 1920
  const pageHeight = (forge.getState('page.height') as number) ?? 1080
  const centerX = pageWidth / 2 - item.defaultWidth / 2
  const centerY = pageHeight / 2 - item.defaultHeight / 2

  forge.dispatch('node:add', item.type, centerX, centerY, item.defaultWidth, item.defaultHeight, { ...item.defaultProps })
}
</script>
