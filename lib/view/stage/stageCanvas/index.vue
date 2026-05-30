<template>
  <div class="pf-stage-canvas" :class="{'is-ruler': showRuler}">
    <template v-if="showRuler">
      <div class="pf-stage-ruler-corner" />
      <PageForgeStageRuler direction="vertical" :scale="scale" :offset="viewportY" :start="0" />
      <PageForgeStageRuler direction="horizontal" :scale="scale" :offset="viewportX" :start="0" />
    </template>
    <PageForgeStageToolbar />
    <div class="pf-stage-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'PageForgeStageCanvas' });
import PageForgeStageToolbar from '../stageToolbar/index.vue';
import PageForgeStageRuler from '../stageRuler/index.vue';
import { useStoreState } from '../../../core';

const showRuler = useStoreState<boolean>('showRuler', true);

const scale = useStoreState<number>('scale', 1);
const viewportX = useStoreState<number>('viewportX', 0);
const viewportY = useStoreState<number>('viewportY', 0);
</script>

<style lang="scss" src="./style.scss"></style>
