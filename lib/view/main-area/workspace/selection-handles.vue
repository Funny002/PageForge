<template>
  <div
    v-if="hasSingleSelection"
    class="fp-handles"
    :style="handleStyle"
  >
    <div class="fp-handle fp-handle--nw" @mousedown.stop="onResizeStart($event, 'nw')" />
    <div class="fp-handle fp-handle--n"  @mousedown.stop="onResizeStart($event, 'n')" />
    <div class="fp-handle fp-handle--ne" @mousedown.stop="onResizeStart($event, 'ne')" />
    <div class="fp-handle fp-handle--e"  @mousedown.stop="onResizeStart($event, 'e')" />
    <div class="fp-handle fp-handle--se" @mousedown.stop="onResizeStart($event, 'se')" />
    <div class="fp-handle fp-handle--s"  @mousedown.stop="onResizeStart($event, 's')" />
    <div class="fp-handle fp-handle--sw" @mousedown.stop="onResizeStart($event, 'sw')" />
    <div class="fp-handle fp-handle--w"  @mousedown.stop="onResizeStart($event, 'w')" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePageForge } from '../../../composables/usePageForge'
import { findNodeById } from '../../../utils/tree'
import type { PageNode } from '../../../core/types'

const forge = usePageForge()

const selectedIds = computed(() => forge.getState('page.selectedNodeIds') as string[])
const hasSingleSelection = computed(() => selectedIds.value.length === 1)
const zoom = computed(() => (forge.getState('page.viewport') as { zoom: number })?.zoom ?? 1)

const node = computed<PageNode | null>(() => {
  if (!hasSingleSelection.value) return null
  const nodes = forge.getState('page.nodes') as PageNode[]
  return findNodeById(nodes, selectedIds.value[0])
})

const handleStyle = computed(() => {
  if (!node.value) return { display: 'none' }
  return {
    left: node.value.x + 'px',
    top: node.value.y + 'px',
    width: node.value.width + 'px',
    height: node.value.height + 'px',
  }
})

function onResizeStart(event: MouseEvent, direction: string) {
  if (!node.value) return
  event.preventDefault()
  event.stopPropagation()

  const nodeId = node.value.id
  const startX = event.clientX
  const startY = event.clientY
  const startNode = { ...node.value }

  function onMouseMove(e: MouseEvent) {
    const z = zoom.value
    const dx = (e.clientX - startX) / z
    const dy = (e.clientY - startY) / z
    const minSize = 1

    let newX = startNode.x
    let newY = startNode.y
    let newW = startNode.width
    let newH = startNode.height

    if (direction.includes('e')) {
      newW = Math.max(minSize, startNode.width + dx)
    }
    if (direction.includes('w')) {
      newW = Math.max(minSize, startNode.width - dx)
      newX = startNode.x + dx
    }
    if (direction.includes('s')) {
      newH = Math.max(minSize, startNode.height + dy)
    }
    if (direction.includes('n')) {
      newH = Math.max(minSize, startNode.height - dy)
      newY = startNode.y + dy
    }

    forge.dispatch('node:update', nodeId, {
      x: newX,
      y: newY,
      width: newW,
      height: newH,
    })
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}
</script>
