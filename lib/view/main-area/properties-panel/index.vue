<template>
  <div v-if="visible" class="fp-props">
    <template v-if="activeNode">
      <div
        v-for="section in visibleSections"
        :key="section.id"
        class="fp-props__section"
      >
        <div class="fp-props__title">
          {{ section.label }}
        </div>
        <div class="fp-props__items">
          <component
            :is="item.component"
            v-for="item in sectionItemsMap.get(section.id)!"
            :key="item.id"
            :node="activeNode"
          />
        </div>
      </div>
    </template>
    <div v-else class="fp-props__empty">
      <span>未选中元素</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePageForge } from '../../../composables/usePageForge'
import { findNodeById } from '../../../utils/tree'
import type { PageNode, PropContext, PropertiesItem, PropertiesSection } from '../../../core/types'


const forge = usePageForge()

const selectedIds = computed(() => forge.getState('page.selectedNodeIds') as string[])
const visible = computed(() => selectedIds.value.length === 1)

const activeNode = computed<PageNode | null>(() => {
  if (!visible.value) return null
  const nodes = forge.getState('page.nodes') as PageNode[]
  return findNodeById(nodes, selectedIds.value[0])
})

const propCtx = computed<PropContext>(() => ({
  nodeType: activeNode.value?.type ?? '',
  node: activeNode.value!,
}))

const sections = computed(() => forge.content.properties.getSections().value)
const allPropItems = computed(() => forge.content.properties.getItems().value)

const visibleSections = computed(() =>
  sections.value.filter((section: PropertiesSection) => {
    const items = allPropItems.value.filter(
      (item: PropertiesItem) => item.sectionId === section.id,
    )
    if (items.length === 0) return false
    return items.some((item: PropertiesItem) => {
      if (item.visible) return item.visible(propCtx.value)
      return true
    })
  }),
)

const sectionItemsMap = computed(() => {
  const map = new Map<string, PropertiesItem[]>()
  const items = allPropItems.value
  const ctx = propCtx.value
  for (const section of sections.value) {
    const filtered = items
      .filter(i => i.sectionId === section.id)
      .filter(i => i.visible ? i.visible(ctx) : true)
      .sort((a, b) => a.priority - b.priority)
    map.set(section.id, filtered)
  }
  return map
})


</script>

<style lang="scss" src="./style.scss"></style>
