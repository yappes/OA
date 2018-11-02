import {menuService} from 'paas-web-utils/services';

const state = {
  // pageNow: 1,//当前页码
  // pageSize:10,//页面显示数量
  // searchVal: "",//模糊查询
  parentId: "",//父级菜单id
  // tableData:[],//列表数据
  // sidx: 'createTime', //排序字段
  // order: 'ASC' //排序方式
}

const mutations = {
  // changePageNow(state,page){
  //   state.pageNow = page;
  // },
  // changePageSize(state,size){
  //   state.pageSize = size;
  // },
  // changeSearchVal(state,searchVal){
  //   state.searchVal = searchVal;
  // },
  changeParentId(state,id){
    state.parentId = id;
  },
  // setTableData(state,data){
  //   state.tableData = data;
  // },
  // changeSidx(state,sidx) {
  //   state.sidx = sidx;
  // },
  // changeOrder(state,order) {
  //   state.order = order ;
  // }
}

const actions = {
  // changePageNow({dispatch, commit }, pageNow) {
  //   commit("changePageNow", pageNow);
  //   dispatch('getTableData');
  // },
  // changePageSize({dispatch, commit }, pageSize) {
  //   commit("changePageSize", pageSize);
  //   dispatch('getTableData');
  // },
  // changeSearchVal({dispatch, commit }, searchVal) {
  //   commit("changeSearchVal", searchVal);
  //   dispatch('getTableData');
  // },
  changeParentId({dispatch, commit }, parentId) {
    commit("changeParentId", parentId);
    // dispatch('getTableData');
  },
  // changeSidx({dispatch, commit }, sidx) {
  //   commit("changeSidx", sidx);
  //   //dispatch('getTableData');
  // },
  // changeOrder({dispatch, commit }, order) {
  //   commit("changeOrder", order);
  //   dispatch('getTableData');
  // },
  // getTableData({ commit }){
  //   let params = {
  //     "searchVal": state.searchVal,
  //     "parentId": state.parentId,
  //     "sourceType": 0,
  //     "order": state.order,
  //     "sidx": state.sidx,
  //     "pageNow": state.pageNow,
  //     "pageSize": state.pageSize,
  //   };
  //   menuService.findMenuPage(params).then(data => {
  //     commit('setTableData', data);
  //   });
  // },
}

const getters = {
  // pageNow: state => state.pageNow,
  // pageSize: state => state.pageSize,
  // searchKey: state => state.searchKey,
  parentId: state => state.parentId,
  // tableData: state => state.tableData,
  // sidx: state=> state.sidx,
  // order: state=> state.order
}

export default { namespaced: true, state, mutations, actions, getters };