<template>
  <span class="pf-node-text" :style="textStyle">{{ String(node.props.text ?? 'Text') }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PageNode } from '../../core';

defineOptions({ name: 'PageForgeTextRenderer' });

interface Props {
  node: PageNode;
}

const props = defineProps<Props>();

const textStyle = computed(() => ({
  fontSize: `${Number(props.node.props.fontSize ?? 16)}px`,
  fontWeight: String(props.node.props.fontWeight ?? 'normal') as any,
  color: String(props.node.props.color ?? 'var(--pf-text-primary)'),
  textAlign: String(props.node.props.textAlign ?? 'left') as any,
}));
</script>

<style lang="scss" scoped src="./text.scss"></style>
