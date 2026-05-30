import type { Component } from 'vue'
import type { Plugin, Store } from 'common-store'

export interface PageNode {
  id: string
  type: string
  name: string
  x: number
  y: number
  width: number
  height: number
  props: Record<string, unknown>
  style: Record<string, string>
  parentId: string | null
  children: PageNode[]
  locked: boolean
  visible: boolean
}

export interface PageForgeState {
  app: {
    theme: {
      mode: 'light' | 'dark' | 'system'
      preset: 'github-light' | 'github-dark' | 'custom'
      colors: ThemeColors
    }
  }
  layout: {
    panelWidth: number
    activeIcon: string | null
  }
  page: {
    nodes: PageNode[]
    selectedNodeIds: string[]
    contextMenu: {
      visible: boolean
      x: number
      y: number
      nodeId: string | null
    }
    viewport: {
      x: number
      y: number
      zoom: number
    }
    width: number
    height: number
  }
  clipboard: PageNode[]
}

export interface ThemeColors {
  headerBg: string
  sidebarBg: string
  panelBg: string
  statusBarBg: string
  workspaceBg: string
  cardBg: string
  borderColor: string
  borderMuted: string
  textColor: string
  textColorMuted: string
  accentColor: string
  accentHover: string
  dangerColor: string
  successColor: string
  warningColor: string
  iconColor: string
  iconActiveColor: string
}

export interface ContentItem {
  id: string
  order?: number
}

export interface TopBarItem extends ContentItem {
  position: 'left' | 'center' | 'right'
  component: Component
}

export interface StatusBarItem extends ContentItem {
  position: 'left' | 'right'
  component: Component
}

export interface FunctionAreaItem extends ContentItem {
  icon: Component
  label: string
  tooltip?: string
  panel: Component
  badge?: () => string | number
}

export interface PropertiesItem extends ContentItem {
  sectionId: string
  label: string
  priority: number
  component: Component
  visible?: (ctx: PropContext) => boolean
}

export interface PropContext {
  nodeType: string
  node: PageNode
}

export interface NodeItem extends ContentItem {
  type: string
  component: Component
}

export interface ContextMenuItem extends ContentItem {
  label: string
  icon?: Component
  shortcut?: string
  divider?: boolean
  visible?: (ctx: MenuContext) => boolean
  action: (ctx: MenuContext) => void | Promise<void>
}

export interface MenuContext {
  nodeIds: string[]
  nodeTypes: string[]
  count: number
  forge: Store
}

export interface ComponentLibraryItem extends ContentItem {
  type: string
  label: string
  icon: Component
  category: string
  defaultWidth: number
  defaultHeight: number
  defaultProps: Record<string, unknown>
}

export interface PropertiesSection {
  id: string
  label: string
  order: number
}

export interface PageForgePlugin extends Plugin {
  name: string
  version?: string
  dependencies?: string[]
  install?(store: Store): void
  uninstall?(): void
}
