import Dashboard from './dashboard';
import { dashboardService } from 'paas-web-utils/services';

class DashboardEdit extends Dashboard {
  constructor() {
    super();
    this.panelList = [];
    this.dragIndex = null;
  }

  // 渲染视图(重写)
  render(viewId, homepageType = undefined) {
    this.$id = viewId;
    let promise = undefined;

    // 编辑
    if(viewId) {
      if(homepageType == 'system' || homepageType == 'userSystem') {
        promise = Promise.all([dashboardService.findDashboardInfo({ id: viewId }), dashboardService.findAllPermissionPanel({})]);
      } else if(homepageType == 'user') {
        promise = Promise.all([dashboardService.findUserDashboardInfo({ id: viewId }), dashboardService.findAllPermissionPanel({})]);
      }
    } 
    // 新增
    else {
      this.viewData = {
        name: '',
        userIds: [], // 系统主页传参
        userId: '', // 用户个人主页传参
        sourceId: '', // 用户个人主页传参
        layoutContent: [],
        status: 'ENABLE',
        description: '',
      }
      promise = dashboardService.findAllPermissionPanel({});
    }

    return promise.then(resList => {
      if(viewId) {
        this.handleDashboardInfo(resList[0]);
        this.handlePanelList(resList[1]);
      } else {
        this.handlePanelList(resList);
      }
      
      console.log(`加载仪表盘（${this.$id}）`, this.viewData);
      return this;
    })
  }

  // 处理面板集合数据
  handlePanelList(res, isFilter = true) {
    if(res instanceof Array) {
      isFilter && this.filterLayoutContent(res);

      // 布局面板添加方法
      res.forEach(panel => {
        this.handlePanelOperation(panel);
        this.$set(panel, 'selected', false);
        this.viewData.layoutContent && this.viewData.layoutContent.forEach(layout => {
          this.handlePanelOperation(layout);
          if(panel.id == layout.id) {
            this.$set(panel, 'selected', true);
            // 根据数据源获取面板内容信息
            this.getPanelContent(layout);
          }
        })
      })

      console.log('面板集合', res);
      this.$set(this, 'panelList', res);
    }
  }

  // 关键字查询面板集合
  searchPanelList(searchKey) {
    let promise = dashboardService.findAllPermissionPanel({
      searchKey: searchKey
    }).then(res => {
      this.panelList.splice(0, this.panelList.length);
      this.handlePanelList(res, false);
      return this.panelList;
    })
    return promise;
  }
}

export default DashboardEdit;