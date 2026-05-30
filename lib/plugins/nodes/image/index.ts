import { Image } from '@vicons/carbon'
import { markRaw } from 'vue'
import type { Store } from 'common-store'
import type { PageForge } from '../../../core/page-forge'
import type { PageForgePlugin } from '../../../core/types'
import ImageRenderer from './image-renderer.vue'
import ImageProperties from './image-properties.vue'

let forge: PageForge

export const imagePlugin: PageForgePlugin = {
  name: 'builtin:image',

  install(store: Store) {
    forge = store as unknown as PageForge
    forge.content.nodes.register('image', {
      id: 'node-image',
      type: 'image',
      order: 40,
      component: markRaw(ImageRenderer),
    })

    forge.content.componentLibrary.register('image', {
      id: 'lib-image',
      type: 'image',
      label: '图片',
      icon: markRaw(Image),
      category: 'media',
      order: 10,
      defaultWidth: 200,
      defaultHeight: 150,
      defaultProps: { src: '', objectFit: 'cover', alt: '' },
    })

    forge.content.properties.register('image-props', {
      id: 'image-props',
      sectionId: 'style',
      label: '图片属性',
      priority: 10,
      component: markRaw(ImageProperties),
      visible: (ctx) => ctx.nodeType === 'image',
    })
  },

  uninstall() {
    forge?.content.nodes.unregister('node-image')
    forge?.content.componentLibrary.unregister('lib-image')
    forge?.content?.properties?.unregister('image-props')
  },
}
