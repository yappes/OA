import checkPending from './src/checkPending.vue';

/* istanbul ignore next */
checkPending.install = function(Vue) {
  Vue.component(checkPending.name, checkPending);
};

export default checkPending;
