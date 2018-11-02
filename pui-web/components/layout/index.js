import PuiLayout from './src/layout.vue';

/* istanbul ignore next */
PuiLayout.install = function(Vue) {
  Vue.component(PuiLayout.name, PuiLayout);
};

export default PuiLayout;
