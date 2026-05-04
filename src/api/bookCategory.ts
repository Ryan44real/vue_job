import request from '@/utils/request'

//获取文章分类列表（无需认证，见 API 文档 5.2）
export const getBookCategory = () => {
    return request.get('/category/query')
}

//文章分类接口
export const bookCategoryAddService = (categoryModel: any) => {
    return request.post('/category/add', categoryModel)
}

//文章分类修改
export const bookCategoryUpdateService = (categoryData: any) => {
    return request.put('/category', categoryData)
}

//删除分类
export const bookCategoryDeleteService = (id: any) => {
    return request.delete('/category?id=' + id)
}
