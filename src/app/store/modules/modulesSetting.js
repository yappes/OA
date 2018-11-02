import {modulesInfoService} from "paas-web-utils/services";

const state = {
  curModuleId:null,//当前选中的模块id
  curModule:null,
  allModules:[]
};

const mutations = {
  changeCurModuleId(state, id) {
    state.curModuleId = id;
  },
  setAllModules(state,modules){
    state.allModules = modules;
  }
};
const actions = {
  changeCurModuleId({ commit }, id) {
    commit("changeCurModuleId", id);
  },
  getAllModulesOpt({ commit }){
    let params = {
      isDelete: 0,
    };
    modulesInfoService.findModules(params).then(data => {
      commit('setAllModules', data);
      if(!state.curModuleId){
        commit('changeCurModuleId', data[0].id);//默认选中集合中第一个模块
      }
    });
  }
};
const getters = {
  curModuleId(state) {
    return state.curModuleId;
  },
  allModules: state => state.allModules
};

export default { namespaced: true, state, mutations, actions, getters };
