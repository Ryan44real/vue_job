<script setup>
import {
    Edit,
    Delete,
    CircleClose
} from '@element-plus/icons-vue'

import { ref } from 'vue'

//文章分类数据模型
const categorys = ref([
    {
        "id": 3,
        "categoryName": "美食",
        "categoryAlias": "my",
        "createTime": "2023-09-02 12:06:59",
        "updateTime": "2023-09-02 12:06:59"
    },
    {
        "id": 4,
        "categoryName": "娱乐",
        "categoryAlias": "yl",
        "createTime": "2023-09-02 12:08:16",
        "updateTime": "2023-09-02 12:08:16"
    },
    {
        "id": 5,
        "categoryName": "军事",
        "categoryAlias": "js",
        "createTime": "2023-09-02 12:08:33",
        "updateTime": "2023-09-02 12:08:33"
    }
])
//搜索的用户名
const username = ref('')

//用户搜索时选中的发布状态
const state=ref('')



//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(5)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    
}

import {Plus} from '@element-plus/icons-vue'
const visibleDrawer = ref(false)
const visibleDrawerL = ref(false)
import { useRegisterService,userLoginService,sendMailCon,deleteUserService } from '@/api/user.js';
import { ElMessage,ElMessageBox } from 'element-plus';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {useTokenStore} from '@/stores/token.js'
const tokenStore = useTokenStore()
//上传成功的回调函数,将图片展示在页面上
const uploadSuccess =(res)=>{
    //img就是后台响应的数据，格式为：{code:状态码，message：提示信息，data: 图片的存储地址}
    articleModel.value.coverImg = res.data;
}

//清除数据模型中的数据
const remove = ()=>{
    articleModel.value.categoryId = ''
    articleModel.value.content = ''
    articleModel.value.coverImg = ''
    articleModel.value.title = ''
    articleModel.value.state = ''
}  
//添加表单数据模型
const userData = ref([
    {
        id:'',
    username:'',
    nickname:'',
    state:'',
    type:'',
    password:'',
    email:''
    }

])

//定义数据模型
const registerData = ref({
    username: '',
    password: '',
    repassword: '',
    mail:'',
    code:'',
    type:''
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

import {getUserListService,editUserService,upgradeUserStateService} from '@/api/user.js'
const getUserList = async()=>{
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        username : username.value ? username.value : null,
        state : state.value ? state.value : null
    }
    let result = await getUserListService(params)
    userData.value = result.data.items
    for(let i=0;i<userData.value.length;i++){
        if(userData.value[i].state === 1) {
            userData.value[i].State='可借阅';
        }
        if(userData.value[i].state === 2){
            userData.value[i].State='不可借阅';
        }
        if(userData.value[i].type === 1 ){
            userData.value[i].Type = '管理员'
        }else{
            userData.value[i].Type = '普通用户'
        }
        }
    console.log(userData.value)

    //渲染总条数
    total.value=result.data.total
}
getUserList();

const isRegister =ref(false)

const editData=ref({})
const edit = (row)=>{
    editData.value.nickname = row.nickname
    editData.value.password = row.password
    editData.value.repassword = ''
    editData.value.id = row.id
    editData.value.repassword = ''
    console.log(editData.value)
    visibleDrawerL.value = true
}
const data =ref({
    id:'',
    nickname:'',
    password:'',
    repassword:''
})
const editUser = async()=>{
    // data.value.id = editData
    let result = await editUserService(editData.value)
    ElMessage.success(result.message? result.message:'修改成功')
    //更新pinia中的数据
    // userInfoStore.info.nickname=userInfo.value.
    visibleDrawerL.value = false
    getUserList();
}
const dialogVisible = ref(false)
const id = ref('')
const updateDate = (row)=>{
    id.value = row.id
    dialogVisible.value = true
}
const dialogVisibleR = ref(false)
const updateDate2 = (row)=>{
    id.value = row.id
    dialogVisibleR.value = true
}
const updateUserState = async(state)=>{
    let result = await upgradeUserStateService(id.value,state)
    ElMessage.success(result.message? result.message:'修改成功')
    getUserList();
    dialogVisible.value = false;
    dialogVisibleR.value = false;
}
const deleteUser = async(id)=>{
    console.log(id)
    let result = await deleteUserService(id)
    ElMessage.success(result.message? result.message:'删除成功')
    getUserList();
}

const sendMail = async(mail) =>{
  let result = await sendMailCon(registerData.value.mail)
  ElMessage.success(result.msg ? result.msg :'发送成功')
}

const register = async()=>{

if(registerData.value.password === registerData.value.repassword && registerData.value.username !==''){
  let result =  await useRegisterService(registerData.value);
  ElMessage.success(result.msg ? result.msg :'注册成功')
  visibleDrawer.value = false
}else{
  ElMessage.error('请检查注册信息')
}
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>用户管理</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer = true;isRegister=true">添加用户</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline size="small">
            <el-form-item label="用户名：">
                <el-input v-model="username"></el-input>
            </el-form-item>
            <el-form-item label="发布状态：">
                <el-select placeholder="请选择" v-model="state" style="width:200px">
                    <el-option label="可借阅" value="1" ></el-option>
                    <el-option label="不可借阅" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getUserList">搜索</el-button>
                <el-button @click="username='';state='';getUserList">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="userData" style="width: 100%" height="390" :show-header="true">
            <el-table-column fixed="" label="用户名" width="200" prop="username" align="center"></el-table-column>
            <el-table-column label="昵称" prop="nickname" align="center"></el-table-column>
            <el-table-column label="借书状态" prop="State" align="center"></el-table-column>
            <el-table-column label="用户类型" prop="Type" align="center"> </el-table-column>
            <el-table-column label="邮箱" prop="email" align="center"> </el-table-column>
            <!-- <el-table-column label="状态" prop="state" align="center"></el-table-column> -->
            <el-table-column label="操作" width="250" align="center">
                <template #default="{ row }">
                    <el-button  plain type="primary" @click="edit(row)" size="small">编辑</el-button>
                    <el-button  plain type="danger" size="small" @click="deleteUser(row.id)">删除用户</el-button>
                    <el-button  plain type="warning" @click="updateDate(row)" size="small" v-if="row.state === 1">禁止借书</el-button>
                    <el-button  plain type="success" @click="updateDate2(row)" size="small" v-if="row.state === 2">解除禁止</el-button>

                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5 ,10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="justify-content: flex-end" />
    </el-card>

    <!-- 抽屉 -->
    <el-drawer v-model="visibleDrawerL" title="修改用户信息" direction="rtl" size="50%">
        <el-form :v-model="editData" :rules="registerDataRules">
            <el-form-item label="昵称">
                <el-input  v-model="editData.nickname"></el-input>
            </el-form-item>
            <el-form-item label="新的密码" prop="password">
                <el-input  v-model="editData.password" ></el-input>
            </el-form-item>
            <el-form-item label="新的密码" prop="repassword">
                <el-input  v-model="editData.repassword"></el-input>
            </el-form-item>
            <el-form-item>
                    <el-button type="primary" @click="editUser">修改</el-button>
                </el-form-item>
        </el-form>
    </el-drawer>
        <el-dialog
            v-model="dialogVisible"
            title="禁止借书"
            width="500"
            :before-close="handleClose"
                >
            <span>确定要禁止该用户借书吗？</span>
                <template #footer>
                  <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">否</el-button>
                    <el-button type="primary" @click="updateUserState(2)">
                      是的
                    </el-button>
                  </div>
                </template>
         </el-dialog>


         <el-dialog
            v-model="dialogVisibleR"
            title="解除禁止借书"
            width="500"
            :before-close="handleClose"
                >
            <span>确定要解除禁止该用户借书吗？</span>
                <template #footer>
                  <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">否</el-button>
                    <el-button type="primary" @click="updateUserState(1)">
                      是的
                    </el-button>
                  </div>
                </template>
         </el-dialog>





    <!-- 抽屉 -->
    <el-drawer v-model="visibleDrawer" title="添加用户" direction="rtl" size="50%">
                        <!-- 注册表单 -->
                <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :model="registerData" :rules="registerDataRules">
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
                <el-form-item prop="type">
                    <el-select v-model="registerData.type" placeholder="请选择用户类型">
                        <el-option label="管理员" value="1" />
                        <el-option label="普通用户" value="2" />
                    </el-select>
                </el-form-item>
                <el-button class="button" type="primary" auto-insert-space @click="register">
                        注册
                    </el-button>
            </el-form>
        </el-drawer>
</template>
<style lang="scss" scoped>
.page-container {
    max-height: 100%;
    box-sizing: border-box;

    .header {
        height: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}

.el-form{
    height: 25px;
    padding: 0%;
    margin: 0%;
}
</style>