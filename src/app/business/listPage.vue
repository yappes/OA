<template>
  <div class="pui-listPage">
    <pui-layout style="margin-bottom:15px">
      <pui-nav-top slot="nav"></pui-nav-top>
      <pui-breadcrumb slot="topBar" :view-id="view.$id" :module-id="view.moduleId" :select-tag-id="proxy.datasource.tagId" @select-tag="selectTag"></pui-breadcrumb>
      <pui-list-grid slot="full" ref="listGrid" 
        :style="{minHeight:minHeight}"
        :isShowAdvanced="isShowAdvanced"
        :componentBtns="view.operations.component" 
        :columns="view.columns" 
        :datasource="view.datasource" 
        :default-sort="view.sort"
        :rowStyle="rowStyleProxy" 
        @row-click="handleRowClick" 
        @selection-change="handleSelectionChange" 
        @button-click="handleButtonClick"
        @column-change='setStorageData'
        :view-id="view.$id" :module-id="view.moduleId" :select-tag-id="proxy.datasource.tagId" @select-tag="selectTag">
        <pui-list-grid-oper slot="listGridOper" :buttons="view.operations.buttons" :columns="view.columns" @button-click="handleButtonClick">
        </pui-list-grid-oper>
      </pui-list-grid>
    </pui-layout>

    <!-- 批量修改:start -->
    <aui-dialog :close-on-click-modal="false" :title="batchDialogTitle" :visible.sync="batchDialogVisible">
      <pui-dialog-module :view="proxy.batchDialogView" ref="dialogModule" v-if="proxy.batchDialogView"></pui-dialog-module>
      <div slot="footer" class="dialog-footer" v-if="proxy.batchDialogView">
        <aui-button @click="batchDialogVisible = false">取 消</aui-button>
        <aui-button v-for="(operation, $index) in proxy.batchDialogView.operations" 
          :type="$index === proxy.batchDialogView.operations.length - 1 ? 'primary' : ''" 
          @click="operation.triggerClick($refs.dialogModule)"
          :key="operation.$id" :loading="operation.loadingStatus">{{operation.lable}}</aui-button>
      </div>
    </aui-dialog>
    <!-- 批量修改:end -->

    <!-- 数据导出:start -->
    <aui-dialog :close-on-click-modal="false" title="数据导出" :visible.sync="exportDialogVisible" class="pui-business-export-dialog">
      <aui-step :active="exportActive" finish-status="success">
        <aui-step-item title="设置" description="设置需要导出的字段信息"></aui-step-item>
        <aui-step-item title="导出" description="数据正在导出请稍等"></aui-step-item>
        <aui-step-item title="下载" description="已经导出成功请下载"></aui-step-item>
      </aui-step>
      <div v-show="exportActive === 0" style="margin: 15px 0;">
        <aui-row>
          <aui-col style="margin: 15px 0;">
            <aui-checkbox :indeterminate="exportIsIndeterminate" v-model="exportCheckAll" @change="handleExportCheckAllChange">全选</aui-checkbox>
          </aui-col>
          <aui-checkbox-group v-model="exportCheckedColumns" @change="handleExportCheckChange">
            <aui-col :xs="12" :sm="12" :md="8" :lg="6" v-for="column in view.columns" :key="column.$id">
              <aui-checkbox :label="column.$id">{{column.gridLabel}}</aui-checkbox>
            </aui-col>
          </aui-checkbox-group>
        </aui-row>
      </div>
      <div v-show="exportActive == 1" style="margin: 30px 15px 0px 15px;">
        <aui-progress :show-text="false" :percentage="exportPercentage" :status="exportPercentageStatus"></aui-progress>
        <div v-show="exportPercentageStatus === 'exception'" style="margin-top: 15px;">
          <aui-alert title="数据导出错误，请联系管理员" type="error" :closable="false"></aui-alert>
        </div>
      </div>
      <div v-show="exportActive === 2" style="margin: 15px 20px;">
        点击下载<a :href="exportFilePath" ref="fileAE" target="fileDownloadWindow">{{view.title}}</a>导出数据
      </div>
      <div slot="footer" class="dialog-footer">
        <aui-button @click="exportDialogVisible = false" v-show="exportActive !== 2">取 消</aui-button>
        <aui-button type="primary" v-show="showLoadingBtn" @click="handleExport" :loading="isLoading">{{isLoading ? '导出中' : "确认导出"}}</aui-button>
        <aui-button type="primary" @click="handleExportNext" v-show="!showLoadingBtn && exportActive !== 2">下一步</aui-button>
        <aui-button @click="exportDialogVisible = false" v-show="exportActive === 2">关 闭</aui-button>
        <aui-button type="primary" @click="fileDownloadWindow" v-show="exportActive === 2">下 载</aui-button>
      </div>
    </aui-dialog>
    <!-- 数据导出:end -->
  </div>
</template>
<script>
import { businessService } from "paas-web-utils/services";
import { HTTP_CONFIG } from "paas-web-utils/common/http.js";
const STORAGE_PREFIX = 'business:listPage:viewId:'
export default {
  name: "listPage",
  props: {
    view: {
      type: Object,
      default: function() {
        return {
          $id: 137,
          datasource: {}
        };
      }
    }
  },
  data() {
    return {
      proxy: {
        datasource: {},
        batchDialogView: {}
      },
      batchDialogVisible: false,
      batchDialogTitle: '加载中',
      exportActive: 0,
      exportPercentageStatus: undefined,
      exportFilePath: "http://www.baidu.com",
      exportPercentage: 0,
      exportCheckAll: false,
      showLoadingBtn: false,
      isLoading: false,
      exportDialogVisible: false,
      exportIsIndeterminate: false,
      exportCheckedColumns: [],
      selectionrecordData: [],
      minHeight: '',
      isShowAdvanced: true
    };
  },
  mounted() {
    // this.$set(this.proxy, "datasource", this.view.datasource);
    // this.initStorageData()
    this.high();
    if(this.view.viewData.defaultSearchTagId){
      this.$set(this.proxy.datasource, "tagId", this.view.viewData.defaultSearchTagId)
    }
    console.log('mounted', this.proxy.datasource)
  },
  methods: {
    selectTag(tagId) {
      if (this.proxy.datasource.tagId === tagId) {
        this.proxy.datasource.tagId = undefined;
      } else {
        this.proxy.datasource.tagId = tagId;
      }
      //选择tag时当前页应设置为1
      this.$set(this.proxy.datasource, "currentPage", 1);
      this.$set(this.proxy.datasource, "reload", true);
    },

    // row-style 处理方法
    rowStyleProxy(val) {
      this.view.rowStyle(val);
    },

    // 勾选行
    handleSelectionChange(list) {
      this.selectionrecordData = list;
      this.view.$emit("update", this.view, list);
    },

    // 行点击
    handleRowClick(row) {
      this.view.rowClick(this, row);
      console.log('clickRow', this.view.rowClick)
    },

    // 按钮点击事件
    handleButtonClick(button, row) {
      if (row === "SELECT_DATA_LIST") {
        row = this.selectionrecordData;
      }
      console.log('click button', row, this.$refs.listGrid.recordData)
      console.log(button.type)
      button.triggerClick(this, row, this.$refs.listGrid.recordData);
    },

    fileDownloadWindow(){
      this.$refs.fileAE.click();
    },

    openBatchDialog(view, data){
      this.batchDialogTitle = view.title;
      this.$delete(this.proxy, 'batchDialogView');
      setTimeout(() => {
        this.$set(this.proxy, 'batchDialogView', view);
        this.batchDialogVisible = true;
      }, 50);
    },

    openExportDialog() {
      this.exportActive = 0;
      this.exportPercentage = 0;
      this.showLoadingBtn = false;
      this.isLoading = false;
      this.exportCheckAll = true;
      this.exportPercentageStatus = undefined;
      this.handleExportCheckAllChange(true);
      this.exportDialogVisible = true;
    },

    handleExportCheckAllChange(val) {
      this.exportCheckedColumns = val ? this._l(this.view.columns, column => column.$id) : [];
      this.exportIsIndeterminate = false;
    },

    handleExportCheckChange(value) {
      let checkedCount = value.length;
      this.exportCheckAll = checkedCount === this.view.columns.length;
      this.exportIsIndeterminate =
        checkedCount > 0 && checkedCount < this.view.columns.length;
    },

    handleExportNext() {
      this.exportActive = this.exportActive + 1;
      this.showLoadingBtn = false;
      switch (this.exportActive) {
        case 1:
          this.showLoadingBtn = true;
          break;
      }
    },
    formatUrl(url) {
      let http = HTTP_CONFIG.mapping.file
      let include = url.indexOf(http) > -1
      if(include) {
        return url
      }
      return http + url
    },
    handleExport() {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$intervalId = setInterval(() => {
        if (
          !this.isLoading ||
          !this.exportDialogVisible ||
          this.exportPercentage >= 100
        ) {
          clearInterval(this.$intervalId);
          return;
        }
        if (this.exportPercentage <= 30) {
          this.exportPercentage += 3;
          return;
        }
        if (this.exportPercentage <= 50) {
          this.exportPercentage += 2;
          return;
        }
        if (this.exportPercentage <= 70) {
          this.exportPercentage += 1;
          return;
        }
        if (this.exportPercentage < 85) {
          this.exportPercentage += 0.5;
          return;
        }
        if (this.exportPercentage < 95) {
          this.exportPercentage += 0.1;
          return;
        }
      }, 500);
      businessService.export({
          viewId: this.view.$id,
          sidx: this.proxy.datasource.sidx,
          order: this.proxy.datasource.order,
          tagId: this.proxy.datasource.tagId,
          searchList: this.proxy.datasource.searchList,
          fuzzyQueryVal: this.proxy.datasource.fuzzyQueryVal,
          searchColumnIdList: this.exportCheckedColumns
        }).then(data => {
          // this.exportFilePath = data.url;
          this.exportFilePath =this.formatUrl(data.url);
          this.exportPercentageStatus = "success";
          this.exportPercentage = 100;
          setTimeout(() => {
            this.handleExportNext();
          }, 1000);
        })
        .catch(() => {
          this.exportPercentage = 100;
          this.exportPercentageStatus = "exception";
        });
    },
    //listGrid最小高度
    high() {
      this.minHeight = window.innerHeight - 48 - 50 -30 + "px" ;
    },
    setStorage(key, item) {
      let s = JSON.stringify(item)
      window.sessionStorage.setItem(key, s)
    },
    getStorage(key) {
      let s = window.sessionStorage.getItem(key)
      return JSON.parse(s)
    },
    initStorageData() {
      let viewId = String(this.view.$id)
      let key = STORAGE_PREFIX + viewId
      let data = this.getStorage(key)
      if(data) {
        this.view.datasource = data.datasource
        this.view.columns.forEach(col => {
          data.columnStatus.forEach(e => {
            if(e.id === col.$id) {
              col.hidden = e.hidden
            }
          })
        })
      }
      this.$set(this.proxy, "datasource", this.view.datasource);
    },
    setStorageData() {
      // console.log('setStorageData columns', this.view.columns)
      let viewId = String(this.view.$id)
      let datasource = this.view.datasource
      let columnStatus = this.view.columns.map(col => {
        return {
          id: col.$id,
          hidden: col.hidden,
        }
      })
      // console.log('setStorageData', this.view.columns)
      let data = {
        viewId,
        datasource,
        columnStatus,
      }
      let key = STORAGE_PREFIX + viewId
      this.setStorage(key, data)
    },
  },
  watch: {
    'view.datasource': {
      deep: true,
      handler() {
        this.setStorageData()
      }

    }
  },
  // updated() {
  //   this.$nextTick(() => {
  //     this.setStorageData()
  //   })
  //   console.log('listPage updated')
  // },
  created() {
    // console.log('listPage created')
    this.initStorageData()
  }
};
</script>

<style lang='scss'>
.pass-listPage {
  width: 100%;
}
.pui-business-export-dialog {
  & .aui-dialog__body {
    overflow-x: auto;
  }
}
</style>
