export interface UserInfo {
  id?: number
  username: string
  nickname?: string
  email?: string
  userPic?: string
  type: number      // 1=admin, 2=regular
  state: number     // 1=can borrow, 2=banned
  msg?: string | null
}

export interface LoginData {
  username: string
  password: string
  repassword?: string
  mail?: string
  code?: string
}

export interface RegisterData {
  username: string
  password: string
  repassword: string
  mail: string
  code: string
  type?: string
}

export interface UserListParams {
  pageNum: number
  pageSize: number
  username?: string | null
  state?: string | null
}
