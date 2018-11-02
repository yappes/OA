import { userService } from "paas-web-utils/services";

const state = {
  curOrgCode:null,//当前选中的部门orgCode
  // tableData:{
  //   currentPage:1,
  //   pageSize:10,
  // },//列表数据
  // curOrgId:null,//当前选中的部门orgId
  // currentPage: 1,//当前页码
  // pageSize:10,//页面显示数量
  // searchKey:'',//模糊查询
  // sidx: 'createTime', //排序字段
  // order: 'ASC' //排序方式
};

const mutations = {
  changeCurOrgCode(state, id) {
    state.curOrgCode = id;
  },
  // changeCurOrgId(state, id) {
  //   state.curOrgId = id;
  // },
  // setTableData(state,data){
  //   state.tableData = data;
  // },
  // setSearchKey(state,searchKey){
  //   state.searchKey = searchKey;
  // },
  // changeSidx(state,sidx) {
  //   state.sidx = sidx;
  // },
  // changeOrder(state,order) {
  //   state.order = order ;
  // }
};

const actions = {
  changeCurOrgCode({dispatch, commit }, id) {
    commit("changeCurOrgCode", id);
    // dispatch('getTableData');
  },
  // changeCurOrgId({dispatch, commit }, id) {
  //   commit("changeCurOrgId", id);
  //   dispatch('getTableData');
  // },
  // changeSearchKey({dispatch, commit }, searchKey) {
  //   commit("setSearchKey", searchKey);
  //   dispatch('getTableData');
  // },
  // changeSidx({dispatch, commit }, sidx) {
  //   commit("changeSidx", sidx);
  //   //dispatch('getTableData');
  // },
  // changeOrder({dispatch, commit }, order) {
  //   commit("changeOrder", order);
  //   dispatch('getTableData');
  // },
  // getTableData({ commit },obj={}){
  //   let currentPage = obj.currentPage || state.currentPage
  //   let pageSize = obj.pageSize || state.pageSize
  //   let params = {
  //     "orgId":state.curOrgId,
  //     "searchKey":state.searchKey,
  //     "orgCode":state.curOrgCode,
  //     "sidx":state.sidx,
  //     "order":state.order,
  //     "currentPage": currentPage,
  //     "pageSize": pageSize,
  //   };
  //   userService.findUserByPage(params).then(data => {
  //     commit('setTableData', data);
  //   });
  // },
};


const getters = {
  curOrgCode: state => state.curOrgCode,
  // curOrgId: state => state.curOrgId,
  // tableData: state => state.tableData,
  // searchKey: state => state.searchKey,
  // sidx: state=> state.sidx,
  // order: state=> state.order
};

export default { namespaced: true, state, mutations, actions, getters };