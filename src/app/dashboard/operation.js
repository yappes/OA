import { dashboardService } from 'paas-web-utils/services';

const _view = Symbol('View');

class Operation {
  constructor(view) {
    this[_view] = view;
  }

  // 刷新面板
  handleRefresh(panel) {
    // 设置加载中
    this[_view].$set(panel, 'loading', true);

    // 更新单个面板信息
    dashboardService.findPanelDetail({ panelId: panel.id }).then(res => {
      let index = this[_view].viewData.layoutContent.indexOf(panel);
      this[_view].$set(this[_view].viewData.layoutContent, index, Object.assign(panel, res));

      console.log('刷新面板', panel.title, panel);
      this[_view].getPanelContent(this[_view].viewData.layoutContent[index]);
    });
  }

  // 添加面板
  handleAdd(panel) {
    if(panel.selected) {
      return false;
    } else {
      this[_view].$set(panel, 'selected', true);
      this[_view].$set(panel, 'span', 12);
      this[_view].$set(panel, 'height', 200);
      this[_view].$set(panel, 'loading', true);
      this[_view].getPanelContent(panel);
      this[_view].viewData.layoutContent.push(panel);
    }
  }

  // 删除面板
  handleDelete(panel) {
    let index = this[_view].viewData.layoutContent.indexOf(panel);
    this[_view].viewData.layoutContent.splice(index, 1);
    this[_view].panelList.forEach(item => {
      panel.id == item.id && this[_view].$set(item, 'selected', false);
    })
  }

  // 调整面板宽度
  handleChangeWidth(panel, type) {
    if(type === 'add') {
      if(panel.span >= 24) return;
      panel.span += 2;
    } else if(type == 'reduce') {
      if(panel.span <= 6) return;
      panel.span -=2;
    }
  }

  /*
  * 拖拽相关 -- 开始
  */
  // 拖拽开始
  handleDragStart(dashboardData, e) {
    let index = this[_view].viewData.layoutContent.indexOf(dashboardData);
    this[_view].dragIndex = index;
    e.target.className = e.target.className + ' drag';
    e.dataTransfer.effectAllowed = 'move';
  }
  
  // 拖拽结束
  handleDragEnd(e) {
    e.preventDefault();
    e.stopPropagation();
    e.target.className = e.target.className.replace(' drag', '');
  }

  // 拖拽进入
  handleDragEnter(dashboardData) {
    let index = this[_view].viewData.layoutContent.indexOf(dashboardData);
    let tmp = this[_view].viewData.layoutContent[this[_view].dragIndex];
    try {
      this[_view].$set(this[_view].viewData.layoutContent, this[_view].dragIndex, JSON.parse(JSON.stringify(this[_view].viewData.layoutContent[index])));
      this[_view].$set(this[_view].viewData.layoutContent, index, JSON.parse(JSON.stringify(tmp)));
      this[_view].bindPanelMethods(this[_view].viewData.layoutContent[this[_view].dragIndex]);
      this[_view].bindPanelMethods(this[_view].viewData.layoutContent[index]);
      this[_view].dragIndex = index;
    } 
    catch (e) {
      return false;
    }
  }

  // 拖动
  handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  /*
  * 拖拽相关 -- 结束
  */

  // 自定义列表分页 - 改变页码信息
  handlePageInfo(panel, pageInfo) {
    this[_view].getPanelContent(panel, pageInfo); 
  }
}

export default Operation;