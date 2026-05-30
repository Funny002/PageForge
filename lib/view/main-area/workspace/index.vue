<template>
  <div
    ref="workspaceRef"
    class="fp-workspace"
    @wheel.prevent="onWheel"
    @mousedown="onWorkspaceMouseDown"
    @mousemove="onWorkspaceMouseMove"
    @mouseup="onWorkspaceMouseUp"
    @contextmenu.prevent="onWorkspaceContextMenu"
  >
    <div
      class="fp-workspace__viewport"
      :style="viewportStyle"
    >
      <NodeElement
        v-for="node in nodes"
        :key="node.id"
        :node="node"
      />
      <SelectionHandles />
    </div>
    <div
      v-if="boxSelect.active"
      class="fp-selectbox"
      :style="boxSelectStyle"
    />
    <ContextMenu />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { usePageForge } from '../../../composables/usePageForge'
import { flattenNodes } from '../../../utils/tree'
import type { PageNode } from '../../../core/types'
import NodeElement from './node-element.vue'
import SelectionHandles from './selection-handles.vue'
import ContextMenu from './context-menu/index.vue'


const forge = usePageForge()
const workspaceRef = ref<HTMLElement | null>(null)

const nodes = computed(() => forge.getState('page.nodes') as PageNode[])

const viewportVersion = ref(0)
const viewport = computed(() => {
  void viewportVersion.value
  return forge.getState('page.viewport') as { x: number; y: number; zoom: number }
})
const viewportStyle = computed(() => ({
  transform: `translate(${viewport.value.x}px, ${viewport.value.y}px) scale(${viewport.value.zoom})`,
}))

const boxSelect = reactive({
  active: false,
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
})

const boxSelectStyle = computed(() => {
  if (!boxSelect.active) return { display: 'none' }
  const left = Math.min(boxSelect.startX, boxSelect.currentX)
  const top = Math.min(boxSelect.startY, boxSelect.currentY)
  const width = Math.abs(boxSelect.currentX - boxSelect.startX)
  const height = Math.abs(boxSelect.currentY - boxSelect.startY)
  return { left: left + 'px', top: top + 'px', width: width + 'px', height: height + 'px', display: 'block' }
})

let isPanning = false
let panStartX = 0
let panStartY = 0
let panViewportX = 0
let panViewportY = 0

function screenToCanvas(clientX: number, clientY: number) {
  const rect = workspaceRef.value?.getBoundingClientRect()
  if (!rect) return { x: clientX, y: clientY }
  const vp = viewport.value
  return {
    x: (clientX - rect.left - vp.x) / vp.zoom,
    y: (clientY - rect.top - vp.y) / vp.zoom,
  }
}

function clientToWorkspace(clientX: number, clientY: number) {
  const rect = workspaceRef.value?.getBoundingClientRect()
  if (!rect) return { x: clientX, y: clientY }
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  }
}

function onWorkspaceMouseDown(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (target.closest('.fp-node') || target.closest('.fp-handle')) return

  if (event.button === 0) {
    boxSelect.active = true
    const pos = clientToWorkspace(event.clientX, event.clientY)
    boxSelect.startX = pos.x
    boxSelect.startY = pos.y
    boxSelect.currentX = pos.x
    boxSelect.currentY = pos.y
  } else if (event.button === 1) {
    isPanning = true
    panStartX = event.clientX
    panStartY = event.clientY
    panViewportX = viewport.value.x
    panViewportY = viewport.value.y
    event.preventDefault()
  }
}

function onWorkspaceMouseMove(event: MouseEvent) {
  if (boxSelect.active) {
    const pos = clientToWorkspace(event.clientX, event.clientY)
    boxSelect.currentX = pos.x
    boxSelect.currentY = pos.y
  }
  if (isPanning) {
    const dx = event.clientX - panStartX
    const dy = event.clientY - panStartY
    forge.data.merge('page.viewport', { x: panViewportX + dx, y: panViewportY + dy })
  }
}

function onWorkspaceMouseUp() {
  if (boxSelect.active) {
    boxSelect.active = false
    const left = Math.min(boxSelect.startX, boxSelect.currentX)
    const top = Math.min(boxSelect.startY, boxSelect.currentY)
    const right = Math.max(boxSelect.startX, boxSelect.currentX)
    const bottom = Math.max(boxSelect.startY, boxSelect.currentY)

    if (Math.abs(right - left) < 5 && Math.abs(bottom - top) < 5) {
      forge.dispatch('selection:clear')
    } else {
      const rect = workspaceRef.value?.getBoundingClientRect()
      if (rect) {
        const canvasLeft = screenToCanvas(left + rect.left, top + rect.top).x
        const canvasTop = screenToCanvas(left + rect.left, top + rect.top).y
        const canvasRight = screenToCanvas(right + rect.left, bottom + rect.top).x
        const canvasBottom = screenToCanvas(right + rect.left, bottom + rect.top).y

        const allNodes = flattenNodes(forge.getState('page.nodes') as PageNode[])
        const matched = allNodes.filter((n) => {
          return (
            n.x < canvasRight &&
            n.x + n.width > canvasLeft &&
            n.y < canvasBottom &&
            n.y + n.height > canvasTop
          )
        })
        forge.dispatch('selection:set', matched.map((n) => n.id))
      }
    }
  }
  isPanning = false
}

function onWorkspaceContextMenu(event: MouseEvent) {
  forge.data.merge('page.contextMenu', {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    nodeId: null,
  })
}

function onWheel(event: WheelEvent) {
  const delta = event.deltaY > 0 ? 0.9 : 1.1
  const vp = viewport.value
  const rect = workspaceRef.value?.getBoundingClientRect()
  if (!rect) return

  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top

  const newZoom = Math.min(5, Math.max(0.2, vp.zoom * delta))
  const scale = newZoom / vp.zoom

  const newX = mouseX - (mouseX - vp.x) * scale
  const newY = mouseY - (mouseY - vp.y) * scale

  forge.data.merge('page.viewport', { zoom: newZoom, x: newX, y: newY })
}

function computeInitialViewport() {
  const el = workspaceRef.value
  if (!el) return

  const pageWidth = (forge.getState('page.width') as number) ?? 1920
  const pageHeight = (forge.getState('page.height') as number) ?? 1080
  const rect = el.getBoundingClientRect()
  const ww = rect.width
  const wh = rect.height

  if (ww === 0 || wh === 0) return

  const zoom = Math.min(ww / pageWidth, wh / pageHeight, 1)
  const x = (ww - pageWidth * zoom) / 2
  const y = (wh - pageHeight * zoom) / 2

  forge.data.merge('page.viewport', { zoom, x, y })
}

let unsubViewport: (() => void) | null = null

onMounted(() => {
  unsubViewport = forge.subscribe('page.viewport', () => {
    viewportVersion.value++
  })

  requestAnimationFrame(() => {
    computeInitialViewport()
  })
  const observer = new ResizeObserver(() => {
    computeInitialViewport()
  })
  const el = workspaceRef.value
  if (el) observer.observe(el)
})

onUnmounted(() => {
  if (unsubViewport) unsubViewport()
})
</script>

<style lang="scss" src="./style.scss"></style>
