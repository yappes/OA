import DashboardList from './src/dashboardList.vue';

/* istanbul ignore next */
DashboardList.install = function(Vue) {
  Vue.component(DashboardList.name, DashboardList);
};

export default DashboardList;