import type { InjectionKey } from 'vue';
import type { Store } from 'common-store';

export type { PageNode, PageState } from './types';
export type { ToolType } from './types';
export { createPageStore } from './store';

export const PAGE_STORE_KEY: InjectionKey<Store> = Symbol('pageStore');
