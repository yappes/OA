<template>
  <div class='condition-group'>
    <div class='condition-group-title'><span v-if='required' class='required-tag'>*</span>条件配置:</div>
    <div class='condition-group-content'>
      <condition :formData='conditionList' v-model='formModel' @delete-group='groupDel' :conditionColumn='conditionColumn' :required='required' :hasModuleName='hasModuleName' ref='form'></condition>
    </div>
  </div>
</template>
<script>
import condition from './condition'
import data from '../data/data'
import method from '../data/method'
import axios from "axios"
export default {
  components: {
    condition,
  },
  props: {
    // formData: {
    //   type: Object,
    //   required: true,
    // },
    value: {
      type: Object,
      required: true,
    },
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
      conditionList: {
        formName: 'conditionList',
        inline: true,
        title: '配置条件:',
        showLabel: false,
        head: [{
          prop: 'conditionColumn',
          label: '条件字段名',
          placeholder: '请输入条件字段名',
          type: 'SELECT',
          options: [],
          rules: [{
            required: true, message: '请输入条件字段名', trigger: 'change',
          }],
        }, {     
          prop: 'conditionType',
          label: '条件类型',
          placeholder: '请选择条件类型',
          type: 'SELECT',
          options: data.conditionType,
          rules: [{
            required: true, message: '请选择条件类型', trigger: 'change',
          }],
        }, {
          prop: 'conditionVal',
          label: '条件值',
          placeholder: '请输入条件值',
          type: 'INPUT',
          rules: [{
            required: true, message: '请输入条件值', trigger: 'blur',
          }],
        }],
      },
    }
  },
  computed: {
    formModel:{
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit('input', newValue)
      }
    },
  },
  watch: {
    conditionColumn(val) {
      this.conditionList.head[0].options = val.conditionColumn
    }
  },
  methods: {
    groupDel(data) {
      // console.log('groupDel', data)
      if(!this.formModel.groupArray) {
        return
      }
      let index = this.formModel.groupArray.indexOf(data)
      if(index !== -1) {
        this.formModel.groupArray.splice(index, 1)
        // console.log('groupDel', this.formModel)
      }
    },
    validate() {
      return this.$refs.form.validate().then(data => {
        //data 与 formModel相同,
        //data的数据结构回显太复杂，直接返回formModel
        //data返回值不重要，重要的完成了数据校验
        // console.log(data, this.formModel)
        // let res = method.conditionDataOut(this.formModel)
        // let res_1 = method.conditionDataIn(res)
        // console.log(JSON.stringify(res))
        // this.gua = res_1
        let result = {
          conditionList: this.formModel
        }
        return result
      })
    }
  },
  mounted() {
    console.log(this.conditionColumn)
  }
}
</script>
<style lang="scss" scoped>
  .condition-group {
    overflow: auto;
    padding: 20px 20px 0 0;
    // margin: 15px 0;
    // padding-bottom: 15px;
    .condition-group-title {
      width: 100px;
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
    .condition-group-content {
      // width: 100%;
      white-space: nowrap;
      margin-left: 100px
      // border: 1px solid black;
    }
  }

</style>


