<template>
  <div ref="layout" class="pf-layout">
    <PageForgeTop />
    <div class="pf-middle">
      <PageForgeLeft />
      <PageForgeStage />
      <PageForgeRight />
    </div>
    <PageForgeBottom />
  </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef, watch, provide, getCurrentInstance } from 'vue';
import type { App } from 'vue';

defineOptions({ name: 'PageForest' });

import PageForgeTop from './top/index.vue';
import PageForgeLeft from './left/index.vue';
import PageForgeStage from './stage/index.vue';
import PageForgeRight from './right/index.vue';
import PageForgeBottom from './bottom/index.vue';

import { applyTheme, githubLight } from '../theme';
import type { ThemeConfig } from '../theme';

import { createPageStore, PAGE_STORE_KEY } from '../core';

const app = getCurrentInstance()?.appContext.app as App;
const pageStore = createPageStore(app);
provide(PAGE_STORE_KEY, pageStore);

interface Props {
  theme?: ThemeConfig;
}

const props = withDefaults(defineProps<Props>(), {
  theme: () => githubLight,
});

const elRef = useTemplateRef<HTMLElement>('layout');

function doApplyTheme() {
  elRef.value && applyTheme(elRef.value, props.theme);
}

onMounted(doApplyTheme);
watch(() => props.theme, doApplyTheme);
</script>

<style lang="scss" src="./style.scss"></style>
