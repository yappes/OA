<template>
  <div class="pui-view-formulas-setting">
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
        <aui-table-column prop="formuleName"  sortable="custom" label="公式名称" show-overflow-tooltip></aui-table-column>
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
    
    <pui-view-formulas-edit v-if="showEditDialog" :editRow="editRow" :isEdit="isEdit" :moduleId="query.moduleId" @getTableData="getTableData" @closeDialog="handleCloseEdit"></pui-view-formulas-edit>
  </div>
</template>
<script>
import puiViewFormulasEdit from "./viewFormulasEdit.vue";
import { viewFormulaService } from "paas-web-utils/services";
export default {
  name: "PuiViewFormulasSetting",

  components: {
    puiViewFormulasEdit
  },

  data() {
    return {
      query: {
        moduleId: null,
        currentPage: 1,
        order: 'desc',
        pageSize: 20,
        sidx: 'id',
        searchVal: null,
        reload:false,
      },
      editRow: null,
      tableData: [],
      totalRecord: 0,
      receiveCurrentPage: 1,
      fuzzyKey: '',
      showEditDialog: false,
      isEdit: false
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
      var params = params ? Object.assign({}, this.query, params) : this.query;
      viewFormulaService.findViewFormulaByPage(params).then(data => {
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
      this.showEditDialog = true;
      this.isEdit = true;
    },

    handleDelete(index, row) {
      this.$aui.confirm
      .show('确定删除吗？', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        viewFormulaService.deleteViewFormula({ 
          entCode: '',
          userCode: '',
          formulaId: row.id 
        }).then(res => {
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
<style lang="scss" scoped>
.pui-view-formulas-setting {
  padding-bottom: 13px;
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
.pui-view-formulas-setting /deep/ {
  & .pui-view-formulas-edit__form  {
    padding: 0px 9% 0px 3%;
    min-width: 300px;
  }
}
</style>

