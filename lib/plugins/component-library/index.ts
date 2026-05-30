import { Cube } from '@vicons/carbon'
import { markRaw } from 'vue'
import type { Store } from 'common-store'
import type { PageForge } from '../../core/page-forge'
import type { PageForgePlugin } from '../../core/types'
import ComponentLibraryPanel from './component-library-panel.vue'

let forge: PageForge

export const componentLibraryPlugin: PageForgePlugin = {
  name: 'builtin:component-library',

  install(store: Store) {
    forge = store as unknown as PageForge
    forge.content.functionArea.register('builtin:component-library', {
      id: 'builtin:component-library',
      order: 20,
      icon: markRaw(Cube),
      label: '组件',
      tooltip: '组件库',
      panel: markRaw(ComponentLibraryPanel),
    })
  },

  uninstall() {
    forge?.content.functionArea.unregister('builtin:component-library')
  },
}
