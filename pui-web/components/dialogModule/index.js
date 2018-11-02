import DialogModule from './src/dialog-module.vue';

/* istanbul ignore next */
DialogModule.install = function(Vue) {
  Vue.component(DialogModule.name, DialogModule);
};

export default DialogModule;
