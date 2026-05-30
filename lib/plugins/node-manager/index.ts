import { Layers } from '@vicons/carbon'
import { markRaw } from 'vue'
import type { Store } from 'common-store'
import type { PageForge } from '../../core/page-forge'
import type { PageForgePlugin, ContextMenuItem } from '../../core/types'
import type { PageNode } from '../../core/types'
import { nodeActions } from './actions'
import { findNodeById } from '../../utils/tree'
import NodeManagerPanel from './node-manager-panel.vue'

function buildContextMenuItems(): ContextMenuItem[] {
  return [
    {
      id: 'ctx-cut', order: 10,
      label: '剪切', shortcut: 'Ctrl+X',
      visible: (ctx) => ctx.count >= 1,
      action: (ctx) => ctx.forge.dispatch('node:cut', ctx.nodeIds),
    },
    {
      id: 'ctx-copy', order: 20,
      label: '复制', shortcut: 'Ctrl+C',
      visible: (ctx) => ctx.count >= 1,
      action: (ctx) => ctx.forge.dispatch('node:copy', ctx.nodeIds),
    },
    {
      id: 'ctx-div1', order: 25, label: '', divider: true, action: () => {},
    },
    {
      id: 'ctx-paste', order: 30,
      label: '粘贴', shortcut: 'Ctrl+V',
      visible: (ctx) => {
        const cb = ctx.forge.getState('clipboard') as PageNode[]
        return cb.length > 0
      },
      action: (ctx) => ctx.forge.dispatch('node:paste'),
    },
    {
      id: 'ctx-div2', order: 35, label: '', divider: true, action: () => {},
    },
    {
      id: 'ctx-group', order: 40,
      label: '编组', shortcut: 'Ctrl+G',
      visible: (ctx) => ctx.count >= 2,
      action: (ctx) => ctx.forge.dispatch('node:group', ctx.nodeIds),
    },
    {
      id: 'ctx-ungroup', order: 50,
      label: '取消编组', shortcut: 'Ctrl+Shift+G',
      visible: (ctx) => {
        if (ctx.count !== 1) return false
        const nodes = ctx.forge.getState('page.nodes') as PageNode[]
        const node = findNodeById(nodes, ctx.nodeIds[0])
        return node?.type === 'group'
      },
      action: (ctx) => ctx.forge.dispatch('node:ungroup', ctx.nodeIds[0]),
    },
    {
      id: 'ctx-div3', order: 55, label: '', divider: true, action: () => {},
    },
    {
      id: 'ctx-moveup', order: 60,
      label: '上移一层', shortcut: 'Ctrl+]',
      visible: (ctx) => ctx.count >= 1,
      action: (ctx) => ctx.forge.dispatch('node:moveUp', ctx.nodeIds),
    },
    {
      id: 'ctx-movedown', order: 70,
      label: '下移一层', shortcut: 'Ctrl+[',
      visible: (ctx) => ctx.count >= 1,
      action: (ctx) => ctx.forge.dispatch('node:moveDown', ctx.nodeIds),
    },
    {
      id: 'ctx-tofront', order: 80,
      label: '置顶', shortcut: 'Ctrl+Shift+]',
      visible: (ctx) => ctx.count >= 1,
      action: (ctx) => ctx.forge.dispatch('node:toFront', ctx.nodeIds),
    },
    {
      id: 'ctx-toback', order: 90,
      label: '置底', shortcut: 'Ctrl+Shift+[',
      visible: (ctx) => ctx.count >= 1,
      action: (ctx) => ctx.forge.dispatch('node:toBack', ctx.nodeIds),
    },
    {
      id: 'ctx-div4', order: 95, label: '', divider: true, action: () => {},
    },
    {
      id: 'ctx-delete', order: 100,
      label: '删除', shortcut: 'Delete',
      visible: (ctx) => ctx.count >= 1,
      action: (ctx) => ctx.forge.dispatch('node:delete', ctx.nodeIds),
    },
  ]
}

let forge: PageForge

export const nodeManagerPlugin: PageForgePlugin = {
  name: 'builtin:node-manager',

  install(store: Store) {
    forge = store as unknown as PageForge
    for (const [name, handler] of Object.entries(nodeActions)) {
      store.actions.register(name, handler)
    }

    forge.content.functionArea.register('builtin:node-manager', {
      id: 'builtin:node-manager',
      order: 10,
      icon: markRaw(Layers),
      label: '图层',
      tooltip: '图层管理',
      panel: markRaw(NodeManagerPanel),
    })

    const menuItems = buildContextMenuItems()
    for (const item of menuItems) {
      forge.content.contextMenu.register(item.id, item)
    }
  },

  uninstall() {
    for (const name of Object.keys(nodeActions)) {
      forge.actions?.unregister(name)
    }
    forge.content?.functionArea.unregister('builtin:node-manager')
    for (const item of buildContextMenuItems()) {
      forge.content?.contextMenu.unregister(item.id)
    }
  },
}
