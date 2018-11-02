import launchProcessAside from './src/launchProcessAside.vue';

launchProcessAside.install = function(Vue) {
  Vue.component(launchProcessAside.name,launchProcessAside);
};
export default launchProcessAside;