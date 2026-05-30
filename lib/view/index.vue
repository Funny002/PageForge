<template>
  <n-config-provider class="fp-provider" :theme-overrides="props.theme">
    <div>PageForge</div>
  </n-config-provider>
</template>

<script lang="ts" setup>
import type { GlobalThemeOverrides } from 'naive-ui';
import { createStore, STORE_KEY } from '../store';
import { darkGithub } from '../theme';

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
