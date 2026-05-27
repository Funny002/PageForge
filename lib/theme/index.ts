import type { ThemeConfig } from './types';

export type { ThemeConfig };

export function applyTheme(el: HTMLElement, theme: ThemeConfig) {
  for (const [key, value] of Object.entries(theme)) {
    el.style.setProperty(key, value);
  }
}

export { githubLight } from './github-light';
export { githubDark } from './github-dark';
