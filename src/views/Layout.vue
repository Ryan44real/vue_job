<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import {
    Management,
    Promotion,
    UserFilled,
    House,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
//导入接口函数
// import {userInfoGetService} from '@/api/user.js'
//导入pinia
import {useUserInfoStore} from '@/stores/user.js'
const userInfoStore = useUserInfoStore();
import {ref,onMounted,onBeforeMount} from 'vue'


const dialogVisible = ref(false)
const type = ref()
const userType = ref()
type.value = userInfoStore.info
console.log(userInfoStore.info)
const showMsg  =()=>{
    if(userInfoStore.info.msg !== ""){
        dialogVisible.value = true
    }
}
userType.value = type.value.type
// showMsg();


//dropDown条目被点击后，回调的函数
import {useRouter} from 'vue-router'
const router = useRouter()


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

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="150px">
            <div class="el-aside__logo"></div>
            <el-menu active-text-color="#1a1a1a" background-color="#ecf5ff"  text-color="#1a1a1a"
                router v-if="userType ===1">
                <el-menu-item index="/dashshow">
                    <el-icon>
                        <House/>
                    </el-icon>
                    <span>首页</span>
                </el-menu-item>
                <el-menu-item index="/article/category">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>图书分类</span>
                </el-menu-item>
                <el-menu-item index="/article/manage">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>图书管理</span>
                </el-menu-item>
                <el-menu-item index="/borrow/borrowRecordManage">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>借阅管理</span>
                </el-menu-item>

                <el-menu-item index="/borrow/RenewalManage">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>续借管理</span>
                </el-menu-item>

                <!-- <el-menu-item index="/borrow/borrowBooks">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>借书</span>
                </el-menu-item>
                <el-menu-item index="/borrow/MyborrowRecord">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>我的借阅</span>
                </el-menu-item> -->
                <el-menu-item index="/user/UserManage">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>用户管理</span>
                </el-menu-item>

                <el-sub-menu background-color="#ffffff"  text-color="#1a1a1a">
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="/user/info" background-color="#ffffff"  text-color="#1a1a1a">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/user/avatar">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>更换头像</span>
                    </el-menu-item>
                    <el-menu-item index="/user/resetPassword">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>重置密码</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>

            <el-menu active-text-color="#1a1a1a" background-color="#ecf5ff"  text-color="#1a1a1a"
                router v-if="userType ===2">
                <el-menu-item index="/dashshow">
                    <el-icon>
                        <House/>
                    </el-icon>
                    <span>首页</span>
                </el-menu-item>
                <!-- <el-menu-item index="/borrow/borrowBooks">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>借书</span>
                </el-menu-item> -->
                <!-- <el-menu-item index="/borrow/MyborrowRecord">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>我的借阅</span>
                </el-menu-item> -->

                <el-sub-menu background-color="#ffffff"  text-color="#1a1a1a">
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="/user/info" background-color="#ffffff"  text-color="#1a1a1a">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/user/avatar">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>更换头像</span>
                    </el-menu-item>
                    <el-menu-item index="/user/resetPassword">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>重置密码</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div>欢迎管理员：
                    <!-- 是否有别名，无暂时以登录名作为显示 -->
                    <!-- <strong>{{ userInfoStore.info.nickname ? userInfoStore.info.nickname : userInfoStore.info.usrename }}</strong> -->
                    <strong>{{ userInfoStore.info.username }}</strong>

                </div>

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
                            <el-dropdown-item command="info" :icon="User">基本资料</el-dropdown-item>
                            <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
                            <el-dropdown-item command="resetPassword" :icon="EditPen">重置密码</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 中间区域 -->
            <el-main>
                <router-view>
                </router-view>
            </el-main>
            <!-- 底部区域 -->
            <!-- <el-footer>大事件 ©2023 Created by XX程序员</el-footer> -->
        </el-container>
    </el-container>
    <el-dialog
        v-model="dialogVisible"
        title="通知"
        width="500"
        >
    <el-input type="textarea" v-model="userInfoStore.info.msg" disabled></el-input>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>


</template>

<style lang="scss" scoped>
.layout-container {
    height: 97vh;

    .el-aside {
        color: var(--el-text-color-primary);
        background: white;

        &__logo {
            height: 120px;
            background: url('@/assets/logo.png') no-repeat center / 120px auto;
        }

        .el-menu {
            border-right: none;
            background-color: white;
        }

        .el-sub-menu .el-menu-item {
         background-color: RGB(255, 255, 255) !important;
        }

        
        .el-sub-menu.el-menu-item:hover{
          background-color: "#ecf5ff" !important;
        }
        // .el-sub-menu.el-menu-item.is-active{
        //   background-color: "#ecf5ff" !important;
        // }

        .el-sub-menu__title:focus, .el-sub-menu__title:hover{  
        background-color: aqua !important;;
        }
    }

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

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
    .el-main {
  color: #333;
  text-align: center;
//   height: 500px;
  height: calc(100vh - 100px);
        }


}
</style>