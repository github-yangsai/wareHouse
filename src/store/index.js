import Vue from 'vue';
import vuex from 'vuex';

// import warehouse from './modules/wareHouse'; //仓库管理

Vue.use(vuex);
let modules = {
	// warehouse
};
const Store = new vuex.Store({
  modules
});

export default Store
