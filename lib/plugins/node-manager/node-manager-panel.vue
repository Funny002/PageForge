<template>
  <div style="padding: 8px; height: 100%; overflow-y: auto;">
    <div style="font-size: 11px; color: var(--pf-text-color-muted); margin-bottom: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
      图层
    </div>
    <div v-if="treeData.length === 0" style="color: var(--pf-text-color-muted); font-size: 12px; text-align: center; padding-top: 24px;">
      暂无元素
    </div>
    <n-tree
      v-else
      :data="treeData"
      :selected-keys="selectedKeys"
      key-field="key"
      label-field="label"
      children-field="children"
      block-line
      selectable
      @update:selected-keys="onSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NTree } from 'naive-ui'
import type { TreeOption } from 'naive-ui'
import { usePageForge } from '../../composables/usePageForge'
import type { PageNode } from '../../core/types'

const forge = usePageForge()

function buildTree(nodes: PageNode[]): TreeOption[] {
  return nodes.map((n) => ({
    key: n.id,
    label: n.name,
    children: buildTree(n.children),
  }))
}

const nodes = computed(() => forge.getState('page.nodes') as PageNode[])
const treeData = computed(() => buildTree(nodes.value))
const selectedKeys = computed(() => forge.getState('page.selectedNodeIds') as string[])

function onSelect(keys: string[]) {
  forge.dispatch('selection:set', keys)
}
</script>
