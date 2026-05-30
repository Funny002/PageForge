import pageForgeLayout from './view/index.vue'

export { PageForge, createPageForge } from './core/page-forge'
export { ContentManager, PropertiesSectionManager } from './core/content-manager'
export { providePageForge, usePageForge } from './composables/usePageForge'
export { useResize } from './composables/useResize'
export { builtinPlugins } from './plugins'
export * from './core/types'

export const pageForge = pageForgeLayout
