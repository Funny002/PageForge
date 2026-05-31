<template>
  <pageForge :theme="lightVscode" @load="onHandleLoad" />
</template>

<script setup lang="ts">
import { VueDevtools } from 'common-store/vue-devtools';
import { pageForge, lightVscode } from '../../lib';
import type { Store } from 'common-store';
import { getCurrentInstance } from 'vue';
import { Logger } from 'common-store';
import type { App } from 'vue';

const app = getCurrentInstance()?.appContext.app as App;

function onHandleLoad(store: Store) {
  store.use(Logger({ showDuration: false }));
  store.use(VueDevtools(app, { inspectorLabel: 'PageForge' }));
}
</script>

<style lang="scss" src="./style.scss"></style>
