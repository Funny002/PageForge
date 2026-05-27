<template>
  <div class="pf-icon-bar">
    <button :class="['pf-icon-btn', { active: activeTab === 'pages' && expanded }]" title="Pages" @click="$emit('select-tab', 'pages')">
      <Documents />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Documents } from '@vicons/ionicons5';

defineOptions({ name: 'PageForgeIconBar' });

defineProps<{
  activeTab: string;
  expanded: boolean;
}>();

defineEmits<{
  toggle: [];
  'select-tab': [tab: string];
}>();
</script>

<style lang="scss" scoped>
.pf-icon-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  flex-shrink: 0;
  padding-top: 8px;
  gap: 4px;
  border-right: 1px solid var(--pf-border);
}

.pf-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--pf-text-tertiary);
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;

  &:hover {
    background-color: var(--pf-bg-tertiary);
    color: var(--pf-text-primary);
  }

  &.active {
    background-color: var(--pf-accent);
    background-color: color-mix(in srgb, var(--pf-accent) 15%, transparent);
    color: var(--pf-accent);
  }

  :deep(svg) {
    width: 20px;
    height: 20px;
  }
}
</style>
