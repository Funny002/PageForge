<template>
  <pageForge @load="onHandleLoad" />
</template>

<script setup lang="ts">
import { VueDevtools } from 'common-store/vue-devtools';
import type { Store } from 'common-store';
import { Logger } from 'common-store';
import { pageForge } from '../../lib';
import type { App } from 'vue';
import { useThemeVars } from 'naive-ui';

console.log(useThemeVars());

const app = getCurrentInstance()?.appContext.app as App;

function onHandleLoad(store: Store) {
  store.use(Logger({ showDuration: false }));
  store.use(VueDevtools(app, { inspectorLabel: 'PageForge' }));
}
</script>

<style lang="scss" src="./style.scss"></style>
