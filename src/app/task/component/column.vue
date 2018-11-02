<template>
  <div class='step-form'>
    <div class='form-title'><span v-if='required' class='required-tag'>*</span>配置字段:</div>
    <!-- 表格 ？？？？校验-->
    <aui-form  label-position="left" label-width="0" class='form-content' :model="{formModel}" ref='form' :show-message='false' validate-on-rule-change	>
    <!-- <aui-form-item :label="formData.title"> -->
      <!-- 表格主体 -->
      <aui-table :data="formModel" style="width: 100%" stripe border empty-text="暂无数据">
        <!-- 索引序号 -->
        <aui-table-column type="index" :index="indexMethod" label="序号" width="55" fixed="left" align='center'>
        </aui-table-column>
        <!-- 表格内容 -->
        <!-- <template v-for='(item, index) in formData.head'> -->
          <aui-table-column :prop="columnCode.prop" :label="columnCode.label" :key='columnCode.prop' header-align='center'>
            <template slot-scope="scope">
              <!-- <form-column :item='columnCode' :form-data='formData' :row-index="scope.$index" :form-model='formModel' :head-index='index'></form-column> -->
              <aui-form-item :prop='itemProp(scope.$index, columnCode.prop)' :rules='columnCode.rules' :style="{'margin-bottom':'0'}">
                <input-adapt v-model='formModel[scope.$index].columnCode' :type='columnCode.type' :placeholder='columnCode.placeholder' 
                  :options='conditionColumnOptions' :change-event='(value)=>handlerColumnChange(scope.$index)'></input-adapt>
              </aui-form-item>
            </template>
          </aui-table-column>
          <aui-table-column :prop="columnVal.prop" :label="columnVal.label" :key='columnVal.prop' header-align='center'>
            <template slot-scope="scope">
              <aui-form-item :prop='itemProp(scope.$index, columnVal.prop)' :rules='inputRules[scope.$index]' :style="{'margin-bottom':'0'}">
                <pui-input-adaptive  v-if='showPuiInput[scope.$index]' class="input-adaptive" :column="columnMap[formModel[scope.$index].columnCode]" condition-type="3" 
                   :batch="true" v-model="formModel[scope.$index].columnVal" />
                <aui-input v-else placeholder="请输入字段值" ></aui-input>
              </aui-form-item>
            </template>
          </aui-table-column>
        <!-- </template> -->
        <!-- 新增/删除按钮列 -->
        <aui-table-column width="75" fixed="right" :render-header="renderHeader" align="center" label='operation'>
          <template slot-scope="scope">
            <aui-button type="text" size="large" icon="aui-icon-delete" @click="deleteData(scope.$index)" :disabled='formModel.length<=minLen'></aui-button>
          </template>
        </aui-table-column>
      </aui-table>
      <!-- </aui-form-item> -->
    </aui-form>
  </div>
</template>

<script>
import inputAdapt from './inputAdapt'
import mixin from '../mixin/mixin'
import { Column } from "paas-web-utils/rules";
import { columnService, queryService, moduleService } from "paas-web-utils/services";
export default {
  name:'columnForm',
  mixins: [mixin],
  components: {
    inputAdapt,
  },
  props: {
    value: Array,
    conditionColumn: {
      type: Object,
      default: () => {
        return {}
      },
    },
    required: {
      type: Boolean,
      default: false,
    },
    hasModuleName: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      minLen: 1,
      loading: {},
      inputColumn: {},
      columnMap: {},
      columnCode: {
        prop: 'columnCode',
        label: '字段名',
        type: 'SELECT',
        placeholder: '请出入字段名',
        rules: [{
          required: true, message: '请输入字段名', trigger: 'change',
        }],
      },
      columnVal: {
        prop: 'columnVal',
        label: '字段值',
        rules: [{
          required: true, message: '请输入字段值', trigger: 'change',
        }],
      }

    }
  },
  computed: {
    formModel: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit('input', newValue)
      }
    },
    //选项要过滤掉创建时间和最后更新时间
    conditionColumnOptions() {
      let r = []
      this.conditionColumn.conditionColumnSource.forEach(col => {
        if(col.columnCode !== 'CREATE_TIME' && col.columnCode !== 'LAST_UPDATE_TIME') {
          let e = {
            // value: `${col.moduleCode}.${col.phyColumnName}`,
            value: this.hasModuleName ? `${col.moduleCode}.${col.phyColumnName}` : col.phyColumnName,
            label: col.columnName,
          }
          r.push(e)
        }
      })
      return r
    },
    columnOptions() {
      let r = []
      this.conditionColumn.conditionColumnSource.forEach(col => {
        if(col.columnCode !== 'CREATE_TIME' && col.columnCode !== 'LAST_UPDATE_TIME') {
          let e = {
            // value: `${col.moduleCode}.${col.phyColumnName}`,
            value: this.hasModuleName ? `${col.moduleCode}.${col.phyColumnName}` : col.phyColumnName,
            label: col.columnName,
            colMark: col.colMark,
          }
          r.push(e)
        }
      })
      return r
    },
    showPuiInput() {
      let r =  this.formModel.map((model, index) => {
        if(!model.columnCode) {
          return false
        }
        return this.columnMap[model.columnCode]  && !this.loading[index]
      })
      return r
    },
    inputRules() {
      let r =  this.formModel.map((model, index) => {
        if(this.columnMap[model.columnCode]) {
          return [...this.columnMap[model.columnCode].rules, ...this.columnVal.rules]
        }
        return [...this.columnVal.rules]
      })
      return r
    },
    //TODO:加载数据时的loading
    totalLoading() {
      for (const key in this.loading) {
        if (this.loading.hasOwnProperty(key)) {
          const loading = this.loading[key];
          if(loading) {
            return true
          }
        }
      }
      return false
    },
  },
  watch: {
    'conditionColumn.conditionColumnSource'() {
      this.loadingColumn()
      this.$nextTick(() => {
        this.formModel.forEach((model, index) => {
          this.initInputColumn(index)
        })
      })
    }
  },
  methods: {
    itemProp(index, prop) {
      return `formModel.${index}.${prop}`;
    },
    getColMark(index, columnCode) {
      let colMark = undefined
      if(!columnCode) {
        colMark = ''
      }else {
        this.columnOptions.forEach(col => {
          if(col.value === columnCode) {
            colMark = col.colMark
          }
        })
      }
      this.formModel[index].colMark = colMark
    },
    loadingColumn() {
      //生成各选项的字段并创建columnMap
      if(!this.conditionColumn.conditionColumnSource) {
        return 
      }
      this.conditionColumn.conditionColumnSource.forEach(col => {
        // let key = `${col.moduleCode}.${col.phyColumnName}`
        let key = this.hasModuleName ? `${col.moduleCode}.${col.phyColumnName}` : col.phyColumnName
        let column = new Column();
        column.render(col);
        this.$set(this.columnMap, key, column);
      })
    },
    initInputColumn(index) {
      let value = this.formModel[index].columnCode
      if (value && value !== null && value !== "") {
        this.$set(this.loading, index, true);
        let column = this.columnMap[value]
        if(!column) {
          return
        }
        this.getColMark(index, value)
        if(column.isForeignKey && !column[Column.relatedDataKey]){
          // 获取字段外键数据
          moduleService.findModuleRelated({columnId: column.$id}).then((relatedData) => {
            console.log('获取外键数据')
            //重新渲染字段 
            column.render(column.columnData);
            //将数据源插入创建的字段
            column[Column.relatedDataKey] = relatedData;
            console.log('外键字段', this.columnMap)
            // loading置为false以后，输入框重新渲染，此时将会自动带入处理后的column
            // 已销毁后再加载的方式替代对column变化的监听
            setTimeout(() => {
              this.$set(this.loading, index, false);
            });
          })
        } else {
          this.inputColumn[index] = column
          setTimeout(() => {
            this.$set(this.loading, index, false)
          })
        }
      }
    },
    handlerColumnChange(index) {
      // console.log('handlerColumnChange')
      //选择的时候清空字段值原数据
      this.formModel[index].columnVal = ''
      this.initInputColumn(index)
    },
    indexMethod(index) {
      return index + 1;
    },
    renderHeader(h) {
      return (
        <span>
          <aui-button
            size="medium"
            type="text"
            icon="aui-icon-plus"
            onClick={this.insertData}
            style="padding:0 20px"
          />
        </span>
      );
    },
    defaultFormData(defaultVal='') {
      let defaultObj = {}
      defaultObj.columnCode = ''
      defaultObj.columnVal = ''
      defaultObj.colMark = ''
      return defaultObj
    },

    insertData() {
      let defaultData = this.defaultFormData()
      this.formModel.push(defaultData)
    },
    deleteData(index) {
      this.deleteMessage(() => {
        this.formModel.splice(index, 1)
      })
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          setTimeout(() =>{
            if (valid && this.formModel) {
              let result = {}
              result.column = this.formModel
              resolve(result);
            } else {
              let title = '配置字段'
              reject(title);
            }
          });
        });
      });
    },
  },
  created() {
    // console.log('column created')
    //编辑数据载入时的回显
    //props数据created时不会触发选择框的change事件，需要手动调用字段的处理函数
    this.loadingColumn()
    this.$nextTick(() => {
      this.formModel.forEach((model, index) => {
        this.initInputColumn(index)
      })
    })
  }
}
</script>

<style lang="scss" scoped>
  .step-form{
    box-sizing: border-box;
    width: 100%;
    .form-title {
      width: 100px;
      height: 40px;
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      box-sizing: border-box;
      .required-tag {
        color: #f56c6c;
        margin-right: 4px;     
      }
    }
    .form-content {
      margin-left: 100px;
      // border: solid 1px #f1f1f1;
    }
  }
  .pointer {
    cursor: pointer;
  }
</style>


