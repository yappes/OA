<template>
<div :class='scrollClass'>
  <div class='title'>{{generalInfo.title}}</div>
  <group-form :formData='generalInfo' v-model='formModel' titlePosition='none' ref='form' class='generalInfo' v-loading='loading'></group-form>
</div>
</template>
<script>
import groupForm from './groupForm'
import {moduleService} from 'paas-web-utils/services'
import service from '../service/service'
import dataSource from '../data/data'
export default {
  components: {
    groupForm,
  },
  props: {
    scrollClass: String,
    value: {
      required: true
    },
  },
  data() {
    return {
      loading: true,
      generalInfo: {
        formName: 'generalInfo',
        inline: false,
        title: '基本信息',
        head: [{
          type: 'INPUT',
          placeholder: '请输入任务名称',
          label: '任务名称',
          prop: 'name',
          rules: [{required: true, message: '请输入任务名称', trigger: 'blur'}]
        },{     
          type: 'SELECT',
          placeholder: '请选择任务类型',
          label: '任务类型',
          prop: 'type',
          options: [{
            value: 'NORMAL',
            label: '普通任务',
          }, 
          //TODO:定时任务打开
          {
            value: 'TIMING',
            label: '定时任务',
          }
          ],
          rules: [{required: true, message: '请选择任务类型', trigger: 'change'}]
        },{     
          type: 'SELECT',
          placeholder: '请选择所属模块',
          label: '关联模块',
          prop: 'moduleId',
          filterable: true,
          changeEvent: () => {
            //手动选择后会清空相关联的条件组件的值
            this.$emit('clear-condition')
          },
          options: [],
          rules: [{required: true, message: '请选择所属模块', trigger: 'change'}]
        },{     
          type: 'SELECT',
          placeholder: '请选择触发类型',
          label: '触发类型',
          prop: 'tiggerType',
          options: [{
            value: 'ADD',
            label: '新增数据',
          }, {
            value: 'UPDATE',
            label: '更新数据',
          }, {
            value: 'DELETE',
            label: '删除数据',
          }, {
            value: 'CRON',
            label: '指定时间',
          }],
          rules: [{required: true, message: '请选择触发类型', trigger: 'change'}]
        },{     
          type: 'CRON',
          placeholder: '请选择触发时间',
          label: '触发时间',
          prop: 'tiggerTime',
          show: false,
          // full: false,
          rules: [{required: true, message: '请选择触发时间', trigger: 'change'}]
        },{
          type: 'TEXTAREA',
          placeholder: '请输入描述',
          label: '描述',
          prop: 'description',
          // full: true,
          rules: [{required: false, message: '请输入描述', trigger: 'blur'}]
        }],
      },
    }
  },
  computed: {
    formModel: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit('input', newValue)
      },
    },
  },
  watch: {
    //每次选项变化会更新关联选项值，包括loading后
    'formModel.moduleId'(val) {
      // console.log('watch formModel.moduleId', this.formModel.moduleId)
      if(!val) {
        return 
      }
      let moduleId = this.formModel.moduleId
      service.findSourceColumnsByModuleId({
        moduleId,
      }).then(data => {
        let d = data[0].list
        //选项数据过滤掉创建时间和最后更新时间
        // let filter = d.filter(col => {
        //   return col.columnCode !== 'CREATE_TIME' && col.columnCode !== 'LAST_UPDATE_TIME'
        // })
        let r = d.map(col => {
          return {
            value: `${col.moduleCode}.${col.phyColumnName}`,
            label: col.columnName,
          }
        })
        let result = {
          conditionColumn: r,
          conditionColumnSource: d,
        }
        this.$emit('condition-column', result)
      })
    },
    'formModel.type'(val) {
      //任务类型：普通任务
      if(val === 'NORMAL' || !val) {
        this.generalInfo.head.forEach(head => {
          //改变触发类型选项
          if(head.prop === 'tiggerType') {
            head.options = [{
              value: 'ADD',
              label: '新增数据',
            }, {
              value: 'UPDATE',
              label: '更新数据',
            }, {
              value: 'DELETE',
              label: '删除数据',
            }]
            //清空定时触发选项
            if(this.formModel.tiggerType === 'CRON') {
              this.formModel.tiggerType = ''
            }
            //请空触发事件值
            this.formModel.tiggerTime = ''
          }
          //隐藏触发时间框
          if(head.prop === 'tiggerTime') {
            head.show = false
            // this.ruleRequiredSet('tiggerTime', false)
          }
        })
        //任务类型：定时任务
      } else if(val === 'TIMING'){
        this.generalInfo.head.forEach(head => {
          if(head.prop === 'tiggerType') {
            //触发类型只有指定时间
            head.options = [{
              value: 'CRON',
              label: '指定时间',
            }]
          }
          //只有一个选项，直接赋值默认值
          this.formModel.tiggerType = 'CRON'
          //显示触发时间输入框
          if(head.prop === 'tiggerTime') {
            head.show = true
            // this.ruleRequiredSet('tiggerTime', true)
          }
        })
        //
      }else {
        this.formModel.tiggerType = ''
        this.generalInfo.head.forEach(head => {
          if(head.prop === 'tiggerType') {
            //触发类型只有指定时间
            head.options = [{
              value: 'ADD',
              label: '新增数据',
            }, {
              value: 'UPDATE',
              label: '更新数据',
            }, {
              value: 'DELETE',
              label: '删除数据',
            }, {
              value: 'CRON',
              label: '指定时间',
            }]
          }
          //显示触发时间输入框
          if(head.prop === 'tiggerTime') {
            head.show = true
            // this.ruleRequiredSet('tiggerTime', true)
          }
        })
      }
    }
  },
  methods: {
    ruleRequiredSet(prop, val) {
      this.generalInfo.head.forEach(head => {
        if(head.prop === prop) {
          head.rules.forEach(rule => {
            rule.required = val
          })
        }
      })
    },
    validate() {
      return this.$refs.form.validate().then(data => {
        // console.log('general', data)
        return data
      })
    }
  },
  mounted() {
    //获取关联模块ID选项
    moduleService.findModules({}).then(data => {
      this.generalInfo.head.forEach(info => {
        if(info.prop === 'moduleId') {
          info.options = data.map(d => {
            return {
              value: d.id,
              label: d.moduleName,
            }
          })
        }
      })
      this.loading = false
    })
  }
}
</script>
<style lang="scss" scoped>
  .title {
    font-family: STHeitiSC-Medium;
    font-size: 18px;
    color: #2f3748;
    background: #fcfdff;
    line-height: 43px;
    height: 43px;
    padding-left: 20px;
    border-bottom: solid 1px #f1f1f1;
  }
  .generalInfo {
    // padding: 0 20px 0 0;
    box-sizing: border-box;
    background-color: white;
    padding: 20px 20px 20px 0;
  }
</style>


