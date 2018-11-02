import PuiMainRight from './src/mainRight.vue';

/* 为避免冲突自己新加了PuiMainRight组件后续需要统一 */
PuiMainRight.install = function(Vue) {
  Vue.component(PuiMainRight.name, PuiMainRight);
};

export default PuiMainRight;
