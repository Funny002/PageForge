import { TextAnnotationToggle } from '@vicons/carbon'
import { markRaw } from 'vue'
import type { Store } from 'common-store'
import type { PageForge } from '../../../core/page-forge'
import type { PageForgePlugin } from '../../../core/types'
import TextRenderer from './text-renderer.vue'
import TextProperties from './text-properties.vue'

let forge: PageForge

export const textPlugin: PageForgePlugin = {
  name: 'builtin:text',

  install(store: Store) {
    forge = store as unknown as PageForge
    forge.content.nodes.register('text', {
      id: 'node-text',
      type: 'text',
      order: 30,
      component: markRaw(TextRenderer),
    })

    forge.content.componentLibrary.register('text', {
      id: 'lib-text',
      type: 'text',
      label: '文本',
      icon: markRaw(TextAnnotationToggle),
      category: 'basic',
      order: 30,
      defaultWidth: 200,
      defaultHeight: 40,
      defaultProps: { text: '双击编辑文本', fontSize: 16, color: '#1f2328', fontFamily: 'Arial, sans-serif' },
    })

    forge.content.properties.register('text-props', {
      id: 'text-props',
      sectionId: 'style',
      label: '文本样式',
      priority: 10,
      component: markRaw(TextProperties),
      visible: (ctx) => ctx.nodeType === 'text',
    })
  },

  uninstall() {
    forge?.content.nodes.unregister('node-text')
    forge?.content.componentLibrary.unregister('lib-text')
    forge?.content.properties.unregister('text-props')
  },
}
