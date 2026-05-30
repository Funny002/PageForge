import { RadioButton } from '@vicons/carbon'
import { markRaw } from 'vue'
import type { Store } from 'common-store'
import type { PageForge } from '../../../core/page-forge'
import type { PageForgePlugin } from '../../../core/types'
import CircleRenderer from './circle-renderer.vue'
import CircleProperties from './circle-properties.vue'

let forge: PageForge

export const circlePlugin: PageForgePlugin = {
  name: 'builtin:circle',

  install(store: Store) {
    forge = store as unknown as PageForge
    forge.content.nodes.register('circle', {
      id: 'node-circle',
      type: 'circle',
      order: 20,
      component: markRaw(CircleRenderer),
    })

    forge.content.componentLibrary.register('circle', {
      id: 'lib-circle',
      type: 'circle',
      label: '圆形',
      icon: markRaw(RadioButton),
      category: 'basic',
      order: 20,
      defaultWidth: 80,
      defaultHeight: 80,
      defaultProps: { fill: '#f0f0f0', stroke: '#d0d7de' },
    })

    forge.content.properties.register('circle-props', {
      id: 'circle-props',
      sectionId: 'style',
      label: '圆形样式',
      priority: 10,
      component: markRaw(CircleProperties),
      visible: (ctx) => ctx.nodeType === 'circle',
    })
  },

  uninstall() {
    forge?.content.nodes.unregister('node-circle')
    forge?.content.componentLibrary.unregister('lib-circle')
    forge?.content?.properties?.unregister('circle-props')
  },
}


