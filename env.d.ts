/// <reference types="vite/client" />
declare module '*.vue' {
    import { ComponentOptions } from 'vue'
    const componentOptions: ComponentOptions
    export default componentOptions
}
declare module 'element-plus/dist/locale/zh-cn.js'
declare module 'pinia-persistedstate-plugin'
declare module 'particles.vue3' {
  import { DefineComponent } from 'vue'
  const c: DefineComponent<any, any, any>
  export default c
}
declare module 'tsparticles-slim'

import 'pinia'
declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    persist?: boolean | { key?: string; storage?: Storage; paths?: string[] }
  }
}
