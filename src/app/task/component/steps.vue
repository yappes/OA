<template>
  <div>
    <step :moduleData='data' v-for='(item, index) in formModel' :key='index' :stepNum='stepNum'
      :stepIndex='index' v-model='formModel[index]' ref='form' :condition-column='conditionColumn' @delete-step='deleteStep'
      :scrollClass='scrollClass' @add-step='addStep'></step>
  </div>
</template>

<script>
import step from "./step.vue";
import data from '../data/data.js'
export default {
  components: {
    step,
  },
  props: {
    value: {
      required: true,
    },
    conditionColumn: {
      type: Object,
      default: () => {
        return {}
      },
    },
    scrollClass: String,
  },
  data() {
    return {
      data: {
        stepNameType: {
          formName: 'stepNameType',
          inline: false,
          title: '名称和类型:',
          head: [{
            type: 'INPUT',
            placeholder: '请输入步骤名称',
            label: '步骤名称',
            prop: 'name',
            rules: [{
              required: true, message: '请输入步骤名称', trigger: 'blur',
            }],
          }, {     
            type: 'SELECT',
            placeholder: '请选择步骤类型',
            label: '步骤类型',
            prop: 'type',
            options: [{
              value: 'SQL',
              label: 'SQL执行',
            }, {
              value: 'RPC',
              label: '外部交易RPC调用',
            }, 
            //TODO:提醒目前没有实现，选项注释
            // {
            //   value: 'NOTIFY',
            //   label: '提醒',
            // }
            ],
            rules: [{
              required: true, message: '请选择步骤类型', trigger: 'change',
            }],
          }, {     
            type: 'RADIO',
            placeholder: '请选择是否继续',
            label: '是否继续',
            prop: 'isContinue',
            options: [{
              value: 'CONTINUE',
              label: '继续',
            }, {
              value: 'OVER',
              label: '结束',
            }],
            rules: [{
              required: true, message: '请选择是否继续', trigger: 'change',
            }],
          }, {
            type: 'TEXTAREA',
            placeholder: '请输入步骤描述',
            label: '步骤描述',
            prop: 'description',
            rules: [{
              required: false, message: '请输入步骤描述', trigger: 'blur',
            }],
          }],
        },
        inputParams: {
          title: '入参:',
          formName: 'inputParams',
          showType: 'FORM',
          head: [{
            prop: 'param',
            label: '参数',
            placeholder: '请输入参数',
            type: 'INPUT',
          }, {
            prop: 'valType',
            label: '值类型',
            placeholder: '请选择值类型',
            type: 'SELECT',
            options: data.valType,
          }, {
            prop: 'val',
            label: '值',
            placeholder: '请输入值',
            type: 'INPUT',
            source: [{
              sourceProp: 'valType',
              inputType: 'DATE',
              sourceValue: 'date',
            }, {
              sourceProp: 'valType',
              inputType: 'NUMBER',
              sourceValue: 'int',
              rules: [{
                validator: (rule, value, callback) => {
                  let val = Number(value)
                  setTimeout(() => {
                    if (!Number.isInteger(val)) {
                      callback(new Error('请输入整数'));
                    } else {
                      callback();
                    }
                  });
                }, trigger: 'blur',
              }]
            }, {
              sourceProp: 'valType',
              inputType: 'NUMBER',
              sourceValue: 'float',
              rules: [{
                validator: (rule, value, callback) => {
                  let val = Number(value)
                  setTimeout(() => {
                    if (isNaN(val)) {
                      console.log('请输入数字')
                      callback(new Error('请输入数字'));
                    } else {
                      callback();
                    }
                  });
                }, trigger: 'blur',
              }]
            }]
          }],
          rules: {
            param: [{
              required: true, message: '请输入参数', trigger: 'blur',
            }],
            valType: [{
              required: true, message: '请选择值类型', trigger: 'change',
            }],
            val: [{
              required: true, message: '请输入值', trigger: 'blur',
            }],
          },
        },     
        outParams: {
          title: '出参:',
          formName: 'outParams',
          showType: 'FORM',
          head: [{
            prop: 'param',
            label: '参数',
            placeholder: '请输入参数',
            type: 'INPUT',
          }, {
            prop: 'valType',
            label: '值类型',
            placeholder: '请选择值类型',
            type: 'SELECT',
            options: data.valType,
          }, {
            prop: 'val',
            label: '值',
            placeholder: '请输入值',
            type: 'INPUT',
            source: [{
              sourceProp: 'valType',
              inputType: 'DATE',
              sourceValue: 'date',
            }, {
              sourceProp: 'valType',
              inputType: 'NUMBER',
              sourceValue: 'int',
              rules: [{
                validator: (rule, value, callback) => {
                  let val = Number(value)
                  setTimeout(() => {
                    if (!Number.isInteger(val)) {
                      callback(new Error('请输入整数'));
                    } else {
                      callback();
                    }
                  });
                }, trigger: 'blur',
              }]
            }, {
              sourceProp: 'valType',
              inputType: 'NUMBER',
              sourceValue: 'float',
              rules: [{
                validator: (rule, value, callback) => {
                  let val = Number(value)
                  setTimeout(() => {
                    if (isNaN(val)) {
                      console.log('请输入数字')
                      callback(new Error('请输入数字'));
                    } else {
                      callback();
                    }
                  });
                }, trigger: 'blur',
              }]
            }]
          }],
          rules: {
            param: [{
              required: true, message: '请输入参数', trigger: 'blur',
            }],
            valType: [{
              required: true, message: '请选择值类型', trigger: 'change',
            }],
            val: [{
              required: true, message: '请输入值', trigger: 'blur',
            }],
          },
        },     
        sql: {
          title: 'SQL类型:',
          formName: 'action',
          showType: 'TABLE',
          head: [{
            prop: 'setType',
            label: '配置类型',
            placeholder: '请选择配置类型',
            type: 'INPUT',
            formatter: (value) => {
              let t = {
                'SQL': '自定义SQL',
                'CONFIG': '配置',
              }
              return t[value] || value
            }
          }, {
            prop: 'sqlType',
            label: '执行类型',
            placeholder: '请选择执行类型',
            type: 'INPUT',
            formatter: (value) => {
              let t = {
                'INSERT': '新增',
                'DELETE': '删除',
                'UPDATE': '修改'
              }
              return t[value] || value
            }

          }],
          rules: {
            setType: [{
              required: true, message: '请输入参数键', trigger: 'blur',
            }],
            sqlType: [{
              required: true, message: '请输入参数值', trigger: 'blur',
            }],
          },
        },
        notify: {
          formName: 'notify',
          inline: false,
          title: '提醒',
          head: [{
            type: 'SELECT',
            placeholder: '请选择消息类型',
            label: '消息类型',
            prop: 'msgType',
            options: [{
              label: '邮件',
              value: 'EMAIL',
            },{
              label: '短信',
              value: 'SMS',
            },{
              label: '系统消息',
              value: 'MESSAGE',
            }],
            rules: [{required: true, message: '请选择消息类型', trigger: 'change'}]
          },{     
            type: 'INPUT',
            placeholder: '请输入接收类型',
            label: '接收类型',
            prop: 'receiveType',
            rules: [{required: true, message: '请输入接收类型', trigger: 'blur'}]
          },{     
            type: 'USERSELECTION',
            placeholder: '请选择接收用户',
            label: '接收用户',
            prop: 'receiveUser',
            choose: 'selection',
            rules: [{required: true, message: '请选择接收用户', trigger: 'change'}]
          },{     
            type: 'USERSELECTION',
            placeholder: '请选择发送人',
            label: '发送人',
            prop: 'sendUser',
            choose: 'radio',
            rules: [{required: true, message: '请选择发送人', trigger: 'change'}]
          },{     
            type: 'INPUT',
            placeholder: '请输入模板ID',
            label: '模板ID',
            prop: 'tempId',
            rules: [
              {required: false, message: '请输入模板ID', trigger: 'blur'},
              {validator: (rule, value, callback) => {
                let reg = /^[0-9]*$/
                let val = String(value)
                if(!val) {
                  callback()
                }else if(!val.match(reg)) {
                  callback(new Error('输入必须为数字'))
                }else {
                  callback()
                }
              }, trigger: 'blur'}
            ]
          }],
        }
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
      }
    },
    stepNum() {
      return this.formModel.length
    },
  },
  methods: {
    addStep() {
      this.$emit('add-step')
    },
    deleteStep(data) {
      let index = this.formModel.indexOf(data)
      if(index === -1) {
        return
      }
      this.formModel.splice(index, 1)
    },
    validate() {
      let formName = 'form'
      let promises = [];
      this.$refs.form.forEach((f, index) => {
        if(f.validate()) {
          promises.push(this.$refs.form[index].validate())
        }
      })
      let result = {}
      return Promise.all(promises).then((data) => {
        this.formModel.forEach((d, index) => {
          d.sort = index + 1
        })
        let result = {}
        result.stepList = data
        // console.log('stepList', result)
        return result
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
