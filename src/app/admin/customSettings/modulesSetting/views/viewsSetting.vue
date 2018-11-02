<template>
  <div class="pui-view-setting">
    <div class="pui-list-grid__top">
      <div class="pui-list-grid__operations-wrapper">
        <aui-popover ref="addPopover" placement="bottom-start" trigger="hover">
          <ul>
            <li class="pui-list-grid__oper-in-row-item" @click.stop="openView(1)">列表</li>
            <li class="pui-list-grid__oper-in-row-item" @click.stop="openView(2)">新增</li>
            <li class="pui-list-grid__oper-in-row-item" @click.stop="openView(3)">修改</li>
            <li class="pui-list-grid__oper-in-row-item" @click.stop="openView(4)">详情</li>
            <li class="pui-list-grid__oper-in-row-item" @click.stop="openView(7)">批量</li>
            <li class="pui-list-grid__oper-in-row-item" @click.stop="openCustomView">自定义</li>
          </ul>
        </aui-popover>
        <aui-button class="pui-list-grid__oper" @click.stop v-popover:addPopover>新增</aui-button>
      </div>
      <aui-input @keyup.enter.native="enterKeyEvent()" size="medium" clearable class="pui-list-grid__fuzzy-search" placeholder="搜索" prefix-icon="aui-icon-search" v-model="fuzzyKey">
      </aui-input>
    </div>

    <div class="pui-list-grid__table-wrapper">
      <aui-table :data="tableData" tooltip-effect="dark" @sort-change="handleSortChange" stripe style="width: 100%" empty-text="暂无数据">
        <aui-table-column type="index" :index="changeIndex" label="序号" width="55" fixed></aui-table-column>
        <aui-table-column label="操作" width="55" fixed>
          <template slot-scope="scope">
            <aui-popover ref="popover1" placement="bottom-start" trigger="hover">
              <ul>
                <li class="pui-list-grid__oper-in-row-item" @click.stop="handleEdit(scope.$index, scope.row)">编辑</li>
                <li class="pui-list-grid__oper-in-row-item" @click.stop="handleDelete(scope.$index, scope.row)">删除</li>
              </ul>
            </aui-popover>
            <i class="pui-icon-fenlei" @click.stop v-popover:popover1></i>
          </template>
        </aui-table-column>
        <aui-table-column prop="viewName" label="视图名称" sortable="custom" show-overflow-tooltip></aui-table-column>
        <aui-table-column label="视图类型" sortable="custom" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.viewType | viewTypeFilter}}
          </template>
        </aui-table-column>
        <aui-table-column prop="description" label="视图描述" sortable="custom" show-overflow-tooltip></aui-table-column>
        <aui-table-column prop="createTime" sortable="custom" label="创建时间" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.createTime | timestampStringify}}
          </template>
        </aui-table-column>
      </aui-table>
    </div>

    <pui-pagination
    ref="pagination" 
    style="margin:30px 0;" 
    :datasource="{ 'currentPage': query.currentPage, 'pageSize': query.pageSize, 'reload':query.reload}" 
    :totalRecord="totalRecord" 
    v-show="totalRecord !== 0"
    @changeCurrentPage="changeCurrentPage"
    @changePageSize="changePageSize">
    </pui-pagination>

    <pui-list-view-setting v-if="showListView" :moduleId="query.moduleId" :editRow="editRow" :isEdit="isEdit" :viewType="viewType" @handle-cancel="handleCancel" @get-table-data="getTableData"></pui-list-view-setting> 
    <pui-add-view-setting v-if="showAddView" :moduleId="query.moduleId" :editRow="editRow" :isEdit="isEdit" :viewType="viewType" @handle-cancel="handleCancel" @get-table-data="getTableData"></pui-add-view-setting> 
    <pui-custom-view-setting v-if="showCustomView" :moduleId="query.moduleId" :editRow="editRow" :isEdit="isEdit" @handle-cancel="handleCancel" @get-table-data="getTableData"></pui-custom-view-setting>
  </div>
</template>
<script>
import puiCustomViewSetting from './customViewSetting';
import puiListViewSetting from './listViewSetting';
import puiAddViewSetting from './addViewSetting';
import { viewService } from 'paas-web-utils/services';
export default {
  name: "PuiViewSetting",

  components: {
    puiCustomViewSetting,
    puiListViewSetting,
    puiAddViewSetting,
  },

  data() {
    return {
      query: {
        currentPage: 1,
        pageSize: 10,
        order: 'desc',
        sidx: 'id',
        moduleId: null,
        keyVal: null,
        flag: 0,
        reload:false,
      },
      editRow: null,
      tableData: [],
      totalRecord: 0,
      receiveCurrentPage: 1,
      fuzzyKey: '',
      isEdit: false,
      viewType: null,
      showListView: false, // 是否显示列表视图
      showAddView: false, // 是否显示新增、编辑、详情视图
      showCustomView: false, // 是否显示自定义视图
      reqData: {
        moduleId: '',
        viewType: null,
        viewName: '',
        layoutType: '',
        dpEnable: 'TRUE',
        requiredCols: '',
        columnAssemble: '',
        showColumns: '',
        viewSpcShows: [],
        batchCtrls: [],
        dataPermission: '',
        flag: 0,
        searchColumns: '',
        fuzzyQueryCols: '',
      },
    };
  },

  props: {
    moudle: {
      type: [Number, Object],
      default: null
    }
  },

  filters: {
    viewTypeFilter(val){
      switch(val) {
        case 1: return '列表'; break;
        case 2: return '新增'; break;
        case 3: return '修改'; break;
        case 4: return '详情'; break;
        case 5: return '自定义'; break;
        case 6: return '批量'; break;
        case 7: return '批量'; break;
        case 8: return '修改'; break;
        default: return '';
      }
    }
  },

  watch: {
    moudle: {
      handler: function(newModlue) {
        if (newModlue && typeof newModlue === "object") {
          this.query.moduleId = newModlue.id || null;
        } else {
          this.query.moduleId = newModlue;
        }
        this.query.currentPage = 1;
        this.query.pageSize = 10;
        this.query.reload = false;
        this.fuzzyKey = null;
        this.getTableData();
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    getTableData(params) {
      if(this.query.moduleId) {
        var params = params ? Object.assign({}, this.query, params) : this.query;
        viewService.findViewByPage(params).then(data => {
          this.tableData = data.record;
          this.query.reload = true;
          this.totalRecord = data.totalRecord || 0;
          this.receiveCurrentPage = data.currentPage || 1;
        });
      }
    },

    // 改变顺序
    handleSortChange(data) {
      if (data.column === null || data.prop === null) {
        this.$set(this.query, "sidx", "id");
        this.$set(this.query, "order", "desc");
      } else if(data.column.label==="视图类型") {
        this.$set(this.query, "sidx", "viewType");
        this.$set(this.query, "order", data.order === "ascending" ? "asc" : "desc");
      } else {
        this.$set(this.query, "sidx", data.prop);
        this.$set(this.query, "order", data.order === "ascending" ? "asc" : "desc");
      }
      this.getTableData();
      console.log("改变顺序", data);
    },
    
    enterKeyEvent() {
      this.query.currentPage = 1;
      this.query.pageSize = 10;
      this.query.reload = false;
      this.query.keyVal = this.fuzzyKey;
      this.$refs.pagination.customCurrentPage();
      this.getTableData();
    },

    handleEdit(index, row) {
      this.editRow = row;
      this.isEdit = true;
      this.viewType = row.viewType;
      this.hideBodyScroll();
      
      if(row.viewType == 1 || row.viewType == 7 || row.viewType == 6) {
        this.showListView = true;
      } else if(row.viewType == 2 || row.viewType == 3 || row.viewType == 4 || row.viewType == 8){
        this.showAddView = true;
      } else if(row.viewType == 5) {
        this.showCustomView = true;
      }
    },

    handleDelete(index, row) {
      this.$aui.confirm
      .show('确定删除吗？', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        viewService.deleteView({ 
          viewId: row.id 
        }).then(res => {
          this.getTableData();
        });
      });
    },

    handleCloseEdit() {
      this.showCustomView = false;
      this.isEdit = false;
    },
    
    // 改变序号
    changeIndex(index) {
      return (
        index + (this.receiveCurrentPage - 1) * this.query.pageSize + 1
      );
    },

    // 改变每页条数
    changePageSize(pageSize) {
      this.query.pageSize = pageSize;
      this.getTableData();
    },

    // 改变当前页码
    changeCurrentPage(currentPage) {
      this.query.currentPage = currentPage;
      this.getTableData();
    },

    // 显示body滚动条
    showBodyScroll() {
      const body = document.body || document.documentElement;
      body.style.overflow = 'auto';
    },

    // 隐藏body滚动条
    hideBodyScroll() {
      const body = document.body || document.documentElement;
      body.style.overflow = 'hidden';
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },

    // 关闭视图
    handleCancel(type) {
      this['show' + type] = false;
      this.isEdit = false;
      this.editRow = null;
      this.showBodyScroll();
    },

    // 打开视图
    openView(viewType) {
      let params = {
        ...this.reqData,
        moduleId: this.query.moduleId,
        viewType: viewType,
        viewName: '未命名视图',
        isBatchAddView: viewType == 7 ? 1: 0,
      }
      viewService.addView(params).then(res => {
        this.editRow = res.data;
        this.viewType = viewType;
        if(viewType == 1 || viewType == 7) {
          this.showListView = true;
        } else {
          this.showAddView = true;
        }
        this.hideBodyScroll();
      })
    },

    // 打开自定义视图
    openCustomView() {
      this.showCustomView = true;
      this.hideBodyScroll();
    }
  }
};
</script>
<style lang="scss" scoped>
  @import "./viewsSetting.scss";

  .pui-list-grid__oper-in-row-item {
  padding: 5px 10px;
  margin: 0 -12px;
  line-height: 24px;
  // line-height: 18px;
  // height: 24px;
  box-sizing: border-box;
  &:hover {
    // background-color: $--color-primary;
    // color: $--color-white;
    background-color: #e5f9f7;
  }
}
//弹框中的form样式
// .pui-view-setting /deep/ {
//   & .pui-view-formulas-edit__form  {
//     padding: 0px 9% 0px 3%;
//     min-width: 300px;
//      //行高一致
//     .aui-form-item__content , .aui-form-item__label , .aui-checkbox-group {
//       line-height: 34px;
//       height: 34px;
//     }
//   }
// }
//弹框中的表单样式
.pui-view-setting /deep/ {
   .form {
    width: 90%;
    min-width: 400px;
    .pui-col{
      width: 100%;
    }
    //加号的样式
    .add-colConstraint {
      display: inline-block;
      font-size: 30px;
      border: 1px solid #eee;
      box-sizing: border-box;
      width: 32px;
      height: 34px;
      text-align: center;
      color: #ccc;
      cursor: pointer;
    }
    //加号前面的选择框
    .colConstraint {
      .aui-select {
        width: calc(100% - 32px);
        float: left;
      }
    }
    //可输入最大最小长度
    & .aui-input-number {
      width: 100%;
    }
  }
}
</style>