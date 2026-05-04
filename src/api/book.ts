import request from '@/utils/request'

//文章列表查询
export const bookListService = (params: any) => {
    return request.get('/article/getBookList', { params: params })
}

export const bookAddService = (articleModel: any) => {
    return request.post('/article', articleModel)
}

export const BookDetailService = (id: any) => {
    return request.get('/article/detail?id=' + id)
}

export const bookUpdateService = (articleModel: any) => {
    return request.put('/article', articleModel)
}

export const bookDeleteService = (id: any) => {
    return request.delete('/article?id=' + id)
}

export const AiContent = (bookName: any, Isbn: any) => {
    return request.get('/article/getBookContent?bookName=' + bookName + '&bookNum=' + Isbn)
}

export const getBookBarcode = (base64: any) => {
    return request.get('/article/getBookBarcode?base64=' + base64)
}

export const buildBookNumService = (isbn: any) => {
    return request.get('/article/buildBookNumService?isbn=' + isbn)
}

export const getBookBarcodeByPy = () => {
    return request.get('/article/getBookBarcodeByPy')
}

export const buildQrCodeService = (isbn: any) => {
    return request.get('/article/buildQrCode?isbn=' + isbn)
}
