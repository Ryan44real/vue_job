import request from '@/utils/request'

export const borrowBookService = (params: any) => {
    return request.get('/borrow/borrowBook', { params: params })
}

export const borrowRecordListService = (params: any) => {
    return request.get('/borrow/getRecord', { params: params })
}

export const returnBook = (userId: number, bookNum: string) => {
    return request.post('/borrow/returnBook', null, { params: { userId, bookNum } })
}

export const applyRenewalService = (params: any) => {
    return request.get("/borrow/applyRenewal", { params: params })
}

export const getApplyRenewalListService = (params: any) => {
    return request.get('/borrow/getApplyRenewalList', { params: params })
}

export const passApplyService = (params: any) => {
    return request.get('/borrow/passApply', { params: params })
}

export const rejectApplyService = (id: any) => {
    return request.get('/borrow/rejectApply?id=' + id)
}

export const send = (res: any) => {
    const params = new URLSearchParams()
    for (let key in res) {
        params.append(key, res[key])
    }
    return request.post("/borrow/editRecord", params)
}
