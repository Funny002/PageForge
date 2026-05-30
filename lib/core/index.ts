import type { InjectionKey, Ref } from 'vue';
import type { Store } from 'common-store';

export type { PageState, PageNode, GridConfig, GridType, ToolType } from './types';
export { createPageStore } from './store';
export type { PageStoreOptions } from './store';

export const PAGE_STORE_KEY: InjectionKey<Store> = Symbol('pageStore');

export function usePageStore(): Store {
  return inject<Store>(PAGE_STORE_KEY)!;
}

export function useStoreState<T>(path: string, fallback: T): Ref<T> {
  const store = usePageStore();
  const r = shallowRef<T>(store.getState(path) ?? fallback);
  const unsub = store.subscribe(path, (newVal) => {
    r.value = (newVal ?? fallback) as T;
  });
  onUnmounted(unsub);
  return r;
}
