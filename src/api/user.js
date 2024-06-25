//导入 request.js工具
import request from '@/utils/request.js'


//提供调用注册的接口的函数
export const useRegisterService = (registerData)=>{
    //借助于UrlSearchParams传递
    const params = new URLSearchParams()
    for(let key in registerData){
        params.append(key,registerData[key])
    }
    return request.post('/user/register',params);
    
}

//提供登录接口的函数
export const userLoginService = (LoginData)=>{
    const params = new URLSearchParams()
    for(let key in LoginData){
        params.append(key,LoginData[key])
    }
    return request.post('/user/login',params)
}


//获取个人信息
export const userInfoGetService = ()=>{
    return request.get('/user/userInfo');
}

//修改个人信息
export const userInfoUpdateService = (userInfo)=>{
    return request.put('/user/update',userInfo)
}

//修改头像
export const userAvatarUpdateService=(avatarUrl)=>{
    let params = new URLSearchParams();
    params.append('avatarUrl',avatarUrl)
    return request.patch('/user/updateAvatar',params)
}

//发送验证码
export const sendMailCon=(mail)=>{
    return request.get('/user/sendmail?mail='+mail)
}

//修改密码
export const resetPsw = (params)=>{
    return request.patch('/user/updatePwd',params)
}

//获取用户借阅记录
export const getBorrowRecordInfoService =(userId)=>{
    return request.get('/user/userInfoForborrow?userId='+userId)
}
//获得用户列表
export const getUserListService = (params)=>{
    return request.get('/user/getUserList',{params : params})
}
//编辑学生信息
export const editUserService = (params)=>{
    return request.patch('/user/editUser',params)
}
//变更用户借阅状态
export const upgradeUserStateService = (id,state)=>{
    return request.get('/user/upgradeUserState?id='+id+'&state='+state)
}
//催促还书接口
export const urge = (id)=>{
    return request.get('/borrow/urge?id='+id)
}
//删除提示
export const deleteMsgService = ()=>{
    return request.get('/user/deleteUserMsg')
}
//检验登录
export const checkLogin=()=>{
    return request.get('/user/check')
}
//删除用户
export const deleteUserService=(id)=>{
    return request.get('/user/deleteUser?id='+id)
}

export const getUserNumService=()=>{
    return request.get('/user/getUserNumService')
}

export const editPswByEmailService=(LoginData)=>{
    const params = new URLSearchParams()
    for(let key in LoginData){
        params.append(key,LoginData[key])
    }
    return request.post('/user/editPswByEmail',params)
}

export const getBookNumService=()=>{
    return request.get('/article/getBookNumService')
}

export const getAllBorrowNumServie=()=>{
    return request.get('/borrow/getAllBorrowNum')
}

export const getBookNumUseService=()=>{
    return request.get('/article/getBookNumUseService')}

export const getMyRecordNumService=()=>{
    return request.get('/borrow/getMyRecordNumService')
}