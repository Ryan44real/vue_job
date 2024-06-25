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
    {
        "id": 5,
        "title": "陕西旅游攻略",
        "content": "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
        "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
        "state": "草稿",
        "categoryId": 2,
        "createTime": "2023-09-03 11:55:30",
        "updateTime": "2023-09-03 11:55:30"
    }
])

//续借的数据模型
const applydata = ref({
    bookName:'',
    bookNum:'',
    borrowRecordId:'',
    day:''
})
//将行内的数据传送到数据模型中
const applyRenewal=(row)=>{
    applydata.value.bookName = row.bookName
    applydata.value.bookNum = row.bookNum
    applydata.value.borrowRecordId = row.id
    
}


//用户搜索时的书名
const bookName=ref('')

const username = ref('')
const scanNum = ref('')
//用户搜索时选中的发布状态
const state=ref('')

//文章分类回显
//文章列表查询
const getBookCategoryList = async () => {
    //获取所有分类
    let resultC = await getBookCategory();
    categorys.value = resultC.data
    // console.log(categorys.value)
}
getBookCategoryList();
//文章分类数据模型
const categorys = ref([
])
//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(5)//每页条数
//导入pinia
import {useUserInfoStore} from '@/stores/user.js'
const userInfoStore = useUserInfoStore();
username.value = userInfoStore.info.username
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

import {borrowRecordListService,returnBook,applyRenewalService} from '@/api/borrow.js'

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
    let result = await borrowRecordListService(params);
    //渲染列表数据
    books.value = result.data.items
    console.log(books.value)
    //为列表中添加categoryName属性
    for(let i=0;i<books.value.length;i++){
        if(books.value[i].borrowState === 1) {
            books.value[i].State='正在借阅';
        }
        if(books.value[i].borrowState === 2){
            books.value[i].State='已经归还';
            books.value[i].lastDay=0;
        }
        if(books.value[i].borrowState === 3){
            books.value[i].State='已逾期';
        }
        }
    
    //渲染总条数
    total.value=result.data.total
}

getBooks();
import { ElMessage} from 'element-plus';
const returnBookNum = ref();
//还书
const dialogVisibleC = ref(false)
const showDialogC = (row)=>{
    returnBookNum.value = row.bookNum;
}
const innerDrawer =ref(false)
const getSonValue = (value) => {
    scanNum.value = value
}
const confim= async()=>{
    if(returnBookNum.value === scanNum.value){
    let res = await returnBook(returnBookNum.value)
    ElMessage.success(res.message ? res.message : '还书成功')
    }else {
        ElMessage.error('书号不匹配')
    }


    dialogVisibleC.value = false;
    getBooks();
}

const change =()=>{
    dialogVisibleC.value = true
}

//续借
const dialogVisible =ref(false)
const rec =async()=>{
    console.log(applydata.value)
    let res = await applyRenewalService(applydata.value)
    ElMessage.success(res.message ? res.message : '续借申请成功，请等待管理员通过')
    dialogVisible.value = false;
}

import Test from '@/views/userpage/Test.vue'

</script>



<template>
<el-card class="page-container">
        <template #header>
            <div class="header">
                <span>我的借阅</span>
            </div>
        </template>
        <!-- 文章列表 -->
        <el-table :data="books" style="width: 100%,padding=10px;" height="440" :show-header="true"
        :default-sort="{ prop: 'lastDay', order: 'descending' }">
            <el-table-column fixed="" label="书籍名称" width="200" prop="bookName" align="center"></el-table-column>
            <el-table-column label="封面" prop="coverImg" align="center">
                <template #default="scope">
                        <el-image :src="scope.row.imageName" style="height: 60px;width: 60px;"></el-image>
                    </template>
             </el-table-column>

            <el-table-column label="状态" prop="State" align="center"></el-table-column>
            <el-table-column label="剩余天数" prop="lastDay" align="center" sortable></el-table-column>

            <el-table-column label="借书时间" prop="borrowDate" align="center"> </el-table-column>
            <el-table-column label="还书时间" prop="deadline" align="center"> </el-table-column>

            <el-table-column label="操作" width="100" align="center">
                <template #default="{ row }">
                    <el-button  circle plain type="primary" @click="dialogVisibleC = fasle;showDialogC(row);innerDrawer = true"
                     v-if="row.borrowState===1 || row.borrowState ===3">还书</el-button>
                    <el-button  circle plain type="primary" @click="applyRenewal(row);dialogVisible =true" v-if="row.borrowState === 1">续借</el-button>

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

    <el-drawer
        v-model="innerDrawer"
        title="摄像头识别"
        :append-to-body="true"
        :before-close="handleClose"
      >
       <Test @getValue="getSonValue"></Test>
       <button @click="dialogVisibleC = true">扫码完毕，确定还书</button>
       <!-- <photoTest></photoTest> -->
      </el-drawer>
    <el-dialog v-model="dialogVisibleC" title="还书" width="500">
        确定还书吗？
    <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisibleC = false;innerDrawer=fasle">取消</el-button>
            <el-button type="primary" @click="confim"> 确认 </el-button>
        </span>
    </template>
    </el-dialog>


    <el-dialog v-model="dialogVisible" title="续借" width="500">
    <el-form :model="applydata" label-width="100px" style="padding-right: 30px">
        <el-form-item label="图书名称">
            <el-input v-model="applydata.bookName" minlength="1" maxlength="10" disabled></el-input>
        </el-form-item>
        <el-form-item label="借书时长(天)" prop="day">
            <el-select v-model="applydata.day" placeholder="请选择">
                <el-option label="7" value="7" />
                <el-option label="14" value="14" />
                <el-option label="30" value="30" />
            </el-select>
        </el-form-item>
    </el-form>
    <br>
    <br>
    <br>
    <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false;remove()">取消</el-button>
            <el-button type="primary" @click="rec()"> 确认 </el-button>
        </span>
    </template>
</el-dialog>

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