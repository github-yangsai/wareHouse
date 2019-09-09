import Vue from 'vue';
import vuex from 'vuex';

// import warehouse from './modules/wareHouse'; //仓库管理

Vue.use(vuex);
// let modules = {
// 	// warehouse
// };
const Store = new vuex.Store({
  state:{
    areaFlag:false
  },
  mutations:{
    changeAreaFlag(state,val){
      state.areaFlag = val;
    }
  },
  actions:{
  }
});

export default Store
