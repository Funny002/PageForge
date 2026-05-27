<template>
  <div ref="layoutRef" class="pf-layout">
    <TopBar />
    <div class="pf-middle">
      <LeftPanel />
      <Stage :page="page" :selectedNodeId="selectedNodeId" @deselect="deselectAll" />
      <RightPanel />
    </div>
    <BottomBar />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'PageForest' });

import { onMounted, onUnmounted, provide, useTemplateRef, ref, watch } from 'vue';
import type { Store } from 'common-store';
import { githubLight, applyTheme, type ThemeConfig } from '../theme';
import { createPageStore } from '../core/store';
import type { PageNode } from '../core/types';
import TopBar from './top/index.vue';
import LeftPanel from './left/index.vue';
import Stage from './stage/index.vue';
import RightPanel from './right/index.vue';
import BottomBar from './bottom/index.vue';

const props = withDefaults(defineProps<{
  theme?: ThemeConfig;
}>(), {
  theme: () => githubLight,
});

const layoutRef = useTemplateRef<HTMLElement>('layoutRef');

function doApplyTheme() {
  if (layoutRef.value) {
    applyTheme(layoutRef.value, props.theme);
  }
}

onMounted(doApplyTheme);
watch(() => props.theme, doApplyTheme);

const pageStore: Store = createPageStore();

const page = ref<PageNode | null>(pageStore.getState<PageNode>('page') ?? null);
const selectedNodeId = ref<string | null>(pageStore.getState<string | null>('selectedNodeId') ?? null);

const unsub1 = pageStore.subscribe('page', (newVal) => {
  page.value = newVal as PageNode;
});

const unsub2 = pageStore.subscribe('selectedNodeId', (newVal) => {
  selectedNodeId.value = newVal as string | null;
});

function handleSelectNode(nodeId: string) {
  pageStore.dispatch('node.select', nodeId);
}

function deselectAll() {
  pageStore.dispatch('node.deselect');
}

provide('selectNode', handleSelectNode);
provide('pageStore', pageStore);

onUnmounted(() => {
  unsub1();
  unsub2();
});
</script>

<style lang="scss" scoped>
.pf-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--pf-bg-primary);
  color: var(--pf-text-primary);
}

.pf-middle {
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: hidden;
}
</style>
