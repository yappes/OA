<template>
  <div class="pui-home-page-setting">
    <div style="margin:-13px -20px">
      <div class="pui-list-grid__top">
        <div class="pui-search">
          <!-- <p class="pui-search-label">标题:</p> -->
          <label for="search1"  class="pui-search__label">标题：</label>
          <aui-input v-model="searchTitle" size="medium" clearable id="search1" class="pui-search-input" placeholder="请输入搜索标题">
          </aui-input>
        </div>
        <div class="pui-search">
          <!-- <p class="pui-search-label">状态:</p> -->
          <label for="search2"  class="pui-search__label">状态：</label>
          <aui-select v-model="status" placeholder="请选择" id="search2" clearable class="pui-search-select">
            <aui-option v-for="item in statusOpt" :key="item.value" :label="item.label" :value="item.value">
            </aui-option>
          </aui-select>
        </div>
        <!-- <aui-button class="pui-list-grid__oper" type="primary" plain @click="handleSearch">搜索</aui-button>
        <aui-button class="pui-list-grid__oper" @click="clearSearch">重置</aui-button> -->
        <div class="pui-home-page-setting__operations">
          <pui-btn @click="handleSearch" :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper">搜索</pui-btn>
          <pui-btn @click="clearSearch" :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper">重置</pui-btn>
        </div>
      </div>
      <div class="pui-home-page-setting__middle"></div>
      <div class="pui-home-page-setting__main">
        <div class="pui-home-page-setting__operations">
          <pui-btn  @click="handleAdd" :heightStr="heightStr" :widthStr="widthStr" class="pui-list-grid__oper">创建</pui-btn>
        </div>
        <div class="pui-list-grid__table-wrapper">
          <aui-table empty-text="暂无数据" @row-click="showDetail" :data="tableData"  @sort-change="handleSortChange"  tooltip-effect="dark" stripe style="width: 100%" @selection-change="handleSelectionChange">
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
            <aui-table-column prop="name" label="标题" sortable="custom" show-overflow-tooltip></aui-table-column>
            <aui-table-column label="状态" sortable="custom" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.status == 'ENABLE'">启用</span>
                <span v-if="scope.row.status == 'DISENABLE'">禁用</span>
              </template>
            </aui-table-column>
            <aui-table-column prop="createTime" sortable="custom" label="创建时间" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.createTime | timestampStringify}}
              </template>
            </aui-table-column>
            <aui-table-column prop="description" label="描述" sortable="custom" show-overflow-tooltip></aui-table-column>
          </aui-table>
        </div>
        <pui-pagination ref="pagination" style="margin:30px 0;" :datasource="{ 'currentPage': query.currentPage, 'pageSize': query.pageSize, 'reload':query.reload}" :totalRecord="totalRecord" v-show="totalRecord !== 0" @changeCurrentPage="changeCurrentPage" @changePageSize="changePageSize">
        </pui-pagination>
      </div>

    </div>

  </div>
</template>

<script>
import { dashboardService } from "paas-web-utils/services";
export default {
  name: "PuiHomePageSetting",
  data() {
    return {
      heightStr: "35px",
      widthStr: "60px",
      searchTitle: "",
      status: null,
      totalRecord: 0,
      query: {
        currentPage: 1,
        pageSize: 10,
        reload:false,
      },
      statusOpt: [
        { value: "ENABLE", label: "启用" },
        { value: "DISENABLE", label: "禁用" }
      ],
      tableData: [],
      orderData: {
        sidx: "createTime",
        order: "DESC"
      }
    };
  },
  created() {
    this.$store.dispatch("adminNav/changeHeaderTitle", "主页管理");
    this.initView();
  },
  methods: {
    showDetail(row) {
      this.detailRow = row;
    },
    //获取列表数据
    initView() {
      let params = {
        searchKey: this.searchTitle,
        status: this.status,
        order: this.orderData.order,
        sidx: this.orderData.sidx,
        currentPage: this.query.currentPage,
        pageSize: this.query.pageSize
      };
      dashboardService.findDashboardList(params).then(data => {
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
      } else if(data.column.label==="状态") {
        this.$set(this.orderData, "sidx", "status");
        this.$set(this.orderData, "order", data.order === "ascending" ? "asc" : "desc");
      } else {
        this.$set(this.orderData, "sidx", data.prop);
        this.$set(this.orderData, "order", data.order === "ascending" ? "asc" : "desc");
      }
      this.initView();
      console.log("改变顺序", data);
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
      this.status = null;
      this.initView();
    },
    //启用
    handleUse() {},
    //禁用
    handleBan() {},
    //创建
    handleAdd() {
      this.$router.push({
        name: "dashboardEdit",
        params: { homepageType: "system", viewId: 0 }
      });
    },
    handleSelectionChange(value) {
      console.log(value);
    },
    //编辑
    handleEdit(row) {
      this.$router.push({
        name: "dashboardEdit",
        params: { homepageType: "system", viewId: row.id }
      });
    },
    //删除
    handleDelete(row) {
      console.log(row);
      this.$aui.confirm
        .show("确定删除吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let params = {
            id: row.id
          };
          dashboardService.deleteDashboard(params).then(data => {
            console.log("删除成功");
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./homePageSetting.scss";

// .pui-search {
  // .pui-search-label {
    // float: left;
    // width: 50px;
    // line-height: 36px;
    // margin: 0;
  // }
  // .pui-search-input,
  // .pui-search-select {
  //   float: left;
  //   width: 300px;
  //   height: 36px;
  //   margin-right: 40px;
  // }
// }
.pui-list-grid__operations-wrapper {
  margin: 20px 0;
}
.pui-list-grid__oper-in-row-item {
  padding: 5px 10px;
  margin: 0 -12px;
  line-height: 24px;
  box-sizing: border-box;
  &:hover {
    background-color: #e5f9f7;
  }
}
</style>

