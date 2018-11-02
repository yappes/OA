<template>
  <div class="pui-fields-setting">
    <div class="pui-list-grid__top">
      <div class="pui-list-grid__operations-wrapper"><span @click="handleAdd" class="pui-list-grid__oper">新增</span></div>
      <aui-input @keyup.enter.native="enterKeyEvent()" size="medium" clearable class="pui-list-grid__fuzzy-search" placeholder="搜索" prefix-icon="aui-icon-search" v-model="fuzzyKey">
      </aui-input>
    </div>
    <div class="pui-list-grid__table-wrapper">
      <aui-table :data="tableData" tooltip-effect="dark" style="width: 100%">
        <aui-table-column type="index" :index="changeIndex" label="序号" width="55" fixed></aui-table-column>
        <aui-table-column label="操作" width="55" fixed>
          <!-- <template slot-scope="scope">
            <i class="pui-icon-fenlei">
              <ul class="pui-list-grid__oper-in-row">
                <li class="pui-list-grid__oper-in-row-item" @click.stop="handleEdit(scope.$index, scope.row)">编辑</li>
                <li class="pui-list-grid__oper-in-row-item" @click.stop="handleDelete(scope.$index, scope.row)">删除</li>
              </ul>
            </i>
          </template> -->
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
        <aui-table-column prop="createTime" sortable label="创建日期" width="200">
          <template slot-scope="scope">
            {{scope.row.createTime | timestampStringify}}
          </template>
        </aui-table-column>
        <aui-table-column prop="columnName" label="字段名称" width="200"></aui-table-column>
        <aui-table-column prop="phyColumnName" label="物理字段名称">
        </aui-table-column>
        <aui-table-column prop="description" label="描述">
        </aui-table-column>
      </aui-table>
    </div>

    <pui-pagination
    ref="pagination" 
    style="margin:30px 0;" 
    :datasource="{ 'currentPage': query.currentPage, 'pageSize': query.pageSize}" 
    :totalRecord="totalRecord" 
    v-show="totalRecord !== 0"
    @changeCurrentPage="changeCurrentPage"
    @changePageSize="changePageSize">
    </pui-pagination>

    <field-form :editRow="editRow" :isEdit="isEdit" 
    @refreshTable="getTableData()" 
    @closeDialog="handleCloseDialog" 
    :show="showFormDialog"></field-form>
  </div>
</template>
<script>
import { columnService } from "paas-web-utils/services";
import fieldForm from "./fieldForm.vue"
export default {
  name: "PuiFieldsSetting",
  data() {
    return {
      query: {
        currentPage: 1,
        order: "desc",
        pageSize: 20,
        sidx: "id",
        keyVal: null,
      },
      editRow: null,
      tableData: [],
      totalRecord: 0,
      receiveCurrentPage: 1,
      fuzzyKey: "",
      showFormDialog: false,
      isEdit: false
    };
  },
  props: {
    moudle: {
      type: [Number, Object],
      default: null
    }
  },
  components: {fieldForm},
  watch: {
    moudle: {
      handler: function(newModlue) {
        if (newModlue && typeof newModlue === "object") {
          this.query.moduleId = newModlue.id || null;
          this.query.moduleCode = newModlue.moduleCode || null;
        } else {
          this.query.moduleId = newModlue;
        }
        this.fuzzyKey = null;
        this.getTableData();
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getTableData(params) {
      var params = params ? Object.assign({}, this.query, params) : this.query;
      columnService
        .findFieldsByPage(params)
        .then(data => {
          this.tableData = data.record;
          this.totalRecord = data.totalRecord || 0;
          this.receiveCurrentPage = data.currentPage || 1;
        });
    },
    enterKeyEvent() {
      this.query.currentPage = 1;
      this.query.keyVal = this.fuzzyKey;
      this.$refs.pagination.customCurrentPage();
      this.getTableData();
    },
    handleAdd() {
      this.showFormDialog = true;
      this.isEdit = false;
    },
    handleEdit(index, row) {
      this.editRow = row;
      this.showFormDialog = true;
      this.isEdit = true;
    },
    handleDelete(index, row) {
      var columnId = row.id;
      columnService.deleteField({ columnId }).then(res => {
        this.getTableData();
      });
    },
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
</style>

