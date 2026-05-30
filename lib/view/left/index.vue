<template>
  <div class="pf-left">
    <div class="pf-sidebar-icons">
      <button
        v-for="view in sidebarViews"
        :key="view.id"
        class="pf-sidebar-icon"
        :class="{ 'is-active': activeId === view.id }"
        :title="view.title"
        @click="toggle(view.id)"
      >
        <component :is="view.icon" size="20" />
      </button>
    </div>

    <div v-if="activeView" class="pf-sidebar-panel">
      <div class="pf-sidebar-header">
        <span class="pf-sidebar-title">{{ activeView.title }}</span>
        <button class="pf-sidebar-close" @click="close">&times;</button>
      </div>
      <div class="pf-sidebar-body">
        <component :is="activeView.render" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPluginRegistry } from '../../plugin';

defineOptions({ name: 'PageForgeLeftPanel' });

const activeId = ref<string | null>(null);

const sidebarViews = getPluginRegistry().getSidebarViews();

const activeView = computed(() => sidebarViews.find((v) => v.id === activeId.value));

function toggle(id: string) {
  activeId.value = activeId.value === id ? null : id;
}

function close() {
  activeId.value = null;
}
</script>

<style lang="scss" scoped src="./style.scss"></style>
