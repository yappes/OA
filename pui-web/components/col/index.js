import PuiCol from './src/col.vue';

/* istanbul ignore next */
PuiCol.install = function(Vue) {
  Vue.component(PuiCol.name, PuiCol);
};

export default PuiCol;
