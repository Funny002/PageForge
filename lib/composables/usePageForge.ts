import { provide, inject } from 'vue';
import type { PageForge } from '../core/page-forge';

const PAGE_FORGE_KEY = Symbol('pageForge');

export function providePageForge(forge: PageForge): void {
  provide(PAGE_FORGE_KEY, forge);
}

export function usePageForge(): PageForge {
  const forge = inject<PageForge>(PAGE_FORGE_KEY);
  if (!forge) {
    throw new Error('PageForge instance not found. Ensure <PageForge> root component is mounted.');
  }
  return forge;
}