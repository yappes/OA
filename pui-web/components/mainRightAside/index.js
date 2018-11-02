import PuiMainRightAside from './src/mainRightAside.vue';

/* 为避免冲突自己新加了PuiMainRight组件后续需要统一 */
PuiMainRightAside.install = function(Vue) {
  Vue.component(PuiMainRightAside.name, PuiMainRightAside);
};

export default PuiMainRightAside;
