<script setup>

import { ref } from 'vue'
import { getBookCategory } from '@/api/bookCategory.js'

import {
    Edit,
    Delete,
    Sell,
    Collection}
    from '@element-plus/icons-vue'

const books = ref([

])

//续借的数据模型
const applydata = ref({
    //用户名
    username:'',
    //借阅次数
    borrowNum:'',
    //逾期次数
    overdueNum:'',
    //需要续借的书籍
    bookName:'',
    //申请续借天数
    dayNum:'',
})

import {getBorrowRecordInfoService} from '@/api/user.js'

//将行内的数据传送到数据模型中
const applyRenewal= async(row)=>{
    applydata.value.bookName = row.title
    applydata.value.dayNum = row.dayNum
    applydata.value.username = row.username
    applydata.value.borrowRecordId = row.borrowRecordId
    applydata.value.id = row.id
    applydata.value.deadline = row.deadline
    let res = await getBorrowRecordInfoService(row.userId)

    // console.log(res.data.value.borrowNum)

    applydata.value.borrowNum = res.data.borrowNum
    applydata.value.overdueNum = res.data.overdueNum


}


//用户搜索时的书名
const bookName=ref('')

const username = ref('')

//用户搜索时选中的发布状态
const state=ref('')

//文章分类回显
//文章列表查询
const getBookCategoryList = async () => {
    //获取所有分类
    let resultC = await getBookCategory();
    categorys.value = resultC.data
}
getBookCategoryList();
//文章分类数据模型
const categorys = ref([
])
//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(5)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    getBooks()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    getBooks()
}

import {applyRenewalService,getApplyRenewalListService,passApplyService,rejectApplyService} from '@/api/borrow.js'

const getBooks = async () => {
    // console.log(categoryId.value)
    let params = {

        pageNum: pageNum.value,
        pageSize: pageSize.value,
        // categoryId: categoryId.value ? categoryId.value : null,
        bookName: bookName.value ? bookName.value : null,
        username : username.value ? username.value :null,
        state: state.value ? state.value : null
    }
    let result = await getApplyRenewalListService(params);
    //渲染列表数据
    books.value = result.data.items
    console.log(books.value)
    //为列表中添加categoryName属性
    // for(let i=0;i<books.value.length;i++){
    //     if(books.value[i].borrowState === 1) {
    //         books.value[i].State='正在借阅';
    //     }
    //     if(books.value[i].borrowState === 2){
    //         books.value[i].State='已经归还';
    //         books.value[i].lastDay=0;
    //     }
    //     if(books.value[i].borrowState === 3){
    //         books.value[i].State='已逾期';
    //     }
    //     }
    
    //渲染总条数
    total.value=result.data.total
}

getBooks();
import { ElMessage} from 'element-plus';


const visibleDrawerL = ref(false)

//续借
const dialogVisible =ref(false)
const rec =async()=>{
    let params = {
        deadline: applydata.value.deadline,
        day : applydata.value.dayNum,
        borrowRecordId :applydata.value.borrowRecordId,
        id : applydata.value.id,
    }
    console.log(params)
    let res = await passApplyService(params)
    ElMessage.success(res.message ? res.message : '已经通过')
    getBooks();
    visibleDrawerL.value = false;
}



const bye =async ()=>{
    console.log(applydata.value.id)
    let res = await rejectApplyService(applydata.value.id)
    ElMessage.success(res.message ? res.message : '已经拒绝')
    getBooks();
    visibleDrawerL.value = false;

}
</script>



<template>
<el-card class="page-container">
        <template #header>
            <div class="header">
                <span>续借审批</span>
            </div>
        </template>
        <!-- 文章列表 -->
        <el-table :data="books" style="width: 100%,padding=10px;" height="440" :show-header="true">
            <el-table-column fixed="" label="书籍名称" width="150" prop="title" align="center"></el-table-column>
            <el-table-column label="封面" prop="coverImg" align="center">
                <template #default="scope">
                        <el-image :src="scope.row.coverImg" style="height: 60px;width: 60px;"></el-image>
                    </template>
             </el-table-column>

            <el-table-column label="书号" prop="bookNum" align="center"></el-table-column>
            <el-table-column label="用户" prop="username" align="center"></el-table-column>
            <el-table-column label="申请续借天数" prop="dayNum" align="center"></el-table-column>

            <el-table-column label="借书时间" prop="borrowDate" align="center"> </el-table-column>
            <el-table-column label="还书时间" prop="deadline" align="center"> </el-table-column>

            <el-table-column label="操作" width="100" align="center">
                <template #default="{ row }">
                    <!-- <el-button   plain type="primary" @click=""
                     >用户信息</el-button> -->
                    
                    <el-button  type="primary" @click="applyRenewal(row);visibleDrawerL =true" v-if="row.applyState===1">审批</el-button>
                    <label v-if="row.applyState === 2">审核通过</label>
                    <label v-if="row.applyState === 3">已经拒绝</label>
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
    <el-drawer v-model="visibleDrawerL" title="续借审批" direction="rtl" size="50%">
            <!-- 添加文章表单 -->
            <el-form :model="applydata" label-width="100px" >
                <el-form-item label="用户名" >
                    <el-input v-model="applydata.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="借阅次数">
                    <el-input v-model="applydata.borrowNum" disabled></el-input>
                </el-form-item>
                <el-form-item label="逾期次数" >
                    <el-input v-model="applydata.overdueNum" disabled></el-input>
                </el-form-item>
                <el-form-item label="续借的书名" >
                    <el-input v-model="applydata.bookName" disabled></el-input>
                </el-form-item>
                <el-form-item label="续借的天数" >
                    <el-input v-model="applydata.dayNum" disabled></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="rec">通过</el-button>
                    <el-button type="warning" @click="bye">拒绝</el-button>
                </el-form-item>
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
    .el-card-body{
        padding: 10px;
    }
    
}
</style>