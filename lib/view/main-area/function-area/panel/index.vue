<template>
  <div class="fp-panel" :style="{ width: panelWidth + 'px' }">
    <div v-if="activeItem" class="fp-panel__content">
      <component :is="activeItem.panel" />
    </div>
    <div v-else class="fp-panel__placeholder">
      <span>选择功能图标以打开面板</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageForge } from '../../../../composables/usePageForge';
import { computed } from 'vue';


const forge = usePageForge();
const panelWidth = computed(() => forge.getState('layout.panelWidth') as number);
const activeIconId = computed(() => forge.getState('layout.activeIcon') as string | null);
const activeItem = computed(() => {
  if (!activeIconId.value) return null;
  return forge.content.functionArea.getItem(activeIconId.value) ?? null;
});
</script>

<style lang="scss" src="./style.scss"></style>
