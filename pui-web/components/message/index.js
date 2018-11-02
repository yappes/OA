import PuiMessage from './src/message.vue';

/* istanbul ignore next */
PuiMessage.install = function(Vue) {
  Vue.component(PuiMessage.name, PuiMessage);
};

export default PuiMessage;