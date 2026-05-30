<template>
  <template v-if="visible">
    <div
      v-for="h in handles"
      :key="h.dir"
      class="pf-stage-handle"
      :class="`is-${h.dir}`"
      :style="handleStyle(h.dir)"
      @pointerdown.stop="emit('pointerdown', $event, h.dir)"
    />
  </template>
</template>

<script setup lang="ts">

defineOptions({ name: 'PageForgeStageHandle' });

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Props {
  visible: boolean;
  bounds: Bounds;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  pointerdown: [e: PointerEvent, dir: string];
}>();

const handles: { dir: string }[] = [
  { dir: 'nw' }, { dir: 'n' }, { dir: 'ne' },
  { dir: 'w' }, { dir: 'e' },
  { dir: 'sw' }, { dir: 's' }, { dir: 'se' },
];

function handleStyle(dir: string) {
  const { x, y, width, height } = props.bounds;
  const s = 8;
  const map: Record<string, { left: string; top: string; cursor: string }> = {
    nw: { left: `${x - s / 2}px`, top: `${y - s / 2}px`, cursor: 'nwse-resize' },
    n: { left: `${x + width / 2 - s / 2}px`, top: `${y - s / 2}px`, cursor: 'ns-resize' },
    ne: { left: `${x + width - s / 2}px`, top: `${y - s / 2}px`, cursor: 'nesw-resize' },
    w: { left: `${x - s / 2}px`, top: `${y + height / 2 - s / 2}px`, cursor: 'ew-resize' },
    e: { left: `${x + width - s / 2}px`, top: `${y + height / 2 - s / 2}px`, cursor: 'ew-resize' },
    sw: { left: `${x - s / 2}px`, top: `${y + height - s / 2}px`, cursor: 'nesw-resize' },
    s: { left: `${x + width / 2 - s / 2}px`, top: `${y + height - s / 2}px`, cursor: 'ns-resize' },
    se: { left: `${x + width - s / 2}px`, top: `${y + height - s / 2}px`, cursor: 'nwse-resize' },
  };
  return map[dir] ?? {};
}
</script>

<style lang="scss" scoped src="./style.scss"></style>
