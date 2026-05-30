<template>
  <div class="pf-node-rect" :style="rectStyle" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PageNode } from '../../core';

defineOptions({ name: 'PageForgeRectRenderer' });

interface Props {
  node: PageNode;
}

const props = defineProps<Props>();

const rectStyle = computed(() => ({
  background: String(props.node.props.fill ?? '#e8f0fe'),
  border: `1px solid ${String(props.node.props.borderColor ?? '#d0d7de')}`,
  borderRadius: `${Number(props.node.props.borderRadius ?? 0)}px`,
}));
</script>

<style lang="scss" scoped src="./rect.scss"></style>
