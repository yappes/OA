<template>
  <div class="pui-add-view-setting">
    <aui-dialog :close-on-click-modal="false" class="pui-add-view-setting-dialog" style="top: 49px;" :modal="false" :show-close="false" :visible="isVisible" width="100%" top="0">
      <header slot="title" class="pui-add-view-setting-dialog__header">
        <span class="view-name">{{editRow.viewName}}</span>
        <pui-btn heightStr="34px" padding="0 20px" @click="handleCancel">取消</pui-btn>
        <pui-btn heightStr="34px" padding="0 20px" type="primary" @click="handleSave('batchForm')">保存布局</pui-btn>
      </header>
      <section class="pui-add-view-setting-dialog__section" v-loading="loading">
        <div class="pui-add-view-content-wrapper">
          <div class="pui-add-view-content-wrapper__left">
            <aui-collapse v-model="operateModuleId">
              <aui-collapse-item
              v-for="(group, index) in modulesColumns"
              :key="index" 
              :title="group.name" 
              :name="index">
                <ul class="columns-list">
                  <li 
                  v-for="(col, current) in group.list"
                  :key="col.id"
                  class="columns-item"
                  :class="{ 'is-selected': col.isSelected }"
                  @click="handleSelectedCol(col)"
                  >{{col.columnName}}</li>
                </ul>
              </aui-collapse-item>
            </aui-collapse>
          </div>
          <div class="pui-add-view-content-wrapper__right">
            <div class="pui-add-view-layout-wrapper">
              <header class="pui-add-view-layout-wrapper__header">编辑基础布局</header>
              <section 
              class="pui-add-view-layout-wrapper__section"
              :class="{ 'is-edit': currentBasicIndex == index }"
              v-for="(section, index) in basicLayoutList"
              :key="index"
              @click="handleEditBasicLayout(index)"
              :draggable="index != 0 && true"
              @dragstart.stop="basicDragstartEvent(index, $event)"
              @dragend.stop="basicDragendEvent"
              @dragover="dragoverEvent">
                <div class="header">
                  <div class="header-btns">
                    <span class="delete-btn aui-icon-delete" v-if="index != 0" @click.stop="handleDeleteBasicLayout(index)"></span>
                    <span class="add-btn aui-icon-plus" v-if="index == basicLayoutList.length - 1" @click.stop="handleAddBasicLayout"></span>
                  </div>
                  <div class="title">
                    <span v-if="index == 0">{{section.name}}</span>
                    <aui-input v-else v-model="section.name"></aui-input>
                  </div>
                </div>
                <div class="content" @dragenter.stop="basicDragenterEvent(index, $event)">
                  <aui-form :model="formData" label-width="150px">
                    <div 
                    v-for="(col, current) in section.colList"
                    :key="current"
                    class="aui-form-item-wrapper"
                    :draggable="currentBasicIndex == index && true"
                    @dragstart.stop="columnDragstartEvent(current, $event)"
                    @dragend.stop="columnDragendEvent(col, $event)"
                    @dragenter.stop="columnDragenterEvent(index, current, $event)"
                    @dragover="dragoverEvent">
                      <aui-form-item :class="{'is-required': col.isRequired}">
                        <span slot="label">
                          <aui-popover popper-class="show-popover" placement="bottom" trigger="hover" content="该字段不显示">
                            <span class="aui-icon-view" v-if="!col.isShow" @click.stop slot="reference"></span>
                          </aui-popover>
                          {{col.columnName}}
                        </span>
                        <template v-if="col.showType == 1 || col.showType == 7">
                          <aui-input v-model="formData['input' + current]"></aui-input>
                        </template>
                        <template v-else-if="col.showType == 2">
                          <aui-radio-group v-model="formData['radio' + current]">
                            <aui-radio label="单选"></aui-radio>
                            <aui-radio label="单选"></aui-radio>
                          </aui-radio-group>
                        </template>
                        <template v-else-if="col.showType == 3">
                          <aui-checkbox-group v-model="formData['checkbox' + current]">
                            <aui-checkbox label="多选" name="type"></aui-checkbox>
                            <aui-checkbox label="多选" name="type"></aui-checkbox>
                          </aui-checkbox-group>
                        </template>
                        <template v-else-if="col.showType == 4">
                          <aui-select v-model="formData['select' + current]" placeholder="请选择">
                            <aui-option label="选项一" value="1"></aui-option>
                            <aui-option label="选项二" value="2"></aui-option>
                          </aui-select>
                        </template>
                        <template v-else-if="col.showType == 5">
                          <aui-input type="textarea" v-model="formData['textarea' + current]"></aui-input>
                        </template>
                        <template v-else-if="col.showType == 6">
                          <aui-date-picker type="date" placeholder="选择日期" v-model="formData['date' + current]"></aui-date-picker>
                        </template>
                        <template v-else-if="col.showType == 8">
                          <aui-upload action="" :disabled="true">
                            <aui-button size="small" type="primary">文件上传</aui-button>
                          </aui-upload>
                        </template>
                        <template v-else-if="col.showType == 9">
                          <aui-upload action="" :disabled="true" class="avatar-uploader">
                            <i class="aui-icon-plus avatar-uploader-icon"></i>
                          </aui-upload>
                        </template>
                        <template v-else-if="col.showType == 10">
                          <aui-input type="textarea" v-model="formData['textarea' + current]"></aui-input> 
                        </template>
                      </aui-form-item>
                      <div class="aui-form-item-mask"   :class="{ 'isTextarea': (col.showType == 5 || col.showType == 10) }">
                        <div class="form-item-btns">
                          <span @click="handleDeleteColumn(col, current)" class="aui-icon-delete"></span>
                          <aui-popover popper-class="setting-popover" placement="bottom-end" trigger="hover">
                            <aui-checkbox v-model="col.isShow" label="是否显示"></aui-checkbox>
                            <aui-checkbox v-model="col.isRequired" label="是否必填" v-if="viewType != 4"></aui-checkbox>
                            <span class="setting-btn aui-icon-setting" @click.stop slot="reference"></span>
                          </aui-popover>
                        </div>
                      </div>
                    </div>
                  </aui-form>
                </div>
              </section>
            </div>

            <pui-btn v-if="!batchFormData.groupLayoutList.length" heightStr="34px" padding="0 20px" type="primary" @click="handleAddGroupLayout">添加分组布局</pui-btn>
            <div class="pui-add-view-layout-wrapper" v-else>
              <header class="pui-add-view-layout-wrapper__header">编辑分组布局</header>
              <aui-form :model="batchFormData" :rules="rules" ref="batchForm" label-width="80px">
                <section 
                class="pui-add-view-layout-wrapper__section"
                :class="{ 'is-edit': currentGroupIndex == index }"
                v-for="(section, index) in batchFormData.groupLayoutList"
                :key="index"
                @click="handleEditGroupLayout(index)"
                :draggable="true"
                @dragstart="groupDragstartEvent(index, $event)"
                @dragend="groupDragendEvent"
                @dragover="dragoverEvent">
                  <div class="header">
                    <div class="header-btns">
                      <span class="delete-btn aui-icon-delete" @click.stop="handleDeleteGroupLayout(index)"></span>
                      <span class="add-btn aui-icon-plus" v-if="index == batchFormData.groupLayoutList.length - 1" @click.stop="handleAddGroupLayout"></span>
                    </div>
                    <div class="title">
                      <aui-form-item label="视图" :prop="'groupLayoutList[' + index + '].batchId'" :rules="{ required: true, validator: validateBatchId, trigger: 'change'}">
                        <aui-select v-model="section.batchId" placeholder="请选择" @change="handleChangeGroupBatch(section.batchId, index)">
                          <aui-option-group
                            v-for="(group, index) in batchViewList"
                            :key="index"
                            :label="group.name">
                            <aui-option
                              v-for="item in group.viewRelList"
                              :key="item.id"
                              :value="item.id"
                              :label="item.viewName">
                            </aui-option>
                          </aui-option-group>
                        </aui-select>
                      </aui-form-item>
                    </div>
                    <div class="max-min-wrapper">
                      <div class="min">
                        <aui-form-item label="最小值" :prop="'groupLayoutList[' + index + '].min'" :rules="{ required: true, validator: validateMin, trigger: 'blur'}">
                          <aui-input v-model="section.min"></aui-input>
                        </aui-form-item>
                      </div>
                      <div class="max">
                        <aui-form-item label="最大值" :prop="'groupLayoutList[' + index + '].max'" :rules="{ required: true, validator: validateMax, trigger: 'blur'}">
                          <aui-input v-model="section.max"></aui-input>
                        </aui-form-item>
                      </div>
                    </div>
                  </div>
                  <div class="content" @dragenter="groupDragenterEvent(index, $event)">
                    <pui-list-grid v-if="section.datasource" :columns="section.columns" :datasource="section.datasource" :isNeedRecordData="false"></pui-list-grid> 
                  </div>
                </section>
              </aui-form>
            </div>
          </div>
        </div>
      </section>
    </aui-dialog>

    <aui-dialog :close-on-click-modal="false" title="保存视图" show-full-icon @hide="closeSaveDialog"  :visible="isSaveDialog" width="60%">
      <aui-form :model="reqData" :rules="rules" ref="form" label-width="150px">
        <aui-form-item label="视图名称" prop="viewName">
          <aui-input v-model="reqData.viewName"></aui-input>
        </aui-form-item>

        <aui-form-item label="可修改数据关联模块" prop="editRelatedModule" v-if="viewType != 4">
          <aui-select v-model="reqData.editRelatedModule" multiple placeholder="请选择">
            <aui-option v-for="item in editRelatedModuleList" :key="item.id" :label="item.moduleName" :value="String(item.id)"></aui-option>
          </aui-select>
        </aui-form-item>

        <aui-form-item label="配置公式" prop="viewFormulaIds" v-if="viewType != 4">
          <aui-select v-model="reqData.viewFormulaIds" multiple placeholder="请选择">
            <aui-option v-for="item in viewFormulaList" :key="item.id" :label="item.formuleName" :value="String(item.id)"></aui-option>
          </aui-select>
        </aui-form-item>

        <aui-form-item label="标题字段" prop="mobileListTitle" v-if="viewType == 4">
          <aui-select v-model="reqData.mobileListTitle" placeholder="请选择">
            <aui-option-group v-for="(group, index) in basicLayoutList" :key="index" :label="group.name">
              <aui-option v-for="col in group.colList" :key="col.id" :value="col.id" :label="col.columnName">
              </aui-option>
            </aui-option-group>
          </aui-select>
        </aui-form-item>

        <aui-form-item label="副标题字段" prop="mobileListCaptions" v-if="viewType == 4">
          <aui-select v-model="reqData.mobileListCaptions" placeholder="请选择">
            <aui-option-group v-for="(group, index) in basicLayoutList" :key="index" :label="group.name">
              <aui-option v-for="col in group.colList" :key="col.id" :value="col.id" :label="col.columnName">
              </aui-option>
            </aui-option-group>
          </aui-select>
        </aui-form-item>

        <aui-form-item label="描述" prop="description">
          <aui-input type="textarea" v-model="reqData.description"></aui-input>
        </aui-form-item>
      </aui-form>
      <div slot="footer" class="dialog-footer">
        <aui-button :plain="true"  @click="closeSaveDialog">取 消</aui-button>
        <aui-button type="primary" @click="submitForm('form')">确定</aui-button>
      </div>
    </aui-dialog>
  </div>
</template>
<script>
import listView from "paas-web-utils/rules/list-view";
import { viewService } from 'paas-web-utils/services';
export default {
  name: "PuiAddViewSetting",

  data() {
    return {
      rules: {
        viewName: [
          { required: true, message: "请输入视图名称", trigger: "blur" },
          { min: 2, message: "至少2个字符", trigger: "blur" }
        ],
      },
      isVisible: true,
      loading: true,
      operateModuleId: 0,
      modulesColumns: [],
      // 基础布局集合
      basicLayoutList: [{
        name: '未命名',
        colList: []
      }],
      // 分组布局集合
      batchFormData: {
        groupLayoutList: [],
      },
      batchViewList: [], // 可以批量新增的视图集合
      editRelatedModuleList: [], // 可修改数据关联模块集合
      viewFormulaList: [], // 可配置视图公式集合
      currentBasicIndex: 0,
      currentGroupIndex: 0,
      isSaveDialog: false,
      columnDragIndex: null,
      basicDragIndex: null,
      groupDragIndex: null,
      dragType: '',
      columnDraging: false,
      formData: {},
      reqData: {
        moduleId: '',
        viewType: null,
        viewName: '',
        layoutType: '',
        dpEnable: 'TRUE',
        requiredCols: '',
        columnAssemble: '',
        showColumns: '',
        mobileShowColumns: '',
        viewSpcShows: [],
        batchCtrls: [],
        dataPermission: '',
        flag: 1,
        searchColumns: '',
        fuzzyQueryCols: '',
        editRelatedModule: '',
        viewFormulaIds: '',
        viewMarks: '',
        description: '',
        mobileListTitle: '',
        mobileListCaptions: '',
      },
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
      viewService.findModulesColumns({ moduleId: this.moduleId }),
      viewService.findViewById({ id: this.editRow.id, isOwnItem: true }),
      viewService.findBatchViewList(this.viewType === 4 ? { moduleId: this.moduleId, viewTypes: [1], viewFlag: 1 } : { moduleId: this.moduleId, viewTypes: [7], viewFlag: 1 })
    ]).then(resList => {
      console.log(resList)
      this.handleModulesColumns(resList[0]);
      this.handleViewInfo(resList[1]);
      this.batchViewList = resList[2];
      this.loading = false;
    })
  },

  methods: {
    // 校验分组名称
    validateBatchId(rule, value, callback) {
      if (value === '') {
        callback(new Error('请选择视图'));
      } else {
        callback();
      }
    },

    // 校验最小值
    validateMin(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入最小值'));
      } else {
        callback();
      }
    },
    
    // 校验最大值
    validateMax(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入最大值'));
      } else {
        callback();
      }
    },

    // 处理模块字段及其关联模块字段的集合
    handleModulesColumns(res) {
      res && res.forEach(group => {
        group.list && group.list.forEach(col => {
          col.isSelected = false;
          col.isShow = false;
          col.isRequired = false;
        })
      });
      this.modulesColumns = res;
    },

    // 查询可修改数据关联模块
    findEditRelatedModuleList() {
      viewService.findEditRelatedModuleList({
        moduleIds: [this.moduleId],
        isRelated: 1
      }).then(res => {
        this.editRelatedModuleList = res;
      })
    },

    // 查询可配置视图公式集合
    findViewFormulaList() {
      viewService.findViewFormulaList({
        moduleId: this.moduleId
      }).then(res => {
        this.viewFormulaList = res;
      })
    },

    // 查询视图详情
    handleViewInfo(res) {
      this.initBasicLayoutList(res);
      this.initSettingColumns(res);
      this.initGroupLayoutList(res);
      res.editRelatedModule = this.stringToArray(res, 'editRelatedModule');
      res.viewFormulaIds = this.stringToArray(res, 'viewFormulaIds');
      this.reqData = res;
    },

    // 包含字段
    initBasicLayoutList(res) {
      if(res.viewGroupList) {
        this.basicLayoutList.splice(0, 1);
        res.viewGroupList.forEach(group => {
          let columnsTmp = [];
          group.colList && group.colList.forEach(select => {
            this.modulesColumns.forEach(module => {
              module.list.forEach(col => {
                if(select.id == col.id) {
                  this.$set(col, 'isSelected', true);
                  columnsTmp.push(col);
                }
              })
            })
          })

          this.basicLayoutList.push({
            ...group,
            name: group.name,
            colList: columnsTmp
          });
        })
      }
    },

    // 字段设置处理
    initSettingColumns(res) {
      let showColumns = [],
        requiredCols = [];
      let mobileShowColumns = []

      res.showColumns && (showColumns = res.showColumns.split(','));
      res.mobileShowColumns && (mobileShowColumns = res.mobileShowColumns.split(','));
      res.requiredCols && (requiredCols = res.requiredCols.split(','));

      this.basicLayoutList.forEach(group => {
        group.colList.forEach(col => {
          showColumns.length && showColumns.forEach(item => {
            item == col.id && this.$set(col, 'isShow', true);
          })
          mobileShowColumns.length && mobileShowColumns.forEach(item => {
            item == col.id && this.$set(col, 'isShow', true);
          })
          requiredCols.length && requiredCols.forEach(item => {
            item == col.id && this.$set(col, 'isRequired', true);
          })
        })
      })
    },

    // 初始化分组布局
    initGroupLayoutList(res) {
      let groupLayoutList = [];
      res && res.batchCtrls && (groupLayoutList = res.batchCtrls);
      groupLayoutList.forEach(group => {
        let newListView = new listView();
        newListView.render(group.batchId).then(res => {
          this.$set(group, 'datasource', res.datasource);
          this.$set(group, 'columns', res.columns);
        })
      })
      this.batchFormData.groupLayoutList = groupLayoutList;
    },

    // 字符串转数组
    stringToArray(res, key) {
      let newArr = [];
      res[key] && (newArr = res[key].split(','));
      return newArr;
    },

    // 选择字段
    handleSelectedCol(col) {
      if(!col.isSelected) {
        col.isSelected = true;
        col.isShow = true;

        if(!this.basicLayoutList[this.currentBasicIndex]) {
          this.$set(this.basicLayoutList, this.currentBasicIndex, [{
            name: '未命名',
            colList: []
          }]);
        }
        this.basicLayoutList[this.currentBasicIndex].colList.push(col);
      } else {
        return false;
      }
    },

    // 删除字段
    handleDeleteColumn(col, index) {
      this.modulesColumns.forEach(module => {
        module.list.forEach(item => {
          if(item.id == col.id) {
            this.$set(item, 'isSelected', false);
          }
        })
      })
      this.basicLayoutList[this.currentBasicIndex]['colList'].splice(index, 1);
    },

    // 新增基础布局模块
    handleAddBasicLayout() {
      this.$set(this.basicLayoutList, this.basicLayoutList.length, {
        name: '未命名' + this.basicLayoutList.length,
        colList: []
      });
      this.currentBasicIndex = this.basicLayoutList.length - 1;
    },

    // 编辑基础布局模块
    handleEditBasicLayout(index) {
      this.currentBasicIndex = index;
    },

    // 删除基础布局模块
    handleDeleteBasicLayout(index) {
      this.basicLayoutList[index].colList.length && this.basicLayoutList[index].colList.forEach(col => {
        col.isSelected = false;
      })
      this.basicLayoutList.splice(index, 1);
      this.currentBasicIndex = this.basicLayoutList.length - 1;
    },

    // 新增分组布局模块
    handleAddGroupLayout() {
      this.$set(this.batchFormData.groupLayoutList, this.batchFormData.groupLayoutList.length, {
        batchId: '',
        max: 100,
        min: 0,
        flag: 0,
      });
    },

    // 编辑分组布局模块
    handleEditGroupLayout(index) {
      this.currentGroupIndex = index;
    },

    // 删除分组布局模块
    handleDeleteGroupLayout(index) {
      this.batchFormData.groupLayoutList.splice(index, 1);
    },

    // 切换分组布局视图，渲染批量列表视图
    handleChangeGroupBatch(viewId, index) {
      let newListView = new listView();
      newListView.render(viewId).then(res => {
        this.$set(this.batchFormData.groupLayoutList[index], 'datasource', res.datasource);
        this.$set(this.batchFormData.groupLayoutList[index], 'columns', res.columns);
      })
    },

    // 保存布局前校验
    handleSave(formName) {
      if(this.batchFormData.groupLayoutList.length) {
        this.$refs[formName].validate(valid => {
          if(valid) {
            this.openSave();
          } else {
            return false;
          }
        });
      } else {
        this.openSave();
      }
    },

    // 打开保存布局
    openSave() {
      this.findEditRelatedModuleList();
      this.findViewFormulaList();
      this.isSaveDialog = true;
    },

    // 确认保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if(valid) {
          this.updateView();
        } else {
          return false;
        }
      });
    },

    updateView() {
      let columnAssemble = [],
          editRelatedModule = [],
          viewFormulaIds = [];
      let showColumns = []
      let mobileShowColumns = []

      // 包含字段-所有分组的所有字段（在更新视图接口更新）
      this.basicLayoutList.forEach(group => {
        group.colList.forEach(col => {
          columnAssemble.push(col.id);
        })
      })

      this.basicLayoutList.forEach(group => {
        group.colList.forEach(col => {
          if(col.isShow) {
            showColumns.push(col.id);
            mobileShowColumns.push(col.id)
          }
        })
      })

      // 批量分组布局、页面标签
      let batchCtrls = JSON.parse(JSON.stringify(this.batchFormData.groupLayoutList)),
          viewMarks = [];
      batchCtrls.forEach(group => {
        delete group.datasource;
        delete group.colList;
        viewMarks.push(group.batchId);
      })

      // 可修改数据关联模块、可配置公式
      this.reqData.editRelatedModule.length && (editRelatedModule = JSON.parse(JSON.stringify(this.reqData.editRelatedModule)));
      this.reqData.viewFormulaIds.length && (viewFormulaIds = JSON.parse(JSON.stringify(this.reqData.viewFormulaIds)));

      let params = {
        ...this.reqData,
        id: this.editRow.id,
        moduleId: this.moduleId,
        viewType: this.viewType,
        columnAssemble: columnAssemble.join(','),
        batchCtrls: batchCtrls,
        editRelatedModule: editRelatedModule.join(','),
        viewFormulaIds: viewFormulaIds.join(','),
        viewMarks: viewMarks.join(','),
      }
      params.viewGroupList = this.basicLayoutList
      params.showColumns = showColumns.join(',')
      params.mobileShowColumns = mobileShowColumns.join(',')
      this.batchFormData.groupLayoutList.forEach(batch=>{
         params.batchAddViewIds = params.batchAddViewIds?`${params.batchAddViewIds},${batch.batchId}`:`${batch.batchId}`
      });
      console.log('updateView param', params, this.basicLayoutList)
      viewService.updateView(params).then(res => {
        this.updateViewGroup(res.data);
      });
    },

    // 更新视图分组集合
    updateViewGroup(res) {
      let viewGroupList = [],
          showColumns = [],
          requiredCols = [];
      let mobileShowColumns = []

      // 显示字段-所有分组的所有显示字段
      // 必填字段-所有分组所有必填字段（在更新分组接口更新）
      this.basicLayoutList.forEach(group => {
        group.colList.forEach(col => {
          col.isShow && showColumns.push(col.id);
          col.isShow && mobileShowColumns.push(col.id);
          col.isRequired && requiredCols.push(col.id);
        })
      })

      // viewGroupList-除基本信息分组外的所有分组
      // viewGroupList 中 columnAssemble 为每个分组包含的字段
      this.basicLayoutList.filter((group, index) => {
        return index != 0;
      }).forEach(group => {
        let columnAssemble = [];
        group.colList.forEach(col => {
          columnAssemble.push(col.id);
        })
        viewGroupList.push({
          name: group.name,
          columnAssemble: columnAssemble.join(',')
        });
      })

      let params = {
        viewId: res.id,
        showColumn: showColumns.join(','),
        mobileShowColumns: mobileShowColumns.join(','),
        requiredCols: requiredCols.join(','),
        viewGroupList: viewGroupList
      }
      console.log('updateViewGroup params', params)
      viewService.updateViewGroup(params).then(res => {
        this.hideAndRefresh();
      })
    },

    // 关闭并刷新
    hideAndRefresh() {
      this.closeSaveDialog();
      this.$emit('handle-cancel', 'AddView');
      this.$emit('get-table-data');
    },
    
    // 关闭保存视图对话框
    closeSaveDialog() {
      this.isSaveDialog = false;
    },

    // 取消布局
    handleCancel() {
      if(this.isEdit) {
        this.$aui.confirm
        .show('是否取消本次布局？', '提示', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.$emit('handle-cancel', 'AddView');
          this.$emit('get-table-data');
        }, () => {
          return false;
        });
      }
      // 如果是新增后的更新视图，取消后删除视图
      else {
        this.$aui.confirm
        .show('是否保存本次布局？', '提示', {
          confirmButtonText: "保存",
          cancelButtonText: "不保存",
          type: "warning"
        })
        .then(() => {
          this.updateView();
        }, () => {
          viewService.deleteView({ 
            viewId: this.editRow.id
          }).then(res => {
            this.hideAndRefresh();
          });
        });
      }
    },

    // 字段拖拽-拖拽开始
    columnDragstartEvent(index, e) {
      e.target.className += ' drag';
      e.dataTransfer.effectAllowed = 'move';
      this.columnDragIndex = index;
      this.dragType = 'column';
      this.columnDraging = true;
    },
    
    // 字段拖拽-拖拽结束
    columnDragendEvent(col, e) {
      e.preventDefault();
      e.stopPropagation();
      e.target.className = 'aui-form-item-wrapper';
      this.dragType = '';
    },

    // 字段拖拽-鼠标移入
    columnDragenterEvent(index, current, e) {
      // 同组拖拽
      if(this.dragType == 'column' && this.currentBasicIndex == index && this.columnDragIndex != current) {
        if(this.basicLayoutList[this.currentBasicIndex]['colList'][this.columnDragIndex] && this.basicLayoutList[this.currentBasicIndex]['colList'][current]) {
          let columnDragIndexTmp = JSON.parse(JSON.stringify(this.basicLayoutList[this.currentBasicIndex]['colList'][this.columnDragIndex]));
          let currentTmp = JSON.parse(JSON.stringify(this.basicLayoutList[this.currentBasicIndex]['colList'][current]));
          this.$set(this.basicLayoutList[this.currentBasicIndex]['colList'], current, columnDragIndexTmp);
          this.$set(this.basicLayoutList[this.currentBasicIndex]['colList'], this.columnDragIndex, currentTmp);
          this.columnDragIndex = current;
        } 
      } else {
        return false;
      }
    },

    // 字段/分组拖拽-鼠标穿过
    dragoverEvent(e) {
      e.preventDefault();
      e.stopPropagation();
    },

    // 基础布局拖拽-拖拽开始
    basicDragstartEvent(index, e) {
      e.target.className += ' is-edit';
      e.dataTransfer.effectAllowed = 'move';
      this.basicDragIndex = index;
      this.dragType = 'basic';
    },
    
    // 基础布局拖拽-拖拽结束
    basicDragendEvent(e) {
      e.preventDefault();
      e.stopPropagation();
      e.target.className = 'pui-add-view-layout-wrapper__section';
      this.dragType = '';
    },

    // 基础布局拖拽-鼠标移入
    basicDragenterEvent(index, e) {
      if(this.dragType == 'basic') {
        this.currentBasicIndex = index;
        if(index == 0) {
          return false;
        } else if(this.basicDragIndex != index) {
          let basicDragIndexTmp = JSON.parse(JSON.stringify(this.basicLayoutList[this.basicDragIndex]));
          let indexTmp = JSON.parse(JSON.stringify(this.basicLayoutList[index]));
          this.$set(this.basicLayoutList, this.basicDragIndex, indexTmp);
          this.$set(this.basicLayoutList, index, basicDragIndexTmp);
          this.basicDragIndex = index;
        }
      // 字段不同组拖拽
      } else if(this.dragType == 'column' && this.currentBasicIndex != index) {
        if(this.columnDraging && this.basicLayoutList[this.currentBasicIndex]['colList'][this.columnDragIndex]) {
          let currentTmp = JSON.parse(JSON.stringify(this.basicLayoutList[this.currentBasicIndex]['colList'][this.columnDragIndex]));
          this.basicLayoutList[this.currentBasicIndex]['colList'].splice(this.columnDragIndex, 1);
          this.basicLayoutList[index]['colList'].push(currentTmp);
          this.columnDraging = false;
        }
      }
    },

    // 分组布局拖拽-拖拽开始
    groupDragstartEvent(index, e) {
      e.target.className += ' is-edit';
      e.dataTransfer.effectAllowed = 'move';
      this.groupDragIndex = index;
      this.dragType = 'group';
    },
    
    // 分组布局拖拽-拖拽结束
    groupDragendEvent(e) {
      e.preventDefault();
      e.stopPropagation();
      e.target.className = 'pui-add-view-layout-wrapper__section';
      this.dragType = '';
    },

    // 分组布局拖拽-鼠标移入
    groupDragenterEvent(index, e) {
      this.currentGroupIndex = index;
      if(this.dragType == 'group' && this.groupDragIndex != index) {
        let groupDragIndexTmp = JSON.parse(JSON.stringify(this.batchFormData.groupLayoutList[this.groupDragIndex]));
        let indexTmp = JSON.parse(JSON.stringify(this.batchFormData.groupLayoutList[index]));

        let groupDragIndexListView = new listView(),
            indexListView = new listView();

        groupDragIndexTmp.batchId && groupDragIndexListView.render(groupDragIndexTmp.batchId).then(res => {
          groupDragIndexTmp.datasource = res.datasource;
          groupDragIndexTmp.columns = res.columns;
        })

        indexTmp.batchId && indexListView.render(indexTmp.batchId).then(res => {
          indexTmp.datasource = res.datasource;
          indexTmp.columns = res.columns;
        })

        this.$set(this.batchFormData.groupLayoutList, this.groupDragIndex, indexTmp);
        this.$set(this.batchFormData.groupLayoutList, index, groupDragIndexTmp);
        this.groupDragIndex = index;
      } else {
        return false;
      }
    },
  }
};
</script>
<style lang="scss">
  @import "./addViewSetting.scss";
</style>