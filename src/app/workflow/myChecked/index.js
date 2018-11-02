import myChecked from './src/myChecked.vue';

/* istanbul ignore next */
myChecked.install = function(Vue) {
  Vue.component(myChecked.name, myChecked);
};

export default myChecked;