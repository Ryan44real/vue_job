//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';
//定义一个变量,记录公共的前缀  ,  baseURL
// const baseURL = 'http://localhost:8080';
import {useTokenStore} from '@/stores/token.js'
import router from '@/router'

const baseURL = '/api'
const instance = axios.create({baseURL})
import { ElMessage } from 'element-plus';

//添加响应拦截器
instance.interceptors.response.use(
    result=>{
        if(result.data.code === 0){
            return result.data;
        }
        //result是返回的Json数组,其中的data就是服务器返回的json数组，从data中拿数据
        //操作失败
        // alert(result.data.message ? result.data.message:'服务异常')
        ElMessage.error(result.data.message ? result.data.message:'服务异常')
        //返回异步操作状态为失败
        return Promise.reject(result.data)
        
    },
    err=>{
        //如果响应状态码为401，则代表未登录，给出提示并跳转回登录页
        if(err.response.status===401){
            ElMessage.error('请先登录');
            router.push('/login');
        }else{
            ElMessage.error('服务异常');
        }
        return Promise.reject(err)
    }
)


instance.interceptors.request.use(
    (config)=>{
        //在请求前做什么
        let tokenStore = useTokenStore()
        //如果token有值就携带发送
        if(tokenStore.token){
            config.headers.Authorization=tokenStore.token
        }
        return config
    },
    (err)=>{
        Promise.reject(err)
    }
)

export default instance;