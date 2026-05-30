<template>
  <div class="fp-sidePanel">
    <side-menu :style="{background: themeVars.cardColor, borderRight: `1px solid ${themeVars.dividerColor}`}" />
    <side-panel :style="{width: sideWidth + 'px', background: themeVars.cardColor}" />
  </div>
</template>

<script setup lang="ts">
import SidePanel from './panel/index.vue';
import SideMenu from './menu/index.vue';
import { useThemeVars } from 'naive-ui';
import { useStoreState } from '../../store';

defineOptions({ name: 'SidePanel' });
const themeVars = useThemeVars();

const sideWidth = useStoreState('menu.width', 210);
</script>

<style lang="scss" src="./style.scss"></style>
