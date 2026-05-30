import { createShortcutHandler } from '../../utils/shortcut'
import type { PageForgePlugin, PageNode } from '../../core/types'
import type { Store } from 'common-store'

let shortcutHandler: ((event: KeyboardEvent) => void) | null = null

export const shortcutsPlugin: PageForgePlugin = {
  name: 'builtin:shortcuts',

  install(store: Store) {
    const handler = createShortcutHandler(
      [
        { key: 'c', ctrl: true, action: 'node:copy' },
        { key: 'x', ctrl: true, action: 'node:cut' },
        { key: 'v', ctrl: true, action: 'node:paste' },
        { key: 'd', ctrl: true, action: 'node:duplicate' },
        { key: 'Delete', action: 'node:delete' },
        { key: 'a', ctrl: true, action: 'selection:selectAll' },
        { key: 'g', ctrl: true, action: 'node:group' },
        { key: 'g', ctrl: true, shift: true, action: 'node:ungroup' },
        { key: ']', ctrl: true, action: 'node:moveUp' },
        { key: '[', ctrl: true, action: 'node:moveDown' },
        { key: ']', ctrl: true, shift: true, action: 'node:toFront' },
        { key: '[', ctrl: true, shift: true, action: 'node:toBack' },
        { key: 'Escape', action: 'selection:clear' },
      ],
      (action: string) => {
        const selected = store.getState('page.selectedNodeIds') as string[]
        const clipboard = store.getState('clipboard') as PageNode[]

        if (action === 'selection:clear') {
          store.data.merge('page', { selectedNodeIds: [], contextMenu: { visible: false } })
          return
        }

        if (['node:copy', 'node:cut', 'node:duplicate', 'node:delete', 'node:moveUp', 'node:moveDown', 'node:toFront', 'node:toBack'].includes(action) && selected.length === 0) return
        if (['node:paste'].includes(action) && clipboard.length === 0) return
        if (['node:group'].includes(action) && selected.length < 2) return

        if (action === 'node:ungroup') {
          store.dispatch(action, selected[0])
          return
        }

        store.dispatch(action, selected)
      },
    )

    window.addEventListener('keydown', handler, true)
    shortcutHandler = handler
  },

  uninstall() {
    if (shortcutHandler) {
      window.removeEventListener('keydown', shortcutHandler, true)
      shortcutHandler = null
    }
  },
}
