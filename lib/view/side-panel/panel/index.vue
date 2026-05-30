<template>
  <div class="fp-sidePanel_panel" :style="{width: sideWidth + 'px', }">
  </div>
</template>

<script setup lang="ts">
import { useStoreState } from '../../../store';

defineOptions({ name: 'side-panel' });

const sideWidth = useStoreState('menu.width', 210);

</script>

<style lang="scss" src="./style.scss"></style>
