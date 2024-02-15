import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

function runApp () {
  const app = createApp(App)

  app
    .use(router)
    .mount('#app')
}

runApp()
