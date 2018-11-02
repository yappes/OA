import drafts from './src/drafts.vue';

/* istanbul ignore next */
drafts.install = function(Vue) {
  Vue.component(drafts.name, drafts);
};

export default drafts;
