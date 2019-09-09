// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import axios from 'axios'
import store from './store';
import api from '@/common/api/index.js'
import 'iview/dist/styles/iview.css'
import '../static/css/common.css'

Vue.use(iView);
Vue.use(axios);

Vue.config.productionTip = false
Vue.prototype.$api = api; // 将api挂载到vue的原型上

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
