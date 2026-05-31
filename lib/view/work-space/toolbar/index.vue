<template>
  <div ref="toolbarRef" class="fp-workSpace-toolbar" :style="toolbarStyle">
    <div class="fp-workSpace-toolbar-grip" @pointerdown.stop="onHandleDrag">
      <n-icon :size="20">
        <Draggable />
      </n-icon>
    </div>
    <div class="fp-workSpace-toolbar-divider" />
    <n-button-group size="small">
      <n-button secondary :type="props.type === 'select' ? 'primary' : 'default'" @click="emits('update:tool', 'select')">
        <template #icon>
          <Cursor1 />
        </template>
      </n-button>
      <n-button secondary :type="props.type === 'move' ? 'primary' : 'default'" @click="emits('update:tool', 'move')">
        <template #icon>
          <Move />
        </template>
      </n-button>
    </n-button-group>
    <div class="fp-workSpace-toolbar-divider" />
    <div class="fp-workSpace-toolbar-zoom">
      <n-icon :size="20">
        <ZoomPan />
      </n-icon>
      <n-slider :value="props.scale" :min="10" :max="500" :step="1" style="width: 100px" @update:value="(v) => emits('update:scale', v)" />
      <n-button class="fp-workSpace-toolbar-zoom-label" text @click="onHandleClick">{{ props.scale }}%</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Cursor1, Draggable, Move, ZoomPan } from '@vicons/carbon';
import { usePointerMove } from '../../../hooks';

defineOptions({ name: 'WorkSpaceToolBar' });
const toolbarRef = useTemplateRef('toolbarRef');

const props = defineProps<{ type: string, scale: number }>();

const emits = defineEmits<{ 'update:scale': [value: number], 'update:tool': [value: string]; 'resize': any }>();
const onHandleClick = () => emits('resize');

const pos = reactive({ left: 200, bottom: 16 });
const toolbarStyle = computed(() => ({ left: `${pos.left}px`, bottom: `${pos.bottom}px` }));

const onHandleDrag = (e: PointerEvent) => {
  e.stopPropagation();
  const toolbar = toolbarRef.value!;
  const rect = toolbar.getBoundingClientRect();
  const parentRect = toolbar.parentElement!.getBoundingClientRect();
  pos.left = rect.left - parentRect.left;
  pos.bottom = parentRect.bottom - rect.bottom;

  const { left, bottom } = pos;
  usePointerMove((moveX, moveY) => {
    const parent = toolbar.parentElement!;
    const maxLeft = parent.clientWidth - toolbar.clientWidth;
    const maxBottom = parent.clientHeight - toolbar.clientHeight;
    pos.left = Math.floor(Math.max(0, Math.min(left + moveX, maxLeft)));
    pos.bottom = Math.floor(Math.max(0, Math.min(bottom - moveY, maxBottom)));
  }, 10)(e);
};

onMounted(async () => {
  await nextTick();
  const toolbar = toolbarRef.value!;
  const parent = toolbar.parentElement!;
  pos.left = Math.floor((parent.clientWidth - toolbar.clientWidth) / 2);
});
</script>

<style lang="scss" src="./style.scss"></style>
