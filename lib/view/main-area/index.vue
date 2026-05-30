<template>
  <div class="fp-main">
    <FunctionArea />
    <Workspace />
    <PropertiesPanel />
  </div>
</template>

<script setup lang="ts">
import PropertiesPanel from './properties-panel/index.vue'
import FunctionArea from './function-area/index.vue'
import Workspace from './workspace/index.vue'
</script>

<style lang="scss" src="./style.scss"></style>
