import PuiPagination from './src/pagination.vue';

/* istanbul ignore next */
PuiPagination.install = function(Vue) {
  Vue.component(PuiPagination.name, PuiPagination);
};

export default PuiPagination;
