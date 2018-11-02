import * as Promise from "bluebird";
Promise.config({
  // Enable warnings
  // warnings: {
  //   wForgottenReturn: false
  // },
  warnings : false,
  // Enable long stack traces
  longStackTraces: true,
  // Enable cancellation
  cancellation: true,
  // Enable monitoring
  monitoring: true
});
const install = function(Vue) {
  // 常用
  Vue.prototype.$defer = function() {
    var promise = {
      resolve: undefined,
      reject: undefined,
      promise: undefined
    };
    promise.promise = new Promise((_resolve, _reject) => {
      promise.resolve = _resolve;
      promise.reject = _reject;
    });
    return promise;
  };
  // 常用
  Vue.prototype.$all = function(...promises) {
    return Promise.all(promises);
  };
  Vue.prototype.$promise = function(callback) {
    let vm = this;
    return new Promise(function(resolve, reject) {
      callback.apply(vm, [resolve, reject]);
    });
  };
  Vue.prototype.$promise['class'] = Promise;
};
export { Promise };
export default install;
