<template>
  <PageForgeStageIndex>
    <div>DEMO</div>
  </PageForgeStageIndex>
</template>

<script setup lang="ts">
// import { inject } from 'vue';
// import { PAGE_STORE_KEY } from '../../core';
// import type { Store } from 'common-store';
import PageForgeStageIndex from './stageCanvas/index.vue';

defineOptions({ name: 'PageForgeStage' });

// const store = inject<Store>(PAGE_STORE_KEY);
</script>

<style lang="scss" scoped src="./style.scss"></style>
