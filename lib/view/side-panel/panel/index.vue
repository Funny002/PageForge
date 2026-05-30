<template>
  <div class="fp-sidePanel_panel" :style="{width: sideWidth + 'px'}">
    <div class="fp-sidePanel_panel-drag" @mousedown="onMouseDown"></div>
  </div>
</template>

<script lang="ts" setup>
import { useMouseMove } from '../../../hooks';

defineOptions({ name: 'side-panel' });

const sideWidth = ref(210);

const onMouseDown = (e: MouseEvent) => {
  const width = sideWidth.value;
  useMouseMove((moveX: number) => {
    sideWidth.value = Math.min(400, Math.max(width + moveX, 140));
  }, 10)(e);
};
</script>

<style lang="scss" src="./style.scss"></style>
