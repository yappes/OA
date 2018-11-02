<template>
  <div>
    <group-form :formData='formData.am' v-model='formModel.am' ref='form_0'></group-form>
    <step-form :formData='formData.queryHeader' v-model='formModel.protocolHead' ref='form_1' class='margin-bottom'></step-form>
    <!-- <step-form :formData='formData.queryParams' v-model='formModel.requiredParameter' ref='form_2'></step-form> -->
    <!-- <pui-data-selection></pui-data-selection> -->
  </div>
</template>

<script>
import groupForm from './groupForm';
import stepForm from './stepForm';
import data  from  '../data/data';
import vmodel from '../mixin/v-model'
export default {
  mixins:[vmodel],
  components: {
    groupForm,
    stepForm,
  },
  data() {
    return {
      formData: {
        am: {
          formName: 'am',
          inline: false,
          title: 'RPC配置:',
          head: [{
            type: 'INPUT',
            placeholder: '请输入接口地址',
            label: '接口地址',
            prop: 'rpcUrl',
            rules: [{
              required: true, message: '请输入接口地址', trigger: 'blur',
            }],
          }, {     
            type: 'SELECT',
            placeholder: '请选择提交方式',
            label: '提交方式',
            prop: 'submitType',
            options: [{
              value: 'GET',
              label: 'GET',
            }, {
              value: 'POST',
              label: 'POST',
            }],
            rules: [{
              required: true, message: '请选择提交方式', trigger: 'change',
            }],
          }],
        },
        queryHeader: {
          title: '请求头:',
          formName: 'protocolHead',
          showType: 'FORM',
          head: [{
            prop: 'header',
            label: '请求头',
            placeholder: '请输入请求头',
            type: 'INPUT',
          }, {
            prop: 'val',
            label: '值',
            placeholder: '请输入值',
            type: 'INPUT',
          }],
          rules: {
            header: [{
              required: true, message: '请输入参数', trigger: 'blur',
            }],
            val: [{
              required: true, message: '请输入值', trigger: 'blur',
            }],
          },
        },
        queryParams: {
          title: '请求参数:',
          formName: 'requiredParameter',
          showType: 'FORM',
          head: [{
            prop: 'param',
            label: '参数',
            placeholder: '请输入参数',
            type: 'INPUT',
          }, 
          // {
          //   prop: 'valType',
          //   label: '值类型',
          //   placeholder: '请选择值类型',
          //   type: 'SELECT',
          //   options: data.valType,
          // }, 
          {
            prop: 'val',
            label: '值',
            placeholder: '请输入值',
            type: 'INPUT',
          }],
          rules: {
            param: [{
              required: true, message: '请输入参数', trigger: 'blur',
            }],
            // valType: [{
            //   required: true, message: '请选择值类型', trigger: 'change',
            // }],
            val: [{
              required: true, message: '请输入值', trigger: 'blur',
            }],
          },
        }
      }
    }
  },
  methods: {
    validate() {
      // let formName = ['form_0', 'form_1', 'form_2']
      let formName = ['form_0', 'form_1']
      // let formName = 'form'
      let promises = [];
      formName.forEach(fn => {
        if(this.$refs[fn]) {
          promises.push(this.$refs[fn].validate());
        }
      })
      let result = {}
      return Promise.all(promises).then(data => {
        data.forEach((d, index) => {
          if(d) {
            Object.assign(result, d)
          }
        })
        console.log({
          event: result
        })
        return {
          event: result
        }
      })
    }
  }  
}
</script>

<style lang="scss" scoped>
  .margin-bottom {
    margin-bottom: 20px;
  }
</style>


