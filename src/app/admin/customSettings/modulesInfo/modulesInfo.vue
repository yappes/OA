<template>
  <div class="pui-modulesInfo">
    <div class="pui-list-grid__top">
      <div class="pui-list-grid__operations-wrapper"><aui-button @click="handleAdd" class="pui-list-grid__oper">新增</aui-button></div>
      <aui-input @keyup.enter.native="enterKeyEvent()" size="medium" clearable class="pui-list-grid__fuzzy-search" placeholder="搜索" prefix-icon="aui-icon-search" v-model="fuzzyKey">
      </aui-input>
    </div>
    <div class="pui-list-grid__table-wrapper">
      <aui-table empty-text="暂无数据"  @row-click="showDetail"  @sort-change="handleSortChange" :data="tableData" stripe tooltip-effect="dark" style="width: 100%">
        <aui-table-column type="index" label="序号" minWidth="55" fixed></aui-table-column>
        <aui-table-column label="操作" minWidth="55" fixed>
          <template slot-scope="scope">
            <aui-popover ref="popover1" placement="bottom-start" trigger="hover">
              <ul>
                <li class="pui-list-grid__oper-in-row-item" @click.stop="handleSetting(scope.$index, scope.row)">模块配置管理</li>
                <li class="pui-list-grid__oper-in-row-item" @click.stop="handleEdit(scope.$index, scope.row)">编辑</li>
                <li class="pui-list-grid__oper-in-row-item" @click.stop="handleDelete(scope.$index, scope.row)">删除</li>
              </ul>
            </aui-popover>
            <i class="pui-icon-fenlei" @click.stop v-popover:popover1></i>
          </template>
        </aui-table-column>
        <aui-table-column prop="createTime" sortable=“custom” label="日期" show-overflow-tooltip width="200">
          <template slot-scope="scope">
            {{scope.row.createTime | timestampStringify}}
          </template>
        </aui-table-column>
        <aui-table-column prop="moduleName" label="模块名称" sortable=“custom” show-overflow-tooltip minWidth="200"></aui-table-column>
        <aui-table-column prop="phyModuleName" label="物理对象名称" sortable=“custom” show-overflow-tooltip minWidth="200">
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
    <pui-module-form v-if="showFormDialog" :editRow="editRow" :isEdit="isEdit" @refreshTable="getAllModules()" @closeDialog="handleCloseDialog" :show="showFormDialog"></pui-module-form>
    <pui-module-detail :detailRow="detailRow" :show="showDetailDialog" v-if="showDetailDialog" @closeDialog="handleCloseDetailDialog"></pui-module-detail>
  </div>
</template>

<script>
import { object } from "paas-web-utils/common/index.js";
import { modulesInfoService, viewService } from "paas-web-utils/services";
import puiModuleForm from "./moduleForm.vue";
import puiModuleDetail from "./moduleDetail";
export default {
  name: "ModulesInfo",
  components: { puiModuleForm, puiModuleDetail },
  data(){
    return {
      query: {
        currentPage: 1,
        order: "desc",
        pageSize: 10,
        sidx: "id",
        reload:false,
      },
      totalRecord: 0,
      editRow: null,
      detailRow:null,
      tableData: [],
      fuzzyKey: "",
      showFormDialog: false,
      isEdit: false,
      showDetailDialog: false
    };
  },
  methods: {
    showDetail(row) {
      this.detailRow = row;
      this.showDetailDialog = true;
    },
    //获取模块信息
    getAllModules() {
      let params = {
        "keyValue": this.fuzzyKey,
        "moduleName": null,
        "moduleCode": null,
        "isDelete": 0,
        "sidx": this.query.sidx,
        "order": this.query.order,
        "currentPage": this.query.currentPage,
        "pageSize": this.query.pageSize,
      }
      modulesInfoService.findModuleByPage(params).then(data => {
        this.tableData = data.dataList;
        this.query.reload = true;
        this.totalRecord = data.dataCount || 0;
      });
    },
     // 改变顺序
    handleSortChange(data) {
      //console.log("this.handleSortChange.data",data);
      if (data.column === null || data.prop === null) {
        this.$set(this.query, "sidx", "id");
        this.$set(this.query, "order", "desc");
      } else {
        this.$set(this.query, "sidx", data.prop);
        this.$set(this.query, "order", data.order === "ascending" ? "asc" : "desc");
      }
      this.getAllModules();
      console.log("改变顺序", data);
    },
    //模糊查询
    enterKeyEvent() {
      this.query.currentPage = 1;
      this.query.pageSize = 10;
      this.query.reload = false;
      this.getAllModules();
    },
    //打开新增
    handleAdd() {
      this.showFormDialog = true;
      this.isEdit = false;
    },
    //点击切换至模块配置页面
    handleSetting(index, row) {
      console.log("row",row);
      this.$router.push({
        path: '/admin/',
        name: 'modulesSetting',
        params: { id: row.id }
      });
      //  console.log("11",this.$router.params.id);
    },
    //打开编辑
    handleEdit(index, row) {
      this.editRow = row;
      this.showFormDialog = true;
      this.isEdit = true;
    },
    // //删除
    handleDelete(index, row) {
      console.log('gua  delete', row)
      this.findViewByModuleId(row.id).then(() => {
        console.log('then 模块内有视图')
      }).catch(err => {
        console.log('catch', err)
      })
      this.$aui.confirm
      .show('确定删除吗？删除将清空模块内所有信息', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        var moduleIds = [row.id];
        modulesInfoService.deleteModule({ moduleIds }).then(res => {
          this.getAllModules();
        });
      });
    },
    // 改变每页条数
    changePageSize(pageSize) {
      this.query.pageSize = pageSize;
      this.getAllModules();
    },

    // 改变当前页码
    changeCurrentPage(currentPage) {
      this.query.currentPage = currentPage;
      this.getAllModules();
    },
    //关闭对话框
    handleCloseDialog() {
      this.showFormDialog = false;
      this.isEdit = false;
      this.editRow = null;
    },
    handleCloseDetailDialog(){
      this.showDetailDialog = false;
    },
    findViewByModuleId(moduleId) {
      return viewService.findViewsByModuleId({
        moduleId,
        viewFlag: 0,
      }).then(data => {
        console.log('findViewByModuleId', data)
        if(data && data.length > 0) {
          return Promise.resolve()
        }
        return Promise.reject('模块内无视图')
      })
    },
  },
  created(){
    this.getAllModules();
    this.$store.dispatch("adminNav/changeHeaderTitle", "模块信息");
  }
};
</script>

<style lang="scss">
.aui-button {
  border-radius: 0;
}
/*表格样式*/
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
  /*dialog弹框*/
  .aui-dialog__body {
    overflow-x: auto;
  }
</style>

<style lang="scss" scoped>
  .pui-modulesInfo{
    @import "./modulesInfo.scss";
    // background: white;
    // padding:13px 20px;
  }
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
.delete-dialog{
  .aui-dialog{
    border-radius:10px;
    .aui-dialog__header{
      border-radius: 10px 10px 0 0;
    }
    .delete-text{
      font-size: 16px;
      padding: 20px 40px 0;
    }
  }
}
</style>


