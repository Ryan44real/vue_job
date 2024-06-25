import { fileURLToPath, URL } from 'node:url'
import commonjs from '@rollup/plugin-commonjs';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    commonjs() as any,// 要放在第一行，否则不生效
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server:{
    // open:true,
    proxy:{
      '/api':{  //获取当前路径中包含了/api的请求
          target:'http://localhost:8080', //修改的目标地址
          changeOrigin:true, //开启修改
          rewrite:(path)=>path.replace(/^\/api/,'') //api替换为''
      }
    }
  }
})
