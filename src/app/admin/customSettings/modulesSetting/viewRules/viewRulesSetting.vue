<template>
  <div class="pui-view-rules-setting">
    <pui-container class="pui-view-rules-setting__container">
      <pui-aside width="300px"  class="pui-view-rules-setting__aside" :style="{ minHeight:(rulesSettingHeight+'px') }">
        <div class="pui-view-rules-setting__left">
          <aui-input v-model="searchView" @keyup.enter.native="searchViewEvent" size="medium" clearable placeholder="搜索" prefix-icon="aui-icon-search">
          </aui-input>
          <ul class="view-list"  :style="{height:listHeight}">
            <li class="view-item" :class="{'is-active': item.id == query.viewId}" v-for="item in viewList" :key="item.id" @click="handleSelectView(item)">{{item.viewName}}</li>
          </ul>
        </div>
      </pui-aside>
      <pui-main  class="pui-view-rules-setting__main">
        <div class="pui-view-rules-setting__right">
          <div class="pui-list-grid__top">
            <div class="pui-list-grid__operations-wrapper">
              <aui-button @click="handleAdd" class="pui-list-grid__oper">新增</aui-button>
            </div>
            <aui-input @keyup.enter.native="enterKeyEvent()" size="medium" clearable class="pui-list-grid__fuzzy-search" placeholder="搜索" prefix-icon="aui-icon-search" v-model="fuzzyKey">
            </aui-input>
          </div>
          <div class="pui-list-grid__table-wrapper">
            <aui-table :data="tableData" @sort-change="handleSortChange" tooltip-effect="dark" stripe style="width: 100%" empty-text="暂无数据">
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
              <aui-table-column prop="ruleName" sortable="custom" label="条件名称" show-overflow-tooltip></aui-table-column>
              <aui-table-column label="条件类型" sortable="custom" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="scope.row.ruleType == 'hidden'">隐藏</span>
                  <span v-else-if="scope.row.ruleType == 'show'">显示</span>
                  <span v-else-if="scope.row.ruleType == 'readOnly'">只读</span>
                  <span v-else-if="scope.row.ruleType == 'columnFilter'">字段筛选</span>
                </template>
              </aui-table-column>
              <aui-table-column prop="sort" sortable="custom" label="执行顺序" show-overflow-tooltip></aui-table-column>
              <aui-table-column prop="createTime" sortable="custom" label="创建时间" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.createTime | timestampStringify}}
                </template>
              </aui-table-column>
            </aui-table>
          </div>
          <div class="pagination-outer">
            <pui-pagination ref="pagination" style="margin:5px 0;minWidth:825px" :datasource="{ 'currentPage': query.currentPage, 'pageSize': query.pageSize, 'reload':query.reload}" :totalRecord="totalRecord" v-show="totalRecord !== 0" @changeCurrentPage="changeCurrentPage" @changePageSize="changePageSize">
            </pui-pagination>
          </div>
        </div>
      </pui-main>
    </pui-container>

    <pui-view-rules-edit v-if="showEditDialog" :editRow="editRow" :isEdit="isEdit" :viewId="query.viewId" @getTableData="getTableData" @closeDialog="handleCloseEdit"></pui-view-rules-edit>
  </div>
</template>
<script>
import puiViewRulesEdit from "./viewRulesEdit";
import { viewRuleService } from "paas-web-utils/services";
export default {
  name: "PuiViewRulesSetting",

  components: {
    puiViewRulesEdit
  },

  data() {
    return {
      query: {
        currentPage: 1,
        pageSize: 20,
        order: "desc",
        sidx: "id",
        viewId: null,
        searchVal: null,
        reload:false,
      },
      editRow: null,
      tableData: [],
      totalRecord: 0,
      receiveCurrentPage: 1,
      fuzzyKey: "",
      showEditDialog: false,
      isEdit: false,
      currentModuleId: null,
      viewList: [],
      searchView: null,
      rulesSettingHeight: "",
      listHeight: ""
    };
  },

  props: {
    moudle: {
      type: [Number, Object],
      default: null
    }
  },

  watch: {
    moudle: {
      handler: function(newModlue) {
        if (newModlue && typeof newModlue === "object") {
          this.currentModuleId = newModlue.id || null;
        } else {
          this.currentModuleId = newModlue;
        }
        this.query.currentPage = 1;
        this.query.pageSize = 10;
        this.query.reload = false;
        this.fuzzyKey = null;
        this.searchView = null;
        this.findViewList();
      },
      deep: true,
      immediate: true
    }
  },

  mounted() {
    this.rulesSettingHigh();
  },

  methods: {
    // 根据模块id查询视图集合
    findViewList(viewName) {
      viewRuleService
        .findViewListByModuleId({
          moduleId: this.currentModuleId,
          viewFlag: 0,
          viewTypes: [2, 3, 7, 8], // 视图条件只查找新增、修改、批量新增、批量修改
          viewName: viewName || ""
        })
        .then(res => {
          this.viewList = res;
          if (res && res.length) {
              this.query.viewId = res[0].id;
              this.getTableData();
          }
        });
    },

    getTableData(params) {
      var params = params ? Object.assign({}, this.query, params) : this.query;
      params.viewId && viewRuleService.findViewRuleByPage(params).then(data => {
        this.tableData = data.record;
        this.query.reload = true;
        this.totalRecord = data.totalRecord || 0;
        this.receiveCurrentPage = data.currentPage || 1;
      });
    },

     // 改变顺序
    handleSortChange(data) {
      if (data.column === null || data.prop === null) {
        this.$set(this.query, "sidx", "id");
        this.$set(this.query, "order", "desc");
      } else if(data.column.label==="条件类型") {
        this.$set(this.query, "sidx", "ruleType");
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
      this.query.searchVal = this.fuzzyKey;
      this.$refs.pagination.customCurrentPage();
      this.getTableData();
    },

    // 搜索视图
    searchViewEvent() {
      this.findViewList(this.searchView);
    },

    // 选择视图
    handleSelectView(item) {
      this.query.viewId = item.id;
      this.getTableData();
    },

    handleAdd() {
      this.showEditDialog = true;
      this.isEdit = false;
    },

    handleEdit(index, row) {
      this.editRow = row;
      this.showEditDialog = true;
      this.isEdit = true;
    },

    handleDelete(index, row) {
      this.$aui.confirm
        .show("确定删除吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          viewRuleService
            .deleteViewRule({
              id: row.id
            })
            .then(res => {
              this.getTableData();
            });
        });
    },

    handleCloseEdit() {
      this.showEditDialog = false;
      this.isEdit = false;
    },

    // 改变序号
    changeIndex(index) {
      return index + (this.receiveCurrentPage - 1) * this.query.pageSize + 1;
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

    //左右分割线的最小高度
    rulesSettingHigh() {
      this.rulesSettingHeight = window.innerHeight - 48 - 48 - 26 - 26 - 34 - 40 - 14 ;
      this.listHeight = this.rulesSettingHeight - 36 + "px";
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./viewRulesSetting.scss";

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
//分页样式
.pui-view-rules-setting {
  .pagination-outer {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    margin:25px 0;
  }
}
</style>