import DashboardChart from './src/dashboardChart.vue';

/* istanbul ignore next */
DashboardChart.install = function(Vue) {
  Vue.component(DashboardChart.name, DashboardChart);
};

export default DashboardChart;