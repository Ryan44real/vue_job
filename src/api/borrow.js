import request from '@/utils/request.js'

export const borrowBookService = (params)=>{
    return request.get('/borrow/borrowBook',{params : params})
}

export const borrowRecordListService = (params)=>{
    return request.get('/borrow/getRecord',{params : params})
}

export const returnBook = (bookNum)=>{
    return request.post('/borrow/returnBook?bookNum='+bookNum)
}

export const applyRenewalService = (params)=>{
    return request.get("/borrow/applyRenewal",{params : params})
}

export const getApplyRenewalListService = (params)=>{
    return request.get('/borrow/getApplyRenewalList',{params : params})
}

export const passApplyService = (params)=>{
    return request.get('/borrow/passApply',{params : params})
}

export const rejectApplyService = (id)=>{
    return request.get('/borrow/rejectApply?id='+id)
}

export const send= (res)=>{
    const params = new URLSearchParams()
    for(let key in res){
        params.append(key,res[key])
    }
    return request.post("/borrow/editRecord",params)
}