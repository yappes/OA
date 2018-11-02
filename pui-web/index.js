import PuiComponents from './components/index.js';
import PuiDirectives from './directives';
import PuiFilters from './filters';
import PuiPlugins from './plugins';
import ObjectExtend from './objects'
//组件安装
const install = function (Vue) {

  //安装组件

  PuiComponents.install(Vue);

  //安装指令
  Object
    .keys(PuiDirectives)
    .forEach(function (key) {
      Vue.directive(PuiDirectives[key].name, PuiDirectives[key]);
    });

  // //安装过滤器
  Object
    .keys(PuiFilters)
    .forEach(function (key) {
      Vue.filter(PuiFilters[key].name, PuiFilters[key].fn);
    });

  // //安装三方插件
  Object
    .keys(PuiPlugins)
    .forEach(function (key) {
      Vue.use(PuiPlugins[key]);
    })
  Vue.use(ObjectExtend.install);
};

export default {
  install,
  PuiComponents,
  PuiDirectives,
  PuiFilters,
  PuiPlugins
}
