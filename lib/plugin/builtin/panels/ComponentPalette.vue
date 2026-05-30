<template>
  <div class="pf-comp-palette">
    <div
      v-for="item in items"
      :key="item.type"
      class="pf-comp-item"
      @click="addNode(item.type)"
    >
      <span class="pf-comp-label">{{ item.config.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getPluginRegistry, createNode } from '../../../plugin';
import { usePageStore } from '../../../core';

defineOptions({ name: 'PageForgeComponentPalette' });

const store = usePageStore();

const items = computed(() => getPluginRegistry().getAll());

function addNode(type: string) {
  const node = createNode(type, 100, 100);
  store.actions.dispatch('stage.addNode', node);
}
</script>

<style lang="scss" scoped src="./palette.scss"></style>
