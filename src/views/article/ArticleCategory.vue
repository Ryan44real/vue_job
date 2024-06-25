<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
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

import {getBookCategory,bookCategoryAddService,bookCategoryUpdateService,bookCategoryDeleteService} from '@/api/bookCategory.js'

const getBook = async ()=>{
    let result = await getBookCategory()
    categorys.value = result.data
}
//自动调用，也可以放在onmounted下
getBook();


//控制添加分类弹窗
const dialogVisible = ref(false)

//添加分类数据模型
const categoryModel = ref({
    categoryName: '',
    categoryAlias: ''
})
//添加分类表单校验
const rules = {
    categoryName: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
    ],
    categoryAlias: [
        { required: true, message: '请输入分类别名', trigger: 'blur' },
    ]
}
import { ElMessage,ElMessageBox } from 'element-plus';
//添加分类
const addCategory = async()=>{
    
    let result = await bookCategoryAddService(categoryModel.value)
    ElMessage.success(result.msg ? result.msg:'添加成功')

    //获取所有文章分类
    
    dialogVisible.value=false
    getBook();
}
const remove = ()=>
{
    categoryModel.value.categoryAlias=''
    categoryModel.value.categoryName=''
}

//定义标题
const title = ref('')

//展示编辑弹窗
const showDialog = (row)=>{
    dialogVisible.value=true;
    title.value='编辑分类'
    //数据拷贝
    categoryModel.value.categoryAlias = row.categoryAlias
    categoryModel.value.categoryName = row.categoryName
    //扩展数据模型的属性 id，将来需要传递给后台，完成分类的修改
    //行id与数据库中的id不一样
    categoryModel.value.id = row.id
}

const updateCategory = async()=>{
    //调用接口
    let result = await bookCategoryUpdateService(categoryModel.value)

    ElMessage.success(result.message ? result.message:'修改成功')

    dialogVisible.value=false;

    getBook();
}


    //删除分类  给删除按钮绑定事件
    const deleteCategory = (row) => {
    ElMessageBox.confirm(
        '你确认删除该分类信息吗？',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            //用户点击了确认
            let result = await bookCategoryDeleteService(row.id)
            ElMessage.success(result.message?result.message:'删除成功')
            getBook()
        })
        .catch(() => {
            //用户点击了取消
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}
</script>

<template>
  <el-card class="page-container" style="padding: 10px;">
    <!-- <div class="home" style ="padding: 10px">  -->
        <template #header>
            <div class="header">
                <span>图书分类</span>
                <div class="extra">
                    <el-button type="primary" @click="dialogVisible = true;title='添加分类';remove()">添加分类</el-button>
                </div>
            </div>
        </template>
        <el-table :data="categorys" style="width: 100%" height="390">
            <!-- type="index"指的是在页面上的排序的序号，并不是数据库中的id的123456 prop="id"-->
            <el-table-column fixed="" label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="分类名称" prop="categoryName"></el-table-column>
            <el-table-column label="分类别名" prop="categoryAlias"></el-table-column>
            <el-table-column label="操作" width="100">
                <!-- 槽函数row,返回该行的数据 -->
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteCategory(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
    <!-- </div> -->
    </el-card>

    <!-- 添加分类弹窗 -->
<el-dialog v-model="dialogVisible" :title="title" width="30%">
    <el-form :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="分类名称" prop="categoryName">
            <el-input v-model="categoryModel.categoryName" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="categoryAlias">
            <el-input v-model="categoryModel.categoryAlias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false;remove()">取消</el-button>
            <el-button type="primary" @click="title== '添加分类' ? addCategory() : updateCategory()"> 确认 </el-button>
        </span>
    </template>
</el-dialog>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;
    padding: 10px !important;
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>