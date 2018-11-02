<template>
  <div>
    <group-form :formData='type' v-model='formModel.type' ref='form_0'></group-form>
    <column-form :conditionColumn='conditionColumn' v-model='formModel.column' v-if='columnShow' ref='form_1' class='column-form' :required='true' :hasModuleName='false'></column-form>
    <!-- <step-form :formData='column' ref='form_1' v-model='formModel.column' v-if='columnShow'></step-form> -->
    <condition-group ref='form_2' v-if='conditionShow'  v-model='formModel.conditionList' :conditionColumn='conditionColumn' :required='true' :hasModuleName='false'></condition-group>
    <group-form :formData='customSQL' v-model='formModel.customSQL' ref='form_3' v-if='customSQLshow'></group-form>
    <div slot="footer" class='footer'> 
      <aui-button type="primary" @click="submit">确 定</aui-button>
      <aui-button type="primary" :plain="true" @click="cancel">取 消</aui-button>
    </div>
  </div>
</template>

<script>
// 根据接口实际返回值修改
const ACTIONTYPE = {
  INSERT: "INSERT",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
}
import stepForm from './stepForm.vue'
import groupForm from './groupForm.vue'
import conditionGroup from '../component/conditionGroup'
import columnForm from './column'
// import vmodel from '../mixin/v-model'
import method from '../data/method'
import defaultFormModel from '../data/defaultFormModel'
import {moduleService} from 'paas-web-utils/services'
import service from '../service/service'
import defaultData from '../data/defaultFormModel'
export default {
  name: 'actionForm',
  // mixins: [vmodel],
  components: {
    stepForm,
    groupForm,
    conditionGroup,
    columnForm,
  },
  props: {
    // conditionColumn: {
    //   type: Object,
    //   default: () => {
    //     return {}
    //   },
    // },
    model: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      //深度复制对象，只有在点击确认之后才将将数据传递给父组件修改原数据
      formModel: JSON.parse(JSON.stringify(this.model)),
      //由弹窗中模块选择得到的相关模块数据
      conditionColumn: {
        conditionColumn: [],
        conditionColumnSource: [],
      },
      loading: true,
      type: {
        formName: 'type',
        inline: true,
        title: '配置类型',
        head: [{     
          type: 'SELECT',
          placeholder: '请选择配置类型',
          label: '配置类型',
          prop: 'setType',
          options: [{
            value: 'SQL',
            label: '自定义SQL',
          }, {
            value: 'CONFIG',
            label: '配置',
          }],
          rules: [{required: true, message: '请选择配置类型', trigger: 'change'}]
        },{     
          type: 'SELECT',
          placeholder: '请选择执行类型',
          label: '执行类型',
          prop: 'sqlType',
          options: [{
            value: 'INSERT',
            label: '新增',
          }, {
            value: 'UPDATE',
            label: '修改',
          }, {
            value: 'DELETE',
            label: '删除',
          }],
          rules: [{required: true, message: '请选择执行类型', trigger: 'change'}]
        }, {     
          type: 'SELECT',
          placeholder: '请选择模块',
          label: '模块',
          prop: 'moduleId',
          options: [],
          filterable: true,
          rules: [{required: true, message: '请选择执行类型', trigger: 'change'}],
          show: false,
        }]
      },
      customSQL: {
        formName: 'customSQL',
        inline: false,
        title: '自定义SQL',
        head: [{     
          type: 'TEXTAREA',
          placeholder: '请输入自定义SQL',
          label: '自定义SQL',
          prop: 'customSQL',
          rules: [{required: true, message: '请输入自定义SQL', trigger: 'blur'}]
        }],
      },
      column: {
        title: '配置字段:',
        formName: 'column',
        showType: 'FORM',
        isDetail: false,
        minLen: 1,
        head: [{
          prop: 'columnCode',
          label: '字段名',
          placeholder: '请输入字段名',
          type: 'SELECT',
          // options: this.conditionColumn.conditionColumn,
          options: [],
        }, {
          prop: 'columnVal',
          label: '字段值',
          placeholder: '请输入字段值',
          type: 'INPUT',
        }],
        rules: {
          columnCode: [{
            required: true, message: '请输入字段名', trigger: 'blur',
          }],
          columnVal: [{
            required: true, message: '请输入字段值', trigger: 'blur',
          }],
        },
      },     
      condition: {
        title: '配置条件:',
        formName: 'condition',
        showType: 'FORM',
        isDetail: false,
        head: [{
          prop: 'conditionColumn',
          label: '条件字段名',
          placeholder: '请输入条件字段名',
          type: 'INPUT',
        },{
          prop: 'conditionType',
          label: '条件类型',
          placeholder: '请选择条件类型',
          type: 'SELECT',
          options:[{
            value: 'conditionType_value_1',
            label: 'conditionType_label_1',
          },{
            value: 'conditionType_value_2',
            label: 'conditionType_label_2',
          },{
            value: 'conditionType_value_3',
            label: 'conditionType_label_3',
          },],
        }, {
          prop: 'conditionVal',
          label: '条件值',
          placeholder: '请输入条件值',
          type: 'INPUT',
        }],
        rules: {
          conditionColumn: [{
            required: true, message: '请输入字段名', trigger: 'blur',
          }],
          conditionType: [{
            required: true, message: '请选择字段类型', trigger: 'change',
          }],
          conditionVal: [{
            required: true, message: '请输入字段值', trigger: 'blur',
          }],
        },
      },
    }
  },
  computed: {
    columnShow() {
      let actionTypeVal = this.formModel.type.sqlType
      return (actionTypeVal === ACTIONTYPE.INSERT || actionTypeVal === ACTIONTYPE.UPDATE) && this.formModel.type.setType === "CONFIG" && !this.loading
    },
    conditionShow() {
      let actionTypeVal = this.formModel.type.sqlType
      return (actionTypeVal === ACTIONTYPE.DELETE || actionTypeVal === ACTIONTYPE.UPDATE) && this.formModel.type.setType === "CONFIG" && !this.loading
    },
    customSQLshow() {
      return this.formModel.type.setType ==="SQL"
    },
  },
  watch: {
    'formModel.type.setType'(val) {
      this.moduleShow()
      if(val !== 'CONFIG') {
        this.formModel.type.moduleId = ''
      }
    },
    //每次选项变化会更新关联选项值，包括loading后
    'formModel.type.moduleId'(val) {
      // console.log('change~~~')
      this.moduleChange().then(() => {
        this.clearModule()
        this.loading = false
      })
    },
  },
  methods: {
    moduleShow() {
      let r = this.formModel.type.setType === 'CONFIG'
      let show = r ? true : false
      this.type.head.forEach(item => {
        if(item.prop === 'moduleId') {
          item.show = show
        }
      })
    },
    moduleChange() {
      let val = this.formModel.type.moduleId
      if(!val) {
        return Promise.resolve()
      }
      this.loading = true
      let moduleId = val
      return service.findSourceColumnsByModuleId({
        moduleId,
      }).then(data => {
        let d = data[0].list
        //选项数据过滤掉创建时间和最后更新时间
        // let filter = d.filter(col => {
        //   return col.columnCode !== 'CREATE_TIME' && col.columnCode !== 'LAST_UPDATE_TIME'
        // })
        let r = d.map(col => {
          return {
            // value: `${col.moduleCode}.${col.phyColumnName}`,
            value: col.phyColumnName,
            label: col.columnName,
          }
        })
        let result = {
          conditionColumn: r,
          conditionColumnSource: d,
        }
        this.conditionColumn = result
        return Promise.resolve()
      })
    },
    clear() {
      if(!this.columnShow) {
        this.formModel.column = []
      }
      if(!this.conditionShow) {
        this.formModel.conditionList = defaultFormModel.conditionListNotEmpty()
      }
      if(!this.customSQLshow) {
        this.formModel.customSQL = {
          customSQL: '',
        }
      }
    },
    clearModule() {
      this.formModel.conditionList = defaultData.conditionListNotEmpty()
      this.formModel.column = [{
        columnCode: '',
        columnVal: '',
        colMark: '',
      }]
    },
    submit() {
      let formName = ['form_0', 'form_1', 'form_2', 'form_3']
      let promises = [];
      formName.forEach(fn => {
        if(this.$refs[fn]) {
          promises.push(this.$refs[fn].validate());
        }
      })
      let result = {}
      return Promise.all(promises).then(data => {
        data.forEach(d => {
          if(d) {
            Object.assign(result, d)
          }
        })
        this.clear()
        this.$emit('dialog-valid', this.formModel)
        this.$emit('dialog-close')
        return result
      }).catch(err => {
        this.$aui.notify.show.error({
          title: '校验错误',
          message: `请确认表单${err}输入正确`
        });
      })
    },
    cancel() {
      this.$emit('dialog-close')
    }
  },
  mounted() {
    this.moduleShow()
    // this.moduleChange()
    moduleService.findModules({}).then(data => {
      this.type.head.forEach(info => {
        if(info.prop === 'moduleId') {
          info.options = data.map(d => {
            return {
              value: d.id,
              label: d.moduleName,
            }
          })
        }
      })
    }).then(() => {
      return this.moduleChange()
    }).then(() => {
      this.loading = false
    })
  }
}
</script>

<style lang="scss" scoped>
  .column-form {
    padding-right: 20px;
  }
  .footer {
    margin-top: 20px;
  }
</style>

