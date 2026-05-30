import type { Store } from 'common-store'
import type { PageNode } from '../../core/types'
import {
  findNodeById,
  flattenNodes,
  removeNode,
  deepCloneNodes,
  generateNodeName,
  moveNodeInArray,
} from '../../utils/tree'

type ActionFn = (store: Store, ...args: any[]) => any

export const nodeActions: Record<string, ActionFn> = {
  'node:add': (store, type: string, x: number, y: number, w = 100, h = 80, props?: Record<string, unknown>) => {
    const nodes = store.getState('page.nodes') as PageNode[]
    const flat = flattenNodes(nodes)
    const name = generateNodeName(type, flat.map((n: PageNode) => n.name))
    const node: PageNode = {
      id: crypto.randomUUID(),
      type,
      name,
      x, y,
      width: w,
      height: h,
      props: props ?? {},
      style: {},
      parentId: null,
      children: [],
      locked: false,
      visible: true,
    }
    store.data.push('page.nodes', node)
    store.data.set('page.selectedNodeIds', [node.id])
    return node
  },

  'node:update': (store, nodeId: string, partial: Partial<PageNode>) => {
    const safePartial = { ...partial }
    delete (safePartial as any).id
    delete (safePartial as any).children
    delete (safePartial as any).type
    delete (safePartial as any).parentId

    const nodes = store.getState('page.nodes') as PageNode[]
    const flat = flattenNodes(nodes)
    const target = flat.find((n: PageNode) => n.id === nodeId)
    if (!target) return

    const updateRecursive = (list: PageNode[]): PageNode[] =>
      list.map((n: PageNode) => {
        if (n.id === nodeId) return { ...n, ...safePartial }
        if (n.children.length > 0) return { ...n, children: updateRecursive(n.children) }
        return n
      })

    store.data.set('page.nodes', updateRecursive(nodes))
  },

  'node:delete': (store, nodeIds: string[]) => {
    let nodes = store.getState('page.nodes') as PageNode[]
    for (const id of nodeIds) {
      nodes = removeNode(nodes, id)
    }
    store.data.set('page.nodes', nodes)
    store.data.set('page.selectedNodeIds', [])
  },

  'node:copy': (store, nodeIds: string[]) => {
    const nodes = store.getState('page.nodes') as PageNode[]
    const flat = flattenNodes(nodes)
    const targets = flat
      .filter((n: PageNode) => nodeIds.includes(n.id))
      .filter((n: PageNode) => {
        if (!n.parentId) return true
        return !nodeIds.includes(n.parentId)
      })
    const cloned = deepCloneNodes(targets)
    store.data.set('clipboard', cloned)
  },

  'node:paste': (store) => {
    const clipboard = store.getState('clipboard') as PageNode[]
    if (clipboard.length === 0) return
    const cloned = deepCloneNodes(clipboard)
    const added: string[] = []
    for (const node of cloned) {
      store.data.push('page.nodes', node)
      added.push(node.id)
    }
    store.data.set('page.selectedNodeIds', added)
  },

  'node:cut': (store, nodeIds: string[]) => {
    nodeActions['node:copy'](store, nodeIds)
    nodeActions['node:delete'](store, nodeIds)
  },

  'node:duplicate': (store, nodeIds: string[]) => {
    const nodes = store.getState('page.nodes') as PageNode[]
    const flat = flattenNodes(nodes)
    const targets = flat.filter((n: PageNode) => nodeIds.includes(n.id))
    const cloned = deepCloneNodes(targets)
    const added: string[] = []

    for (const node of cloned) {
      node.x += 20
      node.y += 20
      store.data.push('page.nodes', node)
      added.push(node.id)
    }
    store.data.set('page.selectedNodeIds', added)
  },

  'node:group': (store, nodeIds: string[]) => {
    if (nodeIds.length < 2) return
    let nodes = store.getState('page.nodes') as PageNode[]
    const flat = flattenNodes(nodes)

    const targetNodes = flat
      .filter((n: PageNode) => nodeIds.includes(n.id))
      .filter((n: PageNode) => !n.parentId)

    if (targetNodes.length === 0) return

    const minX = Math.min(...targetNodes.map((n: PageNode) => n.x))
    const minY = Math.min(...targetNodes.map((n: PageNode) => n.y))
    const maxX = Math.max(...targetNodes.map((n: PageNode) => n.x + n.width))
    const maxY = Math.max(...targetNodes.map((n: PageNode) => n.y + n.height))

    const groupId = crypto.randomUUID()
    const group: PageNode = {
      id: groupId,
      type: 'group',
      name: generateNodeName('group', flat.map((n: PageNode) => n.name)),
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      props: {},
      style: {},
      parentId: null,
      children: targetNodes.map((n: PageNode) => ({
        ...n,
        x: n.x - minX,
        y: n.y - minY,
        parentId: groupId,
      })),
      locked: false,
      visible: true,
    }

    nodes = removeNode(nodes, nodeIds[0])
    for (const id of nodeIds.slice(1)) {
      nodes = removeNode(nodes, id)
    }
    store.data.set('page.nodes', [...nodes, group])
    store.data.set('page.selectedNodeIds', [groupId])
  },

  'node:ungroup': (store, groupId: string) => {
    const nodes = store.getState('page.nodes') as PageNode[]
    const group = findNodeById(nodes, groupId)
    if (!group || group.type !== 'group') return

    const children = group.children.map((c: PageNode) => ({
      ...c,
      x: c.x + group.x,
      y: c.y + group.y,
      parentId: null,
    }))

    let newNodes = removeNode(nodes, groupId)
    newNodes = [...newNodes, ...children]
    store.data.set('page.nodes', newNodes)
    store.data.set('page.selectedNodeIds', children.map((c: PageNode) => c.id))
  },

  'node:moveUp': (store, nodeIds: string[]) => {
    let nodes = store.getState('page.nodes') as PageNode[]
    for (const id of nodeIds) {
      nodes = moveNodeInArray(nodes, id, 'up')
    }
    store.data.set('page.nodes', nodes)
  },

  'node:moveDown': (store, nodeIds: string[]) => {
    let nodes = store.getState('page.nodes') as PageNode[]
    for (const id of nodeIds) {
      nodes = moveNodeInArray(nodes, id, 'down')
    }
    store.data.set('page.nodes', nodes)
  },

  'node:toFront': (store, nodeIds: string[]) => {
    let nodes = store.getState('page.nodes') as PageNode[]
    for (const id of nodeIds) {
      nodes = moveNodeInArray(nodes, id, 'front')
    }
    store.data.set('page.nodes', nodes)
  },

  'node:toBack': (store, nodeIds: string[]) => {
    let nodes = store.getState('page.nodes') as PageNode[]
    for (const id of nodeIds) {
      nodes = moveNodeInArray(nodes, id, 'back')
    }
    store.data.set('page.nodes', nodes)
  },

  'selection:set': (store, nodeIds: string[]) => {
    store.data.set('page.selectedNodeIds', nodeIds)
  },

  'selection:toggle': (store, nodeId: string) => {
    const current = store.getState('page.selectedNodeIds') as string[]
    if (current.includes(nodeId)) {
      store.data.set('page.selectedNodeIds', current.filter((id: string) => id !== nodeId))
    } else {
      store.data.set('page.selectedNodeIds', [...current, nodeId])
    }
  },

  'selection:clear': (store) => {
    store.data.merge('page', { selectedNodeIds: [], contextMenu: { visible: false } })
  },

  'selection:selectAll': (store) => {
    const nodes = store.getState('page.nodes') as PageNode[]
    const flat = flattenNodes(nodes)
    store.data.set('page.selectedNodeIds', flat.map((n: PageNode) => n.id))
  },
}
