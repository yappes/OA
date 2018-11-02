<template>
  <div class="pui-panel-setting">
    <div style="margin: -13px -20px">
      <div class="pui-list-grid__top">
        <!-- <div class="pui-search">
          <p class="pui-search-label">标题:</p>
          <aui-input v-model="searchTitle" size="medium" clearable class="pui-search-input" placeholder="请输入搜索标题">
          </aui-input>
          <p class="pui-search-label">类型:</p>
          <aui-select v-model="searchType" placeholder="请选择" class="pui-search-select">
            <aui-option v-for="item in typeOpt" :key="item.value" :label="item.label" :value="item.value">
            </aui-option>
          </aui-select>
          <aui-button class="pui-list-grid__oper" type="primary" plain @click="handleSearch">搜索</aui-button>
          <aui-button class="pui-list-grid__oper" @click="clearSearch">重置</aui-button>
        </div> -->
        <div class="pui-search">
          <!-- <p class="pui-search-label">标题:</p> -->
          <label class="pui-search__label">标题：</label>
          <aui-input v-model="searchTitle" size="medium" clearable class="pui-search-input" placeholder="请输入搜索标题">
          </aui-input>
        </div>
        <div class="pui-search">
          <label class="pui-search__label">类型：</label>
          <aui-select v-model="searchType" placeholder="请选择" clearable class="pui-search-select">
            <aui-option v-for="item in typeOpt" :key="item.value" :label="item.label" :value="item.value">
            </aui-option>
          </aui-select>
        </div>
        <div class="pui-panel-setting__operations">
          <pui-btn  @click="handleSearch" :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper">搜索</pui-btn>
          <pui-btn  @click="clearSearch" :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper">重置</pui-btn>
        </div>
      </div>
      <div class="pui-panel-setting__middle"></div>
      <div class="pui-panel-setting__main">
        <div class="pui-panel-setting__operations">
          <pui-btn @click="handleAdd" :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper">创建</pui-btn>
        </div>
        <div class="pui-list-grid__table-wrapper">
          <aui-table empty-text="暂无数据" @row-click="showDetail" :data="tableData" @sort-change="handleSortChange"  tooltip-effect="dark" stripe style="width: 100%">
            <aui-table-column label="操作" width="55" fixed>
              <template slot-scope="scope">
                <aui-popover ref="popover1" placement="bottom-start" trigger="hover">
                  <ul>
                    <li class="pui-list-grid__oper-in-row-item" @click.stop="handleEdit(scope.row)">编辑</li>
                    <li class="pui-list-grid__oper-in-row-item" @click.stop="handleDelete(scope.row)">删除</li>
                  </ul>
                </aui-popover>
                <i class="pui-icon-fenlei" @click.stop v-popover:popover1></i>
              </template>
            </aui-table-column>
            <aui-table-column prop="title" label="标题" sortable="custom" show-overflow-tooltip></aui-table-column>
            <aui-table-column label="类型" sortable="custom" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.type == 'CONTENT'">内容</span>
                <span v-if="scope.row.type == 'CUSTOM_TEXT'">文本</span>
                <span v-if="scope.row.type == 'CHART'">图表</span>
                <span v-if="scope.row.type == 'LIST_SIMPLE'">列表(简洁)</span>
                <span v-if="scope.row.type == 'LIST'">列表(标准)</span>
                <span v-if="scope.row.type == 'LIST_CUSTOM'">列表(自定义)</span>
                <span v-if="scope.row.type == 'CUSTOM_URL'">自定义(链接)</span>
                <span v-if="scope.row.type == 'CUSTOM_COMPONENT'">自定义(组件)</span>
              </template>
            </aui-table-column>
            <aui-table-column prop="lastUpdateTime" label="最后更新时间" sortable="custom" show-overflow-tooltip>\
              <template slot-scope="scope">
                {{scope.row.lastUpdateTime | timestampStringify}}
              </template>
            </aui-table-column>
            <aui-table-column prop="description" label="描述" sortable="custom" show-overflow-tooltip></aui-table-column>
          </aui-table>
        </div>
        <pui-pagination ref="pagination" style="margin:30px 0;" :datasource="{ 'currentPage': query.currentPage, 'pageSize': query.pageSize, 'reload':query.reload}" :totalRecord="totalRecord" v-show="totalRecord !== 0" @changeCurrentPage="changeCurrentPage" @changePageSize="changePageSize">
        </pui-pagination>
      </div>
    </div>
    
    
    <panel-form :isVisible="addShow" v-if="addShow" :editRow="editRow" @closeDialog="handleClose" @initView="initView"></panel-form>
  </div>
</template>
<script>
import panelForm from "./panelForm";
import { dashboardService } from "paas-web-utils/services";
export default {
  name: "PanelSetting",
  components: { panelForm },
  data() {
    return {
      heightStr: "35px",
      widthStr: "60px",
      searchTitle: "",
      searchType: "",
      addShow: false,
      editRow: null,
      totalRecord: 0,
      query: {
        currentPage: 1,
        pageSize: 10,
        reload:false,
      },
      typeOpt: [
        { value: "CONTENT", label: "内容" },
        { value: "CHART", label: "图表" },
        { value: "LIST_SIMPLE", label: "列表(简洁)" },
        { value: "LIST", label: "列表(标准)" },
        { value: "LIST_CUSTOM", label: "列表(自定义)" },
        { value: "CUSTOM_URL", label: "自定义(链接)" },
        { value: "CUSTOM_COMPONENT", label: "自定义(组件)" },
        { value: "CUSTOM_TEXT", label: "文本" }
      ],
      tableData: [],
      orderData: {
        sidx: "createTime",
        order: "DESC"
      }
    };
  },
  created() {
    this.$store.dispatch("adminNav/changeHeaderTitle", "面板管理");
    this.initView();
  },
  methods: {
    showDetail(row) {
      this.detailRow = row;
    },
    //查询
    handleSearch() {
      this.query.currentPage = 1;
      this.query.pageSize = 10;
      this.query.reload = false;
      this.initView();
    },
    //重置搜索条件
    clearSearch() {
      this.searchTitle = "";
      this.searchType = null;
      this.initView();
    },
    //获取列表数据
    initView() {
      let params = {
        searchKey: this.searchTitle,
        type: this.searchType,
        order: this.orderData.order,
        sidx: this.orderData.sidx,
        currentPage: this.query.currentPage,
        pageSize: this.query.pageSize
      };
      dashboardService.findPanelPage(params).then(data => {
        this.tableData = data.record;
        this.query.reload = true;
        this.totalRecord = data.totalRecord;
      });
    },
    // 改变顺序
    handleSortChange(data) {
      //console.log("this.handleSortChange.data",data);
      if (data.column === null || data.prop === null) {
        this.$set(this.orderData, "sidx", "createTime");
        this.$set(this.orderData, "order", "DESC");
      } else if(data.column.label==="类型") {
        this.$set(this.orderData, "sidx", "type");
        this.$set(this.orderData, "order", data.order === "ascending" ? "asc" : "desc");
      }  else {
        this.$set(this.orderData, "sidx", data.prop);
        this.$set(this.orderData, "order", data.order === "ascending" ? "asc" : "desc");
      }
      this.initView();
      console.log("改变顺序", data);
    },
    //创建
    handleAdd() {
      this.addShow = true;
    },
    //编辑
    handleEdit(row) {
      this.addShow = true;
      this.editRow = row;
    },
    //删除
    handleDelete(row) {
      this.$aui.confirm
        .show("确定删除吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let params = {
            panelId: row.id
          };
          dashboardService.removePanel(params).then(data => {
            this.initView();
          });
        })
        .catch(() => {});
    },
    //分页
    changeCurrentPage(currentPage) {
      this.query.currentPage = currentPage;
      this.initView();
    },
    changePageSize(pageSize) {
      this.query.pageSize = pageSize;
      this.initView();
    },
    //关闭对话框
    handleClose() {
      this.addShow = false;
      this.editRow = null;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~theme/mixins/mixins";
@import "~theme/mixins/utils";
@import "~theme/common/var";
// .pui-search {
//   margin: 20px 0;
//   .pui-search-label {
//     float: left;
//     width: 50px;
//     line-height: 36px;
//     margin: 0;
//   }
//   .pui-search-input,
//   .pui-search-select {
//     float: left;
//     width: 300px;
//     height: 36px;
//     margin-right: 40px;
//   }
// }
// .pui-list-grid__operations-wrapper {
//   margin: 20px 0;
// }
.pui-list-grid__oper-in-row-item {
  padding: 5px 10px;
  margin: 0 -12px;
  line-height: 24px;
  box-sizing: border-box;
  &:hover {
    background-color: #e5f9f7;
  }
}

//区分上下模块等
.pui-panel-setting {
  // background: $--body-bgcolor;
  & .pui-list-grid__top {
    background: $--inner-body-bgcolor;
    // padding: 20px 20px 20px 0;
    padding: 1.5% 1.5% 1.5% 0;
    box-sizing: border-box;
    @include utils-clearfix;
    & .pui-search__label {
      // width: 37%;
      width: 26%;
      display: inline-block;
      text-align: right;
    }
    & .aui-select,& .aui-input{
      // width:200px;
      // margin-left:10px;
      width: 58%;
      margin-left: 3%;
    }
    & .pui-search {
      display:inline-block;
      margin: 12px;
      width: 27%;
    }
    & .pui-panel-setting__operations {
      float: right;
      margin: 12px;
    }
  }
  & .pui-panel-setting__middle {
    background: $--body-bgcolor;
    height: 15px;
  }
  & .pui-panel-setting__main{
    // margin-top: 15px;
    background: $--inner-body-bgcolor;
    padding: 15px;
    box-sizing: border-box;
    & .pui-panel-setting__operations {
      margin-bottom: 15px;
    }
  }
  & .pui-panel-setting__operations {
    &>.pui-list-grid__oper {
      display: inline-block;
      line-height: 34px;
      padding: 0 15px !important;
      color:$--color-primary; 
      padding: 0 20px;
      font-size: $--font-size-base;
      &:hover {
        background-color: $--color-primary;
        color: $--color-white;
      }
    }
  }
}

/*表格样式*/
.pui-list-grid__table-wrapper /deep/ {
  .aui-table__header thead th {
    background:#FFF;
    height: 50px;
  }
  .aui-table th.is-leaf, .aui-table td {
    border-bottom: none;
  }
  .aui-table tr {
    // box-shadow: inset 0px -1px 0px 0px #E5EBF4, inset 0px 1px 0px 0px #E5E3F4;
    box-shadow:none;
  }
  .aui-table__header {
    border-top: 1px solid #E5EBF4;
    border-left: none;
    border-right: none;
    border-bottom:  1px solid #E5EBF4;
  }
  .aui-table__header thead th .cell {
    color: #909399;
    font-weight: bold;
  }
  .aui-table--striped .aui-table__body tr.aui-table__row--striped td {
    background: #f7f7f7;
  }
}

//表格中的操作样式
.pui-icon-fenlei {
  cursor: pointer;
  color: #C0CADA;
  // position: relative;
}
</style>


