import launchProcessAll from './src/launchProcessAll.vue';

/* istanbul ignore next */
launchProcessAll.install = function(Vue) {
  Vue.component(launchProcessAll.name,launchProcessAll);
};

export default launchProcessAll;

