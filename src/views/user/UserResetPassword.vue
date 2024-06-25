<script setup>
import { ref } from 'vue'

const params = ref({
    oldpassword:'',
    password:'',
    repassword:''
})

//校验密码函数
const rePasswordValid = (rule,value,callback)=>{
    if(value === ''){
        callback(new Error('请再次确认密码'))
    }else if(value !== params.value.password){
        callback(new Error('请确认两次密码一样'))
    }else callback()
}

const rules = {
    oldpassword: [
        { required: true, message: '请输入旧密码', trigger: 'blur' },
        {
            pattern: /^\S{2,10}$/,
            message: '昵称必须是2-10位的非空字符串',
            trigger: 'blur'
        }
    ],
    password: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        {
            pattern: /^\S{2,10}$/,
            message: '密码必须是2-10位的非空字符串',
            trigger: 'blur'
        }
    ],
    repassword: [
        { validator: rePasswordValid, trigger: 'blur' }
    ]
}
import { useUserInfoStore } from '@/stores/user.js';
const userInfoStore = useUserInfoStore()

//修改用户信息

import {resetPsw} from '@/api/user.js'
import { ElMessage, ElMessageBox } from 'element-plus';
import {useTokenStore} from '@/stores/token.js';
//调用useTokenStore得到状态
const tokenStore = useTokenStore();
import { useRouter } from 'vue-router';
const router = useRouter()
const updateUserInfo = async ()=>{
    // console.log(params.value)
    let result = await resetPsw(params.value)
    ElMessage.success(result.message? result.message:'修改成功')
    //更新pinia中的数据
    //用户点击了确认
    //清空pinia中的token和个人信息
    // alert("修改成功")
    userInfoStore.info={}
    tokenStore.token=''
    //跳转到登录页
    router.push('/login')



}

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>修改密码</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="params" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="旧密码" prop="oldpassword">
                        <!-- 这里的对象名，要与后端返回的data中的属性名一致，也就是说要和pojo实体类中的名字相同 -->
                        <el-input v-model="params.oldpassword" placeholder="请输入旧密码"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="password">
                        <el-input v-model="params.password" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="repassword">
                        <el-input v-model="params.repassword" placeholder="请再次输入密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserInfo">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>