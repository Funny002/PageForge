import { Cube } from '@vicons/carbon'
import { markRaw } from 'vue'
import type { Store } from 'common-store'
import type { PageForge } from '../../../core/page-forge'
import type { PageForgePlugin } from '../../../core/types'
import RectRenderer from './rect-renderer.vue'
import RectProperties from './rect-properties.vue'

let forge: PageForge

export const rectPlugin: PageForgePlugin = {
  name: 'builtin:rect',

  install(store: Store) {
    forge = store as unknown as PageForge
    forge.content.nodes.register('rect', {
      id: 'node-rect',
      type: 'rect',
      order: 10,
      component: markRaw(RectRenderer),
    })

    forge.content.componentLibrary.register('rect', {
      id: 'lib-rect',
      type: 'rect',
      label: '矩形',
      icon: markRaw(Cube),
      category: 'basic',
      order: 10,
      defaultWidth: 100,
      defaultHeight: 80,
      defaultProps: { fill: '#f0f0f0', stroke: '#d0d7de', cornerRadius: 0 },
    })

    forge.content.properties.register('rect-props', {
      id: 'rect-props',
      sectionId: 'style',
      label: '矩形属性',
      priority: 10,
      component: markRaw(RectProperties),
      visible: (ctx) => ctx.nodeType === 'rect',
    })
  },

  uninstall() {
    forge?.content.nodes.unregister('node-rect')
    forge?.content.componentLibrary.unregister('lib-rect')
    forge?.content?.properties?.unregister('rect-props')
  },
}
