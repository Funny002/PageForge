<template>
  <div class="pf-stage-canvas">
    <div class="pf-stage-corner" />
    <PageForgeRuler direction="horizontal" :scale="data.scale" :offset="data.offsetX" :start="data.start" />
    <PageForgeRuler direction="vertical" :scale="data.scale" :offset="data.offsetY" :start="data.start" />
    <div class="pf-stage-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import PageForgeRuler from './ruler/index.vue';

defineOptions({ name: 'PageForgeStageCanvas' });

const data = reactive({
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  start: -100,
});
</script>

<style lang="scss" scoped src="./style.scss"></style>
