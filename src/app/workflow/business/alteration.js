import {
  workflowProcessService
} from "paas-web-utils/services";
import BatchView from "paas-web-utils/rules/batch-view";
import ListView from "paas-web-utils/rules/list-view";
import Vue from "vue";

const setColumnHighlight = function (columnMap, columnId) {
  Vue.set(columnMap[columnId], "isHighlight", true);
}

const resetColumnVal = function (view, group, highlightColumn, changeRecord) {
  if (!group) {
    group = view.findViewGroupByColumnId(highlightColumn);
  }
  if (!group || !group.columnMap) {
    return
  }
  let column = group.columnMap[highlightColumn];
  setColumnHighlight(group.columnMap, highlightColumn);
  console.log("group.type", group.type);
  if (view.type === "detail" || view.type === "detailBatchForm") {
    Vue.set(group.formModel, column.valKey, changeRecord[column.valKey]);
    if (column.type.val === 'file' || column.type.val === 'image') {
      // Vue.set(group.formModel, column.valKey, changeRecord[column.valKey]);
      let oldValue = view.record[column.valKey]
      let newValue = changeRecord[column.valKey]
      let result = `${oldValue}=>${newValue}`
      Vue.set(group.formModel, column.showValKey, result)
    } else {
      Vue.set(group.formModel, column.showValKey, changeRecord[column.showValKey + '_ALTERATION'])
    }
    // Vue.set(group.formModel, column.valKey, changeRecord[column.valKey]);
    // Vue.set(group.formModel, column.showValKey, changeRecord[column.showValKey + '_ALTERATION'])
  } else {
    Vue.set(group.formModel, column.showValKey, changeRecord[column.showValKey])
    Vue.set(group.formModel, column.valKey, changeRecord[column.valKey]);
  }
}

const batchViews = function (view) {
  return view.groups.filter(function (group) {
    return group instanceof BatchView;
  })
}

const listViews = function (view) {
  return view.groups.filter(function (group) {
    return group instanceof ListView;
  })
}

const createdFn = function (alterBatchView, batchView) {
  return function (batchRowView, index) {
    const highlightColumns = alterBatchView.highlightColumns[index];
    const changeRecord = alterBatchView.changeRecords[index];
    if (!highlightColumns) return;
    for (const highlightColumn of highlightColumns) {
      resetColumnVal(batchView, batchRowView, highlightColumn, changeRecord)
    }
  }
}

const createdListFn = function (alterListView, listView) {
  for (let i = 0; i < listView.formModel.length; i++) {
    const highlightColumns = alterListView.highlightColumns[i];
    const changeRecord = alterListView.changeRecords[i];
    let record = alterListView.records[i];
    Vue.set(listView.formModel[i], "highlightColumns", ',');
    for (const highlightColumn of highlightColumns) {
      let column = listView.columnMap[highlightColumn];
      listView.formModel[i].highlightColumns +=`${column.gridKey},`;
      Vue.set(listView.formModel[i], column.valKey, changeRecord[column.valKey]);
      if (column.type.val === 'file' || column.type.val === 'image') {
        let oldValue = record[column.valKey]
        let newValue = changeRecord[column.valKey]
        let result = `${oldValue}=>${newValue}`
        Vue.set(listView.formModel[i], column.showValKey, result)
      } else {
        Vue.set(listView.formModel[i], column.showValKey, changeRecord[column.showValKey + '_ALTERATION'])
      }
    }
  }
}

/**
 * 变更格式化
 */
const alteration = function (view, alterationData) {
  if (!alterationData) return Promise.resolve(view);
  for (const highlightColumn of alterationData.highlightColumns) {
    resetColumnVal(view, undefined, highlightColumn, alterationData.changeRecord);
  }
  let batchViewArray = batchViews(view);
  let batchViewMaps = {};
  // 清理数据
  batchViewArray.filter(function (b) {
    batchViewMaps[b.batchId] = b;
    b.clearData();
  })

  let listViewArray = listViews(view);
  let listViewMaps = {};
  listViewArray.filter(function (b) {
    listViewMaps[b.batchId] = b;
  })

  let promise = [];
  for (const alterBatchView of alterationData.batchViews) {
    let batchView = batchViewMaps[alterBatchView.batchCtrl.batchId];

    if (!batchView) continue;

    batchView.records = alterBatchView.records;
    batchView.addEventListener('created', createdFn(alterBatchView, batchView));
    for (const index in alterBatchView.changeRecords) {
      let changeRecord = alterBatchView.changeRecords[index];
      let record = alterBatchView.records[index];
      record['[[dataStatus]]'] = changeRecord['[[dataStatus]]'];
      promise.push(batchView.insertData(record));
    }
  }
  for (const alteListView of alterationData.batchViews) {
    let listView = listViewMaps[alteListView.batchCtrl.batchId];

    if (!listView) continue;
    listView.formModel = [];
    listView.records = alteListView.records;
    for (const index in alteListView.changeRecords) {
      let changeRecord = alteListView.changeRecords[index];
      let record = alteListView.records[index];
      record['[[dataStatus]]'] = changeRecord['[[dataStatus]]'];
      listView.formModel.push(record);
    }
    createdListFn(alteListView, listView);
  }
  return Promise.all(promise).then(function () {
    return view;
  })
}


export default alteration;
