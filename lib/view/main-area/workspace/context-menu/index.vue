<template>
  <div
    v-if="ctxMenu.visible"
    ref="menuRef"
    class="fp-ctxmenu"
    :style="menuStyle"
    @click.stop
  >
    <template v-for="item in visibleItems" :key="item.id">
      <div v-if="item.divider" class="fp-ctxmenu__divider" />
      <div
        v-else
        class="fp-ctxmenu__item"
        @click="onAction(item)"
      >
        <component :is="item.icon" v-if="item.icon" class="fp-ctxmenu__icon" />
        <span class="fp-ctxmenu__label">{{ item.label }}</span>
        <span v-if="item.shortcut" class="fp-ctxmenu__shortcut">{{ item.shortcut }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onUnmounted } from 'vue'
import { usePageForge } from '../../../../composables/usePageForge'
import type { ContextMenuItem, PageNode, MenuContext } from '../../../../core/types'
import { findNodeById } from '../../../../utils/tree'


const forge = usePageForge()
const menuRef = ref<HTMLElement | null>(null)

const ctxMenu = computed(() => forge.getState('page.contextMenu') as {
  visible: boolean; x: number; y: number; nodeId: string | null
})

const selectedIds = computed(() => forge.getState('page.selectedNodeIds') as string[])

const menuContext = computed<MenuContext>(() => {
  const nodeIds = selectedIds.value
  const nodes = forge.getState('page.nodes') as PageNode[]
  const nodeTypes = nodeIds.map((id: string) => findNodeById(nodes, id)?.type ?? '')
  return {
    nodeIds,
    nodeTypes,
    count: nodeIds.length,
    forge,
  }
})

const allItems = computed(() => forge.content.contextMenu.getItems().value)
const visibleItems = computed(() =>
  allItems.value.filter((item: ContextMenuItem) => {
    if (item.divider) return true
    if (item.visible) return item.visible(menuContext.value)
    return true
  }),
)

const menuStyle = computed(() => {
  const menu = menuRef.value
  const x = ctxMenu.value.x
  const y = ctxMenu.value.y

  if (!menu) return { left: x + 'px', top: y + 'px' }

  const rect = menu.getBoundingClientRect()
  const viewW = window.innerWidth
  const viewH = window.innerHeight

  let left = x
  let top = y

  if (x + rect.width > viewW) {
    left = x - rect.width
  }
  if (y + rect.height > viewH) {
    top = y - rect.height
  }

  return {
    left: Math.max(0, left) + 'px',
    top: Math.max(0, top) + 'px',
  }
})

function onAction(item: ContextMenuItem) {
  item.action(menuContext.value)
  closeMenu()
}

function closeMenu() {
  forge.data.merge('page.contextMenu', { visible: false })
}

function onGlobalClick(_e: MouseEvent) {
  if (ctxMenu.value.visible) {
    closeMenu()
  }
}

function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && ctxMenu.value.visible) {
    closeMenu()
  }
}

watch(
  () => ctxMenu.value.visible,
  (visible) => {
    if (visible) {
      document.addEventListener('click', onGlobalClick)
      document.addEventListener('keydown', onEscape)
      nextTick(() => {
        void menuRef.value?.offsetHeight
      })
    } else {
      document.removeEventListener('click', onGlobalClick)
      document.removeEventListener('keydown', onEscape)
    }
  },
)

onUnmounted(() => {
  document.removeEventListener('click', onGlobalClick)
  document.removeEventListener('keydown', onEscape)
})
</script>

<style lang="scss" src="./style.scss"></style>
