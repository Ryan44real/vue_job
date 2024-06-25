import request from '@/utils/request.js'


//文章列表查询
export const bookListService = (params) => {
    return request.get('/article/getBookList', { params: params })
}

export const bookAddService = (articleModel)=>{
    return request.post('/article',articleModel)
}

export const BookDetailService = (id)=>{
    return request.get('/article/detail?id='+id)
}

export const bookUpdateService = (articleModel)=>{
    return request.put('/article',articleModel)
}

export const bookDeleteService = (id)=>{
    return request.delete('/article?id='+id)
}
    
export const AiContent =(bookName,Isbn)=>{
    return request.get('/article/getBookContent?bookName='+bookName+'&bookNum='+Isbn)
}

export const getBookBarcode =(base64)=>{
    return request.get('/article/getBookBarcode?base64='+base64)
}

export const buildBookNumService =(isbn)=>{
    return request.get('/article/buildBookNumService?isbn='+isbn)
}

export const getBookBarcodeByPy =()=>{
    return request.get('/article/getBookBarcodeByPy')
}

export const buildQrCodeService =(isbn)=>{
    return request.get('/article/buildQrCode?isbn='+isbn)
}