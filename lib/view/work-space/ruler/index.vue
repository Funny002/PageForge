<template>
  <canvas ref="canvasRef" :class="`fp-workSpace-ruler is-${props.direction}`" />
</template>

<script setup lang="ts">
defineOptions({ name: 'WorkSpaceRuler' });

const props = defineProps<{ direction: 'horizontal' | 'vertical'; scale: number; offset: number; }>();
const canvasRef = useTemplateRef('canvasRef');

const INTERVALS = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];

let cachedColors: { card: string; divider: string; text: string } | null = null;
let cachedColorsElement: HTMLElement | null = null;

function updateColors(el: HTMLElement) {
  const style = getComputedStyle(el);
  cachedColors = {
    card: style.getPropertyValue('--card-color').trim(),
    divider: style.getPropertyValue('--divider-color').trim(),
    text: style.getPropertyValue('--text-color-3').trim(),
  };
  cachedColorsElement = el;
}

function getColors(el: HTMLElement) {
  if (cachedColorsElement !== el || !cachedColors) {
    updateColors(el);
  }
  return cachedColors!;
}

function draw() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.scale(dpr, dpr);

  const isH = props.direction === 'horizontal';
  const scaleFactor = props.scale / 100;
  const offset = props.offset;

  const { card: cardColor, divider: dividerColor, text: textColor } = getColors(canvas);

  ctx.fillStyle = cardColor;
  ctx.fillRect(0, 0, w, h);

  let majorInterval = INTERVALS[INTERVALS.length - 1];
  for (const interval of INTERVALS) {
    if (interval * scaleFactor >= 80) {
      majorInterval = interval;
      break;
    }
  }
  const minorInterval = majorInterval / 10;

  ctx.strokeStyle = dividerColor;
  ctx.lineWidth = 1;
  if (isH) {
    ctx.beginPath();
    ctx.moveTo(0, h - 0.5);
    ctx.lineTo(w, h - 0.5);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(w - 0.5, 0);
    ctx.lineTo(w - 0.5, h);
    ctx.stroke();
  }

  const viewLength = isH ? w : h;
  const viewStart = -offset / scaleFactor;
  const viewEnd = viewStart + viewLength / scaleFactor;

  const minorStart = Math.ceil(viewStart / minorInterval) * minorInterval;
  ctx.strokeStyle = dividerColor;
  ctx.lineWidth = 1;
  for (let lx = minorStart; lx <= viewEnd; lx += minorInterval) {
    if (Math.abs(lx % majorInterval) < 0.001) continue;
    const px = offset + lx * scaleFactor;
    if (isH) {
      if (px < 0 || px > w) continue;
      ctx.beginPath();
      ctx.moveTo(px + 0.5, h - 7);
      ctx.lineTo(px + 0.5, h);
      ctx.stroke();
    } else {
      if (px < 0 || px > h) continue;
      ctx.beginPath();
      ctx.moveTo(w - 7, px + 0.5);
      ctx.lineTo(w, px + 0.5);
      ctx.stroke();
    }
  }

  const majorStart = Math.ceil(viewStart / majorInterval) * majorInterval;
  ctx.fillStyle = textColor;
  ctx.strokeStyle = textColor;
  ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.lineWidth = 1;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  for (let lx = majorStart; lx <= viewEnd; lx += majorInterval) {
    const px = offset + lx * scaleFactor;

    if (isH) {
      if (px < -40 || px > w + 40) continue;
      ctx.beginPath();
      ctx.moveTo(px + 0.5, h - 14);
      ctx.lineTo(px + 0.5, h);
      ctx.stroke();

      const label = String(lx);
      ctx.fillText(label, px, h - 19);
    } else {
      if (px < -40 || px > h + 40) continue;
      ctx.beginPath();
      ctx.moveTo(w - 14, px + 0.5);
      ctx.lineTo(w, px + 0.5);
      ctx.stroke();

      const label = String(lx);
      ctx.save();
      ctx.translate(w - 18, px);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillText(label, 0, 0);
      ctx.restore();
    }
  }
}

let observer: ResizeObserver | null = null;

onMounted(() => {
  const parent = canvasRef.value?.parentElement;
  if (parent) {
    observer = new ResizeObserver(() => draw());
    observer.observe(parent);
  }
  nextTick(() => draw());
});

onUnmounted(() => {
  observer?.disconnect();
});

watch(() => [props.scale, props.offset], () => draw());
</script>

<style lang="scss" src="./style.scss"></style>
