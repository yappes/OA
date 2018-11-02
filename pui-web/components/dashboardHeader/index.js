import DashboardHeader from './src/dashboardHeader.vue';

/* istanbul ignore next */
DashboardHeader.install = function(Vue) {
  Vue.component(DashboardHeader.name, DashboardHeader);
};

export default DashboardHeader;