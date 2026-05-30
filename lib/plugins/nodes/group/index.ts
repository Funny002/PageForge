import { Group } from '@vicons/carbon'
import { markRaw } from 'vue'
import type { Store } from 'common-store'
import type { PageForge } from '../../../core/page-forge'
import type { PageForgePlugin } from '../../../core/types'
import GroupRenderer from './group-renderer.vue'
import GroupProperties from './group-properties.vue'

let forge: PageForge

export const groupPlugin: PageForgePlugin = {
  name: 'builtin:group',

  install(store: Store) {
    forge = store as unknown as PageForge
    forge.content.nodes.register('group', {
      id: 'node-group',
      type: 'group',
      order: 60,
      component: markRaw(GroupRenderer),
    })

    forge.content.componentLibrary.register('group', {
      id: 'lib-group',
      type: 'group',
      label: '编组',
      icon: markRaw(Group),
      category: 'container',
      order: 10,
      defaultWidth: 200,
      defaultHeight: 200,
      defaultProps: {},
    })

    forge.content.properties.register('group-props', {
      id: 'group-props',
      sectionId: 'position',
      label: '编组属性',
      priority: 10,
      component: markRaw(GroupProperties),
      visible: (ctx) => ctx.nodeType === 'group',
    })
  },

  uninstall() {
    forge?.content.nodes.unregister('node-group')
    forge?.content.componentLibrary.unregister('lib-group')
    forge?.content?.properties?.unregister('group-props')
  },
}
