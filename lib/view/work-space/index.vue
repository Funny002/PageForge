<template>
  <div class="fp-workSpace">
    <div class="fp-workSpace-ruler-corner" />
    <WorkSpaceRuler direction="vertical" :scale="data.scale" :offset="data.viewY" />
    <WorkSpaceRuler direction="horizontal" :scale="data.scale" :offset="data.viewX" />
    <div class="fp-workSpace-container" @pointerdown="onPointerDown">
      <div class="fp-workSpace-body" ref="surfaceRef" :style="surfaceStyle">
        {{ data }}
      </div>
    </div>
    <WorkSpaceToolBar :type="data.tool" :scale="data.scale" @update:tool="data.tool = $event" @update:scale="data.scale = $event" @resize="onViewResize" />
  </div>
</template>

<script setup lang="ts">
import WorkSpaceToolBar from './toolbar/index.vue';
import WorkSpaceRuler from './ruler/index.vue';
import { usePointerMove } from '../../hooks';
import { useStore } from '../../store';

defineOptions({ name: 'WorkSpace' });

const canvasSize = useStore('canvas', { width: 1920, height: 1080 });
const data = reactive({ tool: 'move', viewX: 0, viewY: 0, scale: 100 });

const surfaceStyle = computed(() => {
  const { width, height } = toValue(canvasSize);
  const { viewX, viewY, scale } = data;
  return {
    width: `${width}px`,
    height: `${height}px`,
    transform: `translate(${viewX}px, ${viewY}px) scale(${scale / 100})`,
  };
});

const onPointerDown = (e: PointerEvent) => {
  if (data.tool !== 'move') return;
  const { viewX, viewY } = data;
  usePointerMove((moveX, moveY) => {
    data.viewX = Math.floor(viewX + moveX);
    data.viewY = Math.floor(viewY + moveY);
  }, 10)(e);
};

const surfaceRef = useTemplateRef('surfaceRef');

async function onViewResize() {
  await nextTick();
  const el = surfaceRef.value;
  if (!el) return;
  const parent = el.parentElement!;
  const pw = parent.clientWidth;
  const ph = parent.clientHeight;
  if (pw === 0 || ph === 0) return;
  data.scale = Math.floor(Math.min(pw / el.clientWidth, ph / el.clientHeight) * 90);
  data.viewY = Math.floor((ph - el.clientHeight * (data.scale / 100)) / 2);
  data.viewX = Math.floor((pw - el.clientWidth * (data.scale / 100)) / 2);
}

onMounted(() => onViewResize());
</script>

<style lang="scss" src="./style.scss"></style>
