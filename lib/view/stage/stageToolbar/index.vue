<template>
  <div ref="toolbarRef" class="pf-stage-toolbar" :style="{ left: x + 'px', top: y + 'px' }" :class="{ 'is-dragging': dragging }">
    <div class="pf-toolbar-handle" @pointerdown.prevent="onDragStart">
      <span class="pf-toolbar-dot" v-for="i in 6" :key="i" />
    </div>
    <div class="pf-toolbar-sep" />
    <div class="pf-toolbar-group">
      <button class="pf-toolbar-btn" :class="{ 'is-active': tool === 'select' }" title="选择" @click="emit('change', 'tool', 'select')">
        <NIcon size="18">
          <MoveOutline />
        </NIcon>
      </button>
      <button class="pf-toolbar-btn" :class="{ 'is-active': tool === 'hand' }" title="拖拽" @click="emit('change', 'tool', 'hand')">
        <NIcon size="18">
          <HandLeftOutline />
        </NIcon>
      </button>
    </div>
    <div class="pf-toolbar-sep" />
    <div class="pf-toolbar-group pf-toolbar-zoom">
      <button class="pf-toolbar-btn pf-toolbar-zoom-btn" title="缩小" @click="zoomOut">
        <NIcon size="16">
          <RemoveOutline />
        </NIcon>
      </button>
      <input type="range" class="pf-toolbar-slider" :min="0.1" :max="5" :step="0.1" :value="scale" @input="onScaleInput" />
      <button class="pf-toolbar-btn pf-toolbar-zoom-btn" title="放大" @click="zoomIn">
        <NIcon size="16">
          <AddOutline />
        </NIcon>
      </button>
      <span class="pf-toolbar-zoom-label" title="重置缩放" @click="resetScale">{{ Math.round(scale * 100) }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { NIcon } from 'naive-ui';
import { MoveOutline, HandLeftOutline, AddOutline, RemoveOutline } from '@vicons/ionicons5';
import type { ToolType } from '../../../core';

defineOptions({ name: 'PageForgeStageToolbar' });

interface Props {
  tool: ToolType;
  scale: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  change: [type: 'tool' | 'scale', value: any]
}>();

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
  emit('change', 'scale', parseFloat(target.value));
}

function zoomIn() {
  emit('change', 'scale', Math.min(5, props.scale + 0.1));
}

function zoomOut() {
  emit('change', 'scale', Math.max(0.1, props.scale - 0.1))
}

function resetScale() {
  emit('change', 'scale', 1)
}

onMounted(() => {
  initPosition();
  addEventListener('pointermove', onDragMove);
  addEventListener('pointerup', onDragEnd);
});

onUnmounted(() => {
  removeEventListener('pointermove', onDragMove);
  removeEventListener('pointerup', onDragEnd);
});
</script>

<style lang="scss" scoped src="./style.scss"></style>
