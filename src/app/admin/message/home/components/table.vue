<template>
  <div>
    <aui-table class='table' ref="table" :data="formModel" tooltip-effect="dark" style="width: 100%" empty-text="暂无数据" stripe v-loading='loading.table' :row-key='getRowKey' @selection-change="handleSelectionChange" @sort-change="handleSortChange">
      <!-- 勾选 -->
      <aui-table-column type="selection" width="55" align='center' reserve-selection>
      </aui-table-column>
      <!-- 操作 -->
      <aui-table-column prop="operations" label="操作" width="55" fixed="left" align='center'>
        <template slot-scope="scope">
          <aui-popover ref="popover1" placement="bottom-start" popper-class="pui-list-grid_popover" trigger="hover">
            <ul>
              <li v-for="(item, index) in operation" :key="index" class="pui-list-grid__oper-in-row-item" @click="handleButtonClick(item.type, scope.$index)">
                {{item.label}}
              </li>
            </ul>
          </aui-popover>
          <i class="pui-icon-fenlei" @click.stop v-popover:popover1></i>
        </template>
      </aui-table-column>
      <!-- 列表内容 -->
      <aui-table-column v-for='item in formData' :prop="item.prop" :label="item.label" :key='item.prop' :sortable='item.sortable||false' :formatter='item.formatter' show-overflow-tooltip>
      </aui-table-column>
    </aui-table>
    <pagenation class='pagenation' style="margin:30px 0;"  @page='pageChange' :totalRecord='pageData.totalRecord' :currentPage='pageData.pageNow' :size='pageData.pageSize'></pagenation>
  </div>
</template>

<script>
import pagenation from "./pagination/pagination";
export default {
  components: {
    pagenation,
  },
  props: {
    listType: String,
  },
  data() {
    return {
      order: null,
      sidx: null,
      pageData: {
        totalRecord: 0,
        pageNow: 1,
        pageSize: 10
      },

      operation: [
        {
          label: "已读",
          type: "READ"
        },
        {
          label: "删除",
          type: "DELETE"
        }
      ],
      formData: [
        {
          prop: "name",
          label: "任务名称",
          sortable: "custom"
        },
        {
          prop: "moduleId",
          label: "所属模块",
          sortable: "custom",
          formatter: (row, column, cellValue) => {
            return this.moduleMap[cellValue] || cellValue;
          }
        },
        {
          prop: "status",
          label: "状态",
          sortable: "custom",
          formatter: (row, column, cellValue) => {
            let t = {
              ENABLE: "启用",
              DISABLE: "禁用"
            };
            return t[cellValue];
          }
        },
        {
          prop: "tiggerType",
          label: "触发类型",
          sortable: "custom",
          formatter: (row, column, cellValue) => {
            let t = {
              ADD: "新增数据",
              UPDATE: "更新数据",
              DELETE: "删除数据",
              CRON: "指定时间"
            };
            return t[cellValue] || cellValue;
          }
        },
        {
          prop: "createTime",
          label: "创建时间",
          sortable: "custom",
          formatter: (row, column, cellValue) => {
            let t = this.formatDate(cellValue)
            return cellValue === "" ? "" : t;
          }
        },
        {
          prop: "description",
          label: "描述",
          sortable: "custom"
        }
      ],
    }
  },
  methods: {
    handleButtonClick(type, index) {
      this.$emit('button-click', {
        type, 
        index,
        listType: this.listType,
      })
    },
    pageChange(data) {
      let type = data.type;
      let pageSize = data.pageSize;
      let pageNow;
      if (type === "page") {
        pageNow = data.pageNow;
      } else if (type === "size") {
        pageNow = 1;
      }
      this.findAllInPage({
        pageSize,
        pageNow
      });
    },
  }

}
</script>

<style lang="scss" scoped>
@import "~theme/mixins/mixins";
@import "~theme/mixins/utils";
@import "~theme/common/var";
@import "~theme/icon";

.pui-list-grid__oper {
  display: inline-block;
  line-height: 34px;
  padding: 0 15px !important;
  color: $--color-primary !important;
  padding: 0 20px;
  font-size: $--font-size-base;
  &:hover {
    background-color: $--color-primary;
    color: $--color-white !important;
  }
}
.choose-item {
  height: 30px;
  line-height: 30px;
  margin: 5px 0;
  .aui-icon-warning {
    color: #26b7ae;
  }
}
.table {
  margin-top: 15px;
}
.pui-list-grid__oper-in-row-item {
  padding: 5px 10px;
  margin: 0 -12px;
  line-height: 24px;
  box-sizing: border-box;
  &:hover {
    // background-color: $--color-primary;
    background-color: #e5f9f7;
    cursor: pointer;
    // color: $--color-white;
  }
  .pui-icon-fenlei {
    cursor: pointer;
    color: #c0cada;
    position: relative;
  }
  // .pagenation {
  //   margin: 30px 0;
  // }
}

//表格样式
.tablelist /deep/ {
  .aui-table__header thead th {
    background: #fff;
    height: 50px;
  }
  .aui-table th.is-leaf,
  .aui-table td {
    border-bottom: none;
  }
  .aui-table tr {
    // box-shadow: inset 0px -1px 0px 0px #E5EBF4, inset 0px 1px 0px 0px #E5E3F4;
    box-shadow: none;
  }
  .aui-table__header {
    border-top: 1px solid #e5ebf4;
    border-left: none;
    border-right: none;
    border-bottom: 1px solid #e5ebf4;
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
  color: #c0cada;
  // position: relative;
}
</style>
