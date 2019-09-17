import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import mainFrame from '@/views/mainFrame'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      name: 'mainFrame',
      component: mainFrame
    }
  ]
})
