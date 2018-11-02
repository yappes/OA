import PuiAvatar from './src/avatar.vue';

/* istanbul ignore next */
PuiAvatar.install = function(Vue) {
  Vue.component(PuiAvatar.name, PuiAvatar);
};

export default PuiAvatar;
