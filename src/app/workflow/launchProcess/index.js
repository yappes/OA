import launchProcess from './src/launchProcess.vue';

/* istanbul ignore next */
launchProcess.install = function(Vue) {
  Vue.component(launchProcess.name,launchProcess);
};

export default launchProcess;

