<template>
  <el-row>
    <el-col :span="6">
      <el-statistic title="在线用户数" :value="1" />
    </el-col>

    <el-col :span="6">
      <el-statistic title="我的借阅次数" :value="myRecordNum" />
    </el-col>
    <el-col :span="6">
      <el-statistic title="藏书数" :value="bookNum">
        <template #suffix>
          <el-icon style="vertical-align: -0.125em">
            <ChatLineRound />
          </el-icon>
        </template>
      </el-statistic>
    </el-col>
    <el-col :span="6">
        <el-statistic title="可借阅书籍数" :value="usefulBooks" />
    </el-col>
  </el-row>
  <br>
  <el-carousel indicator-position="outside" height="500px">
    <el-carousel-item v-for="item in carouselList" :key="item">
      <img :src="item.bigImg" alt="" style="width: 100%; height: 100%;"/>
    </el-carousel-item>
  </el-carousel>
  <!-- <img src="@/assets/P1.jpg" alt=""/> -->
    <el-dialog
        v-model="dialogVisible"
        title="通知"
        width="500"
        >
    <el-input type="textarea" v-model="userInfoStore.info.msg" disabled></el-input>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="deleteMsg">
          我已知晓
        </el-button>
      </div>
    </template>
  </el-dialog>
  </template>
  
  <script setup>
  import {checkLogin,getBookNumService,getBookNumUseService,getMyRecordNumService} from '@/api/user.js'
const myRecordNum =ref(0)
const getMyRecordNum = async()=>{
  let res = await getMyRecordNumService();
  myRecordNum.value = res.data
  console.log(res)
}
getMyRecordNum();
const usefulBooks = ref(0)
  const bookNum = ref(0)
  const getBookNum = async()=>{
    let res = await getBookNumService();
    bookNum.value = res.data
    console.log(res)
  }
getBookNum();
const getBookNumUse = async()=>{
  let res = await getBookNumUseService();
  usefulBooks.value = res.data
  console.log(res)
}
getBookNumUse();
  //dropDown条目被点击后，回调的函数  
const res = async()=>
{
  let resm = await checkLogin();
}
res();
  //dropDown条目被点击后，回调的函数
import {useRouter} from 'vue-router'
const router = useRouter()
  import * as echarts from 'echarts'
  import {ElMessage} from "element-plus";
//   import request from "../utils/request";
  //导入pinia
import {useUserInfoStore} from '@/stores/user.js'
import {ref,onMounted,onBeforeMount,reactive} from 'vue'
const userInfoStore = useUserInfoStore();
const dialogVisible = ref(false)
  const showMsg  =()=>{
    console.log(userInfoStore.info.msg)
    if(userInfoStore.info.msg !== null){
        dialogVisible.value = true
    }
}
showMsg();
import { useTransition } from '@vueuse/core'
import { ChatLineRound, Male } from '@element-plus/icons-vue'
// import SoftAlgorithm from '../SDK/soft-algorithm-min.js';
const source = ref(0)
const outputValue = useTransition(source, {
  duration: 1500,
})
source.value = 6
import img1 from '@/assets/P1.jpg'
const carouselList = reactive([

    {bigImg:new URL('@/assets/P1.jpg', import.meta.url).href},
    {bigImg:new URL('@/assets/P2.jpg', import.meta.url).href},
    {bigImg:new URL('@/assets/P3.jpg', import.meta.url).href},
    ])

import {deleteMsgService} from '@/api/user.js'
// import { get } from 'node_modules/axios/index.cjs';
const deleteMsg =async()=>{
    let res = await deleteMsgService()
    ElMessage.success(res.message ? res.message : '已经确定')
    userInfoStore.info.msg=null;
    dialogVisible.value = false;
}


  </script>
  
  <style scoped>
.el-col {
  text-align: center;
}

/* .el-carousel__item h3 {
  display: flex;
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
} */

/* .el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
} */
  </style>