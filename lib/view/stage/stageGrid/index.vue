<template>
  <svg v-if="grid.type !== 'none'" class="pf-stage-grid" :style="{ opacity: grid.opacity }">
    <defs>
      <pattern v-if="grid.type === 'dot'" id="pf-g-dot" x="0" y="0" :width="grid.size" :height="grid.size" patternUnits="userSpaceOnUse"
               :patternTransform="transformStr">
        <circle :cx="grid.size / 2" :cy="grid.size / 2" r="1" :fill="grid.color" />
      </pattern>
      <pattern v-if="grid.type === 'line'" id="pf-g-line" x="0" y="0" :width="grid.size" :height="grid.size" patternUnits="userSpaceOnUse"
               :patternTransform="transformStr">
        <line x1="0" y1="0" :x2="grid.size" y2="0" :stroke="grid.color" stroke-width="0.5" />
        <line x1="0" y1="0" x2="0" :y2="grid.size" :stroke="grid.color" stroke-width="0.5" />
      </pattern>
      <pattern v-if="grid.type === 'checkerboard'" id="pf-g-checker" x="0" y="0" :width="grid.size * 2" :height="grid.size * 2" patternUnits="userSpaceOnUse"
               :patternTransform="transformStr">
        <rect :width="grid.size" :height="grid.size" fill="transparent" />
        <rect :x="grid.size" y="0" :width="grid.size" :height="grid.size" :fill="grid.color" />
        <rect x="0" :y="grid.size" :width="grid.size" :height="grid.size" :fill="grid.color" />
        <rect :x="grid.size" :y="grid.size" :width="grid.size" :height="grid.size" fill="transparent" />
      </pattern>
      <pattern v-if="grid.type === 'cross'" id="pf-g-cross" x="0" y="0" :width="grid.size" :height="grid.size" patternUnits="userSpaceOnUse"
               :patternTransform="transformStr">
        <line :x1="grid.size / 2" :y1="grid.size / 2 - 3" :x2="grid.size / 2" :y2="grid.size / 2 + 3" :stroke="grid.color" stroke-width="0.5" />
        <line :x1="grid.size / 2 - 3" :y1="grid.size / 2" :x2="grid.size / 2 + 3" :y2="grid.size / 2" :stroke="grid.color" stroke-width="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" :fill="fillUrl" />
  </svg>
</template>

<script setup lang="ts">
defineOptions({ name: 'PageForgeStageGrid' });

import { useStoreState } from '../../../core';
import type { GridConfig } from '../../../core';

interface Props {
  scale?: number;
  viewportX?: number;
  viewportY?: number;
}

const props = withDefaults(defineProps<Props>(), {
  scale: 1,
  viewportX: 0,
  viewportY: 0,
});

const grid = useStoreState<GridConfig>('grid', {
  type: 'dot',
  size: 20,
  color: 'var(--pf-border-muted)',
  opacity: 1,
});

const transformStr = computed(() => `translate(${props.viewportX}, ${props.viewportY}) scale(${props.scale})`);

const fillUrl = computed(() => {
  const idMap: Record<string, string> = {
    dot: 'pf-g-dot',
    line: 'pf-g-line',
    checkerboard: 'pf-g-checker',
    cross: 'pf-g-cross',
  };
  return `url(#${idMap[grid.value.type] ?? ''})`;
});
</script>

<style lang="scss" scoped src="./style.scss"></style>
