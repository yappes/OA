import PuiBtn from './src/btn.vue';

/* istanbul ignore next */
PuiBtn.install = function(Vue) {
  Vue.component(PuiBtn.name, PuiBtn);
};

export default PuiBtn;
