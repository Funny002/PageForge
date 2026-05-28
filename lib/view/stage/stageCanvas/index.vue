<template>
  <div class="pf-stage-canvas" :class="{'is-ruler': isRuler}">
    <template v-if="isRuler">
      <div class="pf-stage-ruler-corner" />
      <PageForgeStageRuler direction="vertical" :scale="data.scale" :offset="data.offsetY" :start="data.start" />
      <PageForgeStageRuler direction="horizontal" :scale="data.scale" :offset="data.offsetX" :start="data.start" />
    </template>
    <div class="pf-stage-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'PageForgeStageCanvas' });

import { reactive } from 'vue';
import PageForgeStageRuler from '../stageRuler/index.vue';

const isRuler = true;
const data = reactive({
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  start: -100,
});
</script>

<style lang="scss" scoped src="./style.scss"></style>
