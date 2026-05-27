<template>
  <div class="pf-left" :style="{ width: panelExpanded ? '280px' : '80px' }">
    <IconBar :activeTab="activeTab" :expanded="panelExpanded" @toggle="panelExpanded = !panelExpanded" @select-tab="onSelectTab" />
    <PagePanel v-if="panelExpanded" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import IconBar from './icon-bar.vue';
import PagePanel from './page-panel.vue';

defineOptions({ name: 'PageForgeLeftPanel' });

const panelExpanded = ref(true);
const activeTab = ref<string>('pages');

function onSelectTab(tab: string) {
  if (activeTab.value === tab && panelExpanded.value) {
    panelExpanded.value = false;
  } else {
    activeTab.value = tab;
    panelExpanded.value = true;
  }
}
</script>

<style lang="scss" src="./style.scss"></style>
