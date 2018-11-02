import PuiCatalogModule from './src/catalogModule.vue';

/* istanbul ignore next */
PuiCatalogModule.install = function(Vue) {
  Vue.component(PuiCatalogModule.name, PuiCatalogModule);
};

export default PuiCatalogModule;
