<template>
  <div
    class="pf-stage-node"
    :class="{ 'is-selected': selected }"
    :style="nodeStyle"
    @pointerdown.stop="emit('pointerdown', $event, node.id)"
  >
    <component :is="renderer" :node="node" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PageNode } from '../../../core';
import { getPluginRegistry } from '../../../plugin';

defineOptions({ name: 'PageForgeStageNode' });

interface Props {
  node: PageNode;
  selected: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  pointerdown: [e: PointerEvent, id: string];
}>();

const renderer = computed(() => {
  const config = getPluginRegistry().get(props.node.type);
  return config?.renderer ?? null;
});

const nodeStyle = computed(() => ({
  left: `${props.node.x}px`,
  top: `${props.node.y}px`,
  width: `${props.node.width}px`,
  height: `${props.node.height}px`,
}));
</script>

<style lang="scss" scoped src="./style.scss"></style>
