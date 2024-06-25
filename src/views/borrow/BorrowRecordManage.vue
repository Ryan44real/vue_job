<script setup lang="ts">

import { ref,reactive } from 'vue'
import { getBookCategory } from '@/api/bookCategory.js'
import {
    Edit,
    CircleCloseFilled,
    Delete,
    Sell,
    CircleClose}
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

//用户搜索时选中的分类id
const categoryId=ref('')

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
    console.log(categorys.value)
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

import {borrowRecordListService,send} from '@/api/borrow.js'

const getBooks = async () => {
    // console.log(categoryId.value)
    console.log(username.value)
    let params = {

        pageNum: pageNum.value,
        pageSize: pageSize.value,
        bookName: bookName.value ? bookName.value : null,
        username : username.value ? username.value :null,
        state: state.value ? state.value : null
    }
    let result = await borrowRecordListService(params);
    console.log(result)
    //渲染列表数据
    books.value = result.data.items
    //为列表中添加categoryName属性
    for(let i=0;i<books.value.length;i++){
        if(books.value[i].borrowState === 1) {
            books.value[i].State='借阅中';
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
import { ElMessageBox,ElMessage } from 'element-plus'
const drawer = ref(false)
const innerDrawer = ref(false)
const handleClose = (done : () => void) => {
  ElMessageBox.confirm('真的交钱了吗？')

    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

// do not use same name with ref
const form = reactive({

})

const showDraw =(row)=>{
    form.bookName = row.bookName,
    form.bookNum = row.bookNum,
    form.username = row.userName,
    form.date1 = row.borrowDate
    form.date2 = row.deadline
    form.state = row.borrowState
    form.userId = row.userId
    form.borrowId = row.id
    console.log(form)
    drawer.value = true
}

const onSubmit =async()=>{
  console.log(form)
  let res = await send(form)
  ElMessage.success(res.msg ? res.msg :'编辑成功')
  drawer.value = false
  getBooks();
}

import {urge} from '@/api/user.js'
const urgeUser = async (row)=>{
  let result = await urge(row.userId)
  ElMessage.success(result.msg ? result.msg :'催促成功')
}
</script>



<template>
<el-card class="page-container">
        <template #header>
            <div class="header">
                <span>借阅记录管理</span>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline size="small">
            <el-form-item label="用户名：">
                <el-input v-model="username"></el-input>
            </el-form-item>
            <el-form-item label="书名：">
                <el-input v-model="bookName"></el-input>
            </el-form-item>


            <el-form-item label="状态：">
                <el-select placeholder="请选择" v-model="state" style="width:200px">
                    <el-option label="借阅中" value="1" ></el-option>
                    <el-option label="已归还" value="2"></el-option>
                    <el-option label="已逾期" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getBooks">搜索</el-button>
                <el-button @click="bookName='';state='',username='',getBooks()">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="books" style="width: 100%" height="390" :show-header="true"
        :default-sort="{ prop: 'State', order: 'ascending' }">
            <el-table-column fixed="" label="书籍名称" width="200" prop="bookName" align="center"></el-table-column>
            <el-table-column label="封面" prop="coverImg" align="center">
                <template #default="scope">
                        <el-image :src="scope.row.imageName" style="height: 60px;width: 60px;"></el-image>
                    </template>
             </el-table-column>

            <el-table-column label="借书人名称" prop="userName" align="center"> </el-table-column>
            <el-table-column label="状态" prop="State" align="center" sortable></el-table-column>
            <el-table-column label="剩余天数" prop="lastDay" align="center"></el-table-column>
            <el-table-column label="借书时间" prop="borrowDate" align="center"> </el-table-column>
            <el-table-column label="还书时间" prop="deadline" align="center"> </el-table-column>

            <el-table-column label="操作" width="150" align="center">
                <template #default="{ row }">
                    <el-button  type="primary" @click="showDraw(row)" size="small" v-if="row.borrowState === 1 ||
                    row.borrowState === 3">编辑</el-button>
                    <el-button   type="danger" size="small" v-if="row.borrowState === 1 ||
                    row.borrowState === 3" @click="urgeUser(row)">催促</el-button>
                    <label v-if="row.borrowState === 2">借阅完成</label>
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


    <el-drawer v-model="drawer" title="修改借阅记录" size="50%">
    <div>
        <el-form :model="form" label-width="auto" style="max-width: 600px">
    <el-form-item label="书名">
      <el-input v-model="form.bookName" disabled/>
    </el-form-item>
    <el-form-item label="借书人名称">
        <el-input v-model="form.username" disabled />
    </el-form-item>
    <el-form-item label="借书日期">
      <el-col :span="11">
        <el-date-picker
          v-model="form.date1"
          type="date"
          placeholder="Pick a date"
          style="width: 100%"
        />
      </el-col>
    </el-form-item>
    <el-form-item label="还书日期">
      <el-col :span="11">
        <el-date-picker
          v-model="form.date2"
          type="date"
          placeholder="Pick a date"
          style="width: 100%"
        />
      </el-col>
    </el-form-item>

    <el-form-item label="借阅状态">
      <el-radio-group v-model="form.state">
        <el-radio :value="1">未归还</el-radio>
        <el-radio :value="2">已归还</el-radio>
        <el-radio :value="3">已逾期</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>

      <el-button @click="innerDrawer = true" type="danger">逾期交钱！！！！！</el-button>
      <el-drawer
        v-model="innerDrawer"
        title="逾期交钱码"
        :append-to-body="true"
        :before-close="handleClose"
      >
       <img src="@/assets/geiqian.jpg" style="width:350px; height: 500px">
      </el-drawer>
    </div>
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
</style>