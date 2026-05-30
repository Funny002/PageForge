<template>
  <div
    v-if="node.visible"
    class="fp-node"
    :class="{
      'fp-selected': isSelected,
      'fp-locked': node.locked,
    }"
    :style="nodeStyle"
    @mousedown.stop="onMouseDown"
    @contextmenu.prevent.stop="onContextMenu"
  >
    <component :is="rendererComponent" v-if="rendererComponent" :node="node" />
    <template v-if="node.children.length">
      <NodeElement
        v-for="child in node.children"
        :key="child.id"
        :node="child"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePageForge } from '../../../composables/usePageForge'
import { flattenNodes } from '../../../utils/tree'
import type { PageNode } from '../../../core/types'

const props = defineProps<{ node: PageNode }>()

const forge = usePageForge()
const selectedIds = computed(() => forge.getState('page.selectedNodeIds') as string[])
const isSelected = computed(() => selectedIds.value.includes(props.node.id))
const zoom = computed(() => (forge.getState('page.viewport') as { zoom: number })?.zoom ?? 1)

const rendererComponent = computed(() => {
  const item = forge.content.nodes.getItem(props.node.type)
  return item?.component ?? null
})

const nodeStyle = computed(() => ({
  left: props.node.x + 'px',
  top: props.node.y + 'px',
  width: props.node.width + 'px',
  height: props.node.height + 'px',
  zIndex: (props.node.props.zIndex as number) ?? 0,
}))

function onMouseDown(event: MouseEvent) {
  if (event.button !== 0) return

  const selected = forge.getState('page.selectedNodeIds') as string[]

  if (event.ctrlKey || event.metaKey) {
    forge.dispatch('selection:toggle', props.node.id)
    return
  }

  if (!selected.includes(props.node.id)) {
    forge.dispatch('selection:set', [props.node.id])
  }

  const startX = event.clientX
  const startY = event.clientY
  const dragIds = selected.includes(props.node.id) ? [...selected] : [props.node.id]

  const nodes = forge.getState('page.nodes') as PageNode[]
  const flat = flattenNodes(nodes)
  const positions = new Map<string, { x: number; y: number }>()

  for (const node of flat) {
    if (dragIds.includes(node.id)) {
      positions.set(node.id, { x: node.x, y: node.y })
    }
  }

  let dragging = false

  function onMouseMove(e: MouseEvent) {
    const z = zoom.value
    const dx = (e.clientX - startX) / z
    const dy = (e.clientY - startY) / z

    if (!dragging && (Math.abs(dx) > 2 / z || Math.abs(dy) > 2 / z)) {
      dragging = true
    }

    if (dragging) {
      for (const id of dragIds) {
        const pos = positions.get(id)
        if (pos) {
          forge.dispatch('node:update', id, { x: pos.x + dx, y: pos.y + dy })
        }
      }
    }
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function onContextMenu(event: MouseEvent) {
  const selected = forge.getState('page.selectedNodeIds') as string[]
  if (!selected.includes(props.node.id)) {
    forge.dispatch('selection:set', [props.node.id])
  }
  forge.data.merge('page.contextMenu', {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    nodeId: props.node.id,
  })
}
</script>
