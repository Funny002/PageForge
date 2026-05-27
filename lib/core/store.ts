import { Logger, History, Store } from 'common-store';
import { registerActions } from './actions';
import type { PageState } from './types';

function createInitialState(): PageState {
  return {
    selectedNodeId: null,
    canvasHeight: 1080,
    canvasWidth: 1920,
  };
}

export function createPageStore() {
  const store = new Store(createInitialState());

  store.use(Logger({ showDuration: false }));
  store.use(History({ maxHistorySize: 100 }));

  registerActions(store);

  return store;
}
