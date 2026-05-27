<template>
  <div class="pf-page-panel">
    <div class="pf-page-panel-header">
      <span>Pages</span>
    </div>
    <div class="pf-page-panel-list">
      <div class="pf-page-item active">
        <DocumentText />
        <span class="pf-page-name">index</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DocumentText } from '@vicons/ionicons5';

defineOptions({ name: 'PageForgePagePanel' });
</script>

<style lang="scss" scoped>
.pf-page-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.pf-page-panel-header {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--pf-text-secondary);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  flex-shrink: 0;
}

.pf-page-panel-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
}

.pf-page-item {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 13px;
  color: var(--pf-text-primary);
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background-color: var(--pf-bg-tertiary);
  }

  &.active {
    background-color: var(--pf-bg-tertiary);
  }

  :deep(svg) {
    width: 16px;
    height: 16px;
    color: var(--pf-text-tertiary);
    flex-shrink: 0;
  }
}
</style>
