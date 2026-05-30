<template>
  <n-config-provider :theme="naiveTheme" :theme-overrides="themeOverrides">
    <n-dialog-provider>
      <n-message-provider>
        <div class="fp-root" :style="cssVars">
          <TopBar />
          <MainArea />
          <StatusBar />
        </div>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'
import { NConfigProvider, NDialogProvider, NMessageProvider, lightTheme, darkTheme } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'
import { VueDevtools } from 'common-store/vue-devtools'
import { PageForge } from '../core/page-forge'
import { providePageForge } from '../composables/usePageForge'
import { builtinPlugins } from '../plugins'
import TopBar from './top-bar/index.vue'
import MainArea from './main-area/index.vue'
import StatusBar from './status-bar/index.vue'


const forge = new PageForge()

const app = getCurrentInstance()?.appContext.app
if (app) {
  forge.use(VueDevtools(app, { inspectorLabel: 'PageForge' }))
}

for (const plugin of builtinPlugins) {
  forge.use(plugin)
}

providePageForge(forge)

const colors = computed(() => {
  const theme = forge.getState('app.theme') as { mode: string; colors: Record<string, string> }
  return theme?.colors ?? {}
})

const themeMode = computed(() => {
  const theme = forge.getState('app.theme') as { mode: string }
  return theme?.mode ?? 'light'
})

const naiveTheme = computed(() => {
  return themeMode.value === 'dark' ? darkTheme : lightTheme
})

const themeOverrides = computed<GlobalThemeOverrides>(() => {
  const c = colors.value
  return {
    common: {
      primaryColor: c.accentColor ?? '#0969da',
      primaryColorHover: c.accentHover ?? '#0550ae',
      primaryColorPressed: c.accentColor ?? '#0969da',
      infoColor: c.accentColor ?? '#0969da',
      successColor: c.successColor ?? '#1a7f37',
      warningColor: c.warningColor ?? '#9a6700',
      errorColor: c.dangerColor ?? '#cf222e',
      textColor1: c.textColor ?? '#1f2328',
      textColor2: c.textColorMuted ?? '#656d76',
      textColor3: c.textColorMuted ?? '#656d76',
      borderColor: c.borderColor ?? '#d0d7de',
      dividerColor: c.borderMuted ?? '#d8dee4',
      inputColor: c.cardBg ?? '#f6f8fa',
      bodyColor: c.panelBg ?? '#ffffff',
      cardColor: c.cardBg ?? '#f6f8fa',
      popoverColor: c.panelBg ?? '#ffffff',
      baseColor: c.workspaceBg ?? '#ffffff',
    },
  }
})

const cssVars = computed(() => {
  const c = colors.value
  const vars: Record<string, string> = {}
  for (const [key, value] of Object.entries(c)) {
    const cssKey = '--pf-' + key.replace(/([A-Z])/g, '-$1').toLowerCase()
    vars[cssKey] = value
  }
  return vars
})
</script>

<style lang="scss" src="./style.scss"></style>
