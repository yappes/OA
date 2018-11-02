import checked from './src/checked.vue';

/* istanbul ignore next */
checked.install = function(Vue) {
  Vue.component(checked.name, checked);
};

export default checked;