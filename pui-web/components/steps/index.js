import PuiSteps from './src/steps.vue';

/* istanbul ignore next */
PuiSteps.install = function(Vue) {
  Vue.component(PuiSteps.name, PuiSteps);
};

export default PuiSteps;
