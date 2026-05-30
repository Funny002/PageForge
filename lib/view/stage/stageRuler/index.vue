<template>
  <canvas ref="canvasRef" class="pf-stage-ruler" :class="`is-${direction}`" />
</template>

<script setup lang="ts">
defineOptions({ name: 'PageForgeStageRuler' });

interface Props {
  scale: number;
  offset: number;
  start: number;
  direction: 'horizontal' | 'vertical';
}

const props = defineProps<Props>();

const canvasRef = ref<HTMLCanvasElement>();

const cw = ref(0);
const ch = ref(0);

let resizeObserver: ResizeObserver | null = null;

function niceStep(rawStep: number): number {
  if (rawStep <= 0) return 1;
  const exp = Math.floor(Math.log10(rawStep));
  const frac = rawStep / Math.pow(10, exp);
  let nice: number;
  if (frac <= 1) nice = 1;
  else if (frac <= 2) nice = 2;
  else if (frac <= 5) nice = 5;
  else nice = 10;
  return nice * Math.pow(10, exp);
}

function formatLabel(val: number, majorStep: number): string {
  if (majorStep >= 1) return String(Math.round(val));
  return val.toFixed(1);
}

function draw() {
  const canvas = canvasRef.value;
  if (!canvas || !cw.value || !ch.value) return;

  const w = cw.value;
  const h = ch.value;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = w * dpr;
  canvas.height = h * dpr;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(dpr, dpr);

  const styles = getComputedStyle(canvas);
  const bgColor = styles.getPropertyValue('--pf-bg-secondary').trim();
  const majorColor = styles.getPropertyValue('--pf-text-tertiary').trim();
  const minorColor = styles.getPropertyValue('--pf-border').trim();

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, w, h);

  const { scale, offset, start, direction } = props;
  if (scale <= 0) return;

  const size = direction === 'horizontal' ? w : h;
  const startValue = start + (-offset) / scale;
  const endValue = start + (size - offset) / scale;

  const rawStep = 80 / scale;
  const majorStep = niceStep(rawStep);
  const minorStep = majorStep / 5;

  const firstMajor = Math.floor(startValue / majorStep) * majorStep;
  const margin = majorStep;

  ctx.font = '10px sans-serif';

  for (let major = firstMajor - margin; major <= endValue + margin; major += majorStep) {
    for (let i = 0; i < 5; i++) {
      const val = major + i * minorStep;
      if (val < startValue - margin || val > endValue + margin) continue;
      const pos = (val - start) * scale + offset;
      if (pos < -30 || pos > size + 30) continue;

      if (i === 0) {
        ctx.strokeStyle = majorColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (direction === 'horizontal') {
          ctx.moveTo(pos, h - 14);
          ctx.lineTo(pos, h);
        } else {
          ctx.moveTo(w - 14, pos);
          ctx.lineTo(w, pos);
        }
        ctx.stroke();

        const label = formatLabel(val, majorStep);
        ctx.fillStyle = majorColor;
        if (direction === 'horizontal') {
          ctx.textBaseline = 'bottom';
          ctx.fillText(label, pos + 3, h - 14);
        } else {
          ctx.save();
          ctx.translate(w - 14, pos + 3);
          ctx.rotate(-Math.PI / 2);
          ctx.textBaseline = 'bottom';
          ctx.fillText(label, 0, 0);
          ctx.restore();
        }
      } else {
        ctx.strokeStyle = minorColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (direction === 'horizontal') {
          ctx.moveTo(pos, h - 6);
          ctx.lineTo(pos, h);
        } else {
          ctx.moveTo(w - 6, pos);
          ctx.lineTo(w, pos);
        }
        ctx.stroke();
      }
    }
  }
}

watch(
  () => [props.scale, props.offset, props.start, cw.value, ch.value] as const,
  () => draw(),
  { flush: 'post' },
);

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  resizeObserver = new ResizeObserver((entries) => {
    const rect = entries[0].contentRect;
    cw.value = rect.width;
    ch.value = rect.height;
  });
  resizeObserver.observe(canvas);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});
</script>

<style lang="scss" scoped src="./style.scss"></style>
