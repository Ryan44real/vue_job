<script setup>
import {
    Edit,
    Delete,
    Collection
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

//用户搜索时选中的分类id
const categoryId=ref('')

//用户搜索时的书名
const title=ref('')

//用户搜索时选中的发布状态
const state=ref('')

//文章列表数据模型
const articles = ref([
    {
        "id": 5,
        "title": "陕西旅游攻略",
        "content": "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
        "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
        "state": "草稿",
        "categoryId": 2,
        "createTime": "2023-09-03 11:55:30",
        "updateTime": "2023-09-03 11:55:30"
    },
    {
        "id": 5,
        "title": "陕西旅游攻略",
        "content": "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
        "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
        "state": "草稿",
        "categoryId": 2,
        "createTime": "2023-09-03 11:55:30",
        "updateTime": "2023-09-03 11:55:30"
    },
    {
        "id": 5,
        "title": "陕西旅游攻略",
        "content": "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
        "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
        "state": "草稿",
        "categoryId": 2,
        "createTime": "2023-09-03 11:55:30",
        "updateTime": "2023-09-03 11:55:30"
    },
])
//导入pinia
import {useUserInfoStore} from '@/stores/user.js'
const userInfoStore = useUserInfoStore();
//从Pinia中获取是否能借阅的状态
const userInfo = ref()
userInfo.value = userInfoStore.info
console.log(userInfo.value.state)

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

//文章分类回显
//文章列表查询
import { getBookCategory } from '@/api/bookCategory.js'
const getBookCategoryList = async () => {
    //获取所有分类
    let resultC = await getBookCategory();
    categorys.value = resultC.data
    // console.log(resultC)
    console.log(categorys.value)
}
getBookCategoryList();


//文章列表查询
import { bookListService } from '@/api/book.js'
const getBooks = async () => {
    // console.log(categoryId.value)
    let params = {

        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value ? categoryId.value : null,
        title: title.value ? title.value : null,
        state: state.value ? state.value : null
    }
    let result = await bookListService(params);
    //渲染列表数据
    articles.value = result.data.items
    //为列表中添加categoryName属性
    for(let i=0;i<articles.value.length;i++){
        let article = articles.value[i];
        for(let j=0;j<categorys.value.length;j++){
            if(article.categoryId===categorys.value[j].id){
                article.categoryName=categorys.value[j].categoryName
            }
        }
    }
    //渲染总条数
    total.value=result.data.total
}
getBooks();

const dialogVisible = ref(false)
const dialogVisibleC = ref(false)
//添加表单数据模型
const articleModel = ref({
    title: '',
    categoryId: '',
    coverImg: '',
    content:'',
    state:''
})
import { ElMessage,ElMessageBox } from 'element-plus';
import '@vueup/vue-quill/dist/vue-quill.snow.css'

//清除数据模型中的数据
const remove = ()=>{
    articleModel.value.categoryId = ''
    articleModel.value.content = ''
    articleModel.value.coverImg = ''
    articleModel.value.title = ''
    articleModel.value.state = ''
}  

const borrowDetail = ref({
    
    bookNum:'',
    day:'',
    bookName:''
})



//导入借书接口
import {borrowBookService} from '@/api/borrow.js'

const showDialog=(row)=>{

    borrowDetail.value.bookName = row.title;
    borrowDetail.value.bookId = row.bookNum;
    if(userInfo.value.state === 2){
        ElMessageBox.alert('您已经被禁止借书，请联系管理员', '禁止借书', {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: 'OK',

  })
        dialogVisible.value = false
    }else{
        dialogVisible.value = true
    }
    
}


const rec = async() =>{
    console.log(borrowDetail.value)
    const res = await borrowBookService(borrowDetail.value)
    ElMessage.success(res.message ? res.message : '借书成功')
    dialogVisible.value = false
    getBooks();
}

const bookDetail =ref({
})

const visibleDrawerL = ref(false)
const showBookDetail = (row)=>{
    bookDetail.value.bookName = row.title
    bookDetail.value.category = row.categoryName
    bookDetail.value.location = row.location
    bookDetail.value.bookNum = row.bookNum
    bookDetail.value.coverImg = row.coverImg
    bookDetail.value.content = row.content
    visibleDrawerL.value = true

}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>找书借书</span>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline size="small">
            <el-form-item label="书名：">
                <el-input v-model="title"></el-input>
            </el-form-item>
            <el-form-item label="书籍分类：" >
                <el-select placeholder="请选择" v-model="categoryId" style="width:200px">
                    <el-option 
                        v-for="c in categorys" 
                        :key="c.id" 
                        :label="c.categoryName"
                        :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发布状态：">
                <el-select placeholder="请选择" v-model="state" style="width:200px">
                    <el-option label="已发布" value="已发布" ></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getBooks">搜索</el-button>
                <el-button @click="categoryId='';state='',getBooks()">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="articles" style="width: 100%" height="390" :show-header="true">
            <el-table-column fixed="" label="书籍名称" width="200" prop="title" align="center"></el-table-column>
            <el-table-column label="封面" prop="coverImg" align="center">
                <template #default="scope">
                        <el-image :src="scope.row.coverImg" style="height: 60px;width: 60px;"></el-image>
                    </template>
             </el-table-column>
            <el-table-column label="分类" prop="categoryName" align="center"></el-table-column>
            <el-table-column label="位置" prop="location" align="center"> </el-table-column>
            <el-table-column label="书号" prop="bookNum" align="center"> </el-table-column>
            <el-table-column label="状态" prop="state" align="center"></el-table-column>
            <el-table-column label="操作" width="100" align="center">
                <template #default="{ row }">
                    <el-button  circle plain type="primary" @click="showDialog(row)" v-if="row.state === '可借阅'">借书</el-button>
                    <el-button :icon="Collection" circle plain type="primary" @click="showBookDetail(row)"></el-button>

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

    <el-dialog v-model="dialogVisibleC" title="书籍内容简介" width="500">
            <el-form :model="bookContent" label-width="100px" style="padding-right: 30px">
        <el-form-item label="图书名称">
            <el-input type="textarea" v-model="bookContent"  disabled autosize></el-input>
        </el-form-item>
            </el-form>


    <br>
    <br>
    <br>
    <template #footer>
        <span class="dialog-footer">
            <!-- <el-button @click="dialogVisible = false;remove()">取消</el-button> -->
            <el-button type="primary" @click="dialogVisibleC = false"> 确认 </el-button>
        </span>
    </template>
</el-dialog>


    <el-dialog v-model="dialogVisible" title="借书" width="500">
    <el-form :model="borrowDetail" label-width="100px" style="padding-right: 30px">
        <el-form-item label="图书名称">
            <el-input v-model="borrowDetail.bookName" minlength="1" maxlength="10" disabled></el-input>
        </el-form-item>
        <el-form-item label="借书时长(天)" prop="day">
            <el-select v-model="borrowDetail.day" placeholder="请选择">
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

    <!-- 抽屉 -->
    <el-drawer v-model="visibleDrawerL" title="书籍信息" direction="rtl" size="50%">
            <!-- 添加文章表单 -->
            <el-form :model="bookDetail" label-width="100px" >
                <el-form-item label="书籍标题" >
                    <el-input v-model="bookDetail.bookName" placeholder="请输入标题" disabled></el-input>
                </el-form-item>
                <el-form-item label="书籍分类">
                    
                    <el-input v-model="bookDetail.category" placeholder="请输入书号" disabled></el-input>
                </el-form-item>
                <el-form-item label="位置" >
                    <el-input v-model="bookDetail.location" placeholder="请输入位置" disabled></el-input>
                </el-form-item>
                <el-form-item label="书号" >
                    <el-input v-model="bookDetail.bookNum" placeholder="请输入书号" disabled></el-input>
                </el-form-item>
                <el-form-item label="书籍封面">

                        <img  :src="bookDetail.coverImg" class="avatar" style="height: 60px; width: 60px;"/>
                </el-form-item>
                <el-form-item label="书籍简介">
                        <el-input type="textarea" v-model="bookDetail.content" disabled rows="10"></el-input>
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

.el-dialog {
    margin-top: 9vh !important;
    margin-bottom: 8vh !important;
    overflow: auto;
}
</style>