import DashboardContent from './src/dashboardContent.vue';

/* istanbul ignore next */
DashboardContent.install = function(Vue) {
  Vue.component(DashboardContent.name, DashboardContent);
};

export default DashboardContent;