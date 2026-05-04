import { createApp } from 'vue'
import { createPinia } from 'pinia'
// @ts-ignore - pinia-persistedstate-plugin exports issue
import { createPersistedState } from 'pinia-persistedstate-plugin'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// @ts-ignore - element-plus locale .js import
import locale from 'element-plus/dist/locale/zh-cn.js'
import Particles from 'particles.vue3'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(ElementPlus)
app.use(Particles)
const pinia = createPinia()
const persist = createPersistedState()
app.use(ElementPlus, { locale })
pinia.use(persist)
app.use(pinia)
app.use(router)

app.mount('#app')
