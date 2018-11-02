import listView from 'paas-web-utils/rules/list-view';
import { dashboardService } from 'paas-web-utils/services';

const _panel = Symbol('Panel');

class PanelInfo {
  constructor(panel) {
    this[_panel] = panel;
  }

  get panel() {
    return this[_panel];
  }

  // 最后返回的数据
  handlePanelData(params = {}) {
    let promise = undefined;
    switch(this.panel.type) {
      case 'CONTENT':
      case 'CHART':
        promise = this.getSourceData(this.panel.dataSourceUrl);
        break;
      case 'LIST_CUSTOM':
        promise = this.getSourceData(
          this.panel.dataSourceUrl,
          Object.assign({ 'currentPage': 1, 'pageSize': 10 }, params)
        );
        break;
      case 'LIST_SIMPLE': 
        promise = this.getListSimpleData(this.panel.viewId, this.panel.titleColumnId, this.panel.contentColumnId);
        break;
      case 'LIST': 
        promise = this.getListData(this.panel.viewId);
      break;
      default: promise = new Promise(resolve => resolve({}));
    }
    return promise.then(res => {
      return res;
    })
  }

  // 获取数据源地址数据
  getSourceData(sourceUrl, params = {}) {
    return dashboardService.getSourceData(sourceUrl, params);
  }

  // 获取标准列表数据
  getListData(viewId) {
    let listData = {};
    return new listView().render(viewId).then(res => {
      listData.datasource = res.datasource;
      listData.datasource.reload = true;
      listData.columns = res.columns;
      return listData;
    })
  }

  // 获取简洁列表数据
  getListSimpleData(viewId, titleColumnId, contentColumnId) {
    let promise = undefined;
    let listData = [];
    promise = Promise.all([
      dashboardService.findColumnDetail({ 'columnId': titleColumnId }),
      dashboardService.findColumnDetail({ 'columnId': contentColumnId }),
      dashboardService.findRealDataByViewId({ 'viewId': viewId }),
    ])
    return promise.then((data) => {
      let showColumnTitle = data[0].moduleCode + '_' + data[0].phyColumnName,
          showColumnContent = data[1].moduleCode + '_' + data[1].phyColumnName;
      data[2].forEach(item => {
        listData.push({ 'title': item[showColumnTitle], 'content': item[showColumnContent] });
      });
      return listData;
    })
  }
}
export default PanelInfo;