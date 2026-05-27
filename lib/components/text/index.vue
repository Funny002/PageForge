<template>
  <span :class="['pf-node-text', { 'pf-selected': selected }]" @click.stop="handleClick">{{ node.textContent }}</span>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import type { PageNode } from '../../core/types';

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
