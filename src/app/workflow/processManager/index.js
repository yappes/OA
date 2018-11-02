import processManager from './src/processManager.vue';

/* istanbul ignore next */
processManager.install = function(Vue) {
  Vue.component(processManager.name, processManager);
};

export default processManager;