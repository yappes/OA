import DashboardCommon from './src/dashboardCommon.vue';

/* istanbul ignore next */
DashboardCommon.install = function(Vue) {
  Vue.component(DashboardCommon.name, DashboardCommon);
};

export default DashboardCommon;