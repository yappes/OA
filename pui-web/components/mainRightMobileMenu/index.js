import PuiMainRightMobileMenu from './src/mainRightMobileMenu.vue';

/* 为避免冲突自己新加了PuiMainRight组件后续需要统一 */
PuiMainRightMobileMenu.install = function(Vue) {
  Vue.component(PuiMainRightMobileMenu.name, PuiMainRightMobileMenu);
};

export default PuiMainRightMobileMenu;
