// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
//导入持久化插件
import {createPersistedState} from 'pinia-persistedstate-plugin'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import locale from 'element-plus/dist/locale/zh-cn.js'


// import VueParticles from 'vue-particles'/

import Particles from 'particles.vue3'
import router from './router'

const app = createApp(App)


	app.use(ElementPlus)
	// app.use(VueParticles)
	app.use(Particles)
const pinia = createPinia()
const persist = createPersistedState()
app.use(ElementPlus,{locale})
pinia.use(persist)
app.use(pinia)
app.use(router)

app.mount('#app')
