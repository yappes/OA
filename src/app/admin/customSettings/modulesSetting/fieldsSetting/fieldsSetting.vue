<template>
  <div class="pui-fields-setting">
    <div class="pui-list-grid__top">
      <div class="pui-list-grid__operations-wrapper"><aui-button @click="handleAdd" class="pui-list-grid__oper">新增</aui-button></div>
      <aui-input @keyup.enter.native="enterKeyEvent()" size="medium" clearable class="pui-list-grid__fuzzy-search" placeholder="搜索" prefix-icon="aui-icon-search" v-model="fuzzyKey">
      </aui-input>
    </div>
    <div class="pui-list-grid__table-wrapper">
      <aui-table empty-text="暂无数据" :data="tableData" @sort-change="handleSortChange" tooltip-effect="dark" stripe style="width: 100%">
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
        <aui-table-column prop="createTime" sortable="custom" label="创建日期" show-overflow-tooltip width="200">
          <template slot-scope="scope">
            {{scope.row.createTime | timestampStringify}}
          </template>
        </aui-table-column>
        <aui-table-column prop="columnName" label="字段名称" sortable="custom" show-overflow-tooltip width="200"></aui-table-column>
        <aui-table-column prop="phyColumnName" label="物理字段名称" sortable="custom" show-overflow-tooltip>
        </aui-table-column>
        <aui-table-column prop="description" label="描述" sortable="custom" show-overflow-tooltip>
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

    <field-form v-if="showFormDialog"
    :editRow="editRow" :isEdit="isEdit" 
    @refreshTable="getTableData()" 
    @closeDialog="handleCloseDialog" 
    @clearEditRow="clearEditRow"
    :show="showFormDialog"
    :module="module"></field-form>
  </div>
</template>
<script>
import { columnService } from "paas-web-utils/services";
import fieldForm from "./fieldForm.vue"
export default {
  name: "PuiFieldsSetting",
  components: {fieldForm},
  data() {
    return {
      query: {
        "currentPage":1,
        "pageSize":10,
        "moduleId":this.module,
        "sidx":"createTime",
        "order":"DESC",
        "keyVal":"",
        "moduleCode":"",
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
  created(){
    this.getTableData();
  },
  methods: {
    //获取列表数据
    getTableData() {
      let params = this.query;
      columnService.findFieldsByPage(params).then(data => {
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
        this.$set(this.query, "sidx", "createTime");
        this.$set(this.query, "order", "DESC");
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
      this.query.keyVal = this.fuzzyKey;
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
    //删除数据
    handleDelete(index, row) {
      this.$aui.confirm
      .show('确定删除吗？', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        var columnId = row.id;
        columnService.deleteField({ columnId }).then(res => {
          this.getTableData();
        });
      })
      .catch(()=>{})
    },
    //清除editRow
    clearEditRow(){
      this.editRow = null;
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
.pui-fields-setting {
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

