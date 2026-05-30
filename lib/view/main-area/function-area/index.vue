<template>
  <div class="fp-func">
    <IconBar />
    <Panel />
    <div class="fp-func__resize" @mousedown="onResizeMouseDown" />
  </div>
</template>

<script setup lang="ts">
import { usePageForge } from '../../../composables/usePageForge'
import { useResize } from '../../../composables/useResize'
import IconBar from './icon-bar/index.vue'
import Panel from './panel/index.vue'
const forge = usePageForge()
const { onMouseDown: onResizeMouseDown } = useResize({
  getWidth: () => (forge.getState('layout.panelWidth') as number) ?? 220,
  setWidth: (w: number) => forge.data.set('layout.panelWidth', w),
  min: 200,
  max: 400,
})
</script>

<style lang="scss" src="./style.scss"></style>
