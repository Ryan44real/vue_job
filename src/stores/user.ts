import { defineStore } from "pinia"
import {ref} from 'vue'

export const useUserInfoStore = defineStore('userInfo',()=>{
    //1.定义用户信息
    const info = ref<Record<string, any>>({})
    //2.定义修改用户信息的方法
    const setInfo = (newInfo: Record<string, unknown>)=>{
        info.value = newInfo
    }
    //3.定义清空用户信息的方法
    const removeInfo = ()=>{
        info.value={}
    }

    return{info,setInfo,removeInfo}
},{
    persist:true
})