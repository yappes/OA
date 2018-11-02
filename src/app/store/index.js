import Vue from 'vue'
import Vuex from 'vuex'
import adminNav from './modules/adminNav'
import modulesSetting from './modules/modulesSetting'
import userSelectByOrg from './modules/userSelectByOrg'
import dictionary from './modules/dictionary'
import menuSetting from './modules/menuSetting'
import asideHeight from './modules/asideHeight'
import messageTop from './modules/message-top'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    adminNav,
    modulesSetting,
    userSelectByOrg,
    dictionary,
    menuSetting,
    asideHeight,
    messageTop,
  }
})