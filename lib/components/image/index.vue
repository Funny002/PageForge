<template>
  <div :class="['pf-node-image', { 'pf-selected': selected }]" @click.stop="handleClick">
    <img v-if="src" :src="src" :alt="alt" :width="width" :height="height" />
    <span v-else class="pf-image-fallback">{{ node.textContent || 'img' }}</span>
  </div>
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

const src = computed(() => props.node.attributes.src || '');
const alt = computed(() => props.node.attributes.alt || '');
const width = computed(() => props.node.attributes.width || undefined);
const height = computed(() => props.node.attributes.height || undefined);

function handleClick() {
  selectNode(props.node.id);
}
</script>

<style lang="scss" src="./style.scss"></style>
