import { VueDevtools } from 'common-store/vue-devtools';
import { Logger, History, Store } from 'common-store';
import { registerActions } from './actions';
import type { PageState } from './types';
import type { App } from 'vue';

function createInitialState(): PageState {
  return {
    selectedNodeId: null,
    // 画布大小
    canvasWidth: 1920,
    canvasHeight: 1080,
  };
}

export function createPageStore(app?: App) {
  const store = new Store(createInitialState());

  store.use(Logger({ showDuration: false }));
  store.use(History({ maxHistorySize: 100 }));
  store.use(VueDevtools(app, { inspectorLabel: 'PageForge' }));

  registerActions(store);

  return store;
}
