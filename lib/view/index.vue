<template>
  <n-config-provider class="fp-provider" :theme-overrides="props.theme">
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
import { darkGithub } from '../theme';

import TopBar from './top-bar/index.vue';
import StatusBar from './status-bar/index.vue';
import WorkSpace from './work-space/index.vue';
import SidePanel from './side-panel/index.vue';
import AttrPanel from './attr-panel/index.vue';

const pageStore = createStore();
provide(STORE_KEY, pageStore);

const props = withDefaults(defineProps<{ theme?: GlobalThemeOverrides }>(), {
  theme: () => darkGithub,
});

const emits = defineEmits<{
  load: [store: typeof pageStore]
}>();

onMounted(() => {
  emits('load', pageStore);
});
</script>

<style lang="scss" src="./style.scss"></style>
