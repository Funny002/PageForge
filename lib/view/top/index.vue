<template>
  <div class="pf-top">
    <div class="pf-top-left"></div>
    <div class="pf-top-right">
      <span class="pf-top-label">画布</span>
      <NInputNumber
        class="pf-top-input"
        :value="canvasWidth"
        :min="1"
        :max="9999"
        size="small"
        :show-button="false"
        @update:value="onWidthChange"
      />
      <span class="pf-top-sep">×</span>
      <NInputNumber
        class="pf-top-input"
        :value="canvasHeight"
        :min="1"
        :max="9999"
        size="small"
        :show-button="false"
        @update:value="onHeightChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStoreState, usePageStore } from '../../core';

defineOptions({ name: 'PageForgeTopBar' });

const store = usePageStore();

const canvasWidth = useStoreState<number>('canvasWidth', 1920);
const canvasHeight = useStoreState<number>('canvasHeight', 1080);

function onWidthChange(val: number | null) {
  if (val == null) return;
  store.actions.dispatch('canvas.resize', val, canvasHeight.value);
}

function onHeightChange(val: number | null) {
  if (val == null) return;
  store.actions.dispatch('canvas.resize', canvasWidth.value, val);
}
</script>

<style lang="scss" scoped src="./style.scss"></style>
