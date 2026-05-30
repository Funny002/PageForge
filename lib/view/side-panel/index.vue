<template>
  <div class="fp-sidePanel" :style="`--primary-color: ${themeVars.primaryColor}`">
    <side-menu :style="{background: themeVars.cardColor, borderRight: `1px solid ${themeVars.dividerColor}`}" />
    <side-panel :style="{background: themeVars.cardColor}" />
  </div>
</template>

<script setup lang="ts">
import SidePanel from './panel/index.vue';
import SideMenu from './menu/index.vue';
import { useThemeVars } from 'naive-ui';

defineOptions({ name: 'SidePanel' });
const themeVars = useThemeVars();

</script>

<style lang="scss" src="./style.scss"></style>
