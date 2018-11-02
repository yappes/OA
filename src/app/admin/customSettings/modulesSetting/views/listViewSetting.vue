<template>
  <div class="pui-list-view-setting">
    <aui-dialog :close-on-click-modal="false" class="pui-list-view-setting-dialog" style="top: 49px;" :modal="false" :show-close="false" :visible="isVisible" width="100%" top="0">
      <header slot="title" class="pui-list-view-setting-dialog__header">
        <span class="view-name">{{editRow.viewName}}</span>
        <pui-btn heightStr="34px" padding="0 20px" @click="handleCancel">取消</pui-btn>
        <pui-btn heightStr="34px" padding="0 20px" type="primary" @click="handleSave">保存布局</pui-btn>
      </header>
      <section class="pui-list-view-setting-dialog__section" v-loading="loading">
        <div class="pui-content-wrapper">
          <div class="pui-content-wrapper__title">编辑列</div>
          <div class="pui-content-wrapper__content">
            <div class="left">
              <div class="title">
                <span>全部列（单击选择）</span>
                <pui-btn heightStr="30px" padding="0 20px" type="primary" @click="handleSelectAll">全部添加</pui-btn>
              </div>
              <div class="columns-list-wrapper" v-for="(group, index) in columnList" :key="index">
                <div class="columns-list-group-name">{{group.name}}</div>
                <ul class="columns-list">
                  <li class="columns-item" :class="{ 'selected': col.selected }" v-for="col in group.list" :key="col.id" @click="handleSelectCol(col)">
                    {{col.columnName}}
                  </li>
                </ul>
              </div>
            </div>
            <div class="right">
              <div class="title">
                <span>已选列（上下拖动调整显示顺序）</span>
                <pui-btn heightStr="30px" padding="0 20px" type="primary" @click="handleRemoveAll">全部移除</pui-btn>
              </div>
              <ul class="columns-list">
                <li class="columns-item" v-for="(col, index) in selectedList" :key="col.id" draggable="true" @dragstart="dragstartEvent(index, $event)" @dragend="dragendEvent" @dragenter="dragenterEvent(index, $event)" @dragover="dragoverEvent">
                  <aui-checkbox v-model="col.isShow">
                    <span>{{col.columnName}}</span>
                    <span v-if="col.isSort && reqData.orderType == 'asc'">↑</span>
                    <span v-if="col.isSort && reqData.orderType == 'desc'">↓</span>
                  </aui-checkbox>
                  <div class="btns">
                    <span class="cancel-btn aui-icon-delete" @click.stop="handleCancelSelected(col, index)"></span>
                    <aui-popover popper-class="setting-popover" placement="bottom-end" trigger="hover">
                      <aui-checkbox v-model="col.isRequired" label="是否必填" v-if="viewType == 7 || viewType == 6" @change="handleSortChange(col.isSort, col)"></aui-checkbox>
                      <aui-checkbox v-model="col.isSearch" label="是否可查询" v-if="viewType == 1"></aui-checkbox>
                      <aui-checkbox v-model="col.isFuzzyQuery" label="是否可模糊搜索" v-if="viewType == 1"></aui-checkbox>
                      <aui-checkbox v-model="col.isSort" :disabled="col.isSortDisabled" label="是否可排序" v-if="viewType == 1" @change="handleSortChange(col.isSort, col)"></aui-checkbox>
                      <aui-radio-group v-if="viewType == 1 && col.isSort" v-model="reqData.orderType">
                        <aui-radio :label="'asc'">升序</aui-radio>
                        <aui-radio :label="'desc'">降序</aui-radio>
                      </aui-radio-group>
                      <span class="setting-btn aui-icon-setting" @click.stop slot="reference"></span>
                    </aui-popover>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </aui-dialog>

    <aui-dialog :close-on-click-modal="false" title="保存视图" show-full-icon @hide="closeSaveDialog" :visible="isSaveDialog" width="60%" class="save-list-view-dialog">
      <aui-form :model="reqData" :rules="rules" ref="form" label-width="150px">
        <aui-form-item label="视图名称" prop="viewName">
          <aui-input v-model="reqData.viewName"></aui-input>
        </aui-form-item>

        <aui-form-item label="查询条件" prop="searchTag" v-if="viewType == 1" class="search-tag-item">
          <aui-row>
            <aui-col :span="21">
              <aui-select v-model="reqData.searchTag" multiple placeholder="请添加" @remove-tag="deleteSearchTag" :popper-append-to-body="false">
                <aui-option v-for="item in searchConditionList" :key="item.id" :label="item.tagName" :value="String(item.id)"></aui-option>
              </aui-select>
            </aui-col>
            <aui-col :span="2" :offset="1">
              <aui-button v-popover:tag icon="aui-icon-plus" style="width: 100%;" type="info" plain @click="handleOpenConfigSearch"></aui-button>
            </aui-col>
          </aui-row>
        </aui-form-item>

        <aui-form-item label="默认查询条件" prop="defaultSearchTagId" v-if="viewType == 1">
          <aui-select v-model="reqData.defaultSearchTagId" placeholder="请选择">
            <aui-option v-for="item in searchConditionList" :key="item.id" :label="item.tagName" :value="String(item.id)"></aui-option>
          </aui-select>
        </aui-form-item>

        <aui-form-item label="可修改数据关联模块" prop="editRelatedModule">
          <aui-select v-model="reqData.editRelatedModule" multiple placeholder="请选择">
            <aui-option v-for="item in editRelatedModuleList" :key="item.id" :label="item.moduleName" :value="String(item.id)"></aui-option>
          </aui-select>
        </aui-form-item>

        <aui-form-item label="过滤条件" prop="viewDataConds">
          <aui-input v-model="reqData.viewDataConds.title" clearable @change="clearViewDataConds">
            <aui-button slot="append" icon="aui-icon-edit" @click="handleOpenFilter"></aui-button>
          </aui-input>
        </aui-form-item>
        <aui-form-item label="启用数据权限" prop="dpEnable" v-if="viewType == 1">
          <aui-radio-group v-model="reqData.dpEnable">
            <aui-radio :label="'TRUE'">是</aui-radio>
            <aui-radio :label="'FALSE'">否</aui-radio>
          </aui-radio-group>
        </aui-form-item>
        <aui-form-item label="配置公式" prop="viewFormulaIds" v-if="viewType == 7 || viewType == 6">
          <aui-select v-model="reqData.viewFormulaIds" multiple placeholder="请选择">
            <aui-option v-for="item in viewFormulaList" :key="item.id" :label="item.formuleName" :value="String(item.id)"></aui-option>
          </aui-select>
        </aui-form-item>
        <aui-form-item label="描述" prop="description">
          <aui-input type="textarea" v-model="reqData.description"></aui-input>
        </aui-form-item>
      </aui-form>
      <div slot="footer" class="dialog-footer">
        <aui-button @click="closeSaveDialog">取消</aui-button>
        <aui-button type="primary" @click="submitForm('form')">确定</aui-button>
      </div>
    </aui-dialog>

    <aui-popover placement="bottom-end" trigger="manual" width="620" ref="tag" v-model="isConfigSearch" popper-class="search-popover" @hide="closeConfigSearchDialog">
      <aui-form :model="configSearchData" :rules="configSearchRules" ref="configSearchform" class="config-search-form" label-width="100px">
        <aui-form-item label="标签名称" prop="tagName">
          <aui-input v-model="configSearchData.tagName"></aui-input>
        </aui-form-item>
        <template v-for="(item, index) in configSearchData.searchs">
          <aui-form-item :key="index" :label="index > 0 ? '' : '查询条件'" :prop="'searchs[' + index + '].columnId'" :rules="{ required: true, validator: validateSourceColumnId, trigger: 'change'}">
            <div class="condition-list">
              <aui-select class="inline-block-item" v-model="item.columnId" placeholder="请选择" clearable @change="(value) => handleColumnChange(item, value)">
                <aui-option-group v-for="(group, index) in sourceColumns" :key="index" :label="group.name">
                  <aui-option v-for="col in group.list" :key="col.id" :label="col.columnName" :value="col.moduleCode+'.'+col.phyColumnName"></aui-option>
                </aui-option-group>
              </aui-select>
              <aui-select class="inline-block-item" v-model="item.searchType" placeholder="请选择">
                <aui-option v-for="(item, index) in conditionTypeList" :key="index" :label="item.label" :value="String(item.value)"></aui-option>
              </aui-select>
              <pui-input-adaptive class="input-adaptive inline-block-item" style="width: 30%;" :column="columnMaps[item.columnId]" :condition-type="item.searchType" :batch="true" v-if="columnMaps[item.columnId]" v-model="item.screenVal">
              </pui-input-adaptive>
              <aui-input class="inline-block-item" v-model="item.screenVal" v-else></aui-input>
              <div class="condition-btns-group">
                <span class="condition-btns" v-if="index == configSearchData.searchs.length - 1" @click="handleAddCondition">+</span>
                <span class="condition-btns" v-if="configSearchData.searchs.length != 1" @click="handleReduceCondition(index)">-</span>
              </div>
            </div>
          </aui-form-item>
        </template>
      </aui-form>
      <div style="text-align: right; margin: 0">
        <aui-button :plain="true" @click="closeConfigSearchDialog">取消</aui-button>
        <aui-button type="primary" @click="submitConfigSearch('configSearchform')">确定</aui-button>
      </div>
    </aui-popover>

    <pui-filter-condition v-if="isFilterCondition" :viewDataConds="reqData.viewDataConds" :sourceColumns="sourceColumns" :columnMaps="columnMaps" @close="handleCloseFilter" @submit="handleSubmitFilter">
    </pui-filter-condition>
  </div>
</template>
<script>
import { viewService, moduleService } from "paas-web-utils/services";
import { Column } from "paas-web-utils/rules";
import puiFilterCondition from "./filterCondition";
export default {
  name: "PuiListViewSetting",

  components: {
    puiFilterCondition
  },

  data() {
    return {
      rules: {
        viewName: [
          { required: true, message: "请输入视图名称", trigger: "blur" },
          { min: 2, message: "至少2个字符", trigger: "blur" }
        ]
      },
      configSearchRules: {
        tagName: [
          { required: true, message: "请输入标签名称", trigger: "blur" },
          { min: 2, message: "至少2个字符", trigger: "blur" }
        ]
      },
      isVisible: true,
      loading: true,
      columnList: [], // 全部列
      selectedList: [], // 已选列
      isSaveDialog: false,
      isConfigSearch: false,
      isFilterCondition: false,
      editRelatedModuleList: [], // 可修改数据关联模块集合
      viewFormulaList: [], // 可配置视图公式集合
      sourceColumns: [], // 可配置查询字段集合
      searchConditionList: [], // 查询条件列表
      reqData: {
        moduleId: "",
        viewType: 1,
        viewName: "",
        layoutType: "",
        dpEnable: "TRUE",
        requiredCols: "",
        columnAssemble: "",
        showColumns: "",
        viewSpcShows: [],
        batchCtrls: [],
        dataPermission: "",
        flag: 0,
        searchColumns: "",
        fuzzyQueryCols: "",
        description: "",
        orderType: "",
        orderCol: "",
        editRelatedModule: "",
        viewFormulaIds: "",
        isBatchAddView: 0,
        viewDataConds: {
          title: "",
          content: "",
          sqlContent: ""
        }
      },
      configSearchData: {
        tagName: "",
        searchs: [
          {
            columnId: "",
            moduleId: this.moduleId,
            searchType: "6",
            screenVal: ""
          }
        ]
      },
      conditionTypeList: [
        {
          label: "包含",
          value: 6
        },
        {
          label: "等于",
          value: 3
        },
        {
          label: "不等于",
          value: 7
        }
      ],
      dragIndex: null,
      columnMaps: {}
    };
  },

  props: {
    moduleId: {
      type: [Number, Object],
      default: null
    },
    editRow: {
      type: Object
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    viewType: {
      type: Number,
      default: null
    }
  },

  created() {
    Promise.all([
      viewService.findColumnsByModuleId({ moduleId: this.moduleId }),
      viewService.findViewById({ id: this.editRow.id, isOwnItem: true })
    ]).then(resList => {
      this.handleColumnList(resList[0]);
      this.handleViewInfo(resList[1]);
      this.loading = false;
    });
  },

  methods: {
    clearViewDataConds(){
      if(this.reqData.viewDataConds && !Boolean(this.reqData.viewDataConds.title)){
        this.reqData.viewDataConds = {
          title: "",
          content: "",
          sqlContent: ""
        }
      }
    },
    // 校验字段
    validateSourceColumnId(rule, value, callback) {
      if (value === "") {
        callback(new Error("请选择字段"));
      } else {
        callback();
      }
    },

    // 处理全部列数据
    handleColumnList(res) {
      res.forEach(group => {
        group.list.forEach(col => {
          col.selected = false;
          col.isShow = false;
          col.isSearch = false;
          col.isFuzzyQuery = false;
          col.isSort = false;
          col.isSortDisabled = false;
          col.isRequired = false;
        });
      });
      this.columnList = res;
    },

    // 选择列
    handleSelectCol(col) {
      if (!col.selected) {
        col.selected = true;
        if (this.reqData.orderCol) {
          col.isSortDisabled = true;
        }
        this.selectedList.push(col);
      } else {
        return false;
      }
    },

    // 全部添加
    handleSelectAll() {
      this.selectedList.splice(0, this.selectedList.length);

      let isOrderCol = false;
      this.columnList.forEach(group => {
        group.list.forEach(col => {
          col.selected = true;
          if (this.reqData.orderCol && col.id == this.reqData.orderCol) {
            isOrderCol = true;
          }
          this.selectedList.push(col);
        });
      });

      // 确认排序字段在已选列中，将其他字段排序禁用
      isOrderCol &&
        this.selectedList.forEach(col => {
          if (this.reqData.orderCol != col.id) {
            this.$set(col, "isSortDisabled", true);
          }
        });
    },

    // 删除选择的列
    handleCancelSelected(col, index) {
      col.selected = false;
      col.isShow = false;
      col.isSearch = false;
      col.isFuzzyQuery = false;
      if (col.isSort) {
        col.isSort = false;
        this.reqData.orderType = "";
        this.reqData.orderCol = "";
        this.selectedList.forEach(sel => {
          if (col.id != sel.id) {
            this.$set(sel, "isSortDisabled", false);
          }
        });
      }
      this.selectedList.splice(index, 1);
    },

    // 全部移除
    handleRemoveAll() {
      this.columnList.forEach(group => {
        group.list.forEach(col => {
          col.selected = false;
          col.isShow = false;
          col.isSearch = false;
          col.isFuzzyQuery = false;
          col.isSort = false;
          col.isSortDisabled = false;
        });
      });
      this.reqData.orderType = "";
      this.reqData.orderCol = "";
      this.selectedList.splice(0, this.selectedList.length);
    },

    // 查询模块下的查询标签集合
    findSearchTags() {
      viewService
        .findSearchTagsByviewId({
          viewId: this.editRow.id
        })
        .then(res => {
          if (res instanceof Array) {
            this.searchConditionList = res;
          } else {
            this.searchConditionList = [];
          }
        });
    },

    // 查询可修改数据关联模块
    findEditRelatedModuleList() {
      viewService
        .findEditRelatedModuleList({
          moduleIds: [this.moduleId],
          isRelated: 1
        })
        .then(res => {
          this.editRelatedModuleList = res;
        });
    },

    // 查询可配置视图公式集合
    findViewFormulaList() {
      viewService
        .findViewFormulaList({
          moduleId: this.moduleId
        })
        .then(res => {
          this.viewFormulaList = res;
        });
    },

    // 处理视图详情
    handleViewInfo(res) {
      this.initSelectedList(res);
      this.initSettingColumns(res);
      res.searchTag = this.stringToArray(res, "searchTag");
      res.editRelatedModule = this.stringToArray(res, "editRelatedModule");
      res.viewFormulaIds = this.stringToArray(res, "viewFormulaIds");
      res.defaultSearchTagId &&
        (res.defaultSearchTagId = res.defaultSearchTagId.toString());
      !res.viewDataConds &&
        (res.viewDataConds = {
          title: "",
          content: "",
          sqlContent: ""
        });
      this.reqData = res;
    },

    // 包含字段
    initSelectedList(res) {
      let selectedList = [];
      if (res.columnAssemble) {
        selectedList = res.columnAssemble.split(",");
        selectedList.forEach(select => {
          this.columnList.forEach(group => {
            group.list.forEach(col => {
              if (select == col.id) {
                col.selected = true;
                this.selectedList.push(col);
              }
            });
          });
        });
      }
    },

    // 字段设置处理
    initSettingColumns(res) {
      let showColumns = [],
        searchColumns = [],
        fuzzyQueryCols = [],
        requiredCols = [],
        isOrderCol = false;

      res.showColumns && (showColumns = res.showColumns.split(","));
      res.searchColumns && (searchColumns = res.searchColumns.split(","));
      res.fuzzyQueryCols && (fuzzyQueryCols = res.fuzzyQueryCols.split(","));
      res.requiredCols && (requiredCols = res.requiredCols.split(","));

      this.selectedList.forEach(col => {
        // 显示字段
        showColumns.length &&
          showColumns.forEach(item => {
            item == col.id && this.$set(col, "isShow", true);
          });

        // 可查询字段
        searchColumns.length &&
          searchColumns.forEach(item => {
            item == col.id && this.$set(col, "isSearch", true);
          });

        // 可模糊搜索字段
        fuzzyQueryCols.length &&
          fuzzyQueryCols.forEach(item => {
            item == col.id && this.$set(col, "isFuzzyQuery", true);
          });

        // 必填字段
        requiredCols.length &&
          requiredCols.forEach(item => {
            item == col.id && this.$set(col, "isRequired", true);
          });

        // 可排序字段
        if (res.orderCol && res.orderCol == col.id) {
          this.$set(col, "isSort", true);
          isOrderCol = true;
        }
      });

      // 确认排序字段在已选列中，将其他字段排序禁用
      isOrderCol &&
        this.selectedList.forEach(col => {
          if (res.orderCol != col.id) {
            this.$set(col, "isSortDisabled", true);
          }
        });
    },

    // 改变排序字段
    handleSortChange(val, checkedCol) {
      if (val) {
        this.reqData.orderType = "asc";
        this.reqData.orderCol = checkedCol.id;
        this.selectedList
          .filter(col => {
            return col.id != checkedCol.id;
          })
          .forEach(col => {
            this.$set(col, "isSortDisabled", true);
          });
      } else {
        this.reqData.orderType = "";
        this.reqData.orderCol = "";
        this.selectedList.forEach(col => {
          this.$set(col, "isSortDisabled", false);
        });
      }
    },

    // 字符串转数组
    stringToArray(res, key) {
      let newArr = [];
      res[key] && (newArr = res[key].split(","));
      return newArr;
    },

    // 保存布局
    handleSave() {
      this.findSearchTags();
      this.findEditRelatedModuleList();
      this.findViewFormulaList();
      this.isSaveDialog = true;
    },

    // 确认保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateView();
        } else {
          return false;
        }
      });
    },

    updateView() {
      let columnAssemble = [],
        showColumns = [],
        searchColumns = [],
        fuzzyQueryCols = [],
        requiredCols = [],
        searchTag = [],
        editRelatedModule = [],
        viewFormulaIds = [];

      this.selectedList.length &&
        this.selectedList.forEach(col => {
          columnAssemble.push(col.id);
          col.isShow && showColumns.push(col.id);
          col.isSearch && searchColumns.push(col.id);
          col.isFuzzyQuery && fuzzyQueryCols.push(col.id);
          col.isRequired && requiredCols.push(col.id);
        });

      // 查询条件
      this.reqData.searchTag.length &&
        (searchTag = JSON.parse(JSON.stringify(this.reqData.searchTag)));

      // 可修改数据关联模块
      this.reqData.editRelatedModule.length &&
        (editRelatedModule = JSON.parse(
          JSON.stringify(this.reqData.editRelatedModule)
        ));

      // 可配置公式
      this.reqData.viewFormulaIds.length &&
        (viewFormulaIds = JSON.parse(
          JSON.stringify(this.reqData.viewFormulaIds)
        ));

      let params = {
        ...this.reqData,
        id: this.editRow.id,
        moduleId: this.moduleId,
        showColumns: showColumns.join(","),
        columnAssemble: columnAssemble.join(","),
        searchColumns: searchColumns.join(","),
        fuzzyQueryCols: fuzzyQueryCols.join(","),
        requiredCols: requiredCols.join(","),
        searchTag: searchTag.join(","),
        editRelatedModule: editRelatedModule.join(","),
        viewFormulaIds: viewFormulaIds.join(","),
        isBatchAddView: this.viewType == 6 || this.viewType == 7 ? 1 : 0
      };
      // 判断过滤是否添加，如没有添加则删除
      if(params.viewDataConds && !Boolean(params.viewDataConds.sqlContent)){
        delete params.viewDataConds;
      }
      viewService.updateView(params).then(res => {
        this.hideAndRefresh();
      });
    },

    // 关闭并刷新
    hideAndRefresh() {
      this.closeSaveDialog();
      this.$emit("handle-cancel", "ListView");
      this.$emit("get-table-data");
    },

    // 关闭保存视图对话框
    closeSaveDialog() {
      this.isSaveDialog = false;
    },

    // 取消布局
    handleCancel() {
      if (this.isEdit) {
        this.$aui.confirm
          .show("是否取消本次布局？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(
            () => {
              this.$emit("handle-cancel", "ListView");
              this.$emit("get-table-data");
            },
            () => {
              return false;
            }
          );
      } else {
        // 如果是新增后的更新视图，取消后删除视图
        this.$aui.confirm
          .show("是否保存本次布局？", "提示", {
            confirmButtonText: "保存",
            cancelButtonText: "不保存",
            type: "warning"
          })
          .then(
            () => {
              this.updateView();
            },
            () => {
              viewService
                .deleteView({
                  viewId: this.editRow.id
                })
                .then(res => {
                  this.hideAndRefresh();
                });
            }
          );
      }
    },

    // 打开配置查询条件
    handleOpenConfigSearch() {
      this.findSourceColumns().then(() => {
        this.isConfigSearch = true;
      });
    },

    // 确定配置查询条件
    submitConfigSearch(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            ...this.configSearchData,
            moduleId: this.moduleId,
            viewId: this.editRow.id
          };

          viewService.addSearchTag(params).then(res => {
            this.searchConditionList.push(res);
            this.reqData.searchTag.push(res.id.toString());
            this.closeConfigSearchDialog();
          });
        } else {
          return false;
        }
      });
    },

    // 关闭配置查询条件
    closeConfigSearchDialog() {
      this.isConfigSearch = false;
      this.$set(this, "configSearchData", {
        tagName: "",
        searchs: [
          {
            columnId: "",
            moduleId: this.moduleId,
            searchType: "6",
            screenVal: ""
          }
        ]
      });
      this.$refs.configSearchform.resetFields();
    },

    // 根据视图id获取视图可配置字段集合
    findSourceColumns() {
      return new Promise(resolve => {
        viewService
          .findSourceColumnsByViewId({
            viewId: this.editRow.id
          })
          .then(res => {
            this.sourceColumns = res;
            // 添加字段数据源配置
            res &&
              res.length &&
              res.forEach(group => {
                group.list.forEach(col => {
                  let column = new Column();
                  column.render(col);
                  if (column.isForeignKey && !column[Column.relatedDataKey]) {
                    // 获取字段外键数据
                    moduleService
                      .findModuleRelated({ columnId: column.$id })
                      .then(relatedData => {
                        this.$set(column, Column.relatedDataKey, relatedData);
                        this.$set(this.columnMaps, `${col.moduleCode+'.'+col.phyColumnName}`, column);
                      });
                  } else {
                    this.$set(this.columnMaps, `${col.moduleCode+'.'+col.phyColumnName}`, column);
                  }
                });
              });
            resolve();
          });
      });
    },

    // 切换字段
    handleColumnChange(col, value) {
      this.$set(col, "screenVal", "");
    },

    // 新增查询条件
    handleAddCondition() {
      this.configSearchData.searchs.push({
        moduleId: this.moduleId,
        columnId: "",
        searchType: "6",
        screenVal: ""
      });
    },

    // 删除查询条件
    handleReduceCondition(index) {
      this.configSearchData.searchs.splice(index, 1);
    },

    // 删除查询标签
    deleteSearchTag(tagId) {
      viewService
        .deleteSearchTag({
          id: tagId
        })
        .then(res => {
          let removeIndex = -1;
          this.searchConditionList.forEach((item, index) => {
            item.id == tagId && (removeIndex = index);
          });
          removeIndex >= 0 && this.searchConditionList.splice(removeIndex, 1);
          this.reqData.defaultSearchTagId == tagId &&
            (this.reqData.defaultSearchTagId = "");
        });
    },

    // 打开配置查询条件
    handleOpenFilter() {
      this.findSourceColumns().then(() => {
        this.isFilterCondition = true;
      });
    },

    // 关闭配置查询条件
    handleCloseFilter() {
      this.isFilterCondition = false;
    },

    // 保存配置查询条件
    handleSubmitFilter(val) {
      this.$set(this.reqData, "viewDataConds", val);
      this.handleCloseFilter();
    },

    dragstartEvent(index, e) {
      e.target.className = e.target.className + " drag";
      e.dataTransfer.effectAllowed = "move";
      this.dragIndex = index;
    },

    dragendEvent(e) {
      e.preventDefault();
      e.stopPropagation();
      e.target.className = "columns-item";
    },

    dragenterEvent(index, e) {
      let tmp = this.selectedList[this.dragIndex];
      this.$set(
        this.selectedList,
        this.dragIndex,
        JSON.parse(JSON.stringify(this.selectedList[index]))
      );
      this.$set(this.selectedList, index, JSON.parse(JSON.stringify(tmp)));
      this.dragIndex = index;
    },

    dragoverEvent(e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
};
</script>
<style lang="scss">
@import "./listViewSetting.scss";
</style>