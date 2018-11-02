import Dashboard from './dashboard';
import { dashboardService } from 'paas-web-utils/services';

class DashboardView extends Dashboard {
  constructor() {
    super();
  }

  // 渲染视图(重写)
  render(viewId, homepageType = undefined) {
    this.$id = viewId;
    let promise = undefined;

    if(homepageType == 'system') {
      promise = Promise.all([dashboardService.findDashboardInfo({ id: viewId }), dashboardService.findAllPermissionPanel({})]);
    } else if(homepageType == 'user') {
      promise = Promise.all([dashboardService.findUserDashboardInfo({ id: viewId }), dashboardService.findAllPermissionPanel({})]);
    } 

    return promise.then(resList => {
      this.handleDashboardInfo(resList[0]);
      this.filterLayoutContent(resList[1]);

      this.viewData.layoutContent.forEach(layout => {
        // 根据数据源获取面板内容信息
        this.getPanelContent(layout);
        // 首页面板添加类别标识
        this.$set(layout, 'viewType', 'homepage');
        this.handlePanelOperation(layout);
      })
      
      console.log(`加载仪表盘（${this.$id}）`, this.viewData);
      return this;
    })
  }
}

export default DashboardView;