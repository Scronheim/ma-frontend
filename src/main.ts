import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueLazyload from '@jambonn/vue-lazyload'

import router from './router'

import '@/styles/index.scss'
import '@/styles/tailwind.css'

import App from './App.vue'
const app = createApp(App)

app
  .use(VueLazyload, {
    preLoad: 1.3, // предзагрузка за 1.3 высоты экрана
    attempt: 3, // количество попыток загрузки
    observer: true, // использовать IntersectionObserver
    observerOptions: {
      rootMargin: '0px',
      threshold: 0.1
    }
  })
  .use(router)
  .use(createPinia())
  .mount('#app')
