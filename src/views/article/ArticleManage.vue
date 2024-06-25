<script setup>
import {
    Edit,
    Delete
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

//文章分类回显
//文章列表查询
import { getBookCategory } from '@/api/bookCategory.js'
const getBookCategoryList = async () => {
    //获取所有分类
    let resultC = await getBookCategory();
    categorys.value = resultC.data
    console.log(categorys.value)
}
getBookCategoryList();



//文章列表查询
import { buildQrCodeService,bookListService,bookAddService,BookDetailService,bookUpdateService,bookDeleteService,AiContent,getBookBarcodeByPy,buildBookNumService } from '@/api/book.js'
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
    console.log(articles.value)
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
import {Plus} from '@element-plus/icons-vue'
const visibleDrawer = ref(false)
const visibleDrawerL = ref(false)
//添加表单数据模型
const articleModel = ref({
    title: '',
    categoryId: '',
    coverImg: '',
    content:'',
    state:'',
    isbn:'',
    bookNum:'',
    location:'',
    publisher:'',
    isbnPhoto:''
})
import { ElMessage,ElMessageBox } from 'element-plus';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {useTokenStore} from '@/stores/token.js'
import { ElLoading } from 'element-plus'
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
    articleModel.value.location=''
    articleModel.value.publisher=''
    articleModel.value.isbn=''
    articleModel.value.bookNum=''
    articleModel.value.isbnPhoto=''
}  

//添加书籍
const addBook=async (state)=>{
    
    articleModel.value.state = state
    articleModel.value.content = articleModel.value.content.replace(/<[^>]+>/g,"");
    console.log(articleModel.value)
    let result = await bookAddService(articleModel.value);
    ElMessage.success(result.message? result.message:'添加成功')
    //再次调用getArticles,获取文章
    getBooks()
    //隐藏抽屉
    visibleDrawer.value=false
}

//打开Py摄像头获得ISBN
const getBookIsbnByPy = async()=>{
    const loadingInstance = ElLoading.service({
        lock: true,
        text: '正在识别中，请稍等',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    let result = await getBookBarcodeByPy()
    articleModel.value.isbn = result.data
    loadingInstance.close()
}

//编辑书籍
//获取当前行书籍的信息
const bookDetail = async(id)=>{
    console.log("sss"+id)
    let result = await BookDetailService(id);
    articleModel.value = result.data
}
const updateBookDetail = async() => {
    let res = await bookUpdateService(articleModel.value)
    ElMessage.success(res.message? res.message:'修改成功')
    getBooks();
    visibleDrawerL.value=false;
}





//删除书籍信息
const deleteBookTC = (row) => {
    ElMessageBox.confirm(
        '你确认删除该书籍信息吗？',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            //用户点击了确认
            let result = await bookDeleteService(row.id);
            ElMessage.success(result.message? result.message:'删除成功')
            getBooks();
        })
        .catch(() => {
            //用户点击了取消
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}
const childCount = ref(0)
import Test from '@/views/userpage/Test.vue'
import photoTest from '@/views/userpage/photoTest.vue'
const getSonValue = (value) => {
    articleModel.value.isbn = value
    console.log(value)
    console.log(articleModel.value.isbn)
}
const fullscreenLoading = ref(false)
const innerDrawer =ref(false)
const innerDrawer2 =ref(false)
//AI总结书籍内容简介
const GptContent= async (bookName,Isbn)=>{
    // articleModel.value.content=bookName
    const res = await AiContent(bookName,Isbn)
    console.log(res)
    articleModel.value.content = res.data
    // fullscreenLoading.value=true
}

const bulidbarcode = async()=>{
    let result = await buildBookNumService(articleModel.value.isbn)
    articleModel.value.bookNum = result.data
    let res = await buildQrCodeService(articleModel.value.bookNum)
    articleModel.value.isbnPhoto = res.data
}

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>书籍管理</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer = true;remove();">添加书籍</el-button>
                </div>
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
                <el-button @click="categoryId='';state='',title='',getBooks()">重置</el-button>
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
            <el-table-column label="出版社" prop="publisher" align="center"></el-table-column>
            <el-table-column label="分类" prop="categoryName" align="center"></el-table-column>
            <el-table-column label="位置" prop="location" align="center"> </el-table-column>
            <el-table-column label="ISBN" prop="isbn" align="center"> </el-table-column>
            <el-table-column label="状态" prop="state" align="center"></el-table-column>
            <el-table-column label="操作" width="100" align="center">
                <template #default="{ row }">
                    <!-- <el-button :icon="Edit" circle plain type="primary" @click="bookDetail(row.id);visibleDrawerL = true"></el-button> -->
                    <el-button :icon="Edit" circle plain type="primary" @click="bookDetail(row.id);visibleDrawerL = true"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteBookTC(row)"></el-button>
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
    <el-drawer v-model="visibleDrawerL" title="编辑书籍信息" direction="rtl" size="50%">
            <!-- 添加文章表单 -->
            <el-form :model="articleModel" label-width="100px" >
                <el-form-item label="书籍标题" >
                    <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="书籍分类">
                    <el-select placeholder="请选择" v-model="articleModel.categoryId">
                        <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="位置" >
                    <el-input v-model="articleModel.location" placeholder="请输入位置"></el-input>
                </el-form-item>
                <el-form-item label="书号" >
                    <el-input v-model="articleModel.bookNum" placeholder="请输入书号"></el-input>
                </el-form-item>
                <el-form-item label="ISBN" >
                    <el-input v-model="articleModel.isbn" placeholder="请输入书号"></el-input>
                </el-form-item>
                <el-row>

                <el-col :span="12">
                    <el-form-item label="书籍封面">
                    <!-- up-load组件会自动发送异步请求，绕过了我们的设定拦截器、pinia -->
                    <!-- auto-upload:是否自动上传action: 
                        服务器接口路径name: 
                        上传的文件字段名headers: 
                        设置上传的请求头on-success: 
                        上传成功的回调函数
 -->
                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false" action="/api/load"
                    name="file"
                    :headers="{'Authorization':tokenStore.token}"
                    :on-success="uploadSuccess">
                        <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="内部二维码">
                    <img v-if="articleModel.isbnPhoto " :src="articleModel.isbnPhoto" class="avatar" />
                </el-form-item>
                </el-col>
            </el-row>

                <el-form-item label="书籍简介">
                    <div class="editor">
                        <quill-editor
                            theme="snow"
                            v-model:content="articleModel.content"
                            contentType="html"
                            >
                        </quill-editor>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="updateBookDetail">修改</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>


    <!-- 抽屉 -->
    <el-drawer v-model="visibleDrawer" title="添加书籍" direction="rtl" size="50%" 
    v-loading.fullscreen.lock="fullscreenLoading">
            <!-- 添加文章表单 -->
            <el-form :model="articleModel" label-width="100px" >
                <el-form-item label="书籍标题" >
                    <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="书籍分类">
                    <el-select placeholder="请选择" v-model="articleModel.categoryId">
                        <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="书籍出版社" >
                    <el-input v-model="articleModel.publisher" placeholder="请输入出版社"></el-input>
                </el-form-item>
                <el-form-item label="位置" >
                    <el-input v-model="articleModel.location" placeholder="请输入位置"></el-input>
                </el-form-item>
                <el-form-item label="isbn">
                    <el-row>
                        <el-col :span="80">
                            <el-input v-model="articleModel.isbn"></el-input>
                        </el-col>
                        <el-col :span="12">
                            <el-button @click = "innerDrawer=true">摄像头拍照识别</el-button>
                        </el-col>
                        <el-col :span="12">
                            <el-button @click = "getBookIsbnByPy()">Py摄像头识别</el-button>
                        </el-col>

                    </el-row>
                </el-form-item>
                <el-form-item label="书号" >
                    <el-row>
                        <el-col :span="100">
                            <el-input v-model="articleModel.bookNum" placeholder="请输入书号"></el-input>
                        </el-col>
                        <el-col :span="2">
                            <el-button @click="bulidbarcode()">根据ISBN生成</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="书籍封面">
                    <!-- up-load组件会自动发送异步请求，绕过了我们的设定拦截器、pinia -->
                    <!-- auto-upload:是否自动上传action: 
                        服务器接口路径name: 
                        上传的文件字段名headers: 
                        设置上传的请求头on-success: 
                        上传成功的回调函数
-->
                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false" action="/api/load"
                    name="file"
                    :headers="{'Authorization':tokenStore.token}"
                    :on-success="uploadSuccess">
                        <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="书籍简介">
                        <el-button @click="GptContent(articleModel.title,articleModel.isbn)">AI智能总结</el-button>
                    <div class="editor">
                        <quill-editor
                            theme="snow"
                            v-model:content="articleModel.content"
                            contentType="html"
                            >
                        </quill-editor>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addBook('可借阅')">发布</el-button>
                    
                </el-form-item>
            </el-form>
        </el-drawer>
        <el-drawer
        v-model="innerDrawer"
        title="摄像头识别"
        :append-to-body="true"
        :before-close="handleClose"
      >
       <Test @getValue="getSonValue"></Test>
       <!-- <photoTest></photoTest> -->
      </el-drawer>
      <el-drawer
        v-model="innerDrawer2"
        title="摄像头识别"
        :append-to-body="true"
        :before-close="handleClose"
      >

      </el-drawer>
</template>
<style lang="scss" scoped>
::v-deep .el-form-item__label {
white-space: nowrap;
}

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