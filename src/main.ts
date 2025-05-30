import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'
import router from './router'
import i18n, { loadLocaleMessages } from '@/lib/i18n'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(i18n)

loadLocaleMessages(localStorage.getItem('lang') || 'ru')

app.mount('#app')
