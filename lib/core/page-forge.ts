import { Store } from 'common-store'
import { ContentManager, PropertiesSectionManager } from './content-manager'
import { githubLight } from '../themes'
import type {
  TopBarItem,
  StatusBarItem,
  FunctionAreaItem,
  NodeItem,
  ContextMenuItem,
  ComponentLibraryItem,
  PropertiesSection,
  PageForgeState,
} from './types'

const DEFAULT_STATE: PageForgeState = {
  app: {
    theme: {
      mode: 'light',
      preset: 'github-light',
      colors: { ...githubLight },
    },
  },
  layout: {
    panelWidth: 220,
    activeIcon: null,
  },
  page: {
    nodes: [],
    selectedNodeIds: [],
    contextMenu: {
      visible: false,
      x: 0,
      y: 0,
      nodeId: null,
    },
    viewport: {
      x: 0,
      y: 0,
      zoom: 1,
    },
    width: 1920,
    height: 1080,
  },
  clipboard: [],
}

function deepMerge(target: any, source: any): any {
  const result = { ...target }
  for (const key of Object.keys(source)) {
    const sv = source[key]
    const tv = target[key]
    if (sv && typeof sv === 'object' && !Array.isArray(sv) && tv && typeof tv === 'object' && !Array.isArray(tv)) {
      result[key] = deepMerge(tv, sv)
    } else if (sv !== undefined) {
      result[key] = sv
    }
  }
  return result
}

export class PageForge extends Store {
  static readonly PROPERTY_SECTIONS: PropertiesSection[] = [
    { id: 'position', label: '位置', order: 10 },
    { id: 'size', label: '尺寸', order: 20 },
    { id: 'box-model', label: '盒模型', order: 30 },
    { id: 'style', label: '样式', order: 40 },
    { id: 'advanced', label: '高级', order: 50 },
  ]

  readonly content = {
    topBar: new ContentManager<TopBarItem>(),
    statusBar: new ContentManager<StatusBarItem>(),
    functionArea: new ContentManager<FunctionAreaItem>(),
    properties: new PropertiesSectionManager(PageForge.PROPERTY_SECTIONS),
    nodes: new ContentManager<NodeItem>(),
    contextMenu: new ContentManager<ContextMenuItem>(),
    componentLibrary: new ContentManager<ComponentLibraryItem>(),
  }

  constructor(initialState?: Partial<PageForgeState>) {
    const merged = initialState ? deepMerge(DEFAULT_STATE, initialState as any) : DEFAULT_STATE
    super(merged)
  }

  createNodeId(): string {
    return crypto.randomUUID()
  }
}

export function createPageForge(initialState?: Partial<PageForgeState>): PageForge {
  return new PageForge(initialState)
}
