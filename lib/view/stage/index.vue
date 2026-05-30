<template>
  <PageForgeStageCanvas>
    <PageForgeStageGrid :scale="scale" :viewportX="viewportX" :viewportY="viewportY" />
    <div
      :ref="interaction.setSurfaceRef"
      class="pf-stage-surface"
      :style="surfaceStyle"
      @pointerup="interaction.onSurfacePointerUp"
      @pointerdown="interaction.onSurfacePointerDown"
      @pointermove="interaction.onSurfacePointerMove">
      <PageForgeStageNode v-for="node in nodes" :key="node.id" :node="node" :selected="selectedNodeIds.includes(node.id)" @pointerdown="(e) => interaction.onSurfacePointerDown(e)" />
      <PageForgeStageHandle
        v-for="id in selectedNodeIds"
        :key="`h-${id}`"
        :visible="tool === 'select'"
        :bounds="getNodeBounds(id)"
        @pointerdown="(e, dir) => interaction.onHandlePointerDown(e, id, dir)" />
      <PageForgeStageMarquee :rect="marquee" />
    </div>
  </PageForgeStageCanvas>
</template>

<script setup lang="ts">
defineOptions({ name: 'PageForgeStage' });

import PageForgeStageCanvas from './stageCanvas/index.vue';
import PageForgeStageGrid from './stageGrid/index.vue';
import PageForgeStageNode from './stageNode/index.vue';
import PageForgeStageMarquee from './stageMarquee/index.vue';
import PageForgeStageHandle from './stageHandle/index.vue';

import { useStoreState, usePageStore } from '../../core';
import type { PageNode } from '../../core';
import { useStageInteraction } from './useStageInteraction';

const store = usePageStore();

const canvasWidth = useStoreState<number>('canvasWidth', 1920);
const canvasHeight = useStoreState<number>('canvasHeight', 1080);
const scale = useStoreState<number>('scale', 1);
const viewportX = useStoreState<number>('viewportX', 0);
const viewportY = useStoreState<number>('viewportY', 0);
const tool = useStoreState<string>('tool', 'select');
const nodes = useStoreState<PageNode[]>('nodes', []);
const selectedNodeIds = useStoreState<string[]>('selectedNodeIds', []);

const interaction = useStageInteraction();
const marquee = interaction.marquee;
const surfaceRef = interaction.surfaceRef;

const surfaceStyle = computed(() => ({
  width: `${canvasWidth.value}px`,
  height: `${canvasHeight.value}px`,
  transform: `translate(${viewportX.value}px, ${viewportY.value}px) scale(${scale.value})`,
}));

function getNodeBounds(id: string): { x: number; y: number; width: number; height: number } {
  const node = nodes.value.find((n) => n.id === id);
  if (!node) return { x: 0, y: 0, width: 0, height: 0 };
  return {
    x: node.x ?? 0,
    y: node.y ?? 0,
    width: node.width ?? 100,
    height: node.height ?? 80,
  };
}

onMounted(async () => {
  await nextTick();
  const el = surfaceRef.value;
  if (!el) return;
  const parent = el.parentElement!;
  const pw = parent.clientWidth;
  const ph = parent.clientHeight;
  if (pw === 0 || ph === 0) return;
  const fitScale = Math.min(pw / canvasWidth.value, ph / canvasHeight.value) * 0.9;
  const vx = (pw - canvasWidth.value * fitScale) / 2;
  const vy = (ph - canvasHeight.value * fitScale) / 2;
  store.actions.dispatch('stage.setScale', parseFloat(fitScale.toFixed(2)));
  store.actions.dispatch('stage.setOffset', vx, vy);
});
</script>

<style lang="scss" scoped src="./style.scss"></style>
