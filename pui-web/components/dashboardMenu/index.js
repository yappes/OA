import DashboardMenu from './src/dashboardMenu.vue';

/* istanbul ignore next */
DashboardMenu.install = function(Vue) {
  Vue.component(DashboardMenu.name, DashboardMenu);
};

export default DashboardMenu;