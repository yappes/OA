import PuiBreadcrumb from './src/breadcrumb.vue';

/* istanbul ignore next */
PuiBreadcrumb.install = function(Vue) {
  Vue.component(PuiBreadcrumb.name, PuiBreadcrumb);
};

export default PuiBreadcrumb;
