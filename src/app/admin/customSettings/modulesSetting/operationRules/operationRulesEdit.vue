<template>
  <div class="pui-operation-rule-edit">
    <aui-dialog :close-on-click-modal="false" :title="dialogTitle" show-full-icon @hide="closeDialog" :visible="isVisible" width="60%">
      <aui-form :model="reqData" :rules="rules" ref="form" label-width="100px">
        <aui-form-item label="条件名称" prop="ruleName" class="inline-block-item">
          <aui-input v-model="reqData.ruleName" placeholder="请输入条件名称"></aui-input>
        </aui-form-item>

        <aui-form-item label="条件类型" prop="ruleType" class="inline-block-item">
          <aui-select v-model="reqData.ruleType" placeholder="请选择">
            <aui-option v-for="(item, index) in ruleTypeList" :key="index" :label="item.label" :value="item.value"></aui-option>
          </aui-select>
        </aui-form-item>

        <aui-form-item label="影响操作" prop="affectOperationId" class="inline-block-item">
          <aui-select v-model="reqData.affectOperationId" placeholder="请选择">
            <aui-option v-for="col in affectOperations" :key="col.id" :label="col.operationName" :value="col.id"></aui-option>
          </aui-select>
        </aui-form-item>

        <template v-for="(item, index) in reqData.operationRuleCondList">
          <aui-form-item :key="index" :label="index > 0 ? '' : '条件配置'" :prop="'operationRuleCondList.' + index + '.sourceColumnId'" :rules="{ required: true, validator: validateSourceColumnId, trigger: 'change'}" class="condition-form-item">
            <div class="condition-list">
              <aui-select class="inline-block-item" v-model="item.sourceColumnId" placeholder="请选择" clearable @change="(value) => handleColumnChange(item, value)">
                <aui-option-group v-for="(group, index) in sourceColumns" :key="index" :label="group.name">
                  <aui-option v-for="col in group.list" :key="col.id" :label="col.columnName" :value="col.id"></aui-option>
                </aui-option-group>  
              </aui-select>
              <aui-select class="inline-block-item" v-model="item.conditionType" placeholder="请选择">
                <aui-option v-for="(item, index) in conditionTypeList" :key="index" :label="item.label" :value="String(item.value)"></aui-option>
              </aui-select>
              <pui-input-adaptive class="input-adaptive inline-block-item" :column="columnMaps[item.sourceColumnId]" :condition-type="item.conditionType" :batch="true" v-if="columnMaps[item.sourceColumnId]" v-model="item.conditionValue">
              </pui-input-adaptive>
              <aui-input class="inline-block-item" v-model="item.conditionValue" v-else></aui-input>
              <div class="condition-btns-group">
                <span class="condition-btns" v-if="index == reqData.operationRuleCondList.length - 1" @click="handleAddCondition">+</span>
                <span class="condition-btns" v-if="reqData.operationRuleCondList.length != 1" @click="handleReduceCondition(index)">-</span>
              </div>
            </div>
          </aui-form-item>
        </template>
      </aui-form>
      <div slot="footer" class="dialog-footer">
        <aui-button :plain="true" @click="closeDialog">取 消</aui-button>
        <aui-button type="primary" @click="submitForm('form')">确定</aui-button>
      </div>
    </aui-dialog>
  </div>
</template>

<script>
import { operationRuleService, moduleService } from "paas-web-utils/services";
import { Column } from "paas-web-utils/rules";
export default {
  name: "PuiOperationRulesEdit",

  data() {
    return {
      rules: {
        ruleName: [
          { required: true, message: "请输入条件名称", trigger: "blur" },
          { min: 2, message: "至少2个字符", trigger: "blur" }
        ],
        ruleType: [
          { required: true, message: "请选择条件类型", trigger: "change" }
        ],
        affectOperationId: [
          { required: true, message: "请选择影响操作", trigger: "change" }
        ]
      },
      isVisible: false,
      dialogTitle: "新增操作条件",
      affectOperations: [], // 影响操作集合
      sourceColumns: [], // 来源字段集合
      reqData: {
        viewId: null,
        ruleName: "",
        ruleType: "hidden",
        sort: 1,
        affectOperationId: null,
        operationRuleCondList: [
          {
            conditionType: "1",
            conditionValue: "",
            sourceColumnId: ""
          }
        ]
      },
      ruleTypeList: [
        {
          label: "隐藏",
          value: "hidden"
        }
      ],
      conditionTypeList: [
        {
          label: "大于",
          value: 1
        },
        {
          label: "小于",
          value: 2
        },
        {
          label: "等于",
          value: 3
        },
        {
          label: "大于等于",
          value: 4
        },
        {
          label: "小于等于",
          value: 5
        },
        {
          label: "包含",
          value: 6
        },
        {
          label: "不等于",
          value: 7
        }
      ],
      columnMaps: {}
    };
  },

  props: {
    editRow: {
      type: Object
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    viewId: {
      type: Number
    },
    currentModuleId: {
      type: Number
    },
  },

  created() {
    this.findAffectOperations();
    if (this.isEdit) {
      this.findOperationRuleById();
    } else {
      this.isVisible = true;
    }
  },

  mounted() {
    this.findSourceColumns();
  },

  methods: {
    // 校验字段
    validateSourceColumnId(rule, value, callback) {
      if (value === "") {
        callback(new Error("请选择字段"));
      } else {
        callback();
      }
    },

    // 根据视图id查询影响操作集合
    findAffectOperations() {
      operationRuleService
        .findAffectOperationsByViewId({
          viewId: this.viewId,
          isPermission: true
        })
        .then(res => {
          this.affectOperations = res;
        });
    },

    // 根据视图id获取视图可配置字段集合
    findSourceColumns() {
      let vm = this;
      operationRuleService
        .findSourceColumnsByViewId({
          viewId: this.viewId
        })
        .then(res => {
          let group = {};
          this.sourceColumns = res;
          res &&
            res.length &&
            res.forEach(col => {
              
              if(!group[col.moduleId]){
                group[col.moduleId] = [];
              }
              group[col.moduleId].push(col);

              let column = new Column();
              column.render(col);
              if (column.isForeignKey && !column[Column.relatedDataKey]) {
                // 获取字段外键数据
                moduleService
                  .findModuleRelated({ columnId: column.$id })
                  .then(relatedData => {
                    this.$set(column, Column.relatedDataKey, relatedData);
                    this.$set(this.columnMaps, `${col.id}`, column);
                  });
              } else {
                this.$set(this.columnMaps, `${col.id}`, column);
              }
            });
            operationRuleService.findModulesByViewId({
              moduleIds: Object.keys(group),
              isRelated: 0,
              isEqModuleId: true,
              isCustom: 1,
              moduleName: "",
              isDelete: 0
            }).then(data => {
              let moduleList = [];
              for (const mod of data) {
                moduleList.push({
                  name:mod.moduleName,
                  list:group[mod.id]
                })
              }
              this.sourceColumns = moduleList.sort(function(array1,array2){
                if(array1.list[0].moduleId === vm.currentModuleId){
                  return -1;
                }else if(array2.list[0].moduleId === vm.currentModuleId){
                  return 1;
                }else if(array2.name > array1.name){
                  return 1;
                }else{
                  return -1;
                }
                return 0;
              });
            })
        });
    },

    // 根据id查询操作条件详情
    findOperationRuleById() {
      this.dialogTitle = "编辑操作条件";
      operationRuleService
        .findOperationRuleById({
          id: this.editRow.id
        })
        .then(res => {
          this.reqData = res;
          this.isVisible = true;
        });
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            ...this.reqData,
            ...{
              viewId: this.viewId
            }
          };

          if (this.isEdit) {
            params.id = this.editRow.id;
            operationRuleService.updateOperationRule(params).then(res => {
              this.hideAndRefresh();
            });
          } else {
            operationRuleService.addOperationRule(params).then(res => {
              this.hideAndRefresh();
            });
          }
        } else {
          return false;
        }
      });
    },

    handleAddCondition() {
      this.reqData.operationRuleCondList.push({
        conditionType: "1",
        conditionValue: "",
        sourceColumnId: ""
      });
    },

    handleReduceCondition(index) {
      this.reqData.operationRuleCondList.splice(index, 1);
    },

    // 切换字段
    handleColumnChange(col, value) {
      this.$set(col, "conditionValue", "");
    },

    hideAndRefresh() {
      this.closeDialog();
      this.$emit("getTableData");
    },

    closeDialog() {
      this.$emit("closeDialog");
      this.$refs.form.resetFields();
    }
  }
};
</script>
  
<style lang="scss" scoped>
@import "./operationRulesEdit.scss";
</style>