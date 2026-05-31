<template>
  <n-config-provider class="fp-provider" :theme-overrides="props.theme" :style="themeStyle">
    <TopBar />
    <div class="fp-container">
      <SidePanel />
      <WorkSpace />
      <AttrPanel />
    </div>
    <StatusBar />
  </n-config-provider>
</template>

<script lang="ts" setup>
import type { GlobalThemeOverrides } from 'naive-ui';
import { createStore, STORE_KEY } from '../store';
import { lightVscode } from '../theme';
import { provide } from 'vue';

import TopBar from './top-bar/index.vue';
import StatusBar from './status-bar/index.vue';
import WorkSpace from './work-space/index.vue';
import SidePanel from './side-panel/index.vue';
import AttrPanel from './attr-panel/index.vue';

const pageStore = createStore();
provide(STORE_KEY, pageStore);

const props = withDefaults(defineProps<{
  theme?: GlobalThemeOverrides
}>(), {
  theme: () => lightVscode,
});

const themeStyle = computed(() => {
  const t = props.theme?.common || {};
  return {
    '--primary-color': t.primaryColor,
    '--body-color': t.bodyColor,
    '--card-color': t.cardColor,
    '--text-color-1': t.textColor1,
    '--text-color-2': t.textColor2,
    '--text-color-3': t.textColor3,
    '--divider-color': t.dividerColor,
    '--border-color': t.borderColor,
    '--hover-color': t.hoverColor,
    '--pressed-color': t.pressedColor,
    '--scrollbar-color': t.scrollbarColor,
    '--input-color': t.inputColor,
    '--success-color': t.successColor,
    '--warning-color': t.warningColor,
    '--error-color': t.errorColor,
    '--info-color': t.infoColor,
    '--box-shadow-1': t.boxShadow1,
    '--box-shadow-2': t.boxShadow2,
    '--box-shadow-3': t.boxShadow3,
  };
});

const emits = defineEmits<{
  load: [store: typeof pageStore]
}>();

onMounted(() => {
  emits('load', pageStore);
});
</script>

<style lang="scss" src="./style.scss"></style>
