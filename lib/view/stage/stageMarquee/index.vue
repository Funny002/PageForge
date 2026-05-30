<template>
  <div
    v-if="rect"
    class="pf-stage-marquee"
    :style="marqueeStyle"
  />
</template>

<script setup lang="ts">
defineOptions({ name: 'PageForgeStageMarquee' });

interface Props {
  rect: { x: number; y: number; w: number; h: number } | null;
}

const props = defineProps<Props>();

const marqueeStyle = computed(() => {
  if (!props.rect) return { display: 'none' };
  const { x, y, w, h } = props.rect;
  return {
    left: `${Math.min(x, x + w)}px`,
    top: `${Math.min(y, y + h)}px`,
    width: `${Math.abs(w)}px`,
    height: `${Math.abs(h)}px`,
  };
});
</script>

<style lang="scss" scoped src="./style.scss"></style>
