import { VueDevtools } from 'common-store/vue-devtools';
import { Logger, History, Store } from 'common-store';
import { registerActions } from './actions';
import type { PageState } from './types';
import type { App } from 'vue';
import type { PageForgePlugin } from '../plugin';
import { registerPlugin } from '../plugin';

export interface PageStoreOptions {
  plugins?: PageForgePlugin[];
}

function createInitialState(): PageState {
  return {
    canvasWidth: 1920,
    canvasHeight: 1080,
    scale: 1,
    viewportX: 0,
    viewportY: 0,
    tool: 'select',
    showRuler: true,
    nodes: [],
    selectedNodeIds: [],
    grid: {
      type: 'dot',
      size: 20,
      color: 'var(--pf-border-muted)',
      opacity: 1,
    },
  };
}

export function createPageStore(app?: App, opts?: PageStoreOptions) {
  if (opts?.plugins) {
    for (const plugin of opts.plugins) {
      registerPlugin(plugin);
    }
  }

  const store = new Store(createInitialState());

  store.use(Logger({ showDuration: false }));
  store.use(History({ maxHistorySize: 100 }));
  store.use(VueDevtools(app, { inspectorLabel: 'PageForge' }));

  registerActions(store);

  return store;
}
