import { inject, onUnmounted, shallowRef } from 'vue';
import type { InjectionKey, Ref } from 'vue';
import type { Store } from 'common-store';

export { createStore } from './store';

export const STORE_KEY: InjectionKey<Store> = Symbol('pageStore');

export function injectStore(): Store {
  return inject<Store>(STORE_KEY)!;
}

export function useStore<T>(path: string, fallback: T): Ref<T> {
  const store = injectStore();
  const r = shallowRef<T>(store.getState(path) ?? fallback);
  const unsub = store.subscribe(path, (newVal) => {
    r.value = (newVal ?? fallback) as T;
  });
  onUnmounted(unsub);
  return r;
}
