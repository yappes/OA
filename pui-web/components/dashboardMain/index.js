import DashboardMain from './src/dashboardMain.vue';

/* istanbul ignore next */
DashboardMain.install = function(Vue) {
  Vue.component(DashboardMain.name, DashboardMain);
};

export default DashboardMain;