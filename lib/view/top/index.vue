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
import { computed, inject } from 'vue';
import { PAGE_STORE_KEY } from '../../core';
import type { PageState } from '../../core';
import type { Store } from 'common-store';

defineOptions({ name: 'PageForgeTopBar' });

const store = inject<Store>(PAGE_STORE_KEY);

function getState(): PageState | undefined {
  if (!store) return undefined;
  return store.data.get() as PageState;
}

const canvasWidth = computed(() => getState()?.canvasWidth ?? 1920);

const canvasHeight = computed(() => getState()?.canvasHeight ?? 1080);

function onWidthChange(val: number | null) {
  if (val == null) return;
  const state = getState();
  store?.actions.dispatch('canvas.resize', val, state?.canvasHeight ?? 1080);
}

function onHeightChange(val: number | null) {
  if (val == null) return;
  const state = getState();
  store?.actions.dispatch('canvas.resize', state?.canvasWidth ?? 1920, val);
}
</script>

<style lang="scss" scoped src="./style.scss"></style>
