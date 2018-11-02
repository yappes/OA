import { dictionaryService } from "paas-web-utils/services";

const state = {
  dictType:null,//当前选中的字典类型
  // tableData:[],//列表数据
  // pageNow: 1,//当前页码
  // pageSize:10,//页面显示数量
  // searchKey:'',//模糊查询
  // totalRecord:null,//总信息条数
  // sidx: '', //排序字段
  // order: '' //排序方式
};

const mutations = {
  changeDictType(state, dictType) {
    state.dictType = dictType;
  },
  // changePageNow(state, page) {
  //   state.pageNow = page;
  // },
  // changePageSize(state, size) {
  //   state.pageSize = size;
  // },
  // setTableData(state,data){
  //   state.tableData = data;
  // },
  // setSearchKey(state,searchKey){
  //   state.searchKey = searchKey;
  // },
  // setTotalRecord(state,totalRecord){
  //   state.totalRecord = totalRecord;
  // },
  // changeSidx(state,sidx) {
  //   state.sidx = sidx;
  // },
  // changeOrder(state,order) {
  //   state.order = order ;
  // }
};

const actions = {
  changeDictType({dispatch, commit }, dictType) {
    commit("changeDictType", dictType);
    // dispatch('getTableData');
  },
  // changePageNow({dispatch, commit }, page) {
  //   commit("changePageNow", page);
  //   dispatch('getTableData');
  // },
  // changePageSize({dispatch, commit }, size) {
  //   commit("changePageSize", size);
  //   dispatch('getTableData');
  // },
  // changeSearchKey({dispatch, commit }, searchKey) {
  //   commit("setSearchKey", searchKey);
  //   dispatch('getTableData');
  // },
  // changeTotalRecord({dispatch, commit }, totalRecord) {
  //   commit("setTotalRecord", totalRecord);
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
  // getTableData({ commit }){
  //   let params = {
  //     "pageSize": state.pageSize,
  //     "currentPage": state.pageNow,
  //     "dictType": state.dictType,
  //     "dictName": state.searchKey,
  //     // "sidx": '',
  //     // "order": '',
  //     "sidx":state.sidx,
  //     "order":state.order,
  //   };
  //   dictionaryService.findDictionariesPage(params).then(data => {
  //     commit('setTableData', data.record);
  //     commit('setTotalRecord', data.totalRecord);
  //   });
  // },
};


const getters = {
  dictType: state => state.dictType,
  // pageNow: state => state.pageNow,
  // pageSize: state => state.pageSize,
  // tableData: state => state.tableData,
  // searchKey: state => state.searchKey,
  // totalRecord: state => state.totalRecord,
  // sidx: state=> state.sidx,
  // order: state=> state.order
};

export default { namespaced: true, state, mutations, actions, getters };