<template>
  <component :is="node.tagName" :class="['pf-node-heading', { 'pf-selected': selected }]" @click.stop="handleClick">
    <template v-if="node.textContent">{{ node.textContent }}</template>
    <NodeRenderer v-for="child in node.children" :key="child.id" :node="child" :selectedNodeId="selectedNodeId" />
  </component>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import type { PageNode } from '../../core/types';
import NodeRenderer from '../NodeRenderer.vue';

const props = defineProps<{
  node: PageNode;
  selectedNodeId: string | null;
}>();

const selectNode = inject<(nodeId: string) => void>('selectNode')!;
const selected = computed(() => props.node.id === props.selectedNodeId);

function handleClick() {
  selectNode(props.node.id);
}
</script>

<style lang="scss" src="./style.scss"></style>
