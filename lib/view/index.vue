<template>
  <n-config-provider class="fp-provider" :theme-overrides="props.theme">
    <TopBar :style="{ background: props.theme.common?.bodyColor, borderBottom: `1px solid ${props.theme.common?.dividerColor}` }" />
    <div class="fp-container">
      <SidePanel :style="{ background: props.theme.common?.cardColor, borderRight: `1px solid ${props.theme.common?.dividerColor}` }" />
      <WorkSpace :style="{ background: props.theme.common?.inputColor }" />
      <AttrPanel :style="{ background: props.theme.common?.cardColor, borderLeft: `1px solid ${props.theme.common?.dividerColor}` }" />
    </div>
    <StatusBar :style="{ background: props.theme.common?.bodyColor, borderTop: `1px solid ${props.theme.common?.dividerColor}` }" />
  </n-config-provider>
</template>

<script lang="ts" setup>
import type { GlobalThemeOverrides } from 'naive-ui';
import { createStore, STORE_KEY } from '../store';
import { lightVscode } from '../theme';

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

const emits = defineEmits<{
  load: [store: typeof pageStore]
}>();

onMounted(() => {
  emits('load', pageStore);
});
</script>

<style lang="scss" src="./style.scss"></style>
