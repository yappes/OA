import workGroup from './src/workGroup.vue';

/* istanbul ignore next */
workGroup.install = function(Vue) {
  Vue.component(workGroup.name, workGroup);
};

export default workGroup;