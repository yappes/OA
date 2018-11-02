import PuiListGrid from './src/listGrid.vue';

/* istanbul ignore next */
PuiListGrid.install = function(Vue) {
  Vue.component(PuiListGrid.name, PuiListGrid);
};

export default PuiListGrid;
