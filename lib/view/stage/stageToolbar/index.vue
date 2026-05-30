<template>
  <div ref="toolbarRef" class="pf-stage-toolbar" :style="{ left: x + 'px', top: y + 'px' }" :class="{ 'is-dragging': dragging }">
    <div class="pf-toolbar-handle" @pointerdown.prevent="onDragStart">
      <n-icon :size="18">
        <Draggable />
      </n-icon>
    </div>
    <div class="pf-toolbar-sep" />
    <div class="pf-toolbar-group">
      <NButton size="small" :type="tool === 'select' ? 'primary' : 'tertiary'" title="选择" @click="store.actions.dispatch('stage.setTool', 'select')">
        <template #icon>
          <Cursor1 />
        </template>
      </NButton>
      <NButton size="small" :type="tool === 'hand' ? 'primary' : 'tertiary'" title="拖拽" @click="store.actions.dispatch('stage.setTool', 'hand')">
        <template #icon>
          <Move />
        </template>
      </NButton>
    </div>
    <div class="pf-toolbar-sep" />
    <div class="pf-toolbar-group pf-toolbar-zoom">
      <NButton size="tiny" tertiary title="缩小" @click="zoomOut">
        <template #icon>
          <Subtract />
        </template>
      </NButton>
      <input type="range" class="pf-toolbar-slider" :min="0.1" :max="5" :step="0.1" :value="scale" @input="onScaleInput" />
      <NButton size="tiny" tertiary title="放大" @click="zoomIn">
        <template #icon>
          <Add />
        </template>
      </NButton>
      <span class="pf-toolbar-zoom-label" title="重置缩放" @click="resetScale">{{ Math.round(scale * 100) }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'PageForgeStageToolbar' });
import { Cursor1, Draggable, Add, Subtract, Move } from '@vicons/carbon';
import { useStoreState, usePageStore } from '../../../core';
import type { ToolType } from '../../../core';

const store = usePageStore();

const tool = useStoreState<ToolType>('tool', 'select');
const scale = useStoreState<number>('scale', 1);

const x = ref(0);
const y = ref(0);
const dragging = ref(false);

const toolbarRef = ref<HTMLElement>();

let dragStartX = 0;
let dragStartY = 0;
let startX = 0;
let startY = 0;

function initPosition() {
  const parent = toolbarRef.value?.parentElement;
  if (!parent) return;
  const rect = parent.getBoundingClientRect();
  const el = toolbarRef.value!;
  const elRect = el.getBoundingClientRect();
  x.value = rect.width / 2 - elRect.width / 2;
  y.value = rect.height - elRect.height - 12;
}

function onDragStart(e: PointerEvent) {
  dragging.value = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  startX = x.value;
  startY = y.value;
  toolbarRef.value?.setPointerCapture(e.pointerId);
}

function onDragMove(e: PointerEvent) {
  if (!dragging.value) return;
  const parent = toolbarRef.value?.parentElement;
  const el = toolbarRef.value;
  if (!parent || !el) return;

  let nx = startX + e.clientX - dragStartX;
  let ny = startY + e.clientY - dragStartY;

  const pw = parent.clientWidth;
  const ph = parent.clientHeight;
  const ew = el.offsetWidth;
  const eh = el.offsetHeight;

  nx = Math.max(0, Math.min(nx, pw - ew));
  ny = Math.max(0, Math.min(ny, ph - eh));

  x.value = nx;
  y.value = ny;
}

function onDragEnd(_e: PointerEvent) {
  dragging.value = false;
}

function onScaleInput(e: Event) {
  const target = e.target as HTMLInputElement;
  store.actions.dispatch('stage.setScale', parseFloat(target.value));
}

function zoomIn() {
  store.actions.dispatch('stage.setScale', Math.min(5, scale.value + 0.1));
}

function zoomOut() {
  store.actions.dispatch('stage.setScale', Math.max(0.1, scale.value - 0.1));
}

function resetScale() {
  store.actions.dispatch('stage.setScale', 1);
}

onMounted(() => {
  initPosition();
  document.addEventListener('pointermove', onDragMove);
  document.addEventListener('pointerup', onDragEnd);
});

onUnmounted(() => {
  document.removeEventListener('pointermove', onDragMove);
  document.removeEventListener('pointerup', onDragEnd);
});
</script>

<style lang="scss" scoped src="./style.scss"></style>
