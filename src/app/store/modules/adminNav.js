const state = {
  headerTitle: "后台管理", //不同页面头部标题的变更
  menuGroupName:"自定义"//菜单分组名
};
const mutations = {
  changeHeaderTitle(state, str) {
    state.headerTitle = str;
  },
  changeMenuGroupName(state,str){
    state.menuGroupName = str;
  }
};
const actions = {
  changeHeaderTitle({ commit }, str) {
    commit("changeHeaderTitle", str);
  },
  changeMenuGroupName({commit},str){
    commit("changeMenuGroupName",str);
  }
};
const getters = {
  getHeaderTitle(state) {
    return state.headerTitle;
  },
  getMenuGroupName(state){
    return state.menuGroupName;
  }
};

export default { namespaced: true, state, mutations, actions, getters };
