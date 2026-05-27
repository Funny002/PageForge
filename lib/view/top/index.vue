<template>
  <div class="pf-top">
    <div class="pf-top-left">
      <span class="pf-top-logo">PageForge</span>
    </div>
    <div class="pf-top-center"></div>
    <div class="pf-top-right">
      <div class="pf-canvas-controls">
        <select v-model="selectedPreset" class="pf-canvas-preset" @change="onPresetChange">
          <option value="desktop">Desktop (1920×1080)</option>
          <option value="tablet">Tablet (768×1024)</option>
          <option value="mobile">Mobile (375×667)</option>
          <option value="custom">Custom</option>
        </select>
        <input v-model.number="localWidth" class="pf-canvas-input" type="number" min="1" max="9999" @change="onSizeChange" />
        <span class="pf-canvas-sep">×</span>
        <input v-model.number="localHeight" class="pf-canvas-input" type="number" min="1" max="9999" @change="onSizeChange" />
        <span class="pf-canvas-unit">px</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onUnmounted, ref } from 'vue';
import type { Store } from 'common-store';

defineOptions({ name: 'PageForgeTopBar' });

const presets: Record<string, { w: number; h: number }> = {
  desktop: { w: 1920, h: 1080 },
  tablet: { w: 768, h: 1024 },
  mobile: { w: 375, h: 667 },
};

const pageStore = inject<Store>('pageStore')!;

const localWidth = ref<number>(pageStore.getState<number>('canvasWidth') ?? 1920);
const localHeight = ref<number>(pageStore.getState<number>('canvasHeight') ?? 1080);

const unsub1 = pageStore.subscribe('canvasWidth', (newVal) => {
  localWidth.value = newVal as number;
});
const unsub2 = pageStore.subscribe('canvasHeight', (newVal) => {
  localHeight.value = newVal as number;
});

function detectPreset(w: number, h: number): string {
  for (const [key, p] of Object.entries(presets)) {
    if (p.w === w && p.h === h) return key;
  }
  return 'custom';
}

const selectedPreset = ref<string>(detectPreset(localWidth.value, localHeight.value));

function onPresetChange() {
  if (selectedPreset.value !== 'custom') {
    const p = presets[selectedPreset.value]!;
    localWidth.value = p.w;
    localHeight.value = p.h;
    pageStore.dispatch('canvas.resize', p.w, p.h);
  }
}

function onSizeChange() {
  selectedPreset.value = detectPreset(localWidth.value, localHeight.value);
  pageStore.dispatch('canvas.resize', localWidth.value, localHeight.value);
}

onUnmounted(() => {
  unsub1();
  unsub2();
});
</script>

<style lang="scss" src="./style.scss"></style>
