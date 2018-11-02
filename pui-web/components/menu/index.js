import PuiMenu from './src/menu.vue';

/* istanbul ignore next */
PuiMenu.install = function(Vue) {
  Vue.component(PuiMenu.name, PuiMenu);
};

export default PuiMenu;
