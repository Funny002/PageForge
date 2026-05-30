<template>
  <div class="fp-sidePanel_panel" :style="{width: sideWidth + 'px'}">
    <div class="fp-sidePanel_panel-drag" @pointerdown="onPointerDown"></div>
  </div>
</template>

<script lang="ts" setup>
import { usePointerMove } from '../../../hooks';

defineOptions({ name: 'side-panel' });

const sideWidth = ref(210);

const onPointerDown = (e: PointerEvent) => {
  const width = sideWidth.value;
  usePointerMove((moveX) => {
    sideWidth.value = Math.min(400, Math.max(Math.floor(width + moveX), 140));
  }, 10)(e);
};
</script>

<style lang="scss" src="./style.scss"></style>
