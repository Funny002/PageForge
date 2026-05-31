<template>
  <div class="fp-topBar">
    <div class="fp-topBar-item">
      <n-icon :size="20">
        <FitToWidth />
      </n-icon>
      <n-input-number :min="100" :max="9999" size="small" :show-button="false" :value="canvasWidth" @update:value="v => handleResize('width', v)" />
    </div>
    <div class="fp-topBar-item">
      <n-icon :size="20">
        <FitToHeight />
      </n-icon>
      <n-input-number :min="100" :max="9999" size="small" :show-button="false" :value="canvasHeight" @update:value="v => handleResize('height', v)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { FitToWidth, FitToHeight } from '@vicons/carbon';
import { injectStore, useStore } from '../../store';

defineOptions({ name: 'TopBar' });

const store = injectStore();

const canvasWidth = useStore('canvas.width', 1920);
const canvasHeight = useStore('canvas.height', 1080);

function handleResize(type: 'width' | 'height', value: any) {
  const size = { width: canvasWidth, height: canvasHeight, [type]: value };
  store.actions.dispatch('canvas.resize', toValue(size.width), toValue(size.height));
}
</script>

<style lang="scss" src="./style.scss"></style>
