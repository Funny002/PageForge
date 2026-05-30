import { registerActions } from './actions';
import { History, Store } from 'common-store';

function createState() {
  return {
    canvas: {
      width: 1920,
      height: 1080,
    },
  };
}

export function createStore() {
  const store = new Store(createState());
  store.use(History({ maxHistorySize: 100 }));
  registerActions(store);
  return store;
}
