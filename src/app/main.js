import initImport from './config.js'
import Vue from 'vue'
// import Vuex from 'vuex';
import store from './store';
import Router from 'vue-router';
import App from './App.vue';
import routes from './router';
import axios from 'paas-web-utils/common/http';

import VCharts from 'v-charts'
Vue.use(VCharts);


//注册路由
Vue.use(Router);

const router = new Router({
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  let token = axios.getToken()
  if(!to || to.fullPath == '' || to.fullPath == '/'){
    next()
  } else if(!token && to.name !== 'login'){
    axios.confirm()
  } else {
    next()
  }
})

new Vue({
  el: '#app',
  store,
  router,
  data(){
    return {
      initStatus: false
    }
  },
  mounted() {
    this.$aui.loading.show()
    initImport.then(() => {
      this.initStatus = true
      this.$nextTick(() => {
        this.$aui.loading.hide();
      })
    })
  },
  render(h){
    if(this.initStatus){
      return h(App)
    } else {
      return h('div')
    }
  }
})