<template>
  <div class="pui-custom">
    <div class="pui-list-grid__top">
      <div class="pui-list-grid__operations-wrapper"><aui-button @click="handleAdd" class="pui-list-grid__oper">新增</aui-button></div>
      <aui-input @keyup.enter.native="enterKeyEvent()" size="medium" clearable class="pui-list-grid__fuzzy-search" placeholder="搜索" prefix-icon="aui-icon-search" v-model="fuzzyKey">
      </aui-input>
    </div>
    <div class="pui-list-grid__table-wrapper">
      <aui-table :data="tableData" tooltip-effect="dark" @sort-change="handleSortChange" stripe style="width: 100%"  empty-text="暂无数据">
        <aui-table-column label="操作" width="55" fixed>
          <template slot-scope="scope">
            <aui-popover ref="popover" placement="bottom-start" trigger="hover">
              <ul>
                <li class="pui-list-grid__oper-in-row-item" @click.stop="handleEdit(scope.$index, scope.row)">编辑</li>
                <li class="pui-list-grid__oper-in-row-item" @click.stop="handleDelete(scope.$index, scope.row)">删除</li>
              </ul>
            </aui-popover>
            <i class="pui-icon-fenlei" @click.stop v-popover:popover></i>
          </template>
        </aui-table-column>
        <aui-table-column type="index" :index="changeIndex" label="序号" width="55" fixed></aui-table-column>
        <aui-table-column prop="name" label="权限名称"  sortable=“custom” show-overflow-tooltip></aui-table-column>
        <aui-table-column prop="createTime"  sortable=“custom” label="创建时间" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.createTime | timestampStringify}}
          </template>
        </aui-table-column> 
        <aui-table-column prop="description" label="权限描述"  sortable=“custom” show-overflow-tooltip></aui-table-column>
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

    <pui-custom-edit v-if="showEditDialog" :editRow="editRow" :isEdit="isEdit" @getTableData="getTableData()" @closeDialog="handleCloseEdit"></pui-custom-edit>
  </div>
</template>
<script>
import { object } from "paas-web-utils/common/index.js";
import { customPermissionService } from "paas-web-utils/services";
import puiCustomEdit from "./customEdit.vue";
export default {
  name: "PuiCustom",

  components: { 
    puiCustomEdit,
  },

  data() {
    return {
      query: {
        pageSize: 20,
        currentPage: 1,
        order: "desc",
        sidx: "id",
        searchVal: null,
        reload:false,
      },
      tableData: [],
      totalRecord: 0,
      receiveCurrentPage: 1,
      editRow: null,
      detailRow:null,
      isEdit: false,
      fuzzyKey: '',
      showEditDialog: false,
    };
  },

  created() {
    this.getTableData();
    this.$store.dispatch("adminNav/changeHeaderTitle", "自定义权限");
  },

  methods: {
    getTableData(params) {
      var params = params ? Object.assign({}, this.query, params) : this.query;
      customPermissionService.findPermissionByPage(params).then(data => {
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

    handleAdd() {
      this.showEditDialog = true;
      this.isEdit = false;
    },

    handleEdit(index, row) {
      this.editRow = row;
      this.isEdit = true;
      this.showEditDialog = true;
    },

    handleDelete(index, row) {
      this.$aui.confirm
      .show('确定删除吗？', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        customPermissionService.deletePermission({ customPermissionId: row.id }).then(res => {
          this.getTableData();
        });
      });
    },

    // 关闭新增/编辑
    handleCloseEdit() {
      this.showEditDialog = false;
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
  },
};
</script>


<style lang='scss'>
@import "./custom.scss";
.aui-button {
  border-radius: 0;
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
