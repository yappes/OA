import processManageAll from './src/processManageAll.vue';

/* istanbul ignore next */
processManageAll.install = function (Vue) {
    Vue.component(processManageAll.name, processManageAll);
};

export default processManageAll;

