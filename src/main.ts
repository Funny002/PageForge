import { setupRouter } from './router';
import { createPinia } from 'pinia';
import App from './app/index.vue';
import { createApp } from 'vue';

async function bootstrap() {
  const app = createApp(App);
  app.use(createPinia()); // 创建 Pinia 实例
  await setupRouter(app); // 挂载路由
  app.mount('#app');
}

bootstrap().then(() => {
  console.log('bootstrap done');
});
