import Vue from 'vue';
import Operation from './operation.js';
import PanelInfo from './panelInfo.js';

const _id = Symbol('ID');

class Dashboard {
  constructor() {
    this[_id] = undefined;
    this.viewData = {};
  }

  get $id() {
    return this[_id];
  }

  set $id(viewId) {
    this[_id] = viewId;
  }

  $set(target, key, value) {
    Vue.set(target, key, value);
  }

  static $set(target, key, value) {
    Vue.set(target, key, value);
  }

  // 渲染视图(可重写)
  render() {}

  // 面板添加方法(可重写)
  bindPanelMethods() {}

  // 处理单个系统主页信息
  handleDashboardInfo(res) {
    if(res.userIds) {
      res.userIds = res.userIds.split(',');
    } else {
      res.userIds = [];
    }

    try {
      res.layoutContent = JSON.parse(res.layoutContent);
    } 
    catch (e) {
      res.layoutContent = [];
    }

    console.log('主页详情', res);
    this.$set(this, 'viewData', res);
  }

  // 根据有权限面板集合过滤布局面板
  filterLayoutContent(res) {
    if(this.viewData.layoutContent) {
      for(let i = 0; i < this.viewData.layoutContent.length; i++) {
        let isExist = false;
        res.forEach(item => {
          if(this.viewData.layoutContent[i].id == item.id) {
            isExist = true;
            // 如果存在，将信息保存
            this.$set(this.viewData.layoutContent, i, Object.assign(
              this.viewData.layoutContent[i],
              item,
              { loading: true }
            ));
          }
        });
        // 如果不存在，直接删除
        if(!isExist) {
          this.viewData.layoutContent.splice(i, 1);
          i--;
        } 
      }
    }
  }

  // 根据数据源获取面板内容信息
  getPanelContent(panel, params = {}) {
    new PanelInfo(panel).handlePanelData(params).then(res => {
      this.$set(panel, 'dataInfo', res);
      this.$set(panel, 'loading', false);
    }) 
  }

  // 面板添加操作
  handlePanelOperation(panel) {
    let operation = new Operation(this);
    this.$set(panel, 'operation', operation);
  }
}

export default Dashboard;