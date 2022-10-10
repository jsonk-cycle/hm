import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import Layout from '@/views/Layout'
import Home from '@/views/Home'
import User from '@/views/User'
import Search from '@/views/Search'
import SearchResult from '@/views/Search/SearchResult'
import ArticleDetail from '@/views/ArticleDetail'
import UserEdit from '@/views/User/UserEdit'
import Chat from '@/views/Chat'

// 使用的是对应的vue - route,添加路由规则
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home' // 默认显示layout的首页
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/layout',
    component: Layout,
    // 设置子路由
    children: [
      {
        path: 'home',
        component: Home
      },
      {
        path: 'user',
        component: User
      }
    ]
  },
  {
    path: '/search',
    component: Search
  },
  // 搜索的结果页面
  {
    path: '/search_result/:kw',
    component: SearchResult
  },
  { // 文章的详情页
    path: '/detail',
    component: ArticleDetail
  },
  {
    path: '/user_edit',
    component: UserEdit
  },
  {
    path: '/chat',
    component: Chat
  }
]

const router = new VueRouter({
  routes
})

export default router
