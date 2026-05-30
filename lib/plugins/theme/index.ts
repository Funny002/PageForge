import { ColorPalette } from '@vicons/carbon'
import { markRaw } from 'vue'
import type { Store } from 'common-store'
import type { PageForge } from '../../core/page-forge'
import type { PageForgePlugin } from '../../core/types'
import { githubLight, githubDark } from '../../themes'
import ThemePanel from './theme-panel.vue'

let forge: PageForge

export const themePlugin: PageForgePlugin = {
  name: 'builtin:theme',

  install(store: Store) {
    forge = store as unknown as PageForge
    forge.content.functionArea.register('builtin:theme', {
      id: 'builtin:theme',
      order: 90,
      icon: markRaw(ColorPalette),
      label: '主题',
      tooltip: '主题设置',
      panel: markRaw(ThemePanel),
    })

    const colors = store.getState('app.theme.colors') as Record<string, string>
    if (!colors || Object.keys(colors).length === 0) {
      store.data.merge('app.theme', {
        mode: 'light',
        preset: 'github-light',
        colors: { ...githubLight },
      })
    }

    store.actions.register('theme:toggleMode', (s) => {
      const current = s.getState('app.theme.mode') as string
      const next = current === 'dark' ? 'light' : 'dark'
      const preset = next === 'dark' ? 'github-dark' : 'github-light'
      const palette = next === 'dark' ? { ...githubDark } : { ...githubLight }
      s.data.merge('app.theme', { mode: next, preset, colors: palette })
    })

    store.actions.register('theme:setMode', (s, mode: string) => {
      const preset = mode === 'dark' ? 'github-dark' : 'github-light'
      const palette = mode === 'dark' ? { ...githubDark } : { ...githubLight }
      s.data.merge('app.theme', { mode, preset, colors: palette })
    })

    store.actions.register('theme:setColor', (s, key: string, value: string) => {
      s.data.set(`app.theme.colors.${key}`, value)
      s.data.set('app.theme.preset', 'custom')
    })

    store.actions.register('theme:resetPreset', (s, presetName: string) => {
      if (presetName !== 'github-light' && presetName !== 'github-dark') {
        console.warn(`[theme] Unknown preset "${presetName}", falling back to github-light`)
        presetName = 'github-light'
      }
      const palette = presetName === 'github-dark' ? { ...githubDark } : { ...githubLight }
      const mode = presetName === 'github-dark' ? 'dark' : 'light'
      s.data.merge('app.theme', { preset: presetName, mode, colors: palette })
    })

    store.actions.register('theme:export', (s) => {
      const colors = s.getState('app.theme.colors')
      const mode = s.getState('app.theme.mode')
      return JSON.stringify({ name: 'PageForge Theme', mode, colors }, null, 2)
    })

    store.actions.register('theme:import', (s, json: Record<string, unknown>) => {
      const colors = json.colors as Record<string, string>
      const mode = (json.mode as string) ?? 'light'
      if (colors && Object.keys(colors).length > 0) {
        s.data.merge('app.theme', { mode, preset: 'custom', colors })
      }
    })
  },

  uninstall() {
    forge?.actions?.unregister('theme:toggleMode')
    forge?.actions?.unregister('theme:setMode')
    forge?.actions?.unregister('theme:setColor')
    forge?.actions?.unregister('theme:resetPreset')
    forge?.actions?.unregister('theme:export')
    forge?.actions?.unregister('theme:import')
    forge?.content?.functionArea?.unregister('builtin:theme')
  },
}
