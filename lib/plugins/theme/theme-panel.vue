<template>
  <div style="padding: 8px; height: 100%; overflow-y: auto;">
    <div style="font-size: 11px; color: var(--pf-text-color-muted); margin-bottom: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
      主题
    </div>

    <div style="margin-bottom: 12px;">
      <div style="font-size: 12px; margin-bottom: 4px; color: var(--pf-text-color);">预设</div>
      <div style="display: flex; gap: 6px;">
        <n-button size="small" :type="preset === 'github-light' ? 'primary' : 'default'" @click="setPreset('github-light')">
          GitHub Light
        </n-button>
        <n-button size="small" :type="preset === 'github-dark' ? 'primary' : 'default'" @click="setPreset('github-dark')">
          GitHub Dark
        </n-button>
      </div>
    </div>

    <div style="margin-bottom: 12px;">
      <div style="font-size: 12px; margin-bottom: 4px; color: var(--pf-text-color);">模式</div>
      <n-radio-group :value="mode" size="small" @update:value="onModeChange">
        <n-radio-button value="light">亮色</n-radio-button>
        <n-radio-button value="dark">暗色</n-radio-button>
        <n-radio-button value="system">系统</n-radio-button>
      </n-radio-group>
    </div>

    <div style="margin-bottom: 4px; font-size: 11px; color: var(--pf-text-color-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
      布局背景
    </div>
    <ColorRow v-for="row in layoutColors" :key="row.key" :label="row.label" :color="row.value" @update="(v: string) => setColor(row.key, v)" />

    <div style="margin: 8px 0 4px; font-size: 11px; color: var(--pf-text-color-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
      边框
    </div>
    <ColorRow v-for="row in borderColors" :key="row.key" :label="row.label" :color="row.value" @update="(v: string) => setColor(row.key, v)" />

    <div style="margin: 8px 0 4px; font-size: 11px; color: var(--pf-text-color-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
      文本
    </div>
    <ColorRow v-for="row in textColors" :key="row.key" :label="row.label" :color="row.value" @update="(v: string) => setColor(row.key, v)" />

    <div style="margin: 8px 0 4px; font-size: 11px; color: var(--pf-text-color-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
      强调色
    </div>
    <ColorRow v-for="row in accentColors" :key="row.key" :label="row.label" :color="row.value" @update="(v: string) => setColor(row.key, v)" />

    <div style="margin: 8px 0 4px; font-size: 11px; color: var(--pf-text-color-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
      图标
    </div>
    <ColorRow v-for="row in iconColors" :key="row.key" :label="row.label" :color="row.value" @update="(v: string) => setColor(row.key, v)" />

    <div style="display: flex; gap: 6px; margin-top: 12px; margin-bottom: 8px;">
      <n-button size="small" @click="exportTheme">导出 JSON</n-button>
      <n-button size="small" @click="importTheme">导入 JSON</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NRadioGroup, NRadioButton } from 'naive-ui'
import { usePageForge } from '../../composables/usePageForge'

const forge = usePageForge()

const preset = computed(() => forge.getState('app.theme.preset') as string)
const mode = computed(() => forge.getState('app.theme.mode') as string)
const colors = computed(() => forge.getState('app.theme.colors') as Record<string, string>)

function setPreset(name: string) {
  forge.dispatch('theme:resetPreset', name)
}

function onModeChange(value: string) {
  forge.dispatch('theme:setMode', value)
}

function setColor(key: string, value: string) {
  forge.dispatch('theme:setColor', key, value)
}

function exportTheme() {
  const json = forge.dispatch('theme:export')
  json.then((data: string) => {
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pageforge-theme.json'
    a.click()
    URL.revokeObjectURL(url)
  })
}

function importTheme() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string)
        forge.dispatch('theme:import', data)
      } catch {}
    }
    reader.readAsText(file)
  }
  input.click()
}

const colorDefs: { key: string; label: string }[] = [
  { key: 'headerBg', label: '顶栏背景' },
  { key: 'sidebarBg', label: '图标栏背景' },
  { key: 'panelBg', label: '面板背景' },
  { key: 'statusBarBg', label: '状态栏背景' },
  { key: 'workspaceBg', label: '画布背景' },
  { key: 'cardBg', label: '卡片背景' },
  { key: 'borderColor', label: '边框色' },
  { key: 'borderMuted', label: '次边框' },
  { key: 'textColor', label: '主文本' },
  { key: 'textColorMuted', label: '次文本' },
  { key: 'accentColor', label: '强调色' },
  { key: 'accentHover', label: '悬停色' },
  { key: 'dangerColor', label: '危险色' },
  { key: 'successColor', label: '成功色' },
  { key: 'warningColor', label: '警告色' },
  { key: 'iconColor', label: '图标色' },
  { key: 'iconActiveColor', label: '图标激活色' },
]

const layoutColors = computed(() => colorDefs.slice(0, 6).map((d) => ({ ...d, value: colors.value[d.key] ?? '#000' })))
const borderColors = computed(() => colorDefs.slice(6, 8).map((d) => ({ ...d, value: colors.value[d.key] ?? '#000' })))
const textColors = computed(() => colorDefs.slice(8, 10).map((d) => ({ ...d, value: colors.value[d.key] ?? '#000' })))
const accentColors = computed(() => colorDefs.slice(10, 16).map((d) => ({ ...d, value: colors.value[d.key] ?? '#000' })))
const iconColors = computed(() => colorDefs.slice(16).map((d) => ({ ...d, value: colors.value[d.key] ?? '#000' })))
</script>

<script lang="ts">
import { defineComponent, h } from 'vue'
import { NColorPicker } from 'naive-ui'

export const ColorRow = defineComponent({
  props: {
    label: String,
    color: String,
  },
  emits: ['update'],
  setup(props, { emit }) {
    return () =>
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 0' } }, [
        h('span', { style: { fontSize: '11px', color: 'var(--pf-text-color-muted)' } }, props.label),
        h(NColorPicker, {
          size: 'small',
          value: props.color,
          'onUpdate:value': (v: string) => emit('update', v),
          style: { width: '28px', height: '22px' },
        }),
      ])
  },
})
</script>
