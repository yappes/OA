<template>
<div>
  <aui-form inline="inline" :model="formModel" ref='form' :rules='rules' class='form-content' :show-message='false'>
    <my-col status='inline'>
      <aui-form-item prop='conditionColumn' :style='{"margin-bottom": marginBottom}'>
        <input-adapt type='SELECT' v-model='formModel.conditionColumn' placeholder='请输入条件字段名' 
          :change-event='handlerColumnChange' :options='conditionColumn.options' :visibleChange='conditionColumn.visibleChange'></input-adapt>
      </aui-form-item>
    </my-col>
    <my-col status='inline'>
      <aui-form-item prop='conditionType' :style='{"margin-bottom": marginBottom}'>
        <input-adapt type='SELECT' v-model='formModel.conditionType' placeholder='请选择条件类型' 
          :options='conditionTypeOptions'></input-adapt>
        <!-- <aui-select v-else value="" placeholder="请选择条件"></aui-select> -->
      </aui-form-item>
    </my-col>
    <my-col status='inline'>
      <aui-form-item prop='conditionVal' :style='{"margin-bottom": marginBottom}' >
        <pui-input-adaptive  v-if='showPuiInput' class="input-adaptive" :column="inputColumn" :condition-type="formModel.conditionType" 
          :style="inputMarginRight" :batch="true" v-model="formModel.conditionVal"/>
        <aui-input v-else placeholder="请输入条件值" style='width: 232px'></aui-input>
      </aui-form-item>
    </my-col>
    <my-col status='inline'>
      <aui-button size="medium" type="text" icon="aui-icon-delete" @click='handledeleteData' :disabled='deleteDataDisabled' style="padding:0 20px"></aui-button>
    </my-col>
    <div :style='{"clear": "both"}'></div>
  </aui-form>
</div>

</template>

<script>
import mixin from '../mixin/mixin'
import defaultFormModel from '../data/defaultFormModel'
import data from '../data/data'
import { Column } from "paas-web-utils/rules";
import { columnService, queryService, moduleService } from "paas-web-utils/services";
import myCol from './col.vue'
import inputAdapt from './inputAdapt.vue'
// const conditionTypeDefault = 'AND'
export default {
  name: 'conditionItem',
  mixins: [mixin],
  components: {
    myCol,
    inputAdapt,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
    condition: {
      type: Object,
      default: () => {
        return {}
      },
    },
    deleteDataDisabled: {
      default: true,
    },
    hasModuleName: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      margin: '10px 10px 0 20px',
      marginBottom: '0',
      inputColumn: undefined,
      columnMap: {},
      loading: false,
      // clearTag: false,
      conditionColumn: {
        options: this.condition.conditionColumn,
      },
      conditionType: {
        options: data.conditionType,
      },
      conditionVal: {},
      rules: {
        conditionColumn: [{
          required: true, message: '请输入条件字段名', trigger: 'change',
        }],
        conditionType: [{
          required: true, message: '请选择条件类型', trigger: 'change',
        }],
        conditionVal: [{
          required: true, message: '请输入条件值', trigger: 'blur',
        }]
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
    showPuiInput() {
      //loading加入判断，
      return this.formModel.conditionColumn && this.formModel.conditionType && this.inputColumn && !this.loading
    },
    conditionTypeOptions() {
      console.log('-----', this.inputColumn)
      if(!this.inputColumn || !this.inputColumn.conditionTypes) {
        return []
      }
      return this.inputColumn.conditionTypes
    },
    inputMarginRight() {
      let typeVal = this.inputColumn ? this.inputColumn.type.val : undefined;
      let marginRight = '15px'
      if(typeVal === 'datetime') {
        marginRight = '0'
      }
      if(typeVal === 'input') {
        marginRight =  '30px' 
      }
      return {
        marginRight
      }
    },
    columnOptions() {
      return this.condition.conditionColumnSource.map(col => {
        return {
          // value: `${col.moduleCode}.${col.phyColumnName}`,
          value: this.hasModuleName ? `${col.moduleCode}.${col.phyColumnName}` : col.phyColumnName,
          label: col.columnName,
          colMark: col.colMark,
        }
      })
    }
  },
  watch: {
    'formModel.conditionColumn'(val) {
      // 手动选择选项和删除行后均会触发此watch监听
      // 手动选择 clearTag：true 需要清空其余输入框的数据
      // 删除行 clearTag: false 不需要清空输入框
      console.log('watch formModel.conditionColumn', this.clearTag, val)
      // if(this.clearTag) {
      //   this.formModel.conditionType = ''
      //   this.formModel.conditionVal = ''
      // }
      this.formModel.conditionType = ''
      this.formModel.conditionVal = ''
      this.initInputColumn()
    },
    //条件值有有效值时clearTag为false, 否则clearTag时true 删除时会清空数据
    'formModel.conditionVal'(val) {
      //手动清空conditionColumn时会val为undefined,此时不能将clearTag设false
      // if(val) {
      //   this.clearTag = false
      // }
    },
    condition(val) {
      this.conditionColumn.options = val.conditionColumn
      this.loadingColumn()
      this.handlerColumnChange()
    }
  },
  methods: {
    unixTime() {
      let time =  String(new Date().getTime())
      return `${time}`
      // return index
    },
    clearConditionVal() {
      this.formModel.conditionVal = null
    },
    getColMark() {
      let colMark = undefined
      let value = this.formModel.conditionColumn
      this.columnOptions.forEach(col => {
        if(col.value === value) {
          colMark = col.colMark
        }
      })
      this.formModel.colMark = colMark
    },  
    loadingColumn() {
      //生成各选项的字段并创建columnMap
      if(!this.condition.conditionColumnSource) {
        return 
      }
      this.condition.conditionColumnSource.forEach(col => {
        // let key = `${col.moduleCode}.${col.phyColumnName}`
        let key = this.hasModuleName ? `${col.moduleCode}.${col.phyColumnName}` : col.phyColumnName
        let column = new Column();
        column.render(col);
        this.$set(this.columnMap, key, column);
        // if(this.formModel.conditionColumn === key){
        //   // this.inputColumn = this.columnMap[this.formModel.conditionColumn]
        //   // console.log(this['_uid'], 'this.inputColumn ', this.inputColumn)
        // }
      })
    },
    dafaultConditionItem() {
      let r = {}
      this.formData.head.forEach(e => {
         r[e.prop] = ''
      })
      return r
    },
    initInputColumn() {
      // console.log('initInputColumn')
      //设置loading状态，
      this.inputColumn = this.columnMap[this.formModel.conditionColumn]
      let value = this.formModel.conditionColumn
      this.loading = true
      if (this.inputColumn && value && value !== null && value !== "") {
        // this.loading = true
        this.getColMark()
        let column = this.inputColumn
        if(column.isForeignKey && !column[Column.relatedDataKey]){
          // 获取字段外键数据
          moduleService.findModuleRelated({columnId: column.$id}).then((relatedData) => {
            //重新渲染字段
            column.render(column.columnData);
            //将数据源插入创建的字段
            column[Column.relatedDataKey] = relatedData;
            // loading置为false以后，输入框重新渲染，此时将会自动带入处理后的column
            // 已销毁后再加载的方式替代对column变化的监听
            // console.log('外键字段', column)
            setTimeout(() => {
              this.loading = false
            });
          })
        } else {
          setTimeout(() => {
            this.loading = false
          })
        }
      }
    },
    handlerColumnChange() {
      console.log('handlerColumnChange', this.formModel.conditionColumn)
      // this.clearTag = true
      this.initInputColumn()
    },
    handledeleteData() {
      // this.clearTag = false
      this.$emit('delete-item')
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          setTimeout(() =>{
            if (valid && this.formModel) {
              resolve(this.formModel);
            } else {
              let title = '条件选择'
              reject(title);
            }
          });
        })
      })
    }
  },
  created() {
    // console.log('created', this.formModel.conditionColumn)
    this.loadingColumn()
    //弹窗时需要created中执行初始化
    this.$nextTick(() => {
      // this.clearTag = false
      this.initInputColumn()
    })
  }
}
</script>

<style lang="scss" scoped>
  .group-form{
    width: 100%;
    .form-title-none {
      display: none;
    }
    .form-title-top {
      font-family: STHeitiSC-Medium;
      font-size: 18px;
      color: #2f3748;
      background: #fcfdff;
      line-height: 43px;
      height: 43px;
      padding-left: 20px;
      border-bottom: solid 1px #f1f1f1;
    }
    .form-content {
      // padding: 20px 20px 0 0;
      background-color: #fff;
      font-family: STHeitiSC-Medium;
      font-size: 14px;
      color: #a39c9c;
    }
  }
</style>
