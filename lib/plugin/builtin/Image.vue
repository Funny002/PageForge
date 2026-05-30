<template>
  <img v-if="node.props.src" class="pf-node-image" :src="String(node.props.src)" :alt="String(node.props.alt ?? '')" :style="imageStyle" />
  <div v-else class="pf-node-image-placeholder">{{ String(node.props.alt ?? 'Image') }}</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PageNode } from '../../core';

defineOptions({ name: 'PageForgeImageRenderer' });

interface Props {
  node: PageNode;
}

const props = defineProps<Props>();

const imageStyle = computed(() => ({
  objectFit: String(props.node.props.objectFit ?? 'cover') as any,
}));
</script>

<style lang="scss" scoped src="./image.scss"></style>
