import processManagerAside from './src/processManagerAside.vue';

/* istanbul ignore next */
processManagerAside.install = function(Vue) {
  Vue.component(processManagerAside.name, processManagerAside);
};

export default processManagerAside;