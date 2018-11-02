import DashboardCustomComponent from './src/dashboardCustomComponent.vue';

/* istanbul ignore next */
DashboardCustomComponent.install = function(Vue) {
  Vue.component(DashboardCustomComponent.name, DashboardCustomComponent);
};

export default DashboardCustomComponent;