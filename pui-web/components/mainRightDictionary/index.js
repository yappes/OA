import PuiMainRightDictionary from './src/mainRightDictionary.vue';

/* 为避免冲突自己新加了PuiMainRight组件后续需要统一 */
PuiMainRightDictionary.install = function(Vue) {
  Vue.component(PuiMainRightDictionary.name, PuiMainRightDictionary);
};

export default PuiMainRightDictionary;
