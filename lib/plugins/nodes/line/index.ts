import { TextLineSpacing } from '@vicons/carbon'
import { markRaw } from 'vue'
import type { Store } from 'common-store'
import type { PageForge } from '../../../core/page-forge'
import type { PageForgePlugin } from '../../../core/types'
import LineRenderer from './line-renderer.vue'
import LineProperties from './line-properties.vue'

let forge: PageForge

export const linePlugin: PageForgePlugin = {
  name: 'builtin:line',

  install(store: Store) {
    forge = store as unknown as PageForge
    forge.content.nodes.register('line', {
      id: 'node-line',
      type: 'line',
      order: 50,
      component: markRaw(LineRenderer),
    })

    forge.content.componentLibrary.register('line', {
      id: 'lib-line',
      type: 'line',
      label: '线条',
      icon: markRaw(TextLineSpacing),
      category: 'basic',
      order: 40,
      defaultWidth: 100,
      defaultHeight: 2,
      defaultProps: { stroke: '#d0d7de', strokeWidth: 2 },
    })

    forge.content.properties.register('line-props', {
      id: 'line-props',
      sectionId: 'style',
      label: '线条样式',
      priority: 10,
      component: markRaw(LineProperties),
      visible: (ctx) => ctx.nodeType === 'line',
    })
  },

  uninstall() {
    forge?.content.nodes.unregister('node-line')
    forge?.content.componentLibrary.unregister('lib-line')
    forge?.content?.properties?.unregister('line-props')
  },
}
