<template>
  <component :is="resolvedComponent" :node="node" :selectedNodeId="selectedNodeId" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PageNode } from '../core/types';
import { nodeComponentMap, textNodeComponent } from './index';
import ElementNode from './element/index.vue';

const props = defineProps<{
  node: PageNode;
  selectedNodeId: string | null;
}>();

const resolvedComponent = computed(() => {
  if (!props.node.tagName) return textNodeComponent;
  return nodeComponentMap[props.node.tagName] ?? ElementNode;
});
</script>
