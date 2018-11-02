const state = {
  asideHeight: "491px", //左侧高度
};
const mutations = {
  // changeAsideHeight(state, length) {
  //   if(length<=10){
  //     state.asideHeight = "491px"
  //   }else{
  //     let height = 491 + (length - 10) * 41.6;
  //     state.asideHeight = height + "px";
  //   }
  // },
  setAsideHeight(state,height){
    state.asideHeight = height;
  }
};
const actions = {
  changeAsideHeight({ commit }, length) {
    commit("changeAsideHeight", length);
  },
  setAsideHeight({ commit }, height) {
    commit("setAsideHeight", height);
  },
};
const getters = {
  asideHeight(state) {
    return state.asideHeight;
  },
};

export default { namespaced: true, state, mutations, actions, getters };
