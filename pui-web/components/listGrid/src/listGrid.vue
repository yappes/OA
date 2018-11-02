<template>
  <div class="pui-list-grid">
    <div class="pui-list-grid__top" v-if="isShowTop">
      <slot name="listGridOper"></slot>
     
      <aui-input v-if="isNeedRecordData" size="medium" clearable class="pui-list-grid__fuzzy-search" placeholder="搜索" prefix-icon="aui-icon-search" :value="datasource.fuzzyQueryVal" @input="fuzzyQuery">
      </aui-input>
      <!-- :isShowAlternative="isShowAlternative"  -->
      <pui-advanced-search class="pui-list-grid__top-advanced-search" v-if="isShowAdvanced"
        :advancedSearchDialog="advancedSearchDialog" 
        @select-tag="selectTag"
        :view-id="viewId"
        :select-tag-id="selectTagId"
        :module-id="moduleId">
      </pui-advanced-search> 
    </div>
    <div class="pui-list-grid__table-wrapper">
      <aui-table ref="multipleTable" 
        :data="recordData" stripe 
        v-if="!reloadAuiTable" 
        :height="height" 
        v-loading="datasource.reload" 
        empty-text="暂无数据" 
        style="width: 100%;z-index: 1" 
        :row-style="handleRowStyle" 
        :row-key="getRowKeys" 
        :highlight-current-row="!multiple" 
        @row-click="handleRowClick" 
        @selection-change="handleSelectionChange" 
        @sort-change="handleSortChange">
        <aui-table-column prop="id" type="selection" :reserve-selection="true" width="40" fixed="left" v-if="multiple">
        </aui-table-column>

        <aui-table-column prop="operations" label="操作" width="55" fixed="left" v-if="componentBtns.length" align='center'>
          <template slot-scope="scope">
            <aui-popover ref="popover1" placement="bottom-start" popper-class="pui-list-grid_popover" trigger="hover" :disabled="recordData[scope.$index].$btnsDisabled">
              <ul>
                <li v-for="item in filterBtns(recordData[scope.$index])" 
                  :key="item.$id" 
                  class="pui-list-grid__oper-in-row-item" 
                  @click="handleButtonClick(item, recordData[scope.$index])">
                  {{item.lable}}
                </li>
              </ul>
            </aui-popover>
            <i class="pui-icon-fenlei" @click.stop v-popover:popover1></i>
          </template>
        </aui-table-column>

        <aui-table-column type="index" :index="changeIndex" label="序号" width="55" fixed="left" align='center'></aui-table-column>

        <template v-for="col in columns">
          <aui-table-column 
            :key="col.$id" 
            :label="col.gridLabel" 
            :prop="col.gridKey" 
            v-if="!col.hidden" 
            min-width="200" 
            sortable=“custom”
            show-overflow-tooltip 
            :formatter="(row) => handleFormatter(row, col)"
            :align="align(col)">
          </aui-table-column>
        </template>

        <aui-table-column width="40" fixed="right" :render-header="columnSelection"></aui-table-column>
      </aui-table>
    </div>

    <pui-pagination ref="pagination" style="margin-top:30px;" :datasource="datasource" :totalRecord="totalRecord" v-show='totalRecord!==0'></pui-pagination>
    

    <!-- 字段选择 -->
    <pui-field-selection :columns="columns" :isDisplay="fieldSelectionVisible" v-show="fieldSelectionVisible" @change-column="reloadAuiTable = true" @reload-storage='changeColumn' @close-field-selection="fieldSelectionVisible = false">
    </pui-field-selection>
  </div>
</template>

<script>
import { businessService } from "paas-web-utils/services";
import axios from "axios"
export default {
  name: "PuiListGrid",
  props: {
    defaultSort: {
      type: Object,
      default: () => {
        return {
          order: "desc",
          sidx: "id"
        };
      }
    },
    datasource: Object,
    height: [String, Number],
    componentBtns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    columns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    multiple: {
      type: Boolean,
      default: true
    },
    rowStyle: {
      type: Function,
      default: () => {}
    },
    // 是否需要获取列表数据
    isNeedRecordData: {
      type: Boolean,
      default: true
    },
    // 是否展示顶部
    isShowTop: {
      type: Boolean,
      default: true
    },
    isShowAdvanced: {
      type: Boolean
    },
    moduleId: {},
    viewId: {},
    selectTagId: {},
  },
  watch: {
    reloadAuiTable(val) {
      if (val) {
        if (this.reloadAuiTableId) clearTimeout(this.reloadAuiTableId);
        this.reloadAuiTableId = setTimeout(() => {
          this.reloadAuiTable = false;
          delete this.reloadAuiTableId;
        }, 50);
      }
    },
    "datasource.reload": function(val) {
      //监听reload并刷新列表
      // console.log("reload",this);
      if (val === true) {
        setTimeout(() => {
          console.log(`reload viewId（${this.datasource.viewId}）`, this['_uid']);
          this.queryPageBusiness();
        });
      }
    },
    "datasource.viewId": function(viewId) {
      //监听viewId并刷新列表
      this.isNeedRecordData && setTimeout(() => {
        this.$set(this.datasource, "reload", true);
      });
    },
    // viewId(viewId) {
    //   this.loadData(viewId);
    // }
  },
  data() {
    return {
      receiveCurrentPage: 1,
      queryTimeout: null,
      totalRecord: 0, // 总记录数
      recordData: [], // 所有记录数据
      fieldSelectionVisible: false,
      reloadAuiTable: false,
      // isShowAlternative: false,
      advancedSearchDialog: false,
    };
  },

  mounted() {
    console.log(`reload viewId（${this.datasource.viewId}）`, this['_uid']);
    // 初始化数据
    this.isNeedRecordData && this.queryPageBusiness();
    // this.high();
    // if (this.viewId) {
    //   this.loadData(this.viewId);
    // }
    setTimeout(()=>{
      console.log("this.datasource",this.datasource);
      console.log("this. recordData",this.recordData);
    },500);
    
    
  },
  computed: {
    datasourceLoading() {
      if (this.datasource.url) {
        return datasource => {
          return axios
            .post(this.datasource.url, datasource)
            .then(res => res.data);
        };
      } else if (this.datasource.curModuleId) {
        return businessService.findBatchAll;
      } else {
        return businessService.pageBusiness;
      }
    }
  },

  methods: {
    align(col) {
      let isMoney = col.columnData.colMark === 'MONEY'
      let isPercentage = col.formatType === 'percentage'
      let isPermillage = col.formatType === 'permillage'
      if(isMoney || isPercentage || isPermillage) {
        return 'right'
      }
      return 'left'
    },
    changeColumn() {
      console.log('listGrid change-column')
      // reloadAuiTable = true
      this.$emit('column-change')
    },
    selectTag(tagId){
      this.$emit('select-tag', tagId);
    },
    fuzzyQuery(val) {
      this.$set(this.datasource, "fuzzyQueryVal", val);
      this.$set(this.datasource, "currentPage", 1);
      this.$refs.pagination.customCurrentPage();
      if (this.queryTimeoutId) {
        clearTimeout(this.queryTimeoutId);
      }
      this.queryTimeoutId = setTimeout(() => {
        this.isNeedRecordData && this.$set(this.datasource, "reload", true);
        delete this.queryTimeoutId;
      }, 800);
    },
    filterBtns(rowData){
      let btns = (this.componentBtns || []).filter((item) => {
        return !item.isHidden(rowData);
      });
      this.$set(rowData, "$btnsDisabled", btns.length === 0);
      return btns;
    },
    isHidden(rowData) {
      for (const item of this.componentBtns) {
        if (!item.isHidden(rowData)) {
          return false;
        }
      }
      return true;
    },
    columnSelection(h) {
      let vm = this;
      let config = {
        on: {
          click() {
            vm.openFieldSelection();
          }
        }
      };
      return <i class="pui-icon-shezhi1" style="cursor:pointer;" {...config} />;
    },
    // 请求列表数据
    queryPageBusiness() {
      this.datasourceLoading(this.datasource).then(
        data => {
          this.totalRecord = data.totalRecord;
          this.recordData = data.record;
          this.receiveCurrentPage = data.currentPage;
          this.$set(this.datasource, "reload", false);
        },
        () => {
          this.$set(this.datasource, "reload", false);
        }
      );
    },

    // 格式化列
    handleFormatter(row, col) {
      let value =  row[col.valKey];
      if (col.type && col.type.format) {
        if(col.columnData.colMark === "MONEY"){
          return col.type.format(value,col.columnData.decimalLen);
        }else{
          return col.type.format(value);
        }
      }
      if (value === null || value === "null") {
        return undefined;
      }
      return row[col.showValKey] || row[col.valKey];
    },

    // 获取row的key值
    getRowKeys(row) {
      return row.ID;
    },

    handleRowStyle({ rowIndex }) {
      if (this.rowStyle && this.recordData) {
        this.rowStyle(this.recordData[rowIndex]);
      }
    },

    // 行点击
    handleRowClick(row, event, column, index) {
      this.$emit(
        "row-click",
        this.recordData[index],
        this.$refs.multipleTable.toggleRowSelection
      );
    },

    // 勾选行
    handleSelectionChange: function(val) {
      let list = [];
      if (this.multiple) {
        list = val;
      } else {
        list.push(val);
      }
      this.$emit("selection-change", list);
    },

    // 取消勾选(父组件调用)
    cancelSelection() {
      if (this.multiple) {
        this.$refs.multipleTable.clearSelection();
      } else {
        this.$refs.multipleTable.setCurrentRow();
      }
    },

    // 改变顺序
    handleSortChange(data) {
      console.log("this.handleSortChange.data",data);
      console.log("this.recordData",this.recordData);
      if (data.column === null || data.prop === null) {
        this.$set(this.datasource, "sidx", this.defaultSort.sidx);
        this.$set(this.datasource, "order", this.defaultSort.order);
      } else {
        this.$set(this.datasource, "sidx", data.prop);
        this.$set(this.datasource, "order", data.order === "ascending" ? "asc" : "desc");
      }
      this.isNeedRecordData && this.$set(this.datasource, "reload", true);
      console.log("改变顺序", data);
    },

    // 打开字段选择对话框
    openFieldSelection() {
      this.fieldSelectionVisible = true;
    },

    // 改变序号
    changeIndex(index) {
      return (
        index + (this.receiveCurrentPage - 1) * this.datasource.pageSize + 1
      );
    },

    // 列表操作
    handleButtonClick(button, row) {
      this.$emit("button-click", button, row);
    },

    // 切换
    // handleToggle: function() {
    //   this.isShowAlternative = !this.isShowAlternative;
    // },
  },
};
</script>

<style lang="scss">
@import "./listGrid.scss";

</style>
