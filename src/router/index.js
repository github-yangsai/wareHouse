import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'
import Login from '@/views/login'
import mainFrame from '@/views/mainFrame'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'App',
      component: App,
      children: [
        {
          path: '/login',
          name: 'Login',
          component: Login,
          meta: {
            title: '智慧仓库管理后台登录'
          }
        },
        {
          path: '/',
          name: 'mainFrame',
          meta: {
            requireAuth: true, // 判断是否需要登录
            title: '智慧仓库管理后台'
          },
          component: mainFrame
        }
      ]
    },
  ]
})
