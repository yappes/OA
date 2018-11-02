import initImport from './config.js'
import Vue from 'vue'

import Login from './login.vue';

new Vue({
  el: '#app',
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
      return h(Login)
    } else {
      return h('div')
    }
  }
})