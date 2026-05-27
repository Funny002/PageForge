import pageForest from './view/index.vue';
import type { App } from 'vue';

const PageForest = pageForest as typeof pageForest & { install: (app: App) => void };

PageForest.install = (app: App) => {
  app.component('PageForest', PageForest);
};

export { PageForest };
export default PageForest;

export type { ThemeConfig } from './theme';
export { applyTheme, githubLight, githubDark, atomLight, atomDark } from './theme';