import PuiNavLeft from './src/navLeft.vue';

/* 为避免冲突自己新加了PuiNavLeft组件后续需要统一 */
PuiNavLeft.install = function(Vue) {
  Vue.component(PuiNavLeft.name, PuiNavLeft);
};

export default PuiNavLeft;
