<template>
  <div class="pf-stage">
    <PageForgeStageIndex>
      <div class="pf-page" :style="pageStyle" />
    </PageForgeStageIndex>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { PAGE_STORE_KEY } from '../../core';
import type { PageState } from '../../core';
import type { Store } from 'common-store';
import PageForgeStageIndex from './stageCanvas/index.vue';

defineOptions({ name: 'PageForgeStage' });

const store = inject<Store>(PAGE_STORE_KEY);

function getState(): PageState | undefined {
  if (!store) return undefined;
  return store.data.get() as PageState;
}

const pageStyle = computed(() => {
  const state = getState();
  const w = state?.canvasWidth ?? 1920;
  const h = state?.canvasHeight ?? 1080;
  return {
    width: `${w}px`,
    height: `${h}px`,
  };
});
</script>

<style lang="scss" scoped src="./style.scss"></style>
