<!-- eslint-disable vue/multi-word-component-names -->
<script setup name="Login">
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import VueParticles from 'vue-particles'
import { ElMessage } from 'element-plus';
// $(document).ready(function () {
//             //粒子背景特效
//             $('body').particleground({
//                 dotColor: '#5cbdaa',
//                 lineColor: '#5cbdaa'
//             });
//         });
//控制注册与登录表单的显示， 默认显示注册
const isRegister1 = ref(false)
const isRegister2 = ref(true)
const isRegister3 = ref(false)
//定义数据模型
const registerData = ref({
    username: '',
    password: '',
    repassword: '',
    mail:'',
    code:''
})
//校验密码函数
const rePasswordValid = (rule,value,callback)=>{
    if(value === ''){
        callback(new Error('请再次确认密码'))
    }else if(value !== registerData.value.password){
        callback(new Error('请确认两次密码一样'))
    }else callback()
}

const registerDataRules = ref({
    username:[
        {required:true,message:'请输入用户名',trigger:'blur'},
        { min: 5, max: 16, message: '用户名的长度必须为5~16位', trigger: 'blur' }
    ],password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 16, message: '密码长度必须为5~16位', trigger: 'blur' }
    ],
    repassword: [
        { validator: rePasswordValid, trigger: 'blur' }
    ],
    mail:[{
      required:true,message:'请输入正确的邮箱地址',trigger:'blur'}],
      code:[{
        required:true,message:'请输入验证码',trigger:'blur'
      }]
})

const rules = ref({
    username:[
        {required:true,message:'请输入用户名',trigger:'blur'},
        { min: 5, max: 16, message: '用户名的长度必须为5~16位', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 16, message: '密码长度必须为5~16位', trigger: 'blur' }
    ]
})
import { useRegisterService,userLoginService,sendMailCon,userInfoGetService,editPswByEmailService } from '@/api/user.js';

const sendMail = async(mail) =>{
  let result = await sendMailCon(registerData.value.mail)
  ElMessage.success(result.msg ? result.msg :'发送成功')
}

 const register = async()=>{

  if(registerData.value.password === registerData.value.repassword && registerData.value.username !==''){
    let result =  await useRegisterService(registerData.value);
    ElMessage.success(result.msg ? result.msg :'注册成功')
  }else{
    ElMessage.error('请检查注册信息')
  }
   

//    if(result.code === 0){
//     // 成功
//     alert(result.msg ? result.msg :'注册成功')
//    }else{
//     console.log('失败了')
//    }
//    alert(result.msg ? result.msg :'注册成功')
    
}
//绑定数据模型
//表单校验
//调用登录接口
//导入token状态
import {useTokenStore} from '@/stores/token.js';
//调用useTokenStore得到状态
const tokenStore = useTokenStore();
import {useUserInfoStore} from '@/stores/user.js'
import { useRouter } from 'vue-router';
const router = useRouter()
const Login = async ()=>{
    let result = await userLoginService(registerData.value)
    //此时在后台返回的data就是该用户对应的Jwt令牌
    tokenStore.setToken(result.data)
    const userInfoStore = useUserInfoStore();
    let res = await userInfoGetService();
    //存储pinia
    userInfoStore.info =res.data;
    ElMessage.success(result.msg ? result.msg :'登录成功')
    if(userInfoStore.info.type===2){
      router.push('/MyLayout')
      // router.push('/')
    }else{
    //跳转到首页 路由完成跳转
    router.push('/')
    }

}

const EditPsw = async()=>{
  let result = await editPswByEmailService(registerData.value)
  ElMessage.success(result.msg ? result.msg :'修改成功')
}

const remove = ()=>{
    registerData.value={
        username: "",
        password: "",
        repassword: ""
    }
}

import { loadSlim } from "tsparticles-slim"; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.
 
const particlesInit = async engine => {
    //await loadFull(engine);
    await loadSlim(engine);
};


const particlesLoaded = async (container) => {
   // console.log("Particles container loaded", container)
}

// 粒子库 options 配置
const options={
    fpsLimit: 60,
    duration: 0,
  fullScreen: { enable: true },
  particles: {
    number: {
      value: 500
    },
    shape: {
      type: "circle"
    },
    opacity: {
      value: 0.5
    },
    size: {
      value: 5,
      random: {
        enable: true,
        minimumValue: 200
      }
    },
    move: {
      enable: true,
      speed: 2,
    //   direction: "top",
        random:true,
      outModes: {
        default: "bounce",
        top: "bounce",
        bottom: "bounce"
      }
    }
  },
  interactivity: {
    detectsOn: "canvas",
    events: {
      resize: true
    }
  },
  detectRetina: true,
  themes: [
    {
      name: "light",
      default: {
        value: true,
        mode: "light"
      },
      options: {
        background: {
          color: "#f7f8ef"
        },
        particles: {
          color: {
            value: ["#5bc0eb", "#fde74c", "#9bc53d", "#e55934", "#fa7921"]
          }
        }
      }
    },
    {
      name: "dark",
      default: {
        value: true,
        mode: "dark"
      },
      options: {
        background: {
          color: "#f7f8ef"
        },
        particles: {
          color: {
            value: ["#5bc0eb", "#fde74c", "#9bc53d", "#e55934", "#fa7921"]
          }
        }
      }
    }
  ],
  emitters: {
    direction: "top",
    position: {
      x: 50,
      y: 150
    },
    rate: {
      delay: 0.2,
      quantity: 2
    },
    size: {
      width: 100,
      height: 0
    }
  }

    }


</script>

<template>

<Particles
    id="tsparticles"
    :particlesInit="particlesInit" 
    :particlesLoaded="particlesLoaded"
    :options="options"
  />
    <div style="display: block;">
        <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 注册表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-if="isRegister1" :model="registerData" :rules="registerDataRules">
                <el-form-item>

                    <h1>注册</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username" ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item prop="repassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码" v-model="registerData.repassword"></el-input>
                </el-form-item>
                <el-form-item prop="mail">
                    <el-input :prefix-icon="User" placeholder="请输入邮箱" v-model="registerData.mail" ></el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input :prefix-icon="User" placeholder="请输入验证码" v-model="registerData.code" >
                      <template #append><el-button @click="sendMail">获取验证码</el-button></template>
                      </el-input>
                    
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="register">
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister1 = false;isRegister2 = true; remove()">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-if="isRegister2" :model="registerData" :rules="rules">
              <el-form-item>
                  <h1 style="font-size: 25px;color: #ffffff;">欢迎来到图书数字化管理系统</h1>
                </el-form-item>
                <el-form-item>
                  <h1>登录</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false" @click="isRegister1 = false;isRegister2 = false;isRegister3 = true">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="Login">登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister1 = true;isRegister2 = false;remove()">
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
                        <!-- 忘记密码表单 -->
                <el-form ref="form" size="large" autocomplete="off" v-if="isRegister3" :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>忘记密码</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="要修改的密码" v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item prop="mail">
                    <el-input :prefix-icon="User" placeholder="请输入邮箱" v-model="registerData.mail" ></el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input :prefix-icon="User" placeholder="请输入验证码" v-model="registerData.code" >
                      <template #append><el-button @click="sendMail">获取验证码</el-button></template>
                      </el-input>
                    
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-link type="primary" :underline="false" @click="isRegister1 = false;isRegister2 = false;isRegister3 = true">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="EditPsw()">修改</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister2 = true;isRegister1 = false;isRegister3 = false; remove()">
                        返回 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
    </div>

</template>

<!-- <style scoped>
.cash {
    position:fixed;
    top:180px;
    width:100%;
  }
</style> -->
<style lang="scss" scoped>

/* 样式 */
.login-page {
    height: 95vh;
    // background-color: #fff;
    opacity:9;
// opacity
    .bg {
        background: 
 //       url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
            url('@/assets/preview1.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
        opacity: 0.9;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>