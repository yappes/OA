//对象处理库
import object from 'paas-web-utils/common/object';

const getAttr = object.getAttr;
const setAttr = object.setAttr;
const deepExtend = object.deepExtend;

//配置存储容器
var configStorage = {}

//配置设置
var set = (name, data) => {
  return setAttr(configStorage, name, data);
}

//配置获取
var get = (name) => {
  return getAttr(configStorage, name);
}

export default {
  get,
  set,
  install(vue) {
    vue.prototype.$appConf = (...args) => {
      let name = args[0];
      let data = args[1];
      return args.length > 1 ? set(name, data) : get(name);
    }
  }
}
