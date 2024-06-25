<template>
  <div class="common-layout">
    
    <el-container>
      <el-header>
        <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
    router
  >
    <el-menu-item index="0">
      <img
        style="width: 90px"
        src="../assets/logo.png"
        alt="Element logo"
      />
    </el-menu-item>
    <el-menu-item>
      <div>欢迎用户：
                    <!-- 是否有别名，无暂时以登录名作为显示 -->
                    <!-- <strong>{{ userInfoStore.info.nickname ? userInfoStore.info.nickname : userInfoStore.info.usrename }}</strong> -->
                    <strong>{{ userInfoStore.info.username }}</strong>
                </div>
    </el-menu-item>
    <!-- <div class="flex-grow" /> -->

    <el-menu-item index="/userMain">首页</el-menu-item>
    <el-menu-item index="/borrow/borrowBook" >找书借书</el-menu-item>
    <el-menu-item index="/borrow/Myborrow" >我的借阅</el-menu-item>
    <el-sub-menu index="3">
      <template #title>个人中心</template>
      <el-menu-item index="/user/in">个人资料</el-menu-item>
      <el-menu-item index="/user/ava">修改头像</el-menu-item>
      <el-menu-item index="/user/resetPSW">修改密码</el-menu-item>
    </el-sub-menu>
    <!-- <el-menu-item index="/photoTest" >摄像头测试</el-menu-item> -->
  </el-menu>


                  <!-- 下拉菜单 -->
  <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="userInfoStore.info.userPic ? userInfoStore.info.userPic : avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="in" :icon="User">基本资料</el-dropdown-item>
                            <el-dropdown-item command="ava" :icon="Crop">更换头像</el-dropdown-item>
                            <el-dropdown-item command="resetPSW" :icon="EditPen">重置密码</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
      </el-header>
      <el-main>
        <router-view>
        </router-view>
      </el-main>
    </el-container>
  </div>



</template>

<script setup name="MyLayout">
import { ref } from 'vue'
import {useRouter} from 'vue-router'
const router = useRouter()
const activeIndex = ref('1')
// const handleSelect = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath)
// }

import {useUserInfoStore} from '@/stores/user.js'
const userInfoStore = useUserInfoStore();
import {

    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom
} from '@element-plus/icons-vue'

//实现登录退出
import {ElMessage,ElMessageBox} from 'element-plus'
import { useTokenStore } from '@/stores/token.js'
const tokenStore = useTokenStore()
const handleCommand = (command) => {
    if (command === 'logout') {
        //退出登录
        ElMessageBox.confirm(
            '你确认退出登录码？',
            '温馨提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(async () => {
                //用户点击了确认
                //清空pinia中的token和个人信息
                userInfoStore.info={}
                tokenStore.token=''
                //跳转到登录页
                router.push('/login')
            })
            .catch(() => {
                //用户点击了取消
                ElMessage({
                    type: 'info',
                    message: '取消退出',
                })
            })
    } else {
        //路由
        router.push('/user/' + command)
    }
}
</script>

<style scoped>

.el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 50px;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }
</style>
