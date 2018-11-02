import PuiMainRightMenu from './src/mainRightMenu.vue';

/* 为避免冲突自己新加了PuiMainRight组件后续需要统一 */
PuiMainRightMenu.install = function(Vue) {
  Vue.component(PuiMainRightMenu.name, PuiMainRightMenu);
};

export default PuiMainRightMenu;
