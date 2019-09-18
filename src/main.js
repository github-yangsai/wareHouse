// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import axios from 'axios'
import store from './store';
import api from '@/common/api/index.js'
import utils from "./common/utils/utils.js";
import 'iview/dist/styles/iview.css'
import '../static/css/common.css'

Vue.use(iView);
// Vue.use(axios);
Vue.prototype.$axios = axios; // 将api挂载到vue的原型上

Vue.config.productionTip = false
Vue.prototype.$api = api; // 将api挂载到vue的原型上
Vue.prototype.$utils = utils;

router.beforeEach((to, from, next) => {
  /* 页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  debugger
  if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录权限
    if (utils.cookies.getItem('token')) { // 判断当前的token是否存在 ； 登录存入的token
      next();
    }
    else {
      next({
        path: '/login',
      })
    }
  }
  else {
    next();
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
