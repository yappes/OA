<template>
  <div class="pui-view-rule-edit">
    <aui-dialog :close-on-click-modal="false" :title="dialogTitle" show-full-icon @hide="closeDialog" :visible="isVisible" width="60%">
      <aui-form :model="reqData" :rules="rules" ref="form" label-width="100px">
        <aui-form-item label="条件名称" prop="ruleName" class="inline-block-item">
          <aui-input v-model="reqData.ruleName" placeholder="请输入条件名称"></aui-input>
        </aui-form-item>

        <aui-form-item label="执行顺序" prop="sort" class="inline-block-item">
          <aui-input v-model="reqData.sort" placeholder="请输入"></aui-input>
        </aui-form-item>

        <aui-form-item label="条件类型" prop="ruleType" class="inline-block-item">
          <aui-select v-model="reqData.ruleType" placeholder="请选择" @change="handleChangeRuleType">
            <aui-option v-for="(item, index) in ruleTypeList" :key="index" :label="item.label" :value="item.value"></aui-option>
          </aui-select>
        </aui-form-item>

        <aui-form-item label="影响字段" prop="affectColumns" class="inline-block-item" v-if="reqData.ruleType == 'columnFilter'">
          <aui-select v-model="reqData.affectColumns" placeholder="请选择影响字段">
            <aui-option v-for="col in affectColumnsInFilterType" :key="col.id" :label="col.columnName" :value="String(col.id)"></aui-option>  
          </aui-select>
        </aui-form-item>

        <aui-form-item label="影响字段" prop="affectColumnsList" class="inline-block-item" v-else>
          <aui-select v-model="reqData.affectColumnsList" multiple placeholder="请选择">
            <aui-option v-for="col in affectColumns" :key="col.id" :label="col.columnName" :value="String(col.id)"></aui-option>  
          </aui-select>
        </aui-form-item>

        <aui-form-item label="是否联动" prop="isLinkage" v-if="reqData.ruleType == 'columnFilter'">
          <aui-radio-group v-model="reqData.isLinkage">
            <aui-radio label="0">否</aui-radio>
            <aui-radio label="1">是</aui-radio>
          </aui-radio-group>
        </aui-form-item>

        <template v-for="(item, index) in reqData.viewRuleConditions">
           <aui-form-item :key="index" :label="index > 0 ? '' : '条件配置'" :prop="getProp(index)" :rules="{ required: true, validator: validateSourceColumnId, trigger: 'change'}" class="condition-form-item">
            <div class="condition-list">
              <aui-select class="inline-block-item" v-model="item.conditionValue" placeholder="请选择绑定字段" clearable v-if="reqData.ruleType === 'columnFilter'" filterable>
                <aui-option-group v-for="(group, index) in sourceColumns" :key="index" :label="group.name">
                  <aui-option v-for="col in group.list" :key="col.id" :label="col.columnName" :value="String(col.id)"></aui-option>
                </aui-option-group>  
              </aui-select>
              <aui-select class="inline-block-item" v-model="item.sourceColumnId" placeholder="请选择" clearable @change="(value) => handleColumnChange(item, value)" filterable v-else>
                <aui-option-group v-for="(group, index) in sourceColumns" :key="index" :label="group.name">
                  <aui-option v-for="col in group.list" :key="col.id" :label="col.columnName" :value="col.id"></aui-option>
                </aui-option-group>  
              </aui-select>
              <aui-select class="inline-block-item" v-model="item.conditionType" placeholder="请选择">
                <aui-option v-for="(item, index) in conditionTypeList" :key="index" :label="item.label" :value="String(item.value)"></aui-option>  
              </aui-select>
              <pui-input-adaptive
              class="input-adaptive inline-block-item"
              :column="columnMaps[item.sourceColumnId]" 
              :condition-type="item.conditionType" 
              :batch="true" 
              v-if="columnMaps[item.sourceColumnId] && reqData.ruleType !== 'columnFilter'"
              v-model="item.conditionValue">
              </pui-input-adaptive>
              <aui-select class="inline-block-item" v-model="item.customVal" placeholder="请选择筛选字段" clearable v-if="reqData.ruleType === 'columnFilter'">
                  <aui-option v-for="col in filterColumnOptions" :key="col.value" :label="col.label" :value="col.value"></aui-option>
              </aui-select>
              <aui-input class="inline-block-item" v-model="item.conditionValue" v-if="!columnMaps[item.sourceColumnId] && reqData.ruleType !== 'columnFilter'"></aui-input>
              <div class="condition-btns-group">
                <span class="condition-btns" v-if="index == reqData.viewRuleConditions.length - 1" @click="handleAddCondition">+</span>
                <span class="condition-btns" v-if="reqData.viewRuleConditions.length != 1" @click="handleReduceCondition(index)">-</span>
              </div>
            </div>
          </aui-form-item>
        </template>
      </aui-form>
      <div slot="footer" class="dialog-footer">
        <aui-button  :plain="true" @click="closeDialog">取 消</aui-button>
        <aui-button type="primary" @click="submitForm('form')">确定</aui-button>
      </div>
    </aui-dialog>
  </div>
</template>

<script>
import { viewRuleService, moduleService } from "paas-web-utils/services";
import { Column } from "paas-web-utils/rules";
import axios from 'axios'
export default {
  name: "PuiViewRulesEdit",

  data() {
    return {
      rules: {
        ruleName: [
          { required: true, message: "请输入条件名称", trigger: "blur" },
          { min: 2, message: "至少2个字符", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "请输入执行顺序", trigger: "blur" },
        ],
        ruleType: [
          { required: true, message: "请选择条件类型", trigger: "change" },
        ],
        affectColumns: [
          { required: true, message: "请选择影响字段", trigger: "change" },
        ],
        affectColumnsList: [
          { required: true, message: "请选择影响字段", trigger: "change" },
        ],
      },
      isVisible: false,
      dialogTitle: '新增视图条件',
      affectColumns: [], // 影响字段集合
      sourceColumns: [], // 来源字段集合
      filterColumnOptions: [], //筛选字段选项集合
      reqData: {
        viewId: null,
        ruleName: '',
        ruleType: 'hidden',
        sort: '',
        affectColumns: '',
        affectColumnsList: [],
        isLinkage: '0',
        viewRuleConditions: [{
          conditionType: '1',
          conditionValue: '',
          customVal: '',
          sort: 1,
          sourceColumnId: undefined,
        }],
      },
      ruleTypeList: [{
        label: '隐藏',
        value: 'hidden'
      },{
        label: '显示',
        value: 'show'
      },{
        label: '只读',
        value: 'readOnly'
      },{
        label: '字段筛选',
        value: 'columnFilter'
      }],
      conditionTypeList: [{
        label: '大于',
        value: 1
      },{
        label: '小于',
        value: 2
      },{
        label: '等于',
        value: 3
      },{
        label: '大于等于',
        value: 4
      },{
        label: '小于等于',
        value: 5
      },{
        label: '包含',
        value: 6
      },{
        label: '不等于',
        value: 7
      },],
      columnMaps: {},
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
    }
  },

  created() {
    this.findAffectColumns();
    if(this.isEdit) {
      this.findViewRuleById();
    } else {
      this.isVisible = true;
    }
  },

  mounted() {
    this.findSourceColumns();
    this.findFilterColumns()
    // console.log('gia')
    // let p1 = Promise.resolve(true)
    // let p2 = Promise.resolve(false)
    // let p3 = Promise.resolve(false)
    // Promise.all([p1,p2,p3]).then(data => {
    //   console.log('1111', data)
    // }).catch(data => {
    //   console.log('2222', data)
    // })
  },

  methods: {
    getProp(index) {
      return this.reqData.ruleType==='columnFilter'? 'viewRuleConditions.' + index + '.conditionValue' : 'viewRuleConditions.' + index + '.sourceColumnId'
    },
    // 校验字段
    validateSourceColumnId(rule, value, callback) {
      if (value === '') {
        callback(new Error('请选择字段'));
      } else {
        callback();
      }
    },

    // 根据视图id查询影响字段集合
    findAffectColumns() {
      console.log('this.reqData.ruleType', this.reqData.ruleType)
      viewRuleService.findAffectColumnsByViewId({ 
        viewId: this.viewId
      }).then(res => {
        this.affectColumns = res
      });
    },

    //根据字段id获取视图条件字段 级联效果 可配置字段
    findFilterColumns() {
      if(!this.reqData.affectColumns) {
        return 
      }
      axios.post(`platform://custom/C01020`, {
        columnId: this.reqData.affectColumns
      }).then(res => {
        let data = res.data
        let result = []
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const value = data[key];
            result.push({
              value: value,
              label: key
            })
          }
        }
        this.filterColumnOptions = result
        console.log('过滤字段选项', result)
      })
    },

    // 根据视图id获取视图可配置字段集合
    findSourceColumns() {
      viewRuleService.findSourceColumnsByViewId({ 
        viewId: this.viewId
      }).then(res => {
        this.sourceColumns = res;
        res && res.length && res.forEach(group => {
          group.list.forEach(col => {
            let column = new Column();
            column.render(col);
            if(column.isForeignKey && !column[Column.relatedDataKey]){
              // 获取字段外键数据
              moduleService.findModuleRelated({columnId: column.$id}).then((relatedData) => {
                this.$set(column, Column.relatedDataKey, relatedData);
                this.$set(this.columnMaps, `${col.id}`, column);
              })
            } else {
              this.$set(this.columnMaps, `${col.id}`, column);
            }
          })    
        })
        console.log('columnMap', this.columnMaps)
      });
    },

    // 根据id查询视图条件详情
    findViewRuleById() {
      this.dialogTitle = '编辑视图条件';
      return viewRuleService.findViewRuleById({ 
        id: this.editRow.id
      }).then(res => {
        let data = res;
        if(data.ruleType != 'columnFilter' && data.affectColumns) {
          data.affectColumnsList = data.affectColumns.split(',');
        } else {
          data.affectColumnsList = [];
        }
        data.isLinkage = data.isLinkage.toString();
        
        if(!data.viewRuleConditions || !data.viewRuleConditions.length) {
          data.viewRuleConditions = [{
            conditionType: '1',
            conditionValue: '',
            customVal: '',
            sort: 1,
            sourceColumnId: undefined,
          }]
        }
        this.reqData = data;
        this.isVisible = true;
      });
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let affectColumns = '';
          if(this.reqData.affectColumnsList && this.reqData.affectColumnsList.length) {
            affectColumns = this.reqData.affectColumnsList.join(',');
          } else {
            affectColumns = this.reqData.affectColumns;
          }

          let params = {
            ...this.reqData,
            ...{ 
              viewId: this.viewId,
              affectColumns: affectColumns
            },
          };

          if(this.isEdit) {
            params.id = this.editRow.id;
            viewRuleService.updateViewRule(params).then(res => {
              this.hideAndRefresh();
            });
          } else {
            viewRuleService.addViewRule(params).then(res => {
              this.hideAndRefresh();
            });
          }
        } else {
          return false;
        }
      });
    },

    handleChangeRuleType(val) {
      if(val == 'columnFilter') {
        this.reqData.affectColumnsList = [];
        this.reqData.affectColumns = '';
      } else {
        this.reqData.affectColumns = '';
        this.reqData.isLinkage = '0';
      }
    },

    handleAddCondition() {
      this.reqData.viewRuleConditions.push({
        conditionType: '1',
        conditionValue: '',
        customVal: '',
        sort: 1,
        sourceColumnId: undefined,
      })
    },

    handleReduceCondition(index) {
      this.reqData.viewRuleConditions.splice(index, 1);
    },

    // 切换字段
    handleColumnChange(col, value) {
      this.$set(col, 'conditionValue', '');
    },

    hideAndRefresh() {
      this.closeDialog();
      this.$emit("getTableData");
    },

    closeDialog() {
      this.$emit("closeDialog");
      this.$refs.form.resetFields();
    }
  },
  computed: {
    affectColumnsInFilterType() {
      return this.affectColumns.filter(item => {
        return item.colMark === 'FOREIGNKEY' || item.colMark === 'DICTIONARY'
      })
    },
  },
  watch: {
    'reqData.affectColumns'(val) {
      console.log('影响字段值改变')
      //获得筛选字段的选项
      this.findFilterColumns()
      //筛选字段值清空
      // this.reqData.viewRuleConditions.forEach(item => {
      //   item.customVal = ''
      // })
    }
  }
};
</script>
  
<style lang="scss" scoped>
  @import "./viewRulesEdit.scss";
</style>