import PuiMoney from './src/money.vue';

/* istanbul ignore next */
PuiMoney.install = function(Vue) {
  Vue.component(PuiMoney.name, PuiMoney);
};

export default PuiMoney;
