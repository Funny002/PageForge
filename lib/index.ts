import type { App } from 'vue';

import pageForgeLayout from './view/index.vue';
import { registerPlugin } from './plugin';
import { builtinPlugins } from './plugin/builtin';

const PageForge = pageForgeLayout as typeof pageForgeLayout & { install: (app: App) => void };

PageForge.install = (app: App) => {
  app.component('PageForge', PageForge);
};

builtinPlugins.forEach((p) => registerPlugin(p));

export { PageForge };
export default PageForge;

export { githubLight, githubDark } from './theme';
export { registerPlugin, usePlugin } from './plugin';
export type { PageForgePlugin, NodeTypeConfig } from './plugin';
export { createPageStore, usePageStore, useStoreState, PAGE_STORE_KEY } from './core';
export type { PageState, PageNode, GridConfig, GridType, ToolType } from './core';
