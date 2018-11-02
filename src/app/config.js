// 兼容IE 11浏览器
import reboot from 'paas-web-utils/common/reboot';
import 'url-search-params-polyfill';
reboot();

import Vue from 'vue'
import aui from 'aui';
import 'aui-theme';
import Pui from 'pui'
import axios from 'paas-web-utils/common/http';

Vue.config.productionTip = false

//引入状态管理
// Vue.use(Vuex);
//启动并注册赞同PC组件
Vue.use(aui, {
  size: 'medium'
})
//启动并注册企业PAAS组件
Pui.install(Vue)

const httpConf = {
  profile: process.env.NODE_ENV || 'development',
  development: 'http://139.198.3.73:8088/',
  // development: 'http://192.9.200.157:8088/',
  // production: 'http://192.9.200.157:8088/',
  production: 'http://139.198.3.73:8088/',

  // development: 'http://192.168.60.53:8080/',
  // production: 'http://192.168.60.53:8080/',

  // development: 'http://192.9.200.173:8088/',
  // production: 'http://192.9.200.173:8088/',

}

const confirmSessionnTimeout = function () {
  confirmSessionnTimeout.status = true
  let $aui = Vue.prototype.$aui;
  return $aui.confirm.show(`会话超时，请重新登录.`, ' 提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'error'
  }).then(() => {
    window.location.href = 'login.html'
  }).finally(function () {
    confirmSessionnTimeout.status = false
  })
}

const appKey = window.sessionStorage.getItem('paas:cloud:platform:appKey')

//注册axios
Vue.use(axios, {
  profile: httpConf.profile,
  baseURL: httpConf[httpConf.profile],
  mapping: {
    'platform': `rpcServer/afa4j/${appKey}/`, //业务服务
    'user': `rpcServer/user/${appKey}`, //当前用户
    'workflow': `workflow/`, //工作流
    'file': `zuul/file/`, //文件上传
    'message': `message/` // 消息
  },
  statusCode: {
    401: function (resp) {
      // 删除无效应用Key
      window.sessionStorage.removeItem('paas:cloud:platform:appKey')
      if (!confirmSessionnTimeout.status) {
        confirmSessionnTimeout()
      }
    },
    404: function (resp) {
      let $aui = Vue.prototype.$aui;
      console.error(`请求接口\`${resp.config.url}\`,不存在.`)
      $aui.notify.show.error({
        title: '错误',
        message: `服务接口不存在，F12查看详情请`
      });
    },
    500: function (resp) {
      let message = typeof resp.data === "object" ? resp.data.message : resp.message;
      let $aui = Vue.prototype.$aui;
      $aui.notify.show.error({
        title: '错误',
        message: message
      });
    }
  }
});


export default axios.getURL('platform://')
