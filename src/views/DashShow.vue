<template>
  <el-row>
    <el-col :span="6">
      <el-statistic title="用户数" :value="userNum" />
    </el-col>
    <el-col :span="6">
        <el-statistic title="访问数" :value="134" />
    </el-col>
    <el-col :span="6">
      <el-statistic title="借阅次数" :value="outputValue" />
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
  //dropDown条目被点击后，回调的函数
import {useRouter} from 'vue-router'
const router = useRouter()
  import * as echarts from 'echarts'
  import {ElMessage} from "element-plus";
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
  duration: 800,
})
source.value = 6
import img1 from '@/assets/P1.jpg'
const getAllBorrowNum = async()=>{
  let res = await getAllBorrowNumServie();
  source.value = res.data
}
getAllBorrowNum();
const carouselList = reactive([

    {bigImg:new URL('@/assets/P1.jpg', import.meta.url).href},
    {bigImg:new URL('@/assets/P2.jpg', import.meta.url).href},
    {bigImg:new URL('@/assets/P3.jpg', import.meta.url).href},
    ])

import {deleteMsgService,getUserNumService,getBookNumService,getAllBorrowNumServie} from '@/api/user.js'
const deleteMsg =async()=>{
    let res = await deleteMsgService()
    ElMessage.success(res.message ? res.message : '已经确定')
    userInfoStore.info.msg=null;
    dialogVisible.value = false;
}
const bookNum = ref(0)
const userNum = ref(2)
const getUserNum = async()=>{
    let res = await getUserNumService();
    userNum.value = res.data
}
getUserNum();
const getBookNum = async()=>{
    let res = await getBookNumService();
    bookNum.value = res.data
    console.log(res)
  }
getBookNum();  
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