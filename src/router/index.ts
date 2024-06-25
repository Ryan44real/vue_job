import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Layout from '../views/Layout.vue'
import ArticleCategory from '@/views/article/ArticleCategory.vue'
import ArticleManage from '@/views/article/ArticleManage.vue'
import UserAvatar from '@/views/user/UserAvatar.vue'
import UserInfo from '@/views/user/UserInfo.vue'
import UserResetPassword from '@/views/user/UserResetPassword.vue'
import BorrowBooks from '@/views/borrow/BorrowBooks.vue'
import BorrowRecordManage from '@/views/borrow/BorrowRecordManage.vue'
import MyborrowRecord from '@/views/borrow/MyborrowRecord.vue'
import MyLayout from '@/views/MyLayout.vue'
import userMain from '@/views/userpage/userMain.vue'
import RenewalManage from '@/views/borrow/RenewalManage.vue'
import UserManage from '@/views/user/UserManage.vue'
import DashShow from '@/views/DashShow.vue'
import photoTest from '@/views/userpage/photoTest.vue'
import Test from '@/views/userpage/Test.vue'
import visiter from '@/views/userpage/visiter.vue'

const routes =[
    {path: '/visiter',component:visiter},
    {path: '/login',component:Login},
    {path: '/Test',component:Test},
    {path:'/MyLayout',
    component:MyLayout,redirect:'/userMain',    //固定展示首页
    children:[
        {path: '/borrow/borrowBook',component:BorrowBooks},
        {path:'/borrow/Myborrow',component:MyborrowRecord},
        {path:'/userMain',component:userMain},
        {path:'/user/in',component:UserInfo},
        {path:'/user/ava',component:UserAvatar},
        {path:'/user/resetPSW',component:UserResetPassword},
        {path:'/photoTest',component:photoTest},
    ]},

    {path: '/',
    component:Layout,redirect:'/dashshow',//re。。。是指默认显示页面，当访问/时，自动跳转到
    children:[
        {path: '/article/category',component:ArticleCategory},
        {path: '/dashshow',component:DashShow},
        {path: '/borrow/borrowBooks',component:BorrowBooks},
        {path:'/user/info',component:UserInfo},
        {path:'/user/avatar',component:UserAvatar},
        {path:'/user/resetPassword',component:UserResetPassword},
        {path:'/borrow/borrowRecordManage',component:BorrowRecordManage},
        {path:'/article/manage',component:ArticleManage},
        {path:'/borrow/MyborrowRecord',component:MyborrowRecord},
        {path:'/borrow/RenewalManage',component:RenewalManage},
        {path:'/user/UserManage',component:UserManage},
        
    ]}

]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router
