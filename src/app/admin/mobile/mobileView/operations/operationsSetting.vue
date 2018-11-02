<template>
  <div class="pui-operation-setting">
    <div class="pui-list-grid__top">
      <div class="pui-list-grid__operations-wrapper"><aui-button @click="handleAdd" class="pui-list-grid__oper">新增</aui-button></div>
      <aui-input @keyup.enter.native="enterKeyEvent()" size="medium" clearable class="pui-list-grid__fuzzy-search" placeholder="搜索" prefix-icon="aui-icon-search" v-model="fuzzyKey">
      </aui-input>
    </div>
    <div class="pui-list-grid__table-wrapper">
      <aui-table empty-text="暂无数据" :data="tableData" @sort-change="handleSortChange" stripe tooltip-effect="dark" style="width: 100%">
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
        <aui-table-column prop="operationName" label="操作名称"  sortable="custom" show-overflow-tooltip width="200"></aui-table-column>
        <aui-table-column prop="createTime"  sortable="custom" label="创建日期" show-overflow-tooltip width="200">
          <template slot-scope="scope">
            {{scope.row.createTime | timestampStringify}}
          </template>
        </aui-table-column>
        <aui-table-column label="操作类型" sortable="custom" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.type == 0">提交</span>
            <span v-if="scope.row.type == 1">新增</span>
            <span v-if="scope.row.type == 2">修改</span>
            <span v-if="scope.row.type == 3">删除</span>
            <span v-if="scope.row.type == 4">明细查询</span>
            <span v-if="scope.row.type == 5">流程提交</span>
            <span v-if="scope.row.type == 6">数据导入</span>
            <span v-if="scope.row.type == 7">批量操作</span>
            <span v-if="scope.row.type == 8">新增关联模块数据</span>
            <span v-if="scope.row.type == 9">提交确认</span>
            <span v-if="scope.row.type == 10">数据导出</span>
          </template>
        </aui-table-column>
        <aui-table-column label="状态"  sortable="custom" show-overflow-tooltip>
          <template slot-scope="scope" >
            <span v-if="scope.row.status == 1">禁用</span>
            <span v-if="scope.row.status == 0">启用</span>
          </template>
        </aui-table-column>
        <aui-table-column prop="description" label="描述"  sortable="custom" show-overflow-tooltip>
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

    <operation-form v-if="showFormDialog"
    :editRow="editRow" :isEdit="isEdit" 
    @refreshTable="getTableData()" 
    @closeDialog="handleCloseDialog" 
    @clearEditRow="clearEditRow"
    :show="showFormDialog"
    :module="module">
    </operation-form>
  </div>
</template>
<script>
import { operationService } from "paas-web-utils/services";
import operationForm from './operationForm'
export default {
  name: "PuiOperationSetting",
  components:{operationForm},
  data() {
    return {
      query: {
        "currentPage":1,
        "pageSize":10,
        "moduleId":this.module,
        "flag": 1,
        "opKeyValue":"",
        "sidx": "id",
        "order": "desc",
        "reload":false,
      },
      editRow: null,
      tableData: [],
      totalRecord: 0,
      receiveCurrentPage: 1,
      fuzzyKey: "",
      showFormDialog: false,
      isEdit: false,
    };
  },
  props: {
    module: {
      type: [Number, Object],
      default: null
    }
  },
  created(){
    this.getTableData();
  },
  watch: {
    //选择模块刷新列表数据
    module: {
      handler: function() {
        this.query.moduleId = this.module;
        this.query.currentPage = 1;
        this.query.pageSize = 10;
        this.query.reload = false;
        this.getTableData();
      },
    }
  },
  methods: {
    //获取列表数据
    getTableData() {
      let params = this.query;
      operationService.findOperationPage(params).then(data => {
          this.tableData = data.record;
          this.query.reload = true;
          this.totalRecord = data.totalRecord || 0;
          this.receiveCurrentPage = data.currentPage || 1;
        });
    },
     // 改变顺序
    handleSortChange(data) {
      //console.log("this.handleSortChange.data",data);
      if (data.column === null || data.prop === null) {
        this.$set(this.query, "sidx", "id");
        this.$set(this.query, "order", "desc");
      } else if(data.column.label==="状态") {
        this.$set(this.query, "sidx", "status");
        this.$set(this.query, "order", data.order === "ascending" ? "asc" : "desc");
      } else {
        this.$set(this.query, "sidx", data.prop);
        this.$set(this.query, "order", data.order === "ascending" ? "asc" : "desc");
      }
      this.getTableData();
      console.log("改变顺序", data);
    },
    //模糊搜索
    enterKeyEvent() {
      this.query.currentPage = 1;
      this.query.pageSize = 10;
      this.query.reload = false;
      this.query.opKeyValue = this.fuzzyKey;
      this.getTableData();
    },
    //打开新增
    handleAdd() {
      this.showFormDialog = true;
      this.isEdit = false;
    },
    //打开编辑
    handleEdit(index, row) {
      this.editRow = row;
      this.showFormDialog = true;
      this.isEdit = true;
    },
    //初始化表单
    clearEditRow(){
      this.editRow = null;
    },
    //删除数据
    handleDelete(index, row) {
      this.$aui.confirm
      .show('确定删除吗？', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        let params = {'id':row.id};
        operationService.removeOperation(params).then(res => {
          this.getTableData();
        });
      });
    },
    //关闭对话框
    handleCloseDialog() {
      this.showFormDialog = false;
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
    }
  }
};
</script>
<style lang="scss">
.pui-operation-setting {
  padding-bottom: 13px;
}
.pui-list-grid__oper-in-row-item {
  padding: 5px 10px;
  margin: 0 -12px;
  line-height: 24px;
  cursor: pointer;
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
    .delete-text{
      font-size: 16px;
      padding: 20px 40px 0;
    }
  }
}

</style>

