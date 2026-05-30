<template>
  <div class="fp-iconbar">
    <div v-for="item in items" :key="item.id" class="fp-iconbar__item" :class="{ 'fp-active': item.id === activeIcon }" :title="item.tooltip ?? item.label" @click="onToggle(item.id)">
      <component :is="item.icon" class="fp-iconbar__icon" />
      <span class="fp-iconbar__label">{{ item.label }}</span>
      <span v-if="item.badge" class="fp-iconbar__badge">{{ item.badge() }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageForge } from '../../../../composables/usePageForge';
import { computed } from 'vue';
const forge = usePageForge();
const items = computed(() => forge.content.functionArea.getItems().value);
const activeIcon = computed(() => forge.getState('layout.activeIcon') as string | null);

function onToggle(id: string) {
  const current = forge.getState('layout.activeIcon');
  forge.data.set('layout.activeIcon', current === id ? null : id);
}
</script>

<style lang="scss" src="./style.scss"></style>
