import pageForest from './view/index.vue';
import type { App } from 'vue';

export const PageForest = pageForest;

PageForest.name = 'PageForest';

PageForest.install = (app: App) => {
  app.component('PageForest', PageForest);
};

export default {
  PageForest,
  install: PageForest.install,
};
