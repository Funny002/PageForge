import App from './app/index.vue';

async function bootstrap() {
  const app = createApp(App);
  app.mount('#app');
}

bootstrap().then(() => {
  console.log('bootstrap done');
});
