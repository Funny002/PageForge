<template>
  <div>
    PageForge
  </div>
</template>

<script lang="ts" setup>
import { createStore, STORE_KEY } from '../store';

const pageStore = createStore();
provide(STORE_KEY, pageStore);

const emits = defineEmits(['load']);

onMounted(() => {
  emits('load', pageStore);
});
</script>
