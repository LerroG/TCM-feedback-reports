import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import router from './router'
// import i18n, { loadLocaleMessages } from '@/lib/i18n'

const app = createApp(App)

app.use(router)
// app.use(VCalendar, {})
// app.use(i18n)

// loadLocaleMessages(localStorage.getItem('lang') || 'ru')

app.mount('#app')
