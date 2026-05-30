<template>
  <div class="fp-sidePanel">
    <side-menu />
    <side-panel />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'SidePanel' });
import SidePanel from './panel/index.vue';
import SideMenu from './menu/index.vue';
</script>

<style lang="scss" src="./style.scss"></style>
