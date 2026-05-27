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
import { onMounted, useTemplateRef, watch } from 'vue';

defineOptions({ name: 'PageForest' });

import PageForgeTop from './pageForgeTop/index.vue';
import PageForgeLeft from './pageForgeLeft/index.vue';
import PageForgeStage from './pageForgeStage/index.vue';
import PageForgeRight from './pageForgeRight/index.vue';
import PageForgeBottom from './pageForgeBottom/index.vue';

import { applyTheme, githubLight } from '../theme';
import type { ThemeConfig } from '../theme';

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

<style lang="scss" src="style.scss"></style>
