import request from '@/utils/request.js'
import {useTokenStore} from '@/stores/token.js'

//获取文章分类列表
export const getBookCategory=()=>{
    const tokenStore = useTokenStore()
    return request.get('/category/query',{Headers:{'Authorization':tokenStore.token}});
}

//文章分类接口
export const bookCategoryAddService = (categoryModel)=>{
    return request.post('/category/add',categoryModel)
}

//文章分类修改
export const bookCategoryUpdateService = (categoryData)=>{
    return request.put('/category',categoryData)
}

//删除分类
export const bookCategoryDeleteService = (id) => {
    return request.delete('/category?id='+id)
}